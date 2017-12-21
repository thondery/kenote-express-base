# kenote-express-base

express base for kenote


### Configure

`kenote.ini`

```ini
; Configure hosts

[localhost]
HOST = 0.0.0.0
PORT = 4000

[intranet]
HOST = 0.0.0.0
PORT = 4001

[aliyun]
HOST = 0.0.0.0
PORT = 4002

; Configure Admin
[localhost.admin]
username = admin
password = admin888

[intranet.admin]
username = admin
password = admin888

[aliyun.admin]
username = admin
password = admin888

; Configure MongoDB
[localhost.mongo]
uri = mongodb://localhost:27017/kenote_express
perfix = kenote_

[intranet.mongo]
uri = mongodb://localhost:27017/kenote_express
perfix = kenote_

[aliyun.mongo]
uri = mongodb://admin:password@localhost:27017/kenote_express
perfix = kenote_

; Configure Redis
[localhost.redis]
host = 127.0.0.1
port = 6379

[intranet.redis]
host = 127.0.0.1
port = 6379

[aliyun.redis]
host = 127.0.0.1
port = 6379
pass = password

; Configure Mailer
[localhost.mailer]
host = smtp.mxhichina.com
port = 25
[localhost.mailer.auth]
user = user@mxhichina.com
pass = password

[intranet.mailer]
host = smtp.mxhichina.com
port = 25
[intranet.mailer.auth]
user = user@mxhichina.com
pass = password

[aliyun.mailer]
host = smtp.mxhichina.com
port = 25
[aliyun.mailer.auth]
user = user@mxhichina.com
pass = password
```

`scope.ini`

```ini
; Configure scope

scope = aliyun
```
