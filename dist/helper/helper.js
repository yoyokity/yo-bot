import { Pathlib } from './Pathlib.js';
import { Logging } from './logging.js';
import { JSONlib } from './JSONlib.js';
export class Helper {
    _path;
    _logging;
    _jsonLib;
    constructor(appDir) {
        this._path = new Pathlib(appDir);
        console.log(`appDir: ${appDir}`);
        this._jsonLib = new JSONlib();
        //log目录
        let logDir = this._path.appDir.join('log');
        this._path.createPath(logDir.str);
        this._logging = new Logging(logDir);
        console.log(`logDir: ${logDir.str}`);
    }
    get path() {
        return this._path;
    }
    get logging() {
        return this._logging;
    }
    get json() {
        return this._jsonLib;
    }
    /**
     * 检查消息是否包含命令
     * @param  message 目标消息
     * @param  command 命令
     * @param  [only=false] 文本中只包含了命令
     * @param  [atMe=false] 是否艾特了机器人
     */
    checkCommand(message, command, only = false, atMe = false) {
        if (atMe && !message.isAtSelf)
            return false;
        if (typeof command === 'string')
            command = [command];
        for (let msg of message.message) {
            if (msg.type !== 'text')
                continue;
            let text = msg.data.text.trim();
            const check = only
                ? (text) => bot.prefix.some((prefix) => command.some(cmd => text === prefix + cmd))
                : (text) => bot.prefix.some((prefix) => command.some(cmd => text.includes(prefix + cmd)));
            if (only && !atMe && message.message.length !== 1)
                return false;
            if (check(text))
                return true;
        }
        return false;
    }
    /**
     * 获取插件的data路径，如果未创建则创建一个
     * @param plugin 插件
     */
    getPluginDataPath(plugin) {
        let path = this._path.appDir.join('data', plugin.name);
        this._path.createPath(path.str);
        return path.str;
    }
}
//# sourceMappingURL=helper.js.map