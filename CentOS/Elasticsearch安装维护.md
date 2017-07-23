ElasticSearch安装维护
---

目录
===

<!-- TOC -->

- [下载安装](#下载安装)
- [命令行运行](#命令行运行)
- [全局命令调用](#全局命令调用)
- [作为守护进程启动](#作为守护进程启动)
- [命令行中修改配置](#命令行中修改配置)
- [管理](#管理)
- [对比理解](#对比理解)
- [插件安装](#插件安装)
  - [插件](#插件)
  - [MySQL数据导入](#mysql数据导入)
- [错误处理](#错误处理)
- [参考文档](#参考文档)

<!-- /TOC -->

## 下载安装

官方[Elasticsearch 5.3](https://www.elastic.co/guide/en/elasticsearch/reference/5.3/zip-targz.html) 安装教程

```bash
# 下载Elasticsearch 5.3
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.3.0.tar.gz
# 解压压缩包
tar -xzf elasticsearch-5.3.0.tar.gz
# 进入解压出来的目录
cd elasticsearch-5.3.0/ 
```

注意：如果官方下载不下来，可以通过迅雷断点下载。

## 命令行运行

进入解压目录之后，运行下面命令即可开始运行Elasticsearch服务了。`ctrl-c` 结束服务。

```bash
# 命令行运行
./bin/elasticsearch
# 查看日志
tail -f logs/elasticsearch.log
```

运行出现下面警告，一般是磁盘不够的样子

```bash
[2017-04-06T14:01:41,191][INFO ][o.e.c.r.a.DiskThresholdMonitor] [cki_UTv] low disk watermark [85%] exceeded on [cki_UTvDRtWzj9hzmC1kvg][cki_UTv][/usr/local/elasticsearch-5.3.0/data/nodes/0] free: 25gb[10.7%], replicas will not be assigned to this node
```

## 全局命令调用

将你下载的目录拷贝到一个特定目录`/usr/local` 这个目录一般是本地系统管理员，用来自由添加程序的目录。

```bash
cp -rf elasticsearch-5.3.0 /usr/local/
```

编辑 `vim ~/.bash_profile` 文件添加下面两行配置。

```bash
export ELASTIC_SEARCH=/usr/local/elasticsearch-5.3.0/bin
export PATH=${ELASTIC_SEARCH}:${PATH}
```

上面操作完成记得 `source ~/.bash_profile` 立即生效。


## 作为守护进程启动

加上 `-p` 参数将进程id保存到`es.pid`文本文件里面。

```bash
elasticsearch -d -p es.pid
```

通过 `es.pid` 文件中的进程id 将其杀掉

```
kill `cat es.pid`
```

## 命令行中修改配置

任何[Elasticsearch配置](https://www.elastic.co/guide/en/elasticsearch/reference/5.3/settings.html)都可以通过命令行修改，但是要遵循elasticsearch的语法，每个参数前面跟上`-E`，如：

```bash
elasticsearch -d -Ecluster.name=my_cluster -Enode.name=node_1
```

## 管理

健康状态

```bash
curl 'localhost:9200/_cat/health?v'
# epoch      timestamp cluster status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent 
# 1473669150 16:32:30  es-test green           1         1      0   0    0    0        0             0 
```

列出节点

```bash
curl 'localhost:9200/_cat/nodes?v'
# host      ip        heap.percent ram.percent load node.role master name   
# 127.0.0.1 127.0.0.1            6          16 0.00 d         *      node-1 
```
 
列出索引

```
curl 'localhost:9200/_cat/indices?v'
health status index pri rep docs.count docs.deleted store.size pri.store.size
```

## 对比理解

```
Relational DB -> Databases -> Tables -> Rows -> Columns
Elasticsearch -> Indices   -> Types  -> Documents -> Fields
```

在Elasticsearch中，文档归属于一种类型(type),而这些类型存在于索引(index)中，我们可以画一些简单的对比图来类比传统关系型数据库

Elasticsearch集群可以包含多个索引(indices)（数据库），每一个索引可以包含多个类型(types)（表），每一个类型包含多个文档(documents)（行），然后每个文档包含多个字段(Fields)（列）。

## 插件安装

```bash
# 列出当前插件列表
sudo bin/elasticsearch-plugin list
# 删除插件
sudo bin/elasticsearch-plugin remove [pluginname]
# 更新插件
sudo bin/elasticsearch-plugin remove [pluginname]
sudo bin/elasticsearch-plugin install [pluginname]
# 通过URL或者系统文件夹安装插件
sudo bin/elasticsearch-plugin install [url] 
sudo bin/elasticsearch-plugin install file:///path/to/plugin.zip
sudo ES_JAVA_OPTS="-Djavax.net.ssl.trustStore=/path/to/trustStore.jks" bin/elasticsearch-plugin install https://....
# 某些插件需要更多权限
# 这些插件将列出所需的权限，并要求用户进行确认，然后再继续安装。
sudo bin/elasticsearch-plugin install --batch [pluginname]
# 如果您的elasticsearch.yml配置文件位于自定义位置，
# 则需要在使用插件脚本时指定配置文件的路径。
sudo bin/elasticsearch-plugin -Epath.conf=/path/to/custom/config/dir install <plugin name>
# 通过代理安装插件
sudo ES_JAVA_OPTS="-Dhttp.proxyHost=host_name -Dhttp.proxyPort=port_number -Dhttps.proxyHost=host_name -Dhttps.proxyPort=https_port_number" bin/elasticsearch-plugin install analysis-icu
# windows中通过代理安装插件
set ES_JAVA_OPTS="-Dhttp.proxyHost=host_name -Dhttp.proxyPort=port_number -Dhttps.proxyHost=host_name -Dhttps.proxyPort=https_port_number"
bin\elasticsearch-plugin install analysis-icu
# 如果您依赖某些插件，可以通过将plugin.mandatory设置添加到config / elasticsearch.yml文件中来定义强制插件，
plugin.mandatory: analysis-icu,lang-js
```

⚠️  注意：

- 对于Elasticsearch 5.x：不支持网站插件。
- 对于不支持的插件，不能放到elasticsearch-5.3.0/plugins目录中。

### 插件

- [ElasticSearch Toolbox](https://chrome.google.com/webstore/detail/elasticsearch-toolbox/focdbmjgdonlpdknobfghplhmafpgfbp/related) 谷歌浏览器的扩展组件  
- [Elasticsearch GUI](http://www.gridshore.nl/esgui/) 
- [Elasticsearch-head](https://github.com/mobz/elasticsearch-head)
- [Sense (Beta)](https://chrome.google.com/webstore/detail/sense-beta/lhjgkmllcaadmopgmanpapmpjgmfcfig/related?hl=zh-CN)

插件[elasticsearch-head](https://github.com/mobz/elasticsearch-head)不能通过命令安装，这是一个图形界面管理elasticsearch。

```bash
# 修改 elasticsearch/config/elasticsearch.yml 添加
http.cors.enabled: true
http.cors.allow-origin: "*"
```

下载 [elasticsearch-head](https://github.com/mobz/elasticsearch-head) 或者 git clone 到随便一个文件夹

```bash
cd /path/to/elasticsearch-head
npm install
npm start
http://localhost:9100/
```

### MySQL数据导入

- [go-mysql-elasticsearch](https://github.com/siddontang/go-mysql-elasticsearch) golang版本
- [elasticsearch-river-mysql](https://github.com/scharron/elasticsearch-river-mysql)
- [elasticsearch-river-jdbc](https://github.com/jprante/elasticsearch-river-jdbc)

## 错误处理

注：ES有执行脚本的能力，因安全因素，不能在root用户下运行，强行运行会报如下错误：

> org.elasticsearch.bootstrap.StartupException: java.lang.RuntimeException: can not run elasticsearch as root

```bash
groupadd elsearch   # 增加es组
useradd elsearch -g elsearch -p elasticsearch  # 增加elsearch用户并附加到elsearch组
chown -R elsearch:elsearch elasticsearch-5.1.1             # 给目录权限
su elsearch # 使用es用户
```

注： `network.host: 127.0.0.1`

```bash
bound or publishing to a non-loopback or non-link-local address, enforcing bootstrap checks
ERROR: bootstrap checks failed
```

我通过设置Nginx代理来访问

## 参考文档

- [Elasticsearch配置](https://www.elastic.co/guide/en/elasticsearch/reference/5.3/settings.html)
- [官方安装Elasticsearch 5.3文档](https://www.elastic.co/guide/en/elasticsearch/reference/5.3/zip-targz.html)
- [Github官方仓库](https://github.com/elastic/elasticsearch-js)
- [npm官方仓库](https://www.npmjs.com/package/elasticsearch)
- [Elasticsearch 权威指南（中文版）](https://www.gitbook.com/book/looly/elasticsearch-the-definitive-guide-cn/details)
- [Node.js 官方文档](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/12.1/index.html)
- [Elasticsearch配置说明](http://www.cnblogs.com/hanyouchun/p/5163183.html)
- [Elasticsearch5.0 安装问题集锦](http://www.cnblogs.com/woxpp/p/6061073.html)