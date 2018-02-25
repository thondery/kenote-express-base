
import http from 'http'
import path from 'path'
import fs from 'fs-extra'
import express from 'express'
import nunjucks from 'nunjucks'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import compress from 'compression'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import errorhandler from 'errorhandler'

import logger from './utils/logger'
import { HOST, PORT, Status, session_secret, redis } from './config'
import restful from './middlewares/restful'
import controller from './routers/default'
import apiV1 from './routers/api_v1'

const RedisStore = connectRedis(session)
const app = express()
const staticDir = path.resolve(process.cwd(), 'public')
const viewsDir  = path.resolve(process.cwd(), 'views')

!fs.existsSync(staticDir) && fs.mkdirpSync(staticDir)

app.set('views', viewsDir)
app.set('view engine', 'njk')
nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(methodOverride())
app.use(compress())

// cookie
app.use(cookieParser(session_secret))

// Session
app.use(session({
  secret: session_secret,
  store: new RedisStore(redis),
  resave: true,
  saveUninitialized: true
}))

// Middlewares
app.use(restful)

// Static
app.use(express.static(staticDir))

// Routers
app.use('/', controller)
app.use('/api/v1', cors(), apiV1)

// 404 Not Found
app.use('*', (req, res) => {
  logger.error('status:404; url:', req.method, req.originalUrl)
  return res.status(404).render('error', { statusCode: 404, ...Status[404] })
})

// 500 Error
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler())
}
else {
  app.use( (err, req, res, next) => {
    logger.error('server 500 error: ', err)
    return res.status(500).render('error', { statusCode: 500, ...Status[500] })
  })
}

if (!module.parent) {
  const server = http.createServer(app)
  server.listen(PORT, HOST, () => {
    logger.info(`Kenote listening on port`, PORT)
  })
}

export default app