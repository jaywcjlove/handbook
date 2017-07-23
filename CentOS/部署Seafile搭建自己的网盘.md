部署Seafile搭建自己的网盘
===

Seafile 是一个开源的文件云存储平台，解决文件集中存储、同步、多平台访问的问，允许用户创建“群组”，在群组内共享和同步文件，方便了团队协同工作。

<!-- TOC -->

- [安装依赖](#安装依赖)
- [下载](#下载)
- [安装](#安装)
  - [启动 Seafile](#启动-seafile)
  - [启动 Seahub](#启动-seahub)
- [服务管理](#服务管理)
- [参考资料](#参考资料)

<!-- /TOC -->

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
# 执行下面语句立即生效
mysql> flush privileges;
```

运行`./setup-seafile-mysql.sh`安装脚本并回答预设问题

```bash
./setup-seafile-mysql.sh
  Checking python on this machine ...
  Checking python module: setuptools ... Done.
  Checking python module: python-imaging ... Done.
  Checking python module: python-mysqldb ... Done.

-----------------------------------------------------------------
This script will guide you to setup your seafile server using MySQL.
Make sure you have read seafile server manual at

        https://github.com/haiwen/seafile/wiki

Press ENTER to continue
-----------------------------------------------------------------

What is the name of the server? It will be displayed on the client.
3 - 15 letters or digits
[ server name ] <填写 seafile 服务器的名字>

What is the ip or domain of the server?
For example: www.mycompany.com, 192.168.1.101
[ This server's ip or domain ] <seafile 服务器的 IP 地址或者域名>

Where do you want to put your seafile data?
Please use a volume with enough free space
[ default "/home/www/jinpans/seafile-data" ]

Which port do you want to use for the seafile fileserver?
[ default "8082" ]  [ seafile fileserver 使用的 TCP 端口 ]

-------------------------------------------------------
Please choose a way to initialize seafile databases:
-------------------------------------------------------

[1] Create new ccnet/seafile/seahub databases
    你需要提供根密码. 脚本程序会创建数据库和用户。
[2] Use existing ccnet/seafile/seahub databases
    ccnet/seafile/seahub 数据库应该已经被你（或者其他人）提前创建。
[ 1 or 2 ] <选择一种创建 Seafile 数据库的方式>

What is the host of mysql server?
[ default "localhost" ]

What is the port of mysql server?
[ default "3306" ]

What is the password of the mysql root user?
[ root password ] <输入root密码>

verifying password of user root ...  done

Enter the name for mysql user of seafile. It would be created if not exists.
[ default "seafile" ] <默认seafile的MySQL用户名，可以使用默认>

Enter the password for mysql user "seafile":
[ password for seafile ] <输入seafile密码>

verifying password of user seafile ...  done

Enter the database name for ccnet-server:
[ default "ccnet-db" ]

Enter the database name for seafile-server:
[ default "seafile-db" ]

Enter the database name for seahub:
[ default "seahub-db" ]

---------------------------------
This is your configuration
---------------------------------

    server name:            seafile 服务器的名字
    server ip/domain:       192.168.1.101

    seafile data dir:       /home/www/jinpans/seafile-data
    fileserver port:        8082

    database:               create new
    ccnet database:         ccnet-db
    seafile database:       seafile-db
    seahub database:        seahub-db
    database user:          seafile

---------------------------------
Press ENTER to continue, or Ctrl-C to abort
---------------------------------

Generating ccnet configuration ...

done
Successly create configuration dir /home/www/jinpans/ccnet.
Generating seafile configuration ...

Done.
done
Generating seahub configuration ...

----------------------------------------
Now creating seahub database tables ...

----------------------------------------

creating seafile-server-latest symbolic link ...  done

-----------------------------------------------------------------
Your seafile server configuration has been finished successfully.
-----------------------------------------------------------------

run seafile server:     ./seafile.sh { start | stop | restart }
run seahub  server:     ./seahub.sh  { start <port> | stop | restart <port> }

-----------------------------------------------------------------
If you are behind a firewall, remember to allow input/output of these tcp ports:
-----------------------------------------------------------------

port of seafile fileserver:   8082
port of seahub:               8000

When problems occur, Refer to

        https://github.com/haiwen/seafile/wiki

```

上面算是结束了，然后在 seafile-server_6.0.7 目录下面，运行如下命令

### 启动 Seafile

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
- [Seafile for Github](https://github.com/haiwen/seafile)
- [Seafile官网](http://seafile.com/)