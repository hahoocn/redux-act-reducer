function createReducer(handlers, defaultState, options) {
  const opts = {
    autoAssign: false
  };
  if (options) {
    Object.assign(opts, options);
  }
  return (state = defaultState, action) => {
    if (action.type) {
      const handler = handlers[action.type];
      if (typeof handler === 'function') {
        if (!action.subType) {
          if (opts.autoAssign) {
            return Object.assign({}, state, handler(state, action));
          }
          return handler(state, action);
        }

        if (opts.autoAssign && action.async && action.async.isAsync) {
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
        if (opts.autoAssign && action.async && action.async.isAsync && action.subType === 'SUCCESS') {
          const obj = {};
          if (state.asyncStatus && state.asyncStatus[action.async.name]) {
            obj[action.async.name] = {
              isFetching: false,
              err: undefined
            };
          }
          let newState;
          if (typeof subHandler === 'function') {
            if (state.asyncStatus && state.asyncStatus[action.async.name]) {
              newState = Object.assign({}, state, {
                asyncStatus: Object.assign({}, state.asyncStatus, { ...obj }),
                ...subHandler(state, action)
              });
            } else {
              newState = Object.assign({}, state, { ...subHandler(state, action) });
            }
          } else if (state.asyncStatus && state.asyncStatus[action.async.name]) {
            newState = Object.assign({}, state, {
              asyncStatus: Object.assign({}, state.asyncStatus, { ...obj }),
              ...subHandlers
            });
          } else {
            newState = Object.assign({}, state, { ...subHandlers });
          }

          return newState;
        }

        if (typeof subHandler === 'function') {
          if (opts.autoAssign) {
            return Object.assign({}, state, subHandler(state, action));
          }
          return subHandler(state, action);
        }
      }
    }
    return state;
  };
}

export default createReducer;
