Backbone.js(1.1.2) 
--------------------------

转载： http://www.css88.com/doc/backbone/#Utility

# 文档声明：

- 根据官方最新的1.1.2版本做了翻译
- Backbone.js (0.5.3) 文档请移步http://www.css88.com/doc/backbone-0.5.3/；
翻译水平有限，如果您有任何建议，或者拍砖，欢迎在微博上@愚人码头 联系我。
- Backbone.js为复杂WEB应用程序提供模型(models)、集合(collections)、视图(views)的结构。其中模型用于绑定键值数据和自定义事件；集合附有可枚举函数的丰富API； 视图可以声明事件处理函数，并通过RESRful JSON接口连接到应用程序。


此项目托管在 GitHub 上, 并且提供 带注释的源码, 在线的 测试套件, 应用示例, 教程列表 还有一个 实际应用项目的超长列表, 这些项目都使用了 Backbone. Backbone 允许在 MIT 软件协议 下使用.

你可以在GitHub issues 页面及#documentcloud频道下的Freenode IRC中 报告 bug 和 讨论功能, 在Google Group合wiki页面中提出问题，或在twitter上 @documentcloud。

Backbone是 DocumentCloud 的一个开源组件.

Backbone唯一重度依赖的是Underscore.js( >= 1.5.0)。基于RESTful（一个架构样式的网络系统）的约束，histroy的支持依赖于Backbone.Router ，DOM处理依赖于 Backbone.View，包括jQuery ( >= 1.11.0), 和 json2.js对旧的IE浏览器的支持。（模仿Underscore 和 jQuery 的APIs，例如 Lo-Dash 和 Zepto，在不同的兼容性下也一样能运行）

# 介绍（Introduction）

当我们开发含有大量Javascript的web应用程序时，首先你需要做的事情之一便是停止向DOM对象附加数据。 通过复杂多变的jQuery选择符和回调函数很容易创建Javascript应用程序，包括在HTML UI，Javascript逻辑和数据之间保持同步，都不复杂。 但对富客户端应用来说，良好的架构通常是有很多益处的。

通过Backbone，你可以将数据呈现为 Models, 你可以对模型进行创建，验证和销毁，以及将它保存到服务器。 任何时候只要UI事件引起模型内的属性变化，模型会触发"change"事件； 所有显示模型数据的 Views 会接收到该事件的通知，继而视图重新渲染。 你无需查找DOM来搜索指定id的元素去手动更新HTML。 — 当模型改变了，视图便会自动变化。

某种意义上说，在用javaScript来创建web项目时，Backbone试图定义一组最小而高效的集合，包括了数据结构（models（模型） 和 collections（集合））和用户接口（views（视图） 和 URLS）。在web开发环境里，到处都是框架（帮你写好了一切），不过这些库需要你的网站在构建的时候符合该框架的样子，风格，默认的行为。但是，Backbone还是作为一个工具，让你可以随心所欲的设计你的网站。

如果你不懂Backbone或者不确定Backbone能否帮助到你，先运行一下 列表中基于Backbone的项目。


# 升级到 1.1

从Backbone 0.9.X系列版本升级到 1.1 应该是相当容易的。如果你从旧版本升级， 一定要检查更新日志。简单地说，一些大规模的重大更改是：

- 如果你想漂亮的更新一个Collection(集合)的内容，增加新的models（模型），删除丢失，和合并那些已经存在，你现在可以调用set(以前叫做"update") ，Model（模型）类似的操作也调用set。这是目前默认的，当你在collection（集合）上调用fetch时。为了得到旧的行为，传递{reset: true}。

- 如果你的URL片段中有字符，需要URL编码，Backbone现在会在你路由处理程序接收它们作为参数前为你解码（跨浏览器规范的行为）。

- 在0.9.x中，Backbone 事件有了两个新的方法：listenTo 和 stopListening， 这使得它能更容易地创建Views（视图）监听，当你想 remove view（视图）时，解除他们所有绑定的监听。

- model（模型）验证现在只默认执行在save中 —不再执行在set中，除非传递了{validate:true}选项。model（模型）验证现在会触发一个 "invalid"事件，而不是"error"事件。

- 在1.1中 ，Backbone Views（视图）不再有 options 参数自动附加在this.options上。如果你喜欢可以继续附加。

- 在1.1中 ，Collection的 add, remove, set, push, 和 shift 方法现在返回来自collection（集合）的 models（模型）(或 models)。

# Backbone.Events（事件）

Events 是一个可以融合到任何对象的模块, 给予 对象绑定和触发自定义事件的能力. Events 在绑定之前 不需要声明, 并且还可以传递参数. 比如:

```js
var object = {};

_.extend(object, Backbone.Events);

object.on("alert", function(msg) {
  alert("Triggered " + msg);
});

object.trigger("alert", "an event");
```

举个例子, 你可以定义一个事件调度程序，然后在你应用的不同地方调用，例如： `var dispatcher = _.clone(Backbone.Events)`

## on

> object.on(event, callback, [context])别名: bind 

在 object 上绑定一个callback回调函数。 只要event触发，该回调函数就会调用。如果你的一个页面含有大量的不同时间，我们约定使用冒号来为事件添加 命名空间 俗成地使用冒号来命名："poll:start", 或 "change:selection"。 事件字符串也可能是用空格分隔的多个事件列表（愚人码头注：即可以同时绑定多个事件，事件用空格分隔）...

> book.on("change:title change:author", ...);

当回调函数被调用时，通过可选的第三个参数可以为this提供一个context（上下文）值：`model.on('change', this.render, this)`（愚人码头注：即回调函数中的This，指向传递的第三个参数）。

当回调函数被绑定到特殊"all"事件时，任何事件的发生都会触发该回调函数，回调函数的第一个参数会传递该事件的名称。举个例子，将一个对象的所有事件代理到另一对象：

```js
proxy.on("all", function(eventName) {
  object.trigger(eventName);
});

```

所有Backbone事件方法还支持事件映射的语法， 作为可惜的位置参数：
```js 
book.on({
  "change:title": titleView.update,
  "change:author": authorPane.update,
  "destroy": bookView.remove
});
```

## off

> object.off([event], [callback], [context])别名: unbi nd 

从 object 对象移除先前绑定的 callback 函数。如果没有指定context（上下文），所有上下文下的这个回调函数将被移除。如果没有指定callback，所有绑定这个事件回调函数将被移除；如果没有指定event，所有事件的回调函数会被移除。

```js
// Removes just the `onChange` callback.
object.off("change", onChange);

// Removes all "change" callbacks.
object.off("change");

// Removes the `onChange` callback for all events.
object.off(null, onChange);

// Removes all callbacks for `context` for all events.
object.off(null, null, context);

// Removes all callbacks on `object`.
object.off();
```

需要注意的是，调用 `model.off()`，例如，这确实会删除model（模型）上所有的事件—包括Backbone内部用来统计的事件。

## trigger
> object.trigger(event, [*args]) 

触发给定 event或用空格隔开的事件的回调函数。后续传入 `trigger` 的参数会传递到触发事件的回调函数里。

## once
> object.once(event, callback, [context]) 

用法跟on很像，区别在于绑定的回调函数触发一次后就会被移除（愚人码头注：只执行一次）。简单的说就是“下次不在触发了，用这个方法”。

## listenTo
> object.listenTo(other, event, callback) 

让 object 监听 另一个（other）对象上的一个特定事件。不使用other.on(event, callback, object)，而使用这种形式的优点是：listenTo允许 object来跟踪这个特定事件，并且以后可以一次性全部移除它们。callback总是在object上下文环境中被调用。

> view.listenTo(model, 'change', view.render);

## stopListening

> object.stopListening([other], [event], [callback]) 

让 object 停止监听事件。如果调用不带参数的stopListening，可以移除 object 下所有已经registered(注册)的callback函数...，或者只删除指定对象上明确告知的监听事件，或者一个删除指定事件，或者只删除指定的回调函数。

```js
view.stopListening();
view.stopListening(model);
```

## listenToOnce

> object.listenToOnce(other, event, callback) 
用法跟 listenTo 很像，但是事件触发一次后callback将被移除。

## Catalog of Events（事件目录） 

下面是Backbone 内置事件的完整列表，带有参数。 你也可以在Models（模型），Collection（集合），Views（视图）上自由地触发这些事件，只要你认为合适。 收藏和意见，你认为合适。 Backbone 对象本身混入了Events，并且可用于触发任何全局事件，只要您的应用程序的需要。

- `add` (model, collection, options) — 当一个model（模型）被添加到一个collection（集合）时触发。
- `remove` (model, collection, options) — 当一个model（模型）从一个collection（集合）中被删除时触发。
- `reset` (collection, options) — 当该collection（集合）的全部内容已被替换时触发。
- `sort` (collection, options) — 当该collection（集合）已被重新排序时触发。
- `change` (model, options) — 当一个model（模型）的属性改变时触发。
- `change:[attribute]` (model, value, options) — 当一个model（模型）的某个特定属性被更新时触发。
- `destroy` (model, collection, options) —当一个model（模型）被destroyed（销毁）时触发。
- `request` (model_or_collection, xhr, options) — 当一个model（模型）或collection（集合）开始发送请求到服务器时触发。
- `sync` (model_or_collection, resp, options) — 当一个model（模型）或collection（集合）成功同步到服务器时触发。
- `error` (model_or_collection, resp, options) — 当一个model（模型）或collection（集合）的请求远程服务器失败时触发。
- `invalid` (model, error, options) — 当model（模型）在客户端 validation（验证）失败时触发。
- `route:[name]` (params) —  当一个特定route（路由）相匹配时通过路由器触发。
- `route` (route, params) — 当任何一个route（路由）相匹配时通过路由器触发。
- `route` (router, route, params) — 当任何一个route（路由）相匹配时通过history（历史记录）触发。
-  `all` — 所有事件发生都能触发这个特别的事件，第一个参数是触发事件的名称。

一般来说，事件触发（例如`model.set`，`collection.add`或者其他事件）后就会执行回调函数，但是如果你想阻止回调函数的执行，你可以传递{silent: true}作为参数。很多时候，这是一个好的方法。通过在回调函数里传输一个特定的判断参数，会让你的程序更加出色。 一般而言，事件触发（`model.set`, `collection.add`,等等...）后就会调用一个函数，但是如果你想阻止事件被触发， 您可以传递{silent: true}作为一个选项。注意，这中情况很少， 甚至从来没有， 一个好主意。 通过在选项中传递一个特定的标记，回调函数里传输一个特定的判断参数 并且选择忽略，会让你的程序更加出色。

# Backbone.Model（模型）

**Models（模型）** 是任何Javascript应用的核心，包括数据交互及与其相关的大量逻辑： 转换、验证、计算属性和访问控制。你可以用特定的方法扩展  
**Backbone.Model，Model** 也提供了一组基本的管理变化的功能。

下面的示例演示了如何定义一个模型，包括自定义方法、设置属性、以及触发该属性变化的事件。一旦运行此代码后，sidebar在浏览器的控制台就可用，这样你就可以充分发挥了。

```js
var Sidebar = Backbone.Model.extend({
  promptColor: function() {
    var cssColor = prompt("Please enter a CSS color:");
    this.set({color: cssColor});
  }
});

window.sidebar = new Sidebar;

sidebar.on('change:color', function(model, color) {
  $('#sidebar').css({background: color});
});

sidebar.set({color: 'white'});

sidebar.promptColor();
```

## extend

> Backbone.Model.extend(properties, [classProperties]) 
要创建自己的 Model 类，你可以扩展 Backbone.Model 并提供实例 properties(属性) ， 以及可选的可以直接注册到构造函数的classProperties(类属性)。

**extend** 可以正确的设置原型链，因此通过 extend 创建的子类 (subclasses) 也可以被深度扩展。

```js
var Note = Backbone.Model.extend({

  initialize: function() { ... },

  author: function() { ... },

  coordinates: function() { ... },

  allowedToEdit: function(account) {
    return true;
  }

});

var PrivateNote = Note.extend({

  allowedToEdit: function(account) {
    return account.owns(this);
  }

});
```

父类（super） 的简述：Javascript没有提供一种直接调用父类的方式 — 如果你要重载原型链中上层定义的同名函数，如 set, 或 save ， 并且你想调用父对象的实现，这时需要明确的调用它，类似这样：

```js
var Note = Backbone.Model.extend({
  set: function(attributes, options) {
    Backbone.Model.prototype.set.apply(this, arguments);
    ...
  }
});
```

## constructor / initializenew 

> Model([attributes], [options]) 

当创建model实例时，可以传入 属性 (attributes)初始值，这些值会被 set （设置）到 model。 如果定义了 initialize 函数，该函数会在model创建后执行。

```js
new Book({
  title: "One Thousand and One Nights",
  author: "Scheherazade"
});
```

在极少数的情况下，你可能需要去重写 constructor ，它可以让你替换你的model的实际构造函数。

```js
var Library = Backbone.Model.extend({
  constructor: function() {
    this.books = new Books();
    Backbone.Model.apply(this, arguments);
  },
  parse: function(data, options) {
    this.books.reset(data.books);
    return data.library;
  }
});
```

如果你传入`{collection: ...}` ，这个 options表示这个model属于哪个collection，且用于计算这个model的url。否则`model.collection` 这个属性会在你第一次添加model到一个collection的时候被自动添加。 需要注意的是相反的是不正确的，因为传递这个选项给构造函数将不会自动添加model到集合。有时这个是很有用的。

如果`{parse: true}`被作为一个option选项传递， attributes将在 set到model之前首先通过parse被转换。

## get
> model.get(attribute) 

从当前model中获取当前属性(attributes)值，比如： note.get("title")

## set
> model.set(attributes, [options]) 

向model设置一个或多个hash属性(attributes)。如果任何一个属性改变了model的状态，在不传入 {silent: true} 选项参数的情况下，会触发 "change" 事件，更改特定属性的事件也会触发。 可以绑定事件到某个属性，例如：change:title，及 change:content。

```js
note.set({title: "March 20", content: "In his eyes she eclipses..."});

book.set("title", "A Scandal in Bohemia");
```

## escape

> model.escape(attribute) 

与 get 类似，只是返回的是HTML转义后版本的model属性值。如果从model插入数据到HTML，使用 escape 取数据可以避免 XSS 攻击。

```js
var hacker = new Backbone.Model({
  name: "<script>alert('xss')</script>"
});

alert(hacker.escape('name'));
```

## has

> model.has(attribute) 

属性值为非 null 或非 undefined 时返回 true。

```js
if (note.has("title")) {
  ...
}
```

## unset

> model.unset(attribute, [options]) 

从内部属性散列表中删除指定属性(attribute)。 如果未设置 silent 选项，会触发 "change" 事件。

## clear
> model.clear([options]) 

从model中删除所有属性， 包括id属性。 如果未设置 silent 选项，会触发 "change" 事件。

## id

> model.id 

id是model的特殊属性，可以是任意字符串（整型 id 或 UUID）。在属性中设置的 id 会被直接拷贝到model属性上。 我们可以从集合（collections）中通过 id 获取model，另外 id 通常用于生成model的 URLs。

## idAttribute

> model.idAttribute 

一个model的唯一标示符，被储存在 id 属性下。如果使用一个不同的唯一的key直接和后端通信。可以设置Model的 idAttribute 到一个从key到 id 的一个透明映射中。

```js
var Meal = Backbone.Model.extend({
  idAttribute: "_id"
});

var cake = new Meal({ _id: 1, name: "Cake" });
alert("Cake id: " + cake.id);
```

## cid

> model.cid 

model的特殊属性，cid 或客户 id 是当所有model创建时自动产生的唯一标识符。 客户 ids 在model尚未保存到服务器之前便存在，此时model可能仍不具有最终的 id， 但已经需要在用户界面可见。

## attributes

> model.attributes 

attributes 属性是包含模型状态的内部散列表 — 通常（但不一定）JSON对象的形式表示在服务器上模型数据 。它通常是数据库中一个行的简单的序列，但它也可以是客户端的计算状态。

建议采用 set 更新 attributes而不要直接修改。  如果您想检索和获取模型属性的副本， 用 `_.clone(model.attributes)` 取而代之。

由于这样的事实： Events（事件）接受空格分隔事件列表， 但是属性名称不应该包括空格。

## changed

> model.changed 

changed属性是一个包含所有属性的内部散列，自最后 set 已改变。 自最后一组已改变。 请不要直接更新 changed，因为它的状态是由set内部维护。 changed的副本可从changedAttributes获得。

## defaults

> model.defaults or model.defaults() 

defaults 散列（或函数）用于为模型指定默认属性。 创建模型实例时，任何未指定的属性会被设置为其默认值。

```js
var Meal = Backbone.Model.extend({
  defaults: {
    "appetizer":  "caesar salad",
    "entree":     "ravioli",
    "dessert":    "cheesecake"
  }
});

alert("Dessert will be " + (new Meal).get('dessert'));
```

需要提醒的是，在 Javascript 中，对象是按引用传值的，因此如果包含一个对象作为默认值，它会被所有实例共享。可以定义 defaults为一个函数取代。

## toJSON

> model.toJSON([options]) 

返回一个模型的 attributes 浅拷贝副本的 JSON 字符串化形式。 它可用于模型的持久化、序列化，或者发送到服务之前的扩充。 该方法名称比较混乱，因为它事实上并不返回 JSON 字符串， 但这是对 JavaScript API 的 JSON.stringify 实现。

```js 
var artist = new Backbone.Model({
  firstName: "Wassily",
  lastName: "Kandinsky"
});

artist.set({birthday: "December 16, 1866"});

alert(JSON.stringify(artist));
```

## sync

> model.sync(method, model, [options]) 

使用 Backbone.sync 可以将一个模型的状态持续发送到服务器。 可以自定义行为覆盖。

## fetch

> model.fetch([options]) 

通过委托给Backbone.sync从服务器重置模型的状态。返回jqXHR。 如果模型从未填充数据时非常有用， 或者如果你想确保你有最新的服务器状态。 如果服务器的状态不同于当前属性的"change"事件将被触发。 接受 success 和 error回调的选项散列， 这两个回调都可以传递(model, response, options)作为参数。

```js
// 每隔 10 秒从服务器拉取数据以保持频道模型是最新的
setInterval(function() {
  channel.fetch();
}, 10000);
```

## save

> model.save([attributes], [options]) 

通过委托给Backbone.sync，保存模型到数据库（或替代持久化层）。 如果验证成功，返回jqXHR，否则为 false。 attributes散列（如set）应包含你想改变的属性 - 不涉及的键不会被修改 - 但是，该资源的一个完整表示将被发送到服务器。 至于set，你可能会传递单独的键和值，而不是一个哈希值。 如果模型有一个validate方法，并且验证失败， 该模型将不会被保存。 如果模型isNew， 保存将采用"create"（HTTP POST）， 如果模型在服务器上已经存在， 保存将采用"update"（HTTP PUT）。

相反，如果你只想将改变属性发送到服务器， 调用model.save(attrs, {patch: true})。 你会得到一个HTTP PATCH请求将刚刚传入的属性发送到服务器。

通过新的属性调用save 将立即触发一个"change"事件，一个"request"事件作为Ajax请求开始到服务器， 并且当服务器确认成功修改后立即触发 一个"sync"事件。 如果你想在模型上等待服务器设置新的属性，请传递{wait: true}。

在下面的例子中， 注意我们如何覆盖Backbone.sync的版本，在模型初次保存时接收到 "create"请求，第二次接收到 "update" 请求的。

```js
Backbone.sync = function(method, model) {
  alert(method + ": " + JSON.stringify(model));
  model.set('id', 1);
};

var book = new Backbone.Model({
  title: "The Rough Riders",
  author: "Theodore Roosevelt"
});

book.save();

book.save({author: "Teddy"});
```

save 支持在选项散列表中传入 success 和 error 回调函数， 回调函数支持传入 (model, response, options) 作为参数。 如果服务端验证失败，返回非 200 的 HTTP 响应码，将产生文本或 JSON 的错误内容。

```js
book.save("author", "F.D.R.", {error: function(){ ... }});
```

## destroy

> model.destroy([options]) 

通过委托给Backbone.sync，保存模型到数据库（或替代持久化层）。 通过委托一个HTTP DELETE请求给Backbone.sync破坏服务器上的模型。 返回一个jqXHR对象， 或者如果模型isNew，那么返回false。 选项散列表中接受 success 和 error 回调函数， 回调函数支持传入 (model, response, options) 作为参数。 在模型上触发 "destroy" 事件，该事件将会冒泡到任何包含这个模型的集合中， 一个"request"事件作为Ajax请求开始到服务器， 并且当服务器确认模型被删除后立即触发 一个"sync"事件。如果你想在集合中删除这个模型前等待服务器相应，请传递{wait: true}。

```js
book.destroy({success: function(model, response) {
  ...
}});
```

# Underscore 方法 (6) 
Backbone 代理了 Underscore.js用来给Backbone.Model提供 6 个对象函数。这里没有完全记录他们，但你可以看看Underscore文档中全部详情… (愚人码头注：下面链接已经替换成中文文档的地址)

- keys
- values
- pairs
- invert
- pick
- omit

```js
user.pick('first_name', 'last_name', 'email');
chapters.keys().join(', ');
```

## validate

> model.validate(attributes, options) 

这种方法是未定义的， 如果您有任何可以在JavaScript中执行的代码 并且我们鼓励你用你自定义验证逻辑覆盖它 。 默认情况下validate在save之前调用， 但如果传递了 {validate:true}，也可以在set之前调用。 validate方法是通过模型的属性，  选项和set 和 save是一样的。 如果属性是有效的， validate不返回验证任何东西;  如果它们是无效的， 返回一个你选择的错误。 它可以是一个用来显示的简单的字符串错误信息， 或一个以编程方式描述错误的完整错误对象。 如果validate返回一个错误， save不会继续， 并且在服务器上该模型的属性将不被修改。 校验失败将触发"invalid"事件， 并用此方法返回的值设置模型上的validationError属性。

```js
var Chapter = Backbone.Model.extend({
  validate: function(attrs, options) {
    if (attrs.end < attrs.start) {
      return "can't end before it starts";
    }
  }
});

var one = new Chapter({
  title : "Chapter One: The Beginning"
});

one.on("invalid", function(model, error) {
  alert(model.get("title") + " " + error);
});

one.save({
  start: 15,
  end:   10
});
```

"invalid"事件提供粗粒度的错误信息 在模型或集合层面上是很有用。

## validationError

> model.validationError 

用validate最后验证失败时返回的值。

## isValid

> model.isValid() 

运行validate来检查模型状态。
```js
var Chapter = Backbone.Model.extend({
  validate: function(attrs, options) {
    if (attrs.end < attrs.start) {
      return "can't end before it starts";
    }
  }
});

var one = new Chapter({
  title : "Chapter One: The Beginning"
});

one.set({
  start: 15,
  end:   10
});

if (!one.isValid()) {
  alert(one.get("title") + " " + one.validationError);
}
```

## url

> model.url() 

返回模型资源在服务器上位置的相对 URL 。 如果模型放在其它地方，可通过合理的逻辑重载该方法。 生成 URLs 的默认形式为：`"/[collection.url]/[id]"`， 如果模型不是集合的一部分，你可以通过指定明确的urlRoot覆盖。

由于是委托到 Collection#url 来生成 URL， 所以首先需要确认它是否定义过，或者所有模型共享一个通用根 URL 时，是否存在 urlRoot 属性。 例如，一个 id 为 101 的模型，存储在 url 为 `"/documents/7/notes"` 的 Backbone.Collection 中， 那么该模型的 URL 为：`"/documents/7/notes/101"`

## urlRoot

> model.urlRoot or model.urlRoot() 

如果使用的集合外部的模型，通过指定 urlRoot 来设置生成基于模型 id 的 URLs 的默认 url 函数。 `"[urlRoot]/id"`。通常情况下，你不会需要定义这一点。 需要注意的是urlRoot也可以是一个函数。

```js
var Book = Backbone.Model.extend({urlRoot : '/books'});

var solaris = new Book({id: "1083-lem-solaris"});

alert(solaris.url());
```

## parse

> model.parse(response, options) 

parse 会在通过 fetch 从服务器返回模型数据，以及 save 时执行。 传入本函数的为原始 response 对象，并且应当返回可以 set 到模型的属性散列表。 默认实现是自动进行的，仅简单传入 JSON 响应。 如果需要使用已存在的 API，或者更好的命名空间响应，可以重载它。

如果使用的3.1版本之前的 Rails 后端，需要注意 Rails's 默认的 to_json 实现已经包含了命名空间之下的模型属性。 对于无缝的后端集成环境禁用这种行为：

```js
ActiveRecord::Base.include_root_in_json = false
```

## clone

> model.clone() 

返回该模型的具有相同属性的新实例。

## isNew

> model.isNew() 

模型是否已经保存到服务器。 如果模型尚无 id，则被视为新的。

## hasChanged

> model.hasChanged([attribute]) 

标识模型从上次 set 事件发生后是否改变过。 如果传入 attribute ，当指定属性改变后返回 true。

注意，本方法以及接下来 change 相关的方法，仅对 "change"事件发生有效。

```js
book.on("change", function() {
  if (book.hasChanged("title")) {
    ...
  }
});
```

## changedAttributes

> model.changedAttributes([attributes]) 

只从最后一次set开始检索已改变的模型属性散列（hash），  或者如果没有，返回 false。 作为可选，可以传递外部属性哈希（hash）， 返回与该模型不同的属性的哈希（hash）。 这可以用来找出视图的哪些部分应该更新，或者确定哪些需要与服务器进行同步。

## previous

> model.previous(attribute) 

在 "change" 事件发生的过程中，本方法可被用于获取已改变属性的旧值。

```js
var bill = new Backbone.Model({
  name: "Bill Smith"
});

bill.on("change:name", function(model, name) {
  alert("Changed name from " + bill.previous("name") + " to " + name);
});

bill.set({name : "Bill Jones"});
```

## previousAttributes

> model.previousAttributes() 

返回模型的上一个属性的副本。一般用于获取模型的不同版本之间的区别，或者当发生错误时回滚模型状态。

# Backbone.Collection（集合）

集合是模型的有序组合，我们可以在集合上绑定 "change" 事件，从而当集合中的模型发生变化时fetch（获得）通知，集合也可以监听 "add" 和 "remove" 事件， 从服务器更新，并能使用 Underscore.js 提供的方法。

集合中的模型触发的任何事件都可以在集合身上直接触发，所以我们可以监听集合中模型的变化： documents.on("change:selected", ...)

## extend（集合）

> Backbone.Collection.extend(properties, [classProperties]) 

通过扩展 Backbone.Collection 创建一个 Collection 类。实例属性参数 properties 以及 类属性参数 classProperties 会被直接注册到集合的构造函数。

## model（集合）

> collection.model 

覆盖此属性来指定集合中包含的模型类。可以传入原始属性对象（和数组）来 add, create,和 reset，传入的属性会被自动转换为适合的模型类型。

```js
var Library = Backbone.Collection.extend({
  model: Book
});
```

集合也可以包含多态模型，通过用构造函数重写这个属性，返回一个模型。

```js
var Library = Backbone.Collection.extend({

  model: function(attrs, options) {
    if (condition) {
      return new PublicDocument(attrs, options);
    } else {
      return new PrivateDocument(attrs, options);
    }
  }

});
```

## constructor / initialize

> new Backbone.Collection([models], [options]) 

当创建集合时，你可以选择传入初始的 models 数组。 集合的 comparator 函数也可以作为选项传入。 传递false作为comparator选项将阻止排序。 如果定义了 initialize 函数，会在集合创建时被调用。 有几个选项， 如果提供的话，将直接附加到集合上：model 和 comparator。
通过传递null给models选项来创建一个空的集合。

```js
var tabs = new TabSet([tab1, tab2, tab3]);
var spaces = new Backbone.Collection([], {
  model: Space
});
```

## models

> collection.models 

访问集合中模型的内置的JavaScript 数组。通常我们使用 get， at，或 Underscore方法 访问模型对象，但偶尔也需要直接访问。

## toJSON

> collection.toJSON([options]) 

返回集合中包含的每个模型(通过 toJSON) 的属性哈希的数组。可用于集合的序列化和持久化。本方法名称容易引起混淆，因为它与 JavaScript's JSON API 命名相同。

```js
var collection = new Backbone.Collection([
  {name: "Tim", age: 5},
  {name: "Ida", age: 26},
  {name: "Rob", age: 55}
]);

alert(JSON.stringify(collection));
```

## sync（集合）

> collection.sync(method, collection, [options]) 

使用 Backbone.sync来将一个集合的状态持久化到服务器。 可以自定义行为覆盖。

## Underscore 方法 (32) 
Backbone 代理了 Underscore.js用来给Backbone.Collection提供 6 个对象函数。这里没有完全记录他们，但你可以看看Underscore文档中全部详情…(愚人码头注：下面链接已经替换成中文文档的地址)

- forEach (each)
- map (collect)
- reduce (foldl, inject)
- reduceRight (foldr)
- find (detect)
- filter (select)
- reject
- every (all)
- some (any)
- contains (include)
- invoke
- max
- min
- sortBy
- groupBy
- shuffle
- toArray
- size
- first (head, take)
- initial
- rest (tail, drop)
- last
- without
- indexOf
- lastIndexOf
- isEmpty
- chain
- difference
- sample
- partition
- countBy
- indexBy

```js
books.each(function(book) {
  book.publish();
});

var titles = books.map(function(book) {
  return book.get("title");
});

var publishedBooks = books.filter(function(book) {
  return book.get("published") === true;
});

var alphabetical = books.sortBy(function(book) {
  return book.author.get("name").toLowerCase();
});
```

## add（集合）

> collection.add(models, [options]) 

向集合中增加一个模型（或一个模型数组），触发"add"事件。  如果已经定义了model属性， 您也可以通过原始属性的对象让其看起来像一个模型实例。 返回已经添加的（或预先存在的，如果重复）模式。  传递{at: index}可以将模型插入集合中特定的index索引位置。 如果您要添加 集合中已经存在的模型 到集合，他们会被忽略， 除非你传递{merge: true}， 在这种情况下，它们的属性将被合并到相应的模型中， 触发任何适当的"change" 事件。

```js
var ships = new Backbone.Collection;

ships.on("add", function(ship) {
  alert("Ahoy " + ship.get("name") + "!");
});

ships.add([
  {name: "Flying Dutchman"},
  {name: "Black Pearl"}
]);
```

请注意，添加相同的模型（具有相同id的模型）到一个集合，一次以上 
是空操作。

## remove（集合）

> collection.remove(models, [options]) 

从集合中删除一个模型（或一个模型数组），并且返回他们。会触发 "remove" 事件，同样可以使用 silent 关闭。移除前该模型的index可用作options.index类监听。

## reset（集合）

> collection.reset([models], [options]) 

每次都是只添加和删除一个模型那没问题， 但有时，你需要改变很多模型，那么你宁愿只更新集合。  使用reset，将一个新的模型（或属性散列）列表替换集合，最后触发一个但单独的"reset"事件。 到与模型的新列表替换集合（或属性散列），触发一个单一的“复位”事件在末端。 返回新的模型集合。 为方便起见， 在一个 "reset"事件中， 任何以前的模型列表可作为options.previousModels。 
通过传递null给models选项来清空你的集合。

下面是一个例子 使用reset来引导一个集合在页面初始化时加载， 在Rails应用程序中：

```js
<script>
  var accounts = new Backbone.Collection;
  accounts.reset(<%= @accounts.to_json %>);
</script>
```

调用collection.reset()，不传递任何模型作为参数 将清空整个集合。

## set（集合）

> collection.set(models, [options]) 

set方法通过传递模型列表执行一个集合的"smart(智能)"的更新。 如果列表中的一个模型尚不在集合中，那么它将被添加; 如果模型已经在集合中，其属性将被合并; 并且如果集合包含不存在于列表中的任何模型，他们将被删除。 以上所有将触发相应的"add", "remove", 和 "change"事件。 返回集合中的模型。 如果您想自定义的行为， 你可以设置选项：{add: false}, {remove: false}, 或 {merge: false}，将其禁用。

```js
var vanHalen = new Backbone.Collection([eddie, alex, stone, roth]);

vanHalen.set([eddie, alex, stone, hagar]);

// Fires a "remove" event for roth, and an "add" event for "hagar".
// Updates any of stone, alex, and eddie's attributes that may have
// changed over the years.
```

## get（集合）

> collection.get(id) 

通过一个id，一个cid，或者传递一个model来 获得集合中 的模型。

```js
var book = library.get(110);
```

## at（集合）

> collection.at(index) 

获得集合中指定索引的模型。不论你是否对模型进行了重新排序， at 始终返回其在集合中插入时的索引值。

## push（集合）

> collection.push(model, [options]) 

在集合尾部添加一个模型。选项和add相同。

## pop（集合）

> collection.pop([options]) 

删除并且返回集合中最后一个模型。选项和remove相同。

## unshift（集合）

> collection.unshift(model, [options]) 

在集合开始的地方添加一个模型。选项和add相同。

## shift（集合）

> collection.shift([options]) 

删除并且返回集合中第一个模型。选项和remove相同。

## slice（集合）

> collection.slice(begin, end) 

返回一个集合的模型的浅拷贝副本，使用与原生Array#slice相同的选项。

## length（集合）

> collection.length 

与数组类似，集合拥有 length 属性，返回该集合包含的模型数量。

## comparator（集合）

> collection.comparator 

默认情况下，集合没有声明 comparator 函数。如果定义了该函数，集合中的模型会按照指定的算法进行排序。 换言之，被增加模型，会被插入 collection.models中适合的位置。 comparator可以被定义为sortBy（传递带有一个参数的函数），  作为一个sort（传递一个一个参数函数需要两个参数）， 或者作为一个表示属性的字符串进行排序。

"sortBy"比较函数接受一个模型，并且返回一个该模型相对于其他模型的排序数字或字符串值。  "sort"比较函数接受两个模型，并且，如果第一个模型应该在第二模型个之前，返回-1； 如果他们是同一等级的，返回0； 如果第一个模型应该在第二模型个之后，返回1； 需要注意的是 Backbone 这两种风格的比较功能的确定 取决于参数个数。所以如果你绑定了比较函数，需要格外小心。

注意即使下面例子中的 chapters 是后加入到集合中的，但它们都会遵循正确的排序：

```js
var Chapter  = Backbone.Model;
var chapters = new Backbone.Collection;

chapters.comparator = 'page';

chapters.add(new Chapter({page: 9, title: "The End"}));
chapters.add(new Chapter({page: 5, title: "The Middle"}));
chapters.add(new Chapter({page: 1, title: "The Beginning"}));

alert(chapters.pluck('title'));
```

如果以后更改模型属性，带有比较函数的集合不会自动重新排序。 所以你不妨改变模型的属性后调用sort， 这会影响排序。

## sort

> collection.sort([options]) 

强制对集合进行重排序。一般情况下不需要调用本函数，因为当一个模型被添加时， comparator 函数会实时排序。要禁用添加模型时的排序，可以传递{sort: false}给add。 调用sort会触发的集合的"sort"事件。

## pluck

> collection.pluck(attribute) 

从集合中的每个模型中拉取 attribute（属性）。等价于调用 map，并从迭代器中返回单个属性。

```js
var stooges = new Backbone.Collection([
  {name: "Curly"},
  {name: "Larry"},
  {name: "Moe"}
]);

var names = stooges.pluck("name");

alert(JSON.stringify(names));
```

## where

> collection.where(attributes) 

返回集合中所有匹配所传递 attributes（属性）的模型数组。 对于简单的filter（过滤）比较有用。

```js
var friends = new Backbone.Collection([
  {name: "Athos",      job: "Musketeer"},
  {name: "Porthos",    job: "Musketeer"},
  {name: "Aramis",     job: "Musketeer"},
  {name: "d'Artagnan", job: "Guard"},
]);
var musketeers = friends.where({job: "Musketeer"});
alert(musketeers.length);
```

## findWhere

> collection.findWhere(attributes) 

就像where， 不同的是findWhere直接返回匹配所传递 attributes（属性）的第一个模型。

## collection.url

> collection.url or collection.url() 

设置 url 属性（或函数）以指定集合对应的服务器位置。集合内的模型使用 url 构造自身的 URLs。

```js
var Notes = Backbone.Collection.extend({
  url: '/notes'
});

// Or, something more sophisticated:

var Notes = Backbone.Collection.extend({
  url: function() {
    return this.document.url() + '/notes';
  }
});
```


## parse

> collection.parse(response, options) 

每一次调用 fetch 从服务器拉取集合的模型数据时，parse都会被调用。 本函数接收原始 response 对象，返回可以 added（添加） 到集合的模型属性数组。 默认实现是无需操作的，只需简单传入服务端返回的JSON对象。 如果需要处理遗留API，或者在返回数据定义自己的命名空间，可以重写本函数。

```js
var Tweets = Backbone.Collection.extend({
  // The Twitter Search API returns tweets under "results".
  parse: function(response) {
    return response.results;
  }
});
```

## clone

> collection.clone() 

返回一个模型列表完全相同的集合新实例。


## fetch

> collection.fetch([options]) 

从服务器拉取集合的默认模型设置 ，成功接收数据后会setting（设置）集合。 options 支持 success 和 error 回调函数，两个回调函数接收 (collection, response, options)作为参数。当模型数据从服务器返回时， 它使用 set来（智能的）合并所获取到的模型， 除非你传递了 {reset: true}， 在这种情况下，集合将（有效地）重置。 可以委托Backbone.sync 在幕后自定义持久性策略 并返回一个jqXHR。 fetch请求的服务器处理器应该返回模型JSON数组。

```js
Backbone.sync = function(method, model) {
  alert(method + ": " + model.url);
};

var accounts = new Backbone.Collection;
accounts.url = '/accounts';

accounts.fetch();
```

**fetch**行为可以通过使用有效的set选项进行定制。 例如，要获取一个集合，每一个新的模型会得到一个 "add"事件，和每改变现有的模型的 "change"事件， 不删除任何东西： collection.fetch({remove: false})

**jQuery.ajax**选项也可以直接传递作为 fetch选项， 所以要获取一个分页集合的特定页面使用：Documents.fetch({data: {page: 3}})。

需要注意的是 fetch 不应该被用来在页面加载完毕时填充集合数据 — 所有页面初始数据应当在 bootstrapped 时已经就绪。 fetch 适用于惰性加载不需立刻展现的模型数据：例如：例如文档中 可切换打开和关闭的选项卡内容。

## create

> collection.create(attributes, [options]) 

方便的在集合中创建一个模型的新实例。 相当于使用属性哈希（键值对象）实例化一个模型， 然后将该模型保存到服务器， 创建成功后将模型添加到集合中。 返回这个新模型。 如果客户端验证失败，该模型将不会被保存， 与验证错误。 为了能正常运行，需要在集合中设置 model 属性。 create 方法接收键值对象或者已经存在尚未保存的模型对象作为参数。

创建一个模型将立即触发集合上的"add"事件， 一个"request"的事件作为新的模型被发送到服务器， 还有一个 "sync" ”事件，一旦服务器响应成功创建模型。 如果你想在集合中添加这个模型前等待服务器相应，请传递{wait: true}。

```js
var Library = Backbone.Collection.extend({
  model: Book
});

var nypl = new Library;

var othello = nypl.create({
  title: "Othello",
  author: "William Shakespeare"
});
```

# Backbone.Router（路由）

web应用程序通常需要为应用的重要位置提供可链接，可收藏，可分享的 URLs。 直到最近， 猫点（hash）片段（#page）可以被用来提供这种链接， 同时随着 History API 的到来，猫点已经可以用于处理标准 URLs （/page）。 Backbone.Router 为客户端路由提供了许多方法，并能连接到指定的动作（actions）和事件（events）。 对于不支持 History API 的旧浏览器，路由提供了优雅的回调函数并可以透明的进行 URL 片段的转换。

页面加载期间，当应用已经创建了所有的路由，需要调用 Backbone.history.start()，或 Backbone.history.start({pushState: true}) 来确保驱动初始化 URL 的路由。

## extend

> Backbone.Router.extend(properties, [classProperties]) 

开始创建一个自定义的路由类。当匹配了 URL 片段便执行定义的动作，并可以通过 routes 定义路由动作键值对。 请注意，你要避免在路由定义时使用前导斜杠：

```js
var Workspace = Backbone.Router.extend({

  routes: {
    "help":                 "help",    // #help
    "search/:query":        "search",  // #search/kiwis
    "search/:query/p:page": "search"   // #search/kiwis/p7
  },

  help: function() {
    ...
  },

  search: function(query, page) {
    ...
  }

});
```

## routes

> router.routes 

routes 将带参数的 URLs 映射到路由实例的方法上（或只是直接的函数定义，如果你喜欢），这与 View（视图） 的 events hash（事件键值对） 非常类似。 路由可以包含参数， :param，它在斜线之间匹配 URL 组件。 路由也支持通配符， *splat，可以匹配多个 URL 组件。 路由的可选部分放在括号中(/:optional)。

举个例子，路由 `"search/:query/p:page"` 能匹配`#search/obama/p2` , 这里传入了 "obama" 和 "2" 到路由对应的动作中去了。

路由 `"file/*path"`可以匹配 `#file/nested/folder/file.txt`，这时传入动作的参数为 `"nested/folder/file.txt"`。

路由 `"docs/:section(/:subsection)"`可以匹配`#docs/faq` 和 `#docs/faq/installing`，第一种情况，传入 `"faq"` 到路由对应的动作中去， 第二种情况，传入`"faq"` 和 `"installing"` 到路由对应的动作中去。

结尾的斜杠会被当作URL的一部分， 访问时会被（正确地）当作一个独立的路由。 docs 和 docs/将触发不同的回调。 如果你不能避免产生这两种类型的URLs时， 你可以定义一个"docs(/)"来匹配捕捉这两种情况。

当访问者点击浏览器后退按钮，或者输入 URL ，如果匹配一个路由，此时会触发一个基于动作名称的 event， 其它对象可以监听这个路由并接收到通知。 下面的示例中，用户访问 #help/uploading 将从路由中触发 route:help 事件。

```js
routes: {
  "help/:page":         "help",
  "download/*path":     "download",
  "folder/:name":       "openFolder",
  "folder/:name-:mode": "openFolder"
}
router.on("route:help", function(page) {
  ...
});
```

## constructor / initialize

> new Router([options]) 

当创建一个新路由是，你可以直接传入 routes 键值对象作为参数。 如果定义该参数， 它们将被传入 initialize 构造函数中初始化。

## route

> router.route(route, name, [callback]) 

为路由对象手动创建路由，route 参数可以是 routing string（路由字符串） 或 正则表达式。 每个捕捉到的被传入的路由或正则表达式，都将作为参数传入回调函数（callback）。 一旦路由匹配， name 参数会触发 "route:name" 事件。如果callback参数省略 router[name]将被用来代替。 后来添加的路由可以覆盖先前声明的路由。


```js
initialize: function(options) {

  // Matches #page/10, passing "10"
  this.route("page/:number", "page", function(number){ ... });

  // Matches /117-a/b/c/open, passing "117-a/b/c" to this.open
  this.route(/^(.*?)\/open$/, "open");

},

open: function(id) { ... }
```

## navigate

> router.navigate(fragment, [options]) 

每当你达到你的应用的一个点时，你想保存为一个URL，  可以调用navigate以更新的URL。 如果您也想调用路由功能， 设置trigger选项设置为true。 无需在浏览器的历史记录创建条目来更新URL，  设置 replace选项设置为true。

```js
openPage: function(pageNumber) {
  this.document.pages.at(pageNumber).open();
  this.navigate("page/" + pageNumber);
}

// Or ...
app.navigate("help/troubleshooting", {trigger: true});

// Or ...
app.navigate("help/troubleshooting", {trigger: true, replace: true});
```

## execute

> router.execute(callback, args) 

这种方法在路由内部被调用，  每当路由和其相应的callback匹配时被执行。 覆盖它来执行自定义解析或包装路由， 例如， 在传递他们给你的路由回调之前解析查询字符串，像这样：

```js
var Router = Backbone.Router.extend({
  execute: function(callback, args) {
    args.push(parseQueryString(args.pop()));
    if (callback) callback.apply(this, args);
  }
});
```

# Backbone.history

**History** 作为全局路由服务用于处理 hashchange 事件或 pushState，匹配适合的路由，并触发回调函数。 我们不需要自己去做这些事情 — 如果使用带有键值对的 路由，Backbone.history 会被自动创建。

Backbone 会自动判断浏览器对 `pushState` 的支持，以做内部的选择。 不支持 `pushState` 的浏览器将会继续使用基于猫点的 URL 片段， 如果兼容 `pushState` 的浏览器访问了某个 URL 猫点，将会被透明的转换为真实的 URL。 注意使用真实的 URLs 需要 web 服务器支持直接渲染那些页面，因此后端程序也需要做修改。 例如，如果有这样一个路由 /document/100，如果浏览器直接访问它， web 服务器必须能够处理该页面。 趋于对搜索引擎爬虫的兼容，让服务器完全为该页面生成静态 HTML 是非常好的做法 ... 但是如果要做的是一个 web 应用，只需要利用 Javascript 和 Backbone 视图将服务器返回的 REST 数据渲染就很好了。

## start

> Backbone.history.start([options]) 

当所有的 Routers 创建并设置完毕，调用 `Backbone.history.start()` 开始监控 hashchange 事件并分配路由。后续调用`Backbone.history.start()`会抛出一个错误， 并且Backbone.History.started是一个布尔值，指示是否已经被调用。

需要指出的是，如果想在应用中使用 HTML5 支持的 pushState，只需要这样做：Backbone.history.start({pushState : true}) 。如果你想使用pushState的话， 对于那些本身不支持它的浏览器，需要用整页刷新代替， 您可以添加{hashChange: false}到选项。

如果应用不是基于域名的根路径 /，需要告诉 History 基于什么路径：` Backbone.history.start({pushState: true, root: "/public/search/"})`

当执行后，如果某个路由成功匹配当前 URL，`Backbone.history.start()` 返回 true。 如果没有定义的路由匹配当前 URL，返回 false。

如果服务器已经渲染了整个页面，但又不希望开始 History 时触发初始路由，传入 silent : true 即可。

因为在Internet Explorer中基于hash的历史记录依赖于`<iframe>`，因此需要确定DOM已准备就绪后再调用 `start()` 。

```js
$(function(){
  new WorkspaceRouter();
  new HelpPaneRouter();
  Backbone.history.start({pushState: true});
});
```

# Backbone.sync（同步）

## Backbone.sync

是 Backbone 每次向服务器读取或保存模型时都要调用执行的函数。 默认情况下，它使用 jQuery.ajax 方法发送 RESTful json 请求，并且返回一个 jqXHR。 如果想采用不同的持久化方案，比如 WebSockets, XML, 或 Local Storage，我们可以重载该函数。

**Backbone.sync** 的语法为 sync(method, model, [options])。

- method – CRUD 方法 ("create", "read", "update", or "delete")
- model – 要被保存的模型（或要被读取的集合）
- options – 成功和失败的回调函数，以及所有 jQuery 请求支持的选项

默认情况下，当 **Backbone.sync** 发送请求以保存模型时，其属性会被序列化为 JSON，并以 application/json 的内容类型发送。 当接收到来自服务器的 JSON 响应后，对经过服务器改变的模型进行拆解，然后在客户端更新。 当 "read" 请求从服务器端响应一个集合（Collection#fetch）时，便拆解模型属性对象的数组。

当一个模型或集合开始 sync到服务器时，将触发一个 "request" 事件。 如果请求成功完成，你会得到一个"sync"事件， 如果请求失败，你会得到一个 "error"事件。

sync函数可重写为全局性的Backbone.sync， 或在细粒度级别， 通过添加一个 sync函数 到Backbone集合或单个模型时。

默认 sync 映射 REST 风格的 CRUD 类似下面这样：

- create → POST   /collection
- read → GET   /collection[/id]
- update → PUT   /collection/id
- patch → PATCH   /collection/id
- delete → DELETE   /collection/id

举个例子，一个Rail 4 处理程序响应一个来自Backbone的"update"调用，可能是这样的： （在真正的代码中， 千万不要盲目的使用update_attributes， ，你可以被改变的属性始终是白名单。）

```
def update
  account = Account.find params[:id]
  account.update_attributes params.require(:account).permit(:name, :otherparam)
  render :json => account
end
```

一个技巧： 通过设置ActiveRecord::Base.include_root_in_json = false，在模型上禁用默认命名空间的to_json来整合 Rails 3.1之前的版本， 。

## Backbone.ajax

> Backbone.ajax = function(request) { ... }; 

如果你想使用自定义的AJAX功能， 或者你的客户端不支持的jQuery.ajax API，你需要调整的东西， 您可以通过设置Backbone.ajax这样做。

### emulateHTTP

> Backbone.emulateHTTP = true 

如果你想在不支持Backbone的默认REST/ HTTP方式的Web服务器上工作， 您可以选择开启Backbone.emulateHTTP。 设置该选项将通过 POST 方法伪造 PUT，PATCH 和 DELETE 请求 用真实的方法设定X-HTTP-Method-Override头信息。 如果支持emulateJSON，此时该请求会向服务器传入名为 _method 的参数。

```js
Backbone.emulateHTTP = true;

model.save();  // POST to "/collection/id", with "_method=PUT" + header.
```

### emulateJSON

> Backbone.emulateJSON = true 

如果你想在不支持发送 application/json 编码请求的Web服务器上工作，设置Backbone.emulateJSON = true;将导致JSON根据模型参数进行序列化， 并通过application/x-www-form-urlencoded MIME类型来发送一个伪造HTML表单请求，

# Backbone.View（视图）

Backbone 视图几乎约定比他们的代码多 — 他们并不限定你的HTML或CSS， 并可以配合使用任何JavaScript模板库。 一般是组织您的接口转换成逻辑视图， 通过模型的支持， 模型变化时， 每一个都可以独立地进行更新， 而不必重新绘制该页面。我们再也不必钻进 JSON 对象中，查找 DOM 元素，手动更新 HTML 了，通过绑定视图的 render 函数到模型的 "change" 事件 — 模型数据会即时的显示在 UI 中。

## extend (View)

> Backbone.View.extend(properties, [classProperties]) 

开始创建自定义的视图类。 通常我们需要重载 render 函数，声明 events， 以及通过 tagName, className, 或 id 为视图指定根元素。

```js
var DocumentRow = Backbone.View.extend({

  tagName: "li",

  className: "document-row",

  events: {
    "click .icon":          "open",
    "click .button.edit":   "openEditDialog",
    "click .button.delete": "destroy"
  },

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
  },

  render: function() {
    ...
  }

});
```

直到运行时， 像tagName, id, className, el, 和 events这样的属性也可以被定义为一个函数，

## constructor / initialize(View)

> new View([options]) 

有几个特殊的选项， 如果传入，则直接注册到视图中去： model, collection, el, id, className, tagName, attributes 和 events。 如果视图定义了一个initialize初始化函数， 首先创建视图时，它会立刻被调用。 如果希望创建一个指向 DOM 中已存在的元素的视图，传入该元素作为选项：new View({el: existingElement})。

```js
var doc = documents.first();

new DocumentRow({
  model: doc,
  id: "document-row-" + doc.id
});
```

## el(View)

> view.el 

所有的视图都拥有一个 DOM 元素（el 属性），即使该元素仍未插入页面中去。 视图可以在任何时候渲染，然后一次性插入 DOM 中去，这样能尽量减少 reflows 和 repaints 从而获得高性能的 UI 渲染。 this.el 可以从视图的 tagName, className, id 和 attributes 创建，如果都未指定，el 会是一个空 div。

```js
var ItemView = Backbone.View.extend({
  tagName: 'li'
});

var BodyView = Backbone.View.extend({
  el: 'body'
});

var item = new ItemView();
var body = new BodyView();

alert(item.el + ' ' + body.el);
```

## $el

> view.$el 

一个视图元素的缓存jQuery对象。 一个简单的引用，而不是重新包装的DOM元素。

```js
view.$el.show();
listView.$el.append(itemView.el);
```

## setElement

> view.setElement(element) 

如果你想应用一个Backbone视图到不同的DOM元素， 使用setElement， 这也将创造缓存$el引用，视图的委托事件从旧元素移动到新元素上。

## attributes(View)

> view.attributes 

属性的键值对， 将被设置为视图el上的HTML DOM元素的属性， 或者是返回这样的键值对的一个函数。

## $(jQuery)

> view.$(selector) 

如果页面中引入了 jQuery，每个视图都将拥有 $ 函数，可以在视图元素查询作用域内运行。 如果使用该作用域内的 jQuery 函数，就不需要从列表中指定的元素获取模型的 ids 这种查询了，我们可以更多的依赖 HTML class 属性。 它等价于运行：view.$el.find(selector)。

```js
ui.Chapter = Backbone.View.extend({
  serialize : function() {
    return {
      title: this.$(".title").text(),
      start: this.$(".start-page").text(),
      end:   this.$(".end-page").text()
    };
  }
});
```

## template

> view.template([data]) 

虽然模板化的视图 不是Backbone直接提供的一个功能， 它往往是一个在你视图定义template函数很好的约定。 如此， 渲染你的视图时， 您方便地访问实例数据。 例如，使用Underscore的模板：

```js
var LibraryView = Backbone.View.extend({
  template: _.template(...)
});
```

## render

> view.render() 

render 默认实现是没有操作的。 重载本函数可以实现从模型数据渲染视图模板，并可用新的 HTML 更新 this.el。 推荐的做法是在 render 函数的末尾 return this 以开启链式调用。

```js
var Bookmark = Backbone.View.extend({
  template: _.template(...),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});
```

Backbone并不知道您首选HTML模板的方法。 render（渲染） 函数中可以采用拼接HTML字符串，， 或者使用document.createElement生成DOM树。 但还是建议选择一个好的 Javascript 模板引擎。 Mustache.js, Haml-js, 和 Eco 都是很好的选择。 因为Underscore.js已经引入页面了，如果你喜欢简单的插入JavaScript的样式模板。  _.template可以使用并是一个很好的选择。

无论基于什么考虑，都永远不要在 Javascript 中拼接 HTML 字符串。 在DocumentCloud中， 我们使用Jammit 来打包JavaScript模板，并存储在/app/views中，作为我们主要的core.js包的一部分。

## remove(View)

> view.remove() 

从 DOM 中移除一个视图。同事调用stopListening来移除通过 listenTo绑定在视图上的 所有事件。

## delegateEvents

> delegateEvents([events]) 

采用 jQuery 的on函数来为视图内的 DOM 事件提供回调函数声明。 如果未传入 events 对象，使用 this.events 作为事件源。 事件对象的书写格式为 {"event selector": "callback"}。 省略 selector 则事件被绑定到视图的根元素（this.el）。 默认情况下，**delegateEvents** 会在视图的构造函数内被调用，因此如果有 events 对象，所有的 DOM 事件已经被连接， 并且我们永远不需要去手动调用本函数。

events 属性也可以被定义成返回 events 对象的函数，这样让我们定义事件，以及实现事件的继承变得更加方便。

视图 render 期间使用 **delegateEvents** 相比用 jQuery 向子元素绑定事件有更多优点。 所有注册的函数在传递给 jQuery 之前已被绑定到视图上，因此当回调函数执行时， this 仍将指向视图对象。 当 **delegateEvents** 再次运行，此时或许需要一个不同的 events 对象，所以所有回调函数将被移除，然后重新委托 — 这对模型不同行为也不同的视图挺有用处。

搜索结果页面显示文档的视图看起来类似这样：

```js
var DocumentView = Backbone.View.extend({

  events: {
    "dblclick"                : "open",
    "click .icon.doc"         : "select",
    "contextmenu .icon.doc"   : "showMenu",
    "click .show_notes"       : "toggleNotes",
    "click .title .lock"      : "editAccessLevel",
    "mouseover .title .date"  : "showTooltip"
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  open: function() {
    window.open(this.model.get("viewer_url"));
  },

  select: function() {
    this.model.set({selected: true});
  },

  ...

});
```

## undelegateEvents

> undelegateEvents() 

删除视图所有委托事件。如果要从临时的DOM中禁用或删除视图时，比较有用。

# Utility（实用功能）

## Backbone.noConflict

> var backbone = Backbone.noConflict(); 

返回 Backbone 对象的原始值。 您可以使用`Backbone.noConflict()`的返回值以保持局部引用Backbone。 通常用于在第三方网站上引入了多个 Backbone 文件，避免冲突。

```js
var localBackbone = Backbone.noConflict();
var model = localBackbone.Model.extend(...);
```

## Backbone.$

> Backbone.$ = $; 

如果页面上有多个jQuery副本， 或者只是想告诉Backbone使用特定对象作为其DOM / Ajax库， 那么这个属性可以为您服务。  如果您正在使用CommonJS加载Backbone （例如，节点，组件，或browserify） 您必须手动设置该属性。

```js
var Backbone.$ = require('jquery');
```

