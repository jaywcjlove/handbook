
#  官方安装教程

[gitlab / gitlab-ce](https://packages.gitlab.com/gitlab/gitlab-ce)

1. Install and configure the necessary dependencies

If you install Postfix to send email please select 'Internet Site' during setup. Instead of using Postfix you can also use Sendmail or configure a custom SMTP server and configure it as an SMTP server.

On Centos 6 and 7, the commands below will also open HTTP and SSH access in the system firewall.

```
sudo yum install curl openssh-server openssh-clients postfix cronie
sudo service postfix start
sudo chkconfig postfix on
sudo lokkit -s http -s ssh
```

2. Add the GitLab package server and install the package

```
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash
sudo yum install gitlab-ce
```

If you are not comfortable installing the repository through a piped script, you can find the entire script here and select and download the package manually and install using

```
curl -LJO https://packages.gitlab.com/gitlab/gitlab-ce/packages/el/6/gitlab-ce-XXX.rpm/download
rpm -i gitlab-ce-XXX.rpm
```

3. Configure and start GitLab

```
sudo gitlab-ctl reconfigure
```

4. Browse to the hostname and login

On your first visit, you'll be redirected to a password reset screen to provide the password for the initial administrator account. Enter your desired password and you'll be redirected back to the login screen.

The default account's username is root. Provide the password you created earlier and login. After login you can change the username if you wish.


＃ 解决官方无法安装的情况

- [Gitlab Community Edition 镜像使用帮助](https://mirror.tuna.tsinghua.edu.cn/help/gitlab-ce/)
- [在阿里云上通过Omnibus一键安装包安装Gitlab](https://github.com/hehongwei44/my-blog/issues/19)