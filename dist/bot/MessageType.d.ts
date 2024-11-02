import { Receive } from 'node-napcat-ts';
export declare class Message {
    private readonly self_id;
    private readonly user_id;
    private readonly time;
    private readonly message_id;
    private readonly message_seq;
    private readonly real_id;
    private readonly _message;
    private readonly message_type;
    private readonly sender;
    private readonly raw_message;
    private readonly font;
    private readonly sub_type;
    private readonly group_id;
    constructor(message: any);
    /**
     * 消息结构体
     */
    get message(): Receive[keyof Receive][];
    /**
     * 消息文本
     */
    get messageRaw(): string;
    /**
     * 消息id
     */
    get messageId(): number;
    /**
     * 机器人qq号
     */
    get botId(): number;
    /**
     * 消息发送者的qq号
     */
    get senderId(): number;
    /**
     * 消息发送者的昵称
     */
    get senderName(): string;
    /**
     * 消息发送者的群名片
     */
    get senderCard(): string;
    /**
     * 是否为群组消息
     */
    get isGroup(): boolean;
    /**
     * 获取群号
     */
    get groupId(): number;
    /**
     * 是否为私聊消息
     */
    get isPrivate(): boolean;
    /**
     * 是否为临时对话
     */
    get isTemporary(): boolean;
    /**
     * 是否艾特了bot自己
     */
    get isAtSelf(): boolean;
    /**
     * 获取当前消息所回复的消息的id
     */
    get replyId(): number;
}
