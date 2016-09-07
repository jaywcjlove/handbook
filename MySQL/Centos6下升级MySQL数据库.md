

# 备份数据

```bash
$ mysqldump -u xxx -h xxx -P 3306 -p --all-databases > databases.sql  
```

# 文件和配置文件备份

```bash
cp -R /data/mysql mysql-5.1-data  
cp /etc/my.cnf my.cnf-5.1  
```

# 停止服务

```bash
service mysqld stop
```


# 卸载旧版本的Mysql

```bash 
# 卸载旧版本的Mysql
yum remove mysql mysql-*  

# 执行之后再看看是不是残余一些mysql-libs之类的
# 查看是否有残余
yum list installed | grep mysql  

# 如果有，并确认没用之后也可以删除。
yum remove mysql-libs  
```



# 启动

```bash 
service mysqld start
```