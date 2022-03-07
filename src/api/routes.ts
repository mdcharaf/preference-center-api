import { Router, IRouter } from 'express'
import { userController } from './controllers'

const router: IRouter = Router()

// User
router.post('/user', userController.create)
router.delete('/user/:id', userController.delete)
router.get('/user/:id', userController.getOne)

export { router as AppRouter }
