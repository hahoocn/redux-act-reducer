import { expect } from 'chai';
import createActionAsync from '../src/createActionAsync';

describe('createActionAsync', () => {
  const dispatch = () => {};
  const TEST_ASYNC = 'TEST_ASYNC';
  const api = (name) => {
    const resJson = { info: 'hello' };
    resJson.name = name;
    return resJson;
  };
  const errApi = () => Promise.reject('error!!');
  const action = createActionAsync(TEST_ASYNC, api);
  const errAction = createActionAsync(TEST_ASYNC, errApi);
  it('should return a function', () => {
    expect(action).to.be.a('function');
  });
  describe('action function', () => {
    it('should be a function', () => {
      expect(action()).to.be.a('function');
    });

    it('dispatch REQUEST action as expected', () => {
      const test = action()(dispatch).then((v) => {
        expect(v.request).to.eql({ type: 'TEST_ASYNC', subType: 'REQUEST' });
      });
      return test;
    });
    it('dispatch SUCCESS action as expected', () => {
      const test = action('world!')(dispatch).then((v) => {
        const success = v.success;
        success.receivedAt = undefined;
        expect(success).to.eql({
          type: 'TEST_ASYNC',
          subType: 'SUCCESS',
          res: { info: 'hello', name: 'world!' },
          receivedAt: undefined,
        });
      });
      return test;
    });
    it('dispatch FAILURE action as expected', () => {
      const test = errAction('world!')(dispatch).catch((v) => {
        expect(v.failure).to.eql({
          type: 'TEST_ASYNC',
          subType: 'FAILURE',
          err: 'error!!'
        });
      });
      return test;
    });
  });
});
