/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { expect } from 'chai';
import createReducer from '../src/createReducer';

describe('createReducer', () => {
  const TEST_ACTION = 'TEST_ACTION';

  const defaultState = {
    test: 0,
    foo: undefined,
  };

  const reducer = createReducer({
    [TEST_ACTION]() {
      return { test: 123 };
    },
  }, defaultState, { autoAssign: true });

  it('should return a function', () => {
    expect(reducer).to.be.a('function');
  });
  describe('function return state', () => {
    describe('action type not found', () => {
      const action = { type: 'NO_ACTION' };
      const stateObj = reducer(undefined, action);
      it('should return default state', () => {
        expect(stateObj).to.eql(defaultState);
      });
    });

    describe('handlers is not function', () => {
      const reducer2 = createReducer('123', defaultState);
      const action = { type: 'TEST_ACTION', foo: 'bar' };
      const stateObj = reducer2(undefined, action);
      it('should return default state', () => {
        expect(stateObj).to.eql(defaultState);
      });
    });

    describe('test value', () => {
      const action = { type: 'TEST_ACTION', foo: 'bar' };
      const stateObj = reducer(undefined, action);
      it('should equal to the value as expected', () => {
        expect(stateObj).to.eql({ test: 123, foo: undefined });
      });
    });

    describe('test value from action', () => {
      const reducer3 = createReducer({
        [TEST_ACTION](state, action) {
          return {
            test: 123,
            foo: action.foo
          };
        },
      }, defaultState);
      const action = { type: 'TEST_ACTION', foo: 'bar' };
      const stateObj = reducer3(undefined, action);
      it('should equal to the value as expected', () => {
        expect(stateObj).to.eql({ test: 123, foo: 'bar' });
      });
    });

    const reducer4 = createReducer({
      [TEST_ACTION](state, action) {
        return {
          'REQUEST'() {
            return {
              isFetching: true
            };
          },
          'SUCCESS'() {
            return {
              isFetching: false,
              res: action.res
            };
          },
          'FAILURE'() {
            return {
              isFetching: false,
              err: action.err
            };
          }
        };
      },
    }, defaultState, { autoAssign: true });

    const reducer5 = createReducer({
      [TEST_ACTION](state, action) {
        return {
          res: action.res
        };
      },
    }, defaultState, { autoAssign: true });

    describe('with subType action (async)', () => {
      it('"REQUEST" subtype should equal to the value as expected', () => {
        const action = {
          type: 'TEST_ACTION',
          subType: 'REQUEST',
          async: { isAsync: true, name: 'TEST_ASYNC' }
        };
        const stateObj = reducer4({}, action);
        expect(stateObj).to.eql({ isFetching: true });
      });
      it('(autogeneration) "REQUEST" subtype should equal to the value as expected', () => {
        const action = {
          type: 'TEST_ACTION',
          subType: 'REQUEST',
          async: { isAsync: true, name: 'TEST_ASYNC' }
        };
        const stateObj = reducer5({}, action);
        expect(stateObj).to.eql({
          asyncStatus: {
            TEST_ASYNC: {
              isFetching: true,
              err: undefined
            }
          }
        });
      });
      it('"SUCCESS" subtype should equal to the value as expected', () => {
        const action = {
          type: 'TEST_ACTION',
          subType: 'SUCCESS',
          res: { info: 'hello', name: 'world!' },
          receivedAt: Date.now()
        };
        const stateObj = reducer4({}, action);
        expect(stateObj).to.eql({ isFetching: false, res: { info: 'hello', name: 'world!' } });
      });
      it('(autogeneration) "SUCCESS" subtype should equal to the value as expected', () => {
        const action = {
          type: 'TEST_ACTION',
          subType: 'SUCCESS',
          res: { info: 'hello', name: 'world!' },
          receivedAt: Date.now(),
          async: { isAsync: true, name: 'TEST_ASYNC' }
        };
        const stateObj = reducer5({}, action);
        expect(stateObj).to.eql({
          res: { info: 'hello', name: 'world!' }
        });
      });
      it('"FAILURE" subtype should equal to the value as expected', () => {
        const action = {
          type: 'TEST_ACTION',
          subType: 'FAILURE',
          err: 'error!'
        };
        const stateObj = reducer4({}, action);
        expect(stateObj).to.eql({ isFetching: false, err: 'error!' });
      });
      it('(autogeneration) "FAILURE" subtype should equal to the value as expected', () => {
        const action = {
          type: 'TEST_ACTION',
          subType: 'FAILURE',
          err: 'error!',
          async: { isAsync: true, name: 'TEST_ASYNC' }
        };
        const stateObj = reducer5({}, action);
        expect(stateObj).to.eql({
          asyncStatus: {
            TEST_ASYNC: {
              isFetching: false,
              err: 'error!'
            }
          }
        });
      });
    });
  });
});
