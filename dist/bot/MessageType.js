import { Structs } from 'node-napcat-ts';
export class Message {
    self_id;
    user_id;
    time;
    message_id;
    message_seq;
    real_id;
    _message;
    message_type;
    sender;
    raw_message;
    font;
    sub_type;
    group_id = 0;
    constructor(message) {
        this.self_id = message.self_id;
        this.user_id = message.user_id;
        this.time = message.time;
        this.message_id = message.message_id;
        this.message_seq = message.message_seq;
        this.real_id = message.real_id;
        this._message = message.message;
        this.message_type = message.message_type;
        this.sender = message.sender;
        this.raw_message = message.raw_message;
        this.font = message.font;
        this.sub_type = message.sub_type;
        this.group_id = message.group_id;
    }
    /**
     * 消息结构体
     */
    get message() {
        return this._message;
    }
    /**
     * 消息文本
     */
    get messageRaw() {
        return this.raw_message;
    }
    /**
     * 消息id
     */
    get messageId() {
        return this.message_id;
    }
    /**
     * 机器人qq号
     */
    get botId() {
        return this.self_id;
    }
    /**
     * 消息发送者的qq号
     */
    get senderId() {
        return this.user_id;
    }
    /**
     * 消息发送者的昵称
     */
    get senderName() {
        return this.sender?.nickname || '';
    }
    /**
     * 消息发送者的群名片
     */
    get senderCard() {
        return this.sender?.card || '';
    }
    /**
     * 是否为群组消息
     */
    get isGroup() {
        return this.message_type === 'group';
    }
    /**
     * 获取群号
     */
    get groupId() {
        return this.group_id || 0;
    }
    /**
     * 是否为私聊消息
     */
    get isPrivate() {
        return this.message_type === 'private' && this.sub_type === 'friend';
    }
    /**
     * 是否为临时对话
     */
    get isTemporary() {
        return this.message_type === 'private' && this.sub_type === 'group';
    }
    /**
     * 是否艾特了bot自己
     */
    get isAtSelf() {
        return this.message?.some(message => message.type === 'at' && message.data['qq'] === String(this.self_id)) || false;
    }
    /**
     * 按顺序获取消息中被at的所有人，忽略艾特全体和艾特机器人
     */
    get atList() {
        let atList = [];
        this.message?.filter(message => message.type === 'at').forEach((value) => {
            if (value.data['qq'] === String(this.self_id))
                return;
            if (value.data['qq'] === 'all')
                return;
            atList.push(Number(value.data['qq']));
        });
        return atList;
    }
    /**
     * 获取当前消息所回复的消息的id
     */
    get replyId() {
        const found = this.message?.find(item => item.type === 'reply');
        return found ? Number(found.data['id']) : 0;
    }
    /**
     * 检查消息是否包含命令
     * @param command 命令（可多条）
     * @param [atStart=false] 命令是否在消息开头（除了回复引用）
     */
    commandCheck(command, atStart = false) {
        if (typeof command === 'string')
            command = [command];
        const check = (text) => bot.prefix.some((prefix) => command.some(cmd => text.includes(prefix + cmd)));
        let message = this.message.filter((value) => value.type !== 'reply');
        if (atStart) {
            if (message[0].type !== 'text')
                return false;
            let text = message[0].data.text;
            return bot.prefix.some((prefix) => command.some(cmd => text.startsWith(prefix + cmd)));
        }
        else {
            for (let value of message) {
                if (value.type !== 'text')
                    continue;
                if (check(value.data.text))
                    return true;
            }
        }
        return false;
    }
    /**
     * 检查消息是否只包含命令，(不含其余任何东西，除了回复引用)
     * @param command 命令（可多条）
     * @param [atMe=false] 是否艾特了机器人（不论艾特在命令前面还是后面）
     */
    commandCheckOnly(command, atMe = false) {
        if (typeof command === 'string')
            command = [command];
        const check = (text) => bot.prefix.some((prefix) => command.some(cmd => text === prefix + cmd));
        let message = this.message.filter((value) => value.type !== 'reply');
        if (atMe) {
            if (message.length !== 2)
                return false;
            if (message[0].type === 'at') {
                if (message[0].data['qq'] !== String(this.botId))
                    return false;
                if (message[1].type !== 'text')
                    return false;
                if (check(message[1].data.text.trim()))
                    return true;
            }
            if (message[0].type === 'text') {
                if (message[1].type !== 'at')
                    return false;
                if (message[1].data['qq'] !== String(this.botId))
                    return false;
                if (check(message[0].data.text.trim()))
                    return true;
            }
        }
        else {
            if (message.length !== 1)
                return false;
            if (message[0].type !== 'text')
                return false;
            if (check(message[0].data.text.trim()))
                return true;
        }
        return false;
    }
    /**
     * 获取命令后的内容
     * @param command 命令（可多条）
     * @return 如果获取到的只有文本，则去除两边空格后返回string，否则返回结构体，没有则返回null
     */
    commandGetArgs(command) {
        if (typeof command === 'string')
            command = [command];
        let outArgs = [];
        this.message.forEach((value, index, array) => {
            if (value.type !== 'text')
                return;
            let text = value.data.text;
            let sp = '';
            if (command.some((value) => {
                sp = value;
                return text.includes(value);
            })) {
                let end = text.split(sp)[1];
                if (end.trim() !== '') {
                    outArgs.push(Structs.text(end));
                }
                outArgs.push(...this.message.slice(index + 1));
                return;
            }
        });
        if (outArgs.length === 1 && outArgs[0].type === 'text') {
            return outArgs[0].data.text.trim();
        }
        return outArgs.length > 0 ? outArgs : null;
    }
    /**
     * 快速回复消息（自动判断群组和私聊）
     * @param structsText 回复的文本
     * @param [at=false] 是否艾特回复对象
     * @param [reply=false] 是否引用要回复的消息
     * @return {Promise<number>} 返回本条发送的消息的id
     */
    async replyMessage(structsText, at = false, reply = false) {
        let structs = [];
        if (reply)
            structs.push(Structs.reply(this.messageId));
        if (at)
            structs.push(Structs.at(this.senderId), Structs.text(' '));
        let text = structsText;
        if (typeof text === 'string')
            text = [Structs.text(text)];
        structs.push(...text);
        if (this.isGroup) {
            return bot.Api.sendMessage(structs, this.groupId);
        }
        else {
            return bot.Api.sendMessage(structs, this.senderId, false);
        }
    }
}
//# sourceMappingURL=MessageType.js.map