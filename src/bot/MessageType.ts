import { GroupMessage, MessageType, PrivateFriendMessage, PrivateGroupMessage, Receive, Send } from 'node-napcat-ts'

export class Message {
    private readonly self_id: number
    private readonly user_id: number
    private readonly time: number
    private readonly message_id: number
    private readonly message_seq: number
    private readonly real_id: number
    private readonly _message: Receive[keyof Receive][]
    private readonly message_type: 'private' | 'group'
    private readonly sender: {
        user_id: number;
        nickname: string;
        card: string;
        role?: 'owner' | 'admin' | 'member';
    }
    private readonly raw_message: string
    private readonly font: number
    private readonly sub_type: 'friend' | 'group' | 'normal'
    private readonly group_id: number = 0

    constructor (message: any) {
        this.self_id = message.self_id
        this.user_id = message.user_id
        this.time = message.time
        this.message_id = message.message_id
        this.message_seq = message.message_seq
        this.real_id = message.real_id
        this._message = message.message
        this.message_type = message.message_type
        this.sender = message.sender
        this.raw_message = message.raw_message
        this.font = message.font
        this.sub_type = message.sub_type
        this.group_id = message.group_id
    }

    /**
     * 消息结构体
     */
    get message (): Receive[keyof Receive][] {
        return this._message
    }

    /**
     * 消息文本
     */
    get messageRaw (): string {
        return this.raw_message
    }

    /**
     * 消息id
     */
    get messageId (): number {
        return this.message_id
    }

    /**
     * 机器人qq号
     */
    get botId (): number {
        return this.self_id
    }

    /**
     * 消息发送者的qq号
     */
    get senderId (): number {
        return this.user_id
    }

    /**
     * 消息发送者的昵称
     */
    get senderName (): string {
        return this.sender?.nickname || ''
    }

    /**
     * 消息发送者的群名片
     */
    get senderCard (): string {
        return this.sender?.card || ''
    }

    /**
     * 是否为群组消息
     */
    get isGroup (): boolean {
        return this.message_type === 'group'
    }

    /**
     * 获取群号
     */
    get groupId (): number {
        return this.group_id || 0
    }

    /**
     * 是否为私聊消息
     */
    get isPrivate (): boolean {
        return this.message_type === 'private' && this.sub_type === 'friend'
    }

    /**
     * 是否为临时对话
     */
    get isTemporary (): boolean {
        return this.message_type === 'private' && this.sub_type === 'group'
    }

    /**
     * 是否艾特了bot自己
     */
    get isAtSelf (): boolean {
        return this.message?.some(message =>
            message.type === 'at' && message.data['qq'] === String(this.self_id)
        ) || false
    }

    /**
     * 获取当前消息所回复的消息的id
     */
    get replyId (): number {
        const found = this.message?.find(item => item.type === 'reply')
        return found ? Number(found.data['id']) : 0
    }
}