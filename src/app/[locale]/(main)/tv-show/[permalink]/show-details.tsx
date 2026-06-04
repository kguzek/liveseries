"use client";

import type { ReactNode } from "react";
import type { Episode as TvMazeEpisode, Show as TvMazeShow } from "tvmaze-wrapper-ts";
import Image from "next/image";
import { useOptimistic, useState, useTransition } from "react";
import { Glow } from "@codaworks/react-glow";
import {
  CalendarIcon,
  Clock,
  HeartIcon,
  Monitor,
  StarIcon,
  TriangleAlert,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import type { Numeric } from "@/lib/types";
import type { User } from "@/payload-types";
import { showErrorToast } from "@/components/error/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  getUserShows,
  updateUserShowLike,
  updateUserShowSubscription,
} from "@/lib/backend/liveseries";
import { useLiveSeriesContext } from "@/lib/context/liveseries-context";
import { TvShowContext } from "@/lib/context/tv-show-context";
import { useRouter } from "@/lib/hooks/router";
import { getEpisodeAirDate, isInvalidDate } from "@/lib/util";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/badge";

/** Will issue a warning when trying to subscribe with more than 10 unwatched episodes. */
const UNWATCHED_EPISODES_THRESHOLD = 10;

export function ShowDetails({
  tvShow,
  episodes,
  user,
  children,
}: {
  tvShow: TvMazeShow;
  episodes: TvMazeEpisode[];
  user: User | null;
  children: ReactNode;
}) {
  const [isUpdating, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(
    (user != null && getUserShows(user).includes(tvShow.id)) ?? false,
  );
  const [isLikedOptimistic, setIsLikedOptimistic] = useOptimistic(isLiked);
  const [isSubscribed, setIsSubscribed] = useState(
    (user != null && user.userShows?.subscribed?.includes(tvShow.id)) ?? false,
  );
  const [isSubscribedOptimistic, setIsSubscribedOptimistic] = useOptimistic(isSubscribed);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const { watchedEpisodes, updateUserWatchedEpisodes } = useLiveSeriesContext();
  const watchedInShow = watchedEpisodes?.[tvShow.id] ?? {};
  const formatter = useFormatter();

  function formatDate(which: "start" | "end") {
    const latestEpisode = episodes?.at(-1);
    if (which === "end") {
      if (!latestEpisode) {
        return t(
          `liveSeries.tvShow.${tvShow?.status === "Running" ? "present" : "unknown"}`,
        );
      }
      const latestEpisodeAirDate = getEpisodeAirDate(latestEpisode);
      if (latestEpisodeAirDate > new Date()) return t("liveSeries.tvShow.present");
      return formatter.dateTime(latestEpisodeAirDate, "dateShort");
    }
    const dateString = tvShow?.premiered;
    if (!dateString) {
      return t("liveSeries.tvShow.unknown");
    }
    const date = new Date(dateString);
    if (isInvalidDate(date)) return dateString;
    return formatter.dateTime(date, "dateShort");
  }

  function promptLogin() {
    showErrorToast(t("liveSeries.home.login"));
  }

  function handleLike() {
    if (user == null) {
      promptLogin();
      return;
    }
    const newValue = !isLikedOptimistic;
    startTransition(async () => {
      setIsLikedOptimistic(newValue);
      if (await updateUserShowLike(user, t("networkError"), tvShow.id, newValue)) {
        setIsLiked(newValue);
      }
    });
  }

  async function handleSubscribe() {
    setIsSubscribeModalOpen(false);
    if (user == null) {
      showErrorToast(t("unknownError"));
      console.error("User is null in ShowDetails handleSubscribe");
      return;
    }
    const newValue = !isSubscribedOptimistic;
    startTransition(async () => {
      setIsSubscribedOptimistic(newValue);
      if (
        await updateUserShowSubscription(user, t("networkError"), tvShow.id, newValue)
      ) {
        setIsSubscribed(newValue);
      }
    });
  }

  function updateWatchedEpisodes(season: Numeric, episodes: TvMazeEpisode[]) {
    if (user == null) {
      promptLogin();
      return;
    }
    return updateUserWatchedEpisodes(
      tvShow.id,
      season,
      episodes.map((episode) => episode.number),
    );
  }

  const isSeasonWatched = (season: Numeric, episodes: TvMazeEpisode[]) =>
    watchedInShow[+season]?.length === episodes.length;

  const totalEpisodes = episodes?.length ?? 0;
  const watchedEpisodesCount = Object.values(watchedInShow).reduce(
    (acc, episodes) => acc + episodes.length,
    0,
  );
  const unwatchedEpisodesCount = totalEpisodes - watchedEpisodesCount;

  const runtime = tvShow.runtime ?? tvShow.averageRuntime;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-3">
        <Glow className="grid place-items-center">
          <button
            className={cn("glow:text-error text-3xl transition-colors", {
              "text-error": isLikedOptimistic,
            })}
            title={t(`liveSeries.tvShow.${isLikedOptimistic ? "unlike" : "like"}`)}
            disabled={isUpdating}
            onClick={handleLike}
          >
            <HeartIcon fill={isLikedOptimistic ? "currentColor" : "none"} />
          </button>
        </Glow>
        <h2 className="text-accent-soft text-2xl font-bold">{tvShow.name}</h2>
        <small className="flex items-center gap-1 text-xl">
          <CalendarIcon className="size-4" />
          {formatDate("start")}&ndash;{formatDate("end")}
        </small>
      </div>
      <div className="my-1 flex flex-wrap items-center gap-3">
        {tvShow.genres.length > 0 && (
          <div className="flex items-center gap-2">
            {tvShow.genres.map((genre, idx) => (
              <Badge key={`genre-${genre}-${idx}`}>{genre}</Badge>
            ))}
          </div>
        )}
        {tvShow.rating?.average ? (
          <div className="flex items-center gap-2">
            <span title={`${(+tvShow.rating.average).toFixed(1)}/10`}>
              <StarIcon className="text-accent2 inline size-5" fill="currentColor" />
            </span>
            <span className="font-bold">{tvShow.rating.average}</span>
          </div>
        ) : null}
      </div>
      <p className="mt-2 flex items-center gap-3 text-lg">
        {tvShow.network ? (
          <span className="flex items-center gap-1.5">
            <Monitor className="size-4" />
            <i className="font-serif font-normal">{tvShow.network.name}</i> (
            {tvShow.network.country.code})
          </span>
        ) : null}
        {runtime ? (
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {runtime} min
          </span>
        ) : null}
      </p>
      {tvShow.summary ? (
        <label className="border-background-soft mt-1 mb-2 rounded-sm border-l-[5px] pl-2.5 text-sm sm:text-base md:text-lg">
          <input type="checkbox" className="peer hidden" />
          <blockquote
            className="line-clamp-6 cursor-s-resize peer-checked:line-clamp-none peer-checked:cursor-n-resize"
            dangerouslySetInnerHTML={{
              __html: tvShow.summary.replace(/(<br\s?>|\\n|\s)*$/, ""),
            }}
          />
        </label>
      ) : null}
      <small className="text-xs md:text-sm">
        {t("liveSeries.tvShow.source")}: {t("liveSeries.tvShow.unknown").toLowerCase()}
      </small>
      {tvShow.image?.original && (
        <Image
          src={tvShow.image?.original}
          alt={tvShow.name}
          width={300}
          height={600}
          className="mx-auto"
        />
      )}
      <h3 className="my-5 text-2xl font-bold">{t("liveSeries.tvShow.episodes")}</h3>
      <AlertDialog open={isSubscribeModalOpen}>
        <AlertDialogTrigger asChild className="self-start">
          <Button
            variant={isSubscribed ? "default" : "glow"}
            loading={isUpdating}
            className="min-w-20 text-xs sm:text-base"
            onClick={() => {
              if (user == null) {
                promptLogin();
                return;
              }
              if (user.serverUrl == null || user.serverUrl.length === 0) {
                showErrorToast(t("liveSeries.setup"), {
                  action: {
                    label: t("profile.title"),
                    onClick: () => {
                      router.push("/profile?focus=serverUrl");
                    },
                  },
                });
                return;
              }
              if (
                isSubscribedOptimistic ||
                unwatchedEpisodesCount <= UNWATCHED_EPISODES_THRESHOLD
              ) {
                handleSubscribe();
                return;
              }
              setIsSubscribeModalOpen(true);
            }}
          >
            {isSubscribed
              ? t("liveSeries.tvShow.unsubscribe")
              : t("liveSeries.tvShow.subscribe")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("liveSeries.tvShow.confirmSubscribe")}</AlertDialogTitle>
            <AlertDialogDescription className="flex gap-2">
              <TriangleAlert className="text-accent2" size={18} />{" "}
              {t("liveSeries.tvShow.unwatchedEpisodes", {
                unwatched: unwatchedEpisodesCount,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              variant="outline"
              onClick={() => setIsSubscribeModalOpen(false)}
            >
              {t("modal.no")}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleSubscribe}>
              {t("modal.yes")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {totalEpisodes === 0 ? <p>{t("liveSeries.tvShow.noEpisodes")}</p> : null}
      <TvShowContext.Provider
        value={{ updateWatchedEpisodes, isSeasonWatched, isUpdating }}
      >
        {children}
      </TvShowContext.Provider>
    </div>
  );
}
