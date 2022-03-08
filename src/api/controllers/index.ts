import { v4 as uuid } from 'uuid'
import { UserReporistory, EventRepository } from '../repositories'
import EventController from './EventController'
import UserController from './UserController'

const userController = new UserController(new UserReporistory(), uuid)
const eventController = new EventController(new EventRepository(), uuid)

export { userController, eventController }
