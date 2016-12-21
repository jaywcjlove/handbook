部署Seafile搭建自己的网盘
===

Seafile 是一个开源的文件云存储平台，解决文件集中存储、同步、多平台访问的问，允许用户创建“群组”，在群组内共享和同步文件，方便了团队协同工作。

## 安装依赖


```bash
# 在 CentOS 7 下
# (MariaDB 是 MySQL 的分支)
yum install mariadb-server

# 如果以来有问题 
# 尝试在后面加上参数  --skip-broken
yum install python-setuptools python-imaging python-ldap MySQL-python python-memcached python-urllib3
```

yum 安装 mysqldb-python 后面seafile安装报错，需要通过 python 的工具pip来安装MySQL-python `pip install MySQL-python`

## 下载

在这里下载[seafile-server_6.0.7_x86-64.tar.gz](https://www.seafile.com/download/)，你可以选择你需要的版本

```bash
# 查看系统版本
cat /proc/version
wget http://download-cn.seafile.com/seafile-server_6.0.7_x86-64.tar.gz

# 解压
tar -zxvf seafile-server_6.0.7_x86-64.tar.gz

# 解压放到一个目录
cd seafile-server-*
```

## 安装 

我的数据库使用MySQL，你需要先在数据库中建立一个 MySQL 用户 `seafile`。

```bash
# 登录MySQL创建一个用户
mysql -uroot -p

# 创建用户设置密码
mysql> Create USER 'seafile'@'%' IDENTIFIED BY '123456';
```

在 seafile-server_6.0.7 目录下面，运行如下命令

### 启动 Seafile:

```bash
./seafile.sh start # 启动 Seafile 服务
```

### 启动 Seahub

```bash
./seahub.sh start <port>  # 启动 Seahub 网站 （默认运行在8000端口上）
# 你第一次启动 seahub 时，seahub.sh 脚本会提示你创建一个 seafile 管理员帐号。

LC_ALL is not set in ENV, set to en_US.UTF-8
Starting seahub at port 8000 ...

----------------------------------------
It's the first time you start the seafile server. Now let's create the admin account
----------------------------------------

What is the email for the admin account?
[ admin email ] <这里输入邮箱地址>

What is the password for the admin account?
[ admin password ] <这里输入密码>

Enter the password again:
[ admin password again ] <这里确认输入密码>
----------------------------------------
Successfully created seafile admin
----------------------------------------
Seahub is started
Done.
```

然后你可以打开它了：

```bash
http://192.168.1.111:8000/
```

## 服务管理

```bash
./seahub.sh stop       # 停止 Seafile 进程
./seafile.sh stop      # 停止 Seahub

./seafile.sh start     # 启动 Seafile 服务
./seahub.sh start 8001 # 启动 Seahub 网站 （运行在8001端口上）

./seafile.sh restart   # 停止当前的 Seafile 进程，然后重启 Seafile
./seahub.sh restart    # 停止当前的 Seahub 进程，并在 8000 端口重新启动 Seahub
```

## 参考资料

- [Seafile服务器手册中文版](https://www.gitbook.com/book/freeplant/seafile-manual-cn/details)
- [Seafile](https://github.com/haiwen/seafile)
- [Seafile官网](http://seafile.com/)