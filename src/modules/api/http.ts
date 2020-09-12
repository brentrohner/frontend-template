/**
 * Thin HTTP wrapper that performs steps such as setting common headers
 * and hides the underlying request API from consumers.
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * HTTP headers.
 */
export type Headers = { [header: string]: string };

/**
 * HTTP response interface.
 */
export interface Response<T> {
  /** Response data. */
  data: T;
  /** Response headers. */
  headers: { [k: string]: string };
  /** Response status code. */
  status: number;
}

/** Header used to pass the auth token in a request. */
export const tokenHeader = 'X-Auth-Token';

/**
 * HTTP client interface.
 */
export interface Http {
  /**
   * Return the default headers that are added to every request.
   * @returns HTTP headers.
   */
  headers(): Headers;

  /**
   * Make an HTTP GET request to the given `url`.
   * @param url URL to send the request to.
   * @returns Promise containing the request response.
   */
  get<T>(url: string): Promise<Response<T>>;

  /**
   * Make an HTTP POST request to the given `url` with the given `body`.
   * @param url URL to send the request to.
   * @param body Optional POST request body.
   * @returns Promise containing the request response.
   */
  post<T, Body>(url: string, body?: Body): Promise<Response<T>>;

  /**
   * Make an HTTP DELETE request to the given `url`.
   * @param url URL to send the request to.
   * @returns Promise containing the request response.
   */
  delete<T>(url: string): Promise<Response<T>>;
}

/**
 * Create an HTTP client.
 * @param getToken Function returning an optional auth token.
 * @returns HTTP client.
 */
export const createHttp = (): Http => {
  const headers = (): Headers => {
    return {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json, text/plain, */*',
    };
  };

  const onAxiosError = (error: AxiosError): void => {
    if (error.response?.status === 401) {
      console.log('axios error');
    }
  };

  const config = (): AxiosRequestConfig => ({ headers: headers() });

  return {
    headers,

    async get<T>(url: string): Promise<Response<T>> {
      try {
        const res = await axios.get<T>(url, config());
        return res;
      } catch (e) {
        if (e.isAxiosError) {
          onAxiosError(e as AxiosError);
        }
        throw e;
      }
    },

    async post<T, Body>(url: string, body?: Body): Promise<Response<T>> {
      try {
        const res = await axios.post(url, body, config());
        return res;
      } catch (e) {
        if (e.isAxiosError) {
          onAxiosError(e as AxiosError);
        }
        throw e;
      }
    },

    async delete<T>(url: string): Promise<Response<T>> {
      const { data, status } = await axios.delete<T>(url, config());
      return { data, headers: {}, status };
    },
  };
};
