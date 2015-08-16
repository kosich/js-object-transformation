# Intro

A tool to transform one js object into another

### Word of warning

This code is at version **0.0.0** so its interface might be changed in the future

Code is written in **es6** *(a.k.a. js2015)* and needs [babel](https://babeljs.io/docs/usage/cli/) for transpiling and running unit tests

Is not published to any package manager repo

JSON path syntax is not fully supported (e.g. no relative paths, no array items by index etc)

# Examples

```js
import transform from '../src/main.js';
```

#### Simple
```js
// get value from 'a' property
transform({ a: '_a_' }, '$.a'); // > '_a_'

// get value from the sub property
transform({ a: { b: '_b_' }}, '$.a.b'); // > '_b_'

// get array and apply some modificator to it
transform({ c: [1, 5, 2, 3] }, ['$.c[*]', c=>Math.max(...c) ]); // > 5
```

#### Object
```js
let src = {
    a: { sub: 'bio' },
    b: 'hazard',
    c: [ 'c', 'e', 'l', 'l' ]
};

let mod = {
    // $ points to the source's root

    // just copy value from 'b' to 'y'
    y: '$.b',

    // get 'a.sub' from src and put it to 'x' 
    x: '$.a.sub',

    // get 'b' property and src itself
    // and then apply modificator
    // and put to z
    z: [ '$.a', '$', (a,$)=>`${a.sub.toUpperCase()} ${$.b}` ],

    // again, simple copying of array
    // but putting it to sub property
    c: { cell: '$.c[*]' },

    // apply some modificator to array from src
    // and put it to 'r'
    r: ['$.c[*]', c=>c.join('')]
};


let result = transform(src, mod);

result === {
    y: 'hazard',
    x: 'bio',
    z: 'BIO hazard',
    c: { cell: [ 'c', 'e', 'l', 'l'  ]  },
    r: 'cell'
};

```
