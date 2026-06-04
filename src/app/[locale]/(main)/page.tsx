import type { Metadata } from "next";
import type { Episode as TvMazeEpisode, Show as TvMazeShow } from "tvmaze-wrapper-ts";
import {
  ArrowRight,
  Github,
  Heart,
  LayoutDashboard,
  Search,
  Server,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { findShowById, getShowEpisodes } from "tvmaze-wrapper-ts";

import type { EpisodeArray } from "@/payload-types";
import { ErrorComponent } from "@/components/error/component";
import { AppLink } from "@/components/link/app-link";
import { ClientLink } from "@/components/link/client";
import { CopyButton } from "@/components/liveseries/copy-button";
import { EpisodesList } from "@/components/liveseries/episodes-list";
import { LikedShowsCarousel } from "@/components/liveseries/liked-shows-carousel";
import { TextWrapper } from "@/components/text-wrapper";
import { Tile } from "@/components/tile";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getUserShows } from "@/lib/backend/liveseries";
import { LIVESERIES_SERVER_HOMEPAGE, OG_IMAGE_METADATA } from "@/lib/constants";
import { ErrorCode } from "@/lib/enums";
import { getAuth } from "@/lib/providers/auth-provider";
import { hasEpisodeAired } from "@/lib/util";

const CRON_UUID = "c17cc350-9be9-453a-ba16-208c5b9be1fe";

type ShowWithEpisodes = TvMazeShow & { episodes: TvMazeEpisode[] };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: {
      absolute: `${t("liveSeries.seoTitle")} | Konrad Guzek`,
    },
    openGraph: {
      images: {
        url: "/api/og-image/liveseries/most-popular/1",
        ...OG_IMAGE_METADATA,
      },
    },
  };
}

export default async function LiveSeriesLandingPage() {
  const t = await getTranslations();
  const { user } = await getAuth();

  if (user != null) {
    return <DashboardView user={user} />;
  }

  return (
    <TextWrapper style={{ maxWidth: "none" }} className="mt-8">
      <div className="flex w-full flex-col gap-10">
        <section className="text-center">
          <p className="text-accent mb-3 font-serif text-lg font-bold">
            {t("liveSeries.landing.eyebrow")}
          </p>
          <h1 className="text-primary-strong text-4xl font-bold text-balance sm:text-6xl">
            {t("liveSeries.landing.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8">
            {t("liveSeries.landing.description")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <ClientLink href="/signup">
                <UserPlus /> {t("profile.formDetails.signup")}
              </ClientLink>
            </Button>
            <Button asChild variant="secondary">
              <AppLink href="/most-popular/1" icon={TrendingUp}>
                {t("liveSeries.mostPopular.title")}
              </AppLink>
            </Button>
            <Button asChild variant="outline">
              <a href={LIVESERIES_SERVER_HOMEPAGE} rel="noreferrer" target="_blank">
                <Github /> {t("liveSeries.landing.serverRepository")}
              </a>
            </Button>
          </div>
        </section>
        <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
          <a
            href={LIVESERIES_SERVER_HOMEPAGE}
            rel="noreferrer"
            target="_blank"
            className="group flex-1 overflow-hidden"
          >
            <Tile glow containerClassName="corner-fill h-full overflow-hidden">
              <Server className="text-accent mb-3 transition-transform duration-300 group-hover:scale-125" />
              <h2 className="mb-2 text-2xl font-bold">
                1. {t("liveSeries.landing.steps.server.title")}
              </h2>
              <p>{t("liveSeries.landing.steps.server.body")}</p>
              <span className="mt-3 flex items-center gap-2 text-lg font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {t("liveSeries.landing.steps.ctaServer")}{" "}
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Tile>
          </a>
          <Link href="/profile" className="group flex-1 overflow-hidden">
            <Tile glow containerClassName="corner-fill h-full overflow-hidden">
              <UserPlus className="text-accent mb-3 transition-transform duration-300 group-hover:scale-125" />
              <h2 className="mb-2 text-2xl font-bold">
                2. {t("liveSeries.landing.steps.account.title")}
              </h2>
              <p>{t("liveSeries.landing.steps.account.body")}</p>
              <span className="mt-3 flex items-center gap-2 text-lg font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {t("liveSeries.landing.steps.ctaAccount")}{" "}
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Tile>
          </Link>
          <Link href="/search" className="group flex-1 overflow-hidden">
            <Tile glow containerClassName="corner-fill h-full overflow-hidden">
              <Search className="text-accent mb-3 transition-transform duration-300 group-hover:scale-125" />
              <h2 className="mb-2 text-2xl font-bold">
                3. {t("liveSeries.landing.steps.watch.title")}
              </h2>
              <p>{t("liveSeries.landing.steps.watch.body")}</p>
              <span className="mt-3 flex items-center gap-2 text-lg font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {t("liveSeries.landing.steps.ctaSearch")}{" "}
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Tile>
          </Link>
        </div>
        <Tile glow>
          <h2 className="mb-2 text-2xl font-bold">
            {t("liveSeries.landing.cron.title")}
          </h2>
          <p>{t("liveSeries.landing.cron.body")}</p>
          <div className="bg-background-soft text-primary-strong mt-3 flex max-w-full items-center gap-2 rounded-[5px] px-1 py-0.5 text-xs select-all sm:inline-flex sm:text-base sm:whitespace-nowrap">
            <span className="min-w-0 font-mono break-all sm:break-normal">
              {CRON_UUID}
            </span>
            <CopyButton value={CRON_UUID} />
          </div>
        </Tile>
      </div>
    </TextWrapper>
  );
}

async function DashboardView({
  user,
}: {
  user: NonNullable<Awaited<ReturnType<typeof getAuth>>["user"]>;
}) {
  const t = await getTranslations();
  const watchedEpisodes = user?.watchedEpisodes ?? {};
  const likedShowIds: EpisodeArray = getUserShows(user);
  const likedShows: { [showId: number]: ShowWithEpisodes } = {};

  const unwatchedEpisodes: Record<number, TvMazeEpisode[]> = {};
  let totalUnwatchedEpisodes = 0;

  if (user != null) {
    let likedShowResponses: ShowWithEpisodes[] = [];
    try {
      likedShowResponses = await Promise.all(
        likedShowIds.map(async (id) => {
          const show = await findShowById(id);
          const episodes = await getShowEpisodes(id);
          return { ...show, episodes };
        }),
      );
    } catch (error) {
      console.error("LiveSeries fetch failed:", error);
      return <ErrorComponent errorCode={ErrorCode.ServerError} />;
    }

    for (const tvShow of likedShowResponses) {
      likedShows[tvShow.id] = tvShow;
      const unwatched = tvShow.episodes.filter(
        (episode) =>
          hasEpisodeAired(episode) &&
          !watchedEpisodes[tvShow.id]?.[episode.season]?.includes(episode.number),
      );
      unwatchedEpisodes[tvShow.id] = unwatched;
      totalUnwatchedEpisodes += unwatched.length;
    }
  }

  return (
    <TextWrapper style={{ maxWidth: "none" }}>
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="my-6 flex items-center gap-3 text-3xl font-bold">
            <LayoutDashboard className="text-accent size-8" />
            Dashboard
          </h2>
        </div>
        {likedShowIds.length === 0 ? (
          <Tile glow containerClassName="w-full" variant="vanilla">
            <div className="flex flex-col items-center gap-6 px-4 py-10 text-center">
              <div className="bg-accent/10 animate-[fadeIn_0.6s_ease-out] rounded-full p-4">
                <Heart className="text-accent size-10" />
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-bold">Your watchlist is empty</h3>
                <p className="text-primary mx-auto max-w-md text-base leading-relaxed">
                  {t("liveSeries.home.noLikes")}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <AppLink href="/most-popular/1" icon={TrendingUp}>
                  {t("liveSeries.mostPopular.title")}
                </AppLink>
                <AppLink href="/search" icon={Search}>
                  {t("liveSeries.search.label")}
                </AppLink>
              </div>
            </div>
          </Tile>
        ) : (
          <>
            <div className="mb-5 flex items-center gap-3">
              <h3 className="text-2xl font-bold">{t("liveSeries.home.likedShows")}</h3>
              <span className="bg-accent/20 text-accent rounded-full px-3 py-0.5 text-sm font-semibold tabular-nums">
                {likedShowIds.length}
              </span>
            </div>
            <LikedShowsCarousel likedShows={likedShows} user={user} />
          </>
        )}
        {user && (
          <>
            <h3 className="mt-4 text-2xl font-bold">
              {t("liveSeries.tvShow.unwatched")} {t("liveSeries.tvShow.episodes")}
            </h3>
            {totalUnwatchedEpisodes > 0 ? (
              <div className="w-full">
                {Object.entries(unwatchedEpisodes).map(
                  ([showId, unwatchedInShow], idx) =>
                    unwatchedInShow.length === 0 ? null : (
                      <EpisodesList
                        key={`liked-show-${showId}-${idx}`}
                        tvShow={likedShows[+showId]}
                        heading={`${likedShows[+showId].name} (${unwatchedInShow.length})`}
                        episodes={unwatchedInShow}
                      />
                    ),
                )}
              </div>
            ) : (
              <p className="mt-5">{t("liveSeries.home.noUnwatched")}</p>
            )}
          </>
        )}
      </div>
    </TextWrapper>
  );
}
