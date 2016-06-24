# redux-act-reducer

[![build status](https://img.shields.io/travis/hahoocn/redux-act-reducer/master.svg?style=flat-square)](https://travis-ci.org/hahoocn/redux-act-reducer) [![npm version](https://img.shields.io/npm/v/redux-act-reducer.svg?style=flat-square)](https://www.npmjs.com/package/redux-act-reducer)

- Simple, Code neat
- Not FSA, Not be bound, Don't have 'payload' everywhere
- Support for creating async request action
- Using action's 'subType' to identify the Reducer with the same action 'type'
- Works with redux-thunk

## Install
```
npm install redux-act-reducer --save
```

## Usage
### createAction
```javascript
import { createAction } from 'redux-act-reducer';

export const SHOW_HELLO = 'SHOW_HELLO';
export const showHello = createAction(SHOW_HELLO, 'info');
```
```javascript
dispatch(showHello('Hello World!'));

// action: { type: 'SHOW_HELLO', info: 'Hello World!' }
```
Or
```javascript
import { createAction } from 'redux-act-reducer';

export const SHOW_HELLO = 'SHOW_HELLO';
export const showHello = createAction(SHOW_HELLO);
```
```javascript
dispatch(showHello({info: 'Hello World!'}));

// action: { type: 'SHOW_HELLO', info: 'Hello World!' }
```

### createReducer
```javascript
import { createReducer } from 'redux-act-reducer';
import { SHOW_HELLO, SHOW_HI } from '../your/actions/path';

const defaultState = {
  info: undefined
};

const hello = createReducer({
  [SHOW_HELLO](state, action) {
    return {
      info: action.info
    };
  },
  [SHOW_HI]() {
    return {
      info: 'hi'
    };
  },

  ......

}, defaultState);

export default hello;

```
```javascript
dispatch(showHello('Hello World!'));
// state: { hello: { info: 'Hello World!' }, ... }
```
reducer function's return
```javascript
return {
  info: 'hi'
};
```
Will automatically assign to a new state object
```javascript
return Object.assign({}, state, result);
```

### createActionAsync
works with redux-thunk
```javascript
import { createActionAsync } from 'redux-act-reducer';

export const SHOW_HELLO_ASYNC = 'SHOW_HELLO_ASYNC';
export const showHelloAsync = createActionAsync(SHOW_HELLO_ASYNC, api);
//api is a module that sends requests to a server.
// createActionAsync will create 3 action with subType: REQUEST, SUCCESS, FAILURE
```
```javascript
dispatch(showHelloAsync(arg1, arg2));
// will dispatch:
// dispatch({ type: 'SHOW_HELLO_ASYNC', subType: 'REQUEST' });
// if success: dispatch({ type: 'SHOW_HELLO_ASYNC', subType: 'SUCCESS', res, receivedAt: Date.now() });
// if error: dispatch({ type: 'SHOW_HELLO_ASYNC', subType: 'FAILURE', err });
// args will pass to api: api(arg1, arg2)
```
create reducer
```javascript
import { createReducer } from 'redux-act-reducer';
import { SHOW_HELLO_ASYNC, SHOW_HELLO, SHOW_HI } from '../your/actions/path';

const defaultState = {};
const hello = createReducer({
  [SHOW_HELLO_ASYNC](state, action) {
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
  [SHOW_HELLO](state, action) {
    return {
      info: action.info
    };
  },
  [SHOW_HI]() {
    return {
      info: 'hi'
    };
  },

  ......

}, defaultState);

export default hello;
```
