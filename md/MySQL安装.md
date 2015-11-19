# Mac安装MySQL

```bash
brew install mysql
```

通过 brew 安装MySQL 必须重启电脑，不然启动报错哦。

**报错**

```bash
ERROR 2002 (HY000): Can not connect to local MySQL server through socket '/tmp/mysql.sock' (2)
```

# 启动MySQL

```bash
# 启动方法一
$ mysql.server start
# 启动方法二
$ mysql -uroot -h127.0.0.1 -p
```

**报错**

```bash 
Starting MySQL
... ERROR! The server quit without updating PID file 
```


# 开机启动

```bash
$ mkdir -p ~/Library/LaunchAgents
$ cp /usr/local/Cellar/mysql/5.6.16/homebrew.mxcl.mysql.plist ~/Library/LaunchAgents/
# 5.6.16是数据库版本号，根据你当时所安装的版本号自己修改
$ launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
```


- [osx下brew install mysql之后mysql报错的问题](http://blog.csdn.net/qdujunjie/article/details/30492199)

