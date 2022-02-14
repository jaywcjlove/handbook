部署YApi平台
---

[YApi](https://yapi.ymfe.org) 是高效、易用、功能强大的api管理平台，[开源仓库](https://github.com/YMFE/yapi)。

## 安装环境

安装 Node.js，[官方安装方法](https://nodejs.org/en/download/package-manager/)

```bash
# On RHEL, CentOS or Fedora, for Node.js v8 LTS:
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
# Alternatively for Node.js 9:
curl --silent --location https://rpm.nodesource.com/setup_9.x | sudo bash -
# 安装 Node.js
sudo yum -y install nodejs
# Enterprise Linux（RHEL和CentOS）用户可以使用EPEL存储库中的Node.js和npm包。
# 为您的版本安装相应的epel-release RPM（在EPEL存储库主页上找到），然后运行：
sudo yum install nodejs npm --enablerepo=epel
```

安装构建工具，要从npm编译和安装本地插件，您可能还需要安装构建工具：

```bash
sudo yum install gcc-c++ make
# or: sudo yum groupinstall 'Development Tools'
```

安装 MongoDB，首先创建源，创建 `mongodb.repo` 文件

```bash
# 在/etc/yum.repos.d/目录下创建文件mongodb.repo，它包含MongoDB仓库的配置信息，内容如下：
# 复制代码, 代码如下:
[mongodb]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
gpgcheck=0
enabled=1
```

yum 安装 MongoDB 

```
sudo yum install mongodb-org
```

为 YApi 初始数据库

```js
use yapi // 创建yapi数据库 
db.wong.insert({"name":"kenny wong"}) // 插入一条数据，将在数据库列表中展示
show dbs // 查看所有数据库
db.addUser('yapi','yapi321') // 老的，数据库加用户的命令

// 新的数据库添加用户命令
db.createUser(
  {
    user: "yapi",
    pwd: "yapi321",
    roles:
    [
      {
        role: "userAdminAnyDatabase",
        db: "yapi"
      }
    ]
  }
)
```

## 安装YApi

1. 创建工程目录

```bash
mkdir yapi && cd yapi
git clone https://github.com/YMFE/yapi.git vendors --depth=1 # 或者下载 zip 包解压到 vendors 目录
```

2. 修改配置

```bash
cp vendors/config_example.json ./config.json # 复制完成后请修改相关配置
vi ./config.json
```

配置如下，主要配置 MongoDB 数据库，以及 Admin 账号。

```json
{
  "port": "3011",
  "adminAccount": "admin@admin.com",
  "db": {
    "servername": "127.0.0.1",
    "DATABASE":  "yapi",
    "port": 27017,
    "user": "yapi",
    "pass": "yapi123"
  },
  "mail": {
    "enable": true,
    "host": "smtp.163.com",
    "port": 465,
    "from": "***@163.com",
    "auth": {
        "user": "***@163.com",
        "pass": "*****"
    }
  }
}
```

2. 安装依赖

```bash
cd vendors
npm install --production --registry https://registry.npmmirror.com # 安装依赖
```

3. 初始化

```bash
npm run install-server  # 安装程序会初始化数据库索引和管理员账号，管理员账号名可在 config.json 配置
# 默认输出
# 初始化管理员账号成功,账号名："admin@admin.com"，密码："ymfe.org"
```

4. 启动服务

```bash
# 后台启动，输出日志yapi.log
node server/app.js >> yapi.log 2>&1 & 
# 启动服务器后，请访问 127.0.0.1:{config.json配置的端口}，初次运行会有个编译的过程，请耐心等候
# 127.0.0.1:3011
```