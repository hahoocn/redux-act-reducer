function createActionAsync(type, api, name) {
  return (...args) => async (dispatch) => {
    let asyncName = name;
    if (!asyncName) {
      asyncName = type;
    }
    const actionObj = {
      request: { type, subType: 'REQUEST', async: { isAsync: true, name: asyncName } }
    };
    dispatch(actionObj.request);
    try {
      const res = await api(...args);
      actionObj.success = {
        type,
        subType: 'SUCCESS',
        async: { isAsync: true, name: asyncName },
        res,
        receivedAt: Date.now()
      };
      dispatch(actionObj.success);
    } catch (err) {
      actionObj.failure = { type,
        subType: 'FAILURE',
        err,
        async: { isAsync: true, name: asyncName }
      };
      dispatch(actionObj.failure);
      return Promise.reject(actionObj);
    }

    return Promise.resolve(actionObj);
  };
}
export default createActionAsync;
