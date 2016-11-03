1. First, make sure the following repos, EPEL and REMI, are installed:

```
sudo rpm -Uvh http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
sudo rpm -Uvh http://rpms.remirepo.net/enterprise/remi-release-6.rpm
```

2. Check the version of Redis in REMI repo: (As of June 2015, the version is 2.8.13)

```
yum --enablerepo=remi info redis
```

3. Then install related dependency (jemalloc) from EPEL repo:

```
sudo yum --enablerepo=epel install jemalloc
```

4. Before installation, you should stop the old Redis daemon:


```
sudo service redis stop
```

5. Then install the newer version of Redis:

```
sudo yum --enablerepo=remi install redis

```

6. Edit Redis configuration file if needed:

```
sudo vi /etc/redis.conf
```

Restart Redis daemon, and make it auto-start on reboot:

```bash
sudo service redis start
sudo chkconfig redis on
```


Finally, check the version of currently installed Redis:

```
redis-cli info | grep redis_version
```

## Redis 启动警告错误解决

1. WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.

```shell
echo "vm.overcommit_memory=1" > /etc/sysctl.conf  # 或 vi /etcsysctl.conf , 然后reboot重启机器
echo 1 > /proc/sys/vm/overcommit_memory  # 不需要启机器就生效
```

2. WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.

```shell
echo 511 > /proc/sys/net/core/somaxconn
```

## 参考文档

- [Redis 启动警告错误解决](http://skly-java.iteye.com/blog/2167400)