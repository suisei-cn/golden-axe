import { config } from 'dotenv'
import { Telegraf } from 'telegraf'

import { CustomContext, SetupContextMiddleware } from './context'
import composedMiddlewares from './middlewares'

config()

const token = process.env.BOT_TOKEN


if (!token) throw new Error('Add `BOT_TOKEN` to .env in root')

const bot = new Telegraf<CustomContext>(token)
  .use(SetupContextMiddleware)
  .use(composedMiddlewares)
  .catch(async (err, ctx) => {
    const error = err as Error
    await ctx.telegram.sendMessage(
      698868349,
      `<b>[${ctx.updateType}]  @${ctx.from.username ?? 'Unknown'} @ ${
        ctx.chat.id
      }</b>
      <pre>${error.stack}</pre>`,
      {
        parse_mode: 'HTML',
      },
    )
    await ctx.replyTo('Internal Error. Error detail reported.')
    console.log(err)
  })
export default bot
