

# 管理用户（user）


| 命令 | 说明 |
| ---- | ---- |
| useradd wcj | 注：添加用户 wcj |
| useradd -g test wcj  | 注：新建wcj用户并增加到test工作组 |
| adduser   | 注：添加用户 |
| passwd wcj | 注：给wcj用户设置密码 |
| passwd peter –l | 注：关闭用户账号|
| passwd peter –u | 注：关闭用户账号|
| userdel peter | 注：永久性删除用户账号 |
| groupdel peter | 注：永久性删除用户账号组 |
| usermod –G peter peter | 注：强制删除该用户的主目录和主目录下的所有文件和子目录 |
| usermod   | 注：修改用户命令，可以通过usermod 来修改登录名、用户的家目录等等； |
| usermod -G groupname username | 注：给已有的用户增加工作组 |
| gpasswd -a user group | 注：给已有的用户增加工作组 |
| pwcov     | 注：同步用户从/etc/passwd 到/etc/shadow  |
| pwck      | 注：pwck是校验用户配置文件/etc/passwd 和/etc/shadow 文件内容是否合法或完整； |
| pwunconv  | 注：是pwcov 的立逆向操作，是从/etc/shadow和 /etc/passwd 创建/etc/passwd ，然后会删除 /etc/shadow 文件； |
| finger    | 注：查看用户信息工具 |
| id        | 注：查看用户的UID、GID及所归属的用户组 |
| chfn      | 注：更改用户信息工具 |
| su        | 注：用户切换工具 |
| sudo      |   注：sudo 是通过另一个用户来执行命令（execute a command as another user），su 是用来切换用户，然后通过切换到的用户来完成相应的任务，但sudo 能后面直接执行命令，比如sudo 不需要root 密码就可以执行root 赋与的执行只有root才能执行相应的命令；但得通过visudo 来编辑/etc/sudoers来实现； |
| visudo   |   注：visodo 是编辑 /etc/sudoers 的命令；也可以不用这个命令，直接用vi 来编辑 /etc/sudoers 的效果是一样的；|
| sudoedit | 注：和sudo 功能差不多；|
| id user | 注：显示用户信息|


# 管理用户组（group）

| 命令 | 说明 |
| ---- | ---- |
| groupadd  |  注：添加用户组；|
| groupdel  |  注：删除用户组；|
| groupmod  |  注：修改用户组信息 |
| groups    | 注：显示用户所属的用户组 |
| grpck | - |
| grpconv | 注：通过/etc/group和/etc/gshadow 的文件内容来同步或创建/etc/gshadow ，如果/etc/gshadow 不存在则创建；|
| grpunconv | 注：通过/etc/group 和/etc/gshadow 文件内容来同步或创建/etc/group ，然后删除gshadow文件；|
| usermod -G groupname username | 给已有的用户增加工作组 |
| gpasswd -a user group | 给已有的用户增加工作组 |
| gpasswd -d A GROUP | 从组中删除用户 |


# /etc/skel 目录

/etc/skel目录一般是存放用户启动文件的目录，这个目录是由root权限控制，当我们添加用户时，这个目录下的文件自动复制到新添加的用户的家目录下；/etc/skel 目录下的文件都是隐藏文件，也就是类似.file格式的；我们可通过修改、添加、删除/etc/skel目录下的文件，来为用户提供一个统一、标准的、默认的用户环境；

```
[root@localhost beinan]# ls -la /etc/skel/
总用量 92
drwxr-xr-x    3 root root  4096  8月 11 23:32 .
drwxr-xr-x  115 root root 12288 10月 14 13:44 ..
-rw-r--r--    1 root root    24  5月 11 00:15 .bash_logout
-rw-r--r--    1 root root   191  5月 11 00:15 .bash_profile
-rw-r--r--    1 root root   124  5月 11 00:15 .bashrc
-rw-r--r--    1 root root  5619 2005-03-08  .canna
-rw-r--r--    1 root root   438  5月 18 15:23 .emacs
-rw-r--r--    1 root root   120  5月 23 05:18 .gtkrc
drwxr-xr-x    3 root root  4096  8月 11 23:16 .kde
-rw-r--r--    1 root root   658 2005-01-17  .zshrc
```

/etc/default/useradd 文件；

通过useradd 添加用户时的规则文件；

# useradd defaults file

```
GROUP=100
HOME=/home  注：把用户的家目录建在/home中；
INACTIVE=-1  注：是否启用帐号过期停权，-1表示不启用；
EXPIRE=   注：帐号终止日期，不设置表示不启用；
SHELL=/bin/bash  注：所用SHELL的类型；
SKEL=/etc/skel   注： 默认添加用户的目录默认文件存放位置；也就是说，当我们用adduser添加用户时，用户家目录下的文件，都是从这个目录中复制过去的；
```