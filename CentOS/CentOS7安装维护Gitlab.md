CentOS7安装维护Gitlab
---

目录
===

<!-- TOC -->

- [目录](#目录)
  - [官方安装](#官方安装)
  - [第三方镜像安装](#第三方镜像安装)
    - [编辑源](#编辑源)
    - [更新本地YUM缓存](#更新本地yum缓存)
    - [安装社区版](#安装社区版)
    - [更改配置](#更改配置)
    - [配置并启动GitLab](#配置并启动gitlab)
    - [登录GitLab](#登录gitlab)
    - [启用 gitlab registry 功能](#启用-gitlab-registry-功能)
  - [Docker安装](#docker安装)
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
  - [连接数据库](#连接数据库)
  - [一些常规目录](#一些常规目录)
  - [使用HTTPS](#使用https)
  - [暴力升级](#暴力升级)
  - [优化内存使用](#优化内存使用)
  - [错误处理](#错误处理)
    - [解决80端口被占用](#解决80端口被占用)
    - [头像无法正常显示](#头像无法正常显示)
    - [internal API unreachable](#internal-api-unreachable)
    - [proxy_temp 目录没有权限](#proxy_temp-目录没有权限)
    - [webhooks 错误](#webhooks-错误)
    - [服务无法启动](#服务无法启动)
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
[gitlab/gitlab-ce](https://packages.gitlab.com/gitlab/gitlab-ce)

```bash
curl -LJO https://packages.gitlab.com/gitlab/gitlab-ce/packages/el/6/gitlab-ce-XXX.rpm/download
curl -LJO https://packages.gitlab.com/gitlab/gitlab-ce/packages/el/7/gitlab-ce-10.2.2-ce.0.el7.x86_64.rpm/download
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

### 启用 gitlab registry 功能

开启 [Configuring Registry](https://docs.gitlab.com/omnibus/architecture/registry/README.html#configuring-registry) 功能，只需修改配置 [`/etc/gitlab/gitlab.rb`](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/10-3-stable/files/gitlab-cookbooks/gitlab/libraries/registry.rb#L39-55) 文件，将 `registry_external_url` 的值修改为 http://192.168.188.211:5008

```ruby
registry_external_url 'http://192.168.188.211:5008'
```

`registry_external_url` 这个地址是我们使用 `docker` 命令进行 `pull` 或者 `push` 镜像的仓库地址。

重启 `Gitlab` 后，可以在 `Gitlab` 左侧面板看到 `Container Registry` 的菜单。

按照 gitlab 给出的提示，我们先登录上 gitlab 的 registry：

```bash
docker login 192.168.188.211:5008
Username: ****
Password: **
```

注意：⚠️ 密码是需要通过 [Gitlab > User Settings > Access Tokens > Add a personal access token](http://gitlab.com/-/profile/personal_access_tokens) 生成一个 `personal_access_tokens` 而不是真正的密码


```
docker build -t 192.168.188.211:5008/docker/docker-static-service-template .
# 提交镜像
docker push 192.168.188.211:5008/docker/docker-static-service-template
```

## Docker安装

[Docker 安装 Gitlab 教程](https://github.com/jaywcjlove/docker-tutorial/blob/master/gitlab.md)

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
gitlab-rake gitlab:check
gitlab-rake gitlab:check SANITIZE=true
# 查看日志
gitlab-ctl tail
# 数据库关系升级
gitlab-rake db:migrate
# 清理缓存
gitlab-rake cache:clear

# 更新gitlab包
yum update gitlab-ce

# 升级gitlab
yum install gitlab-ce

# 升级数据命令
gitlab-ctl pg-upgrade
```

### 服务管理

```bash 
gitlab-ctl start # 启动所有 gitlab 组件：
gitlab-ctl stop  # 停止所有 gitlab 组件：
gitlab-ctl stop postgresql # 停止所有 gitlab postgresql 组件：
# 停止相关数据连接服务
gitlab-ctl stop unicorn
gitlab-ctl stop sidekiq
gitlab-ctl restart # 重启所有 gitlab 组件：
gitlab-ctl restart gitlab-workhorse # 重启所有 gitlab gitlab-workhorse 组件：
gitlab-ctl status # 查看服务状态
gitlab-ctl reconfigure # 生成配置启动服务
```

### 日志查看

```bash
sudo gitlab-ctl tail # 查看日志
sudo gitlab-ctl tail redis # 检查redis的日志
sudo gitlab-ctl tail postgresql       # 检查postgresql的日志
sudo gitlab-ctl tail gitlab-workhorse # 检查gitlab-workhorse的日志
sudo gitlab-ctl tail logrotate # 检查logrotate的日志
sudo gitlab-ctl tail nginx    # 检查nginx的日志
sudo gitlab-ctl tail sidekiq  # 检查sidekiq的日志
sudo gitlab-ctl tail unicorn  # 检查unicorn的日志
```

### 重置管理员密码

Gitlab管理员密码忘记，怎么重置密码，Gitlab 修改root用户密码，[How to reset your root password](http://docs.gitlab.com/ce/security/reset_root_password.html)。

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

以上命令将在 `/var/opt/gitlab/backups` 目录下创建一个名称类似为xxxxxxxx_gitlab_backup.tar的压缩包, 这个压缩包就是Gitlab整个的完整部分, 其中开头的xxxxxx是备份创建的时间戳。

修改后使用gitlab-ctl reconfigure命令重载配置文件。

### 开始备份

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
service crond reload
# or
systemctl reload crond.service
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

迁移如同备份与恢复的步骤一样, 只需要将老服务器 `/var/opt/gitlab/backups` 目录下的备份文件拷贝到新服务器上的 `/var/opt/gitlab/backups` 即可(如果你没修改过默认备份目录的话)。 然后执行恢复命令。
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

如果备份文件报没有权限，通过`ls -al`查看权限是不是`git`，而不是`root`，通过下面方式给`git`用户权限

```bash
sudo chown -R git:git 1483533591_2017_01_04_gitlab_backup.tar
```

## 连接数据库

```bash
# 登陆gitlab的安装服务查看配置文件
cat /var/opt/gitlab/gitlab-rails/etc/database.yml 

vim /var/opt/gitlab/postgresql/data/postgresql.conf
# listen_addresses = '192.168.1.125' # 修改监听地址为ip
# 或者改为 "*"
```

修改 `pg_hba.conf` 配置

```bash
vim  /var/opt/gitlab/postgresql/data/pg_hba.conf
# 将下面这一行添加到配置的最后面
# host    all    all    0.0.0.0/0    trust
```

如果不希望允许所有IP远程访问，则可以将上述配置项中的0.0.0.0设定为特定的IP值。

重启 `postgresql` 数据库

```
gitlab-ctl restart postgresql
```

查看 `/etc/passwd` 文件里边 `gitlab` 对应的系统用户

```bash
[root@localhost ~]$ cat /etc/passwd
...
gitlab-psql:x:493:490::/var/opt/gitlab/postgresql:/bin/sh  # gitlab的postgresql用户
```

## 一些常规目录

```bash
# 配置目录
/etc/gitlab/gitlab.rb
# 生成好的nginx配置
/var/opt/gitlab/nginx/conf/gitlab-http.conf
# 备份目录
/var/opt/gitlab/backups
```

## 使用HTTPS

直接将nginx配置复制到你自己的nginx配置中，停掉gitlab的nginx

```bash
cp /var/opt/gitlab/nginx/conf/gitlab-http.conf /usr/local/nginx/conf/vhost/
```

将你的SSL证书配置复制进去

```nginx
server {
  listen 443 ssl;
  server_name  g.doman.cn;
  ssl_certificate /etc/letsencrypt/live/*****/certificate.crt;
  ssl_certificate_key /etc/letsencrypt/live/*****/private.key;
  # .....
}
```

编辑`vi /usr/local/nginx/conf/nginx.conf`你的nginx配置，引用你复制过来的配置。

```nginx
http {
  # .....
  include vhost/gitlab-http.conf;
}
```

同时要把`/var/opt/gitlab/nginx/conf/nginx.conf`中的一些变量复制到自己的nginx配置中`nginx.conf`

```nginx
http {
  # .....
  log_format gitlab_access '$remote_addr - $remote_user [$time_local] "$request_method $filtered_request_uri $server_protocol" $status $body_bytes_sent "$filtered_http_referer" "$http_user_agent"';
  log_format gitlab_mattermost_access '$remote_addr - $remote_user [$time_local] "$request_method $filtered_request_uri $server_protocol" $status $body_bytes_sent "$filtered_http_referer" "$http_user_agent"';

  proxy_cache_path proxy_cache keys_zone=gitlab:10m max_size=1g levels=1:2;
  proxy_cache gitlab;
  map $http_upgrade $connection_upgrade {
      default upgrade;
      ''      close;
  }

  # Remove private_token from the request URI
  # In:  /foo?private_token=unfiltered&authenticity_token=unfiltered&rss_token=unfiltered&...
  # Out: /foo?private_token=[FILTERED]&authenticity_token=unfiltered&rss_token=unfiltered&...
  map $request_uri $temp_request_uri_1 {
    default $request_uri;
    ~(?i)^(?<start>.*)(?<temp>[\?&]private[\-_]token)=[^&]*(?<rest>.*)$ "$start$temp=[FILTERED]$rest";
  }
  # Remove authenticity_token from the request URI
  # In:  /foo?private_token=[FILTERED]&authenticity_token=unfiltered&rss_token=unfiltered&...
  # Out: /foo?private_token=[FILTERED]&authenticity_token=[FILTERED]&rss_token=unfiltered&...
  map $temp_request_uri_1 $temp_request_uri_2 {
    default $temp_request_uri_1;
    ~(?i)^(?<start>.*)(?<temp>[\?&]authenticity[\-_]token)=[^&]*(?<rest>.*)$ "$start$temp=[FILTERED]$rest";
  }
  # Remove rss_token from the request URI
  # In:  /foo?private_token=[FILTERED]&authenticity_token=[FILTERED]&rss_token=unfiltered&...
  # Out: /foo?private_token=[FILTERED]&authenticity_token=[FILTERED]&rss_token=[FILTERED]&...
  map $temp_request_uri_2 $filtered_request_uri {
    default $temp_request_uri_2;
    ~(?i)^(?<start>.*)(?<temp>[\?&]rss[\-_]token)=[^&]*(?<rest>.*)$ "$start$temp=[FILTERED]$rest";
  }
  # A version of the referer without the query string
  map $http_referer $filtered_http_referer {
    default $http_referer;
    ~^(?<temp>.*)\? $temp;
  }
}
```


## 暴力升级

暴力升级前先备份，然后停止所有服务运行，记得备份的良好习惯

```bash
gitlab-ctl stop  # 停止所有 gitlab 组件：
# 更新gitlab包
yum update gitlab-ce
```

直接编辑源 /etc/yum.repos.d/gitlab-ce.repo，安装 GitLab 社区版

```bash
yum list gitlab-ce # 查看版本
sudo yum install gitlab-ce #(自动安装最新版)
sudo yum install gitlab-ce-8.15.2-ce.0.el6 #(安装指定版本)
```

注意：`10.7` 版本升级到 `11.x` 版本需要先升级到 `10.8` 版本

```bash
# 安装指定版本 10.8 的版本
sudo yum install gitlab-ce-10.8.0-ce.0.el6
```

安装完成记得将所有服务启起来哦

```bash
gitlab-ctl start # 启动所有数据库
# postgresql 数据库如果启动不了，通过重启启动
gitlab-ctl restart postgresql
```

安装过如果报错，查看提示根据提示操作，版本跨度太大会报错哦。

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

看上面一堆错误，瞬间就懵逼了，看到一条救星命令让我尝试运行 `sudo touch /etc/gitlab/skip-auto-migrations` 于是我二逼的重新`yum install gitlab-ce`运行了，结果真的安装成功了，😄。

```bash
# 重新安装命令
yum reinstall gitlab-ce
# or
yum install gitlab-ce
```

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

重启配置，可以解决大部分`502`错误。

```bash
gitlab-ctl reconfigure
```

## 优化内存使用

修改配置文件 `/etc/gitlab/gitlab.rb`

```bash
# 减少 postgresql 数据库缓存
postgresql['shared_buffers'] = "256MB"
# 减少sidekiq的并发数
sidekiq['concurrency'] = 1

# worker进程数
postgresql['max_worker_processes'] = 4

unicorn['worker_processes'] = 2  ## worker进程数
unicorn['worker_memory_limit_min'] = "400 * 1 << 20" ##worker最小内存
unicorn['worker_memory_limit_max'] = "650 * 1 << 20" ##worker最大内存
```

## 错误处理

### 解决80端口被占用

nginx配置解决 `80` 端口被占用

```nginx
upstream gitlab {
     server 114.55.111.111:8081 ;
}
server {
  # 侦听的80端口
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
/usr/local/nginx/sbin/nginx -tc conf/nginx.conf
# nginx 重新加载配置
/usr/local/nginx/sbin/nginx -s reload
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

### internal API unreachable

这个错误是一个自己制造的坑，我克隆和提交都没有办法搞，但是网站能正常运行，尝试了非常多的方法，最终我的问题是`22`端口没有隐射出去，好尴尬。

```bash
GitLab: Failed to authorize your Git request: internal API unreachable
```

解决办法：https://gitlab.com/gitlab-org/gitlab-ce/issues/33702  
通过防火墙规则 127.0.0.1  

### proxy_temp 目录没有权限

```bash
[crit] 14788#0: *215 open() "/usr/local/nginx/proxy_temp/5/01/0000000015" failed (13: Permission denied) while reading upstream
```

以下方式解决

```bash
chown -R root:root /usr/local/nginx/proxy_temp
# 编辑 nginx.conf
sudo vi /usr/local/nginx/conf/nginx.conf
# 在第一行添加
user root;
```

### webhooks 错误

错误显示不允许发送本地请求

```
Url is blocked: Requests to the local network are not allowed
```

解决方法，在设置中设置允许本地连接即可

> `admin` => `Settings` => `Outbound requests`


### 服务无法启动

```
[root@localhost gitlab]# gitlab-ctl status
fail: alertmanager: runsv not running
fail: gitaly: runsv not running
fail: gitlab-monitor: runsv not running
fail: gitlab-workhorse: runsv not running
fail: logrotate: runsv not running
fail: nginx: runsv not running
fail: node-exporter: runsv not running
fail: postgres-exporter: runsv not running
fail: postgresql: runsv not running
fail: prometheus: runsv not running
fail: redis: runsv not running
fail: redis-exporter: runsv not running
fail: sidekiq: runsv not running
fail: unicorn: runsv not running
```

[](https://confluence.jaytaala.com/pages/viewpage.action?pageId=9666568)
[Omnibus gitlab do not restart on CentOS7](https://gitlab.com/gitlab-org/omnibus-gitlab/issues/272)
开机自动启动服务

```
[root@localhost ~]# systemctl status gitlab-runsvdir.service -l
● gitlab-runsvdir.service - GitLab Runit supervision process
   Loaded: loaded (/usr/lib/systemd/system/gitlab-runsvdir.service; enabled; vendor preset: disabled)
   Active: inactive (dead)
```

如果 `gitlab-runsvdir.service` 服务没有响应，你可能要看一下内存是否满了，需要释放内存，老的版本需要 2G 内存，新版本需要至少 4G 内存。

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
114.55.148.71 - - [04/Jan/2017:17:20:24 +0800] "GET /favicon.ico HTTP/1.0" 502 2662 "http://git.xxxxx.cn/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36"
```

## 参考资料

- [gitlab/gitlab-ce](https://packages.gitlab.com/gitlab/gitlab-ce)
- [官网下载](https://www.gitlab.cc/downloads)
- [官网安装说明](https://doc.gitlab.cc/ce/install/requirements.html)
- [开源版本和企业版本对比](https://www.gitlab.cc/features/#enterprise)
- [官方升级Gitlab教程](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/update/8.14-to-8.15.md)
- [官方Centos安装Gitlab教程](https://gitlab.com/gitlab-org/gitlab-recipes/tree/master/install/centos)
- [Gitlab升级记录](http://opjasee.com/2016/01/28/gitlab-upgrade.html)
- [修改gitlab使用现有nginx服务及502问题解决](http://www.yuzhewo.com/2015/11/03/%E4%BF%AE%E6%94%B9gitlab%E4%BD%BF%E7%94%A8%E7%8E%B0%E6%9C%89nginx%E6%9C%8D%E5%8A%A1%E5%8F%8A502%E9%97%AE%E9%A2%98%E8%A7%A3%E5%86%B3/)
- [我所遇到的GitLab 502问题的解决](http://blog.csdn.net/wangxicoding/article/details/43738137)