import { Bot } from './bot/BotType.js'
import { Helper } from './helper/helper.js'

declare global {
    var bot: Bot
    var helper: Helper
}

global.helper = new Helper(process.cwd())

let config = helper.json.read(helper.path.appDir.join('config.json').str)
config = Object.fromEntries(
    Object.entries(config).filter(([key, value]) => value !== null)
)

global.bot = new Bot(config)
bot.connect()

