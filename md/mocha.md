Mocha
-----

[Mocha中文指南](http://www.ifeenan.com/javascript/2015-02-26-Mocha%E4%B8%AD%E6%96%87%E6%8C%87%E5%8D%97/)  
[should.js](http://shouldjs.github.io/)  
[mocha官方网站](http://mochajs.org/)  
[下文翻译来源](http://poppinlp.com/mochacn/)

`mocha`是一款比较流行的测试框架,出自`TJ`之手,跟`jasmine`相比,它有灵活的断言语法,测试提示也比较友好,其它方面跟`jasmine`类似.

# 如何安装

`$ npm install -g mocha` 通过npm来安装  

一起来Mocha!

```
$ npm install -g mocha
$ mkdir test
$ $EDITOR test/test.js

var assert = require("assert");
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});

$  mocha

.

✔ 1 test complete (1ms)
```


# 断言
Mocha允许你使用任何你喜欢的第三方断言库，只要它能抛出错误，那么它就能工作！例如你可以使用should.js、node自带的assert等等。下面是常见node或者浏览器的断言库列表： 

- [should.js](https://github.com/visionmedia/should.js) BDD style shown throughout these docs  
- [expect.js](https://github.com/LearnBoost/expect.js) expect() style assertions  
- [chai](http://chaijs.com/) expect(), assert() and should style assertions  
- [better-assert](https://github.com/visionmedia/better-assert) c-style self-documenting assert()  

# 同步执行的代码

当测试同步代码时，可以忽略回调函数，Mocha会自动的进行下一个测试。

```js
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            [1,2,3].indexOf(5).should.equal(-1);
            [1,2,3].indexOf(0).should.equal(-1);
        });
    });
});
```


# 异步执行的代码

用Mocha来测试异步代码同样非常简单，只需要在你的测试结束时调用回调函数即可。通过给it()添加回调函数（通常命名为done）可以告知Mocha需要等待异步测试结束。

```js
describe('User', function() {
    describe('#save()', function() {
        it('should save without error', function(done) {
            var user = new User('Luna');
            user.save(function(err) {
                if (err) throw err;
                done();
            });
        });
    });
});
```

为了更方便的使用，回调函数done()支持接收一个错误，所以我们可以直接这样来使用它：

```js 
describe('User', function() {
    describe('#save()', function() {
        it('should save without error', function(done) {
            var user = new User('Luna');
            user.save(done);
        });
    });
});
```

所有的钩子（before()、after()、beforeEach()、afterEach()）都同时支持同步和异步，行为表现也类似于通常的测试用例。例如可以像下面这样在每个测试之前初始化数据库中的虚拟数据：

```js
describe('Connection', function() {
    var db = new Connection,
        tobi = new User('tobi'),
        loki = new User('loki'),
        jane = new User('jane');

    beforeEach(function(done) {
        db.clear(function(err) {
            if (err) return done(err);
            db.save([tobi, loki, jane], done);
        });
    });

    describe('#find()', function() {
        it('respond with matching records', function(done) {
            db.find({ type: 'User' }, function(err, res) {
                if (err) return done(err);
                res.should.have.length(3);
                done();
            });
        });
    });
});
```

你也可以返回一个promise来代替使用回调函数done()。当你测试的API返回promise而不是执行回调函数时，这将会非常好用。

```js
beforeEach(function() {
    return db.clear().then(function() {
        return db.save([tobi, loki, jane]);
    });
});

describe('#find()', function() {
    it('respond with matching records', function() {
        return db.find({ type: 'User' }).should.eventually.have.length(3);
    });
});
```

（上面的例子使用了[Chai as Promised](https://github.com/domenic/chai-as-promised/)作为promise断言。）

注意，你也可以在任意文件中加入“全局”级别的钩子，例如在describe()外面添加beforeEach()，这样回调函数就会在每一个测试用例前执行而不管测试用例是否在这个文件中。产生这样的结果是因为Mocha运行在自己的全局匿名Suite中。  


# 挂起测试

挂起的测试是指那些没有回调函数的测试用例：

```js
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present');
    });
});
```

# 独占测试

独占这个特性允许你像下面例子那样通过添加.only()来只执行指定的测试场景：

```js
describe('Array', function() {
    describe.only('#indexOf()', function() {
        ...
    });
});
```

或者指定的测试用例：

```js
describe('Array', function() {
    describe('#indexOf()', function() {
        it.only('should return -1 unless present', function() {

        });

        it('should return the index when present', function() {

        });
    });
});
```

注意，目前只考虑使用最多一个.only()，这能有效的达到--grep的效果。

# 包含测试

这个特性类似于.only，你可以通过添加.skip()来告诉Mocha忽略掉这个测试场景和测试用例。这会让它们被挂起，有助于在你忘记去掉注释的时候跳过那些测试。

```js
describe('Array', function() {
    describe.skip('#indexOf()', function() {
        ...
    });
});
```

对测试用例同样适用：

```js 
describe('Array', function() {
    describe('#indexOf()', function() {
        it.skip('should return -1 unless present', function() {

        })

        it('should return the index when present', function() {

        });
    });
});
```

# 差异检测

当需要向开发者呈现差异的时候，Mocha支持err.expected和err.actual属性。目前Mocha提供了字符串差异，以后会提供对象差异和其他的内容。

# 命令行参数

```
Usage: mocha [debug] [options] [files]

Commands:

init <path>
initialize a client-side mocha setup at <path>

Options:

-h, --help                      输出用法信息
-V, --version                   输出版本号
-r, --require <name>            加载指定的模块
-R, --reporter <name>           指定使用的监控器
-u, --ui <name>                 指定使用的接口（bdd | tdd | exports）
-g, --grep <pattern>            只执行满足路径模式的测试脚本
-i, --invert                    inverts --grep matches
-t, --timeout <ms>              设置测试用例的超时时间，单位毫秒，默认为2000
-s, --slow <ms>                 "slow" test threshold in milliseconds [75]
-w, --watch                     监测有变化的文件
-c, --colors                    强制使用文本颜色
-C, --no-colors                 强制关闭文本颜色
-G, --growl                     enable growl notification support
-d, --debug                     enable node's debugger, synonym for node --debug
-b, --bail                      bail after first test failure
-A, --async-only                force all tests to take a callback (async)
--recursive                     包含子文件夹
--debug-brk                     enable node's debugger breaking on the first line
--globals <names>               allow the given comma-delimited global [names]
--check-leaks                   check for global variable leaks
--interfaces                    显示可用的接口列表
--reporters                     显示可用的监控器列表
--compilers <ext>:<module>,...  use the given module(s) to compile files
```

## -w, --watch

在当前工作目录中的 Javascript 文件发生改变时，立即执行相应的测试。

## --compilers

coffee-script is no longer supported out of the box. CS and similar transpilers may be used by mapping the file extensions (for use with --watch) and the module name. For example --compilers coffee:coffee-script with CoffeeScript 1.6- or --compilers coffee:coffee-script/register with CoffeeScript 1.7+.

## -b, --bail

Only interested in the first exception? use --bail !

## -d, --debug

Enables node's debugger support, this executes your script(s) with node debug <file ...> allowing you to step through code and break with the debugger statement. Note the difference between mocha debug and mocha --debug: mocha debug will fire up node's built-in debug client, mocha --debug will allow you to use a different interface — such as the Blink Developer Tools.

## --globals <names>

Accepts a comma-delimited list of accepted global variable names. For example, suppose your app deliberately exposes a global named app and YUI, you may want to add --globals app,YUI. It also accepts wildcards. You could do --globals '*bar' and it would match foobar, barbar, etc. You can also simply pass in '*' to ignore all globals.

## --check-leaks

By default Mocha will not check for global variables leaked while running tests, to enable this pass --check-leaks, to specify globals that are acceptable use --globals, for example --globals jQuery,MyLib.

## -r, --require <name>

The --require option is useful for libraries such as should.js, so you may simply --require should instead of manually invoking require('should') within each test file. Note that this works well for should as it augments Object.prototype, however if you wish to access a module's exports you will have to require them, for example var should = require('should').

## -u, --ui <name>

The --ui option lets you specify the interface to use, defaulting to "bdd".

## -R, --reporter <name>

The --reporter option allows you to specify the reporter that will be used, defaulting to "dot". This flag may also be used to utilize third-party reporters. For example if you npm install mocha-lcov-reporter you may then do --reporter mocha-lcov-reporter.

## -t, --timeout <ms>

Specifies the test-case timeout, defaulting to 2 seconds. To override you may pass the timeout in milliseconds, or a value with the s suffix, ex: --timeout 2s or --timeout 2000 would be equivalent.

## -s, --slow <ms>

Specify the "slow" test threshold, defaulting to 75ms. Mocha uses this to highlight test-cases that are taking too long.

## -g, --grep <pattern>

The --grep option when specified will trigger mocha to only run tests matching the given pattern which is internally compiled to a RegExp.

Suppose for example you have "api" related tests, as well as "app" related tests, as shown in the following snippet; One could use --grep api or --grep app to run one or the other. The same goes for any other part of a suite or test-case title, --grep users would be valid as well, or even --grep GET.