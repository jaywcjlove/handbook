# 当前链接的客户端数和连接数

`redis-cli --stat`查看当前连接的客户端数，连接数等

```bash
------- data ------ --------------------- load -------------------- - child -
keys       mem      clients blocked requests            connections
4          1.27M    6       0       17340 (+0)          111
4          1.27M    6       0       17341 (+1)          111
4          1.27M    6       0       17342 (+1)          111
4          1.27M    6       0       17343 (+1)          111
```

# 内存最大的键值和平均的键值数据

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

# 查看当前的键值情况

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
# 原生的Monitor监控

redis-cli monitor打印出所有sever接收到的命令以及其对应的客户端地址

```
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