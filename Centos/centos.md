# 下载

[www.centos.org](https://www.centos.org/)


http://mirror.neu.edu.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://centos.ustc.edu.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.163.com/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.hust.edu.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.zju.edu.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.cqu.edu.cn/CentOS/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.cug.edu.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.neusoft.edu.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.skyshe.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.aliyun.com/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.nwsuaf.edu.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirror.bit.edu.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirror.lzu.edu.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://ftp.sjtu.edu.cn/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.yun-idc.com/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 
http://mirrors.pubyun.com/centos/7/isos/x86_64/CentOS-7-x86_64-Minimal-1511.iso 


# 登录

username:root  
password:安装时设置的密码  

其它终端登录 `$ ssh root@192.168.0.23`  

# centos常用命令

`ip link`或者`ip -s link` 查看网络接口统计数据  
`yum install net-tools` net-tools包提供了ifconfig命令  
`ifconfig -a` 查看IP地址  
`ip addr` 查看IP地址   
`route -n` 使用最快的速度查找主机的路由  


`cat /proc/version` 查看系统信息  
    `uname -a` 方法二  
    `uname -r`方法三  
`getconf LONG_BIT` 查看系统是64位还是32位  


`uname -a`查看内核/操作系统/CPU信息  
`head -n 1 /etc/issue`查看操作系统版本  
`cat /proc/cpuinfo`查看CPU信息  
`hostname`查看计算机名  
`lspci -tv`列出所有PCI设备  
`lsusb -tv`列出所有USB设备  
`lsmod`列出加载的内核模块  
`env`查看环境变量  
`arch` 显示机器的处理器架构(1)  
`uname -m` 显示机器的处理器架构(2)  
`uname -r` 显示正在使用的内核版本  
`dmidecode -q` 显示硬件系统部件  
`hdparm -i /dev/hda` 罗列一个磁盘的架构特性  
`hdparm -tT /dev/sda` 在磁盘上执行测试性读取操作  
`cat /proc/interrupts` 显示中断  
`cat /proc/meminfo` 校验内存使用  
`cat /proc/swaps` 显示哪些swap被使用  
`cat /proc/version` 显示内核的版本  
`cat /proc/net/dev` 显示网络适配器及统计  
`cat /proc/mounts` 显示已加载的文件系统  
`lspci -tv` 罗列 PCI 设备  
`lsusb -tv` 显示 USB 设备  
`date` 显示系统日期  
`cal 2007` 显示2007年的日历表  
`date 041217002007.00` 设置日期和时间 – 月日时分年.秒  
`clock -w` 将时间修改保存到 BIOS  

## 系统的关机、重启以及登出 

`shutdown -h now`关闭系统(1)   
`init 0` 关闭系统(2)   
`telinit 0` 关闭系统(3)   
`shutdown -h hours:minutes & `按预定时间关闭系统   
`shutdown -c `取消按预定时间关闭系统   
`shutdown -r now` 重启  (1)   
`reboot `重启  (2)   
`logout` 注销  

## 如何查看linux系统资源

`free -m` 查看内存使用量和交换区使用量   
`df -h` 查看各分区使用情况   
`du -sh <目录名>` 查看指定目录的大小   
`grep MemTotal /proc/meminfo` 查看内存总量   
`grep MemFree /proc/meminfo` 查看空闲内存量   
`uptime` 查看系统运行时间、用户数、负载   
`cat /proc/loadavg` 查看系统负载  

## 如何查看linux磁盘和分区

`mount | column -t` 查看挂接的分区状态   
`fdisk -l` 查看所有分区   
`swapon -s` 查看所有交换分区   
`hdparm -i /dev/hda` 查看磁盘参数(仅适用于IDE设备)   
`dmesg | grep IDE` 查看启动时IDE设备检测状况  

## 查看网络配置的命令

`ifconfig` 查看所有网络接口的属性   
`iptables -L` 查看防火墙设置   
`route -n` 查看路由表   
`netstat -lntp` 查看所有监听端口   
`netstat -antp` 查看所有已经建立的连接   
`netstat -s` 查看网络统计信息  

## 查看linux进程

`ps -aux | grep node` 查看`node`进程  
`ps -ef` 查看所有进程   
`top` 实时显示进程状态  

## 杀进程

`killall -9 websocket` 干掉`websocket`服务进程  
`ps aux | grep mysql` 查看mysql进程  
`kill -9 35562` 根据进程号杀  

## 查看用户的命令

`w` 查看活动用户   
`id <用户名>` 查看指定用户信息   
`last` 查看用户登录日志   
`cut -d: -f1 /etc/passwd` 查看系统所有用户   
`cut -d: -f1 /etc/group` 查看系统所有组   
`crontab -l` 查看当前用户的计划任务  

## log日志查看

```bash
cat /var/log/messages # 查询日志的全部内容
head -5 /var/log/messages # 查询日志的前5行
tail -5 /var/log/messages # 查询日志的最新5行
sed -n '5,10p' /var/log/messages # 查询日志的5到10行
```

## 查看系统服务的命令

`chkconfig –list` 列出所有系统服务   
`chkconfig –list | grep on` 列出所有启动的系统服务  

## 安装程序的命令

`rpm -qa` 查看所有安装的软件包  

## 获取帮助的命令

`man <命令>` 获得命令帮助  


# 安装node


```bash
# 下载已编译版本
$ yum install wget

# 解压
$ wget https://nodejs.org/dist/v4.4.4/node-v4.4.4-linux-x64.tar.xz
       https://nodejs.org/dist/v4.4.5/node-v4.4.5-linux-x64.tar.xz

# 测试安装
# 没有用到`gzip`压缩去掉`z`参数
$ sudo tar --strip-components 1 -xzvf node-v* -C /usr/local
```


# 安装nginx


下载对应当前系统版本的nginx包(package)

```
$ wget  http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
```

## 建立nginx的yum仓库

```bash
$ rpm -ivh nginx-release-centos-7-0.el7.ngx.noarch.rpm
```

## 下载并安装nginx

```bash
# 查看 nginx 版本
$ yum list | grep nginx

# 安装 nginx
$ yum install nginx
```

## 启动nginx服务

```bash
systemctl start nginx
```

# yum错误

yum错误：Cannot retrieve repository metadata (repomd.xml) for repository解决方法

```bash
cd /etc/yum.repos.d/
ls
```

找到`yum.repos.d`这个目录，里面有个文件，以`.repo` 结尾的，例如`zl.repo`删除  
然后`#yum clean all`  
