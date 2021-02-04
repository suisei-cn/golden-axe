import bot from './bot'

console.log(process.argv)

if (process.argv[2].toLowerCase() === 'enable') {
  bot.telegram.setWebhook(
    'https://spheric-wonder-277302.nw.r.appspot.com/iausdgiuahduioahuioahduio',
  )
  console.log('Enabled')
} else {
  bot.telegram.deleteWebhook()
  console.log('Disabled')
}
