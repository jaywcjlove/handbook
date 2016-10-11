# Nginx 安装


Linux系统：`Centos 6.5 x64`
Nginx版本：`1.7.8`

## 安装prce和openssl

> prce(重定向支持)和openssl(https支持，如果不需要https可以不安装。)

```bash
yum -y install pcre*
yum -y install openssl*
```

CentOS 6.5 我安装的时候是选择的“基本服务器”，默认这两个包都没安装全，所以这两个都运行安装即可。

## 下载nginx

```bash
wget http://nginx.org/download/nginx-1.7.8.tar.gz

# 如果没有安装wget
# 下载已编译版本
$ yum install wget
```

然后进入目录编译安装

```bash
cd nginx-1.7.8
./configure --prefix=/usr/local/nginx-1.5.1 \
--with-http_ssl_module --with-http_spdy_module \
--with-http_stub_status_module --with-pcre
```

如果没有error信息，就可以执行下边的安装了：

```bash
make
make install
```

# 开启nginx进程

```bash
# 启动
/usr/local/nginx-1.7.8/sbin/nginx

# 重启
/usr/local/nginx-1.7.8/sbin/nginx -s reload

# 关闭进程
/usr/local/nginx-1.7.8/sbin/nginx -s stop
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