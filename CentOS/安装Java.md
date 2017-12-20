CentOS7安装JAVA
---

## 卸载老版本

```bash
# 更新系统软件
yum update
# 查找系统已安装的jdk组件
rpm -qa | grep -E '^open[jre|jdk]|j[re|dk]'
# 查看java版本
java -version
# 卸载以前已有的jdk
yum remove java-1.6.0-openjdk
yum remove java-1.7.0-openjdk
```

## 安装

```
mkdir /usr/java
```

在 [Java SE Downloads](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 页面下载 [JRE](http://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) 版本，这里面有rpm版本，rpm可以通过yum简单安装。这是[linux-x64 Java 7 JRE](http://download.oracle.com/otn-pub/java/jdk/7u79-b15/jre-7u79-linux-x64.rpm)

```bash
wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" "http://download.oracle.com/otn-pub/java/jdk/8u121-b13/e9e7ea248e2c4826b92b3f075a80e441/jre-8u121-linux-x64.rpm"
```

下载完成，通过yum本地安装。

```bash
sudo yum localinstall jre-8u121-linux-x64.rpm
```

安装完成，查看版本

```bash
java -version
# java version "1.8.0_121"
# Java(TM) SE Runtime Environment (build 1.8.0_121-b13)
# Java HotSpot(TM) 64-Bit Server VM (build 25.121-b13, mixed mode)
```

