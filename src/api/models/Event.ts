import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize/types'
import { User } from './User'

@Table
export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  public id?: string

  @Column({ type: DataType.STRING })
  public consentId!: string

  @Column({ type: DataType.BOOLEAN })
  public enabled!: boolean

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  public userId!: string

  props (): Partial<Event> {
    return {
      consentId: this.consentId,
      enabled: this.enabled
    }
  }
}
