import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SearchForm } from "./form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("liveSeries.search.title"),
  };
}

export default async function SearchPageRedirect() {
  const t = await getTranslations();
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 py-10 text-center">
        <h1 className="text-4xl font-bold">{t("liveSeries.search.label")}</h1>
        <div className="w-full">
          <SearchForm />
        </div>
      </div>
    </div>
  );
}
