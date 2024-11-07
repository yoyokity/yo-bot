import { send } from './output.js'
import { globalState } from '../globalState.js'
import * as fs from 'node:fs'

function parseAt (message) {
    let args = message.commandGetArgs('收录')
    if (!args)
        return 0
    let qqId = 0
    for (let arg of args) {
        if (arg.type !== 'at') continue
        if (arg.data['qq'] === String(message.botId)) continue
        if (arg.data['qq'] === 'all') continue
        qqId = Number(arg.data['qq'])
        break
    }

    return qqId
}

async function downloadImg (url, fileName) {
    let buffer = await helper.newtwork.getImage(url)
    if (!buffer) return false

    let filePath = `${globalState.dataImgPath}/${fileName}`
    fs.writeFileSync(filePath, buffer)
}

/**
 * @param {Message} message
 * @return {Promise<void>}
 */
export async function include (message) {
    //获取消息
    let replyMessage = await bot.Api.getMessage(message.replyId)
    if (!replyMessage) {
        await message.replyMessage('获取不到想要收录的消息')
        return
    }

    //转发多条
    if (replyMessage.message[0].type === 'forward') {
        var qqId = parseAt(message)
        if (!qqId) {
            await message.replyMessage('收录多条时请@语录者')
            return
        }

        let content = replyMessage.message[0].data['content']
        let sender1 = content[0].user_id
        var yulu = []
        for (const v of content) {
            if (v.user_id !== sender1) continue
            yulu.push(...v.message.filter((value, index, array) => {
                return ['text', 'at'].includes(value.type)
            }))
        }
        yulu.forEach((value, index, array) => {
            if (value.type === 'text') {
                value.data.text = value.data.text.trim() + '\n\n'
            }
        })

    }

    //只有一张图片
    else if (replyMessage.message.length === 1 && replyMessage.message[0].type === 'image') {
        var qqId = parseAt(message)
        if (!qqId) {
            message.replyMessage('收录单张图片时请@语录者')
            return
        }

        let fileName = replyMessage.message[0].data['file_unique']
        let url = replyMessage.message[0].data['url']
        await downloadImg(url, fileName)

        var yulu = [replyMessage.message[0]]
        yulu[0].data = { file: fileName }
    }

    //单条
    else {
        var qqId = replyMessage.senderId
        var yulu = replyMessage.message.filter((value, index, array) => {
            return ['text', 'at', 'image'].includes(value.type)
        })

        for (let value of yulu) {
            if (value.type === 'image') {
                let fileName = value.data['file_unique']
                let url = value.data['url']
                await downloadImg(url, fileName)
                value.data = { file: fileName }
            }
        }
    }

    if (yulu.length === 0) return

    //写入json
    let jsonPath = `${globalState.dataPath}/${message.groupId}.json`
    /** @type {{}[]} */
    let data = helper.json.read(jsonPath)
    if (!data) {
        data = []
    } else {
        for (let datum of data) {
            if (datum.replyId === message.replyId) {
                await message.replyMessage('已经收录过该条语录')
                return
            }
        }
    }
    data.push({ replyId: message.replyId, qqId, yulu })

    if (helper.json.write(jsonPath, data, false)) {
        await send({ replyId: message.replyId, qqId, yulu }, message, '收录成功')
    } else {
        await message.replyMessage('收录失败')
    }
}