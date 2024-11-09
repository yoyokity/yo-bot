import { Receive, Send } from 'node-napcat-ts';
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
     * 消息发送者的群权限
     */
    get senderRole(): 'owner' | 'admin' | 'member';
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
     * 按顺序获取消息中被at的所有人，忽略艾特全体和艾特机器人
     */
    get atList(): number[];
    /**
     * 获取当前消息所回复的消息的id
     */
    get replyId(): number;
    /**
     * 检查消息是否包含命令
     * @param command 命令（可多条）
     * @param [atStart=false] 命令是否在消息开头（除了回复引用）
     */
    commandCheck(command: string | [string], atStart?: boolean): boolean;
    /**
     * 检查消息是否只包含命令，(不含其余任何东西，除了回复引用)
     * @param command 命令（可多条）
     * @param [atMe=false] 是否艾特了机器人（不论艾特在命令前面还是后面）
     */
    commandCheckOnly(command: string | [string], atMe?: boolean): boolean;
    /**
     * 获取命令后的内容
     * @param command 命令（可多条）
     * @return 如果获取到的只有文本，则去除两边空格后返回string，否则返回结构体，没有则返回null
     */
    commandGetArgs(command: string | [string]): string | Receive[keyof Receive][] | null;
    /**
     * 快速回复消息（自动判断群组和私聊）
     * @param structsText 回复的文本
     * @param [at=false] 是否艾特回复对象
     * @param [reply=false] 是否引用要回复的消息
     * @return {Promise<number>} 返回本条发送的消息的id
     */
    replyMessage(structsText: Send[keyof Send][] | string, at?: boolean, reply?: boolean): Promise<number>;
}
