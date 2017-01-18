Centos7更换yum源
===

```bash
yum -y install wget
```

先备份`/etc/yum.repos.d/CentOS-Base.repo` (改名)

```bash
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.back
```

切换到目录/etc/yum.repos.d下载repo文件, (http://mirrors.163.com/.help/centos.html)

```bash
wget http://mirrors.163.com/.help/CentOS6-Base-163.repo  # (在哪个目录执行wget 就下载在哪里 )

# 改名
mv /etc/yum.repos.d/CentOS6-Base-163.repo /etc/yum.repos.d/CentOS-Base.repo
```

生成缓存

```bash
yum clean all
yum makecache
```

# 官方说明：

http://mirrors.163.com/  
http://mirrors.163.com/.help/centos.html  
