
安装node.js
---

给大家介绍在 Centos7 上安装Node.js的方法。

## 登陆Centos

终端登录 `$ ssh root@192.168.0.23` IP可以是局域网内或者公网IP。

## 下载node 

根据你的系统，在官网找到 https://nodejs.org/en/download/ 你需要下载的版本。比如我选择的 Linux Binaries (x86/x64) **64bit** ，点击右键将你需要的版本连接地址复制出来，通过命令下载nodejs安装压缩包。

```bash
$ wget https://nodejs.org/dist/v4.4.4/node-v4.4.4-linux-x64.tar.xz
```

如果你 **wget** 命令不存在，可以通过 **yum install wget** 命令安装下载工具 **wget** 。如果你是最小版本的 centos 需要安装 **yum -y install gcc make gcc-c++ openssl-devel wget**

## 解压安装


```bash
# 没有用到`gzip`压缩去掉`z`参数
$ sudo tar --strip-components 1 -xzvf node-v* -C /usr/local
```

## 查看安装

可以查看安装是否成功！一般情况安装会报错误信息，如果没有报错误信息，你可以通过调用 **node** 命令测试一下安装是否成功！

```bash
node -v  # 会输出版本信息
# v6.9.1

npm -v   # 会输出版本信息
# 3.10.8
```
