# kenote-express-base

基于 `Express` 的基础服务

### 安装及使用

安装所有依赖包，生产环境需加 `--production` 标签

```bash
$ yarn install
```

编译代码

```bash
$ yarn build
```

初始化数据

```bash
$ yarn initialize
```

系统开发

```
$ yarn dev
```

### 生产环境

创建服务器配置文件 `kenote.ini`

```ini
; Configure Production

HOST = 0.0.0.0
PORT = 4000

site_name = Kenote
site_url = http://0.0.0.0:4000
session_secret = kenote_secret

; 设置 MongoDB
[mongo]
uri = mongodb://user:password@localhost:27017/kenote

; 设置 Redis
[redis]
host = 127.0.0.1
port = 6379
db = 0
pass = password

; 设置 Mailer
[mailer]
host = smtp.mxhichina.com
port = 25

[mailer.auth]
user = user@mxhichina.com
pass = password

; 设置七牛CND资源
[store.cdn]
store = qn
mime_type[] = image/png
mime_type[] = image/gif
mime_type[] = image/svg
max_size = 8MB

[store.cdn.store_opts]
bucket = cdn-name
origin = http://cdn.youdomain.com
uploadURL = http://up-z0.qiniu.com

[store.cdn.store_opts.qn_access]
accessKey = your_accessKey
secretKey = your_secretKey

; 设置图片水印
[drawText]
color = '#ffffff'
font = 'Comic Sans MS'
size = 14
text = @kenote
gravity = SouthEast
```

配置PM2文件 `ecosystem.config.js`

```js
// PM2 Configure
module.exports = {
  apps : [
    {
      name: 'app-name',
      script: './build/main.js',
      watch: true,
      max_memory_restart: '300M',
      interpreter_args: '--harmony',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
```

编译服务器代码

```bash
$ yarn build:pro
```

初始化数据

```bash
$ yarn initialize
```

启动PM2服务

```bash
$ yarn start
```