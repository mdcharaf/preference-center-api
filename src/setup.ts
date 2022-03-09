import _ from 'lodash'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { User, Event } from './api/models'
import dbConfig from './config/database'

export async function setupSequelize (): Promise<void> {
  const env: string = process.env.ENV ?? 'development'

  const options: SequelizeOptions = {
    dialect: 'postgres',
    host: _.get(dbConfig, env).host,
    database: _.get(dbConfig, env).database,
    username: _.get(dbConfig, env).username,
    password: _.get(dbConfig, env).password
  }

  try {
    const sequelize = new Sequelize(options)
    await sequelize.authenticate()
    sequelize.addModels([User, Event])
    await sequelize.sync()
    console.log('Connection has been established successfully')
  } catch (error) {
    console.error('Error setting up sequelize ORM', error)
  }
}
