import { Bot } from './bot/BotType.js';
import { Helper } from './helper/helper.js';
global.helper = new Helper(process.cwd());
let config = helper.json.read(helper.path.appDir.join('config.json').str);
config = Object.fromEntries(Object.entries(config).filter(([key, value]) => value !== null));
global.bot = new Bot(config);
bot.connect();
//# sourceMappingURL=index.js.map