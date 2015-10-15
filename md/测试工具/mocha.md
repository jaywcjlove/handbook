Mocha
-----

Mocha是一个基于node.js和浏览器的集合各种特性的Javascript测试框架，并且可以让异步测试也变的简单和有趣。Mocha的测试是连续的，在正确的测试条件中遇到未捕获的异常时，会给出灵活且准确的报告。Mocha托管在Github上。

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


# 接口

Mocha的接口系统提供了BDD、TDD和exports三种风格，并允许开发者选择使用。

## BDD

"BDD"接口提供了describe()、it()、before()、after()、beforeEach()和afterEach可使用。

```js 
describe('Array', function() {
    before(function() {
        // ...
    });

    describe('#indexOf()', function() {
        it('should return -1 when not present', function() {
            [1,2,3].indexOf(4).should.equal(-1);
        });
    });
});
```

## TDD

"TDD"接口提供了suite()、test()、setup()和teardown()可使用。

```js
suite('Array', function() {
    setup(function() {
        // ...
    });

    suite('#indexOf()', function() {
        test('should return -1 when not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});
```



## Exports

The "exports" interface is much like Mocha's predecessor expresso. The keys before, after, beforeEach, and afterEach are special-cased, object values are suites, and function values are test-cases.

```js
module.exports = {
    before: function() {
        // ...
    },

    'Array': {
        '#indexOf()': {
            'should return -1 when not present': function() {
                [1,2,3].indexOf(4).should.equal(-1);
            };
        };
    };
};
```

## QUnit

The qunit-inspired interface matches the "flat" look of QUnit where the test suite title is simply defined before the test-cases.

```js
function ok(expr, msg) {
    if (!expr) throw new Error(msg);
}

suite('Array');

test('#length', function() {
    var arr = [1,2,3];
    ok(arr.length == 3);
});

test('#indexOf()', function() {
    var arr = [1,2,3];
    ok(arr.indexOf(1) == 0);
    ok(arr.indexOf(2) == 1);
    ok(arr.indexOf(3) == 2);
});

suite('String');

test('#length', function(){
    ok('foo'.length == 3);
});
```


Require

The require interface allows you to require the describe and friend words directly using require and call them whatever you want. This interface is also useful if you want to avoid global variables in your tests.

```js
var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').assertions;
var assert = require('assert');

testCase('Array', function() {
    pre(function() {
        // ...
    });

    testCase('#indexOf()', function() {
        assertions('should return -1 when not present', function() {
        assert.equal([1,2,3].indexOf(4), -1);
        });
    });
});
```


# 监控器

Mocha 的监控器可以适应控制台窗口，并且当标准输入流不是和 tty 关联的时候，它总是会禁用 ansi-escape 着色。

## Dot Matrix

The "dot" matrix reporter is simply a series of dots that represent test cases, failures highlight in red, pending in blue, slow as yellow.

## Spec

The "spec" reporter outputs a hierarchical view nested just as the test cases are.

## Nyan

The "nyan" reporter is exactly what you might expect:


## TAP

The TAP reporter emits lines for a [Test-Anything-Protocol](http://en.wikipedia.org/wiki/Test_Anything_Protocol) consumer.

## Landing Strip

The Landing Strip reporter is a gimmicky test reporter simulating a plane landing :) unicode ftw

## List

The "List" reporter outputs a simple specifications list as test cases pass or fail, outputting the failure details at the bottom of the output.

## Progress

The progress reporter implements a simple progress-bar:

## JSON

The JSON reporter outputs a single large JSON object when the tests have completed (failures or not).

## JSON Stream

The JSON Stream reporter outputs newline-delimited JSON "events" as they occur, beginning with a "start" event, followed by test passes or failures, and then the final "end" event.

## JSONCov

The JSONCov reporter is similar to the JSON reporter, however when run against a library instrumented by [node-jscoverage](https://github.com/visionmedia/node-jscoverage) it will produce coverage output.


## HTMLCov

The HTMLCov reporter extends the JSONCov reporter. The library being tested should first be instrumented by [node-jscoverage](https://github.com/visionmedia/node-jscoverage), this allows Mocha to capture the coverage information necessary to produce a single-page HTML report.

Click to view the current [Express test coverage](http://poppinlp.com/mochacn/coverage.html) report. For an integration example view the mocha test coverage support [commit](https://github.com/visionmedia/express/commit/b6ee5fafd0d6c79cf7df5560cb324ebee4fe3a7f) for Express.

## Min

The "min" reporter displays the summary only, while still outputting errors on failure. This reporter works great with --watch as it clears the terminal in order to keep your test summary at the top.

## Doc

The "doc" reporter outputs a hierarchical HTML body representation of your tests, wrap it with a header, footer, some styling and you have some fantastic documentation!


For example suppose you have the following JavaScript:

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

The command mocha --reporter doc array would yield:

```html
<section class="suite">
    <h1>Array</h1>
    <dl>
        <section class="suite">
            <h1>#indexOf()</h1>
            <dl>
                <dt>should return -1 when the value is not present</dt>
                <dd><pre><code>[1,2,3].indexOf(5).should.equal(-1); [1,2,3].indexOf(0).should.equal(-1);</code></pre></dd>
            </dl>
        </section>
    </dl>
</section>
```

The SuperAgent request library test documentation was generated with Mocha's doc reporter using this simple make target:

```
test-docs:
make test REPORTER=doc \
| cat docs/head.html - docs/tail.html \
> docs/test.html
```

View the entire [Makefile](https://github.com/visionmedia/superagent/blob/master/Makefile) for reference.


## XUnit

Documentation needed.

## TeamCity

Documentation needed.

## Markdown

The "markdown" reporter generates a markdown TOC and body for your test suite. This is great if you want to use the tests as documentation within a Github wiki page, or a markdown file in the repository that Github can render. For example here is the Connect [test output](https://github.com/senchalabs/connect/blob/90a725343c2945aaee637e799b1cd11e065b2bff/tests.md).

## HTML

The HTML reporter is currently the only browser reporter supported by Mocha, and it looks like this:



# 支持浏览器

Mocha在浏览器中执行。每个Mocha的发行版会为浏览器生成新的./mocha.js和./mocha.css。只需要加载相应的script和stylesheet，并告诉Mocha你希望使用的接口，你就可以使用Mocha在浏览器中执行测试。下面是一个典型的使用Mocha的测试，在加载测试脚本前，我们调用mocha.setup('bdd')来使用BDD接口，然后通过mocha.run()在onload之后执行测试脚本。

```html 
<html>
    <head>
        <meta charset="utf-8">
        <title>Mocha Tests</title>
        <link rel="stylesheet" href="mocha.css" />
    </head>
    <body>
        <div id="mocha"></div>
        <script src="jquery.js"></script>
        <script src="expect.js"></script>
        <script src="mocha.js"></script>
        <script>mocha.setup('bdd')</script>
        <script src="test.array.js"></script>
        <script src="test.object.js"></script>
        <script src="test.xhr.js"></script>
        <script>
            mocha.checkLeaks();
            mocha.globals(['jQuery']);
            mocha.run();
        </script>
    </body>
</html>
```

## grep

The client-side may utilize --grep as well, however you use the query-string, for example ?grep=api.


# mocha.opts文件

Mocha会尝试取加载./test/mocha.opts文件，并把它与process.argv联系起来，但命令行参数的优先级更高。例如你有下面这样的mocha.opts文件：

```
--require should
--reporter dot
--ui bdd
```

这会默认使用dot监控器、加载should库并使用bdd接口。与此同时，你也可以在调用mocha(1)的时候添加参数，比如下面这样会激活growl支持并将监控器设置为list：

```sh
$ mocha --reporter list --growl
```

# 指定方案超时时间

方案级的超时时间会对整个测试方案生效，也可以通过this.timeout(0)来关闭。如果其内部的测试方案和测试用例不覆盖这个值，那么这个值将被继承。

```js
describe('a suite of tests', function() {
    this.timeout(500);

    it('should take less than 500ms', function(done) {
        setTimeout(done, 300);
    });

    it('should take less than 500ms as well', function(done) {
        setTimeout(done, 200);
    });
});
```

# 指定测试超时时间

测试可以指定超时时间，也可以通过this.timeout(0)来关闭所有的超时时间：

```
it('should take less than 500ms', function(done) {
    this.timeout(500);
    setTimeout(done, 300);
});
```


# 最佳实践

## test/*

mocha(1)默认会使用./test/*.js这个路径模式，这也通常是你放测试用例的好地方。

## Makefiles

对开发者友好，在Makefile中添加一个make test，不要让他们在你的文档中到处寻找如何运行测试用例：

```
test:
./node_modules/.bin/mocha --reporter list

.PHONY: test
```


# 编辑器

下面是可用的编辑器相关的包列表：

## TextMate bundle

Mocha TextMate bundle 包含了让写测试更快更舒心的很多snippets。执行以下命令安装：

```
$ make tm
```

# 测试方案示例

下面的测试方案是来自于真实的使用Mocha的项目，所以用它们做示例再好不过了：

- [Express](https://github.com/visionmedia/express/tree/master/test)
- [Connect](https://github.com/senchalabs/connect/tree/master/test)
- [SuperAgent](https://github.com/visionmedia/superagent/tree/master/test/node)
- [WebSocket.io](https://github.com/LearnBoost/websocket.io/tree/master/test)
- [Mocha](https://github.com/visionmedia/mocha/tree/master/test)

# 执行Mocha的测试

执行测试：

```sh
$ make test
```

执行所有测试，包括接口：

```sh
$ make test-all
```

更改监控器：

```sh
$ make test REPORTER=list
```

