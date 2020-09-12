import { combineReducers, Reducer } from 'redux';

const reducers = {};

/** Reducer of all actions for the root state. */
const rootReducer = combineReducers<typeof reducers>(reducers);

/** Helper to extract the actions that a reducer be applied to. */
type ExtractReducerActions<R> = R extends Reducer<infer S, infer X> ? X : never;

/** Union of all actions that can be reduced by the root reducer. */
export type AllActions = ExtractReducerActions<typeof rootReducer>;

/** Types the combined state of the redux store. */
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
