import { Pathlib } from './Pathlib.js'
import { Logging } from './logging.js'
import { Message } from '../bot/MessageType.js'
import { JSONlib } from './JSONlib.js'
import type { PluginInterface } from '../bot/interface.js'

export class Helper {
    private readonly _path: Pathlib
    private readonly _logging: Logging
    private readonly _jsonLib: JSONlib

    constructor (appDir: string) {
        this._path = new Pathlib(appDir)
        console.log(`appDir: ${appDir}`)

        this._jsonLib = new JSONlib()

        //log目录
        let logDir = this._path.appDir.join('log')
        this._path.createPath(logDir.str)
        this._logging = new Logging(logDir)

        console.log(`logDir: ${logDir.str}`)
    }

    get path () {
        return this._path
    }

    get logging () {
        return this._logging
    }

    get json () {
        return this._jsonLib
    }

    /**
     * 检查消息是否包含命令
     * @param  message 目标消息
     * @param  command 命令
     * @param  [only=false] 文本中只包含了命令
     * @param  [atMe=false] 是否艾特了机器人
     */
    public checkCommand (message: Message, command: string | [string], only: boolean = false, atMe: boolean = false): boolean {
        if (atMe && !message.isAtSelf) return false
        if (typeof command === 'string') command = [command]

        for (let msg of message.message) {
            if (msg.type !== 'text') continue

            let text = msg.data.text.trim()
            const check = only
                ? (text: string) => bot.prefix.some((prefix: string) =>
                    command.some(cmd => text === prefix + cmd))
                : (text: string | string[]) => bot.prefix.some((prefix: string) =>
                    command.some(cmd => text.includes(prefix + cmd)))

            if (only && !atMe && message.message.length !== 1) return false
            if (check(text)) return true
        }

        return false
    }

    /**
     * 获取插件的data路径，如果未创建则创建一个
     * @param plugin 插件
     */
    public getPluginDataPath (plugin: PluginInterface): string {
        let path = this._path.appDir.join('data', plugin.name)
        this._path.createPath(path.str)
        return path.str
    }
}