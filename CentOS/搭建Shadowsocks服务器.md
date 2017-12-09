搭建Shadowsocks服务器
---

<!-- TOC -->

- [客户端](#客户端)
  - [安装shadowsocks](#安装shadowsocks)
  - [创建配置文件](#创建配置文件)
  - [多账号配置](#多账号配置)
- [服务运营管理](#服务运营管理)
  - [运行](#运行)
  - [关闭](#关闭)
  - [查看日志](#查看日志)
  - [帮助](#帮助)
- [参考文章](#参考文章)

<!-- /TOC -->

## 客户端

### 安装shadowsocks

```bash
yum install python-setuptools && easy_install pip
## pip install --upgrade pip
pip install shadowsocks
```

### 创建配置文件

`vim /etc/shadowsocks.json`  

```json
{
  "server":"your_server_ip",
  "server_port":8388,
  "password":"yourpassword",
  "timeout":300,
  "method":"aes-256-cfb",
  "fast_open":false,
  "workers": 1
}
```

代码中各字段的含义

- server：服务器 IP地址 (IPv4/IPv6)
- server_port：服务器监听的端口，一般设为80，443等，注意不要设为使用中的端口
- password：设置密码，自定义
- timeout：超时时间（秒）
- method：加密方法，可选择 “aes-256-cfb”, “rc4-md5”等等。推荐使用 “rc4-md5”
- fast_open：true 或 false。如果你的服务器 Linux 内核在3.7+，可以开启 fast_open 以降低延迟。
- workers：workers数量，默认为 1。

### 多账号配置

```json
{
  "server":"your_server_ip",
  "port_password":{
    "8381":"pass1",
    "8382":"pass2",
    "8383":"pass3",
    "8384":"pass4"
  },
  "timeout":60,
  "method":"rc4-md5",
  "fast_open":false,
  "workers":1
}
```

## 服务运营管理

### 运行

```bash
ssserver -c /etc/shadowsocks.json -d start
# 或不需要配置文件
sudo ssserver -p 443 -k password -m rc4-md5 --user nobody -d start

# 关闭防火墙
systemctl stop firewalld.service
```

### 关闭

```bash
ssserver -d stop
```

### 查看日志

```bash
less /var/log/shadowsocks.log
```

### 帮助

```bash
ssserver -h
```

## 参考文章

- [架设高性能shadowsocks服务器](http://yanyu.farbox.com/post/build-high-performance-shadowsocks-server)
- [Shadowsocks 使用说明](https://github.com/shadowsocks/shadowsocks/wiki/Shadowsocks-%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)
- [Shadowsocks & finalspeed 服务端搭建](https://github.com/ucoker/finalspeed#shadowsocks-installation)
