import {should} from 'should';
import sut from '../src/main.js';

let src, mod;

beforeEach(()=>{
    src = {};
    mod = {};
});

describe('Basic transformation', function(){

    describe('With no transformation passed', function(){
        it('will return non object value as is', function(){
            sut(4)
                .should.equal(4);
        });

        it('will return object if second arg wasnt passed', function(){
            sut({ a: 1 })
                .should.eql({a: 1});
        });
    });

    describe('With simple transformation', ()=>{
        it('will return value for path', function(){
            src.a = { b: { c: 'value' } };
            sut(src, '$.a.b.c')
                .should.equal('value');
        });

        it('will transform object with function', ()=>{
            src.a = 'value';
            sut(src, o => o.a)
                .should.equal('value');
        });
    });

});


describe('Object transformation', function(){

    describe('Simple transformations', function(){

        beforeEach(()=>{
            src.a = '_a_';
        })

        it('will move string', ()=>{
            mod.x = '$.a';

            sut(src, mod)
                .should.have.property('x', '_a_');
        });

        it('will move one boolean', function(){
            src.a = false;
            mod.x = '$.a';

            (sut(src, mod).x)
                .should.equal(false)
        });

        it('will move two simple values', ()=>{
            src.b = '_b_';

            mod.x = '$.a';
            mod.y = '$.b';

            let result = sut(src, mod);

            result.should.have.property('x', '_a_');
            result.should.have.property('y', '_b_');
        });

    });

    describe('Subitems', function(){

        it('will set subitem', function(){
            src.a = 'value';
            mod.x = { y : '$.a' };
            
            sut(src, mod)
                .should.eql({ x: { y: 'value' } });
        });

        it('will set subitem from subitem', function(){
            src.a = { b: { c: 'value'}};
            mod.x = { y: { z: '$.a.b.c'}};
            
            sut(src, mod)
                .should.eql({ x: { y: { z: 'value'}}});
        });

        it('will copy object to subitem', function(){
            src.a = { b: { c: 'value'}};
            mod.x = { y: '$.a.b'};
            
            sut(src, mod)
                .should.eql({ x: { y: { c: 'value'}}});
        });
    });

    describe('Functions as setters', function(){
        it('will evaluate property value', function(){
            mod.a = src => src.value + '-value';
            src.value = 'src';

            sut(src, mod)
                .should.have.property('a', 'src-value');
        });
    });

    describe('src path with function', function(){

        it('will get and evaluate property value', function(){
            src.a = { b: { c: 'src'}};
            mod = { x: { y: { z: 
                ['$.a.b.c', source_value=>source_value + '-value']
            }}};

            sut(src, mod)
                .should.eql({
                    x : { y : { z: 'src-value' } }
                });
        });

        it('will get several values and evaluate property value', function(){
            src.a = '_a_';
            src.b = '_b_';
            mod.x = [ '$.a', '$.b', (a, b)=>a+b ];
            mod.z = [ '$', $=>$.b + $.a ];

            sut(src, mod)
                .should.eql({
                    x: '_a__b_',
                    z: '_b__a_'
                });
        });
    });

    describe('Arrays', function(){
        it('will transform simple array', function(){
            src = [ {a: 1}, {a: 2}, {a: 3}];
            mod = '$[*].a';

            sut(src, mod)
                .should.eql( [1, 2, 3] );
        });

        it('will transform simple sub array', function(){
            src.a = [ {b: 1}, {b: 2}, {b: 3}];
            mod = '$.a[*].b';

            sut(src, mod)
                .should.eql( [1, 2, 3] );
        });

        it('will transform array with subarray', function(){
            src.a = [ {b: [ 1, 2 ]}, {b: [ 2, 3 ]}, {b: [ 3, 4 ]}];
            mod = { x:'$.a[*].b[*]' };

            sut(src, mod)
                .should.eql({ x: [[1,2], [2,3], [3,4]] });
        });
    });

});

