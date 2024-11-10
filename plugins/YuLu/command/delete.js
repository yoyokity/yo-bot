import { globalState } from '../globalState.js'

/**
 * @param {Message} message
 * @return {Promise<void>}
 */
export async function del (message) {
    if (!(message.senderRole === 'owner' || message.senderId === bot.master)) {
        await message.replyMessage('只有群主有权限使用本条命令！')
        return
    }

    //获取消息
    if (!message.replyId) {
        await message.replyMessage('获取不到想要删除的语录')
        return
    }
    
    //获取语录id
    let yuluId = globalState.sendHistory[message.replyId] || null
    
    //删除语录
    let jsonPath = `${globalState.dataPath}/${message.groupId}.json`
    let data = helper.json.read(jsonPath) || []
    for (let datum of data) {
        if (datum.replyId === yuluId) {
            data.splice(data.indexOf(datum), 1)
            helper.json.write(jsonPath, data)
            await message.replyMessage('已删除该条语录')
            return
        }
    }
}