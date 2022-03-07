import { Router, IRouter } from 'express'
import { eventController, userController } from './controllers'

const router: IRouter = Router()

// User
router.post('/user', userController.create)
router.delete('/user/:id', userController.delete)
router.get('/user/:id', userController.getOne)

// Event
router.post('/event', eventController.create)

export { router as AppRouter }
