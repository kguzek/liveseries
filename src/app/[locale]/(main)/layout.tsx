import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { DownloadsWidget } from "@/components/liveseries/downloads-widget";
import { OG_IMAGE_METADATA } from "@/lib/constants";
import { LiveSeriesProvider } from "@/lib/context/liveseries-context";
import { getAuth } from "@/lib/providers/auth-provider";
import { getTitle, PAGE_NAME } from "@/lib/util";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: {
      template: `${getTitle("%s", t("liveSeries.title"))} | ${PAGE_NAME}`,
      default: "LiveSeries",
    },
    description: t("liveSeries.description"),
    openGraph: {
      images: {
        url: "/api/og-image/liveseries/most-popular/1",
        ...OG_IMAGE_METADATA,
      },
    },
  };
}

export default async function LiveSeriesLayout({ children }: { children: ReactNode }) {
  const { user, accessToken } = await getAuth();
  return (
    <div className="text mx-auto w-full max-w-7xl">
      <LiveSeriesProvider user={user} accessToken={accessToken}>
        {accessToken && user && <DownloadsWidget user={user} accessToken={accessToken} />}
        {children}
      </LiveSeriesProvider>
    </div>
  );
}
