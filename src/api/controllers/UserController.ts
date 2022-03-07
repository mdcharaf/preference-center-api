import { Request, Response } from 'express'
import { User } from '../models/User'
import { v4 as uuid } from 'uuid'

export default class UserController {
  public async addUser (req: Request, res: Response): Promise<void> {
    const user = await User.create({
      id: uuid(),
      email: 'test@test.com',
      password: 'test'
    })
    res.send(user.props())
  }
}
