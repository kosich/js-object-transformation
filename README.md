A tool to transform one object into another

```js
import transform from 'transform';

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
