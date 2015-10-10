Mocha
-----

[Mocha中文指南](http://www.ifeenan.com/javascript/2015-02-26-Mocha%E4%B8%AD%E6%96%87%E6%8C%87%E5%8D%97/)  
[should.js](http://shouldjs.github.io/)  
[mocha官方网站](http://mochajs.org/)  

`mocha`是一款比较流行的测试框架,出自`TJ`之手,跟`jasmine`相比,它有灵活的断言语法,测试提示也比较友好,其它方面跟`jasmine`类似.

# start

这是官网上的一段示例代码

```js
var assert = require("assert")
describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
})
```

如果我们的测试文件名字为test.js，运行mocha就

```shell
mocha test
```

上面的代码有三个陌生的方法，也正是这三个基本方法构成mocha测试框架的基本使用方式。

# describe（moduleName, function）

顾名思义，描述一句测试用例是否正确。首先describe是可以嵌套的，多个describe嵌套的使用用于描述模块下的子模块的关系，上面的代码的意思就是测试Array这个类下面的#indexOf()方法, moduleName是可以随便定义的，即是是中文也可以。 “#”的使用也是一般约定，不喜欢你也会换个或不用也可以。

# it(info, function)

真正的测试语句是在it函数的function里面，info也是一句描述性的说明，看得懂就行。function里面的断言决定这条测试是否正确。如果fail的话控制台会把log打印出来。一个it对应一个测试用例，里面可以有多条断言或一条断言。

# assert.equal（exp1,exp2）

mocha的断言语句，exp1是否等于exp2. 其他更多用法可以查考mocha的文档，但是这里一般我们使用chai来作为断言库。更加友好的实现我们的断言方式。

## 异步代码测试

上面的官方例子是同步的代码测试，下面看看异步代码如何测试

```js
describe('User', function(){
    describe('#save()', function(){
        it('should save without error', function(done){
            var user = new User('Luna');
            user.save(done);
        })
    })
})
```

`user.save()` 是要链接数据库，是个异步操作。

跟第一段代码不同，使用了done。done表示你回调的最深处，也是嵌套回调函数的末端。done()函数如果接受一个error的callback，这句测试为fail。

注意一个it里面应该只能有一个done，如果非要有两个异步分叉，那建议用两个it。

# before(), after(),beforeEach(),afterEach()

介绍了异步的单元测试，还有一些列方便的辅助方法，方法非常简单明了，我贴个代码出来，大家看看就知道什么意思了。

```js 
describe('Connection', function(){
    var db = new Connection
    ,tobi = new User('tobi')
    ,loki = new User('loki')
    ,jane = new User('jane');
    beforeEach(function(done){
        db.clear(function(err){
            if (err) return done(err);
            db.save([tobi, loki, jane], done);
        });
    })

describe('#find()', function(){
    it('respond with matching records', function(done){
        db.find({ type: 'User' }, function(err, res){
            if (err) return done(err);
                res.should.have.length(3);
                done();
            })
        })
    })
})
```

# Pending

```js 
describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
        })
    })
});
```

就是it里面的function留空。mocha默认会pass这条测试。这样的用法其实相当于，某项目负责人定义好了要测试什么内容，之后由相应的开发去实现具体。

# only 和skip

```js
describe('Array', function(){
    describe('#indexOf()', function(){
        it.only('should return -1 unless present', function(){
        })

        it('should return the index when present', function(){
        })
    })
})
```

使用了only之后，这条descibe就只执行only，其他的忽略。skip作用相反，其他会执行，自己会被忽略。两者一起，自己想想都知道。  

mocha这个测试框架大体都介绍得差不多，最后你会惊奇的发现！！！控制台输出的内容好丑啊！！为什么？？为什么？因为你是个没有Mac的死穷吊！  

如果想输出测试结果好看点，可以-R 指令来选择一些输出样式。个人建议这样运行【mocha -R spec yourFile】（为什么我知道？不要说了，泪水啊~~）  