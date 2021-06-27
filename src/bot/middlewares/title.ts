import { Composer } from 'telegraf'
import { ExtraPromoteChatMember } from 'telegraf/typings/telegram-types'

import { CustomContext } from '../context'

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
      await ctx.replyTo("Sorry I don't have the privilege to promote")
      console.log('NO PRIVILEGE')
      return
    }
    const title = ctx.command.args
    if (!title) {
      await ctx.replyTo('Wrong format. Usage: `/title :newTitle`')
      console.log('WRONG FORMAT')
      return
    }
    const user = await ctx.getChatMember(userID)
    if (user.status === 'administrator') {
      if (!user.can_be_edited) {
        await ctx.replyTo(
          "Sorry I can't change your info, contact owner or the admin who promotes you.",
        )
        console.log('CANNOT CHANGE INFO')
        return
      }
      await ctx.setTitle(title)
      await ctx.replyTo('Done!  It may take a while for the title to show up.')
    } else if (user.status === 'creator') {
      await ctx.replyTo("Don't be naughty")
      console.log('NICE TRY CREATOR')
      return
    } else if (user.status === 'member') {
      await ctx.promoteChatMember(userID, minimumPrivilege)
      await ctx.setTitle(title)
      await ctx.replyTo('Done! It may take a while for the title to show up.')
    }
  },
)
