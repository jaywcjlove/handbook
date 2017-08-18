CentOS7安装维护Gitlab
---

目录
===

<!-- TOC -->

- [官方安装](#官方安装)
- [第三方镜像安装](#第三方镜像安装)
  - [编辑源](#编辑源)
  - [更新本地YUM缓存](#更新本地yum缓存)
  - [安装社区版](#安装社区版)
  - [更改配置](#更改配置)
  - [配置并启动GitLab](#配置并启动gitlab)
  - [登录GitLab](#登录gitlab)
- [卸载](#卸载)
- [运维](#运维)
  - [服务管理](#服务管理)
  - [日志查看](#日志查看)
  - [重置管理员密码](#重置管理员密码)
- [备份恢复](#备份恢复)
  - [修改备份文件默认目录](#修改备份文件默认目录)
  - [创建备份](#创建备份)
  - [开始备份](#开始备份)
  - [自动备份](#自动备份)
  - [备份保留七天](#备份保留七天)
  - [开始恢复](#开始恢复)
- [暴力升级](#暴力升级)
- [错误处理](#错误处理)
  - [解决80端口被占用](#解决80端口被占用)
  - [头像无法正常显示](#头像无法正常显示)
  - [其它错误](#其它错误)
- [参考资料](#参考资料)

<!-- /TOC -->

##  官方安装

下面是官网复制过来的官方安装方法，最简单的安装，在我大天朝，只能望天兴叹，你可翻墙安装或者略过这里，看下面的。

1. 安装并配置必要的依赖项

If you install Postfix to send email please select 'Internet Site' during setup. Instead of using Postfix you can also use Sendmail or configure a custom SMTP server and configure it as an SMTP server.

On Centos 6 and 7, the commands below will also open HTTP and SSH access in the system firewall.

```
sudo yum install curl openssh-server openssh-clients postfix cronie
sudo service postfix start
sudo chkconfig postfix on
sudo lokkit -s http -s ssh
```

2. 添加gitlab服务器包和安装包

```
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash
sudo yum install gitlab-ce
```

If you are not comfortable installing the repository through a piped script, you can find the entire script here and select and download the package manually and install using

```
curl -LJO https://packages.gitlab.com/gitlab/gitlab-ce/packages/el/6/gitlab-ce-XXX.rpm/download
rpm -i gitlab-ce-XXX.rpm
```

3. 配置并启动GitLab

```
sudo gitlab-ctl reconfigure
```

4. 浏览器打开并登录

On your first visit, you'll be redirected to a password reset screen to provide the password for the initial administrator account. Enter your desired password and you'll be redirected back to the login screen.

The default account's username is root. Provide the password you created earlier and login. After login you can change the username if you wish.



## 第三方镜像安装

- [Gitlab Community Edition 镜像使用帮助](https://mirror.tuna.tsinghua.edu.cn/help/gitlab-ce/)
- [在阿里云上通过Omnibus一键安装包安装Gitlab](https://github.com/hehongwei44/my-blog/issues/19)

### 编辑源

新建 /etc/yum.repos.d/gitlab-ce.repo，内容为

[使用清华大学 TUNA 镜像源](https://mirror.tuna.tsinghua.edu.cn/help/gitlab-ce/) 打开网址将内容复制到`gitlab-ce.repo`文件中，编辑路径`vim /etc/yum.repos.d/gitlab-ce.repo`

```bash
[gitlab-ce]
name=gitlab-ce
baseurl=http://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el6
repo_gpgcheck=0
gpgcheck=0
enabled=1
gpgkey=https://packages.gitlab.com/gpg.key
```

### 更新本地YUM缓存

```bash 
sudo yum makecache
```

### 安装社区版

```bash
sudo yum install gitlab-ce #(自动安装最新版)
sudo yum install gitlab-ce-8.15.2-ce.0.el6 #(安装指定版本)
```

### 更改配置

```bash
vim /etc/gitlab/gitlab.rb
# 找到 external_url 'http://000.00.00.00:8081'
# 修改成你的地址
```

### 配置并启动GitLab

```bash
# 打开`/etc/gitlab/gitlab.rb`,
# 将`external_url = 'http://git.example.com'`修改为自己的IP地址：`http://xxx.xx.xxx.xx`，
# 然后执行下面的命令，对GitLab进行编译。
sudo gitlab-ctl reconfigure
# 清除缓存
sudo gitlab-rake cache:clear RAILS_ENV=production
```

### 登录GitLab

```
Username: root 
Password: 5iveL!fe
```

## 卸载

```bash
sudo gitlab-ctl uninstall
```

## 运维 

```bash
# 修改默认的配置文件
sudo vim /etc/gitlab/gitlab.rb

# 查看版本
sudo cat /opt/gitlab/embedded/service/gitlab-rails/VERSION

# echo "vm.overcommit_memory=1" >> /etc/sysctl.conf
# sysctl -p
# echo never > /sys/kernel/mm/transparent_hugepage/enabled

# 检查gitlab
gitlab-rake gitlab:check SANITIZE=true --trace

# 查看日志
sudo gitlab-ctl tail

# 数据库关系升级
sudo gitlab-rake db:migrate

# 清理缓存
sudo gitlab-rake cache:clear


sudo gitlab-rake gitlab:check
sudo gitlab-rake gitlab:check SANITIZE=true

# 升级gitlab
sudo yum install gitlab-ce

# 升级数据命令
sudo gitlab-ctl pg-upgrade
```

### 服务管理

```bash 
# 启动所有 gitlab 组件：
sudo gitlab-ctl start

# 停止所有 gitlab 组件：
sudo gitlab-ctl stop

# 停止所有 gitlab postgresql 组件：
sudo gitlab-ctl stop postgresql

# 停止相关数据连接服务
sudo gitlab-ctl stop unicorn
sudo gitlab-ctl stop sidekiq

# 重启所有 gitlab 组件：
sudo gitlab-ctl restart

# 重启所有 gitlab gitlab-workhorse 组件：
sudo gitlab-ctl restart  gitlab-workhorse

# 查看服务状态
sudo gitlab-ctl status

# 生成配置启动服务
sudo gitlab-ctl reconfigure
```

### 日志查看

```bash

# 查看日志
sudo gitlab-ctl tail

# 检查redis的日志
sudo gitlab-ctl tail redis
 
# 检查postgresql的日志
sudo gitlab-ctl tail postgresql
 
# 检查gitlab-workhorse的日志
sudo gitlab-ctl tail gitlab-workhorse
 
# 检查logrotate的日志
sudo gitlab-ctl tail logrotate
 
# 检查nginx的日志
sudo gitlab-ctl tail nginx
 
# 检查sidekiq的日志
sudo gitlab-ctl tail sidekiq
 
# 检查unicorn的日志
sudo gitlab-ctl tail unicorn

```

### 重置管理员密码

gitlab管理员密码忘记，怎么重置密码，Gitlab 修改root用户密码

使用rails工具打开终端

```bash
sudo gitlab-rails console production
```

查询用户的email，用户名，密码等信息，id:1 表示root账号

```bash
user = User.where(id: 1).first
```

重新设置密码

```bash
user.password = '新密码'
user.password_confirmation = '新密码'　
```

保存密码

```bash
user.save!
```

完整的操作ruby脚本

```bash
user = User.where(id: 1).first
user.password = '新密码'
user.password_confirmation = '新密码'
user.save!
```

## 备份恢复

使用Gitlab一键安装包安装Gitlab非常简单, 同样的备份恢复与迁移也非常简单,用一条命令即可创建完整的Gitlab备份:

### 修改备份文件默认目录

修改`/etc/gitlab/gitlab.rb`来修改默认存放备份文件的目录:

```bash
gitlab_rails['backup_path'] = '/mnt/backups'  
```

### 创建备份

```bash
gitlab-rake gitlab:backup:create
```

以上命令将在/var/opt/gitlab/backups目录下创建一个名称类似为xxxxxxxx_gitlab_backup.tar的压缩包, 这个压缩包就是Gitlab整个的完整部分, 其中开头的xxxxxx是备份创建的时间戳。

修改后使用gitlab-ctl reconfigure命令重载配置文件。

### 开始备份

```bash
gitlab-rake gitlab:backup:create
```

这里放你的备份文件文件夹，和仓库源文件。

```bash
/var/opt/gitlab/backups                   # 备份文件文件夹
/var/opt/gitlab/git-data/repositories     # git仓库源文件
```

### 自动备份

通过crontab使用备份命令实现自动备份

```bash
crontab -e
# 每天2点备份gitlab数据
0 2 * * * /usr/bin/gitlab-rake gitlab:backup:create
0 2 * * * /opt/gitlab/bin/gitlab-rake gitlab:backup:create
```

上面两行保存之后，重新载入配置

```bash
/sbin/service crond reload
```

### 备份保留七天

设置只保存最近7天的备份，编辑 /etc/gitlab/gitlab.rb 配置文件，找到如下代码，删除注释 `#` 保存

```bash
# /etc/gitlab/gitlab.rb 配置文件 修改下面这一行
gitlab_rails['backup_keep_time'] = 604800  
```

重新加载gitlab配置文件

```bash
sudo gitlab-ctl reconfigure  
```


### 开始恢复

迁移如同备份与恢复的步骤一样, 只需要将老服务器/var/opt/gitlab/backups目录下的备份文件拷贝到新服务器上的/var/opt/gitlab/backups即可(如果你没修改过默认备份目录的话)。 然后执行恢复命令。
如果修改了，首先进入备份 gitlab 的目录，这个目录是配置文件中的 `gitlab_rails['backup_path']` ，默认为 `/var/opt/gitlab/backups` 。

然后停止 unicorn 和 sidekiq ，保证数据库没有新的连接，不会有写数据情况。

```bash
# 停止相关数据连接服务
gitlab-ctl stop unicorn
# ok: down: unicorn: 0s, normally up
gitlab-ctl stop sidekiq
# ok: down: sidekiq: 0s, normally up

# 从xxxxx编号备份中恢复
# 然后恢复数据，1406691018为备份文件的时间戳
gitlab-rake gitlab:backup:restore BACKUP=1406691018

# 新版本 1483533591_2017_01_04_gitlab_backup.tar
gitlab-rake gitlab:backup:restore BACKUP=1483533591_2017_01_04_gitlab_backup.tar

# 启动Gitlab
sudo gitlab-ctl start  
```


判断是执行实际操作的gitlab相关用户：git，没有得到足够的权限。依次执行命令：

```bash
# 恢复过程中没有权限
mkdir /var/opt/gitlab/backups
chown git /var/opt/gitlab/backups
chmod 700 /var/opt/gitlab/backups

# 恢复成功页面报没有权限的错误
sudo chown -R git:git /var/opt/gitlab/git-data/repositories
sudo chmod -R ug+rwX,o-rwx /var/opt/gitlab/git-data/repositories
sudo chmod -R ug-s /var/opt/gitlab/git-data/repositories
sudo find /var/opt/gitlab/git-data/repositories -type d -print0 | sudo xargs -0 chmod g+s
```


## 暴力升级

直接编辑源 /etc/yum.repos.d/gitlab-ce.repo，安装 GitLab 社区版

```bash
sudo yum install gitlab-ce #(自动安装最新版)
sudo yum install gitlab-ce-8.15.2-ce.0.el6 #(安装指定版本)
```

安装过程会报错

```
gitlab preinstall: Automatically backing up only the GitLab SQL database (excluding everything else!)
Dumping database ...
Dumping PostgreSQL database gitlabhq_production ... pg_dump: [archiver (db)] connection to database "gitlabhq_production" failed: could not connect to server: 没有那个文件或目录
    Is the server running locally and accepting
    connections on Unix domain socket "/var/opt/gitlab/postgresql/.s.PGSQL.5432"?
Backup failed
[FAILED]
gitlab preinstall:
gitlab preinstall: Backup failed! If you want to skip this backup, run the following command and
gitlab preinstall: try again:
gitlab preinstall:
gitlab preinstall:   sudo touch /etc/gitlab/skip-auto-migrations
gitlab preinstall:
error: %pre(gitlab-ce-8.15.2-ce.0.el6.x86_64) scriptlet failed, exit status 1
Error in PREIN scriptlet in rpm package gitlab-ce-8.15.2-ce.0.el6.x86_64
error:   install: %pre scriptlet failed (2), skipping gitlab-ce-8.15.2-ce.0.el6
gitlab-ce-8.11.5-ce.0.el6.x86_64 was supposed to be removed but is not!
  Verifying  : gitlab-ce-8.11.5-ce.0.el6.x86_64                                                                                                                                                             1/2
  Verifying  : gitlab-ce-8.15.2-ce.0.el6.x86_64                                                                                                                                                             2/2

Failed:
  gitlab-ce.x86_64 0:8.11.5-ce.0.el6
```

看上面一堆错误，瞬间就懵逼了，看到一条救星命令让我尝试运行 `sudo touch /etc/gitlab/skip-auto-migrations` 于是我二逼的运行了，结果真的安装成功了，😄。

```
...
gitlab: Thank you for installing GitLab!
gitlab: To configure and start GitLab, RUN THE FOLLOWING COMMAND:

sudo gitlab-ctl reconfigure

gitlab: GitLab should be reachable at http://114.55.148.71:8081
gitlab: Otherwise configure GitLab for your system by editing /etc/gitlab/gitlab.rb file
gitlab: And running reconfigure again.
gitlab:
gitlab: For a comprehensive list of configuration options please see the Omnibus GitLab readme
gitlab: https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md
gitlab:

gitlab: GitLab now ships with a newer version of PostgreSQL (9.6.1), and will be used
gitlab: as the default in the next major relase. To upgrade, RUN THE FOLLOWING COMMANDS:

sudo gitlab-ctl pg-upgrade

gitlab: For more details, please see:
gitlab: https://docs.gitlab.com/omnibus/settings/database.html#upgrade-packaged-postgresql-server
gitlab:
  清理       : gitlab-ce-8.11.5-ce.0.el6.x86_64                                                                                                                                                             2/2
Found /etc/gitlab/skip-auto-migrations, exiting...
  Verifying  : gitlab-ce-8.15.2-ce.0.el6.x86_64                                                                                                                                                             1/2
  Verifying  : gitlab-ce-8.11.5-ce.0.el6.x86_64                                                                                                                                                             2/2

更新完毕:
  gitlab-ce.x86_64 0:8.15.2-ce.0.el6

完毕！
```


## 错误处理


### 解决80端口被占用

nginx配置解决 `80` 端口被占用

```
upstream gitlab {
     server 114.55.111.111:8081 ;
}
server {
    #侦听的80端口
    listen       80;
    server_name  git.diggg.cn;
    location / {
        proxy_pass   http://gitlab;    #在这里设置一个代理，和upstream的名字一样
        #以下是一些反向代理的配置可删除
        proxy_redirect             off;
        #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
        proxy_set_header           Host $host;
        proxy_set_header           X-Real-IP $remote_addr;
        proxy_set_header           X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size       10m; #允许客户端请求的最大单文件字节数
        client_body_buffer_size    128k; #缓冲区代理缓冲用户端请求的最大字节数
        proxy_connect_timeout      300; #nginx跟后端服务器连接超时时间(代理连接超时)
        proxy_send_timeout         300; #后端服务器数据回传时间(代理发送超时)
        proxy_read_timeout         300; #连接成功后，后端服务器响应时间(代理接收超时)
        proxy_buffer_size          4k; #设置代理服务器（nginx）保存用户头信息的缓冲区大小
        proxy_buffers              4 32k; #proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
        proxy_busy_buffers_size    64k; #高负荷下缓冲大小（proxy_buffers*2）
        proxy_temp_file_write_size 64k; #设定缓存文件夹大小，大于这个值，将从upstream服务器传
    }
}
```

nginx配置检查和立即生效

```bash

# 检查配置
/usr/local/nginx-1.5.1/sbin/nginx -tc conf/nginx.conf

# nginx 重新加载配置
/usr/local/nginx-1.5.1/sbin/nginx -s reload
```



### 头像无法正常显示

原因：gravatar被墙
解决办法：
编辑 /etc/gitlab/gitlab.rb，将

```bash
# gitlab_rails['gravatar_plain_url'] = 'http://gravatar.duoshuo.com/avatar/%{hash}?s=%{size}&d=identicon'
```

修改为：

```
gitlab_rails['gravatar_plain_url'] = 'http://gravatar.duoshuo.com/avatar/%{hash}?s=%{size}&d=identicon'
```

然后在命令行执行：

```bash
sudo gitlab-ctl reconfigure 
sudo gitlab-rake cache:clear RAILS_ENV=production
```


### 其它错误

```bash
Error executing action `run` on resource 'bash[migrate gitlab-rails database]'
```

上面错误是数据库没有启动，我不知道如何启动，我重启了服务器，然后好球了。😆 
https://gitlab.com/gitlab-org/gitlab-ce/issues/2052#note_1667899

```bash
NameError: uninitialized constant Devise::Async
```


```
Processing by RootController#index as HTML
Completed 401 Unauthorized in 17ms (ActiveRecord: 2.7ms)
```


```
/var/log/gitlab/nginx/gitlab_access.log <==
114.55.148.71 - - [04/Jan/2017:17:20:24 +0800] "GET /favicon.ico HTTP/1.0" 502 2662 "http://git.showgold.cn/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36"
```


## 参考资料

- [gitlab / gitlab-ce](https://packages.gitlab.com/gitlab/gitlab-ce)
- [官网下载](https://www.gitlab.cc/downloads)
- [官网安装说明](https://doc.gitlab.cc/ce/install/requirements.html)
- [开源版本和企业版本对比](https://www.gitlab.cc/features/#enterprise)
- [官方升级Gitlab教程](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/update/8.14-to-8.15.md)
- [官方Centos安装Gitlab教程](https://gitlab.com/gitlab-org/gitlab-recipes/tree/master/install/centos)
- [Gitlab升级记录](http://opjasee.com/2016/01/28/gitlab-upgrade.html)
- [修改gitlab使用现有nginx服务及502问题解决](http://www.yuzhewo.com/2015/11/03/%E4%BF%AE%E6%94%B9gitlab%E4%BD%BF%E7%94%A8%E7%8E%B0%E6%9C%89nginx%E6%9C%8D%E5%8A%A1%E5%8F%8A502%E9%97%AE%E9%A2%98%E8%A7%A3%E5%86%B3/)