import { store } from 'src/redux';
import { createApi } from './api';
import { createHttp } from './api/http';
export * from './href';

/**
 * Initialised HTTP client that retrieves the auth token
 * header value from the redux store.
 */
export const http = createHttp();

/**
 * Initialised API client.
 */
export const api = createApi(http);
