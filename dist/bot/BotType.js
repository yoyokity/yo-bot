import { NCWebsocket } from 'node-napcat-ts';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { pathToFileURL } from 'url';
import { Message } from './MessageType.js';
import { Api } from './ApiType.js';
export class Bot {
    instance;
    /** OneBot Api */
    Api;
    _debug;
    _host;
    _port;
    _master;
    _botName;
    _prefix;
    /** 允许的群组，null表示拉黑全部，[]表示接受全部 */
    group;
    /** 群组黑名单，[]表示无黑名单，先筛选group再筛选黑名单 */
    groupBlacklist;
    /** 允许的私聊，null表示拉黑全部，[]表示接受全部 */
    userBlacklist;
    /** 是否允许私聊 */
    canPrivate;
    /** 是否允许临时会话 */
    canTemporary;
    _plugins = new Map();
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
    constructor(config) {
        const { botName, host = '127.0.0.1', port = 3001, debug = false, prefix = ['.'], master, group = [], groupBlacklist = [], userBlacklist = [], canPrivate = true, canTemporary = false } = config;
        this.instance = new NCWebsocket({
            protocol: 'ws',
            host: host,
            port: port
        }, debug);
        this.Api = new Api(this);
        this._botName = botName;
        this._debug = debug;
        this._host = host;
        this._port = port;
        this._master = master;
        this._prefix = prefix;
        this.group = group;
        this.groupBlacklist = groupBlacklist;
        this.userBlacklist = userBlacklist;
        this.canPrivate = canPrivate;
        this.canTemporary = canTemporary;
    }
    async connect() {
        await this.loadPlugin();
        this.instance.on('message', (data) => {
            let message = new Message(data);
            if (!this._userFilter(message))
                return;
            //监听help信息
            if (helper.checkCommand(message, 'help', true)) {
                let text = `${this._botName}当前启用了以下插件：\n`;
                let index = 1;
                for (const plugin of this._plugins.values()) {
                    text += `${index}. ${plugin.name}\n`;
                    index++;
                }
                text += `查看具体插件操作可以在 help 指令后面加上插件名称或序号`;
                return;
            }
            //添加插件
            for (const plugin of this._plugins.values()) {
                plugin.onMessage(message);
            }
        });
        await this.instance.connect();
        helper.logging.success('成功连接到ws服务器', `${this.host}:${this.port}`);
    }
    /**
     * 添加插件
     */
    addPlugin(plugin) {
        this._plugins.set(plugin.name, plugin);
        helper.logging.success(`已加载插件：${plugin.name}`);
    }
    async loadPlugin() {
        const pluginPath = helper.path.appDir.join('plugins');
        if (!pluginPath.isExist)
            return;
        helper.logging.info('正在加载插件...');
        // 读取目录中的所有文件和子目录
        const items = fs.readdirSync(pluginPath.str);
        //遍历插件
        for (let item of items) {
            const itemPath = pluginPath.join(item);
            if (itemPath.isDir) {
                const packagePath = itemPath.join('package.json');
                // 检查package.json文件
                if (!packagePath.isExist)
                    return;
                const packageJson = helper.json.read(packagePath.str);
                if (!packageJson.enable)
                    return;
                // 获取index文件路径
                const indexPath = itemPath.join(packageJson.main);
                if (!indexPath.isExist)
                    return;
                //安装依赖
                if ('dependencies' in packageJson) {
                    helper.logging.info(`正在安装依赖:${itemPath.str}`);
                    const execAsync = promisify(exec);
                    try {
                        await execAsync('npm install', { cwd: itemPath.str });
                    }
                    catch (error) {
                        helper.logging.error(`安装错误: ${error}`);
                        return;
                    }
                }
                //依赖安装完成后导入
                const fileUrl = pathToFileURL(indexPath.str).href;
                await import(fileUrl);
            }
        }
    }
    /**
     * 是否开启了debug功能
     */
    get debug() {
        return this._debug;
    }
    /**
     * ws的地址
     */
    get host() {
        return this._host;
    }
    /**
     * ws的端口
     */
    get port() {
        return this._port;
    }
    /**
     * 机器人的主人QQ号
     */
    get master() {
        return this._master;
    }
    /**
     * 机器人名字
     */
    get botName() {
        return this._botName;
    }
    /**
     * 命令前缀
     */
    get prefix() {
        return this._prefix;
    }
    /**
     * 判断当前信息所属的用户或群组是否允许响应
     */
    _userFilter(message) {
        // 检查私聊和临时会话的权限
        if ((message.isPrivate && !this.canPrivate) || (message.isTemporary && !this.canTemporary)) {
            return false;
        }
        // 检查群组消息的权限
        if (message.isGroup) {
            if (!this.group?.includes(message.groupId) || this.groupBlacklist.includes(message.groupId)) {
                return false;
            }
        }
        // 检查私聊消息的用户黑名单
        return !(message.isPrivate && this.userBlacklist.includes(message.senderId));
    }
}
//# sourceMappingURL=BotType.js.map