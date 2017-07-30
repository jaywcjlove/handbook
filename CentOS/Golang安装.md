Golang安装
---

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
export GOPATH=$HOME/gopath
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