import { Structs } from 'node-napcat-ts'
import { createImg } from '../img.js'
import { globalState } from '../globalState.js'

let nextTime = 0

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

/**
 * @param {Message} message
 * @return {Promise<void>}
 */
export async function output (message) {
    /**
     * @return {{}[]|null}
     */
    function read (pluginDataPath, all = false) {
        if (all) {
            let groups = globalState.publicGroups
            var data = []
            for (let group of groups) {
                if (group === message.groupId) continue
                let _data = helper.json.read(`${pluginDataPath}/${group}.json`)
                data.push(..._data)
            }
        } else {
            var data = helper.json.read(`${pluginDataPath}/${message.groupId}.json`)
        }
        if (!data) {
            message.replyMessage('未收录任何语录')
            return null
        }
        return data
    }

    let arg = message.commandGetArgs('语录')
    let data = read(globalState.dataPath)
    if (!data && !globalState.publicGroups.includes(message.groupId)) return

    //发送语录
    if (!arg) {
        if (!timeCheck()) return

        const chat = helper.math.randomArrayOnce(data)
        await send(chat, message)
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
            await send(chat, message)
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
            await send(chat, message)
            return
        }

        if (globalState.publicGroups.includes(message.groupId)) {
            data = read(globalState.dataPath, true)
        }

        const filteredData = data.filter(value => value.qqId === Number(id))
        if (filteredData.length > 0) {
            const chat = helper.math.randomArrayOnce(filteredData, false)
            await send(chat, message)
        } else {
            await message.replyMessage('未收录该用户语录')
        }
    }
}

export async function send (chat, message, text = '') {
    let yulu = chat.yulu
    let qqId = chat.qqId
    let replyId = chat.replyId
    let messageId = 0

    if (yulu.length === 1 && yulu[0].type === 'image') {
        //单张图片
        let img = `${globalState.dataImgPath}/${yulu[0].data.file}`
        if (text === '') {
            messageId = await message.replyMessage([Structs.image(img)])
        } else {
            messageId = await message.replyMessage([Structs.image(img), Structs.text(text)])
        }
    } else {
        //正常语录
        let headImg = await bot.Api.getHeadImage(qqId)
        let a = await bot.Api.getGroupMemberInfo(message.groupId, qqId)
        let nickName = a.card || a.nickname

        let img = await createImg(yulu, nickName, headImg, message.groupId, bot)
        if (text === '') {
            messageId = await message.replyMessage([Structs.image(img)])
        } else {
            messageId = await message.replyMessage([Structs.image(img), Structs.text(text)])
        }
    }

    globalState.sendHistory[messageId] = replyId
    globalState.saveSendHistory()
}