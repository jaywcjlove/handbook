Golang安装
---

安装之前需要了解及新建几个必要的文件目录：

- GOROOT 目录，该目录为解压压缩包所存放的目录。（建议 linux 环境解压到 /usr/local 目录，windows 环境解压到 C:\ProgramFiles 目录）
- 新建 GOPATH 目录，即为我们的“工作目录”，该目录可以有多个，建议只设置一个。
- 在 GOPATH 目录下新建 src 目录，该目录用于存放第三方库源码，以及存放我们的项目的源码。
- 在 GOPATH 目录下新建 bin 目录，该目录用于存放项目中所生成的可执行文件。
- 在 GOPATH 目录下新建 pkg 目录，该目录用于存放编译生成的库文件。


CentOS7 可以只用使用yum安装

```bash
yum install golang  
```

源码安装

```bash
wget https://storage.googleapis.com/golang/go1.8.linux-amd64.tar.gz
tar zxvf go1.8.linux-amd64.tar.gz -C /usr/local
```

新建GOPATH目录

```bash
mkdir -p $HOME/gopath
```

编辑 `vim /etc/profile` 添加环境变量。

```bash
export GOROOT=/usr/local/go
export GOBIN=$GOROOT/bin
export PATH=$PATH:$GOBIN
export GOPATH=$HOME/wwwroot/gofile
```

使其立即生效

```bash
source /etc/profile
```


其它命令

```bash
cat $GOROOT/VERSION  # 查看版本
$GOROOT/src/all.bash # 测试用例正确
```


