function createActionAsync(type, api) {
  return (...args) => async (dispatch) => {
    const actionObj = {
      request: { type, subType: 'REQUEST' }
    };
    dispatch(actionObj.request);
    try {
      const res = await api(...args);
      actionObj.success = { type, subType: 'SUCCESS', res, receivedAt: Date.now() };
      dispatch(actionObj.success);
    } catch (err) {
      actionObj.failure = { type, subType: 'FAILURE', err };
      dispatch(actionObj.failure);
      return Promise.reject(actionObj);
    }

    return Promise.resolve(actionObj);
  };
}
export default createActionAsync;
