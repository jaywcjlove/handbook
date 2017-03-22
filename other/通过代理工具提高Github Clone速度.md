今天克隆速度极为慢，搜了一下原来不止我一个人慢，下面三种方法提速，我折腾了一下，之前一直clone 不下来，现在我居然clone下来了，蛋蛋好疼。

## 第三方中转Clone

借助[coding.net](https://coding.net)的 git 导入功能，通过git服务器clone你要下载的项目，再从 coding.net 上面下载下来。这是最方便，速度最快的方法。

## 使用翻墙代理

首先你要有代理工具，获取 socks5 的代理地址，通过git的内置工具设置代理地址，`127.0.0.1:9742` 这个是我的工具给我分配的端口号码。

```
git config --global http.proxy socks5://127.0.0.1:9742
git config --global https.proxy socks5://127.0.0.1:9742
```

也可以直接修改配置文件 `sudo vi ~/.gitconfig` ，摁`i`进入编辑模式，在最下面添加一段配置代码，按`Esc`退出编辑模式，输入:wq保存并退出。

```
[http]
    proxy = socks5://127.0.0.1:9742 
[https]
    proxy = socks5://127.0.0.1:9742 
```

## 设置host

在命令行中输入 `sudo vi /etc/hosts` 编辑 hosts 文件，摁`i`进入编辑模式，将下面代码复制下面，按`Esc`退出编辑模式，输入:wq保存并退出。

```
151.101.72.249 http://global-ssl.fastly.Net
192.30.253.112 http://github.com
```
