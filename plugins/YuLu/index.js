import { Structs } from 'node-napcat-ts'
import { createImg } from './img.js'
import { Message } from '../../src/bot/MessageType.js'

let nextTime = 0

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
    description: '用于记录群友逆天发言的东西，5秒内只能发送一条语录',
    /**
     * 指令描述，作为help输出。
     * 一个指令对应一个{}，commandKey不需要写指令前缀
     * @type {{ commandKey: string, help: string }[]}
     */
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

    /**
     * 监听message事件
     * @param {Message} message
     */
    async onMessage (message) {
        if (!message.isGroup) return

        console.log(message)
        //收录
        if (message.replyId && message.commandCheck('收录')) {
            //获取消息
            let replyMessage = await bot.Api.getMessage(message.replyId)
            if (!replyMessage) {
                message.replyMessage('获取不到想要收录的消息')
                return
            }

            //解析消息并储存
            if (replyMessage.message[0].type === 'forward'){
                //转发多条
                
                //获取语录者
                let args = message.commandGetArgs('收录')
                var qqId =0
                for (let arg of args) {
                    if (arg.type !== 'at' ) continue
                    if (arg.data['qq'] === String(message.botId)) continue
                    if (arg.data['qq'] === 'all') continue
                    qqId = Number(arg.data['qq'])
                    break
                }
                
                if (!qqId){
                    message.replyMessage('收录多条时请@语录者')
                    return
                }
                
                let content = replyMessage.message[0].data['content']
                let sender1 = content[0].user_id
                var yulu = []
                for (const v of content) {
                    /** @type {Message} */
                    let m = new Message(v)
                    if (m.senderId !== sender1) continue
                    yulu.push(...m.message.filter((value, index, array) => {
                        return ['text', 'at'].includes(value.type)
                    }))
                }
                yulu.forEach((value, index, array)=>{
                    if (value.type === 'text'){
                        value.data.text = value.data.text.trim()+'\n\n'
                    }
                })
                
            }else {
                //单条
                var qqId = replyMessage.senderId
                var yulu = replyMessage.message.filter((value, index, array) => {
                    return ['text', 'at'].includes(value.type)
                })
            }
            
            if (yulu.length === 0) return

            let jsonPath = `${bot.getPluginDataPath(this)}/${message.groupId}.json`
            /** @type {{}[]} */
            let data = helper.json.read(jsonPath)
            if (!data) {
                data = []
            } else {
                for (let datum of data) {
                    if (datum.replyId === message.replyId) {
                        message.replyMessage('已经收录过该条语录')
                        return
                    }
                }
            }
            data.push({ replyId: message.replyId, qqId, yulu })

            if (helper.json.write(jsonPath, data, false)) {
                let headImg = await bot.Api.getHeadImage(qqId)
                let a = await bot.Api.getGroupMemberInfo(message.groupId, qqId)
                let nickName = a.card || a.nickname
                let img = await createImg(yulu, nickName, headImg, message.groupId, bot)
                await message.replyMessage([Structs.image(img), Structs.text('收录成功')])
            } else {
                await message.replyMessage('收录失败')
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
                message.replyMessage('未收录任何语录')
                return null
            }
            return data
        }

        async function send (chat) {
            let yulu = chat.yulu
            let qqId = chat.qqId
            let headImg = await bot.Api.getHeadImage(qqId)
            let a = await bot.Api.getGroupMemberInfo(message.groupId, qqId)
            let nickName = a.card || a.nickname

            let img = await createImg(yulu, nickName, headImg, message.groupId, bot)
            await message.replyMessage([Structs.image(img)])
        }

        /**
         * 5秒内只能发送一条语录
         */
        function timeCheck () {
            if (helper.nowTime < nextTime) {
                return false
            }
            nextTime = helper.nowTime + 5 * 1000
            return true
        }

        //语录
        if (message.commandCheck('语录')) {
            let arg = message.commandGetArgs('语录')
            const data = read(bot.getPluginDataPath(this))
            if (!data) return

            //发送语录
            if (!arg) {
                if (!timeCheck()) return

                const chat = helper.math.randomArrayOnce(data)
                await send(chat)
                return
            }

            //指定语录
            if (typeof arg === 'string') {
                const filteredData = data.filter(value => {
                    const yulu = value.yulu
                    return yulu.some(yuluElement =>
                        yuluElement.type === 'text' && yuluElement.data.text.includes(arg)
                    )
                })

                if (filteredData.length > 0) {
                    if (!timeCheck()) return
                    const chat = helper.math.randomArrayOnce(filteredData, false)
                    await send(chat)
                } else {
                    await message.replyMessage('未收录指定语录')
                }
                return
            }

            //@某人的专属语录
            if (arg[0].type === 'at') {
                let id = arg[0].data.qq
                if (id === 'all') {
                    const chat = helper.math.randomArrayOnce(data)
                    await send(chat)
                    return
                }

                const filteredData = data.filter(value => value.qqId === Number(id))
                if (filteredData.length > 0) {
                    const chat = helper.math.randomArrayOnce(filteredData, false)
                    await send(chat)
                } else {
                    await message.replyMessage('未收录该用户语录')
                }
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