import express from 'express'
import { AppRouter } from './api/routes'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'

async function setupSequelize (): Promise<void> {
  const sequelize = new Sequelize({
    database: 'didomi',
    host: 'localhost',
    dialect: 'postgres',
    storage: ':memory:'
  } as unknown as SequelizeOptions)

  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

(async () => {
  await setupSequelize()

  const app = express()
  const port = process.env.PORT ?? 8080

  app.get('/', (_, res) => {
    res.send('Helloo')
  })

  app.use('/api', AppRouter)

  app.listen(port, () => {
    console.log(`🚀 Server ready at port ${port}`)
  })
})()
  .then(() => {})
  .catch((err) => console.error('Error starting server', err))
