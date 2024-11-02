import { Bot } from './bot/BotType.js';
import { Helper } from './helper/helper.js';
global.helper = new Helper(process.cwd());
global.bot = new Bot({
    botName: '小企鹅',
    master: 1125404308,
    prefix: ['.', '. '],
    group: [460048859, 673172432],
});
bot.connect();
//# sourceMappingURL=index.js.map