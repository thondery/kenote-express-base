# 服务器部署

> 以阿里云为例，系统为 `CentOS 6.x`\
> 假设部署目录为 `/mnt/nodejs/kenote-express-base`


## 一、配置环境

### 1.1 安装 `Node.js`

安装版本管理器
```cmd
cd ~ && curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
```

将镜像源换成淘宝
```bash
export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node/
```

下载并安装版本
```bash
nvm insatll 8
```

如果有有多个版本，通过下面命令切换
```bash
nvm alias default 8
```

### 1.2 安装进程管理器

安装 `PM2`
```bash
npm i -g pm2
```

加入系统启动
```bash
pm2 startup
```

### 1.3 安装 `MongoDB`

建立 `yum` 源
```bash
vi /etc/yum.repos.d/mongodb-org-3.6.repo
```
输入以下内容
```ini
[mongodb-org-3.6]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.6/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.6.asc
```

下载并安装
```bash
yum install -y mongodb-org
```

启动服务
```bash
service mongod start
```

加入系统启动
```bash
chkconfig mongod on
```

### 1.4 安装 `Redis`

...

### 1.5 安装 `GraphicsMagick`

```bash
yum install -y GraphicsMagick
```

### 1.6 安装 `Nginx`

```bash
yum install -y nginx
```

启动服务
```bash
service nginx start
```

加入系统启动
```bash
chkconfig nginx on
```

修改 `/etc/nginx/nginx.conf`

在 `http` 项添加下列属性，让其支持 `gzip` 、自定义 `headers`、上传文件大小限制

```c
    gzip  on;
    gzip_buffers 16 8K;
    gzip_comp_level 7;
    gzip_min_length 200;
    gzip_types text/plain application/x-javascript application/javascript text/javascript text/css application/octet-stream application/json;

    underscores_in_headers on;
    client_max_body_size 1000m;
```

## 二、部署项目

### 1.1 创建项目目录

```bash
mkdir /mnt/nodejs/kenote-express-base
```

### 1.2 建立配置文件

```bash
vi /mnt/nodejs/kenote-express-base/server.ini
```

内容如下
```ini
; Configure Production

HOST = 0.0.0.0
PORT = 4086

site_name = kenote-express-base
site_url = <外部访问地址>
session_secret = kenote-express-base_secret

; 设置 MongoDB
[mongo]
uri = mongodb://localhost:27017/kenote-express-base

; 设置 Redis
[redis]
host = 127.0.0.1
port = 6379
db = 0

; 设置 Mailer
[mailer]
host = smtp.mxhichina.com
port = 25

[mailer.auth]
user = user@mxhichina.com
pass = password

; 设置图片水印
[drawText]
color = '#ffffff'
font = 'Comic Sans MS'
size = 14
text = @Kenote
gravity = SouthEast

; 设置 用户头像图片
[store.avatar]
store = local
root_dir = /mnt/nodejs/kenote-express-base/uploadfile/avatar
mime_type[] = image/png
mime_type[] = image/gif
mime_type[] = image/jpeg
max_size = 2MB

; 设置 Icon 资源
[store.icon]
store = local
root_dir = /mnt/nodejs/kenote-express-base/uploadfile/icon
mime_type[] = image/png
mime_type[] = image/gif
mime_type[] = image/jpeg
mime_type[] = image/svg
mime_type[] = image/svg+xml
max_size = 2MB
filename = true

; 设置 用户上传图片
[store.image]
store = local
root_dir = /mnt/nodejs/kenote-express-base/uploadfile/images
mime_type[] = image/png
mime_type[] = image/gif
mime_type[] = image/jpeg
max_size = 2MB
draw = true

; 设置 用户上传文件
[store.image]
store = local
root_dir = /mnt/nodejs/kenote-express-base/uploadfile/files
mime_type[] = image/png
mime_type[] = image/gif
mime_type[] = image/jpeg
mime_type[] = image/svg
mime_type[] = image/svg+xml
mime_type[] = application/octet-stream
mime_type[] = application/json
mime_type[] = text/markdown
mime_type[] = application/zip
max_size = 15MB
draw = true
```