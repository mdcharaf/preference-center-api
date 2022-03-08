
import { Response, Request } from 'express'
import { ForeignKeyConstraintError } from 'sequelize'
import EventController from '../../../src/api/controllers/EventController'
import { Event } from '../../../src/api/models'
import { IEventRepository } from '../../../src/api/repositories'
import { mockResponse } from '../../utils/mocks'

describe('EventController', () => {
  const dummyId = '00000000-0000-0000-0000-000000000000'
  const testEvents: Array<Partial<Event>> = [
    { id: dummyId, consentId: 'email_notifications', enabled: true, userId: dummyId },
    { id: dummyId, consentId: 'sms_notifications', enabled: false, userId: dummyId }
  ]
  const fnUUID = (): string => dummyId
  const repoMock = {
    create: async ({ consentId, userId, enabled }: Event): Promise<Event> => {
      const event: Partial<Event> = { id: dummyId, consentId, userId, enabled, props: (): Partial<Event> => ({ id: dummyId, consentId, userId, enabled }) }
      return await Promise.resolve(event as Event)
    }
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
    for (const testEvent of testEvents) {
      test('should create event successfully when valid parameters', async () => {
        // Arrange
        const request = { body: testEvent }
        const controller = new EventController(repoMock as IEventRepository, fnUUID)

        // Act
        await controller.create(request as Request, responseMock as Response)

        // Assert
        expect(result.statusCode).toEqual(201)
        expect(result.json).toEqual({
          id: testEvent.id,
          consentId: testEvent.consentId,
          userId: testEvent.userId,
          enabled: testEvent.enabled
        })
      })
    }

    test('should throw error when consent id is out of range', async () => {
      // Arrange
      const request = { body: { ...testEvents[0], consentId: 'dummy' } }
      const controller = new EventController(repoMock as IEventRepository, fnUUID)

      // Act
      await controller.create(request as Request, responseMock as Response)

      // Assert
      expect(result.statusCode).toEqual(422)
      expect(result.json).toEqual({ error: 'Invalid consentId value. Consent should be either "sms_notifications" or "email notifications"' })
    })
  })

  test('should throw error when invalid user id', async () => {
    // Arrange
    const request = { body: { ...testEvents[0] } }
    const controller = new EventController(repoMock as IEventRepository, fnUUID)
    repoMock.create = _ => { throw new ForeignKeyConstraintError({}) }

    // Act
    await controller.create(request as Request, responseMock as Response)

    // Assert
    expect(result.statusCode).toEqual(400)
    expect(result.json).toEqual({ error: 'Invalid user id' })
  })
})
