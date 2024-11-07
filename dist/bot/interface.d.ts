import type { Message } from './MessageType.js';
export interface PluginInterface {
    /**
     * 插件名称
     */
    name: string;
    /**
     * 插件作者
     */
    author: string;
    /**
     * 版本
     */
    version: string;
    /**
     * 描述，作为help输出
     */
    description: string;
    /**
     * 指令描述，作为help输出。
     *
     * 一个指令对应一个{}，commandKey不需要写指令前缀
     */
    commandHelp: {
        commandKey: string;
        help: string;
    }[];
    /**
     * 插件初始化
     */
    init: () => void;
    /** 监听message事件 */
    onMessage: (message: Message) => Promise<void>;
    /** 监听request事件 */
    onRequest: (request: any) => Promise<void>;
    /** 监听notice事件 */
    onNotice: (notice: any) => Promise<void>;
}
export interface GroupMemberInfo {
    group_id: number;
    user_id: number;
    nickname: string;
    card: string;
    sex: 'unknown' | 'male' | 'female';
    age: number;
    area: string;
    level: number;
    qq_level: number;
    join_time: number;
    last_sent_time: number;
    title_expire_time: number;
    unfriendly: boolean;
    card_changeable: boolean;
    is_robot: boolean;
    shut_up_timestamp: number;
    role: 'owner' | 'admin' | 'member';
    title: string;
}
export interface QQInfo {
    user_id: number;
    uid: string;
    nickname: string;
    age: number;
    qid: string;
    qqLevel: number;
    sex: 'female' | 'male' | 'unknown';
    long_nick: string;
    reg_time: number;
    is_vip: boolean;
    is_years_vip: boolean;
    vip_level: number;
    remark: string;
    status: number;
    login_days: number;
}
export interface GroupInfo {
    group_id: number;
    group_name: string;
    member_count: number;
    max_member_count: number;
}
export interface FriendInfo {
    qid: string;
    longNick: string;
    birthday_year: number;
    birthday_month: number;
    birthday_day: number;
    age: number;
    sex: string;
    eMail: string;
    phoneNum: string;
    categoryId: number;
    richTime: number;
    richBuffer: {
        [p: string]: number;
    };
    uid: string;
    uin: string;
    nick: string;
    remark: string;
    user_id: number;
    nickname: string;
    level: number;
}
