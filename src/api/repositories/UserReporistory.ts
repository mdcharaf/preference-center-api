import { Event, IUser, User } from '../models'

export interface IUserRepository {
  get: (userId: string) => Promise<User | null>
  create: (userInput: IUser) => Promise<User>
  delete: (userId: string) => Promise<void>
}

export class UserReporistory implements IUserRepository {
  public async get (userId: string): Promise<User | null> {
    return await User.findByPk(userId, { include: Event, order: [] }) // TODO: find a way to order explicitly
  }

  public async create (userInput: IUser): Promise<User> {
    const result = await User.create(userInput)
    return result
  }

  public async delete (userId: string): Promise<void> {
    await User.destroy({
      where: {
        id: userId
      }
    })
  }
}
