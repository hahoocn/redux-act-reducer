# redux-act-reducer

[![build status](https://img.shields.io/travis/hahoocn/redux-act-reducer/master.svg?style=flat-square)](https://travis-ci.org/hahoocn/redux-act-reducer) [![npm version](https://img.shields.io/npm/v/redux-act-reducer.svg?style=flat-square)](https://www.npmjs.com/package/redux-act-reducer)

- Simple, concise code
- Support for creating asynchronous action and reducer with simple code
- When asynchronous, the same 'type' is distinguished by 'subType'
- Works with redux-thunk

## Install
```
npm install redux-act-reducer --save
```

## Example
- [createAction](https://github.com/hahoocn/react-mobile-boilerplate/blob/master/src/actions/home.js)
- [dispatch](https://github.com/hahoocn/react-mobile-boilerplate/blob/master/src/containers/Home/Home.js)
- [createReducer](https://github.com/hahoocn/react-mobile-boilerplate/blob/master/src/reducers/home.js)

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
return Object.assign({}, state, {
  info: 'hi'
});
```

### createActionAsync
works with redux-thunk
```javascript
import { createActionAsync } from 'redux-act-reducer';

export const SHOW_HELLO_ASYNC = 'SHOW_HELLO_ASYNC';
export const showHelloAsync = createActionAsync(SHOW_HELLO_ASYNC, api, 'asyncName');
// api is a module that sends requests to a server.
// createActionAsync will create 3 action with subType: REQUEST, SUCCESS, FAILURE
// 'hello' is Asynchronous name
```
```javascript
dispatch(showHelloAsync(arg1, arg2));
// will dispatch:
// dispatch({ type: 'SHOW_HELLO_ASYNC', subType: 'REQUEST', ... });
// if success: dispatch({ type: 'SHOW_HELLO_ASYNC', subType: 'SUCCESS', res, receivedAt: Date.now(), ... });
// if error: dispatch({ type: 'SHOW_HELLO_ASYNC', subType: 'FAILURE', err, ... });
// args will pass to api: api(arg1, arg2)
```
##### Create Reducer
```javascript
import { createReducer } from 'redux-act-reducer';
import { SHOW_HELLO_ASYNC } from '../your/actions/path';

const defaultState = {};
const hello = createReducer({
  [SHOW_HELLO_ASYNC](state, action) {
    return {
      res: action.res
    };
  },
  // Default is SUCCESS code.
  // Will automatically generate REQUEST and FAILURE code, so that the code is simple.
  ......

}, defaultState);

export default hello;
```
Same as

```javascript
import { createReducer } from 'redux-act-reducer';
import { SHOW_HELLO_ASYNC } from '../your/actions/path';

const defaultState = {};
const hello = createReducer({
  [SHOW_HELLO_ASYNC](state, action) {
    return {
      'SUCCESS'() {
        return {
          res: action.res
        };
      }
    };
  },

  ......

}, defaultState);

export default hello;
```
Same as

```javascript
import { createReducer } from 'redux-act-reducer';
import { SHOW_HELLO_ASYNC } from '../your/actions/path';

const defaultState = {};
const hello = createReducer({
  [SHOW_HELLO_ASYNC](state, action) {
    return {
      'REQUEST'() {
        return {
          asyncStatus: {
            hello: {
              isFetching: true,
              err: undefined,
            }
          }
        };
      },
      'SUCCESS'() {
        return {
          asyncStatus: {
            hello: {
              isFetching: false,
              err: undefined,
            }
          },
          res: action.res
        };
      },
      'FAILURE'() {
        return {
          asyncStatus: {
            hello: {
              isFetching: false,
              err: action.err,
            }
          }
        };
      }
    };
  },

  ......

}, defaultState);

export default hello;
```
When the Reducer does not have the REQUEST and FAILURE functions, createReducer will automatically generate the reducer and update the state

The generated state looks like the following:
```javascript
state: {
  hello: {
    asyncStatus: {
      asyncName: {
        isFetching: true,
        err: undefined,
      }
    },
    ...
  },

  ...
}
```
If there is no name, then use type as the name
```javascript
state: {
  hello: {
    asyncStatus: {
      SHOW_HELLO_ASYNC: {
        isFetching: true,
        err: undefined,
      }
    },
    ...
  }

  ...
}
```
