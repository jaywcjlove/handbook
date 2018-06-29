Frp内网穿透搭建
---

- 利用处于内网或防火墙后的机器，对外网环境提供 http 或 https 服务。
- 利用处于内网或防火墙后的机器，对外网环境提供 tcp 和 udp 服务，例如在家里通过 ssh 访问处于公司内网环境内的主机。
- 对于 http, https 服务支持基于域名的虚拟主机，支持自定义域名绑定，使多个域名可以共用一个80端口。


从 [GitHub](https://github.com/fatedier/frp/releases) 下载相应的服务器端和客户端。

> 服务器环境: Linux x64  
> 客户端 Mac/Linux 

## 服务端配置

当前使用服务器 Linux x64 ，所以在服务器下载 [frp_0.20.0_linux_amd64.tar.gz](https://github.com/fatedier/frp/releases/download/v0.20.0/frp_0.20.0_linux_amd64.tar.gz)

```bash
# frp_0.20.0_linux_amd64.tar.gz # 服务器端
# 在服务器端下载
wget https://github.com/fatedier/frp/releases/download/v0.20.0/frp_0.20.0_linux_amd64.tar.gz
# 解压压缩包
tar -xzf frp_0.20.0_linux_amd64.tar.gz
```

解压出来如下 7 个文件。

```bash
frpc # 客户端 linux 程序
frpc_full.ini # 客户端 所有配置
frpc.ini
frps # 服务端 linux 程序
frps_full.ini # 服务端 所有配置
frps.ini
LICENSE
```


## SSH配置

### 服务端配置

编辑配置信息 `frps.ini`

```bash
[common]
bind_port = 7000
# auth token
token = frpss
```

服务端配置需要有一个外网可以访问的ip，假设我的 ip 是 `140.111.185.100`, 当前服务对外端口为 `7000`

```bash
# 服务在后台运行
./frps -c frps.ini >> frps.log 2>&1 &
```

### 客户端配置

假设我的客户端是一台 linux 服务器，我想通过我的 Mac 电脑，ssh 去访问这台客户端，那么我们需要将刚才 `frp_0.20.0_linux_amd64.tar.gz` 解压出来的 `frpc.ini` 进行配置

```bash
[common]
server_addr = 140.111.185.100 # 服务端对外 IP
server_port = 7000 # 服务端口号
token = frpss # 保持跟服务端一直的 token

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000 # 服务器端对外提供本机服务的端口号
```

配置好之后运行

```bash
# 客户端服务在后台运行
./frpc -c frpc.ini >> frpc.log 2>&1 &
```

### 外网测试

我们通过 (C)电脑，访问 frp (A)服务器，跳转到 (B) 客户端进行访问

```bash
ssh root@140.111.185.100 -p 6000
```


## web 配置

本地机器没有公网 IP，通过有外网 IP 的服务器，访问本地机器服务。

### 服务端配置

服务端暴露出两个端口号，7000 为 frp 服务端口号，7200 为 http 代理端口号，确保两个端口号没有被防火墙拦截。

```bash
[common]
bind_port = 7000
# auth token
token = token123
subdomain_host = domain.cn # 自定义域名
vhost_http_port = 7200 # 服务端web端口

# 浏览器查看 frp 的状态以及代理统计信息展示
dashboard_port = 7100
dashboard_user = admin
dashboard_pwd = admin123
```

服务端 frps 启动

```bash
# 服务在后台运行
./frps -c frps.ini >> frps.log 2>&1 &
```

### 客户端配置

```bash
[common]
server_addr = 140.111.185.100 # 服务端IP地址
server_port = 7000 # 服务端 frpc 服务端口号
token = wcj

[web]
type = http
local_port = 9981 # 本地服务 端口号
subdomain = test # 分配一个二级域名
```

客户端 frpc 启动

```bash
# 服务在后台运行
./frpc -c frpc.ini >> frpc.log 2>&1 &
```

启动完成之后，根据分配的二级域名来访问 `http://test.domain.cn:7200`