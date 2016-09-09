
# 增删改查

## SELECT

> SELECT 语句用于从表中选取数据。  
> 语法：`SELECT 列名称 FROM 表名称`  
> 语法：`SELECT * FROM 表名称`  

```sql
-- 表abc 两个 id  表abc中不包含 字段a=b 的 查询出来，只显示id
SELECT s.id from station s WHERE id in (13,14) and user_id not in (4);

-- 从表 Persons 选取 LastName 列的数据
SELECT LastName FROM Persons

-- 结果集中会自动去重复数据
SELECT DISTINCT Company FROM Orders 
```

## UPDATE

> Update 语句用于修改表中的数据。  
> 语法：`UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值`  

```sql 
-- update语句设置字段值为另一个结果取出来的字段
update user set name = (select name from user1 where user1 .id = 1 )
where id = (select id from user2 where user2 .name='小苏')
```


## INSERT

> INSERT INTO 语句用于向表格中插入新的行。  
> 语法：`INSERT INTO 表名称 VALUES (值1, 值2,....)`  
> 语法：`INSERT INTO 表名称 (列1, 列2,...) VALUES (值1, 值2,....)`  

```sql
-- 向表 Persons 插入一条字段 LastName = Wilson 字段 Address = shanghai
INSERT INTO Persons (LastName, Address) VALUES ('JSLite', 'shanghai');

INSERT INTO meeting SET a=1,b=2;
```

## DELETE

> DELETE 语句用于删除表中的行。  
> 语法：`DELETE FROM 表名称 WHERE 列名称 = 值`  

```sql
-- 在不删除table_name表的情况下删除所有的行，清空表。
DELETE FROM table_name
-- 或者
DELETE * FROM table_name
-- 删除 Person表字段 LastName = 'Wilson' 
DELETE FROM Person WHERE LastName = 'Wilson' 
-- 删除 表meeting id 为2和3的两条数据
DELETE from meeting where id in (2,3);
-- 表 Persons 字段 Id_P 等于 Orders 字段 Id_P 的值，
-- 结果集显示 Persons表的 LastName、FirstName字段，Orders表的OrderNo字段
SELECT p.LastName, p.FirstName, o.OrderNo FROM Persons p, Orders o WHERE p.Id_P = o.Id_P 
```

# WHERE

> WHERE 子句用于规定选择的标准。  
> 语法：`SELECT 列名称 FROM 表名称 WHERE 列 运算符 值`  

```sql 
-- 从表 Persons 中选出 Year 字段大于 1965 的数据
SELECT * FROM Persons WHERE Year>1965
```

# AND 和 OR

> AND - 如果第一个条件和第二个条件都成立；  
> OR - 如果第一个条件和第二个条件中只要有一个成立；  

## AND

```sql 
-- 删除 meeting 表字段 
-- id=2 并且 user_id=5 的数据  和
-- id=3 并且 user_id=6 的数据 
DELETE from meeting where id in (2,3) and user_id in (5,6);

-- 使用 AND 来显示所有姓为 "Carter" 并且名为 "Thomas" 的人：
SELECT * FROM Persons WHERE FirstName='Thomas' AND LastName='Carter';
```

## OR

```sql 
-- 使用 OR 来显示所有姓为 "Carter" 或者名为 "Thomas" 的人：
SELECT * FROM Persons WHERE firstname='Thomas' OR lastname='Carter'
```

# ORDER BY

> 语句默认按照升序对记录进行排序。  
> `ORDER BY` - 语句用于根据指定的列对结果集进行排序。  
> `DESC` - 按照降序对记录进行排序。  
> `ASC` - 按照顺序对记录进行排序。  

```sql
-- Company在表Orders中为字母，则会以字母顺序显示公司名称
SELECT Company, OrderNumber FROM Orders ORDER BY Company

-- 后面跟上 DESC 则为降序显示
SELECT Company, OrderNumber FROM Orders ORDER BY Company DESC

-- Company以降序显示公司名称，并OrderNumber以顺序显示
SELECT Company, OrderNumber FROM Orders ORDER BY Company DESC, OrderNumber ASC
```

# IN

> IN - 操作符允许我们在 WHERE 子句中规定多个值。  
> IN - 操作符用来指定范围，范围中的每一条，都进行匹配。IN取值规律，由逗号分割，全部放置括号中。
> 语法：`SELECT "字段名"FROM "表格名"WHERE "字段名" IN ('值一', '值二', ...);`

```sql 
-- 从表 Persons 选取 字段 LastName 等于 Adams、Carter
SELECT * FROM Persons WHERE LastName IN ('Adams','Carter')
```

# NOT

> NOT - 操作符总是与其他操作符一起使用，用在要过滤的前面。

```sql
SELECT vend_id, prod_name FROM Products WHERE NOT vend_id = 'DLL01' ORDER BY prod_name;
```


# AS 

> as - 可理解为：用作、当成，作为；别名  
> 一般是重命名列名或者表名。  
> 语法：`select column_1 as 列1,column_2 as 列2 from table as 表`

```sql 
SELECT * FROM Employee AS emp
-- 这句意思是查找所有Employee 表里面的数据，并把Employee表格命名为 emp。
-- 当你命名一个表之后，你可以在下面用 emp 代替 Employee.
-- 例如 SELECT * FROM emp.

SELECT MAX(OrderPrice) AS LargestOrderPrice FROM Orders
-- 列出表 Orders 字段 OrderPrice 列最大值，
-- 结果集列不显示 OrderPrice 显示 LargestOrderPrice

-- 显示表 users_profile 中的 name 列
SELECT t.name from (SELECT * from users_profile a) AS t;

-- 表 user_accounts 命名别名 ua，表 users_profile 命名别名 up
-- 满足条件 表 user_accounts 字段 id 等于 表 users_profile 字段 user_id
-- 结果集只显示mobile、name两列
SELECT ua.mobile,up.name FROM user_accounts as ua INNER JOIN users_profile as up ON ua.id = up.user_id;
```

# JION 

> 用于根据两个或多个表中的列之间的关系，从这些表中查询数据。  

- `JOIN`: 如果表中有至少一个匹配，则返回行
- `INNER JOIN`:在表中存在至少一个匹配时，INNER JOIN 关键字返回行。
- `LEFT JOIN`: 即使右表中没有匹配，也从左表返回所有的行
- `RIGHT JOIN`: 即使左表中没有匹配，也从右表返回所有的行
- `FULL JOIN`: 只要其中一个表中存在匹配，就返回行

```sql
SELECT Persons.LastName, Persons.FirstName, Orders.OrderNo
FROM Persons
INNER JOIN Orders
ON Persons.Id_P = Orders.Id_P
ORDER BY Persons.LastName;
```

# SQL 函数

## COUNT

> COUNT 让我们能够数出在表格中有多少笔资料被选出来。  
> 语法：`SELECT COUNT("字段名") FROM "表格名";`

```sql 
-- 表 Store_Information 有几笔 store_name 栏不是空白的资料。
-- "IS NOT NULL" 是 "这个栏位不是空白" 的意思。
SELECT COUNT (Store_Name) FROM Store_Information WHERE Store_Name IS NOT NULL; 
-- 获取 Persons 表的总数
SELECT COUNT(1) AS totals FROM Persons;
-- 获取表 station 字段 user_id 相同的总数
select user_id, count(*) as totals from station group by user_id;
```

## MAX

> MAX 函数返回一列中的最大值。NULL 值不包括在计算中。  
> 语法：`SELECT MAX("字段名") FROM "表格名"`  

```sql 
-- 列出表 Orders 字段 OrderPrice 列最大值，
-- 结果集列不显示 OrderPrice 显示 LargestOrderPrice
SELECT MAX(OrderPrice) AS LargestOrderPrice FROM Orders
```

# 添加索引

## 普通索引(INDEX)

> 语法：ALTER TABLE `表名字` ADD INDEX 索引名字 ( `字段名字` )

```sql
-- –直接创建索引
CREATE INDEX index_user ON user(title)
-- –修改表结构的方式添加索引
ALTER TABLE table_name ADD INDEX index_name ON (column(length))
-- 给 user 表中的 name字段 添加普通索引(INDEX)
ALTER TABLE `table` ADD INDEX index_name (name)
-- –创建表的时候同时创建索引
CREATE TABLE `table` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
    `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL ,
    `time` int(10) NULL DEFAULT NULL ,
    PRIMARY KEY (`id`),
    INDEX index_name (title(length))
)
-- –删除索引
DROP INDEX index_name ON table
```

## 主键索引(PRIMARY key)

> 语法：ALTER TABLE `表名字` ADD PRIMARY KEY ( `字段名字` )

```sql
-- 给 user 表中的 id字段 添加主键索引(PRIMARY key)
ALTER TABLE `user` ADD PRIMARY key (id);
```

## 唯一索引(UNIQUE)

> 语法：ALTER TABLE `表名字` ADD UNIQUE (`字段名字`)

```sql
-- 给 user 表中的 creattime 字段添加唯一索引(UNIQUE)
ALTER TABLE `user` ADD UNIQUE (creattime);
```

## 全文索引(FULLTEXT)

> 语法：ALTER TABLE `表名字` ADD FULLTEXT (`字段名字`)

```sql
-- 给 user 表中的 description 字段添加全文索引(FULLTEXT)
ALTER TABLE `user` ADD FULLTEXT (description);
```

## 添加多列索引

> 语法：
ALTER TABLE `table_name` ADD INDEX index_name ( `column1`, `column2`, `column3`)

```sql
-- 给 user 表中的 description 字段添加全文索引(FULLTEXT)
ALTER TABLE `user` ADD FULLTEXT (description);
```

## 建立索引的时机

在`WHERE`和`JOIN`中出现的列需要建立索引，但也不完全如此：

- MySQL只对`<`，`<=`，`=`，`>`，`>=`，`BETWEEN`，`IN`使用索引
- 某些时候的`LIKE`也会使用索引。
- 在`LIKE`以通配符%和_开头作查询时，MySQL不会使用索引。

```sql
-- 此时就需要对city和age建立索引，
-- 由于mytable表的userame也出现在了JOIN子句中，也有对它建立索引的必要。
SELECT t.Name  
FROM mytable t LEFT JOIN mytable m ON t.Name=m.username 
WHERE m.age=20 AND m.city='上海';

SELECT * FROM mytable WHERE username like'admin%'; -- 而下句就不会使用：
SELECT * FROM mytable WHEREt Name like'%admin'; -- 因此，在使用LIKE时应注意以上的区别。
```

# 其它相关

- [让MySQL支持emoji图标存储](让MySQL支持emoji图标存储.md)
- [Mac下重置MySQL的root密码](Mac下重置MySQL的root密码.md)
- [MySQL安装](mysql安装.md)
- [MySQL数据类型](MySQL数据类型.md)

# 参考手册 

- http://www.w3school.com.cn/sql/index.asp
- http://www.1keydata.com/cn/sql/sql-count.php
