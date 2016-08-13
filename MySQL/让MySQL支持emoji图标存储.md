
# 让MySQL支持emoji图标存储

在`MySLQ`中 UPDATA 和 INSERT 数据的时候，如果数据上面带有`emoji`图标，例如：`💗`、`👽`、`💔`很容易更新活着插入不成功，导致报错。

```sql
Error: ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: Incorrect string value: '\xF0\x9F\x91\xBD\xF0\x9F...' for column 'name' at row
```

都快崩溃了，但是还好终于解决了这种鬼问题。资料显示原因是，MYSQL 5.5 之前， UTF8 编码只支持1-3个字节，只支持[BMP](http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters)这部分的unicode编码区，而`emoji`图标恰好是4个字节的编码进行存储。从MYSQL5.5开始，可支持4个字节UTF编码`utf8mb4`，一个字符最多能有4字节，所以能支持更多的字符集。所以要解决问题，必需把数据库表字符编码全部改成`utf8mb4`。


## 首先备份

升级数据之前备份您服务器上的所有数据，保持良好习惯，安全第一！

## 升级您的MySQL

新的数据库可以在这里下载[Upgrade the MySQL server to v5.5.3+](https://dev.mysql.com/downloads/mysql/)。

## 修改您的数据库、表、字段

```bash
# 对每一个数据库:
ALTER DATABASE 这里数据库名字 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
# 对每一个表:
ALTER TABLE 这里是表名字 CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# 对每一个字段:
ALTER TABLE 这里是表名字 CHANGE 字段名字 字段名字 VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
utf8mb4完全向后兼容utf8，无乱码或其他数据丢失的形式出现。理论上是可以放心修改，如果您不放心修改，您可以拿备份恢复数据，然后让程序员处理这种兼容`emoji`存储问题，存的时候过滤一遍转成`base64`，然后取的时候转回来？...  还是修改数据库比较方便。

## 检查你的字段和索引

不要将所有的都设置成`utf8mb4`，这个冒得必要。我只在我某些字段类型为`VARCHAR`的时候才设置成`utf8mb4`。

## 修改MySQL配置文件

这个地方最坑，我在我Mac osx 系统上找不到`/etc/my.cnf` 它根本不存在，所以我们需要创建这样一个文件并修改它。

```bash
# 进入这个目录，
# 在这个目录下面有个后缀为`.cnf`的文件
cd /usr/local/mysql/support-files/

# 将这个文件复制到`etc`目录中并将名字命名为`my.cnf`
sudo cp my-default.cnf /etc/my.cnf

# 然后编辑`my.cnf`文件，将下面内容复制到里面。
sudo vim /etc/my.cnf
```

[MySQL configuration file (/etc/my.cnf):](https://dev.mysql.com/doc/refman/5.5/en/option-files.html)


```bash
[client]
default-character-set = utf8mb4

[mysql]
default-character-set = utf8mb4

[mysqld]
character-set-client-handshake = FALSE
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

## 重启MySQL

1. 启动：`/usr/local/mysql/support-files/mysql.server start `
2. 停止：`/usr/local/mysql/support-files/mysql.server stop `
3. 重启：`/usr/local/mysql/support-files/mysql.server restart`


## 查看是否设置成功

通过下面命令查询是否设置成功！

```bash
mysql> SHOW VARIABLES WHERE Variable_name LIKE 'character\_set\_%' OR Variable_name LIKE 'collation%';

# 运行上面代码显示下面结果
# +--------------------------+--------------------+
# | Variable_name            | Value              |
# +--------------------------+--------------------+
# | character_set_client     | utf8mb4            |
# | character_set_connection | utf8mb4            |
# | character_set_database   | utf8mb4            |
# | character_set_filesystem | binary             |
# | character_set_results    | utf8mb4            |
# | character_set_server     | utf8mb4            |
# | character_set_system     | utf8               |
# | collation_connection     | utf8mb4_unicode_ci |
# | collation_database       | utf8mb4_unicode_ci |
# | collation_server         | utf8mb4_unicode_ci |
# +--------------------------+--------------------+
```

到这一步表示你成功了！恭喜你！~

## 修复和优化表

我跑到这一步其实没有任何必要修复和优化表，为了保险起见，我还是运行了这两条命令，虽然不知道它有什么卵用，放在这里做个笔记吧。

```bash
REPAIR TABLE 表名字;
OPTIMIZE TABLE 表名字;
```

# 参考资料

- [How to support full Unicode in MySQL databases](https://mathiasbynens.be/notes/mysql-utf8mb4#character-sets)
- [my.cnf file does not exist on Mac OSX](http://forums.mysql.com/read.php?11,366143,376017#msg-376017)