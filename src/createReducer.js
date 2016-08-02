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
            const obj = {};
            obj[action.async.name] = {
              isFetching: true,
              err: undefined
            };
            return Object.assign({}, state, {
              asyncStatus: Object.assign({}, state.asyncStatus, { ...obj })
            });
          }
          if (action.subType === 'FAILURE' && !handler.toString().includes('function FAILURE()')) {
            const obj = {};
            obj[action.async.name] = {
              isFetching: false,
              err: action.err
            };
            return Object.assign({}, state, {
              asyncStatus: Object.assign({}, state.asyncStatus, { ...obj })
            });
          }
        }

        const subHandlers = handler(state, action);
        const subHandler = subHandlers[action.subType];
        if (action.async && action.async.isAsync && action.subType === 'SUCCESS') {
          const obj = {};
          obj[action.async.name] = {
            isFetching: false,
            err: undefined
          };
          let newState;
          if (typeof subHandler === 'function') {
            newState = Object.assign({}, state, {
              asyncStatus: Object.assign({}, state.asyncStatus, { ...obj }),
              ...subHandler(state, action)
            });
          } else {
            newState = Object.assign({}, state, {
              asyncStatus: Object.assign({}, state.asyncStatus, { ...obj }),
              ...subHandlers
            });
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
