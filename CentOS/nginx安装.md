# Nginx 安装


Linux系统：`Centos 7 x64`
Nginx版本：`1.11.5`

## 安装prce和openssl

> prce(重定向支持)和openssl(https支持，如果不需要https可以不安装。)

```bash
yum -y install pcre*
yum -y install openssl*
```

CentOS 6.5 我安装的时候是选择的“基本服务器”，默认这两个包都没安装全，所以这两个都运行安装即可。

## 下载nginx

```bash
wget http://nginx.org/download/nginx-1.11.5.tar.gz

# 如果没有安装wget
# 下载已编译版本
$ yum install wget
```

## 编译安装

然后进入目录编译安装，[configure参数说明](#configure参数说明)

```bash
cd nginx-1.7.8
./configure
```

安装报错误的话比如：“C compiler cc is not found”，这个就是缺少编译环境，安装一下就可以了 **yum -y install gcc make gcc-c++ openssl-devel wget**

如果没有error信息，就可以执行下边的安装了：

```bash
make
make install
```

# nginx测试

运行下面命令会出现两个结果

```bash
./nginx -t

# nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
# nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

# 开机自启动

编辑 **vi /lib/systemd/system/nginx.service** 文件，没有创建一个 **touch nginx.service** 然后将如下内容根据具体情况进行修改后，添加到nginx.service文件中：

```bash
[Unit]
Description=nginx1.11.5
After=network.target remote-fs.target nss-lookup.target

[Service]

Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

设置开机启动，使配置生效：

```
systemctl enable nginx.service
```

# 开启nginx进程

```bash
# 启动
/usr/local/nginx/sbin/nginx

# 重启
/usr/local/nginx/sbin/nginx -s reload

# 关闭进程
/usr/local/nginx/sbin/nginx -s stop

# 平滑关闭nginx
/usr/local/nginx/sbin/nginx -s quit

# 查看nginx的安装状态
/usr/local/nginx/sbin/nginx -V 
```

# 关闭防火墙，或者添加防火墙规则就可以测试了

```
service iptables stop
```

或者编辑配置文件：

```
vi /etc/sysconfig/iptables
```

添加这样一条开放80端口的规则后保存：

```
-A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT
```

重启服务即可:

```
service iptables restart
```

**重启服务防火墙报错解决**


```bash
service iptables restart
# Redirecting to /bin/systemctl restart  iptables.service
# Failed to restart iptables.service: Unit iptables.service failed to load: No such file or directory.
```

在CentOS 7或RHEL 7或Fedora中防火墙由 **firewalld** 来管理，当然你可以还原传统的管理方式。或则使用新的命令进行管理。
假如采用传统请执行一下命令：

```bash
# 传统命令
systemctl stop firewalld
systemctl mask firewalld
```

```bash
# 安装命令
yum install iptables-services

systemctl enable iptables 
service iptables restart
```


# nginx卸载

如果通过yum安装，使用下面命令安装。

```bash
yum remove nginx
```

编译安装，删除/usr/local/nginx目录即可
如果配置了自启动脚本，也需要删除。


# configure参数说明

- --prefix=`<path>` - Nginx安装路径。如果没有指定，默认为 /usr/local/nginx。
- --sbin-path=`<path>` - Nginx可执行文件安装路径。只能安装时指定，如果没有指定，默认为`<prefix>`/sbin/nginx。
- --conf-path=`<path>` - 在没有给定-c选项下默认的nginx.conf的路径。如果没有指定，默认为`<prefix>`/conf/nginx.conf。
- --pid-path=`<path>` - 在nginx.conf中没有指定pid指令的情况下，默认的nginx.pid的路径。如果没有指定，默认为 `<prefix>`/logs/nginx.pid。
- --lock-path=`<path>` - nginx.lock文件的路径。
- --error-log-path=`<path>` - 在nginx.conf中没有指定error_log指令的情况下，默认的错误日志的路径。如果没有指定，默认为 `<prefix>`/- logs/error.log。
- --http-log-path=`<path>` - 在nginx.conf中没有指定access_log指令的情况下，默认的访问日志的路径。如果没有指定，默认为 `<prefix>`/- logs/access.log。
- --user=`<user>` - 在nginx.conf中没有指定user指令的情况下，默认的nginx使用的用户。如果没有指定，默认为 nobody。
- --group=`<group>` - 在nginx.conf中没有指定user指令的情况下，默认的nginx使用的组。如果没有指定，默认为 nobody。
- --builddir=DIR - 指定编译的目录 （www.jbxue.com 脚本学堂）
- --with-rtsig_module - 启用 rtsig 模块
- --with-select_module --without-select_module - Whether or not to enable the select module. This module is enabled - by default if a more suitable method such as kqueue, epoll, rtsig or /dev/poll is not discovered by configure.
- //允许或不允许开启SELECT模式，如果 configure 没有找到更合适的模式，比如：kqueue(sun os),epoll (linux kenel 2.6+), rtsig(- 实时信号)或者/dev/poll(一种类似select的模式，底层实现与SELECT基本相 同，都是采用轮训方法) SELECT模式将是默认安装模式
- --with-poll_module --without-poll_module - Whether or not to enable the poll module. This module is enabled by - default if a more suitable method such as kqueue, epoll, rtsig or /dev/poll is not discovered by configure.
- --with-http_ssl_module - Enable ngx_http_ssl_module. Enables SSL support and the ability to handle HTTPS requests. - Requires OpenSSL. On Debian, this is libssl-dev.
- //开启HTTP SSL模块，使NGINX可以支持HTTPS请求。这个模块需要已经安装了OPENSSL，在DEBIAN上是libssl
- --with-http_realip_module - 启用 ngx_http_realip_module
- --with-http_addition_module - 启用 ngx_http_addition_module
- --with-http_sub_module - 启用 ngx_http_sub_module
- --with-http_dav_module - 启用 ngx_http_dav_module
- --with-http_flv_module - 启用 ngx_http_flv_module
- --with-http_stub_status_module - 启用 "server status" 页
- --without-http_charset_module - 禁用 ngx_http_charset_module
- --without-http_gzip_module - 禁用 ngx_http_gzip_module. 如果启用，需要 zlib 。
- --without-http_ssi_module - 禁用 ngx_http_ssi_module
- --without-http_userid_module - 禁用 ngx_http_userid_module
- --without-http_access_module - 禁用 ngx_http_access_module
- --without-http_auth_basic_module - 禁用 ngx_http_auth_basic_module
- --without-http_autoindex_module - 禁用 ngx_http_autoindex_module
- --without-http_geo_module - 禁用 ngx_http_geo_module
- --without-http_map_module - 禁用 ngx_http_map_module
- --without-http_referer_module - 禁用 ngx_http_referer_module
- --without-http_rewrite_module - 禁用 ngx_http_rewrite_module. 如果启用需要 PCRE 。
- --without-http_proxy_module - 禁用 ngx_http_proxy_module
- --without-http_fastcgi_module - 禁用 ngx_http_fastcgi_module
- --without-http_memcached_module - 禁用 ngx_http_memcached_module
- --without-http_limit_zone_module - 禁用 ngx_http_limit_zone_module
- --without-http_empty_gif_module - 禁用 ngx_http_empty_gif_module
- --without-http_browser_module - 禁用 ngx_http_browser_module
- --without-http_upstream_ip_hash_module - 禁用 ngx_http_upstream_ip_hash_module
- --with-http_perl_module - 启用 ngx_http_perl_module
- --with-perl_modules_path=PATH - 指定 perl 模块的路径
- --with-perl=PATH - 指定 perl 执行文件的路径
- --http-log-path=PATH - Set path to the http access log
- --http-client-body-temp-path=PATH - Set path to the http client request body temporary files
- --http-proxy-temp-path=PATH - Set path to the http proxy temporary files
- --http-fastcgi-temp-path=PATH - Set path to the http fastcgi temporary files
- --without-http - 禁用 HTTP server
- --with-mail - 启用 IMAP4/POP3/SMTP 代理模块
- --with-mail_ssl_module - 启用 ngx_mail_ssl_module
- --with-cc=PATH - 指定 C 编译器的路径
- --with-cpp=PATH - 指定 C 预处理器的路径
- --with-cc-opt=OPTIONS - Additional parameters which will be added to the variable CFLAGS. With the use of the system library PCRE in FreeBSD, it is necessary to indicate --with-cc-opt="-I /usr/local/include". If we are using select() and it is necessary to increase the number of file descriptors, then this also can be assigned here: --with-cc-opt="-D FD_SETSIZE=2048".
- --with-ld-opt=OPTIONS - Additional parameters passed to the linker. With the use of the system library PCRE in - FreeBSD, it is necessary to indicate --with-ld-opt="-L /usr/local/lib".
- --with-cpu-opt=CPU - 为特定的 CPU 编译，有效的值包括：pentium, pentiumpro, pentium3, pentium4, athlon, opteron, amd64, - sparc32, sparc64, ppc64
- --without-pcre - 禁止 PCRE 库的使用。同时也会禁止 HTTP rewrite 模块。在 "location" 配置指令中的正则表达式也需要 PCRE 。
- --with-pcre=DIR - 指定 PCRE 库的源代码的路径。
- --with-pcre-opt=OPTIONS - Set additional options for PCRE building.
- --with-md5=DIR - Set path to md5 library sources.
- --with-md5-opt=OPTIONS - Set additional options for md5 building.
- --with-md5-asm - Use md5 assembler sources.
- --with-sha1=DIR - Set path to sha1 library sources.
- --with-sha1-opt=OPTIONS - Set additional options for sha1 building.
- --with-sha1-asm - Use sha1 assembler sources.
- --with-zlib=DIR - Set path to zlib library sources.
- --with-zlib-opt=OPTIONS - Set additional options for zlib building.
- --with-zlib-asm=CPU - Use zlib assembler sources optimized for specified CPU, valid values are: pentium, pentiumpro
- --with-openssl=DIR - Set path to OpenSSL library sources
- --with-openssl-opt=OPTIONS - Set additional options for OpenSSL building
- --with-debug - 启用调试日志
- --add-module=PATH - Add in a third-party module found in directory PATH