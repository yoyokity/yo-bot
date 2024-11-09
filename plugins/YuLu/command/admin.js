import { globalState } from '../globalState.js'

/**
 * @param {Message} message
 * @return {Promise<void>}
 */
export async function admin (message) {
    if (!(message.senderRole === 'owner' || message.senderId === bot.master)) {
        await message.replyMessage('只有群主有权限使用本条命令！')
        return
    }

    if (globalState.publicGroups.includes(message.groupId)) {
        globalState.publicGroups.splice(globalState.publicGroups.indexOf(message.groupId), 1)
        await message.replyMessage('已关闭本群的公开权限，现在只能查看本群语录。')
    } else {
        globalState.publicGroups.push(message.groupId)
        await message.replyMessage('已开启本群的公开权限，现在可以在@指定人的时候查看群友在其他群的语录了。当然，其他群也可以查看本群语录。')
    }
    globalState.savePublicGroups()
}