Ruby安装
---

<!-- TOC -->

- [安装](#安装)
  - [编译安装](#编译安装)
  - [yum安装](#yum安装)
  - [RVM安装](#rvm安装)
- [卸载](#卸载)
  - [yum安装卸载](#yum安装卸载)
  - [编译安装卸载](#编译安装卸载)

<!-- /TOC -->

## 安装

### 编译安装

下载地址可以换成 [淘宝镜像](https://ruby.taobao.org/mirrors/ruby/2.4/)

```bash
sudo yum groupinstall "Development Tools"
sudo yum install openssl-devel
wget https://ruby.taobao.org/mirrors/ruby/2.4/ruby-2.4.0.tar.gz
tar xvfvz ruby-2.1.2.tar.gz
cd ruby-2.1.2
./configure
make
sudo make install

```

### yum安装

```bash
yum install ruby
```

### RVM安装

```bash
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
curl -sSL https://get.rvm.io | bash -s stable
# 如果上面的连接失败，可以尝试: 
curl -L https://raw.githubusercontent.com/wayneeseguin/rvm/master/binscripts/rvm-installer | bash -s stable

curl -L get.rvm.io | bash -s stable  
echo "source /etc/profile.d/rvm.sh" >> ~/.bashrc && source /etc/profile.d/rvm.sh  

# 安装完RVM之后，我们需要使用如下命令设置RVM运行环境。
source /etc/profile.d/rvm.sh  

# 列出rvm知道的ruby版本
rvm list known  

# 重新安装ruby 2.3.3版本
rvm install 2.3.3

# 重新安装
rvm reinstall ruby-2.3.3

# 切换要使用的ruby版本
rvm use 2.2.1

# 输出变量参数
echo "export rvm_max_time_flag=20" >> ~/.rvmrc  


# 这种方式安装
bash < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)
```

最终使用下面方式安装成功的

```bash
curl -L https://raw.githubusercontent.com/wayneeseguin/rvm/master/binscripts/rvm-installer | bash -s stable
# 安装完RVM之后，我们需要使用如下命令设置RVM运行环境。
source /etc/profile.d/rvm.sh  
```

RVM换淘宝镜像

```bash
# For Mac
sed -i .bak -E 's!https?://cache.ruby-lang.org/pub/ruby!https://ruby.taobao.org/mirrors/ruby!' $rvm_path/config/db

# For Linux
sed -i -E 's!https?://cache.ruby-lang.org/pub/ruby!https://ruby.taobao.org/mirrors/ruby!' $rvm_path/config/db
```

## 卸载

### yum安装卸载

```bash
sudo yum remove ruby ruby-devel
```

### 编译安装卸载


```bash
make uninstall
```
