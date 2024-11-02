import { NCWebsocket } from 'node-napcat-ts';
import type { PluginInterface } from './interface.js';
import { Api } from './ApiType.js';
export declare class Bot {
    readonly instance: NCWebsocket;
    /** OneBot Api */
    readonly Api: Api;
    private readonly _debug;
    private readonly _host;
    private readonly _port;
    private readonly _master;
    private readonly _botName;
    private readonly _prefix;
    /** 允许的群组，null表示拉黑全部，[]表示接受全部 */
    group: number[] | null;
    /** 群组黑名单，[]表示无黑名单，先筛选group再筛选黑名单 */
    groupBlacklist: number[];
    /** 允许的私聊，null表示拉黑全部，[]表示接受全部 */
    userBlacklist: number[];
    /** 是否允许私聊 */
    canPrivate: boolean;
    /** 是否允许临时会话 */
    canTemporary: boolean;
    private _plugins;
    /**
     * 创建一个机器人实例
     * @param config - 机器人配置
     * @param config.botName - 机器人名字
     * @param config.master - 主人QQ号
     * @param [config.host='127.0.0.1'] - ws地址
     * @param [config.port=3001] - ws端口
     * @param [config.debug=false] - 是否启用调试模式
     * @param [config.prefix=['.']] - 命令前缀，一个数组元素对应一个
     * @param [config.group=[]] - 允许的群组，null表示拉黑全部，[]表示接受全部
     * @param [config.groupBlacklist=[]] - 群组黑名单，[]表示无黑名单，先筛选group再筛选黑名单
     * @param [config.userBlacklist=[]] - 用户黑名单，[]表示无黑名单
     * @param [config.canPrivate=true] - 是否允许私聊
     * @param [config.canTemporary=false] - 是否允许临时会话
     */
    constructor(config: {
        botName: string;
        master: number;
        host?: string;
        port?: number;
        debug?: boolean;
        prefix?: string[];
        group?: number[];
        groupBlacklist?: number[];
        userBlacklist?: number[];
        canPrivate?: boolean;
        canTemporary?: boolean;
    });
    connect(): Promise<void>;
    /**
     * 添加插件
     */
    addPlugin(plugin: PluginInterface): void;
    private loadPlugin;
    /**
     * 是否开启了debug功能
     */
    get debug(): boolean;
    /**
     * ws的地址
     */
    get host(): string;
    /**
     * ws的端口
     */
    get port(): number;
    /**
     * 机器人的主人QQ号
     */
    get master(): number;
    /**
     * 机器人名字
     */
    get botName(): string;
    /**
     * 命令前缀
     */
    get prefix(): string[];
    /**
     * 判断当前信息所属的用户或群组是否允许响应
     */
    private _userFilter;
}
