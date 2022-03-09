import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { User, Event } from './api/models'

export async function setupSequelize (): Promise<void> {
  const sequelize = new Sequelize({
    database: 'didomi', // TODO: should use environment variables with config file setup
    host: 'localhost',
    dialect: 'postgres'
  } as unknown as SequelizeOptions)

  try {
    await sequelize.authenticate()
    sequelize.addModels([User, Event])
    await sequelize.sync()
    console.log('Connection has been established successfully')
  } catch (error) {
    console.error('Error setting up sequelize ORM', error)
  }
}
