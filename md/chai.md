chai
----


# to
# be
# been
# is
# that
# and
# has
# have
# with
# at
# of
# same
# not

跟在链式调用后面的否定断言

```js
expect(foo).to.not.equal('bar');  
expect(goodFn).to.not.throw(Error);  
expect({ foo: 'baz' }).to.have.property('foo')  
  .and.not.equal('bar');
```


# deep

用来深度比较2个对象,一般用在equal和property前面

```js 
expect(foo).to.deep.equal({ bar: 'baz' });  
expect({ foo: { bar: { baz: 'quux' } } })  
  .to.have.deep.property('foo.bar.baz', 'quux');
```

# a(type) .an(type)

用来断言变量类型

```js 
// typeof
expect('test').to.be.a('string');  
expect({ foo: 'bar' }).to.be.an('object');  
expect(null).to.be.a('null');  
expect(undefined).to.be.an('undefined');

// language chain
expect(foo).to.be.an.instanceof(Foo);  
```

# .include(value) .contain(value)

用来断言字符串包含和数组包含,如果用在链式调用中，可以用来测试对象是否包含某key

```js 
expect([1,2,3]).to.include(2);  
expect('foobar').to.contain('foo');  
expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');  
```

# .ok

断言目标是否为真(隐式转换)

```js 
expect('everthing').to.be.ok;  
expect(1).to.be.ok;  
expect(false).to.not.be.ok;  
expect(undefined).to.not.be.ok;  
expect(null).to.not.be.ok;  
```

# .true .false

断言目标是否为布尔值 `true` , `false`

```js
expect(true).to.be.true;  
expect(1).to.not.be.true;

expect(false).to.be.false;  
expect(0).to.not.be.false;  
```

# .null

断言目标为 `null`

```js 
expect(null).to.be.null;  
expect(undefined).not.to.be.null;  
```

# .undefined

断言目标为 `undefined`

```js
expect(undefined).to.be.undefined;  
expect(null).to.not.be.undefined;
```

# * .exist

断言目标既不是null也不是 `undefined*`

```js
var foo = 'hi'  
  , bar = null
  , baz;

expect(foo).to.exist;  
expect(bar).to.not.exist;  
expect(baz).to.not.exist;  
```

# .empty

断言目标为空,数组一般指长度为0,字符串为空字符串,JSON对象一般指空对象

```js
expect([]).to.be.empty;  
expect('').to.be.empty;  
expect({}).to.be.empty;  
```

# .arguments

断言目标为函数的arguments对象

```js
function test () {  
    expect(arguments).to.be.arguments;
}
```

# .equal(value)

断言目标的严格相等(===运算符),如果前面有deep链式标记,表示目标内容的深度相等

```js
expect('hello').to.equal('hello');  
expect(42).to.equal(42);  
expect(1).to.not.equal(true);  
expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });  
expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });  
```

# .eql(value) 

断言内容的深度相等,其实就是前面.deep.equal的简写形式

```js 
expect({ foo: 'bar' }).to.eql({ foo: 'bar' });  
expect([ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);  
```

# .above(value)

断言目标的值大于某个value，如果前面有length的链式标记，则可以用于判断数组长度或者字符串长度

```js
expect(10).to.be.above(5);

expect('foo').to.have.length.above(2);  
expect([ 1, 2, 3 ]).to.have.length.above(2); 
```

# .least(value)

表示至少(大于或等于) 用法与above类似

# .below(value)

表示小于，用法与above类似

# .most(value)

表示至多(小于或等于)，用法与above类似

# .within(start, finish) 

断言目标值在某个范围区间,可以与length连用

```js
expect(7).to.be.within(5,10);  
expect('foo').to.have.length.within(2,4);  
expect([ 1, 2, 3 ]).to.have.length.within(2,4);  
```

# .instanceof(constructor)

断言目标是某个构造器产生的实例

```js
var Tea = function (name) { this.name = name; }  
  , Chai = new Tea('chai');

expect(Chai).to.be.an.instanceof(Tea);  
expect([ 1, 2, 3 ]).to.be.instanceof(Array);  
```

# .property(name, [value])

断言目标有以name为key的属性,并且可以指定value断言属性值是严格相等的,此[value]参数为可选,如果使用deep链式调用,可以在name中指定对象或数组的引用表示方法

```js
// simple referencing
var obj = { foo: 'bar' };  
expect(obj).to.have.property('foo');  
expect(obj).to.have.property('foo', 'bar');

// deep referencing
var deepObj = {  
    green: { tea: 'matcha' }
  , teas: [ 'chai', 'matcha', { tea: 'konacha' } ]
};

expect(deepObj).to.have.deep.property('green.tea', 'matcha');  
expect(deepObj).to.have.deep.property('teas[1]', 'matcha');  
expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');  
```

# .ownProperty(name)

断言目标拥有自己的属性，非继承链

```js
expect('test').to.have.ownProperty('length');  
```

# .throw(constructor)

断言目标会抛出特定的异常,可选的可以用正则来匹配异常对象的message属性

```js
var err = new ReferenceError('This is a bad function.');  
var fn = function () { throw err; }  
expect(fn).to.throw(ReferenceError);  
expect(fn).to.throw(Error);  
expect(fn).to.throw(/bad function/);  
expect(fn).to.not.throw('good function');  
expect(fn).to.throw(ReferenceError, /bad function/);  
expect(fn).to.throw(err);  
expect(fn).to.not.throw(new RangeError('Out of range.'));  
```


请查看官方文档[BDD API](http://chaijs.com/api/bdd/)