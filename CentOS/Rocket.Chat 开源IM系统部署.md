Rocket.Chat 开源IM系统部署
===

以下教程是在 `CentOS Linux release 7.2.1511 (Core)` 下安装 `Rocket.Chat`，可以通过官方教程安装在这里：[Deploying Rocket.Chat on Centos 7](https://rocket.chat/docs/installation/manual-installation/centos/)。

主要依赖三个工具 `Nginx`、`CentOS 7`、`Mongodb`


## 安装步骤

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

```bash
cd /opt
curl -L https://download.rocket.chat/stable -o rocket.chat.tgz
# 解压 rocket.chat.tgz
tar zxvf rocket.chat.tgz
mv bundle Rocket.Chat
cd Rocket.Chat/programs/server
npm install
cd ../..
```

直接在命令行中运行下面命令，配置 `PORT`, `ROOT_URL` 和 `MONGO_URL`:

```bash
export PORT=9666
export ROOT_URL=http://192.168.188.223:9666/
export MONGO_URL=mongodb://localhost:27017/rocketchat
```

将9666替换为您选择的端口。
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

使用上面的连接地址 `http://192.168.188.223:9666/`在浏览器中打开，点击`注册新账号`，输入`管理员姓名`，`电子邮件`，`两次密码`，如下：

```bash
姓名：admin
电子邮件：admin@admin.com
密码：test1234
```

点击提交，系统会提示你选择一个用户，直接选择管理员，点击使用此用户名继续。