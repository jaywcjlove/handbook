CentOS7安装使用svn
===


## 安装部署

### 安装SVN

```bash
yum install httpd subversion mod_dav_svn
rpm -ql subvserion # 查看 subversion 安装位置
```

OK 这样就完成了安装。下面是SVN的配置：


### 验证安装 

```bash
svnserve --version

# svnserve，版本 1.7.14 (r1542130)
#    编译于 Aug 23 2017，20:43:38
# 
# 版权所有 (C) 2013 Apache 软件基金会。
# 此软件包含了许多人的贡献，请查看文件 NOTICE 以获得更多信息。
# Subversion 是开放源代码软件，请参阅 http://subversion.apache.org/ 站点。
# 
# 下列版本库后端(FS) 模块可用:
# 
# * fs_base : 模块只能操作BDB版本库。
# * fs_fs : 模块与文本文件(FSFS)版本库一起工作。
# 
# Cyrus SASL 认证可用。
```

## 代码库创建 

SVN软件安装完成后还需要建立SVN库 

```bash
mkdir -p /opt/svn/repo
svnadmin create /opt/svn/repo
```

执行上面的命令后，自动建立`repo`库，查看`/opt/svn/repo` 文件夹发现包含了conf, db,format,hooks, locks, README.txt等文件，说明一个SVN库已经建立。


## 配置用户

在`/source/svn/【项目文件】/conf`目录下有三个文件：

- `passwd` ： 里面保存用户信息，基本格式为：user = passwd
- `authz` ： 里面保存用户的分组信息，以及每个组的访问权限
- `svnserve.conf` ： 里面保存服务器的基本配置（下面介绍）


### 添加用户

在 `passwd` 文件中添加用户。 

```bash
[users]
harry = harry123
sally = sally123
wcj = wcj123
```

### 配置用户权限

在 `authz` 文件中配置用户权限。 

```bash
[groups]
admin = harry,sally

# 该项目的权限配置
[/]
@admin=rw      # admin分组配置读写权限（实际中可以增加只读分组）

wcj=rw # wcj   # 用户的权限为读写
* = r          # 其他用户的权限为只读
```

### svnserve.conf配置

```bash
[general]
# 匿名用户权限（none：拒绝， write：读写， read：只读权限）
anon-access = none
auth-access = write

authz-db = authz

# 这个配置我给删除了，多数教程填写工程 /opt/svn/repo 目录
# 我测试没有什么卵用
# realm = My First Repository
```

## 启动svn

### 配置防火墙端口 

```bash
vi /etc/sysconfig/iptables
# 添加以下内容：
-A INPUT -m state --state NEW -m tcp -p tcp --dport 3690 -j ACCEPT
# 保存后重启防火墙
service iptables restart
```

### 启动SVN 

> 注意，创建的工程`repo` 启动指定目录为`/opt/svn` 而不是 ~`/opt/svn/repo`~
> 这里是非常深的坑哦。

```bash
svnserve -d -r /opt/svn
```

### 查看SVN进程 

```bash 
ps -ef|grep svn|grep -v grep
# root     24394     1  0 23:32 ?        00:00:00 svnserve -d -r /opt/svn
```

### 检测SVN 端口 

```bash
netstat -ln |grep 3690
tcp        0      0 0.0.0.0:3690            0.0.0.0:*               LISTEN
```

### 停止重启SVN 


```bash
killall svnserve # 停止
svnserve -d -r /opt/svn # 启动
```



### 配置用户权限

## 简单SVN命令


```bash
svn checkout path（path是服务器上的目录）
svn checkout svn://192.168.1.1/pro/domain
```
