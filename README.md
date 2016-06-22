# redux-act-reducer

[![build status](https://img.shields.io/travis/hahoocn/redux-act-reducer/master.svg?style=flat-square)](https://travis-ci.org/hahoocn/redux-act-reducer) [![npm version](https://img.shields.io/npm/v/redux-act-reducer.svg?style=flat-square)](https://www.npmjs.com/package/redux-act-reducer)

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

// { type: 'SHOW_HELLO', info: 'Hello World!' }
```
Or
```javascript
import { createAction } from 'redux-act-reducer';

export const SHOW_HELLO = 'SHOW_HELLO';
export const showHello = createAction(SHOW_HELLO);
```
```javascript
dispatch(showHello({info: 'Hello World!'}));

// { type: 'SHOW_HELLO', info: 'Hello World!' }
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
