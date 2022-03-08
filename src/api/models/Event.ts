import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize/types'
import { User } from './User'

@Table
export class Event extends Model<InferAttributes<Event, { omit: 'user' }>, InferCreationAttributes<Event, { omit: 'user'}>> {
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

  @BelongsTo(() => User)
  public user!: User

  props (): Partial<Event> {
    return {
      consentId: this.consentId,
      enabled: this.enabled,
      userId: this.userId
    }
  }
}
