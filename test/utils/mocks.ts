import { Response } from 'express'

export function mockResponse (responseMock: Partial<Response>, result: {statusCode: object, json: object}): void {
  responseMock.status = jest.fn().mockImplementation((status) => {
    result.statusCode = status
    return responseMock
  })

  responseMock.json = jest.fn().mockImplementation((body) => {
    result.json = body
    return responseMock
  })
}
