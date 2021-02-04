import { Composer } from 'telegraf'

export default new Composer().use(async (ctx, next) => {
    console.log(
      `[${ctx.updateType}] @${ctx.from.username ?? 'Unknown'} => ${
        ctx.message?.message_id
      }@${await ctx.chat.id}`,
    )
    await next()
  }).on('text', async (ctx, next) => {
    console.log(
      `[Text] @${ctx.from.username ?? 'Unknown'}: ${ctx.message.text}`,
    )
    await next()
  }).middleware()