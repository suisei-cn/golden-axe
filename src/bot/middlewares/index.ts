import { Composer } from 'telegraf'

import { CustomContext } from '../index'
import Entity from './entity'
import TitleCommand from './title'

const helpMsg = `
<b>Help</b>

<b><i>Usage</i></b>:
/title :newTitle - Set a title
/help - Print this info

<b><i>Caution</i></b>:
Only users not promoted or promoted by this bot can get or change a title
`

export default new Composer<CustomContext>()
  .use(Entity)
  .help(async ctx => {
    await ctx.reply(helpMsg, { parse_mode: 'HTML' })
  })
  .use(TitleCommand)
  .middleware()
