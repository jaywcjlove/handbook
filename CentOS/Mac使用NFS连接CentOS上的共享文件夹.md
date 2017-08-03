Mac使用NFS连接CentOS上的共享文件夹
---

首先使用下面命令确认依赖的软件是否安装

```bash
rpm -qa|grep nfs
rpm -qa|grep portmap
# centos7中的已经将名字改成rpcbind了。
rpm -qa|grep rpcbind
```

两条命令检测是否已安装NFS，如果有就会有输出结果，没有就需要运行命令安装下面两个软件。

```bash
yum install -y nfs-utils portmap
# 或者rpcbind，centos7中的已经将名字改成rpcbind了
yum install -y nfs-utils rpcbind
```

在CentOS设置共享目录，把该目录开放给`192.168.188.164`，编辑 `/etc/exports`，增加一行

```bash
/root/wwwroot 192.168.188.164(rw,subtree_check,insecure,nohide) 
```

## Mac端配置

挂载共享目录

```bash
sudo mount -t nfs 192.168.99.100:/root/wwwroot ~/centos_share
```

卸载共享目录

```bash
sudo umout ~/centos_share
```

查看共享主机状态


```bash
showmount -e 192.168.99.100

Exports list on 192.168.99.100:
/root/wwwroot                       192.168.99.1 192.168.188.164
```


```bash
showmount -e　　　# 默认查看自己共享的服务，前提是要DNS能解析自己
showmount -a　　　# 显示已经与客户端连接上的目录信息
```