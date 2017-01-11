
Centos7中修改ssh端口号的方法
===

## 查看端口

```bash
netstat -tnlp           # 查看端口
netstat -tnlp |grep ssh # 查看ssh端口

tcp        0      0 0.0.0.0:22    0.0.0.0:*       LISTEN      986/sshd
tcp6       0      0 :::22         :::*            LISTEN      986/sshd
```


## 修改端口

```bash
vi /etc/ssh/sshd_config
#Port 22        # 这行去掉#号
Port 5222       # 下面添加这一行
```

修改SELinux

```bash
# 修改SELinux
# 使用以下命令查看当前SElinux 允许的ssh端口：
semanage port -l | grep ssh

# 添加20000端口到 SELinux
semanage port -a -t ssh_port_t -p tcp 5222

# 然后确认一下是否添加进去
semanage port -l | grep ssh

# 如果成功会输出
ssh_port_t       tcp    5222, 22
```

重启ssh

```bash
systemctl restart sshd.service
```

不过上述方法仅仅是在ssh中设置端口,还要在防火墙firewalld中放行才是

### 另一种方法

```bash
# 还有一种办法直接关掉， 执行下面三条命令
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
grep SELINUX=disabled /etc/selinux/config
setenforce 0
```


### 修改防火墙

```bash
# 编辑文件/etc/sysconfig/iptables 添加下面这行
-A INPUT -p tcp -m state --state NEW -m tcp --dport 2218 -j ACCEPT
```


重启iptables

```bash
systemctl stop iptables
systemctl start iptables
systemctl status iptables
```

重启sshd

```bash
systemctl status sshd
```
