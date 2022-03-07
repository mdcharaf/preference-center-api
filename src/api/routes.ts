import { Router, IRouter } from 'express'
import { userController } from './controllers'

const router: IRouter = Router()

// User
router.post('/user', userController.create)

export { router as AppRouter }
