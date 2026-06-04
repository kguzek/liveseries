"use client";

import { Search, SearchX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";

import { ClientLink } from "@/components/link/client";
import { useRouter } from "@/lib/hooks/router";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/ui/form";
import { Input } from "@/ui/input";

export function SearchForm() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const form = useForm({ defaultValues: { search: "" } });

  const search = useWatch({
    control: form.control,
    name: "search",
  });

  const getSearchPath = (s: string) =>
    s === "" ? "" : `/search/${encodeURIComponent(s)}/1`;

  return (
    <Form {...form}>
      <form
        action={`/${locale}/search`}
        method="GET"
        className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end"
        onSubmit={form.handleSubmit((values) => {
          router.push(getSearchPath(values.search));
        })}
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  autoFocus
                  placeholder={t("liveSeries.search.prompt")}
                  className="h-10"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {search ? (
          <Button asChild className="h-10">
            <ClientLink href={getSearchPath(search)}>
              <Search className="size-4" /> {t("liveSeries.search.search")}
            </ClientLink>
          </Button>
        ) : (
          <Button disabled className="h-10">
            <SearchX className="size-4" /> {t("liveSeries.search.search")}
          </Button>
        )}
      </form>
    </Form>
  );
}
