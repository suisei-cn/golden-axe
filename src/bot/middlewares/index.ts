import { Composer } from 'telegraf'

import Entity from './entity'
import TitleCommand from './title'

export default new Composer().use(Entity).use(TitleCommand).middleware()
