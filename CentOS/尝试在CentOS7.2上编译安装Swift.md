尝试在CentOS7.2上编译安装Swift
---

苹果提供 [Ubuntu上构建Swift](https://github.com/apple/swift/blob/master/README.md) 的教程，通过这个教程我尝试使用`CentOS7.2`上玩儿一把。目前已经成功在CentOS7.2上班成功安装 `swift 4.0`

```bash
swift --version
Swift version 4.0-dev
Target: x86_64-unknown-linux-gnu
```

<!-- TOC -->

- [安装依赖](#安装依赖)
- [下载Swift的源代码](#下载swift的源代码)
- [编译安装ninja](#编译安装ninja)
- [编译Swift编译器](#编译swift编译器)
- [HellWorld](#hellworld)
- [Web框架](#web框架)

<!-- /TOC -->

## 安装依赖

```bash
yum install -y git clang gcc-c++ uuid-devel libicu-devel icu libedit-devel libxml2-devel sqlite-devel swig python-devel ncurses-libs ncurses-devel pkgconfig libuuid-devel epel-release libbsd-devel 
```

更新CMake

对 `CMake 3.4.3` 版本有要求，必须比 `CMake 3.4.3` 高。[CMake官网](https://cmake.org/download/)

```bash
# 下载
wget https://cmake.org/files/v3.9/cmake-3.9.0.tar.gz
# 解压
tar -zxvf cmake-3.9.0.tar.gz
cd cmake-3.9.0
./bootstrap --prefix=/usr
make
sudo make install
```

## 下载Swift的源代码

打开 https://swift.org/source-code/#cloned-repositories 找到 `Cloned Repositories` 创建 `mkdir -p /usr/local/swift && cd /usr/local/swift` 目录并进入`swift`

```bash
# 下载 swift-llvm
wget https://github.com/apple/swift-llvm/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz -P llvm
tar -zxvf swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz -C src/llvm
# 下载 swift-clang
wget https://github.com/apple/swift-clang/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz -P clang
# 下载 swift-lldb
wget https://github.com/apple/swift-lldb/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz -P lldb
# 下载 swift-cmark
wget https://github.com/apple/swift-cmark/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz -P cmark
# 下载 swift
wget https://github.com/apple/swift/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz -P swift
# 下载 ninja
wget https://github.com/ninja-build/ninja/archive/v1.7.2.tar.gz -P ninja
```

上面采用 开发板编译花了三个小时，后面用 released 版本编译，警告少了许多，而且编译快了相当多呢，所以你需要选择一个稳定的 released 版本安装。

```bash
wget https://github.com/ninja-build/ninja/archive/v1.7.2.tar.gz -P ninja
wget https://github.com/apple/swift/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz  -P swift
wget https://github.com/apple/swift-cmark/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz  -P cmark
wget https://github.com/apple/swift-lldb/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz -P lldb
wget https://github.com/apple/swift-clang/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz -P clang
wget https://github.com/apple/swift-llvm/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-29-a.tar.gz -P llvm

wget https://github.com/apple/swift-corelibs-libdispatch/archive/swift-DEVELOPMENT-SNAPSHOT-2017-07-30-a.tar.gz -P swift-corelibs-libdispatch 
```

安装之后的目录结构

```bash
swift/
└── src
    ├── clang
    ├── cmark
    ├── lldb
    ├── llvm
    ├── ninja
    ├── swift-corelibs-libdispatch 
    └── swift
```

## 编译安装ninja

```bash 
yum install re2c -y # re2c 是一个用于编写快速灵活的词法分析器的工具
```

编译

```bash
./configure.py --bootstrap
cp ninja /usr/local/bin/
```


## 编译Swift编译器

在文件 `vi /etc/profile` 添加下面代码，添加完成之后，`source /etc/profile` 更改立即生效。

```bash
export SWIFT_SOURCE_ROOT=/usr/local/swift/src
```

进入`cd /usr/local/swift/src/swift/utils/` 目录，运行脚本

```bash
# ./build-script -R
# 上面命令会报错，建议使用下面命令
# https://github.com/apple/swift/pull/3594#issuecomment-234169759

./build-script --libdispatch
./build-script --libdispatch --extra-cmake-options="-DSWIFT_BUILD_SOURCEKIT:BOOL=TRUE"
```

`swap`区不够大的原因。导致`clang++ kernel opps`

```bash
clang: error: unable to execute command: Killed
clang: error: linker command failed due to signal (use -v to see invocation)
```

请加大分区：

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

开机自动挂载swap：
使用 vi 或 nano 在 /etc/fstab 文件底部添加如下内容：

```bash
/swapfile none swap sw 0 0
```

**libatomic不存在**

```bash
# 错误
/usr/bin/ld: cannot find /usr/lib64/libatomic.so.1.0.0
```

解决办法，[building swift on centos](https://stackoverflow.com/questions/34234250/building-swift-on-centos)。

```bash
# 下载
# 这里https://pkgs.org/download/libatomic找对应的rpm下载地址
wget --no-check-certificate -O /etc/yum.repos.d/libatomic-4.8.5-11.el7.x86_64.rpm ftp://ftp.pbone.net/mirror/ftp.centos.org/7.3.1611/os/x86_64/Packages/libatomic-4.8.5-11.el7.x86_64.rpm

# 安装
rpm -ivh libatomic-4.8.5-11.el7.x86_64.rpm
```

编译完成，设置环境信息 `vi ~/.bash_profile`

```bash
PATH=$PATH:/usr/local/swift/src/build/Ninja-ReleaseAssert/swift-linux-x86_64/bin
```

立即生效`source ~/.bash_profile`

## HellWorld

添加 `touch ~/HelloWorld.swift` 文件，添加下面代码测试

```swift
print("Hello world!")
```

编译 `swift` 文件

```bash
swiftc ~/HelloWorld.swift -o ~/Hello
```

运行 ` ~/Hello` 输出 `Hello world!`

大功告成！

## Web框架

- [Vapor](https://github.com/vapor/vapor)
- [Perfect](https://github.com/PerfectlySoft/Perfect)
- [Kitura](https://github.com/IBM-Swift/Kitura)
- [Zewo](https://github.com/Zewo/Zewo)