import { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

export const ACCESS_TOKEN_EXPIRES_IN = '15m';
export const REFRESH_TOKEN_EXPIRES_IN = '7d';

export const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === 'production';

export const AUTH_COOKIE_BASE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/',
};

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  ...AUTH_COOKIE_BASE_OPTIONS,
  maxAge: ACCESS_TOKEN_MAX_AGE_MS,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  ...AUTH_COOKIE_BASE_OPTIONS,
  maxAge: REFRESH_TOKEN_MAX_AGE_MS,
};
