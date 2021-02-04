import { Composer } from 'telegraf'
import { MessageEntity } from 'telegraf/typings/telegram-types'

import { CustomContext } from '../context'

interface TextEntity extends MessageEntity.AbstractMessageEntity {
  type: 'text'
}
export type FullEntity = MessageEntity | TextEntity

const regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i

export interface CommandType {
  text: string
  command?: string
  bot?: string
  args?: string
  splitArgs: string[]
}

export default Composer.on<CustomContext, 'text'>('text', async (ctx, next) => {
  const parts = regex.exec(ctx.message.text.trim())
  if (!parts) await next()
  else {
    ctx.command = {
      text: ctx.message.text,
      command: parts[1],
      bot: parts[2],
      args: parts[3],
      get splitArgs() {
        return !parts[3] ? [] : parts[3].split(/\s+/).filter(arg => arg.length)
      },
    }
    await next()
  }
})
