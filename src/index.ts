import { Bot } from './bot/BotType.js'
import { Helper } from './helper/helper.js'

declare global {
    var bot: Bot
    var helper: Helper
}

global.helper = new Helper(process.cwd())

const config = helper.json.read(helper.path.appDir.join('config.json').str)
global.bot = new Bot(config)
bot.connect()

