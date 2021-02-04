import { config } from 'dotenv'
import { Context, Telegraf } from 'telegraf'

import composedMiddlewares from './middlewares'
import { CommandType } from './middlewares/entity'

config()

const token = process.env.BOT_TOKEN

if (!token) throw new Error('Add `BOT_TOKEN` to .env in root')

export interface CustomContext extends Context {
  isAdmin?: () => Promise<Boolean>
  command?: CommandType
  replyTo?: (text: string) => Promise<unknown>
}

const bot = new Telegraf<CustomContext>(token)

bot.use(async (ctx, next) => {
  const now = +new Date()
  ctx.isAdmin = async () =>
    await ctx
      .getChatMember(ctx.botInfo.id)
      .then(x => ['creator', 'administrator'].includes(x.status))
  // ctx.telegram.getMe().then(console.log)

  ctx.replyTo = async text =>
    await ctx.reply(text, { reply_to_message_id: ctx.message?.message_id })

  await next()
  console.log(`Request handled. Used ${+new Date() - now} ms`)
})

bot.use(async (ctx, next) => {
  console.log(
    `${ctx.from.username ?? 'Unknown'} => ${ctx.message.message_id}@${
      ctx.chat.id
    }`,
  )
  await next()
})

bot.use(composedMiddlewares)

bot.catch(async (err, ctx) => {
  await ctx.reply(`Internal Error. Please contact @Pop_gg`)
  console.log(err, ctx)
})

export default bot