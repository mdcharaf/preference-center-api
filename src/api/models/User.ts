import { Table, Column, Model, DataType } from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize/types'
@Table
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Column({ type: DataType.UUID, primaryKey: true })
  public id?: string

  @Column({ type: DataType.STRING, unique: true })
  public email!: string

  props (): Partial<User> {
    return {
      id: this.id,
      email: this.email
    }
  }
}
