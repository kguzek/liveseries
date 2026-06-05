import { headers } from "next/headers";

import type { MiddlewareFactory } from "@/lib/types";
import { WEBSITE_HOST } from "@/lib/constants";

import { getMiddlewareLocation } from "./util";

export const redirectMiddleware: MiddlewareFactory = (next) =>
  async function (request) {
    const { redirect, pathname } = getMiddlewareLocation(request);

    const requestHeaders = await headers();
    const host = requestHeaders.get("host") ?? "";
    if (["guzek.uk", "konrad.s.solvro.pl"].includes(host)) {
      return redirect(pathname, { absolute: true });
    }
    if (
      host === WEBSITE_HOST &&
      request.nextUrl.protocol === "http:" &&
      process.env.NODE_ENV !== "development"
    ) {
      return redirect(pathname, { absolute: true });
    }

    const search = request.nextUrl.searchParams.get("search");
    if (pathname === "/search" && search != null) {
      return redirect(`/search/${search}/1`, { includeSearch: false });
    }
    return next(request);
  };
