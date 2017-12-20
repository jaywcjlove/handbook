CentOS7中Python2升级到Python3
===


## 编译安装

从Python官网到获取[Python3](https://www.python.org/ftp/python/3.6.1/)的包， 切换到目录`/usr/local/src`。

```bash
wget https://www.python.org/ftp/python/3.6.1/Python-3.6.1.tar.xz
```

使用命令如下命令进行解压缩

```bash
xz -d Python-3.6.1.tar.xz
tar -xf Python-3.6.1.tar
```

在`/usr/local`路径下创建目录`python3.6.1`

```
mkdir /usr/local/python3.6.1
```

编译安装(会自动安装pip-7.1.2)

```bash
cd /usr/local/src/Python-3.6.1
# ./configure --prefix=/usr/local/python3.6.1 --enable-shared 
# make all
# make install
# make clean
# make distclean
```

进入安装的绝对路径，检查是否安装成功

```bash
/usr/local/python3.6/bin/python3.6 -V
Python 3.6.1
```

修改软连接，启动python时指向`python3.6`

```bash
# 备份python
mv /usr/bin/python /usr/bin/python3.6.1

# 修改软连接
sudo ln -s /usr/local/python3.6.1/bin/python3 /usr/bin/python
```


## 多版本共存pyenv

此时需要在系统中安装多个 Python，但又不能影响系统自带的 Python，即需要实现 Python 的多版本共存。 [pyenv](https://github.com/pyenv/pyenv) 就是这样一个 Python 版本管理器。

在终端执行如下命令以安装 pyenv 及其插件：

```
curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash
```

安装完成后会提示将下面三行配置，根据提示将如下语句加入到 ~/.bash_profile 或者 ~/.bashrc 中:

```bash
export PATH="/root/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

查看可安装的版本

```bash
pyenv install --list
```

### 安装依赖包

在编译 Python 过程中会依赖一些其他库文件，因而需要首先安装这些库文件，已知的一些需要预先安装的库如下。

在 CentOS/RHEL/Fedora 下:

```bash
sudo yum install readline readline-devel readline-static
sudo yum install openssl openssl-devel openssl-static
sudo yum install sqlite-devel
sudo yum install bzip2-devel bzip2-libs
```

在 Ubuntu下：

```bash
sudo apt-get update
sudo apt-get install make build-essential libssl-dev zlib1g-dev
sudo apt-get install libbz2-dev libreadline-dev libsqlite3-dev wget curl
sudo apt-get install llvm libncurses5-dev libncursesw5-dev
```

### 安装指定版本

用户可以使用 `pyenv install` 安装指定版本的 python。如果你不知道该用哪一个，推荐你安装 anaconda3 的最新版本，这是一个专为科学计算准备的发行版。

```bash
$ pyenv install 3.6.1 -v
/tmp/python-build.20170108123450.2752 ~
Downloading 3.6.1.sh...
-> https://repo.continuum.io/archive/3.6.1.sh
```

安装过程中

### 其它操作

```bash
# 更新数据库
pyenv rehash
# 在安装 Python 或者其他带有可执行文件的模块之后，需要对数据库进行更新

# 查看当前已安装的 python 版本
pyenv versions
# * system (set by /home/seisman/.pyenv/version)
# 3.6.1

# 设置全局的 python 版本
pyenv global 3.6.1
#   system
# * 3.6.1 (set by /root/.pyenv/version)
# 当前全局的 python 版本已经变成了 3.6.1。
# 也可以使用 pyenv local 或 pyenv shell 临时改变 python 版本。

pyenv uninstall # 卸载某个版本
pyenv update    # 更新 pyenv 及其插件
```

使用python注意 ⚠️

- 输入 python 即可使用新版本的 python；
- 系统自带的脚本会以 /usr/bin/python 的方式直接调用老版本的 python，因而不会对系统脚本产生影响；
- 使用 pip 安装第三方模块时会自动按照到当前的python版本下，不会和系统模块发生冲突。
- 使用 pip 安装模块后，可能需要执行 pyenv rehash 更新数据库；


## 错误处理

⚠️ 注意：

```bash
ERROR: found static Python library (/usr/local/python3.6.1/lib/python3.6/config-3.6m-x86_64-linux-gnu/libpython3.6m.a) but a dynamic one is required. You must use a Python compiled with the --enable-shared flag. If using pyenv, you need to run the command:
  export PYTHON_CONFIGURE_OPTS="--enable-shared"
before installing a Python version.
```

通过工具pyenv 来解决

```bash
pyenv uninstall 3.6.1

env PYTHON_CONFIGURE_OPTS="--enable-shared" pyenv install 3.6.1
```
