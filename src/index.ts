import express from 'express'

import bot from './bot'

const app = express()
const port = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use(bot.webhookCallback('/iausdgiuahduioahuioahduio'))
app.listen(port, () => {
  console.log(`Bot is running on ${port}`)
})