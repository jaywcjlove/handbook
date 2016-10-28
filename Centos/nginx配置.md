
nginx配置
---

Nginx 是一款面向性能设计的 HTTP 服务器，能反向代理 HTTP，HTTPS 和邮件相关(SMTP，POP3，IMAP)的协议链接。并且提供了负载均衡以及 HTTP 缓存。它的设计充分使用异步事件模型，削减上下文调度的开销，提高服务器并发能力。采用了模块化设计，提供了丰富模块的第三方模块。

所以关于 Nginx，有这些标签：「异步」「事件」「模块化」「高性能」「高并发」「反向代理」「负载均衡」

## 配置检查加载

检查配置

```bash
/usr/local/nginx-1.5.1/sbin/nginx -t
```

热加载配置

```bash
/usr/local/nginx-1.5.1/sbin/nginx -s reload
```

## Nginx配置文件

nginx 的配置系统由一个主配置文件和其他一些辅助的配置文件构成。这些配置文件均是纯文本文件，全部位于 nginx 安装目录下的 conf 目录下。

指令由 nginx 的各个模块提供，不同的模块会提供不同的指令来实现配置。
指令除了 Key-Value 的形式，还有作用域指令。

nginx.conf 中的配置信息，根据其逻辑上的意义，对它们进行了分类，也就是分成了多个作用域，或者称之为配置指令上下文。不同的作用域含有一个或者多个配置项。

下面的这些上下文指令是用的比较多：

| Directive |  Description | Contains Directive |
| ---- | ---- | ---- |
| main  |  nginx 在运行时与具体业务功能（比如 http 服务或者 email 服务代理）无关的一些参数，比如工作进程数，运行的身份等。 | user, worker_processes, error_log, events, http, mail |
| http  |  与提供 http 服务相关的一些配置参数。例如：是否使用 keepalive 啊，是否使用 gzip 进行压缩等。 |  server |
| server | http 服务上支持若干虚拟主机。每个虚拟主机一个对应的 server 配置项，配置项里面包含该虚拟主机相关的配置。在提供 mail 服务的代理时，也可以建立若干 server. 每个 server 通过监听的地址来区分。| listen, server_name, access_log, location, protocol, proxy, smtp_auth, xclient |
| location  |  http 服务中，某些特定的 URL 对应的一系列配置项。  | index, root |
| mail | 实现 email 相关的 SMTP/IMAP/POP3 代理时，共享的一些配置项（因为可能实现多个代理，工作在多个监听地址上）。 | server, http, imap_capabilities |

在Centos 默认配置文件在 /usr/local/nginx-1.5.1/conf/nginx.conf 我们要在这里配置一些文件。例如我们再 nginx.conf 里面引用两个配置 vhost/example.com.conf 和 vhost/gitlab.com.conf 它们都被放在一个我自己新建的目录 vhost 下面。nginx.conf 配置如下：

```
worker_processes  1;
events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
    include  vhost/example.com.conf;
    include  vhost/gitlab.com.conf;
}
```


简单的配置: example.com.conf

```
server {
    #侦听的80端口
    listen       80;
    server_name  baidu.com app.baidu.com; # 这里指定域名
    index        index.html index.htm;    # 这里指定默认入口页面
    root /home/www/app.baidu.com;         # 这里指定目录
}
```

复杂的配置: gitlab.com.conf

```
upstream  gitlab {
     server xxx.xxx.xxx.xxx:8081 ;
}
server {
    #侦听的80端口
    listen       80;
    server_name  git.example.cn;
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