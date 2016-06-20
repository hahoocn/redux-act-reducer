function createAction(type) {
  return (data) => {
    const action = Object.assign(data, { type });
    return action;
  };
}

export default createAction;
