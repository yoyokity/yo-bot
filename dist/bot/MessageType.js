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
     * 获取当前消息所回复的消息的id
     */
    get replyId() {
        const found = this.message?.find(item => item.type === 'reply');
        return found ? Number(found.data['id']) : 0;
    }
}
//# sourceMappingURL=MessageType.js.map