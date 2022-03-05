import { NextFunction, Request, Response } from 'express'

export default class UserController {
  public addUser (req: Request, res: Response, _: NextFunction): void {
    res.send('Adding User...')
  }
}
