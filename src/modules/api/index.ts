import { pickValueForDeploymentEnv } from 'src/utils/env';
import { Http, Response } from './http';
import * as types from './responseTypes';

/**
 * API client interface
 */

export interface Api {}

type QueryParams = { [param: string]: string | number | (string | number)[] };

const baseUrl = pickValueForDeploymentEnv(
  '/api', // Use a relative url during dev/test or as a fallback
  //TODO: add our url
  'https://staging.BlaBla.com/api/',
  'https://BlaBls.com/api/'
);

/**
 * Build a url using the given path and optional query parameters.
 * @param path Path to append to the base url.
 * @param params Optional query parameters to encode.
 * @returns Full url with the base prefix and any query parameters encoded.
 */
export function url(path: string, params: QueryParams = {}): string {
  const queryString = Object.entries(params)
    .flatMap(([k, v]) => {
      return Array.isArray(v)
        ? v.map((vi) => `${encodeURIComponent(k)}=${encodeURIComponent(vi)}`)
        : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
    })
    .join('&');

  return baseUrl + path + (queryString && `?${queryString}`);
}

/**
 * Create an API client.
 * @param http HTTP client.
 * @returns API client.
 */
export const createApi = (http: Http): Api => ({});
