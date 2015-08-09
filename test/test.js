import {should} from 'should';
import sut from '../src/main.js';

let source, target;

beforeEach(()=>{
    source = {};
    target = {};
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
            source.a = { b: { c: 'value' } };
            sut(source, '$.a.b.c')
                .should.equal('value');
        });

        it('will transform object with function', ()=>{
            source.a = 'value';
            sut(source, o => o.a)
                .should.equal('value');
        });
    });

});


describe('Object transformation', function(){

    describe('Simple transformations', function(){

        beforeEach(()=>{
            source.a = '_a_';
        })

        it('will move string', ()=>{
            target.x = '$.a';

            sut(source, target)
                .should.have.property('x', '_a_');
        });

        it('will move one boolean', function(){
            source.a = false;
            target.x = '$.a';

            (sut(source, target).x)
                .should.equal(false)
        });

        it('will move two simple values', ()=>{
            source.b = '_b_';

            target.x = '$.a';
            target.y = '$.b';

            let result = sut(source, target);

            result.should.have.property('x', '_a_');
            result.should.have.property('y', '_b_');
        });

    });

    describe('Subitems', function(){

        it('will set subitem', function(){
            source.a = 'value';
            target.x = { y : '$.a' };
            
            sut(source, target)
                .should.eql({ x: { y: 'value' } });
        });

        it('will set subitem from subitem', function(){
            source.a = { b: { c: 'value'}};
            target.x = { y: { z: '$.a.b.c'}};
            
            sut(source, target)
                .should.eql({ x: { y: { z: 'value'}}});
        });

        it('will copy object to subitem', function(){
            source.a = { b: { c: 'value'}};
            target.x = { y: '$.a.b'};
            
            sut(source, target)
                .should.eql({ x: { y: { c: 'value'}}});
        });
    });

    describe('Functions as setters', function(){
        it('will evaluate property value', function(){
            target.a = source => source.value + '-value';
            source.value = 'src';

            sut(source, target)
                .should.have.property('a', 'src-value');
        });
    });

    describe('Source path with function', function(){
        beforeEach(function(){
            source.a = { b: { c: 'src'}};

            target = { x: { y: { z: 
                ['$.a.b.c', source_value => source_value + '-value']
            }}};

        })

        it('will get and evaluate property value', function(){
            sut(source, target)
            .should.eql({
                x : { y : { z: 'src-value' } }
            });
        });
    });
});

