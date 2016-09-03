

# SELECT

## 查询语句

```sql
-- 表abc 两个 id  表abc中不包含 字段a=b 的 查询出来，只显示id
SELECT s.id from station s WHERE id in (13,14) and user_id not in (4);

-- 从表 Persons 选取 LastName 列的数据
SELECT LastName FROM Persons
```

## 表的总数

```sql 
SELECT COUNT(1) AS totals FROM fromname;
```

# UPDATE

```sql 
-- update语句设置字段值为另一个结果取出来的字段
update user set name = (select name from user1 where user1 .id = 1 )
where id = (select id from user2 where user2 .name='小苏')
```


# INSERT

```sql
INSERT INTO meeting SET a=1,b=2;
```

# DELETE

```sql
-- 删除 表meeting id 为2和3的两条数据
DELETE from meeting where id in (2,3);
```


# AND 和 OR

- AND - 如果第一个条件和第二个条件都成立；
- OR - 如果第一个条件和第二个条件中只要有一个成立；

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

- `ORDER BY` 语句用于根据指定的列对结果集进行排序。
- `ORDER BY` 语句默认按照升序对记录进行排序。
- `DESC` 按照降序对记录进行排序。
- `ASC` 按照顺序对记录进行排序。

```sql
-- Company在表Orders中为字母，则会以字母顺序显示公司名称
SELECT Company, OrderNumber FROM Orders ORDER BY Company

-- 后面跟上 DESC 则为降序显示
SELECT Company, OrderNumber FROM Orders ORDER BY Company DESC

-- Company以降序显示公司名称，并OrderNumber以顺序显示
SELECT Company, OrderNumber FROM Orders ORDER BY Company DESC, OrderNumber ASC
```