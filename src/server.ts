import express from 'express'

(() => {
  const app = express()
  const port = process.env.PORT ?? 8080

  app.get('/', (_, res) => {
    res.send('api/v0')
  })

  app.listen(port, () => {
    console.log(`🚀 Server ready at port ${port}`)
  })
})()
