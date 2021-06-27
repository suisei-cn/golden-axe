import HttpsProxyAgent from 'https-proxy-agent/dist/agent'
import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN
  , {
  telegram: {
    agent: new HttpsProxyAgent('http://192.168.47.177:7890')
  }
})

console.log(process.argv);

(async () => {
  if (process.argv[2].toLowerCase() === 'enable') {
    await bot.telegram.setWebhook(
      'https://spheric-wonder-277302.nw.r.appspot.com/iausdgiuahduioahuioahduio',
    )
    const data = await bot.telegram.getWebhookInfo()
    console.log('Enabled')
    console.log(data)
  } else {
    bot.telegram.deleteWebhook()
    console.log('Disabled')
  }
})()