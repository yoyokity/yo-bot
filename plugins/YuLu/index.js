import { Message } from '../../src/bot/MessageType.js'
import { output } from './output.js'
import { include } from './include.js'
import { globalState } from './globalState.js'

bot.addPlugin({
    name: '语录',
    author: 'yoyokity',
    version: '1.0.0',
    description: '用于记录群友逆天发言的东西，5秒内只能发送一条语录',
    commandHelp: [{
        commandKey: '收录',
        help: '引用目标消息即可收录，收录多条时引用转发消息并艾特语录者'
    }, {
        commandKey: '语录',
        help: '随机发送一条语录'
    }, {
        commandKey: '语录 @xx',
        help: '随机发送一条指定对象的语录'
    }, {
        commandKey: '语录 xx',
        help: '随机发送一条指定文本的语录'
    }],

    init () {
        globalState.init(bot.getPluginDataPath(this))
    },
    async onMessage (message) {
        if (!message.isGroup) return

        //收录
        if (message.replyId && message.commandCheck('收录')) {
            await include(message)
            return
        }

        //发送语录
        if (message.commandCheck('语录')) {
            await output(message)
        }
    },
    async onRequest (request) {},
    async onNotice (notice) {},
})