import { createLogger } from 'redux-logger';
import { AllActions, RootState } from './reducers';

export default createLogger({
  actionTransformer(action: AllActions): AllActions {
    switch (action.type) {
      default:
        return action;
    }
  },

  stateTransformer(state: RootState) {
    return {
      ...state,
    };
  },
});
