import { Composer } from 'telegraf'

import { CustomContext } from '../context'
import Entity from './entity'
import Logger from './logger'
import TitleCommand from './title'

const helpMsg = `
<b>Help</b>

<b><i>Usage</i></b>:
/title :newTitle - Set a title
/help - Print this info

<b><i>Caution</i></b>:
Only users not promoted or promoted by this bot can get or change a title
`

const startMsg = `
<b><i>Usage</i></b>:
Give the bot permission to
1. Promote admin
2. Delete message (optional)

<b><i>Commands</i></b>
/title :newTitle - Set a title
/help - Print help info

<b><i>Note</i></b>:
Only users not promoted or promoted by this bot can get or change a title
With delete_message privilege, reply messages will be auto deleted
`

export default new Composer<CustomContext>()
  .use(Logger)
  .use(Entity)
  .help(async (ctx, next) => {
    await ctx.reply(helpMsg, { parse_mode: 'HTML' })
    await next()
  })
  .start(async (ctx, next) => {
    await ctx.reply(startMsg, { parse_mode: 'HTML' })
    await next()
  })
  .use(TitleCommand)
  .middleware()
