# Linux 下 MongoDB 的安装和使用

mongoDB [官网地址](https://www.mongodb.com/)

## 安装

[下载地址](https://www.mongodb.com/try/download/community)

<img style="width: 300px;" src="https://img2020.cnblogs.com/blog/1141466/202009/1141466-20200930182856332-1687912921.png" />

```bash
$ wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.4.1.tgz    # 下载
$ tar -zxvf mongodb-linux-x86_64-rhel70-4.4.1.tgz   # 解压
$ mv mongodb-linux-x86_64-rhel70-4.4.1 /usr/local/mongodb  # 移动位置
```

新建 数据库目录和日志

```bash
mkdir /data/db/mongodb
touch /data/log/mongodb/mongod.log
```

## 启动

```bash
$ /usr/local/mongodb/bin/mongod --dbpath /data/db/mongodb --logpath /data/log/mongodb/mongod.log
```

## 操作

```bash
# 进入mongo操作台
/usr/local/mongodb/bin/mongo

# 链接数据库
mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]

# 查看所有数据库
show dbs
# 查看已有集合
show collections

# 创建/使用数据库
use DATABASE_NAME
# 删除数据库
db.dropDatabase()

# 创建集合
db.createCollection(name, options)
# 删除集合
db.COLLECTION_NAME.drop()

# 插入文档
db.COLLECTION_NAME.insert(document)
# 更新文档
db.COLLECTION_NAME.update(<query>,<update>,options)
# 删除文档
db.COLLECTION_NAME.remove(<query>,options)
# 查询文档
db.COLLECTION_NAME.find(query, projection)
```

## 问题

-bash: ./mongo: cannot execute binary file

原因：系统版本和 mongodb 版本不对应，换个版本试试。

<br />

[whosmeya.com](https://www.whosmeya.com/)
