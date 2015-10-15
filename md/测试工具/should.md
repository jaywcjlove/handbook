# should.js

`should.js` 也是 `TJ` 写的，所以这里重点介绍它的断言语法，更多它的API使用文档，可以[点击这里](http://shouldjs.github.io/) 


下面重点介绍它的一些常用手法，测试环境可以使用 `mocha`  

先说下，`should.js`的一个特点,就是它支持友好语法的链式调用，这些语法其实什么都没做，只是编写比较友好，方便阅读，常见的语法有下面这些`be`，`an`，`of`，`a`，`and`，`have`，`with`，`is`，`which`，`the`，在 `should` 后面加上 `not` 代表相反的意思。

结合比较操作方法，看看下面一个简单的例子

```js
require('should');

describe('test should.js', function(){
    it('test chain', function(){
        (10).should.is.be.the.eql(10);
    });
});
```

上面例子中的`is`，`be`，`the` 其实没有顺序要求，读起来怎么友好就怎么写，因为它们什么都没做，只是返回should.js包装函数。

## ok

> 检查期望的值能否转换成`true`

```js
(true).should.be.ok;
```

## true | True

> 检查期望的值是否为`true`，不转换

```js
(true).should.be.true;
false.should.not.be.True;
```

## false | False

> 检查期望的值是否为`false`，不转换

```js 
(true).should.not.be.false;
false.should.be.False;
```

## eql

> 检查期望的值跟真实的值在字面上是否相等，并且深度比较

```js 
require('should');

describe('test should.js', function(){
    var foo = {
        foo: 'foo',
        bar: {
            bar: 'bar'
        }
    };
    it('test eql', function(){
        (foo).should.be.eql({
            foo: 'foo',
            bar: {
                bar: 'bar'
            }
        });
    });
});
```

## equal | exactly

> 检查期望的值与真实的值是一样的，当是比较值类型的话，跟`eql`一样，比较引用类型的话，
则要检查两者是否引用同一地址。

```js 
require('should');

describe('test should.js', function(){
    var foo = {
        foo: 'foo',
        bar: {
            bar: 'bar'
        }
    };
    it('test eql', function(){
        (foo).should.not.be.equal({
            foo: 'foo',
            bar: {
                bar: 'bar'
            }
        });
    });
});
```

## throw | throwError

> 检查期望的函数是否会返回异常，方法参数支持异常信息，正则表达式，对象，以便精确匹配错误信息

```js 
(function(){ throw new Error('fail') }).should.throw();
(function(){ throw new Error('fail') }).should.throw('fail');
(function(){ throw new Error('fail') }).should.throw(/fail/);

(function(){ throw new Error('fail') }).should.throw(Error);
var error = new Error();
error.a = 10;
(function(){ throw error; }).should.throw(Error, { a: 10 });
(function(){ throw error; }).should.throw({ a: 10 });
```

## match

> 检查期望的值与传入的`正则`，`函数`，`对象`进行匹配

匹配规则如下:

- 如果参数是正则并且期望值是字符串的话，则直接正则匹配字符串即可。
- 如果参数是正则并且期望值是数组的话，则依次用正则匹配数组元素。
- 如果参数是正则并且期望值是对象，则依次对对象键值用正则匹配。
- 如果参数是函数，当函数抛异常或者返回false，则判定为没匹配上。
- 如果参数是对象，则相同键值用上面的规则来匹配。
- 其它情况都适为没匹配上。

```js 
'foobar'.should.match(/^foo/);
'foobar'.should.not.match(/^bar/);

({ a: 'foo', c: 'barfoo' }).should.match(/foo$/);

['a', 'b', 'c'].should.match(/[a-z]/);

(5).should.not.match(function(n) {
  return n < 0;
});
(5).should.not.match(function(it) {
   it.should.be.an.Array;
});
({ a: 10, b: 'abc', c: { d: 10 }, d: 0 }).should
.match({ a: 10, b: /c$/, c: function(it) {
   return it.should.have.property('d', 10);
}});

[10, 'abc', { d: 10 }, 0].should
.match({ '0': 10, '1': /c$/, '2': function(it) {
   return it.should.have.property('d', 10);
}});
```


## matchEach

依次对期望值进行匹配  
匹配规则如下:

- 如果参数是正则，则依次对期望值中的对象值或者数组项进行正则匹配
- 如果参数是函数，当函数抛异常或者返回false，则没匹配上
- 其它情况，则直接按eql来处理

```js
[ 'a', 'b', 'c'].should.matchEach(/\w+/);
[ 'a', 'a', 'a'].should.matchEach('a');

[ 'a', 'a', 'a'].should.matchEach(function(value) { value.should.be.eql('a') });

{ a: 'a', b: 'a', c: 'a' }.should.matchEach(function(value) { value.should.be.eql('a') });
```

## Infinity

检查期望的值是否为无穷大或者无穷小

```js
(10).should.not.be.Infinity;
NaN.should.not.be.Infinity;
```

## NaN

检查期望的值是否为NaN

```js
(10).should.not.be.NaN;
NaN.should.be.NaN;
```

## above | greaterThan

检查期望的值是否大于某数

```js
(10).should.be.above(0);
(10).should.not.be.greaterThan(100);
```

## approximately

检查期望的值大约在(某个数±某个半径)内。

```js
// 9.99 10±0.1
(9.99).should.be.approximately(10, 0.1);
```

## below | lessThan

检查期望的值小于某数

```js
(0).should.be.below(10);
(100).should.not.be.lessThan(10);
```

## within

检查期望的值在某两个数之前，包含两个数

```js
(10).should.be.within(10, 20);
(13).should.be.within(10, 15);
```

## empty

检查期望的值是否为空，比如空字符串，空数组，空对象。

```js
''.should.be.empty;
[].should.be.empty;
({}).should.be.empty;
```

## enumerable

检查期望的值是否有可枚举的属性

```js
({ a: 10 }).should.have.enumerable('a');
```

## enumerables

检查期望的值是否有多个可枚举的属性

```js
({ a: 10, b: 10 }).should.have.enumerables('a', 'b');
({ a: 10, b: 10 }).should.have.enumerables(['a', 'b']);
```

## keys | key

检查期望的值是否包含传入的键

```js
({ a: 10 }).should.have.keys('a');
({ a: 10, b: 20 }).should.have.keys('a', 'b');
({ a: 10, b: 20 }).should.have.keys([ 'a', 'b' ]);
({}).should.have.keys();
```

## length | lengthOf

检查期望的值的长度

```js
[1, 2].should.have.length(2);
```

## ownProperty

检查期望的值是否有自己的某个属性

```js
({ a: 10 }).should.have.ownProperty('a');
```

## properties

检查期望的值是否有某些属性，可以批量检查属性

```js
({ a: 10 }).should.have.properties('a');
({ a: 10, b: 20 }).should.have.properties([ 'a' ]);
({ a: 10, b: 20 }).should.have.properties({ b: 20 });
```

## property

检查期望的值是否有某个属性，单个检查

```js
({ a: 10 }).should.have.property('a');
({ a: 10 }).should.have.property('a', 10);
```

## propertyByPath

根据传入的参数深度来获取属性的值

```js
({ a: {b: 10}}).should.have.propertyByPath('a', 'b').eql(10);
```

## propertyWithDescriptor

检查期望的值的属性有某些描述

```js
({ a: 10 }).should.have.propertyWithDescriptor('a', { enumerable: true });
```

## startWith

检查字符串是否以某个传入的参数开头

```js
'abc'.should.startWith('a');
```

## endWith

检查字符串是否以某个传入的参数结尾

```js
'abc'.should.endWith('c');
```

## instanceof | instanceOf

检查期望的值是否是某个类的实例

```js
'abc'.should.be.instanceof(String);
```

## type

检查期望的值是否是某个类型

```js
'abc'.should.be.type('string');
```

## null | Null

检查期望的值是否为null

```js
var should = require('should');
describe('test should.js ', function(){
    it('test null ', function(){
        should(null).be.null;
    });
});
```

## undefined | Undefined

检查期望的值是否 `undefined`

```js
var should = require('should');
describe('test should.js ', function(){
    it('test undefined', function(){
        var a;
        should(a).be.undefined;
    });
});
```

上面是一些常用的`should.js`中的断言方法，下面简单的说下`mocha`测试框架的用法

# 异步处理与前后注入

跟`jasmine`类似，也是通过在`it`，`beforeEach`里传入`done`来确定是否执行完成。

```js 
describe('test should.js', function(){

    var foo = 0;

    before('首次调用',function(done){
        setTimeout(function(){
            foo += 1;
            done()
        }, 1000);
    });
    beforeEach(function(done){
        setTimeout(function(){
            foo += 1;
            done();
        }, 1000);
    })
    afterEach(function(){
        foo = 0;
    });
    it('test beforeEach', function(done){
        setTimeout(function(){
            (foo).should.eql(2);
            done();
        }, 1000);
    })


});
```

# 禁用与开启测试

`.only`可以让某个`it`执行而忽略别的`it`

```js 
describe('1.test mocha', function(){

    it.only('test .only', function(){
        '123'.should.be.String;
    });

    // 下面的spec不会执行
    it('ignore invoke', function(){
        (0).should.be.eql(0);
    });
});
```

`.skip`可以禁止某个`it`而执行别的`it`

```js 
describe('test mocha', function(){

    // 下面的spec不会执行
    it.skip('ignore spec', function(){
        ({}).should.be.Object;
    });

    it('test .skip', function(){
        ({}).should.be.empty;
    });

});
```

# 自由切换模式

> 自由切换bdd,tdd,exports模式

```bash
mocha -u [bdd | tdd | exports] *.js
```

`-u`选项支持传递要使用的测试类型,默认是`bdd`,可以选择`tdd`,`exports`

## BDD

`bdd`用的比较多，`jasmine`的测试风格就是`bdd`，它的特征就是使用`describe`，`it`


```js
describe('Array', function(){
  before(function(){
    // ...
  });

  describe('#indexOf()', function(){
    it('should return -1 when not present', function(){
      [1,2,3].indexOf(4).should.equal(-1);
    });
  });
});
```

## TDD

`tdd`跟`bdd`区别在于，它使用`suite`，`test`，`suiteSetup`，`suiteTeardown`，`setup`，`teardown`

```js
suite('Array', function(){
      setup(function(){
            // ...
      });

      suite('#indexOf()', function(){
            test('should return -1 when not present', function(){
                ([1,2,3].indexOf(4)).should.be.eql(-1);
            });
      });
});
```

## Exports

`exports`类似于`node`里的模块语法，`before`， `after`， `beforeEach`， and `afterEach`是作为对象的属性来处理，其它对象的值默认是`suite`，属性是函数的话，代表是一个`test`

```js
module.exports = {
      before: function(){
            // ...
      },

      'Array': {
            '#indexOf()': {
              'should return -1 when not present': function(){
                [1,2,3].indexOf(4).should.equal(-1);
              }
            }
      }
};
```

其实的测试风格还有`QUnit`，`Require`，更多详情请[点击这里](http://mochajs.org/#interfaces)。


# 自由切换输出风格

目前默认的输出格式为`spec`，可以通用`-R spec`来指定，目前已有的格式有`dot`，`nyan`，`tap`，`list`，`progress`，`json`，`min`，`doc`，`markdown等`，`html`格式只在浏览器中有效

## mocha细节问题
设置测试组超时时间,可以在describe或者suite代码块里调用this.timeout方法

```js
describe('a suite of tests', function(){
    this.timeout(500);

    it('should take less than 500ms', function(done){
        setTimeout(done, 300);
    })

    it('should take less than 500ms as well', function(done){
        setTimeout(done, 200);
    })
})
```

设置测试用例超时时间，可以在`it`或者`test`代码块里调用`this.timeout`方法

```js
it('should take less than 500ms', function(done){
  this.timeout(500);
  setTimeout(done, 300);
})
```

`mocha`默认会执行`./test/*.js`里的测试文件，所以这个目录是放测试文件的好地方
为了方便执行`mocha`命令，可以建立一个`makefile`文件，如下，直接在终端上输入`make test`。  

[Mocha中文指南](http://www.ifeenan.com/javascript/2015-02-26-Mocha%E4%B8%AD%E6%96%87%E6%8C%87%E5%8D%97/)