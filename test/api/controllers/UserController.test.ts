import { Request, Response } from 'express'
import { UniqueConstraintError } from 'sequelize'
import UserController from '../../../src/api/controllers/UserController'
import { User, Event, IUser } from '../../../src/api/models'
import { IUserRepository } from '../../../src/api/repositories'
import { mockResponse } from '../../utils/mocks'

describe('UserController', () => {
  const dummyEmail = 'test@test.com'
  const dummyId = '00000000-0000-0000-0000-000000000000'
  const dummyEvents: Array<Partial<Event>> = [
    { id: dummyId, consentId: 'email_notifications', enabled: true },
    { id: dummyId, consentId: 'sms_notifications', enabled: false }
  ]
  const dummyUser: Partial<User> = {
    id: dummyId,
    email: dummyEmail,
    events: dummyEvents.map(ev => ev as Event),
    props: (): Partial<User> => ({ id: dummyId, email: dummyEmail, events: dummyEvents.map(ev => ev as Event) })
  }

  const fnUUID = (): string => dummyId
  const repoMock = {
    create: async ({ id, email }: IUser): Promise<User | null> => {
      const user: Partial<User> = { id, email, props: (): Partial<User> => ({ id, email }) }
      return await Promise.resolve(user as User)
    },
    delete: async (_: string): Promise<void> => {},
    get: async (_: string): Promise<User | null> => await Promise.resolve(dummyUser as User)
  }
  const responseMock: Partial<Response> = {}

  const result = {
    statusCode: {},
    json: {}
  }

  beforeEach(() => {
    result.statusCode = {}
    result.json = {}

    mockResponse(responseMock, result)
  })

  describe('create', () => {
    test('should create user successfully when valid email address', async () => {
      // Arrange
      const request = { body: { email: dummyEmail } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)

      // Act
      await controller.create(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(201)
      expect(result.json).toEqual({ id: dummyId, email: dummyEmail })
    })

    test('should return unprocessible entity when invalid email address', async () => {
      // Arrange
      const request = { body: { email: 'invalid email' } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)

      // Act
      await controller.create(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(422)
      expect(result.json).toEqual({ error: 'Invalid email address' })
    })

    test('should return unprocessible entity when email address already exists', async () => {
      // Arrange
      const request = { body: { email: dummyEmail } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)
      repoMock.create = (_) => { throw new UniqueConstraintError({}) }

      // Act
      await controller.create(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(422)
      expect(result.json).toEqual({ error: 'Email already exists' })
    })

    test('should return bad request when an error is thrown', async () => {
      // Arrange
      const request = { body: { email: dummyEmail } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)
      repoMock.create = (_) => { throw new Error() }

      // Act
      await controller.create(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(400)
    })

    test('should return bad request when missing body attributes', async () => {
      // Arrange
      const request: Partial<Request> = { body: {} }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)

      // Act
      await controller.create(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(400)
    })
  })

  describe('delete', () => {
    test('should delete user when delete is called', async () => {
      // Arrange
      const request: Partial<Request> = { params: { id: dummyId } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)

      // Act
      await controller.delete(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(200)
      expect(result.json).toEqual({ message: 'successfully deleted' })
    })

    test('should return bad request when failed to delete', async () => {
      // Arrange
      const request: Partial<Request> = { params: { userId: dummyId } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)
      repoMock.delete = (_) => { throw new Error() }

      // Act
      await controller.delete(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(400)
    })

    test('should return bad request when missing parameter', async () => {
      // Arrange
      const request: Partial<Request> = { params: {} }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)

      // Act
      await controller.delete(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(400)
    })
  })

  describe('getOne', () => {
    test('should return user when user exists', async () => {
      // Arrange
      const request: Partial<Request> = { params: { id: dummyId } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)

      // Act
      await controller.getOne(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(200)
      expect(result.json).toEqual({
        user: {
          id: dummyId,
          email: dummyEmail
        },
        consents: dummyEvents.map(event => ({
          id: event.consentId,
          enabled: event.enabled
        }))
      })
    })

    test('should return not found response when user does not exist', async () => {
      // Arrange
      const request: Partial<Request> = { params: { id: dummyId } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)
      repoMock.get = async (_) => await Promise.resolve(null)

      // Act
      await controller.getOne(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(404)
    })

    test('should return bad request when missing parameter', async () => {
      // Arrange
      const request: Partial<Request> = { params: {} }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)

      // Act
      await controller.getOne(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(400)
    })
  })
})
