Rocket.Chat 开源IM系统部署
===

Rocket.Chat 是特性最丰富的 Slack 开源替代品之一。

主要功能：群组聊天，直接通信，私聊群，桌面通知，媒体嵌入，链接预览，文件上传，语音/视频 聊天，截图等等。Rocket.Chat 原生支持 Windows，Mac OS X ，Linux，iOS 和 Android 平台。Rocket.Chat 通过 hubot 集成了非常流行的服务，比如 GitHub，GitLab，Confluence，JIRA 等等。

高级的特性包括：OTR 消息，XMPP 多用户聊天，Kerberos 认证，p2p 文件分享等等。

以下教程是在 `CentOS Linux release 7.2.1511 (Core)` 下安装 `Rocket.Chat`，可以通过官方教程安装在这里：[Deploying Rocket.Chat on Centos 7](https://rocket.chat/docs/installation/manual-installation/centos/)。

主要依赖三个工具 `Nginx`、`CentOS 7`、`Mongodb`

![](img/screenshot.png)

<!--idoc:ignore:start-->
<!-- TOC -->

- [安装依赖步骤](#安装依赖步骤)
- [安装Mongodb数据库](#安装mongodb数据库)
- [安装Rocket.Chat](#安装rocketchat)
- [启动服务](#启动服务)
- [开机启动](#开机启动)
- [更新升级](#更新升级)
- [错误处理](#错误处理)

<!-- /TOC -->
<!--idoc:ignore:end-->

## 安装依赖步骤

添加epel存储库并更新所有内容。

```bash
yum -y install epel-release && yum -y update
```

一般情况下，新系统自带`curl`工具，没有的话你需要安装，后面会用到，如下：

```bash
yum install -y curl
```

安装 `node.js` 和 `npm`

```bash
yum install -y nodejs npm
# node版本很重要需要安装`n`来切换版本
npm install -g inherits n
# 切换node版本, 很重要
n 4.8.4
```

安装meteor

```bash
curl https://install.meteor.com | sh
```

## 安装Mongodb数据库

安装使用`Mongodb`，先添加 `yum repo`

```bash
vi /etc/yum.repos.d/mongodb.repo
```

复制下面内容，保存并退出`:wq`

```bash
[mongodb]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
gpgcheck=0
enabled=1
```

安装图形库以及`Mongodb`数据库

```bash
yum install -y GraphicsMagick mongodb-org-server mongodb-org gcc-c++
```

提前配置数据库

```bash
# 启动MongoDB
service mongod start

# 连接MongoDB
mongo
> use rocketchat # 添加数据库
> exit
## 重启数据库
service mongod restart
```

## 安装Rocket.Chat

安装的时候记得前面加上`sudo`

```bash
cd /opt
curl -L https://download.rocket.chat/stable -o rocket.chat.tgz
# 解压 rocket.chat.tgz
tar zxvf rocket.chat.tgz
mv bundle Rocket.Chat
cd Rocket.Chat/programs/server
# ========sudo很重要===========
sudo npm install # 记得前面加上sudo
cd ../..
```

直接在命令行中运行下面命令，配置 `PORT`, `ROOT_URL` 和 `MONGO_URL`:

```bash
export PORT=3000
export ROOT_URL=http://127.0.0.1:3000/
export MONGO_URL=mongodb://localhost:27017/rocketchat
```

将3000替换为您选择的端口，一般情况默认就好。
如果您选择使用端口80，则需要以root身份运行Rocket.Chat。
如果您没有配置DNS，请使用您的IP代替主机名。 您可以稍后在管理员菜单中进行更改。

## 启动服务

首先让Mongodb使用以下命令启动主机：

```bash
chkconfig mongod on
```

现在我们需要启动mongo：

```bash
systemctl start mongod
# CentOS 6.X
/etc/init.d/mongod start
```

尝试安装

现在让我们做一个快速测试，看看是否一切正常，然后再继续：

```bash
node main.js
```

```bash
meteor npm install --save bcrypt
```

使用上面的连接地址 `http://127.0.0.1:3000/`在浏览器中打开，点击`注册新账号`，输入`管理员姓名`，`电子邮件`，`两次密码`，如下：

```bash
姓名：admin
电子邮件：admin@admin.com
密码：test1234
```

点击提交，系统会提示你选择一个用户，直接选择管理员，点击使用此用户名继续。


```bash
Error: MONGO_URL must be set in environment
```

报`node-v46-linux-x64`不存在错误 直接更改文件夹名字就解决了。

```bash
cd /opt/Rocket.Chat/programs/server/npm/node_modules/meteor/rocketchat_google-vision/node_modules/grpc/src/node/extension_binary/
mv node-v48-linux-x64 node-v46-linux-x64/
```

## 开机启动

```bash
vi /usr/lib/systemd/system/rocketchat.service
```

将下面内容复制到上面文件中。

```
[Unit]
Description=The Rocket.Chat server
After=network.target remote-fs.target nss-lookup.target nginx.target mongod.target
[Service]
ExecStart=/usr/local/bin/node /opt/Rocket.Chat/main.js
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=rocketchat
User=root
Environment=MONGO_URL=mongodb://localhost:27017/rocketchat ROOT_URL=http://your-host-name.com-as-accessed-from-internet:3000/ PORT=3000
[Install]
WantedBy=multi-user.target
```

现在可以运行以下命令来启用此服务：

```bash
systemctl enable rocketchat.service
```

最后通过运行来启动它，你就不需要：

```bash
systemctl start rocketchat.service
```

## 更新升级

```bash
# 停止服务
systemctl stop rocketchat.service
# 进入安装目录
cd /opt/
# 删除Rocket.Chat目录，删除前记得备份哦
rm -rf Rocket.Chat
```

上面操作完成，将[安装Rocket.Chat](#安装rocketchat)步骤再操作一遍，记得数据库不要动就可以了。

## 错误处理

1. Error: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.20' not found

```bash
strings /usr/lib64/libstdc++.so.6 | grep GLIBCXX

# GLIBCXX_3.4
# ....
# GLIBCXX_3.4.15
# GLIBCXX_3.4.16
# GLIBCXX_3.4.17
# GLIBCXX_3.4.18
# GLIBCXX_3.4.19
# GLIBCXX_DEBUG_MESSAGE_LENGTH
```

发现少了GLIBCXX_3.4.20，解决方法是升级libstdc++.

```bash
yum provides libstdc++.so.6
# Loaded plugins: fastestmirror
# Loading mirror speeds from cached hostfile
#  * base: ftp.sjtu.edu.cn
#  * epel: mirrors.ustc.edu.cn
#  * extras: ftp.sjtu.edu.cn
#  * updates: ftp.sjtu.edu.cn
# libstdc++-4.8.5-16.el7.i686 : GNU Standard C++ Library
# Repo        : base
# Matched from:
# Provides    : libstdc++.so.6
# 
# libstdc++-4.8.5-16.el7_4.1.i686 : GNU Standard C++ Library
# Repo        : updates
# Matched from:
# Provides    : libstdc++.so.6
yum install libstdc++-4.8.5-16.el7_4.1.i686
```

如果上面还不能解决你的问题，需要升级 `gcc` 到 `4.9+` 的版本

```bash
sudo yum install libmpc-devel mpfr-devel gmp-devel

cd ~/Downloads
curl ftp://ftp.mirrorservice.org/sites/sourceware.org/pub/gcc/releases/gcc-4.9.2/gcc-4.9.2.tar.bz2 -O
tar xvfj gcc-4.9.2.tar.bz2

cd gcc-4.9.2
./configure --disable-multilib --enable-languages=c,c++
# 处理过程非常长 搞了两个多小时
make -j 4
make install

# 用最新的libstdc++.so.6替换旧的
sudo cp /usr/local/lib64/libstdc++.so.6 /lib64/
```

