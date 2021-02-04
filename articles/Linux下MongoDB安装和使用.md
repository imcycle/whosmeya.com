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
mkdir /data/mongo/data
touch /data/mongo/logs/mongod.log
```

## 启动

```bash
$ /usr/local/mongodb/bin/mongod --dbpath /data/mongo/data --logpath /data/mongo/logs/mongod.log
```

## 操作

```bash
# 进入mongo操作台
/usr/local/mongodb/bin/mongo

# 链接数据库
mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]

# 查看当前数据库
db
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

# 认证用户
db.auth(username, password)
# 新增用户
db.createUser(
  {
    user: 'admin',
    pwd: 'admin',
    roles: [{ role: 'root', db: 'admin' }]
  },
  {
    user: 'game',
    pwd: 'game',
    roles: [{ role: 'readWrite', db: 'game' }]
  }
)
# 删除用户
db.removeUser(username)
# 更新用户
db.updateUser(username, update, writeConcern)
# 查找用户
db.getUser(username, args)
```

## 配置远程连接

1. 添加数据库用户，读写等权限
2. 新建配置文件 /usr/local/mongodb/mongod.conf 并写入以下配置（方便启动）
3. 启动服务器 /usr/local/mongodb/bin/mongod --config /usr/local/mongodb/mongod.conf

```conf
#port：端口。默认27017，MongoDB的默认服务TCP端口，监听客户端连接。要是端口设置小于1024，比如1021，则需要root权限启动，不能用mongodb帐号启动
port = 27017

# bind_ip：绑定地址。默认127.0.0.1，只能通过本地连接。设置 0.0.0.0 为不限。
bind_ip = 0.0.0.0

# dbpath：数据存放目录。
dbpath = /data/mongo/data/

# logpath：指定日志文件
logpath = /data/mongo/logs/mongodb.log
# logappend：写日志的模式：设置为true为追加。默认是覆盖。如果未指定此设置，启动时MongoDB的将覆盖现有的日志文件。
logappend = true

# fork：是否后台运行，设置为true 启动 进程在后台运行的守护进程模式。默认false。
# fork = true

# auth：用户认证，默认false。
auth = true
```

## 问题

-bash: ./mongo: cannot execute binary file

原因：系统版本和 mongodb 版本不对应，换个版本试试。

<br />

[whosmeya.com](https://www.whosmeya.com/)
