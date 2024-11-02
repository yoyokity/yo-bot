import { Bot } from './bot/BotType.js';
import { Helper } from './helper/helper.js';
declare global {
    var bot: Bot;
    var helper: Helper;
}
