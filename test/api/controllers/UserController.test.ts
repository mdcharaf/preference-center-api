import { Request, Response } from 'express'
import { UniqueConstraintError } from 'sequelize'
import UserController from '../../../src/api/controllers/UserController'
import { User, Event } from '../../../src/api/models'
import { IUserRepository } from '../../../src/api/repositories'

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
    create: async ({ id, email }: { id: string, email: string }): Promise<User | null> => {
      const user: Partial<User> = { id, email, props: (): Partial<User> => ({ id, email }) }
      return await Promise.resolve(user as User)
    },
    delete: async (_: string): Promise<void> => {},
    get: async (_: string): Promise<User | null> => await Promise.resolve(dummyUser as User)
  }
  const responseMock: Partial<Response> = {}

  let httpStatusCode = {}
  let httpResult = {}

  beforeEach(() => {
    httpResult = {}
    httpStatusCode = {}

    responseMock.status = jest.fn().mockImplementation((status) => {
      httpStatusCode = status
      responseMock.statusCode = status
      return responseMock
    })
    responseMock.json = jest.fn().mockImplementation((result) => {
      httpResult = result
      return responseMock
    })
  })

  describe('create', () => {
    test('should create user successfully when valid email address', async () => {
      // Arrange
      const request = { body: { email: dummyEmail } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)

      // Act
      await controller.create(request as Request, responseMock as Response)

      // Assert
      expect(httpStatusCode).toEqual(201)
      expect(httpResult).toEqual({ id: dummyId, email: dummyEmail })
    })

    test('should return unprocessible entity when invalid email address', async () => {
      // Arrange
      const request = { body: { email: 'invalid email' } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)

      // Act
      await controller.create(request as Request, responseMock as Response)

      // Assert
      expect(httpStatusCode).toEqual(422)
      expect(httpResult).toEqual({ error: 'Invalid email address' })
    })

    test('should return unprocessible entity when email address already exists', async () => {
      // Arrange
      const request = { body: { email: dummyEmail } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)
      repoMock.create = (_) => { throw new UniqueConstraintError({}) }

      // Act
      await controller.create(request as Request, responseMock as Response)

      // Assert
      expect(httpStatusCode).toEqual(422)
      expect(httpResult).toEqual({ error: 'Email already exists' })
    })

    test('should return bad request when an error is thrown', async () => {
      // Arrange
      const request = { body: { email: dummyEmail } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)
      repoMock.create = (_) => { throw new Error() }

      // Act
      await controller.create(request as Request, responseMock as Response)

      // Assert
      expect(httpStatusCode).toEqual(400)
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
      expect(httpStatusCode).toEqual(200)
      expect(httpResult).toEqual({ message: 'successfully deleted' })
    })

    test('should return bad request when failed to delete', async () => {
      // Arrange
      const request: Partial<Request> = { params: { userId: dummyId } }
      const controller = new UserController(repoMock as IUserRepository, fnUUID)
      repoMock.delete = (_) => { throw new Error() }

      // Act
      await controller.delete(request as Request, responseMock as Response)

      // Assert
      expect(httpStatusCode).toEqual(400)
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
      expect(httpStatusCode).toEqual(200)
      expect(httpResult).toEqual({
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
      expect(httpStatusCode).toEqual(404)
    })
  })
})
