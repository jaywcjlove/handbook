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

```
sudo service redis start
sudo chkconfig redis on
```


Finally, check the version of currently installed Redis:

```
redis-cli info | grep redis_version
```