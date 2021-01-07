使用免费SSL证书让网站支持HTTPS访问
---

我们使用的服务器是在公司内部，用联通送的ip，通过路由器隐射使得外网可以访问，我们在这个服务器搭建了很多工具，比如Gitlab，聊天工具，网盘等，访问都很麻烦，没有备案，都必须带上端口号访问对应的服务，据说80端口被封了，假设有了https就可以默认443端口，就不用带端口号了，通过https访问默认浏览器会给你带上443端口，下面是我使用[Let's Encrypt](https://www.sslforfree.com/)提供的SSL证书，记录配置SSL的安装实践过程。

<!-- TOC -->

- [使用免费SSL证书让网站支持HTTPS访问](#使用免费ssl证书让网站支持https访问)
- [certbot-auto](#certbot-auto)
  - [安装](#安装)
  - [申请证书](#申请证书)
  - [续期HTTPS证书](#续期https证书)
  - [查看证书过期时间](#查看证书过期时间)
  - [nginx应用该证书的例子](#nginx应用该证书的例子)
  - [无法应用到主域名](#无法应用到主域名)
- [certbot-nginx](#certbot-nginx)
  - [安装 EPEL 仓库](#安装-epel-仓库)
  - [安装签发证书工具](#安装签发证书工具)
  - [申请证书](#申请证书-1)
    - [报nginx命令不存在错误](#报nginx命令不存在错误)
    - [报nginx配置文件目录不对错误](#报nginx配置文件目录不对错误)
    - [正式申请申请证书](#正式申请申请证书)
  - [配置nginx](#配置nginx)
- [错误处理](#错误处理)
- [参考阅读](#参考阅读)

<!-- /TOC -->

下面两种方法均在 CentOS7 环境下操作滴。

## certbot-auto

刚看到新闻，Let's Encrypt发布的 ACME v2 现已正式支持通配符HTTPS证书，就立马使用上了 [certbot](https://github.com/certbot/certbot)

### 安装

```bash
# 下载
wget https://dl.eff.org/certbot-auto

# 设为可执行权限
chmod a+x certbot-auto
```

### 申请证书

```bash
# 注xxx.com请根据自己的域名自行更改
./certbot-auto --server https://acme-v02.api.letsencrypt.org/directory -d "*.xxx.com" --manual --preferred-challenges dns-01 certonly

sudo ./certbot-auto certonly --standalone --email my@qq.com -d abc.com -d www.abc.com
```

选项 `--no-self-upgrade`。certbot-auto默认始终尝试更新到最新版，但对已经稳定的应用而言，可以不用更新，因此可以使用此选项直接更新证书，而不用更新certbot-auto导致其它意外问题。

从服务器到目的地的出站端口 443 是否被防火墙阻止

```bash
nc -vz acme-v02.api.letsencrypt.org 443 -w2
# Ncat: Version 7.50 ( https://nmap.org/ncat )
# Ncat: Connected to 23.77.214.183:443.
# Ncat: 0 bytes sent, 0 bytes received in 0.07 seconds.
```

执行完这一步之后，会下载一些需要的依赖，稍等片刻之后，会提示输入邮箱

> 邮箱很重要，主要用于安全提醒，以及续期提醒

```diff
Complete!
Creating virtual environment...
Installing Python packages...
Installation succeeded.
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator manual, Installer None
Enter email address (used for urgent renewal and security notices) (Enter 'c' to
- cancel): 
+ cancel):  这里填写邮箱地址

-------------------------------------------------------------------------------
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server at
https://acme-v02.api.letsencrypt.org/directory
-------------------------------------------------------------------------------
- (A)gree/(C)ancel: 
+ (A)gree/(C)ancel: A

-------------------------------------------------------------------------------
Would you be willing to share your email address with the Electronic Frontier
Foundation, a founding partner of the Let's Encrypt project and the non-profit
organization that develops Certbot? We'd like to send you email about EFF and
our work to encrypt the web, protect its users and defend digital rights.
-------------------------------------------------------------------------------
- (Y)es/(N)o: 
+ (Y)es/(N)o: Y
Obtaining a new certificate
Performing the following challenges:
dns-01 challenge for showgold.com

-------------------------------------------------------------------------------
NOTE: The IP of this machine will be publicly logged as having requested this
certificate. If you're running certbot in manual mode on a machine that is not
your server, please ensure you're okay with that.

Are you OK with your IP being logged?
-------------------------------------------------------------------------------
- (Y)es/(N)o: 
+ (Y)es/(N)o: Y

-------------------------------------------------------------------------------
Please deploy a DNS TXT record under the name
+ _acme-challenge.xxx.com
with the following value:

+ VBsfRHG______4t_drxcEFQlyOS0puAlJFypAYQTA

Before continuing, verify the record is deployed.
-------------------------------------------------------------------------------
Press Enter to Continue
+ 不要心急着按回车，先执行dig _acme-challenge.xxx.com txt确认解析记录是否生效，生效之后再回去按回车确认
Waiting for verification...

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
+   /etc/letsencrypt/live/xxx.com/fullchain.pem
   Your key file has been saved at:
+   /etc/letsencrypt/live/xxx.com/privkey.pem
   Your cert will expire on 2018-06-13. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot-auto
   again. To non-interactively renew *all* of your certificates, run
+   "certbot-auto renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

> 注意：  
> 申请通配符证书是要经过DNS认证的，按照提示，前往域名后台添加对应的DNS TXT记录。  
> 添加之后，不要心急着按回车，先执行 dig xxxx.xxx.com txt确认解析记录是否生效，生效之后再回去按回车确认

看到 `Congratulations` 你就大功告成了！

### 续期HTTPS证书

```bash
certbot-auto renew
certbot-auto delete -d chat.xxx.cn # 删除证书
./certbot-auto delete --cert-name xxx.com # 删除证书重新生成
```

⚠️ 注意这里会有升级操作，并且有安装 Python 包，有时候会非常慢，不要停止，停止操作可能会造成麻烦。

### 查看证书过期时间

```bash
openssl x509 -noout -dates -in /etc/letsencrypt/live/<你的域名>/cert.pem
```

简单的查看方法

```bash
certbot-auto certificates 
```

### nginx应用该证书的例子

```nginx
server {
    server_name xxx.com;
    listen 443 http2 ssl;
    ssl on;
    ssl_certificate /etc/letsencrypt/live/xxx.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xxx.com/privkey.pem;

    location / {
      proxy_pass http://127.0.0.1:6666;
    }
}
```

### 无法应用到主域名

如需把主域名也增加到证书的覆盖范围，请在开始申请证书步骤的那个指令把主域名也加上`-d "xxx.com"`，如下：

> 需要注意的是，这样的话需要修改两次解析记录

```
./certbot-auto --server https://acme-v02.api.letsencrypt.org/directory -d "*.xxx.com" -d "xxx.com" --manual --preferred-challenges dns-01 certonly
```

## certbot-nginx

### 安装 EPEL 仓库

首先要安装 `Let's Encrypt` 证书用的工具，这个可以在CentOS 的 EPEL 仓库里找到它，在找到它之前，先检查是否存在 `EPEL` 源:

```bash
# 进入目录检查是否存在 EPEL 源，一般情况文件名称 epel.repo
cd /etc/yum.repos.d/
```

如果不存在可以直接安装

```bash
sudo yum install epel-release -y
```

### 安装签发证书工具

```bash
sudo yum install certbot-nginx -y
# 查看版本
certbot --version
# certbot 0.21.1
```

### 申请证书

#### 报nginx命令不存在错误

```bash
sudo certbot --nginx
# Saving debug log to /var/log/letsencrypt/letsencrypt.log
# The nginx plugin is not working; there may be problems with your existing configuration.
# The error was: NoInstallationError()
# 如果你报上面错误运行下面，命令解决问题
which nginx # 查看目录
#输出 /usr/local/nginx/sbin/nginx
yum info nginx
```

解决方法

```bash
ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx
ln -s /usr/local/nginx/conf/ /etc/nginx
```

#### 报nginx配置文件目录不对错误

```bash
sudo certbot --nginx
# Saving debug log to /var/log/letsencrypt/letsencrypt.log
# Error while running nginx -c /etc/nginx/nginx.conf -t.

# nginx: [emerg] open() "/etc/nginx/nginx.conf" failed (2: No such file or directory)
# nginx: configuration file /etc/nginx/nginx.conf test failed

# The nginx plugin is not working; there may be problems with your existing configuration.
# The error was: MisconfigurationError('Error while running nginx -c /etc/nginx/nginx.conf -t.\n\nnginx: [emerg] open() "/etc/nginx/nginx.conf" failed (2: No such file or directory)\nnginx: configuration file /etc/nginx/nginx.conf test failed\n',)
```

解决方法，这个解决方法就是让`certbot`认为你的，你的配置存在，并且将SSL配置写入你的nginx配置文件中，然后拷贝配置到你的默认 nginx 配置中。哈哈为了方便 nginx 启动不用指定配置，也没有看到 `certbot` 工具提供指定目录的命令，暂时我就这么解决吧。

```bash
# nginx 默认配置文件目录不 /etc/nginx/ 目录下，
# 需要拷贝/usr/local/nginx/conf目录下的全部文件
# 复制到/etc/nginx/目录下
cp -r /usr/local/nginx/conf/* /etc/nginx/

# 编辑开机启动将所有目录换成/etc/nginx/
vim /lib/systemd/system/nginx.service
cp /lib/systemd/system/nginx.service{,.bak}

# 测试配置是否正确
nginx -t -c /etc/nginx/nginx.conf
```

正确之后将`nginx`中的 `SSL` 配置复制到你的原来正在运行的配置中，在默认安装目录配置`/usr/local/nginx/conf/`。会在配置中生成如下内容，主要是复制这个。

```nginx
{
  ssl_certificate /etc/letsencrypt/live/chat.wangchujiang.com/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/chat.wangchujiang.com/privkey.pem; # managed by Certbot
}
```

#### 正式申请申请证书

首先运行证书生成命令，选择你要配置`SSL`证书的网站，这个是基于你网站已经在`nginx`中配置好了的情况。

```bash
sudo certbot --nginx certonly
# Saving debug log to /var/log/letsencrypt/letsencrypt.log
# Plugins selected: Authenticator nginx, Installer nginx
# Starting new HTTPS connection (1): acme-v01.api.letsencrypt.org
# 
# Which names would you like to activate HTTPS for?
# -------------------------------------------------------------------------------
# 1: chat.wangchujiang.com
# 2: g.wangchujiang.com
# 3: pan.wangchujiang.com
# -------------------------------------------------------------------------------
# Select the appropriate numbers separated by commas and/or spaces, or leave input
# blank to select all options shown (Enter 'c' to cancel): 2
```

上面选择了`g.wangchujiang.com`生成证书，下面是验证过程，添加 `certonly`参数表示只生成证书。

```bash
# Obtaining a new certificate
# Performing the following challenges:
# tls-sni-01 challenge for g.wangchujiang.com
# Waiting for verification...
# Cleaning up challenges
# 
# IMPORTANT NOTES:
#  - Congratulations! Your certificate and chain have been saved at:
#    /etc/letsencrypt/live/g.wangchujiang.com/fullchain.pem
#    Your key file has been saved at:
#    /etc/letsencrypt/live/g.wangchujiang.com/privkey.pem
#    Your cert will expire on 2018-03-13. To obtain a new or tweaked
#    version of this certificate in the future, simply run certbot
#    again. To non-interactively renew *all* of your certificates, run
#    "certbot renew"
#  - If you like Certbot, please consider supporting our work by:
# 
#    Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
#    Donating to EFF:                    https://eff.org/donate-le
```

上面生成成功了，可以添加到 nginx 配置中，这下完事儿了，下面是一端nginx的配置实例。

### 配置nginx

```nginx
# http 重定向到 https
server {
    listen       80;
    server_name  g.wangchujiang.com;
    rewrite ^ https://$http_host$request_uri? permanent;
    # Enables or disables emitting nginx version on error pages and in the "Server" response header field.
    server_tokens off;
}
# https 的配置
server {
  listen       443 ssl;
  server_name  g.wangchujiang.com;

  ssl_certificate /etc/letsencrypt/live/g.wangchujiang.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/g.wangchujiang.com/privkey.pem;
  # 禁止在header中出现服务器版本，防止黑客利用版本漏洞攻击
  server_tokens off;
  # 设置ssl/tls会话缓存的类型和大小。如果设置了这个参数一般是shared，buildin可能会参数内存碎片，默认是none，和off差不多，停用缓存。如shared:SSL:10m表示我所有的nginx工作进程共享ssl会话缓存，官网介绍说1M可以存放约4000个sessions。 
  ssl_session_cache    shared:SSL:1m; 

  # 客户端可以重用会话缓存中ssl参数的过期时间，内网系统默认5分钟太短了，可以设成30m即30分钟甚至4h。
  ssl_session_timeout  5m; 

  # 选择加密套件，不同的浏览器所支持的套件（和顺序）可能会不同。
  # 这里指定的是OpenSSL库能够识别的写法，你可以通过 openssl -v cipher 'RC4:HIGH:!aNULL:!MD5'（后面是你所指定的套件加密算法） 来看所支持算法。
  ssl_ciphers  HIGH:!aNULL:!MD5;

  # 设置协商加密算法时，优先使用我们服务端的加密套件，而不是客户端浏览器的加密套件。
  ssl_prefer_server_ciphers  on;

  location / {
    root   html;
    index  index.html index.htm;
  }
}
```

## 错误处理

1. 证书提示 certbot-auto 无法升级

```bash
[root@localhost ~]# ./certbot-auto certificates
Upgrading certbot-auto 1.0.0 to 1.3.0...
Couldn't download https://raw.githubusercontent.com/certbot/certbot/v1.3.0/letsencrypt-auto-source/letsencrypt-auto. <urlopen error [Errno 111] Connection refused>
```
`certbot-auto` 将始终尝试从最新版本中获取自身的最新版本。

解决办法：如果希望将其锁定到特定版本并且不接收自动更新，只需在命令后加 --no-self-upgrade 即可

```
./certbot-auto certificates  --no-self-upgrade
```

## 参考阅读

- [利用SSL For Free工具3分钟获取Let's Encrypt免费SSL证书](http://www.laozuo.org/7742.html)
- [Let's Encrypt：用免费的 SSL 证书，让网站支持 HTTPS](https://mp.weixin.qq.com/s/UHTMJjglrgjBHxi5l1EO8g)
- [Automatically enable HTTPS on your website with EFF's Certbot, deploying Let's Encrypt certificates.](https://certbot.eff.org/)
- [Let's Encrypt 宣布支持通配符证书，所有子域名可轻松开启 HTTPS](https://mp.weixin.qq.com/s/vxRpZU6DNoewrQZLDW7YDA)