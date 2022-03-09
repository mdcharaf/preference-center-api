import { Table, Column, Model, DataType, PrimaryKey, Unique, HasMany } from 'sequelize-typescript'
import { Event } from './Event'

export interface IUser {
  id?: string
  email: string
}
@Table
// export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
export class User extends Model<IUser, IUser> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  public id?: string

  @Unique
  @Column({ type: DataType.STRING })
  public email!: string

  @HasMany(() => Event)
  public events?: Event[]

  props (): Partial<User> {
    return {
      id: this.id,
      email: this.email,
      events: this.events
    }
  }
}
