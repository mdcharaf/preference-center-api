import { Request, Response } from 'express'
import { UniqueConstraintError } from 'sequelize'
import UserController from '../../../src/api/controllers/UserController'
import { User } from '../../../src/api/models'
import { IUserRepository } from '../../../src/api/repositories'

describe('UserController', () => {
  const dummyEmail = 'test@test.com'
  const dummyId = '00000000-0000-0000-0000-000000000000'
  const fnUUID = (): string => dummyId
  const repoMock = {
    create: async ({ id, email }: { id: string, email: string }): Promise<User | null> => {
      const user: Partial<User> = { id, email, props: (): Partial<User> => ({ id, email }) }
      return await Promise.resolve(user as User)
    },
    delete: async (userId: string): Promise<void> => {}
  }
  let httpStatusCode = {}
  let httpResult = {}

  const responseMock: Partial<Response> = {}

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
      const request: Partial<Request> = { params: { userId: dummyId } }
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
})
