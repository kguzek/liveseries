import type { Metadata } from "next";
import type { Show as TvMazeShow } from "tvmaze-wrapper-ts";
import { getLocale, getTranslations } from "next-intl/server";
import { searchShows } from "tvmaze-wrapper-ts";

import { ErrorComponent } from "@/components/error/component";
import { TvShowPreviewList } from "@/components/liveseries/tv-show-preview-list";
import { getFormatters } from "@/i18n/request";
import { ErrorCode } from "@/lib/enums";
import { isNumber } from "@/lib/util";

import { SearchForm } from "../../form";

interface SearchProps {
  params: Promise<{ query: string; page: string }>;
}

export async function generateMetadata({ params }: SearchProps): Promise<Metadata> {
  const t = await getTranslations();
  const locale = await getLocale();
  const formatters = getFormatters(locale);
  const { query, page } = await params;

  const title = query
    ? `${t("liveSeries.search.results")} ${formatters.quote(decodeURIComponent(query))} (${t("liveSeries.tvShowList.page")} ${page})`
    : t("liveSeries.search.title");

  return {
    title,
  } satisfies Metadata;
}

async function SearchResults({ query, page }: { query: string; page: `${number}` }) {
  const t = await getTranslations();
  const locale = await getLocale();
  const formatters = getFormatters(locale);

  const decodedQuery = decodeURIComponent(query);

  let tvShows: TvMazeShow[] = [];
  try {
    const results = await searchShows(decodedQuery);
    tvShows = results.map((result) => result.show);
  } catch (error) {
    console.error("Error fetching search results:", error);
  }

  return (
    <>
      <h3 className="my-5 text-2xl font-bold">
        {t("liveSeries.search.results")} {formatters.quote(decodedQuery)}
      </h3>
      <TvShowPreviewList tvShows={tvShows} page={+page} total={1} />
    </>
  );
}

export default async function Search({ params }: SearchProps) {
  const t = await getTranslations();
  const { query, page } = await params;
  if (!isNumber(page)) {
    return <ErrorComponent errorCode={ErrorCode.NotFound} />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="mx-auto w-full max-w-2xl py-6">
        <h2 className="mb-4 text-2xl font-bold">{t("liveSeries.search.label")}</h2>
        <SearchForm />
      </div>
      <SearchResults query={query} page={page} />
    </div>
  );
}
