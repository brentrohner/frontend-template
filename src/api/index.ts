import { RequestActions } from 'src/redux/actions/utils/request';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { store } from 'src/redux';
import { api } from 'src/modules';
import { Api } from 'src/modules/api';
import { RootState, AllActions } from 'src/redux/reducers';
/**
 * Loosely typed request actions for when the exact
 * action types do not matter.
 */
type AnyRequestActions<Meta extends object, Response> = RequestActions<
  string,
  string,
  string,
  Meta,
  Response
>;

/**
 * Specialised thunk action that uses our store state
 * and a promise return type constrained to an API response.
 */
type ResponseThunk<Response> = ThunkAction<
  Promise<Response>,
  RootState,
  unknown,
  AnyAction
>;

/**
 * From the react docs about `useDispatch`:
 *   - For redux-thunk users: the return type of the returned
 *     dispatch functions for thunks is incorrect.
 *   - However, it is possible to get a correctly typed dispatch
 *     function by creating your own custom hook typed from the
 *     store's dispatch function like this:
 *     `const useThunkDispatch = () => useDispatch<typeof store.dispatch>();`
 */
const useThunkDispatch = (): ThunkDispatch<RootState, unknown, AllActions> =>
  useDispatch<typeof store.dispatch>();

/**
 * Implements the "request pattern" using the given `pending`,
 * `success` and `failure` actions.
 * - Dispatches `pending` action first
 * - Invokes `apiCall`
 * - On success, dispatches `success` with the api response
 * - On failure, dispatches `failure` with the error
 * @param actions Actions to dispatch.
 * @param apiCall Api call to invoke between pending and success/failure.
 * @returns Thunk action.
 */
export const request = <Meta extends object, Response>(
  actions: AnyRequestActions<Meta, Response>,
  apiCall: (meta: Meta) => Promise<Response>
): ResponseThunk<Response> => async (dispatch): Promise<Response> => {
  dispatch(actions.pending);
  try {
    const response = await apiCall(actions.pending.meta);
    dispatch(actions.success(response));
    return response;
  } catch (error) {
    dispatch(actions.failure(error));
    throw error;
  }
};

/**
 * Custom hook for consuming the unfinishedBiz API client while
 * automatically dispatching the appropriate redux requests
 * as part of the "request pattern".
 * @returns API client.
 */
export const useApi = (): Api => {
  const dispatch = useThunkDispatch();
  // Memoize so that components using this hook are not forced to re-render unnecessarily.
  // The returned reference need not change unless its own reference to dispatch does.
  // See https://reactjs.org/docs/hooks-reference.html#usememo
  return useMemo(
    () => ({}),

    [dispatch]
  );
};
