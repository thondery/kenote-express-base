
const express = require('express')
const router = express.Router()

router.get ( '/', (req, res, next) => {
  res.send('default')
})

module.exports = router