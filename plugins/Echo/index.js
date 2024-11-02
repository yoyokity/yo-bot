import { Structs } from 'node-napcat-ts'

bot.addPlugin({
    /**
     * 插件名称
     * @type {string}
     */
    name: 'echo',
    /**
     * 插件作者
     * @type {string}
     */
    author: 'yoyokity',
    /**
     * 版本
     * @type {string}
     */
    version: '1.0.0',
    /**
     * 描述，作为help输出
     * @type {string}
     */
    description: '简单的复读插件，仅用于私聊',
    /**
     * 指令描述，作为help输出。
     * 一个指令对应一个{}，commandKey不需要写指令前缀
     * @type {{ commandKey: string, help: string }[]}
     */
    commandHelp: [{
        commandKey: '复读',
        help: '复读后面跟的消息'
    }],

    /**
     * 监听message事件
     * @param {Message} message
     */
    async onMessage (message) {
        if (!message.isPrivate) return

        if (helper.checkCommand(message, '复读')) {
            const match = message.messageRaw.match(/复读(.*)/)
            if (match) {
                let text = match[1].trim()
                if (text === '') return
                await bot.Api.sendMessage(text, message.senderId,false)
            }
        }
    },
    /**
     * 监听request事件
     * @param {Message} request
     */
    async onRequest (request) {},
    /**
     * 监听notice事件
     * @param {Message} notice
     */
    async onNotice (notice) {},
})