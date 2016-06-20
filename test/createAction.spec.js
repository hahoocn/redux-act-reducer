import { expect } from 'chai';
import createAction from '../src/createAction';

describe('createAction', () => {
  const TEST_ACTION = 'TEST_ACTION';
  const action = createAction(TEST_ACTION);
  it('should return an function', () => {
    expect(action).to.be.a('function');
  });
  describe('function return object', () => {
    const actionObj = action({ foo: 'bar' });
    it('should return an object', () => {
      expect(actionObj).to.be.an('object');
    });
    it('should contain "type" key', () => {
      expect(actionObj).to.include.keys('type');
    });
    it('should equal to test value', () => {
      expect(actionObj).to.eql({ type: 'TEST_ACTION', foo: 'bar' });
    });
  });
});
