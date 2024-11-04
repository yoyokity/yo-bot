import { Pathlib } from './Pathlib.js';
import { Logging } from './logging.js';
import { Message } from '../bot/MessageType.js';
import { JSONlib } from './JSONlib.js';
import type { PluginInterface } from '../bot/interface.js';
import { Mathlib } from './Mathlib.js';
export declare class Helper {
    private readonly _path;
    private readonly _logging;
    private readonly _jsonLib;
    private readonly _math;
    constructor(appDir: string);
    get path(): Pathlib;
    get logging(): Logging;
    get json(): JSONlib;
    get math(): Mathlib;
    /**
     * 获取当前时间戳
     */
    get now(): number;
    /**
     * 检查消息是否包含命令
     * @param  message 目标消息
     * @param  command 命令
     * @param  [only=false] 文本中只包含了命令
     * @param  [atMe=false] 是否艾特了机器人
     */
    checkCommand(message: Message, command: string | [string], only?: boolean, atMe?: boolean): boolean;
    /**
     * 获取插件的data路径，如果未创建则创建一个
     * @param plugin 插件
     */
    getPluginDataPath(plugin: PluginInterface): string;
}
