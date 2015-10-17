来源于此[转载](https://github.com/nimojs/gulp-book)

# 安装gulp

gulp 是基于 node 实现的，那么我们就需要先安装 node。

> Node 是一个基于Chrome JavaScript V8引擎建立的一个平台，可以利用它实现 Web服务，做类似PHP的事。

打开 https://nodejs.org/ 点击绿色的 **INSTALL** 按钮下载安装 node。

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/10)


使用终端/命令行
-------------

## 命令行
在 Windows 中可按 <kbd>徽标键</kbd>（alt键左边）+ <kbd>R</kbd> 打开输入 `cmd` + <kbd>Enter</kbd> 打开命令行。

## 终端(Mac)
打开 Launchpad（像火箭一样的图标），在屏幕上方搜索框中输入 `终端` + <kbd>Enter</kbd> 打开终端。

## 查看 node 版本号
在终端/命令行中输入 `node -v` 检测node是否安装成功，安装成功会显示出 node 的版本号。

## 跳转目录
终端/命令行 中可使用 `cd 目录名` 跳转至指定目录，Mac 中还可以使用 `ls` 查看当前目录下的文件列表。

### Windows
Windows 下可使用如下命令跳转至指定目录：

```
// 跳转至 C 盘根目录
cd c:\
// 跳转至当前目录的 demo 文件夹
cd demo
// 跳转至上一级
cd ..
```

### Mac
Mac 中建议只在 Documents 目录下进行文件操作。

```
// 跳转至文档目录
cd /Users/你的用户名/Documents/
// 或第一次打开终端时直接输入
cd Documents
// 查看目录下文件列表
ls
// 创建文件夹
mkdir demo
// 跳转至当前目录下的 demo 文件夹
cd demo
// 跳转至上级目录
cd ..
```

## 退出运行状态
如果你在命令行中启动了一些一直运行的命令，你的命令行会进入“运行”状态，此时你不可以在命令行进行其他操作。可通过 `Ctrl + C` 停止 gulp。（Mac 中使用 `control + C`）

后面的章节中如果代码中存在 `gulp.watch` 并在命令行运行了 `gulp` 则需要使用 `Ctrl + C` 退出任务。

npm 模块管理器
-------------
如果你了解 npm 则跳过此章节

若你不了解npm 请阅读 [npm模块管理器](http://javascript.ruanyifeng.com/nodejs/npm.html)

安装 gulp
----

npm 是 node 的包管理工具，可以利用它安装 gulp 所需的包。（在安装 node 时已经自动安装了 npm）

在命令行输入

```
npm install -g gulp 
```

若一直没安装成功，请[使用 cnpm 安装](https://github.com/nimojs/blog/issues/20)(npm的国内加速镜像)

意思是：使用 npm 安装全局性的(`-g`) gulp 包。

> 如果你安装失败，请输入`sudo npm install -g gulp `使用管理员权限安装。（可能会要求输入密码）

安装时请注意命令行的提示信息，安装完成后可在命令行输入 `gulp -v` 以确认安装成功。

至此，我们完成了准备工作。接着让 gulp 开始帮我们干活吧！

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/10)

# 压缩JS

压缩 js 代码可降低 js 文件大小，提高页面打开速度。在不利用 gulp 时我们需要通过各种工具手动完成压缩工作。

所有的 gulp 代码编写都可以看做是将规律转化为代码的过程。

**规律**
> 找到 `js/` 目录下的所有 js 文件，压缩它们，将压缩后的文件存放在 `dist/js/` 目录下。

## 操作步骤

你可以 [下载所有示例代码](https://github.com/nimojs/gulp-book/archive/master.zip) 或 [在线查看代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter2)

**建议**：你可以只阅读下面的代码与注释或同时阅读代码解释

gulp 的所有配置代码都写在 `gulpfile.js` 文件。

### 新建`gulpfile.js`文件

```
chapter2
└── gulpfile.js
```


### `gulpfile.js` 中编码

```js
// 获取 gulp
var gulp = require('gulp')
```

> `require()` 是 node （CommonJS）中获取模块的语法。
> 
> 在 gulp 中你只需要理解 `require()` 可以获取模块。


### 获取`gulp-uglify`组件

```js
// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify')
```


### 创建压缩任务

```js
// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('script', function() {
    // 1. 找到文件
    gulp.src('js/*.js')
    // 2. 压缩文件
        .pipe(uglify())
    // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'))
})
```

- `gulp.task(name, fn)` - 定义任务，第一个参数是任务名，第二个参数是任务内容。
- `gulp.src(path)` - 选择文件，传入参数是文件路径。
- `gulp.dest(path)` - 输出文件
- `gulp.pipe()` - 管道，你可以暂时将 pipe 理解为将操作加入执行队列

参考：[gulp API文档](http://www.gulpjs.com.cn/docs/api/)

### 进入项目目录

打开命令行使用 `cd` 命令跳转至 `gulpfile.js` 文件所在目录。

例如我的 `gulpfile.js` 文件保存在 `C:\gulp-book\demo\chapter2\gulpfile.js`。

那么就需要在命令行输入
```
cd C:\gulp-book\demo\chapter2
```

> Mac 用户可使用 `cd Documents/gulp-book/demo/chapter2/` 跳转


### 使用命令行运行任务

在控制台输入 `gulp 任务名` 可运行任务，此处我们输入 `gulp script` 回车。

注意：输入 `gulp script` 后命令行将会提示错误信息
```
// 在命令行输入
gulp script

Error: Cannot find module 'gulp-uglify'
    at Function.Module._resolveFilename (module.js:338:15)
    at Function.Module._load (module.js:280:25)
```

`Cannot find module 'gulp-uglify'` 没有找到 `gulp-uglify` 模块。


### 安装 `gulp-uglify` 模块

因为我们并没有安装 `gulp-uglify` 模块到本地，所以找不到此模块。

使用 npm 安装 `gulp-uglify` 到本地

```
npm install gulp-uglify
```

安装成功后你会看到如下信息：

```
gulp-uglify@1.1.0 node_modules/gulp-uglify
├── deepmerge@0.2.7
├── uglify-js@2.4.16 (uglify-to-browserify@1.0.2, async@0.2.10, source-map@0.1.34, optimist@0.3.7)
├── vinyl-sourcemaps-apply@0.1.4 (source-map@0.1.43)
├── through2@0.6.3 (xtend@4.0.0, readable-stream@1.0.33)
└── gulp-util@3.0.4 (array-differ@1.0.0, beeper@1.0.0, array-uniq@1.0.2, object-assign@2.0.0, lodash._reinterpolate@3.0.0, lodash._reescape@3.0.0, lodash._reevaluate@3.0.0, replace-ext@0.0.1, minimist@1.1.1, chalk@1.0.0, lodash.template@3.3.2, vinyl@0.4.6, multipipe@0.1.2, dateformat@1.0.11)
chapter2 $
```

在你的文件夹中会新增一个 `node_modules` 文件夹，这里面存放着 npm 安装的模块。

目录结构：
```
├── gulpfile.js
└── node_modules
    └── gulp-uglify
```

接着输入 `gulp script` 执行任务

```
gulp script
[13:34:57] Using gulpfile ~/Documents/code/gulp-book/demo/chapter2/gulpfile.js
[13:34:57] Starting 'script'...
[13:34:57] Finished 'script' after 6.13 ms
```

### 编写 js 文件

我们发现 gulp 没有进行任何压缩操作。因为没有js这个目录，也没有 js 目录下的 `.js` 后缀文件。

创建 `a.js` 文件，并编写如下内容

```
// a.js
function demo (msg) {
    alert('--------\r\n' + msg + '\r\n--------')
}

demo('Hi')
```

目录结构：
```
├── gulpfile.js
├──  js
│   └── a.js
└── node_modules
    └── gulp-uglify
```

接着在命令行输入 `gulp script` 执行任务

gulp 会在命令行当前目录下创建 `dist/js/` 文件夹，并创建压缩后的 `a.js` 文件。

目录结构：
```
├── gulpfile.js
├──  js
│   └── a.js
├──  dist
│   └── js
│       └── a.js
└── node_modules
    └── gulp-uglify
```

[dist/js/a.js](https://github.com/nimojs/gulp-book/blob/master/demo/chapter2/dist/js/a.js)
```js
function demo(n){alert("--------\r\n"+n+"\r\n--------")}demo("Hi");
```


### 检测代码修改自动执行任务

`js/a.js`一旦有修改 就必须重新在命令行输入 `gulp script` ，这很麻烦。

可以使用 `gulp.watch(src, fn)` 检测指定目录下文件的修改后执行任务。

在 `gulpfile.js` 中编写如下代码：
```
// 监听文件修改，当文件被修改则执行 script 任务
gulp.watch('js/*.js', ['script']);
```

但是没有命令可以运行 `gulp.watch()`，需要将 `gulp.watch()` 包含在一个任务中。

```
// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('js/*.js', ['script'])
})
```

接在在命令行输入 `gulp auto`，自动监听 `js/*.js` 文件的修改后压缩js。

```
$gulp auto
[21:09:45] Using gulpfile ~/Documents/code/gulp-book/demo/chapter2/gulpfile.js
[21:09:45] Starting 'auto'...
[21:09:45] Finished 'auto' after 9.19 ms
```

此时修改 `js/a.js` 中的代码并保存。命令行将会出现提示，表示检测到文件修改并压缩文件。

```
[21:11:01] Starting 'script'...
[21:11:01] Finished 'script' after 2.85 ms
```
至此，我们完成了 gulp 压缩 js 文件的自动化代码编写。

**注意：**使用 `gulp.watch` 后你的命令行会进入“运行”状态，此时你不可以在命令行进行其他操作。可通过 `Ctrl + C` 停止 gulp。

> Mac 下使用 `control + C` 停止 gulp

### 使用定义默认任务

> gulp.task('default', fn)

增加如下代码

```js
gulp.task('default', ['script', 'auto']);
```

此时你可以在命令行直接输入 `gulp` +回车，运行 `script` 和 `auto` 任务。

最终代码如下：

```js
// 获取 gulp
var gulp = require('gulp')

// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify')

// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('script', function() {
    // 1. 找到文件
    gulp.src('js/*.js')
    // 2. 压缩文件
        .pipe(uglify())
    // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'))
})

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('js/*.js', ['script'])
})


// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 script 任务和 auto 任务
gulp.task('default', ['script', 'auto'])
```

去除注释后，你会发现只需要 11 行代码就可以让 gulp 自动监听 js 文件的修改后压缩代码。但是还有还有一些性能问题和缺少容错性，将在后面的章节详细说明。


你可以访问 [gulp-uglify](https://github.com/terinjokes/gulp-uglify) 以查看更多用法。

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/11)

# 压缩 CSS

压缩 css 代码可降低 css 文件大小，提高页面打开速度。

我们接着将规律转换为 gulp 代码

**规律**

> 找到 `css/` 目录下的所有 css 文件，压缩它们，将压缩后的文件存放在 `dist/css/` 目录下。

## 操作步骤

你可以 [下载所有示例代码](https://github.com/nimojs/gulp-book/archive/master.zip) 或 [在线查看代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter3)

当熟悉 [使用 gulp 压缩 JS](chapter2.md) 的方法后，配置压缩 CSS 的 gulp 代码就变得很轻松。


### 安装 gulp-minify-css

提示：你需要使用命令行的 `cd` 切换到对应目录后进行安装操作。

[学习使用命令行](chapter1.md)

在命令行输入

```
npm install gulp-minify-css
```

安装成功后你会看到如下信息：(安装时间可能会比较长)

```
gulp-minify-css@1.0.0 node_modules/gulp-minify-css
├── object-assign@2.0.0
├── vinyl-sourcemaps-apply@0.1.4 (source-map@0.1.43)
├── clean-css@3.1.8 (commander@2.6.0, source-map@0.1.43)
├── through2@0.6.3 (xtend@4.0.0, readable-stream@1.0.33)
├── vinyl-bufferstream@1.0.1 (bufferstreams@1.0.1)
└── gulp-util@3.0.4 (array-differ@1.0.0, beeper@1.0.0, array-uniq@1.0.2, lodash._reescape@3.0.0, lodash._reinterpolate@3.0.0, lodash._reevaluate@3.0.0, replace-ext@0.0.1, minimist@1.1.1, multipipe@0.1.2, vinyl@0.4.6, chalk@1.0.0, lodash.template@3.3.2, dateformat@1.0.11)
```

### 创建 `gulpfile.js` 文件

在对应目录创建 `gulpfile.js` 文件并写入如下内容：

```js
// 获取 gulp
var gulp = require('gulp')

// 获取 minify-css 模块（用于压缩 CSS）
var minifyCSS = require('gulp-minify-css')

// 压缩 css 文件
// 在命令行使用 gulp css 启动此任务
gulp.task('css', function () {
    // 1. 找到文件
    gulp.src('css/*.css')
    // 2. 压缩文件
        .pipe(minifyCSS())
    // 3. 另存为压缩文件
        .pipe(gulp.dest('dist/css'))
})

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 css 任务
    gulp.watch('css/*.css', ['css'])
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 css 任务和 auto 任务
gulp.task('default', ['css', 'auto'])
```

你可以访问 [gulp-minify-css](https://github.com/jonathanepollack/gulp-minify-css) 以查看更多用法。

### 创建 css 文件

在 `gulpfile.js` 对应目录创建 `css` 文件夹，并在 `css/` 目录下创建 `a.css` 文件。

```css
/* a.css */
body a{
    color:pink;
}
```


### 运行 gulp 查看效果

在命令行输入 `gulp` +回车

你将看到命令行出现如下提示

```
gulp
[17:01:19] Using gulpfile ~/Documents/code/gulp-book/demo/chapter3/gulpfile.js
[17:01:19] Starting 'css'...
[17:01:19] Finished 'css' after 6.21 ms
[17:01:19] Starting 'auto'...
[17:01:19] Finished 'auto' after 5.42 ms
[17:01:19] Starting 'default'...
[17:01:19] Finished 'default' after 5.71 μs
```

gulp 会创建 `dist/css` 目录，并创建 `a.css` 文件，此文件存放压缩后的 css 代码。
[dist/css/a.css](https://github.com/nimojs/gulp-book/blob/master/demo/chapter3/dist/css/a.css)

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/12)

# 压缩图片

压缩 图片文件可降低文件大小，提高图片加载速度。

找到规律转换为 gulp 代码

**规律**

> 找到 `images/` 目录下的所有文件，压缩它们，将压缩后的文件存放在 `dist/images/` 目录下。

## 操作步骤

你可以 [下载所有示例代码](https://github.com/nimojs/gulp-book/archive/master.zip) 或 [在线查看代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter4)



### 安装 gulp-imagemin

提示：你需要使用命令行的 `cd` 切换至对应目录再进行安装操作和 gulp 启动操作。

在命令行输入

```
npm instal gulp-imagemin
```

安装成功后你会看到如下信息：(安装时间可能会比较长)

```
gulp-imagemin@2.2.1 node_modules/gulp-imagemin
├── object-assign@2.0.0
├── pretty-bytes@1.0.3 (get-stdin@4.0.1)
├── chalk@1.0.0 (escape-string-regexp@1.0.3, ansi-styles@2.0.1, supports-color@1.3.1, has-ansi@1.0.3, strip-ansi@2.0.1)
├── through2-concurrent@0.3.1 (through2@0.6.3)
├── gulp-util@3.0.4 (array-differ@1.0.0, beeper@1.0.0, array-uniq@1.0.2, lodash._reevaluate@3.0.0, lodash._reescape@3.0.0, lodash._reinterpolate@3.0.0, replace-ext@0.0.1, minimist@1.1.1, vinyl@0.4.6, through2@0.6.3, multipipe@0.1.2, lodash.template@3.3.2, dateformat@1.0.11)
└── imagemin@3.1.0 (get-stdin@3.0.2, optional@0.1.3, vinyl@0.4.6, through2@0.6.3, stream-combiner@0.2.1, concat-stream@1.4.7, meow@2.1.0, vinyl-fs@0.3.13, imagemin-svgo@4.1.2, imagemin-optipng@4.2.0, imagemin-jpegtran@4.1.0, imagemin-pngquant@4.0.0, imagemin-gifsicle@4.1.0)
```

### 创建 `gulpfile.js` 文件

在对应目录创建 `gulpfile.js` 文件并写入如下内容：

```js
// 获取 gulp
var gulp = require('gulp');

// 获取 gulp-imagemin 模块
var imagemin = require('gulp-imagemin')

// 压缩图片任务
// 在命令行输入 gulp images 启动此任务
gulp.task('images', function () {
    // 1. 找到图片
    gulp.src('images/*.*')
    // 2. 压缩图片
        .pipe(imagemin({
            progressive: true
        }))
    // 3. 另存图片
        .pipe(gulp.dest('dist/images'))
});

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 images 任务
    gulp.watch('images/*.*)', ['images'])
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 images 任务和 auto 任务
gulp.task('default', ['images', 'auto'])
```

你可以访问 [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin) 以查看更多用法。

### 在 `images/` 目录下存放图片

在 `gulpfile.js` 对应目录创建 `images` 文件夹，并在 `images/` 目录下存放图片。

你可以访问 [https://github.com/nimojs/gulp-book/tree/master/demo/chapter4/images/](https://github.com/nimojs/gulp-book/tree/master/demo/chapter4/images/) 下载示例图片


### 运行 gulp 查看效果

在命令行输入 `gulp` +回车

你将看到命令行出现如下提示

```
gulp
[18:10:42] Using gulpfile ~/Documents/code/gulp-book/demo/chapter4/gulpfile.js
[18:10:42] Starting 'images'...
[18:10:42] Finished 'images' after 5.72 ms
[18:10:42] Starting 'auto'...
[18:10:42] Finished 'auto' after 6.39 ms
[18:10:42] Starting 'default'...
[18:10:42] Finished 'default' after 5.91 μs
[18:10:42] gulp-imagemin: Minified 3 images (saved 25.83 kB - 5.2%)
```

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/13)

# 编译 LESS


> Sass 是一种 CSS 的开发工具，提供了许多便利的写法，大大节省了开发者的时间，使得 CSS 的开发，变得简单和可维护。

本章使用 `ruby-sass` 编译 css,若你没有安装 ruby 和 sass 请移步 [使用ruby.taobao安装 Sass](https://github.com/nimojs/blog/issues/14)

## 安装

```
npm install gulp-ruby-sass
```

## 基本用法

你可以 [下载所有示例代码](https://github.com/nimojs/gulp-book/archive/master.zip) 或 [在线查看代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6)

```js
// 获取 gulp
var gulp = require('gulp')
// 获取 gulp-ruby-sass 模块
var sass = require('gulp-ruby-sass')

// 编译sass
// 在命令行输入 gulp sass 启动此任务
gulp.task('sass', function() {
    return sass('sass/') 
    .on('error', function (err) {
      console.error('Error!', err.message);
   })
    .pipe(gulp.dest('dist/css'))
});


// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 images 任务
    gulp.watch('sass/**/*.scss', ['sass'])
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 sass 任务和 auto 任务
gulp.task('default', ['sass', 'auto'])
```

## 编译后的对比

Sass 代码和编译后的 CSS 代码

[sass/a.scss](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6/sass/a.scss)

```css
.sass{
    a{
        color:pink;
    }
}
```

[sass/import.scss](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6/sass/import.scss)


```css
@import "a.scss";
.import{
    a{
        color:red;
    }
}
```

[sass/a.css](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6/dist/css/a.css)

```css
.sass a {
  color: pink;
}
```

[sass/import.css](https://github.com/nimojs/gulp-book/tree/master/demo/chapter6/dist/css/import.css)

```css
.sass a {
  color: pink;
}
.import a{
  color: red;
}
```

[访问论坛获取帮助](https://github.com/nimojs/gulp-book/issues/15)

# gulp 开发一个项目

- [stream-combiner2](https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md)
- [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps)
- [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer/blob/master/package.json)

并将之前所有章节的内容组合起来编写一个前端项目所需的 gulp 代码。

你可以在 [nimojs/gulp-demo](https://github.com/nimojs/gulp-demo) 查看完整代码。

若你不了解npm 请务必阅读 [npm模块管理器](http://javascript.ruanyifeng.com/nodejs/npm.html)

## package.json


如果你熟悉 npm 则可以利用 `package.json` 保存所有 `npm install --save-dev gulp-xxx` 模块依赖和模块版本。

在命令行输入

```
npm init
```

会依次要求补全项目信息，不清楚的可以直接回车跳过
```
name: (gulp-demo) 
version: (1.0.0) 
description: 
entry point: (index.js) 
test command: 
...
...
Is this ok? (yes) 
```

最终会在当前目录中创建 `package.json` 文件并生成类似如下代码：
```js
{
  "name": "gulp-demo",
  "version": "0.0.0",
  "description": "",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/nimojs/gulp-demo.git"
  },
  "keywords": [
    "gulp",
  ],
  "author": "nimojs <nimo.jser@gmail.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/nimojs/gulp-demo/issues"
  },
  "homepage": "https://github.com/nimojs/gulp-demo"
}
```

## 安装依赖

安装 gulp 到项目（防止全局 gulp 升级后与此项目 `gulpfile.js` 代码不兼容）
```
npm install gulp --save-dev
```

此时打开 `package.json` 会发现多了如下代码

```js
"devDependencies": {
    "gulp": "^3.8.11"
}
```

声明此项目的开发依赖 gulp

接着安装其他依赖：

> 安装模块较多，请耐心等待，若一直安装失败可使用[npm.taobao.org](http://npm.taobao.org/)


```
npm install gulp-uglify gulp-watch-path stream-combiner2 gulp-sourcemaps gulp-minify-css gulp-autoprefixer gulp-less gulp-ruby-sass gulp-imagemin gulp-util --save-dev
```
此时，[package.json](https://github.com/nimojs/gulp-demo/blob/master/package.json) 将会更新
```js
"devDependencies": {
    "colors": "^1.0.3",
    "gulp": "^3.8.11",
    "gulp-autoprefixer": "^2.1.0",
    "gulp-imagemin": "^2.2.1",
    "gulp-less": "^3.0.2",
    "gulp-minify-css": "^1.0.0",
    "gulp-ruby-sass": "^1.0.1",
    "gulp-sourcemaps": "^1.5.1",
    "gulp-uglify": "^1.1.0",
    "gulp-watch-path": "^0.0.7",
    "stream-combiner2": "^1.0.2"
}
```

当你将这份 gulpfile.js 配置分享给你的朋友时，就不需要将 `node_modules/` 发送给他，他只需在命令行输入

```
npm install
```

就可以检测 `package.json` 中的 `devDependencies` 并安装所有依赖。

## 设计目录结构

我们将文件分为2类，一类是源码，一类是编译压缩后的版本。文件夹分别为 `src` 和 `dist`。(注意区分 `dist` 和 ·`dest` 的区别)

```
└── src/
│
└── dist/
```

`dist/` 目录下的文件都是根据 `src/` 下所有源码文件构建而成。

在 `src/` 下创建前端资源对应的的文件夹

```
└── src/
    ├── less/    *.less 文件
    ├── sass/    *.scss *.sass 文件
    ├── css/     *.css  文件
    ├── js/      *.js 文件
    ├── fonts/   字体文件
    └── images/   图片
└── dist/
```

你可以点击 [nimojs/gulp-demo](https://github.com/nimojs/gulp-demo/archive/master.zip) 下载本章代码。

## 让命令行输出的文字带颜色

gulp 自带的输出都带时间和颜色，这样很容易识别。我们利用 [gulp-util](https://github.com/gulpjs/gulp-util) 实现同样的效果。

```js
var gulp = require('gulp')
var gutil = require('gulp-util')

gulp.task('default', function () {
    gutil.log('message')
    gutil.log(gutil.colors.red('error'))
    gutil.log(gutil.colors.green('message:') + "some")
})
```
使用 `gulp` 启动默认任务以测试
![gulp-util](https://cloud.githubusercontent.com/assets/3949015/7137629/a1def1b8-e2ed-11e4-83e0-5a6adb22de6f.png)

## 配置 JS 任务

### gulp-uglify

检测`src/js/`目录下的 js 文件修改后，压缩 `js/` 中所有 js 文件并输出到 `dist/js/` 中

```js
var uglify = require('gulp-uglify')

gulp.task('uglifyjs', function () {
    gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
})

gulp.task('default', function () {
    gulp.watch('src/js/**/*.js', ['uglifyjs'])
})
```

`src/js/**/*.js` 是 glob 语法。[百度百科：glob模式](http://baike.baidu.com/view/4019153.htm) 、[node-glob](https://github.com/isaacs/node-glob)

在命令行输入 `gulp` 后会出现如下消息，表示已经启动。
```ruby
[20:39:50] Using gulpfile ~/Documents/code/gulp-book/demo/chapter7/gulpfile.js
[20:39:50] Starting 'default'...
[20:39:50] Finished 'default' after 13 ms
```


此时编辑 [src/js/log.js](https://github.com/nimojs/gulp-demo/blob/master/src/js/log.js) 文件并保存，命令行会出现如下消息，表示检测到 `src/js/**/*.js` 文件修改后重新编译所有 js。

```ruby
[20:39:52] Starting 'js'...
[20:39:52] Finished 'js' after 14 ms
```

### gulp-watch-path
此配置有个性能问题，当 `gulp.watch` 检测到  `src/js/` 目录下的js文件有修改时会将所有文件全部编译。实际上我们只需要重新编译被修改的文件。

简单介绍 `gulp.watch` 第二个参数为 `function` 时的用法。

```js
gulp.watch('src/js/**/*.js', function (event) {
    console.log(event);
    /*
    当修改 src/js/log.js 文件时
    event {
        // 发生改变的类型，不管是添加，改变或是删除
        type: 'changed', 
        // 触发事件的文件路径
        path: '/Users/nimojs/Documents/code/gulp-book/demo/chapter7/src/js/log.js'
    }
    */
})
```

我们可以利用 `event` 给到的信息，检测到某个 js 文件被修改时，只编写当前修改的 js 文件。

可以利用 `gulp-watch-path` 配合 `event` 获取编译路径和输出路径。

```js
var watchPath = require('gulp-watch-path')

gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')
        /*
        paths
            { srcPath: 'src/js/log.js',
              srcDir: 'src/js/',
              distPath: 'dist/js/log.js',
              distDir: 'dist/js/',
              srcFilename: 'log.js',
              distFilename: 'log.js' }
        */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(uglify())
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('default', ['watchjs'])
```

[use-gulp-watch-path 完整代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter7/use-gulp-watch-path.js)

**`watchPath(event, search, replace, distExt)`**

| 参数 | 说明 |
|--------|--------|
|    event    |`gulp.watch` 回调函数的 `event`|
|    search   |需要被替换的起始字符串|
|    replace  |第三个参数是新的的字符串|
|   distExt   |扩展名(非必填)|


此时编辑 [src/js/log.js](https://github.com/nimojs/gulp-demo/blob/master/src/js/log.js) 文件并保存，命令行会出现消息，表示检测到 `src/js/log.js` 文件修改后只重新编译 `log.js`。

```ruby
[21:47:25] changed src/js/log.js
[21:47:25] Dist dist/js/log.js
```

你可以访问 [gulp-watch-path](https://github.com/nimojs/gulp-watch-path) 了解更多。

### stream-combiner2

编辑 `log.js` 文件时，如果文件中有 js 语法错误时，gulp 会终止运行并报错。

当 log.js 缺少 `)`
```js
log('gulp-book'
```

并保存文件时出现如下错误，但是错误信息不全面。而且还会让 gulp 停止运行。

```
events.js:85
      throw er; // Unhandled 'error' event
            ^
Error
    at new JS_Parse_Error (/Users/nimojs/Documents/code/gulp-book/demo/chapter7/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:189:18)
...
...
js_error (/Users/nimojs/Documents/code/gulp-book/demo/chapter7/node_modules/gulp-
-book/demo/chapter7/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:1165:20)
    at maybe_unary (/Users/nimojs/Documents/code/gulp-book/demo/chapter7/node_modules/gulp-uglify/node_modules/uglify-js/lib/parse.js:1328:19)

```

应对这种情况，我们可以使用 [Combining streams to handle errors](https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md) 文档中推荐的 [stream-combiner2](https://github.com/substack/stream-combiner2)  捕获错误信息。

```js
var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}
var combiner = require('stream-combiner2')

gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')
        /*
        paths
            { srcPath: 'src/js/log.js',
              srcDir: 'src/js/',
              distPath: 'dist/js/log.js',
              distDir: 'dist/js/',
              srcFilename: 'log.js',
              distFilename: 'log.js' }
        */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            uglify(),
            gulp.dest(paths.distDir)
        ])

        combined.on('error', handleError)
    })
})
```

[watchjs-1 完整代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter7/watchjs-1.js)

此时当编译错误的语法时，命令行会出现错误提示。而且不会让 gulp 停止运行。

```
changed:src/js/log.js
dist:dist/js/log.js
--------------
Error!
fileName: /Users/nimojs/Documents/code/gulp-book/demo/chapter7/src/js/log.js
lineNumber: 7
message: /Users/nimojs/Documents/code/gulp-book/demo/chapter7/src/js/log.js: Unexpected token eof «undefined», expected punc «,»
plugin: gulp-uglify
```

### gulp-sourcemaps

JS 压缩前和压缩后比较
```js
// 压缩前
var log = function (msg) {
    console.log('--------');
    console.log(msg)
    console.log('--------');
}
log({a:1})
log('gulp-book')

// 压缩后
var log=function(o){console.log("--------"),console.log(o),console.log("--------")};log({a:1}),log("gulp-book");
```

压缩后的代码不存在换行符和空白符，导致出错后很难调试，好在我们可以使用 [sourcemap](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html) 帮助调试

```js
var sourcemaps = require('gulp-sourcemaps')
// ...
var combined = combiner.obj([
    gulp.src(paths.srcPath),
    sourcemaps.init(),
    uglify(),
    sourcemaps.write('./'),
    gulp.dest(paths.distDir)
])
// ...
```

[watchjs-2 完整代码](https://github.com/nimojs/gulp-book/tree/master/demo/chapter7/watchjs-1.js)

此时 `dist/js/` 中也会生成对应的 `.map` 文件，以便使用 Chrome 控制台调试代码 [在线文件示例：src/js/](https://github.com/nimojs/gulp-demo/blob/master/src/js/)

-----

至此，我们完成了检测文件修改后压缩 JS 的 gulp 任务配置。

有时我们也需要一次编译所有 js 文件。可以配置 `uglifyjs` 任务。

```js
gulp.task('uglifyjs', function () {
    var combined = combiner.obj([
        gulp.src('src/js/**/*.js'),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write('./'),
        gulp.dest('dist/js/')
    ])
    combined.on('error', handleError)
})
```

在命令行输入 `gulp uglifyjs` 以压缩 `src/js/` 下的所有 js 文件。

## 配置 CSS 任务

有时我们不想使用 LESS 或 SASS而是直接编写 CSS，但我们需要压缩 CSS 以提高页面加载速度。

### gulp-minify-css

按照本章中压缩 JS 的方式，先编写 `watchcss` 任务

```js
var minifycss = require('gulp-minify-css')

gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('default', ['watchjs','watchcss'])
```

### gulp-autoprefixer

autoprefixer 解析 CSS 文件并且添加浏览器前缀到CSS规则里。
通过示例帮助理解 

autoprefixer 处理前：
```css
.demo {
    display:flex;
}
```

autoprefixer 处理后：
```css
.demo {
    display:-webkit-flex;
    display:-ms-flexbox;
    display:flex;
}
```
你只需要关心编写标准语法的 css，autoprefixer 会自动补全。

在 watchcss 任务中加入 autoprefixer:

```js
gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})
```

更多 autoprefixer 参数请查看 [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)

有时我们也需要一次编译所有 css 文件。可以配置 `minifyss` 任务。

```js
gulp.task('minifycss', function () {
    gulp.src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
          browsers: 'last 2 versions'
        }))
        .pipe(minifycss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css/'))
})
```

在命令行输入 `gulp minifyss` 以压缩 `src/css/` 下的所有 .css 文件并复制到 `dist/css` 目录下

## 配置 Less 任务

参考配置 JavaScript 任务的方式配置 less 任务

```js
var less = require('gulp-less')

gulp.task('watchless', function () {
    gulp.watch('src/less/**/*.less', function (event) {
        var paths = watchPath(event, 'src/less/', 'dist/css/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            autoprefixer({
              browsers: 'last 2 versions'
            }),
            less(),
            minifycss(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ])
        combined.on('error', handleError)
    })
})

gulp.task('lesscss', function () {
    var combined = combiner.obj([
            gulp.src('src/less/**/*.less'),
            sourcemaps.init(),
            autoprefixer({
              browsers: 'last 2 versions'
            }),
            less(),
            minifycss(),
            sourcemaps.write('./'),
            gulp.dest('dist/css/')
        ])
    combined.on('error', handleError)
})

gulp.task('default', ['watchjs', 'watchcss', 'watchless'])
```

## 配置 Sass 任务

参考配置 JavaScript 任务的方式配置 Sass 任务

```js
gulp.task('watchsass',function () {
    gulp.watch('src/sass/**/*', function (event) {
        var paths = watchPath(event, 'src/sass/', 'dist/css/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        sass(paths.srcPath)
            .on('error', function (err) {
                console.error('Error!', err.message);
            })
            .pipe(sourcemaps.init())
            .pipe(minifycss())
            .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('sasscss', function () {
        sass('src/sass/')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(sourcemaps.init())
        .pipe(minifycss())
        .pipe(autoprefixer({
          browsers: 'last 2 versions'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
})

gulp.task('default', ['watchjs', 'watchcss', 'watchless', 'watchsass', 'watchsass'])
```

## 配置 image 任务

```js
var imagemin = require('gulp-imagemin')

gulp.task('watchimage', function () {
    gulp.watch('src/images/**/*', function (event) {
        var paths = watchPath(event,'src/','dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('image', function () {
    gulp.src('src/images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
})
```

## 配置文件复制任务

复制 `src/fonts/` 文件到 `dist/` 中

```js
gulp.task('watchcopy', function () {
    gulp.watch('src/fonts/**/*', function (event) {
        var paths = watchPath(event)

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('copy', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
})

gulp.task('default', ['watchjs', 'watchcss', 'watchless', 'watchsass', 'watchimage', 'watchcopy'])
```

## 结语

[完整代码](https://github.com/nimojs/gulp-demo/tree/master/gulpfile.js)
