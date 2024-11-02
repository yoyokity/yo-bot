import { Structs } from 'node-napcat-ts'
import { createImg } from './img.js'

bot.addPlugin({
    /**
     * 插件名称
     * @type {string}
     */
    name: '语录',
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
    description: '用于记录群友逆天发言的东西。',
    /**
     * 指令描述，作为help输出。
     * 一个指令对应一个{}，commandKey不需要写指令前缀
     * @type {{ commandKey: string, help: string }[]}
     */
    commandHelp: [{
        commandKey: '收录',
        help: '在目标消息下回复即可收录'
    }, {
        commandKey: '语录',
        help: '随机发送一条语录'
    }, {
        commandKey: '语录 @xx',
        help: '随机发送一条指定对象的语录'
    }],

    /**
     * 监听message事件
     * @param {Message} message
     */
    async onMessage (message) {
        if (!message.isGroup) return

        //收录
        if (message.replyId && helper.checkCommand(message, '收录')) {
            //获取消息
            let replyMessage = await bot.Api.getMessage(message.replyId)
            if (!replyMessage) {
                bot.Api.sendMessage('获取不到想要收录的消息', message.groupId)
                return
            }

            //解析消息并储存
            let qqId = replyMessage.senderId
            let yulu = replyMessage.message.filter((value, index, array) => {
                return ['text', 'at'].includes(value.type)
            })

            let jsonPath = `${helper.getPluginDataPath(this)}/${message.groupId}.json`
            /** @type {{}[]} */
            let data = helper.json.read(jsonPath)
            if (!data) {
                data = []
            } else {
                for (let datum of data) {
                    if (datum.replyId === message.replyId) {
                        bot.Api.sendMessage('已经收录过该条语录', message.groupId)
                        return
                    }
                }
            }
            data.push({ replyId: message.replyId, qqId, yulu })

            if (helper.json.write(jsonPath, data,false)) {
                let headImg = await bot.Api.getHeadImage(qqId)
                let a = await bot.Api.getGroupMemberInfo(message.groupId, qqId)
                let nickName = a.card || a.nickname
                let img = await createImg(yulu, nickName, headImg, message.groupId, bot)
                await bot.Api.sendMessage([Structs.image(img), Structs.text('收录成功')], message.groupId)
            } else {
                bot.Api.sendMessage('收录失败', message.groupId)
            }

            return
        }

        //发送语录
        /**
         * @return {{}[]|null}
         */
        function read (pluginDataPath) {
            let data = helper.json.read(`${pluginDataPath}/${message.groupId}.json`)
            if (!data) {
                bot.Api.sendMessage('未收录任何语录', message.groupId)
                return null
            }
            return data
        }

        async function send (data) {
            const chat = data[Math.floor(Math.random() * data.length)]
            let yulu = chat.yulu
            let qqId = chat.qqId
            let headImg = await bot.Api.getHeadImage(qqId)
            let a = await bot.Api.getGroupMemberInfo(message.groupId, qqId)
            let nickName = a.card || a.nickname

            let img = await createImg(yulu, nickName, headImg, message.groupId, bot)
            await bot.Api.sendMessage([Structs.image(img)], message.groupId)
        }

        const isOnlyCommand = helper.checkCommand(message, '语录', true)
        const isMentionCommand = helper.checkCommand(message, '语录', false)

        //语录
        if (isOnlyCommand) {
            const data = read(helper.getPluginDataPath(this))
            if (!data) return

            await send(data)
            return
        }
        //@某人的专属语录
        if (isMentionCommand && message.message.length === 2 && message.message[1].type === 'at') {
            const data = read(helper.getPluginDataPath(this))
            if (!data) return

            let id = message.message[1].data.qq
            if (id === 'all') {
                await send(data)
                return
            }

            const filteredData = data.filter(value => value.qqId === Number(id))
            if (filteredData.length > 0) {
                await send(filteredData)
            } else {
                bot.Api.sendMessage('未收录该用户语录', message.groupId)
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