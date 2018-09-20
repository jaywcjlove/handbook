10分钟快速入门Redis
---

目录
===
<!-- TOC -->

- [Redis安装](#redis安装)
  - [官方编译安装](#官方编译安装)
  - [通过EPEL源安装](#通过epel源安装)
  - [Redis升级](#redis升级)
- [服务管理](#服务管理)
  - [基本服务操作](#基本服务操作)
  - [查看版本](#查看版本)
  - [开机启动](#开机启动)
- [更改配置](#更改配置)
- [设置请求密码](#设置请求密码)
- [主从架构配置](#主从架构配置)
- [基本操作](#基本操作)
- [支持的数据类型](#支持的数据类型)
  - [字符串](#字符串)
  - [Hashes - 哈希值](#hashes---哈希值)
  - [Lists - 列表](#lists---列表)
  - [有序集合](#有序集合)
- [开启通知](#开启通知)
- [开启远程登录连接](#开启远程登录连接)
  - [修改防火墙配置](#修改防火墙配置)
  - [修改配置文件](#修改配置文件)
- [提供的原生监控](#提供的原生监控)
  - [当前链接的客户端数和连接数](#当前链接的客户端数和连接数)
  - [内存最大的键值和平均的键值数据](#内存最大的键值和平均的键值数据)
  - [查看当前的键值情况](#查看当前的键值情况)
  - [原生的Monitor监控](#原生的monitor监控)
- [配置说明](#配置说明)
- [精品文章](#精品文章)

<!-- /TOC -->

## Redis安装

### 官方编译安装

```bash
$ wget http://download.redis.io/releases/redis-4.0.0.tar.gz
$ tar xzvf redis-4.0.0.tar.gz -C /usr/local/
$ cd /usr/local/redis-4.0.0
$ make
$ make test
$ make install 
# 程序会自动执行:
# mkdir -p /usr/local/bin
# cp -pf redis-server /usr/local/bin
# cp -pf redis-benchmark /usr/local/bin
# cp -pf redis-cli /usr/local/bin
# cp -pf redis-check-dump /usr/local/bin
# cp -pf redis-check-aof /usr/local/bin
```

测试`make test`报错

```
$ make test
You need tcl 8.5 or newer in order to run the Redis test
make: *** [test] Error 1
```

这个是需要安装`tcl`

```
wget http://downloads.sourceforge.net/tcl/tcl8.6.1-src.tar.gz  
sudo tar xzvf tcl8.6.1-src.tar.gz  -C /usr/local/  
cd  /usr/local/tcl8.6.1/unix/  
sudo ./configure  
sudo make  
sudo make install   
```

### 通过EPEL源安装

源安装问题在于不能安装最新，或者指定Redis版本。

```bash
yum --enablerepo=epel -y install redis
```

如果没有安装源，通过下面方式安装源。

```bash
cd /etc/yum.repos.d/
rpm -Uvh http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
```

### Redis升级

首先，确保安装了以下repos，EPEL和REMI：

```bash
sudo rpm -Uvh http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
sudo rpm -Uvh http://rpms.remirepo.net/enterprise/remi-release-6.rpm
```

通过`--enablerepo=epel`参数查看指定源Redis版本，检查REMI repo中的Redis版本：

```bash
yum --enablerepo=epel info redis
# Loaded plugins: fastestmirror
# Loading mirror speeds from cached hostfile
#  * base: centos.ustc.edu.cn
#  * epel: mirrors.tuna.tsinghua.edu.cn
#  * extras: centos.ustc.edu.cn
#  * updates: mirrors.zju.edu.cn
# Available Packages
# Name        : redis
# Arch        : x86_64
# Version     : 2.4.10
# Release     : 1.el6
# Size        : 213 k
# Repo        : epel/x86_64
# Summary     : A persistent key-value database
# URL         : http://redis.io
# License     : BSD
# Description : Redis is an advanced key-value store. It is similar to memcached but the data
#             : set is not volatile, and values can be strings, exactly like in memcached, but
#             : also lists, sets, and ordered sets. All this data types can be manipulated with
#             : atomic operations to push/pop elements, add/remove elements, perform server
#             : side union, intersection, difference between sets, and so forth. Redis supports
#             : different kind of sorting abilities.
```

然后从EPEL repo安装相关的依赖关系（jemalloc）：

```bash
yum --enablerepo=epel install jemalloc
```

在安装之前，您应该停止旧的Redis守护进程：

```bash
service redis stop
```

然后安装更新版本的Redis：

```bash
sudo yum --enablerepo=remi install redis
```

## 服务管理

重新启动Redis守护程序，并使其重新启动时自动启动：

```bash
sudo service redis start
sudo chkconfig redis on
```

### 基本服务操作

```bash
## 启动并后台运行
$ redis-server & nohup
## 查是否启动
$ redis-cli ping
## 关闭命令
$ redis-cli shutdown

# 命令行客户端启动
$ redis-cli start
# 启动
$ service redis start
# 停止
$ service redis stop

# 命令行客户端启动
$ redis-cli -p 6380

# 指定端口后台启动
$ redis-server --port 6380 &
```
### 查看版本

检查当前安装的Redis版本：

```bash
# 查看 Redis 版本
$ redis-cli info | grep redis_version

# 查看端口号
$ redis-cli info | grep tcp_port
```

### 开机启动

如果你是通过yum安装，可以使用下面方式开机启动。

```bash
systemctl enable redis.service
chkconfig redis on
```

如果你是编译安装可通过下面方式设置开机启动

我们将在 Redis 安装目录找到`/usr/local/redis-4.0.0/utils`这个目录，在这个目录中有个有个脚本 `redis_init_script`，将此脚本拷贝到`/etc/init.d`目录下，命名为`redis`: 

```bash
cp /usr/local/redis-4.0.0/utils/redis_init_script /etc/init.d/redis
```

拷贝一下`redis.conf` 文件到`/etc/redis`目录下

```bash
cp /usr/local/redis-4.0.0/redis.conf /etc/redis/6380.conf
```

配置文件`6380.conf`需要更改几个地方

```bash
# 是否在后台执行，yes：后台运行；no：不是后台运行（老版本默认）
daemonize yes
```

更改权限，通过 [chkconfig](https://jaywcjlove.github.io/linux-command/c/chkconfig.html) 命令检查、设置系统redis服务开启

```bash
chmod +x /etc/init.d/redis
chkconfig redis on
```

必须把下面两行注释放在 `/etc/init.d/redis` 文件头部，不设置会报不支持的提示 `service redis does not support chkconfig`

```bash
# chkconfig:   2345 90 10
# description:  redis is a persistent key-value database
```

上面的注释的意思是，redis服务必须在运行级2，3，4，5下被启动或关闭，启动的优先级是90，关闭的优先级是10。

**Redis 启动警告错误解决**

1. WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.

```shell
echo "vm.overcommit_memory=1" > /etc/sysctl.conf  # 或 vi /etcsysctl.conf , 然后reboot重启机器
echo 1 > /proc/sys/vm/overcommit_memory  # 不需要启机器就生效
```

2. WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.

```shell
echo 511 > /proc/sys/net/core/somaxconn
```

## 更改配置

Redis 的配置文件位于 Redis 安装目录下，文件名为 `redis.conf`。上面已经将它拷贝到`/etc/redis`目录下了，配置文件在 `sudo vi /etc/redis/6380.conf` 这里可以编辑

```bash
sudo vi /etc/redis/6380.conf
```

你可以通过 CONFIG 命令查看或设置配置项。配置设置命令

```bash
## 进入redis获取
127.0.0.1:6379> CONFIG GET CONFIG_SETTING_NAME
## 进入redis设置
127.0.0.1:6379> CONFIG SET CONFIG_SETTING_NAME NEW_CONFIG_VALUE

## 获取所有配置
127.0.0.1:6379> CONFIG GET *

## 设置配置开启通知功能
$ redis-cli config set notify-keyspace-events KEA
```

## 设置请求密码

打开 `vim /etc/redis/6380.conf` 配置文件编辑它，更改下面两项内容：

```bash
# ...
# requirepass foobared
# 更改成下面内容，把 foobared 改为你想要设置的密码
requirepass 111111

# bind 127.0.0.1 去掉 # 注释并改为
bind 0.0.0.0
```

更改为之后你就可以带密码访问redis了。

```bash
redis-cli -h 127.0.0.1 -p 6379 -a 111111
```

## 主从架构配置

假设有两台服务器，一台做主，一台做从

```bash
Redis 主信息：
  IP：12.168.1.114
  端口：6379
Redis 从信息：
  IP：12.168.1.115
  端口：6379
```

编辑从机的 Redis 配置文件，找到 `# slaveof`开头的这一行应该是注释的：`# slaveof <masterip> <masterport>`我们需要去掉该注释，并且填写我们自己的主机的 IP 和 端口，比如：`slaveof 192.168.1.114 6379`。

```bash
# slaveof <自己的主机的 IP> <自己的主机的 端口>
# 这行更改成下面内容
slaveof 192.168.1.114 6379
```

配置完成后重启从机 Redis 服务重启完之后，进入主机的 redis-cli 状态下，输入：`INFO replication` 可以查询到当前主机的 redis 处于什么角色，有哪些从机已经连上主机。

此时已经完成了主从配置，我们可以测试下：

1. 我们进入主机的 redis-cli 状态，然后 set 某个值，比如：set mygithub jaywcjlove
2. 我们切换进入从机的 redis-cli 的状态下，获取刚刚设置的值看是否存在：get mygithub，此时，我们可以发现是可以获取到值的。
3. 但是有一个需要注意的：从库不具备写入数据能力，不然会报错。 从库只有只读能力。

## 基本操作

```bash
## 命令行客户端启动
$ redis-cli

# 测试心跳
127.0.0.1:6379> ping
PONG

# 设置 mykey 键的值
127.0.0.1:6379> set mykey hello
OK

# 获取 mykey 键的值
127.0.0.1:6379> get mykey
"hello"

## 设置 mykey 失效事件
127.0.0.1:6379> expire mykey 2


# 查看当前redis的配置信息
127.0.0.1:6379> config get *

# 获取所有的key
127.0.0.1:6379> keys *

# 删除redis当前数据库中的所有Key
127.0.0.1:6379> flushdb

127.0.0.1:6379> config get dir

# 馋哭当前库 key 的数量
127.0.0.1:6379> dbsize

# 删除所有数据库中的key
127.0.0.1:6379> flushall

# 退出
127.0.0.1:6379> exit


# 找出拖慢 Redis 的罪魁祸首
# 通过这个工具可以查看所有命令统计的快照，
# 比如命令执行了多少次，
# 执行命令所耗费的毫秒数(每个命令的总时间和平均时间)
# 只需要简单地执行 CONFIG RESETSTAT 命令就可以重置，这样你就可以得到一个全新的统计结果。

127.0.0.1:6379> commandstats
cmdstat_get:calls=78,usec=608,usec_per_call=7.79
cmdstat_setex:calls=5,usec=71,usec_per_call=14.20
cmdstat_keys:calls=2,usec=42,usec_per_call=21.00
cmdstat_info:calls=10,usec=1931,usec_per_call=193.10
```

## 支持的数据类型

### 字符串

```bash
# 启动客户端 ,存储字符串到redis.
redis> SET name forezp
OK
# 取字符串:
redis> get name 
"forezp"
```

### Hashes - 哈希值

```bash
redis > HMSET king username forezp password xxdxx age 22
redis > HGETALL king
1) "username"
2) "forezp "
3) "password "
4) "xxdxx "
5) "age "
6) "22"
```


### Lists - 列表

```bash
redis> lpush pricess kenny
(integer) 1
redis 127.0.0.1:6379> lpush pricess jolin
(integer) 2
redis 127.0.0.1:6379> lpush pricess mayun
(integer) 3
redis 127.0.0.1:6379> lrange pricess 0 10
1) "kenny"
2) "jolin"
3) "mayun"
```

### 有序集合

```bash
redis > ZADD kindom 1 redis
(integer) 1
redis> ZADD kindom 2 mongodb
(integer) 1
redis > ZADD kindom 3 mysql
(integer) 1
redis > ZADD kindom 3 mysql
(integer) 0
redis > ZADD kindom 4 mysql
(integer) 0
redis > ZRANGE kindom 0 10 WITHSCORES
1) "redis"
2) "1"
3) "mongodb"
4) "2"
5) "mysql"
6) "4"
```

## 开启通知

键空间事件通知默认被禁用，因为这个特性消耗CPU电量不是很明智。使用`redis.conf`的`notify-keyspace-events`，或者通过`CONFIG SET`来开启通知。 

```bash 
## 设置配置开启通知功能
$ redis-cli config set notify-keyspace-events KEA
## 命令行监控所有通知
$ redis-cli --csv psubscribe '__key*__:*'
Reading messages... (press Ctrl-C to quit)
"psubscribe","__key*__:*",1
```

键值说明

```bash
K     Keyspace events, published with __keyspace@<db>__ prefix.  
E     Keyevent events, published with __keyevent@<db>__ prefix.  
g     Generic commands (non-type specific) like DEL, EXPIRE, RENAME, ...  
$     String commands  
l     List commands  
s     Set commands  
h     Hash commands  
z     Sorted set commands  
x     Expired events (events generated every time a key expires)  
e     Evicted events (events generated when a key is evicted for maxmemory)  
A     Alias for g$lshzxe, so that the "AKE" string means all the events. 
```

不同命令产生的事件(Events generated by different commands) 

按照下面的清单，不同的命令产生不同类型的事件。 [Redis Keyspace Notifications](http://redis.io/topics/notifications)

- DEL 为每一个被删除的键产生一个del事件。
- RENAME 产生两个事件，为源键产生一个rename_from事件，为目标键产生一个rename_to事件。
- EXPIRE 当为键设置过期时产生一个expire事件，或者每当设置了过期的键被删除时产生一个expired事件(查看EXPIRE文档获取更多信息)。
- SORT 当STORE用于设置一个新键时产生一个sortstore事件。当结果列表为空，并且使用了STORE选项，并且已经有一个该名字的键存在，那么这个件键被删除，所以这种条件下或产生一个del事件。
- SET及其所有变种(SETEX, SETNX,GETSET) 产生set事件。但是SETEX还会产生一个expire事件。
- MSET 为每个键产生一个单独的set事件。
- SETRANGE 产生一个setrange事件。
- INCR, DECR, INCRBY, DECRBY 都产生incrby事件。
- INCRBYFLOAT 产生一个incrbyfloat事件。
- APPEND 产生一个append事件。
- LPUSH和LPUSHX 产生单个lpush事件，即使在可变情况下(even in the variadic case)。
- RPUSH和RPUSHX 产生单个rpush事件，即使在可变情况下(even in the variadic case)。
- RPOP 产生一个rpop事件。如果键由于最后一个元素被从列表中弹出而导致删除，会又产生一个del事件。
- LPOP 产生一个lpop事件。如果键由于最后一个元素被从列表中弹出而导致删除，会又产生一个del事件。
- LINSERT 产生一个linsert事件。
- LSET 产生一个lset事件。
- LREM 产生一个lrem事件。如果结果列表为空并且键被删除，会又产生一个del事件。
- LTRIM 产生一个ltrim事件。如果结果列表为空并且键被删除，会又产生一个del事件。
- RPOPLPUSH和BRPOPLPUSH 产生一个rpop事件和一个lpush事件。两种情况下顺序都能保证 (lpush事件总是在rpop事件之后被传递) 如果结果列表长度为零并且键被删除，会又产生一个del事件。
- HSET, HSETNX和HMSET 都产生单个hset事件。
- HINCRBY 产生一个hincrby事件。
- HINCRBYFLOAT 产生一个hincrbyfloat事件。
- HDEL 产生单个hdel事件。如果结果哈希为空并且键被删除，会又产生一个del事件。
- SADD 产生单个sadd事件，即使在可变情况下(even in the variadic case)。
- SREM 产生单个srem事件。如果结果集合为空并且键被删除，会又产生一个del事件。
- SMOVE 为源键产生一个srem事件为目标键产生一个sadd事件。
- SPOP 产生一个spop事件。如果结果集合为空并且键被删除，会又产生一个del事件。
- SINTERSTORE, SUNIONSTORE, SDIFFSTORE 分别产生sinterstore，sunionostore，sdiffstore事件。在特殊情况下，集合为空，且存储结果的键已经存在，由于键被删除，会产生一个del事件。
- ZINCR 产生一个zincr事件。
- ZADD产生单个zadd事件，即使添加了多个元素。.
- ZREM 产生单个zrem事件，即使删除了多个元素。当结果有序集合为空，并且键被生成时，会产生一个额外的del事件。
- ZREMBYSCORE 产生单个zrembyscore事件。当结果有序集合为空，并且键被生成时，会产生一个额外的del事件。
- ZREMBYRANK 产生单个zrembyrank事件。当结果有序集合为空，并且键被生成时，会产生一个额外的del事件。
- ZINTERSTORE和ZUNIONSTORE 分别产生zinterstore和zunionstore事件。在特殊情况下，集合为空，且存储结果的键已经存在，由于键被删除，会产生一个del事件。
- 每当一个关联有生存事件的键由于过期而被从数据集中删除时会产生一个expired事件。
- 每当一个键由于maxmemory策略而从数据集中被淘汰以节省内存时会产生一个evicted事件。

## 开启远程登录连接


使用 netstat 来查看端口占用情况，6379为默认Redis端口。

```bash
netstat -nlt|grep 6379
```

- -t：指明显示 TCP 端口
- -u：指明显示 UDP 端口
- -l：仅显示监听套接字
- -p：显示进程标识符和程序名称，每一个套接字/端口都属于一个程序。
- -n：不进行 DNS 轮询，显示 IP （可以加速操作）

### 修改防火墙配置

修改防火墙配置 sudo vi /etc/sysconfig/iptables

```bash
-A INPUT -m state --state NEW -m tcp -p tcp --dport 6379 -j ACCEPT
```

###  修改配置文件

Redis protected-mode 是3.2 之后加入的新特性，在Redis.conf的注释中，我们可以了解到，他的具体作用和启用条件。可以在 sudo vi /etc/redis.conf 中编辑，修改配置文件。

```bash
# Protected mode is a layer of security protection, in order to avoid that
# Redis instances left open on the internet are accessed and exploited.
#
# When protected mode is on and if:
#
# 1) The server is not binding explicitly to a set of addresses using the
#    "bind" directive.
# 2) No password is configured.
#
# The server only accepts connections from clients connecting from the
# IPv4 and IPv6 loopback addresses 127.0.0.1 and ::1, and from Unix domain
# sockets.
#
# By default protected mode is enabled. You should disable it only if
# you are sure you want clients from other hosts to connect to Redis
# even if no authentication is configured, nor a specific set of interfaces
# are explicitly listed using the "bind" directive.
protected-mode yes

```

它启用的条件，有两个：

1. 没有bind IP
2. 没有设置访问密码

如果启用了，则只能够通过lookback ip（127.0.0.1）访问Redis cache，如果从外网访问，则会返回相应的错误信息：

```bash
(error) DENIED Redis is running in protected mode because protected mode is enabled, no bind address was specified, no authentication password is requested to clients. In this mode connections are only accepted from the lookback interface. If you want to connect from external computers to Redis you may adopt one of the following solutions: 1) Just disable protected mode sending the command 'CONFIG SET protected-mode no' from the loopback interface by connecting to Redis from the same host the server is running, however MAKE SURE Redis is not publicly accessible from internet if you do so. Use CONFIG REWRITE to make this change permanent. 2) Alternatively you can just disable the protected mode by editing the Redis configuration file, and setting the protected mode option to 'no', and then restarting the server. 3) If you started the server manually just for testing, restart it with the --portected-mode no option. 4) Setup a bind address or an authentication password. NOTE: You only need to do one of the above things in order for the server to start accepting connections from the outside.
```

## 提供的原生监控

### 当前链接的客户端数和连接数

`redis-cli --stat`查看当前连接的客户端数，连接数等

```bash
------- data ------ --------------------- load -------------------- - child -
keys       mem      clients blocked requests            connections
4          1.27M    6       0       17340 (+0)          111
4          1.27M    6       0       17341 (+1)          111
4          1.27M    6       0       17342 (+1)          111
4          1.27M    6       0       17343 (+1)          111
```

### 内存最大的键值和平均的键值数据

`redis-cli --bigkeys` 对当前占用内存最大的键值和平均的键值数据，也可以通过指定`-i`参数定时查看当前的视图情况。

```bash
# Scanning the entire keyspace to find biggest keys as well as
# average sizes per key type.  You can use -i 0.1 to sleep 0.1 sec
# per 100 SCAN commands (not usually needed).

[00.00%] Biggest string found so far 'asdf.js' with 3 bytes
[00.00%] Biggest string found so far 'wabg-tokeneyJhbGciOiJIUzI1NiJ9.NA.UGGRiB2I42rP-33cIMrcoPub7AzHgDlqHacAKFw1pfE' with 328 bytes
[00.00%] Biggest string found so far 'wabg-token-province' with 231042 bytes

-------- summary -------

Sampled 4 keys in the keyspace!
Total key length in bytes is 180 (avg len 45.00)

Biggest string found 'wabg-token-province' has 231042 bytes

4 strings with 231819 bytes (100.00% of keys, avg size 57954.75)
0 lists with 0 items (00.00% of keys, avg size 0.00)
0 sets with 0 members (00.00% of keys, avg size 0.00)
0 hashs with 0 fields (00.00% of keys, avg size 0.00)
0 zsets with 0 members (00.00% of keys, avg size 0.00)
```

### 查看当前的键值情况

`redis-cli --scan`提供和`keys *`相似的功能，查看当前的键值情况，可以通过正则表达


```bash 
$ redis-cli --scan

sess:K4xh-bxOBrcXpy9kEW87oiy-u7I2sAA5
asdf.js
sess:1tGNZSXW8GyoEQsbtpqkA5tMmSFp_ZIn
wabg-tokeneyJhbGciOiJIUzI1NiJ9.NA.UGGRiB2I42rP-33cIMrcoPub7AzHgDlqHacAKFw1pfE
sess:3e4NGIJd0wf1-RONeTt-FsXQj4EaVNjk
wabg-token-province
sess:UuCLAX2sWZ50fiIO1qvDgulf0XIZRd98
wabg-tokeneyJhbGciOiJIUzI1NiJ9.MQ.6z44GClzAsUED1M_UyxqdREdDKcYFnL9tSqd5ZhLhsY
sess:2HEchaRLYUoaa44IF1bB6mpik7lZjBb4
```

### 原生的Monitor监控

redis-cli monitor打印出所有sever接收到的命令以及其对应的客户端地址

```bash
$ redis-cli monitor
OK
1472626566.218175 [0 127.0.0.1:62862] "info"
1472626571.220948 [0 127.0.0.1:62862] "exists" "aaa"
1472626571.223174 [0 127.0.0.1:62862] "set" "aaa" ""
1472626571.232126 [0 127.0.0.1:62862] "type" "aaa"
1472626571.243697 [0 127.0.0.1:62862] "pttl" "aaa"
1472626571.243717 [0 127.0.0.1:62862] "object" "ENCODING" "aaa"
1472626571.243726 [0 127.0.0.1:62862] "strlen" "aaa"
```

## 配置说明

```bash
#redis.conf
# Redis configuration file example.
# ./redis-server /path/to/redis.conf

################################## INCLUDES ###################################
#这在你有标准配置模板但是每个redis服务器又需要个性设置的时候很有用。
# include /path/to/local.conf
# include /path/to/other.conf

################################ GENERAL #####################################

# 是否在后台执行，yes：后台运行；no：不是后台运行（老版本默认）
daemonize yes

# 3.2里的参数，是否开启保护模式，默认开启。要是配置里没有指定bind和密码。
# 开启该参数后，redis只会本地进行访问，拒绝外部访问。
# 要是开启了密码   和bind，可以开启。否   则最好关闭，设置为no。

protected-mode yes
# redis的进程文件
pidfile /var/run/redis/redis-server.pid

# redis监听的端口号。
port 6379

# 此参数确定了TCP连接中已完成队列(完成三次握手之后)的长度， 
# 当然此值必须不大于Linux系统定义的/proc/sys/net/core/somaxconn值，默认是511，
# 而Linux的默认参数值是128。当系统并发量大并且客户端速度缓慢的时候，
# 可以将这二个参数一起参考设定。该内核参数默认值一般是128，对于负载很大的服务程序来说大大的不够。
# 一般会将它修改为2048或者更大。在/etc/sysctl.conf中添加:net.core.somaxconn = 2048，然后在终端中执行sysctl -p。
tcp-backlog 511

#指定 redis 只接收来自于该 IP 地址的请求，如果不进行设置，那么将处理所有请求
bind 127.0.0.1

# 配置unix socket来让redis支持监听本地连接。
# unixsocket /var/run/redis/redis.sock
# 配置unix socket使用文件的权限
# unixsocketperm 700

# 此参数为设置客户端空闲超过timeout，服务端会断开连接，为0则服务端不会主动断开连接，不能小于0。
timeout 0

# tcp keepalive参数。如果设置不为0，就使用配置tcp的SO_KEEPALIVE值，
# 使用keepalive有两个好处:检测挂掉的对端。降低中间设备出问题而导致网络看似连接却已经与对端端口的问题。
# 在Linux内核中，设置了keepalive，redis会定时给对端发送ack。检测到对端关闭需要两倍的设置值。
tcp-keepalive 0

# 指定了服务端日志的级别。级别包括：debug（很多信息，方便开发、测试），
# verbose（许多有用的信息，但是没有debug级别信息多），notice（适当的日志级别，适合生产环境），warn（只有非常重要的信息）
loglevel notice

#指定了记录日志的文件。空字符串的话，日志会打印到标准输出设备。后台运行的redis标准输出是/dev/null。
logfile /var/log/redis/redis-server.log

# 是否打开记录syslog功能
# syslog-enabled no

# syslog的标识符。
# syslog-ident redis

# 日志的来源、设备
# syslog-facility local0

# 数据库的数量，默认使用的数据库是DB 0。可以通过”SELECT “命令选择一个db
databases 16

################################ SNAPSHOTTING ################################
# 快照配置
# 注释掉“save”这一行配置项就可以让保存数据库功能失效
# 设置sedis进行数据库镜像的频率。
# 900秒（15分钟）内至少1个key值改变（则进行数据库保存--持久化） 
# 300秒（5分钟）内至少10个key值改变（则进行数据库保存--持久化） 
# 60秒（1分钟）内至少10000个key值改变（则进行数据库保存--持久化）
save 900 1
save 300 10
save 60 10000

# 当RDB持久化出现错误后，是否依然进行继续进行工作，yes：不能进行工作，no：可以继续进行工作，
# 可以通过info中的rdb_last_bgsave_status了解RDB持久化是否有错误
stop-writes-on-bgsave-error yes

# 使用压缩rdb文件，rdb文件压缩使用LZF压缩算法，yes：压缩，但是需要一些cpu的消耗。no：不压缩，需要更多的磁盘空间
rdbcompression yes

# 是否校验rdb文件。从rdb格式的第五个版本开始，在rdb文件的末尾会带上CRC64的校验和。
# 这跟有利于文件的容错性，但是在保存rdb文件的时候，会有大概10%的性能损耗，所以如果你追求高性能，可以关闭该配置。
rdbchecksum yes

# rdb文件的名称
dbfilename dump.rdb

# 数据目录，数据库的写入会在这个目录。rdb、aof文件也会写在这个目录
dir /var/lib/redis

################################# REPLICATION #################################
# 复制选项，slave复制对应的master。
# slaveof <masterip> <masterport>

#如果master设置了requirepass，那么slave要连上master，需要有master的密码才行。masterauth就是用来配置master的密码，这样可以在连上master后进行认证。
# masterauth <master-password>

#当从库同主机失去连接或者复制正在进行，从机库有两种运行方式：1) 如果slave-serve-stale-data设置为yes(默认设置)，从库会继续响应客户端的请求。2) 如果slave-serve-stale-data设置为no，除去INFO和SLAVOF命令之外的任何请求都会返回一个错误”SYNC with master in progress”。
slave-serve-stale-data yes

#作为从服务器，默认情况下是只读的（yes），可以修改成NO，用于写（不建议）。
slave-read-only yes

#是否使用socket方式复制数据。目前redis复制提供两种方式，disk和socket。如果新的slave连上来或者重连的slave无法部分同步，就会执行全量同步，master会生成rdb文件。有2种方式：disk方式是master创建一个新的进程把rdb文件保存到磁盘，再把磁盘上的rdb文件传递给slave。socket是master创建一个新的进程，直接把rdb文件以socket的方式发给slave。disk方式的时候，当一个rdb保存的过程中，多个slave都能共享这个rdb文件。socket的方式就的一个个slave顺序复制。在磁盘速度缓慢，网速快的情况下推荐用socket方式。
repl-diskless-sync no

#diskless复制的延迟时间，防止设置为0。一旦复制开始，节点不会再接收新slave的复制请求直到下一个rdb传输。所以最好等待一段时间，等更多的slave连上来。
repl-diskless-sync-delay 5

#slave根据指定的时间间隔向服务器发送ping请求。时间间隔可以通过 repl_ping_slave_period 来设置，默认10秒。
# repl-ping-slave-period 10

#复制连接超时时间。master和slave都有超时时间的设置。master检测到slave上次发送的时间超过repl-timeout，即认为slave离线，清除该slave信息。slave检测到上次和master交互的时间超过repl-timeout，则认为master离线。需要注意的是repl-timeout需要设置一个比repl-ping-slave-period更大的值，不然会经常检测到超时。
# repl-timeout 60

#是否禁止复制tcp链接的tcp nodelay参数，可传递yes或者no。默认是no，即使用tcp nodelay。如果master设置了yes来禁止tcp nodelay设置，在把数据复制给slave的时候，会减少包的数量和更小的网络带宽。但是这也可能带来数据的延迟。默认我们推荐更小的延迟，但是在数据量传输很大的场景下，建议选择yes。
repl-disable-tcp-nodelay no

#复制缓冲区大小，这是一个环形复制缓冲区，用来保存最新复制的命令。这样在slave离线的时候，不需要完全复制master的数据，如果可以执行部分同步，只需要把缓冲区的部分数据复制给slave，就能恢复正常复制状态。缓冲区的大小越大，slave离线的时间可以更长，复制缓冲区只有在有slave连接的时候才分配内存。没有slave的一段时间，内存会被释放出来，默认1m。
# repl-backlog-size 5mb

#master没有slave一段时间会释放复制缓冲区的内存，repl-backlog-ttl用来设置该时间长度。单位为秒。
# repl-backlog-ttl 3600

#当master不可用，Sentinel会根据slave的优先级选举一个master。最低的优先级的slave，当选master。而配置成0，永远不会被选举。
slave-priority 100

#redis提供了可以让master停止写入的方式，如果配置了min-slaves-to-write，健康的slave的个数小于N，mater就禁止写入。master最少得有多少个健康的slave存活才能执行写命令。这个配置虽然不能保证N个slave都一定能接收到master的写操作，但是能避免没有足够健康的slave的时候，master不能写入来避免数据丢失。设置为0是关闭该功能。
# min-slaves-to-write 3

#延迟小于min-slaves-max-lag秒的slave才认为是健康的slave。
# min-slaves-max-lag 10

# 设置1或另一个设置为0禁用这个特性。
# Setting one or the other to 0 disables the feature.
# By default min-slaves-to-write is set to 0 (feature disabled) and
# min-slaves-max-lag is set to 10.

################################## SECURITY ###################################
#requirepass配置可以让用户使用AUTH命令来认证密码，才能使用其他命令。这让redis可以使用在不受信任的网络中。为了保持向后的兼容性，可以注释该命令，因为大部分用户也不需要认证。使用requirepass的时候需要注意，因为redis太快了，每秒可以认证15w次密码，简单的密码很容易被攻破，所以最好使用一个更复杂的密码。
# requirepass foobared

#把危险的命令给修改成其他名称。比如CONFIG命令可以重命名为一个很难被猜到的命令，这样用户不能使用，而内部工具还能接着使用。
# rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52

#设置成一个空的值，可以禁止一个命令
# rename-command CONFIG ""
################################### LIMITS ####################################

# 设置能连上redis的最大客户端连接数量。默认是10000个客户端连接。
# 由于redis不区分连接是客户端连接还是内部打开文件或者和slave连接等，所以maxclients最小建议设置到32。
# 如果超过了maxclients，redis会给新的连接发送’max number of clients reached’，并关闭连接。
# maxclients 10000

# redis配置的最大内存容量。当内存满了，需要配合maxmemory-policy策略进行处理。
# 注意slave的输出缓冲区是不计算在maxmemory内的。所以为了防止主机内存使用完，建议设置的maxmemory需要更小一些。
# maxmemory <bytes>

# 内存容量超过maxmemory后的处理策略。
# volatile-lru：利用LRU算法移除设置过过期时间的key。
# volatile-random：随机移除设置过过期时间的key。
# volatile-ttl：移除即将过期的key，根据最近过期时间来删除（辅以TTL）
# allkeys-lru：利用LRU算法移除任何key。
# allkeys-random：随机移除任何key。
# noeviction：不移除任何key，只是返回一个写错误。
# 上面的这些驱逐策略，如果redis没有合适的key驱逐，对于写命令，还是会返回错误。
# redis将不再接收写请求，只接收get请求。
# 写命令包括：set setnx setex append incr decr rpush lpush rpushx lpushx linsert lset rpoplpush sadd sinter sinterstore sunion sunionstore sdiff sdiffstore zadd zincrby zunionstore zinterstore hset hsetnx hmset hincrby incrby decrby getset mset msetnx exec sort。
# maxmemory-policy noeviction

#lru检测的样本数。使用lru或者ttl淘汰算法，从需要淘汰的列表中随机选择sample个key，选出闲置时间最长的key移除。
# maxmemory-samples 5

############################## APPEND ONLY MODE ###############################
#默认redis使用的是rdb方式持久化，这种方式在许多应用中已经足够用了。但是redis如果中途宕机，会导致可能有几分钟的数据丢失，根据save来策略进行持久化，Append Only File是另一种持久化方式，可以提供更好的持久化特性。Redis会把每次写入的数据在接收后都写入 appendonly.aof 文件，每次启动时Redis都会先把这个文件的数据读入内存里，先忽略RDB文件。
appendonly no

#aof文件名
appendfilename "appendonly.aof"

# aof持久化策略的配置
# no表示不执行fsync，由操作系统保证数据同步到磁盘，速度最快。
# always表示每次写入都执行fsync，以保证数据同步到磁盘。
# everysec表示每秒执行一次fsync，可能会导致丢失这1s数据。
appendfsync everysec

# 在aof重写或者写入rdb文件的时候，会执行大量IO，
# 此时对于everysec和always的aof模式来说，执行fsync会造成阻塞过长时间，
# no-appendfsync-on-rewrite字段设置为默认设置为no。
# 如果对延迟要求很高的应用，这个字段可以设置为yes，否则还是设置为no，
# 这样对持久化特性来说这是更安全的选择。设置为yes表示rewrite期间对新写操作不fsync,
# 暂时存在内存中,等rewrite完成后再写入，默认为no，建议yes。Linux的默认fsync策略是30秒。可能丢失30秒数据。
no-appendfsync-on-rewrite no

# aof自动重写配置。当目前aof文件大小超过上一次重写的aof文件大小的百分之多少进行重写，
# 即当aof文件增长到一定大小的时候Redis能够调用bgrewriteaof对日志文件进行重写。
# 当前AOF文件大小是上次日志重写得到AOF文件大小的二倍（设置为100）时，自动启动新的日志重写过程。
auto-aof-rewrite-percentage 100
#设置允许重写的最小aof文件大小，避免了达到约定百分比但尺寸仍然很小的情况还要重写
auto-aof-rewrite-min-size 64mb

# aof文件可能在尾部是不完整的，当redis启动的时候，aof文件的数据被载入内存。
# 重启可能发生在redis所在的主机操作系统宕机后，
# 尤其在ext4文件系统没有加上data=ordered选项（redis宕机或者异常终止不会造成尾部不完整现象。）
# 出现这种现象，可以选择让redis退出，或者导入尽可能多的数据。如果选择的是yes，
# 当截断的aof文件被导入的时候，会自动发布一个log给客户端然后load。如果是no，用户必须手动redis-check-aof修复AOF文件才可以。
aof-load-truncated yes

################################ LUA SCRIPTING ###############################
# 如果达到最大时间限制（毫秒），redis会记个log，然后返回error。
# 当一个脚本超过了最大时限。
# 只有SCRIPT KILL和SHUTDOWN NOSAVE可以用。
# 第一个可以杀没有调write命令的东西。要是已经调用了write，只能用第二个命令杀。
lua-time-limit 5000

################################ REDIS CLUSTER ###############################
# 集群开关，默认是不开启集群模式。
# cluster-enabled yes

# 集群配置文件的名称，每个节点都有一个集群相关的配置文件，持久化保存集群的信息。
# 这个文件并不需要手动配置，这个配置文件有Redis生成并更新，每个Redis集群节点需要一个单独的配置文件，
# 请确保与实例运行的系统中配置文件名称不冲突
# cluster-config-file nodes-6379.conf

# 节点互连超时的阀值。集群节点超时毫秒数
# cluster-node-timeout 15000

# 在进行故障转移的时候，全部slave都会请求申请为master，但是有些slave可能与master断开连接一段时间了，
# 导致数据过于陈旧，这样的slave不应该被提升为master。该参数就是用来判断slave节点与master断线的时间是否过长。判断方法是：
# 比较slave断开连接的时间和(node-timeout * slave-validity-factor) + repl-ping-slave-period
# 如果节点超时时间为三十秒, 并且slave-validity-factor为10,假设默认的repl-ping-slave-period是10秒，
# 即如果超过310秒slave将不会尝试进行故障转移 
# cluster-slave-validity-factor 10

# master的slave数量大于该值，slave才能迁移到其他孤立master上，
# 如这个参数若被设为2，那么只有当一个主节点拥有2 个可工作的从节点时，它的一个从节点会尝试迁移。
# cluster-migration-barrier 1

# 默认情况下，集群全部的slot有节点负责，集群状态才为ok，才能提供服务。
# 设置为no，可以在slot没有全部分配的时候提供服务。
# 不建议打开该配置，这样会造成分区的时候，小分区的master一直在接受写请求，而造成很长时间数据不一致。
# cluster-require-full-coverage yes

################################## SLOW LOG ###################################
###slog log是用来记录redis运行中执行比较慢的命令耗时。当命令的执行超过了指定时间，就记录在slow log中，slog log保存在内存中，所以没有IO操作。
#执行时间比slowlog-log-slower-than大的请求记录到slowlog里面，单位是微秒，所以1000000就是1秒。注意，负数时间会禁用慢查询日志，而0则会强制记录所有命令。
slowlog-log-slower-than 10000

#慢查询日志长度。当一个新的命令被写进日志的时候，最老的那个记录会被删掉。这个长度没有限制。只要有足够的内存就行。你可以通过 SLOWLOG RESET 来释放内存。
slowlog-max-len 128

################################ LATENCY MONITOR ##############################
#延迟监控功能是用来监控redis中执行比较缓慢的一些操作，用LATENCY打印redis实例在跑命令时的耗时图表。只记录大于等于下边设置的值的操作。0的话，就是关闭监视。默认延迟监控功能是关闭的，如果你需要打开，也可以通过CONFIG SET命令动态设置。
latency-monitor-threshold 0

############################# EVENT NOTIFICATION ##############################
#键空间通知使得客户端可以通过订阅频道或模式，来接收那些以某种方式改动了 Redis 数据集的事件。因为开启键空间通知功能需要消耗一些 CPU ，所以在默认配置下，该功能处于关闭状态。
#notify-keyspace-events 的参数可以是以下字符的任意组合，它指定了服务器该发送哪些类型的通知：
##K 键空间通知，所有通知以 __keyspace@__ 为前缀
##E 键事件通知，所有通知以 __keyevent@__ 为前缀
##g DEL 、 EXPIRE 、 RENAME 等类型无关的通用命令的通知
##$ 字符串命令的通知
##l 列表命令的通知
##s 集合命令的通知
##h 哈希命令的通知
##z 有序集合命令的通知
##x 过期事件：每当有过期键被删除时发送
##e 驱逐(evict)事件：每当有键因为 maxmemory 政策而被删除时发送
##A 参数 g$lshzxe 的别名
#输入的参数中至少要有一个 K 或者 E，否则的话，不管其余的参数是什么，都不会有任何 通知被分发。详细使用可以参考http://redis.io/topics/notifications

notify-keyspace-events "KEA"

############################### ADVANCED CONFIG ###############################
# 数据量小于等于hash-max-ziplist-entries的用ziplist，大于hash-max-ziplist-entries用hash
hash-max-ziplist-entries 512
# value大小小于等于hash-max-ziplist-value的用ziplist，大于hash-max-ziplist-value用hash。
hash-max-ziplist-value 64

# 数据量小于等于list-max-ziplist-entries用ziplist，大于list-max-ziplist-entries用list。
list-max-ziplist-entries 512
# value大小小于等于list-max-ziplist-value的用ziplist，大于list-max-ziplist-value用list。
list-max-ziplist-value 64

# 数据量小于等于set-max-intset-entries用iniset，大于set-max-intset-entries用set。
set-max-intset-entries 512

# 数据量小于等于zset-max-ziplist-entries用ziplist，大于zset-max-ziplist-entries用zset。
zset-max-ziplist-entries 128
# value大小小于等于zset-max-ziplist-value用ziplist，大于zset-max-ziplist-value用zset。
zset-max-ziplist-value 64

# value大小小于等于hll-sparse-max-bytes使用稀疏数据结构（sparse），
# 大于hll-sparse-max-bytes使用稠密的数据结构（dense）。
# 一个比16000大的value是几乎没用的，建议的value大概为3000。
# 如果对CPU要求不高，对空间要求较高的，建议设置到10000左右。
hll-sparse-max-bytes 3000

# Redis将在每100毫秒时使用1毫秒的CPU时间来对redis的hash表进行重新hash，可以降低内存的使用。
# 当你的使用场景中，有非常严格的实时性需要，不能够接受Redis时不时的对请求有2毫秒的延迟的话，把这项配置为no。
# 如果没有这么严格的实时性要求，可以设置为yes，以便能够尽可能快的释放内存。
activerehashing yes

# 对客户端输出缓冲进行限制可以强迫那些不从服务器读取数据的客户端断开连接，用来强制关闭传输缓慢的客户端。
# 对于normal client，第一个0表示取消hard limit，第二个0和第三个0表示取消soft limit，normal client默认取消限制，因为如果没有寻问，他们是不会接收数据的。
client-output-buffer-limit normal 0 0 0
# 对于slave client和MONITER client，如果client-output-buffer一旦超过256mb，又或者超过64mb持续60秒，那么服务器就会立即断开客户端连接。
client-output-buffer-limit slave 256mb 64mb 60
# 对于pubsub client，如果client-output-buffer一旦超过32mb，又或者超过8mb持续60秒，那么服务器就会立即断开客户端连接。
client-output-buffer-limit pubsub 32mb 8mb 60

# redis执行任务的频率为1s除以hz。
hz 10

# 在aof重写的时候，如果打开了aof-rewrite-incremental-fsync开关，系统会每32MB执行一次fsync。这对于把文件写入磁盘是有帮助的，可以避免过大的延迟峰值。
aof-rewrite-incremental-fsync yes
```

## 精品文章

- [史上最全Redis高可用技术解决方案大全](https://mp.weixin.qq.com/s/BoLsVKYyu8yRXZbxd1uuQw)
- [Redis 4.0 新功能简介](http://blog.huangz.me/diary/2016/redis-4-outline.html)
- [Redis 学习路线](http://blog.huangz.me/diary/2016/how-to-learn-redis.html)
- [Redis架构之防雪崩设计：网站不宕机背后的兵法](https://mp.weixin.qq.com/s/TBCEwLVAXdsTszRVpXhVug)
- [Redis的内存优化](https://cachecloud.github.io/2017/02/16/Redis%E5%86%85%E5%AD%98%E4%BC%98%E5%8C%96/)
- [细说Redis监控和告警](https://zhuoroger.github.io/2016/08/20/redis-monitor-and-alarm/)
- [搜狐视频(sohu tv)Redis私有云平台](https://github.com/sohutv/cachecloud)
- [优酷土豆的Redis服务平台化之路](https://mp.weixin.qq.com/s?__biz=MzA5NzkxMzg1Nw==&mid=2653159795&idx=1&sn=10264108e1da670774b4b53a1e6dbbe4&scene=0)
- [这可能是最全的 Redis 集群方案介绍了](https://mp.weixin.qq.com/s?__biz=MzA3MzYwNjQ3NA==&mid=2651296671&idx=1&sn=366de50a6787963517ff6e096c9d1643&scene=2&srcid=0601j5sEtcRyw9TtehhXW0Ix&from=timeline&isappinstalled=0#wechat_redirect)
- [如何实现高可用的redis集群](https://mp.weixin.qq.com/s?__biz=MzAwNTg2MDUyMw==&mid=2247483661&idx=1&sn=c924b3a2b098c4211b0044de180a1c0e)