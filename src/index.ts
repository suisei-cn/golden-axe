import express from 'express'

import bot from './bot'

const app = express()

app.get('/', (_, res) => {
  res.send('Hello World')
})

app.use(bot.webhookCallback('/iausdgiuahduioahuioahduio'))
app.listen(process.env.PORT, () => {
  console.log(`Bot is running on ${process.env.PORT}`)
})