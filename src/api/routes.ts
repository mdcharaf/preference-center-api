import { Router, IRouter } from 'express'
import { eventController, userController } from './controllers'

const router: IRouter = Router()

// User
router.post('/user', userController.create.bind(userController))
router.delete('/user/:id', userController.delete.bind(userController))
router.get('/user/:id', userController.getOne.bind(userController))

// Event
router.post('/event', eventController.create.bind(eventController))

export { router as AppRouter }
