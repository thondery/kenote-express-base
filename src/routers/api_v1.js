
const express = require('express')
const router = express.Router()

router.get ( '/', (req, res, next) => {
  res.send('api_v1')
})

module.exports = router