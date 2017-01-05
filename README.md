# redux-act-reducer

[![build status](https://img.shields.io/travis/hahoocn/redux-act-reducer/master.svg?style=flat-square)](https://travis-ci.org/hahoocn/redux-act-reducer) [![npm version](https://img.shields.io/npm/v/redux-act-reducer.svg?style=flat-square)](https://www.npmjs.com/package/redux-act-reducer)

- Simple, concise code
- Support for creating asynchronous action and reducer with simple code
- When asynchronous, the same 'type' is distinguished by 'subType'
- Works with redux-thunk

> Note: since version 2, createReducer no longer uses Object.assign to automatically merge state. If you want to continue to use, please set the createReducer option autoAssign to true

## Install
```
npm install redux-act-reducer --save
```

## Example
- [createAction](https://github.com/hahoocn/react-mobile-boilerplate/blob/master/src/containers/Home/actions.js)
- [dispatch](https://github.com/hahoocn/react-mobile-boilerplate/blob/master/src/containers/Home/index.js)
- [createReducer](https://github.com/hahoocn/react-mobile-boilerplate/blob/master/src/containers/Home/reducer.js)

## Usage
### createAction(type, [...args])
Action creator
```javascript
import { createAction } from 'redux-act-reducer';

export const SHOW_HELLO = 'SHOW_HELLO';
export const showHello = createAction(SHOW_HELLO, 'info');

export const SHOW_HI = 'SHOW_HI';
export const showHi = createAction(SHOW_HI, 'arg1', 'arg2')
```
```javascript
dispatch(showHello('Hello World!'));
// dispatch action: { type: 'SHOW_HELLO', info: 'Hello World!' }

dispatch(showHi('one', 'two'));
// dispatch action: { type: 'SHOW_HI', arg1: 'one', arg2: 'two' }
```
Or
```javascript
import { createAction } from 'redux-act-reducer';

export const SHOW_HELLO = 'SHOW_HELLO';
export const showHello = createAction(SHOW_HELLO);
```
```javascript
dispatch(showHello({info: 'Hello World!'}));

// dispatch action: { type: 'SHOW_HELLO', info: 'Hello World!' }
```

### createReducer(handlers, defaultState, options)
Generating Reducers

- `handlers`: reducer function object
- `defaultState`: default state
- `options`: 
  * `autoAssign` bool, `default false`. If true will automatically merge returned objects using `Object.assign`

```javascript
import { createReducer } from 'redux-act-reducer';
import { SHOW_HELLO, SHOW_HI } from '../your/actions/path';

const defaultState = {
  info: ''
};

const hello = createReducer({
  [SHOW_HELLO](state, action) {
    return Object.assign({}, state, { info: action.info });
  },
  [SHOW_HI](state, action) {
    return Object.assign({}, state, {
      arg1: action.arg1,
      arg2: action.arg2
    });
  },

  ......

}, defaultState);

export default hello;

```
```javascript
dispatch(showHello('Hello World!'));
// state: { hello: { info: 'Hello World!' }, ... }
```
#### If `autoAssign` option is true
```javascript
import { createReducer } from 'redux-act-reducer';
import { SHOW_HELLO } from '../your/actions/path';

const defaultState = {
  info: ''
};

const hello = createReducer({
  [SHOW_HELLO](state, action) {
    return {
      info: action.info
    };
  },

  ......

}, defaultState, { autoAssign: true });

export default hello;

```
```javascript
dispatch(showHello('Hello World!'));
// state: { hello: { info: 'Hello World!' }, ... }
```
Reducer function
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
#### Use Immutable.js

autoAssign option must be false. (default is false)

```javascript
import { fromJS } from 'immutable';
import { createReducer } from 'redux-act-reducer';
import { SHOW_HELLO } from '../your/actions/path';

const defaultState = fromJS({
  info: ''
});

const hello = createReducer({
  [SHOW_HELLO](state, action) {
    return state.set('info', action.info);
  },
  
  ......
  
}, defaultState);

export default hello;

```

## Async
### createActionAsync(type, api, options)
works with redux-thunk

- `type` action type
- `api` a module that sends requests to a server (Please return a promise)
- `options` (string or object. if it is a string, it is async name)
  * `name` async name (default: same as `type`)
  * `isCreateRequest` whether to create and dispatch REQUEST action automatically (default: true)
  * `isCreateSuccess` whether to create and dispatch SUCCESS action automatically (default: true)
  * `isCreateFailure` whether to create and dispatch FAILURE action automatically (default: true)
  * `onRequest` function after REQUEST: onRequest(dispatch)
  * `onSuccess` function after SUCCESS: onSuccess(dispatch, res)
  * `onFailure` function after FAILURE: onFailure(dispatch, err)

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

```javascript
export const switchFlag = createActionAsync(SWITCH_FLAG, switchFlagApi, {
  name: 'switchFlag',
  onRequest(dispatch) {
    dispatch(shouldUpdate(true));
  },
  onSuccess(dispatch, res) {
    dispatch(shouldUpdate(false));
  }
});
```

#### async `createReducer` with autoAssign option is true
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

}, defaultState, { autoAssign: true });

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

}, defaultState, { autoAssign: true });

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

}, defaultState, { autoAssign: true });

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

## License
MIT
