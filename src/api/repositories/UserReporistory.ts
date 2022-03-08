import { Event, User } from '../models'

export interface IUserRepository {
  get: (userId: string) => Promise<User | null>
  create: ({ id, email }: { id: string, email: string }) => Promise<User | null>
  delete: (userId: string) => Promise<void>
}

export class UserReporistory implements IUserRepository {
  public async get (userId: string): Promise<User | null> {
    return await User.findByPk(userId, { include: Event, order: [] }) // TODO: find a way to order explicitly
  }

  public async create ({ id, email }: { id: string, email: string}): Promise<User | null> {
    return await User.create({ id, email })
  }

  public async delete (userId: string): Promise<void> {
    await User.destroy({
      where: {
        id: userId
      }
    })
  }
}
