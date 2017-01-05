function createActionAsync(type, api, options) {
  return (...args) => async (dispatch) => {
    const defaultOpts = {
      name: type,
      isCreateRequest: true,
      isCreateSuccess: true,
      isCreateFailure: true,
      onRequest: undefined,
      onSuccess: undefined,
      onFailure: undefined
    };

    if (options && typeof options === 'object') {
      Object.assign(defaultOpts, options);
    }
    if (options && typeof options === 'string') {
      Object.assign(defaultOpts, { name: options });
    }

    const actionObj = {};

    if (defaultOpts.isCreateRequest) {
      actionObj.request = {
        type,
        subType: 'REQUEST',
        async: { isAsync: true, name: defaultOpts.name }
      };
      dispatch(actionObj.request);
    }
    if (defaultOpts.onRequest && typeof defaultOpts.onRequest === 'function') {
      defaultOpts.onRequest(dispatch);
    }

    try {
      const res = await api(...args, dispatch);
      if (defaultOpts.isCreateSuccess) {
        actionObj.success = {
          type,
          subType: 'SUCCESS',
          async: { isAsync: true, name: defaultOpts.name },
          res
        };
        dispatch(actionObj.success);
      }
      if (defaultOpts.onSuccess && typeof defaultOpts.onSuccess === 'function') {
        defaultOpts.onSuccess(dispatch, res);
      }
    } catch (err) {
      if (defaultOpts.isCreateFailure) {
        actionObj.failure = {
          type,
          subType: 'FAILURE',
          async: { isAsync: true, name: defaultOpts.name },
          err
        };
        dispatch(actionObj.failure);
      }
      if (defaultOpts.onFailure && typeof defaultOpts.onFailure === 'function') {
        defaultOpts.onFailure(dispatch, err);
      }

      return Promise.reject(actionObj);
    }

    return Promise.resolve(actionObj);
  };
}
export default createActionAsync;
