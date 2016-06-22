import { expect } from 'chai';
import createAction from '../src/createAction';

describe('createAction', () => {
  const TEST_ACTION = 'TEST_ACTION';
  const action = createAction(TEST_ACTION);
  const action2 = createAction(TEST_ACTION, 'argName1', 'argName2');
  it('should return an function', () => {
    expect(action).to.be.a('function');
    expect(action2).to.be.a('function');
  });
  describe('function return object', () => {
    const actionObj = action({ foo: 'bar' });
    const actionObj2 = action2('arg1', 'arg2');
    it('should return an object', () => {
      expect(actionObj).to.be.an('object');
      expect(actionObj2).to.be.an('object');
    });
    it('should contain "type" key', () => {
      expect(actionObj).to.include.keys('type');
      expect(actionObj2).to.include.keys('type');
    });
    it('should equal to test value', () => {
      expect(actionObj).to.eql({ type: 'TEST_ACTION', foo: 'bar' });
      expect(actionObj2).to.eql({ type: 'TEST_ACTION', argName1: 'arg1', argName2: 'arg2' });
    });
  });
});
