function createReducer(handlers, defaultState) {
  return (state = defaultState, action) => {
    if (action.type) {
      const handler = handlers[action.type];
      if (typeof handler === 'function') {
        if (action.subType) {
          const subHandlers = handler(state, action);
          const subHandler = subHandlers[action.subType];
          if (typeof subHandler === 'function') {
            const result = subHandler(state, action);
            return Object.assign({}, state, result);
          }
        } else {
          const result = handler(state, action);
          return Object.assign({}, state, result);
        }
      }
    }
    return state;
  };
}

export default createReducer;
