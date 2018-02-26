
import { Router } from 'express'
import * as signPolice from '../polices/api_v1/sign'
import * as signAPI from '../api/v1/sign'

const router = Router()

router.get('/test', (req, res, next) => res.api(null, 0))

router.post('/login', signPolice.login, signAPI.login)
router.get('/logout', signAPI.logout)

export default router