import { UserReporistory } from '../repositories'
import EventController from './EventController'
import UserController from './UserController'

const userController = new UserController(new UserReporistory())
const eventController = new EventController()

export { userController, eventController }
