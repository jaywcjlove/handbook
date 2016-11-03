# 服务器状态

检查Redis服务器系统进程

```
ps -aux|grep redis
```

使用 netstat 来查看端口占用情况，6379为默认Redis端口。

```bash
netstat -nlt|grep 6379
```

- -t：指明显示 TCP 端口
- -u：指明显示 UDP 端口
- -l：仅显示监听套接字
- -p：显示进程标识符和程序名称，每一个套接字/端口都属于一个程序。
- -n：不进行 DNS 轮询，显示 IP （可以加速操作）

# 修改防火墙配置

修改防火墙配置 sudo vi /etc/sysconfig/iptables

```
-A INPUT -m state --state NEW -m tcp -p tcp --dport 6379 -j ACCEPT
```

# 修改配置文件

Redis protected-mode 是3.2 之后加入的新特性，在Redis.conf的注释中，我们可以了解到，他的具体作用和启用条件。可以在 sudo vi /etc/redis.conf 中编辑，修改配置文件。

```
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

