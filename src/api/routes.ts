import { IRouter, Router } from 'express'
import { userController } from './controllers'

const router: IRouter = Router()

// User
router.post('/user', userController.addUser)

export { router as AppRouter }
