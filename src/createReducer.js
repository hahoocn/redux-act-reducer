function createReducer(handlers, defaultState) {
  return (state = defaultState, action) => {
    if (action.type) {
      const handler = handlers[action.type];
      if (typeof handler === 'function') {
        if (!action.subType) {
          return Object.assign({}, state, handler(state, action));
        }

        if (action.async && action.async.isAsync) {
          if (action.subType === 'REQUEST' && !handler.toString().includes('function REQUEST()')) {
            const newState = state;
            if (!newState.asyncStatus) {
              newState.asyncStatus = {};
            }
            if (!newState.asyncStatus[action.async.name]) {
              newState.asyncStatus[action.async.name] = {};
            }
            newState.asyncStatus[action.async.name].isFetching = true;
            newState.asyncStatus[action.async.name].err = undefined;
            return Object.assign({}, newState);
          }
          if (action.subType === 'FAILURE' && !handler.toString().includes('function FAILURE()')) {
            const newState = state;
            if (!newState.asyncStatus) {
              newState.asyncStatus = {};
            }
            if (!newState.asyncStatus[action.async.name]) {
              newState.asyncStatus[action.async.name] = {};
            }
            newState.asyncStatus[action.async.name].isFetching = false;
            newState.asyncStatus[action.async.name].err = action.err;
            return Object.assign({}, newState);
          }
        }

        const subHandlers = handler(state, action);
        const subHandler = subHandlers[action.subType];
        if (action.async && action.async.isAsync && action.subType === 'SUCCESS') {
          let newState = undefined;
          if (typeof subHandler === 'function') {
            newState = Object.assign({}, state, subHandler(state, action));
          } else {
            newState = Object.assign({}, state, subHandlers);
          }

          if (!subHandlers.REQUEST || !subHandlers.FAILURE) {
            if (!newState.asyncStatus) {
              newState.asyncStatus = {};
            }
            if (!newState.asyncStatus[action.async.name]) {
              newState.asyncStatus[action.async.name] = {};
            }
            newState.asyncStatus[action.async.name].isFetching = false;
            newState.asyncStatus[action.async.name].err = undefined;
            newState = Object.assign({}, newState);
          }

          return newState;
        }

        if (typeof subHandler === 'function') {
          return Object.assign({}, state, subHandler(state, action));
        }
      }
    }
    return state;
  };
}

export default createReducer;
