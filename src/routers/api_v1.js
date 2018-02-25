
import express from 'express'

const router = express.Router()

router.get('/test', (req, res, next) => res.api(null, 0))

export default router