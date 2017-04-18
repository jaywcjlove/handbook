CentOS7中Python2升级到Python3
===

从Python官网到获取[Python3](https://www.python.org/ftp/python/3.6.1/)的包， 切换到目录`/usr/local/src`。

```bash
wget https://www.python.org/ftp/python/3.6.1/Python-3.6.1.tar.xz
```

使用命令如下命令进行解压缩

```bash
xz -d Python-3.6.1.tar.xz
tar -xf Python-3.6.1.tar
```

在`/usr/local`路径下创建目录`--python3.6`， 为第4步的安装目录

```
mkdir /usr/local/python3.6.1
```

编译安装(会自动安装pip-7.1.2)

```bash
cd /usr/local/src/Python-3.6.1
# ./configure --prefix=/usr/local/python3.6.1
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
