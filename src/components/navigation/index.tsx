import { getLocale, getTranslations } from "next-intl/server";

import type { MenuItem, UserLocale } from "@/lib/types";
import { getAuth } from "@/lib/providers/auth-provider";

import type { Parallels } from "./breadcrumbs";
import { Breadcrumbs } from "./breadcrumbs";
import { NavigationBar } from "./navigation-bar";

const MENU_ITEMS: (Omit<MenuItem, "title"> & {
  title: string | Record<UserLocale, string>;
})[] = [
  {
    id: 3,
    url: "/most-popular",
    title: {
      en: "Most Popular",
      pl: "Najpopularniejsze",
    },
  },
  {
    id: 4,
    url: "/search",
    title: {
      en: "Search TV Shows",
      pl: "Wyszukaj Serial",
    },
  },
];

export async function Navigation() {
  const t = await getTranslations();
  const { user } = await getAuth();
  const locale = await getLocale();
  const parallels = [
    null,
    [
      { label: t("liveSeries.home.title"), slug: "" },
      { label: t("liveSeries.mostPopular.title"), slug: "most-popular" },
      { label: t("liveSeries.search.label"), slug: "search" },
      ...(user
        ? [{ label: t("profile.title"), slug: "profile" }]
        : [
            { label: t("profile.formDetails.login"), slug: "login" },
            { label: t("profile.formDetails.signup"), slug: "signup" },
          ]),
    ],
  ] satisfies Parallels;

  return (
    <>
      <NavigationBar
        user={user}
        menuItems={MENU_ITEMS.map((item) => ({
          ...item,
          title:
            typeof item.title === "string"
              ? item.title
              : item.title[locale as UserLocale],
        }))}
      />
      <Breadcrumbs parallels={parallels} />
    </>
  );
}
