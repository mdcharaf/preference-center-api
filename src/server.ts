import express from 'express'
import { AppRouter } from './api/routes'
import bodyParser from 'body-parser'
import { setupSequelize } from './setup'

(async () => {
  await setupSequelize()

  const app = express()
  const port = process.env.PORT ?? 8080

  app.use(bodyParser.json())
  app.use('/api', AppRouter)

  app.listen(port, () => {
    console.log(`🚀 Server ready at port ${port}`)
  })
})()
  .then(() => {})
  .catch((err) => console.error('Error starting server', err))
