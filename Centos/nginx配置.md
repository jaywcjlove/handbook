
nginx配置
---

检查配置

```bash
/usr/local/nginx-1.5.1/sbin/nginx -t
```

热加载配置

```bash
/usr/local/nginx-1.5.1/sbin/nginx -s reload
```

## Nginx配置文件

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