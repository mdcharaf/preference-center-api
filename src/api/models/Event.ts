import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { User } from './User'

export interface IEvent {
  id: string
  consentId: string
  enabled: boolean
  userId: string
}

@Table
// export class Event extends Model<InferAttributes<Event, { omit: 'user' }>, InferCreationAttributes<Event, { omit: 'user'}>> {
export class Event extends Model<IEvent, IEvent> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  public id: string = '00000000-0000-0000-0000-000000000000'

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
