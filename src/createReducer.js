function createReducer(handlers, defaultState) {
  return (state = defaultState, action) => {
    if (action.type) {
      const handler = handlers[action.type];
      if (typeof handler === 'function') {
        const result = handler(state, action);
        return Object.assign({}, state, result);
      }
    }
    return state;
  };
}

export default createReducer;
