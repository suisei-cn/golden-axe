import { Composer } from 'telegraf'
import { ExtraPromoteChatMember } from 'telegraf/typings/telegram-types'

import { CustomContext } from '../index'

const minimumPrivilege: ExtraPromoteChatMember = {
  can_change_info: false,
  can_edit_messages: false,
  can_delete_messages: false,
  can_pin_messages: false,
  can_invite_users: true,
  can_post_messages: false,
  can_promote_members: false,
  can_restrict_members: false,
  is_anonymous: false,
}

export default new Composer<CustomContext>().command(
  'title',
  async (ctx, next) => {
    const me = await ctx.getChatMember(ctx.botInfo.id)
    const userID = ctx.from.id
    if (!me.can_promote_members) {
      await ctx.reply("Sorry I don't have the privilege to promote")
      console.log('NO PRIVILEGE')
      return
    }
    const user = await ctx.getChatMember(userID)
    const title = ctx.command.args
    if (!title) {
      await ctx.reply('Wrong format. Usage: `/title :newTitle`')
      console.log('WRONG FORMAT')
      return
    }
    if (user.status === 'administrator') {
      if (!user.can_be_edited) {
        await ctx.reply(
          "Sorry I can't change your info, contact creator or the admin who promotes you.",
        )
        console.log('CANNOT CHANGE INFO')
        return
      }
      await ctx.setChatAdministratorCustomTitle(userID, title)
      await ctx.replyTo('Done!')
    } else if (user.status === 'creator') {
      await ctx.reply("Don't be naughty")
      console.log('NICE TRY CREATOR')
      return
    } else if (user.status === 'member') {
      await ctx.promoteChatMember(userID, minimumPrivilege)
      await ctx.setChatAdministratorCustomTitle(userID, title)
      await ctx.replyTo('Done!')
    }
  },
)
