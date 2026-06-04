import type { NextRequest, NextResponse } from "next/server";

import type { LOCALES } from "./constants";
import type { DownloadStatus } from "./enums";

export type UserLocale = (typeof LOCALES)[number];

// #region API Responses

export type ApiMessage = { message?: string };

type ErrorResponseSingle = ApiMessage & {
  type?: string;
  data?: { id?: string } & (ErrorResponseMultiple | undefined);
};
export type ErrorResponseMultiple = { errors: ErrorResponseSingle[] };
export type ErrorResponseBodyPayloadCms = ErrorResponseSingle | ErrorResponseMultiple;

export type ErrorResponseBody = ErrorResponseBodyPayloadCms;

// #endregion

// #region LiveSeries

export type DownloadStatusType = (typeof DownloadStatus)[keyof typeof DownloadStatus];

export interface DownloadedEpisode {
  status: DownloadStatusType;
  showName: string;
  season: number;
  episode: number;
  progress?: number;
  speed?: number;
  eta?: number;
}

// #endregion

// #region Middleware

export type CustomMiddleware<T extends Array<unknown> = Array<never>> = (
  req: NextRequest,
  ...args: T
) => NextResponse | Promise<NextResponse>;

export type MiddlewareFactory<T extends Array<unknown> = Array<never>> = (
  middleware: CustomMiddleware<T>,
) => CustomMiddleware<T>;

// #endregion

export type Numeric = number | `${number}`;

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  label?: string;
  isAbsolute?: boolean;
  variant?: "link" | "button";
}

export interface EmailRecipientManual {
  type: "manual";
  name?: string | null;
  email: string;
}

export interface EmailRecipientUser {
  type: "user";
  user: string;
}

export type EmailRecipient = EmailRecipientManual | EmailRecipientUser;
