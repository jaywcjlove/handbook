# 安装 mysql

> Centos 6.5 
> 

直接使用 yum 命令去安装  mysql ：

```bash
yum install mysql-server

# 查看当前 mysql 版本
rpm -qa | grep mysql
```

安装完成后，使用 service 命令启动 mysql 服务：

```bash
service mysqld start
```

然后我们需要简单配置一下 mysql ，默认安装以后 mysql 的 root 用户是没有密码的，对于生产环境来说，这肯定是不行的，另外还有一些安全相关的设置，可以使用下面这行命令去配置一下，它是一个向导，问你一些问题，你要给出答案，比如是否要设置 root 用户的密码， 密码是什么等等。

```bash
mysql_secure_installation
```


- Enter current password for root (enter for none):
  - 解释：输入当前 root 用户密码，默认为空，直接回车。
- Set root password? [Y/n]  y
  - 解释：要设置 root 密码吗？输入 y 表示愿意。
- Remove anonymous users? [Y/n]  y
  - 解释：要移除掉匿名用户吗？输入 y 表示愿意。
- Disallow root login remotely? [Y/n]  y
  - 解释：不想让 root 远程登陆吗？输入 y 表示愿意。
- Remove test database and access to it? [Y/n]  y
  - 解释：要去掉 test 数据库吗？输入 y 表示愿意。
- Reload privilege tables now? [Y/n]  y
  - 解释：想要重新加载权限吗？输入 y 表示愿意。


# 服务的启动和停止

```bash
net stop mysql
net start mysql
```


# MySQL数据库升级

```bash
wget http://dev.mysql.com/get/mysql57-community-release-el6-8.noarch.rpm
yum localinstall mysql57-community-release-el6-8.noarch.rpm
yum install mysql-server
mysqld --initialize --user=mysql
# 找到密码 vi /var/log/mysqld.log
# 修改密码 mysqladmin -uroot -p password
# 采用拷贝粘贴，输入旧密码，设定新密码
chkconfig mysqld on
# 重启
reboot
```

# 登录

```
mysql -u用户名 -p用户密码
```

# 新建用户

```sql
-- 新建book用户，密码为book，允许book可以远程访问abc数据库，授权book对abc进行所有数据库
GRANT ALL ON abc.* to book@'%' IDENTIFIED BY 'book';
-- 允许book可以本地访问abc数据库，授权book对abc进行所有数据库操作
GRANT ALL ON abc.* to book@localhost IDENTIFIED BY 'book';
```

# 操作数据库

登录到mysql中，然后在mysql的提示符下运行下列命令，每个命令以分号结束。

1. 显示数据库列表。

```
show databases;
```

缺省有两个数据库：mysql和test。 mysql库存放着mysql的系统和用户权限信息，我们改密码和新增用户，实际上就是对这个库进行操作。

2. 显示库中的数据表：

```
use mysql;
show tables;
```

3. 显示数据表的结构：

```
describe 表名;
```

4. 建库与删库：

```
create database 库名;
drop database 库名;
```

5. 建表：

```
use 库名;
create table 表名(字段列表);
drop table 表名;
```

6. 清空表中记录：

```
delete from 表名;
```

7. 显示表中的记录：

```
select * from 表名;
```
 

# 导出和导入数据

## 导出数据：

```bash
mysqldump --opt test > mysql.test
```

即将数据库test数据库导出到`mysql.test`文件，后者是一个文本文件

```bash
mysqldump -u root -p123456 --databases dbname > mysql.dbname
```

就是把数据库dbname导出到文件`mysql.dbname`中。

## 导入数据:

```bash
mysqlimport -u root -p123456 < mysql.dbname。
```

登录数据库，在数据库中导入数据

```bash
source ~/sql/database.sql
```


## 将文本数据导入数据库:

文本数据的字段数据之间用tab键隔开。

```bash
use test;
load data local infile "文件名" into table 表名;
```

1:使用SHOW语句找出在服务器上当前存在什么数据库：

```bash
mysql> SHOW DATABASES;
```

2:创建一个数据库MYSQLDATA

```bash
mysql> CREATE DATABASE MYSQLDATA;
```

3:选择你所创建的数据库

```bash
mysql> USE MYSQLDATA; (按回车键出现Database changed 时说明操作成功!)
```

4:查看现在的数据库中存在什么表

```bash
mysql> SHOW TABLES;
```

5:创建一个数据库表

```bash
  mysql> CREATE TABLE MYTABLE (name VARCHAR(20), sex CHAR(1));
```

6:显示表的结构：

```bash
mysql> DESCRIBE MYTABLE;
```

7:往表中加入记录

```bash
mysql> insert into MYTABLE values ("hyq","M");
```

8:用文本方式将数据装入数据库表中(例如`D:/mysql.txt`)

```bash
mysql> LOAD DATA LOCAL INFILE "D:/mysql.txt" INTO TABLE MYTABLE;
```

9:导入.sql文件命令(例如D:/mysql.sql)

```bash
mysql> use database;
mysql> source d:/mysql.sql;
```

10:删除表

```bash
mysql>drop TABLE MYTABLE;
```

11:清空表

```bash
mysql> delete from MYTABLE;
```

12:更新表中数据

```bash
mysql> update MYTABLE set sex="f" where name='hyq';
```

13：备份数据库

```bash
mysqldump -u root 库名>xxx.data
```

14：例2：连接到远程主机上的MYSQL

假设远程主机的IP为：110.110.110.110，用户名为root,密码为abcd123。则键入以下命令：

```bash
mysql -h110.110.110.110 -uroot -pabcd123                       // 远程登录
```

(注:u与root可以不用加空格，其它也一样)


15: 显示当前用户

```bash
SELECT USER();
```

3、退出MYSQL命令： `exit (回车)`

```bash
mysql > exit;
mysql > quit;
mysql > \q;
```

# 更改MySQL目录

下面我整理一下把`MySQL`从`/var/lib/mysql`目录下面转移到`/home/mysql_data/mysql`目录的具体操作： 


1、首先我们需要关闭MySQL，命令如下： 

```bash
service mysqld stop 
```

2、然后是转移数据，为了安全期间，我们采用复制命令cp，先找到mysql的原目录 

```bash
cd /var/lib 
ls 
```

运行这个命令之后就会看到mysql的目录了，然后执行cp命令 

```bash
cp -a mysql /mnt/web/data/ #这样就把数据库复制到/mnt/web/data/mysql/下面去了 
```

注意：（-a这个参数一定要带着，否则复制过去的权限就不对了。） 


如果数据库比较大的话，时间会比较长，可能会超时，具体怎么设置ssh不超时的办法，请大家自己找相关资料。 

3、然后我们修改配置文件，一共有三个，下面我一一说明： 

修改第一个文件：修改之前先备份`cp /etc/my.cnf /etc/my.cnf.back `

```bash
vi /etc/my.cnf 
```

打开之后修改datadir的目录为/mnt/web/data/mysql 
把socket改成/mnt/web/data/mysql/mysql.sock #为了安全起见，你可以把原来的注释掉，然后重新加入一行，改成现在的目录。 

```bash
================================================================================== 
修改第二个文件：修改之前先备份 cp /etc/init.d/mysqld /etc/init.d/mysqld.back 
vi /etc/init.d/mysqld 
注意：准确的位置是/etc/rc.d/init.d/mysqld，由于这里这里有一个/etc/init.d到/etc/rc.d/init.d的映射， 
所以用上面的命令即可，也简单。 
把其中get_mysql_option mysqld datadir "/var/lib/mysql"一行中，等号右边的路径改成你现在的实际存放路径：/mnt/web/data/mysql
================================================================================= 
```

修改第三个文件：修改之前先备份 `cp /usr/bin/mysqld_safe /usr/bin/mysqld_safebak`

```bash
vi /usr/bin/mysqld_safe 
```

这里也是修改 `DATADIR=/var/lib/mysql` 的目录为`/mnt/web/data/mysql`


4、下面需要建立一个mysql.sock的链接： 

```
ln -s /mnt/web/data/mysql/mysql.sock /var/lib/mysql/mysql.sock 
```

至此所有的修改都完成了，下面启动mysql 

```
service mysqld start 
```

或者重启linux 

```
reboot 
```

如果能正常启动，说明修改成功。


# 查看当前 mysql 版本

```
rpm -qa | grep mysql
```

# 卸载旧版MySQL

```bash
yum remove mysql mysql-*
```


# 卸载MySQL

```bash
yum remove mysql mysql-server mysql-libs compat-mysql51
```

# 重启

1. 启动：`sudo /usr/local/mysql/support-files/mysql.server start `
2. 停止：`sudo /usr/local/mysql/support-files/mysql.server stop `
3. 重启：`sudo /usr/local/mysql/support-files/mysql.server restart`
