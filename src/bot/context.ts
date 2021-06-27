import { Context, Middleware } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

import { CommandType } from './middlewares/entity'

const delete_sec = parseInt(process.env.MESSAGE_DELETE_SECONDS) || 10

export interface CustomContext extends Context {
  isAdmin?: () => Promise<Boolean>
  command?: CommandType
  replyTo?: (text: string) => Promise<unknown>
  setTitle?: (title: string) => Promise<boolean>
}

export const SetupContextMiddleware: Middleware<CustomContext> = async (ctx, next) => {
  const meInChat = await ctx.getChatMember(ctx.botInfo.id)
  ctx.isAdmin = async () =>
    ['creator', 'administrator'].includes(meInChat.status)

  ctx.replyTo = async text => {
    const extra: ExtraReplyMessage = ctx.message
      ? { reply_to_message_id: ctx.message?.message_id }
      : {}
    extra.parse_mode = 'HTML'
    ctx
      .reply(
        text +
          (meInChat.can_delete_messages
            ? `\n\n<i> This message wil be deleted in ${delete_sec} seconds </i>`
            : `\n\n<i> With delete_message privilege, I can auto delete this message</i>`),
        extra,
      )
      .then(x =>
        setTimeout(
          () =>
            meInChat.can_delete_messages &&
            ctx.telegram.deleteMessage(ctx.chat.id, x.message_id),
          delete_sec * 1000,
        ),
      )
  }

  ctx.setTitle = async title => {
    try {
      return await ctx.setChatAdministratorCustomTitle(ctx.from.id, title)
    } catch (e) {
      ctx.replyTo?.(`Failed: ${e.message}`)
      return false
    }
  }

  await next()
}