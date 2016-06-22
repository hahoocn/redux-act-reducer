function createAction(type, ...argNames) {
  if (argNames.length > 0) {
    return (...args) => {
      const action = {};
      argNames.forEach((arg, index) => {
        action[argNames[index]] = args[index];
      });
      action.type = type;
      return action;
    };
  }

  return (data) => {
    let action = undefined;
    if (data) {
      action = Object.assign(data, { type });
    } else {
      action = { type };
    }
    return action;
  };
}

export default createAction;
