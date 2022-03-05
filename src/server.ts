import express from 'express'
import { AppRouter } from './api/routes'

(() => {
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
