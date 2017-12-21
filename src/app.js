

const http = require('http')
const path = require('path')
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const compress = require('compression')
const cors = require('cors')
const errorhandler = require('errorhandler')
const config = require('./config')
const logger = require('./utils/logger')
const ini = require('./utils/ini')

const app = express()
const staticDir = path.resolve(process.cwd(), 'public')
const viewsDir  = path.resolve(process.cwd(), 'views')
const statusINI = ini.parse('./status.ini')

// Views
app.set('views', viewsDir)
app.set('view engine', 'html')
nunjucks.configure('views', {
  autoescape: true,
  express: app
})

// POST
app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
app.use(methodOverride())

// Middlewares
//app.use(res_api)
app.use(compress())

// Static
app.use(express.static(staticDir))

// Routers
app.use('/', require('./routers/default'))
app.use('/api/v1', cors(), require('./routers/api_v1'))

// 404 Not Found
app.use('*', (req, res) => {
  logger.error('status:404; url:', req.method, req.originalUrl)
  return res.status(404).render('error', { statusCode: 404, ...statusINI[404] })
})

// 500 Error
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler())
}
else {
  app.use( (err, req, res, next) => {
    logger.error('server 500 error: ', err)
    return res.status(500).render('error', { statusCode: 500, ...statusINI[500] })
  })
}

// Starting Server
if (!module.parent) {
  const server = http.createServer(app)
  const { HOST, PORT } = config
  server.listen(PORT, HOST, () => {
    logger.info('Kenote listening on port', PORT)
    logger.info('God bless love....')
    logger.info(`Your App Run on http://${HOST}:${PORT}`)
    logger.info('')
  })
}

module.exports = app