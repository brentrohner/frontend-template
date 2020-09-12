import { applyMiddleware, createStore, Store as ReduxStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import logger from './logger';
import rootReducer, { RootState } from './reducers';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// istanbul ignore next (disables coverage)
const enhancers =
  process.env.NODE_ENV === 'development' // Do not log on prod or test
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk);

export const store = createStore(persistedReducer, enhancers);

// TODO: Replace ReduxStore<RootState, any> with ReduxStore<RootState, Actions>
// once https://github.com/rt2zz/redux-persist/pull/1085 is released
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const persistor = persistStore(store as ReduxStore<RootState, any>);
export type Store = typeof store;
