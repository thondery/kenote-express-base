
import express from 'express'
import * as auth from '../middlewares/auth'
import * as store from '../controller/store'

const router = express.Router()

router.post('/upload', auth.uploadUser, store.upload)
router.post('/upload/:type', auth.uploadUser, store.upload)

router.get('/uploadfile/:type/:filename', auth.downloadUser, store.dowload)

export default router