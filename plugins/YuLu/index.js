import { output } from './command/output.js'
import { include } from './command/include.js'
import { globalState } from './globalState.js'
import { admin } from './command/admin.js'
import { del } from './command/delete.js'

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
    }, {
        commandKey: '删除语录',
        help: '(仅限群主) 引用bot的语录消息即可删除目标语录'
    }, {
        commandKey: '开放语录',
        help: '(仅限群主) 开关本群权限，指定对象发送语录时可获取其在别的群的语录，开启后本群语录也将流出'
    }],

    init () {
        globalState.init(bot.getPluginDataPath(this))
    },
    async onMessage (message) {
        if (!message.isGroup) return

        //管理员指令
        if (message.commandCheck('开放语录')) {
            await admin(message)
            return
        }
        if (message.commandCheck('删除语录')) {
            await del(message)
            return
        }

        //收录
        if (message.commandCheck('收录')) {
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