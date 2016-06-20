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
  }, defaultState);

  it('should return an function', () => {
    expect(reducer).to.be.a('function');
  });
  describe('function return state', () => {
    describe('action type not found', () => {
      const action = { type: 'NO_ACTION' };
      const stateObj = reducer(undefined, action);
      it('should return an object', () => {
        expect(stateObj).to.be.an('object');
      });
      it('should equal to defaultState', () => {
        expect(stateObj).to.eql(defaultState);
      });
    });

    describe('handlers is not function', () => {
      const reducer2 = createReducer('123', defaultState);
      const action = { type: 'TEST_ACTION', foo: 'bar' };
      const stateObj = reducer2(undefined, action);
      it('should return an object', () => {
        expect(stateObj).to.be.an('object');
      });
      it('should equal to defaultState', () => {
        expect(stateObj).to.eql(defaultState);
      });
    });

    describe('test value', () => {
      const action = { type: 'TEST_ACTION', foo: 'bar' };
      const stateObj = reducer(undefined, action);
      it('should return an object', () => {
        expect(stateObj).to.be.an('object');
      });
      it('should equal to test value', () => {
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
      it('should return an object', () => {
        expect(stateObj).to.be.an('object');
      });
      it('should equal to test value', () => {
        expect(stateObj).to.eql({ test: 123, foo: 'bar' });
      });
    });
  });
});
