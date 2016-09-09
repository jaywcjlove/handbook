
## Redis常用命令

```bash
# 命令行客户端启动
$ redis-cli start
# 启动
$ service redis start
# 停止
$ service redis stop

# 命令行客户端启动
$ redis-cli

#指定端口启动
$ redis-server --port 6380 &

# 查看 Redis 版本
$ redis-cli info | grep redis_version

# 查看端口号
$ redis-cli info | grep tcp_port

# 设置配置开启通知功能
$ redis-cli config set notify-keyspace-events KEA

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