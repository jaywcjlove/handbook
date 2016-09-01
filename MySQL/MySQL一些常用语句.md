

## 查询语句

表abc 两个 id  表abc中不包含 字段a=b 的 查询出来，只显示id

```sql
SELECT s.id from station s WHERE id in (13,14) and user_id not in (4);
```

## 表 fromname 的总数

```sql 
SELECT COUNT(1) AS totals FROM fromname;
```

## update语句设置字段值为另一个结果取出来的字段

```sql 
update user set name = (select name from user1 where user1 .id = 1 )
where id = (select id from user2 where user2 .name='小苏')
```