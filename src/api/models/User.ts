import { Table, Column, Model, PrimaryKey, CreatedAt, UpdatedAt } from 'sequelize-typescript'

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Column
  public id!: any

  @Column
  public email!: string

  @Column
  public password!: string

  @Column
  @CreatedAt
  public createdAt: Date = new Date()

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date()

  props (): Partial<User> {
    return {
      id: this.id as string,
      email: this.email
    }
  }
}
