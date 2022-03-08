import { UserReporistory, EventRepository } from '../repositories'
import EventController from './EventController'
import UserController from './UserController'

const userController = new UserController(new UserReporistory())
const eventController = new EventController(new EventRepository())

export { userController, eventController }
