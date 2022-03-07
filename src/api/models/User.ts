import { Table, Column, Model, DataType, PrimaryKey, Unique, HasMany } from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize/types'
import { Event } from './Event'
@Table
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
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
