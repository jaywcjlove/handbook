
CentOS7安装配置vsftp搭建FTP
===

安装配置vsftpd做FTP服务，我们的项目应用使用git管理进行迭代，公共文件软件存储使用开源网盘Seafile来管理，基本够用。想不到FTP的使用的场景，感觉它好像老去了，虽然现在基本没有用到这个工具，刚好公司公司刷一个硬件需要使用FTP来配置下载文件，于是研究使用了一下，记录了一下使用过程。😀

## 目录

- [安装](#安装)
- [查看位置](#查看位置)
- [启动vsftpd服务](#启动vsftpd服务)
- [关闭firewall和SELinux](#关闭firewall和selinux)
- [修改配置文件](#修改配置文件)
- [匿名登录](#匿名登录)
- [多用户配置](#多用户配置)
  - [创建宿主用户](#创建宿主用户)
  - [建立虚拟用户文件](#建立虚拟用户文件)
  - [生成虚拟用户数据文件](#生成虚拟用户数据文件)
  - [创建用户配置](#创建用户配置)
  - [创建用户目录](#创建用户目录)
  - [最后重启vsftpd服务器](#最后重启vsftpd服务器)
- [服务运维](#服务运维)
- [FTP命令](#ftp命令)
  - [关闭FTP连接](#关闭ftp连接)
  - [下载文件](#下载文件)
  - [上传文件](#上传文件)
- [状态码](#状态码)
- [参考资料](#参考资料)

## 安装

在安装前查看是否已安装vsftpd

```shell
# 查看是否已安装 方法一
[root@localhost ~]# rpm -q vsftpd
vsftpd-3.0.2-21.el7.x86_64

# 查看是否已安装 方法二
[root@localhost ~]# vsftpd -v
vsftpd: version 3.0.2

# 安装 vsftpd
[root@localhost ~]# yum -y install vsftpd
```

## 查看位置

```shell
[root@localhost ~]# whereis vsftpd
vsftpd: /usr/sbin/vsftpd /etc/vsftpd /usr/share/man/man8/vsftpd.8.gz
```

## 启动vsftpd服务

```shell
systemctl start vsftpd.service
```

## 关闭firewall和SELinux

```shell
setenforce 0   # 设置SELinux 成为permissive模式  （关闭SELinux）
setenforce 1   # 设置SELinux 成为enforcing模式   （开启SELinux）

# 或者修改配置
vi /etc/selinux/config
# SELINUX=enforcing
# 注释掉
# SELINUXTYPE=targeted
# 注释掉
SELINUX=disabled
# 增加
:wq! #保存退出
setenforce 0
```

或者设置SELinux

```shell

getsebool -a | grep ftp
setsebool -P ftpd_full_access on
```

```shell
systemctl stop firewalld.service
#停止firewall
systemctl disable firewalld.service
#禁止firewall开机启动
```

如果你不愿意关闭防火墙，需要防火墙添加FTP服务。

```shell
firewall-cmd --permanent --zone=public --add-service=ftp
firewall-cmd --reload
```

## 修改配置文件

配置文件`/etc/vsftpd/vsftpd.conf`

```shell
anonymous_enable=NO        # 不允许匿名访问，禁用匿名登录
chroot_local_user=YES      # 启用限定用户在其主目录下
use_localtime=YES          # 使用本地时(自行添加)
chroot_list_enable=YES
local_enable=YES           # 允许使用本地帐户进行FTP用户登录验证
allow_writeable_chroot=YES # 如果启用了限定用户在其主目录下需要添加这个配置，解决报错 500 OOPS: vsftpd: refusing to run with writable root inside chroot()
xferlog_enable=YES         # 启用上传和下载的日志功能，默认开启。
local_umask=022            # 设置本地用户默认文件掩码022
# FTP上本地的文件权限，默认是077，不过vsftpd安装后的配置文件里默认是022
```

虚拟用户高级参数

```
当virtual_use_local_privs=YES 时，虚拟用户和本地用户有相同的权限；
当virtual_use_local_privs=NO  时，虚拟用户和匿名用户有相同的权限，默认是NO。
当virtual_use_local_privs=YES，write_enable=YES时，虚拟用户具有写权限（上传、下载、删除、重命名）。
当virtual_use_local_privs=NO，write_enable=YES，anon_world_readable_only=YES，
anon_upload_enable=YES时，虚拟用户不能浏览目录，只能上传文件，无其他权限。
当virtual_use_local_privs=NO，write_enable=YES，anon_world_readable_only=NO，
anon_upload_enable=NO时，虚拟用户只能下载文件，无其他权限。
当virtual_use_local_privs=NO，write_enable=YES，anon_world_readable_only=NO，
anon_upload_enable=YES时，虚拟用户只能上传和下载文件，无其他权限。
当virtual_use_local_privs=NO，write_enable=YES，anon_world_readable_only=NO，
anon_mkdir_write_enable=YES时，虚拟用户只能下载文件和创建文件夹，无其他权限。
当virtual_use_local_privs=NO，write_enable=YES，anon_world_readable_only=NO，
anon_other_write_enable=YES时，虚拟用户只能下载、删除和重命名文件，无其他权限。
```


## 匿名登录

安装完默认情况下是开启匿名登录的，对应的是 `/var/ftp` 目录，这时只要服务启动了，就可以直接连上FTP了。默认用户名是`ftp`，密码是空的。如果你在配置里面配置了`anonymous_enable=NO`，匿名就无法登录。

```shell
$ ftp 192.168.188.114

Connected to 192.168.188.114.
220 (vsFTPd 3.0.2)
Name (192.168.188.114:kennywang): ftp
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
229 Entering Extended Passive Mode (|||47867|).
150 Here comes the directory listing.
-rw-r--r--    1 0        0              12 Jan 18 06:31 README.md
drwxr-xr-x    2 0        0               6 Nov 05 19:43 pub
226 Directory send OK.
```

## 多用户配置

多用户配置需要自己手工添加配置，下面内容到vsftpd.conf末尾

```shell
# 
# 

use_localtime=YES          # 使用本地时(自行添加)
listen_port=21
chroot_local_user=YES      # 启用限定用户在其主目录下
idle_session_timeout=300

data_connection_timeout=120  # 数据连接超时时间
guest_enable=YES             # 设定启用虚拟用户功能
guest_username=ftpuser       # 指定虚拟用户的宿主用户 ftpuser（就是我们后面会新建这个用户）
# guest_username=www
# 如果ftp目录是指向网站根目录，用来上传网站程序，
# 可以指定虚拟用户的宿主用户为nginx运行账户www，可以避免很多权限设置问题 


user_config_dir=/etc/vsftpd/vuser_conf   # 虚拟用户配置文件目录
virtual_use_local_privs=YES # NO时，虚拟用户和匿名用户有相同的权限，默认是NO

pasv_min_port=10060         # 被动模式最小端口号10060
pasv_max_port=10090         # 被动模式最大端口号10090

accept_timeout=5
connect_timeout=1
```

### 创建宿主用户

新建系统用户ftpuser，用户目录为`/home/vsftpd`, 用户登录终端设为/bin/false(即使之不能登录系统)

```shell 
# 方法一
# 创建用户 ftpuser 指定 `/home/vsftpd` 目录
useradd -g root -M -d /home/vsftpd -s /sbin/nologin ftpuser

# 设置用户 ftpuser 的密码
passwd ftpuser
# 把 /home/vsftpd 的所有权给ftpuser.root
chown -R ftpuser.root /home/vsftpd

# 方法二
useradd ftpuser -d /home/vsftpd -s /bin/false
chown ftpuser:ftpuser /home/vsftpd -R 

# 如果虚拟用户的宿主用户为www，需要这样设置
# www目录是你应用的目录
chown www:www /home/www -R
```

删除用户 `userdel ftpuser`

### 建立虚拟用户文件

```shell
touch /etc/vsftpd/vuser_passwd
# 编辑虚拟用户名单文件：（
# 第一行账号，第二行密码，注意：不能使用root做用户名，系统保留）
vi /etc/vsftpd/vuser_passwd 
# 编辑内容，下面是 vuser_passwd 内容
wcj
123456
hss
123456
#保存退出
```

### 生成虚拟用户数据文件

```shell
db_load -T -t hash -f /etc/vsftpd/vuser_passwd /etc/vsftpd/vuser_passwd.db
chmod 600 /etc/vsftpd/vuser_passwd.db
```

### 创建用户配置

```shell
mkdir /etc/vsftpd/vuser_conf  # 建立虚拟用户个人vsftp的配置文件
cd /etc/vsftpd/vuser_conf     # 进入目录
touch hss wcj                 # 这里创建两个虚拟用户配置文件
```

每一个文件配置文件都差不多，只是参数`local_root`不一样。

```shell
local_root=/home/vsftpd/hss   # 用户 hss 配置目录，这个地方不一样
write_enable=YES              # 允许本地用户对FTP服务器文件具有写权限
anon_world_readable_only=NO
anon_upload_enable=YES        # 允许匿名用户上传文件(须将全局的write_enable=YES,默认YES)
anon_mkdir_write_enable=YES   # 允许匿名用户创建目录
anon_other_write_enable=YES   # 允许匿名用户删除和重命名权限(自行添加)
```

### 创建用户目录

每个用户目录文件夹是有root用户创建的，也就是上面`local_root`配置目录，其权限应设置为755。因为权限的问题在该文件夹内无法直接上传文件。而如果设置为777则无法访问，这是由于vsftpd的安全性设置。解决上传问题的方法是在local_root文件夹内新建一个upload的文件夹，权限设置为777，可将文件上传到该文件夹。

```shell
mkdir -p /home/vsftpd/hss     # 每个用户对于一个目录，创建两个目录“hss”、“wcj”

# 下面是目录结构
/home/vsftpd
      ├── hss
      │   ├── filename.md
      │   └── upload
      └── wcj
          └── filename.md


# 赋予其权限
chmod -R 777 /var/vsftpd/hss/upload/

# 在/var/ftp下新建一个目录来实现匿名用户上传
mkdir /var/ftp/upload
```

vsftpd中几种用户的区分：

**本地用户**：用户在FTP服务器拥有账号，且该账号为本地用户的账号，可以通过自己的账号和口令进行授权登录，登录目录为自己的home目录`$HOME`  
**虚拟用户**：用户在FTP服务器上拥有账号，但该账号只能用于文件传输服务。登录目录为某一特定的目录，通常可以上传和下载  
**匿名用户**：用户在FTP服务器上没有账号，登录目录为/var/ftp  

### 最后重启vsftpd服务器

```shell
systemctl restart vsftpd.service
```

## 服务运维

```shell
systemctl restart vsftpd.service  # 重启服务
systemctl start vsftpd.service    # 启动服务
systemctl status vsftpd.service   # 服务状态查看
```

## FTP命令

```shell
ftp> ascii  # 设定以ASCII方式传送文件(缺省值) 
ftp> bell   # 每完成一次文件传送,报警提示. 
ftp> binary # 设定以二进制方式传送文件. 
ftp> bye    # 终止主机FTP进程,并退出FTP管理方式. 
ftp> case # 当为ON时,用MGET命令拷贝的文件名到本地机器中,全部转换为小写字母. 
ftp> cd     # 同UNIX的CD命令. 
ftp> cdup   # 返回上一级目录. 
ftp> chmod  # 改变远端主机的文件权限. 
ftp> close  # 终止远端的FTP进程,返回到FTP命令状态, 所有的宏定义都被删除. 
ftp> delete # 删除远端主机中的文件. 
ftp> dir [remote-directory] [local-file] # 列出当前远端主机目录中的文件.如果有本地文件,就将结果写至本地文件. 
ftp> get [remote-file] [local-file] # 从远端主机中传送至本地主机中. 
ftp> help [command] # 输出命令的解释. 
ftp> lcd # 改变当前本地主机的工作目录,如果缺省,就转到当前用户的HOME目录. 
ftp> ls [remote-directory] [local-file] # 同DIR. 
ftp> macdef                 # 定义宏命令. 
ftp> mdelete [remote-files] # 删除一批文件. 
ftp> mget [remote-files]    # 从远端主机接收一批文件至本地主机. 
ftp> mkdir directory-name   # 在远端主机中建立目录. 
ftp> mput local-files # 将本地主机中一批文件传送至远端主机. 
ftp> open host [port] # 重新建立一个新的连接. 
ftp> prompt           # 交互提示模式. 
ftp> put local-file [remote-file] # 将本地一个文件传送至远端主机中. 
ftp> pwd  # 列出当前远端主机目录. 
ftp> quit # 同BYE. 
ftp> recv remote-file [local-file] # 同GET. 
ftp> rename [from] [to]     # 改变远端主机中的文件名. 
ftp> rmdir directory-name   # 删除远端主机中的目录. 
ftp> send local-file [remote-file] # 同PUT. 
ftp> status   # 显示当前FTP的状态. 
ftp> system   # 显示远端主机系统类型. 
ftp> user user-name [password] [account] # 重新以别的用户名登录远端主机. 
ftp> ? [command] # 同HELP. [command]指定需要帮助的命令名称。如果没有指定 command，ftp 将显示全部命令的列表。
ftp> ! # 从 ftp 子系统退出到外壳。 
```

### 关闭FTP连接

```shel
bye
exit
quit
```

### 下载文件

```shell
ftp> get readme.txt # 下载 readme.txt 文件
ftp> mget *.txt     # 下载 
```

### 上传文件

```shell
ftp> put /path/readme.txt # 上传 readme.txt 文件
ftp> mput *.txt           # 可以上传多个文件
```

## 状态码

- 230 - 登录成功
- 200 - 命令执行成功
- 150 - 文件状态正常，开启数据连接端口
- 250 - 目录切换操作完成
- 226 - 关闭数据连接端口，请求的文件操作成功

## 参考资料

- [Vsftpd虚拟用户的配置](http://hx100.blog.51cto.com/44326/383143/)
- [CentOS7安装和配置FTP](http://www.cnblogs.com/flandre/p/6051532.html)