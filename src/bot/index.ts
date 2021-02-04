import { config } from 'dotenv'
import { Context, Telegraf } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

import composedMiddlewares from './middlewares'
import { CommandType } from './middlewares/entity'

config()

const token = process.env.BOT_TOKEN
const delete_sec = parseInt(process.env.MESSAGE_DELETE_SECONDS) || 10

if (!token) throw new Error('Add `BOT_TOKEN` to .env in root')

export interface CustomContext extends Context {
  isAdmin?: () => Promise<Boolean>
  command?: CommandType
  replyTo?: (text: string) => Promise<unknown>
  setTitle?: (title: string) => Promise<boolean>
}

const bot = new Telegraf<CustomContext>(token)
  .use(async (ctx, next) => {
    const meInGroup = await ctx.getChatMember(ctx.botInfo.id)
    ctx.isAdmin = async () =>
      ['creator', 'administrator'].includes(meInGroup.status)

    ctx.replyTo = async text => {
      const extra: ExtraReplyMessage = ctx.message
        ? { reply_to_message_id: ctx.message?.message_id }
        : {}
      extra.parse_mode = 'HTML'
      await ctx
        .reply(
          text +
            `\n\n<i> This message wil be deleted in ${delete_sec} seconds </i>`,
          extra,
        )
        .then(x =>
          setTimeout(
            () =>
              meInGroup.can_delete_messages &&
              ctx.telegram.deleteMessage(ctx.chat.id, x.message_id),
            delete_sec * 1000,
          ),
        )
    }

    ctx.setTitle = async title => {
      try {
        return await ctx.setChatAdministratorCustomTitle(ctx.from.id, title)
      } catch (e) {
        ctx.replyTo(`Failed: ${e.message}`)
        return false
      }
    }

    await next()
  })
  .use(async (ctx, next) => {
    console.log(
      `[${ctx.updateType}] @${ctx.from.username ?? 'Unknown'} => ${
        ctx.message?.message_id
      }@${await ctx.chat.id}`,
    )
    await next()
  })
  .on('text', async (ctx, next) => {
    console.log(
      `[Text] @${ctx.from.username ?? 'Unknown'}: ${ctx.message.text}`,
    )
    await next()
  })
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
