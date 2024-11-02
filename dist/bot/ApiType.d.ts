import { NCWebsocket, Send } from 'node-napcat-ts';
import { Message } from './MessageType.js';
import type { FriendInfo, GroupInfo, GroupMemberInfo, QQInfo } from './interface.js';
export declare class Api {
    private readonly _instance;
    constructor(bot: any);
    /**
     * 发送消息
     * @param structsText 要发送的消息
     * @param id 发送对象为群组时id指群号，为私聊时id指QQ号
     * @param [isGroup=true] 对象是否为群组，否则为私聊
     * @return {Promise<number>} 返回本条发送的消息的id
     */
    sendMessage(structsText: Send[keyof Send][] | string, id: number, isGroup?: boolean): Promise<number>;
    /**
     * 通过消息id获取消息内容
     * @param id 消息id
     */
    getMessage(id: number): Promise<Message>;
    /**
     * 撤回消息
     * @param {number} id 消息id
     */
    deleteMessage(id: number): Promise<void>;
    /**
     * 通过QQ号获取头像
     * @param {number} id QQ号
     * @return {Promise<Buffer | null>} 返回图片的raw数据
     */
    getHeadImage(id: number): Promise<Buffer | null>;
    /**
     * 获取某个群成员信息
     * @param groupId 群号
     * @param memberId 群成员QQ号
     */
    getGroupMemberInfo(groupId: number, memberId: number): Promise<GroupMemberInfo>;
    /**
     * 获取机器人QQ信息
     */
    getBotInfo(): Promise<{
        user_id: number;
        nickname: string;
    }>;
    /**
     * 获取机器人在群组中是否有管理员权限
     * @param groupId 群号
     */
    getBotAdminInfo(groupId: number): Promise<boolean>;
    /**
     * 获取某个QQ号的信息
     * @param id QQ号
     */
    getQQInfo(id: number): Promise<QQInfo>;
    /**
     * 获取群信息
     * @param id 群号
     */
    getGroupInfo(id: number): Promise<GroupInfo>;
    /**
     * 获取好友列表
     */
    getFriendList(): Promise<FriendInfo[]>;
    /**
     * 获取QQ群列表
     */
    getGroupList(): Promise<GroupInfo[]>;
    /**
     * 获取群成员列表
     * @param id 群号
     */
    getGroupMemberList(id: number): Promise<GroupMemberInfo[]>;
    /**
     * 获取群禁言列表
     * @param id 群号
     */
    getGroupShutList(id: number): Promise<GroupMemberInfo[]>;
    /**
     * 用于其他一些api的调用
     */
    get instance(): NCWebsocket;
    /**
     * 群组踢人
     * @param groupId 群号
     * @param memberId 被踢人QQ号
     * @param refuseToJoin 是否拒绝再次入群请求
     */
    setGroupKick(groupId: number, memberId: number, refuseToJoin?: boolean): Promise<void>;
    /**
     * 群组单人禁言
     * @param groupId 群号
     * @param memberId 被禁言人QQ号
     * @param duration 禁言时长，单位秒，0为取消禁言
     */
    setGroupBan(groupId: number, memberId: number, duration?: number): Promise<void>;
    /**
     * 群组全体禁言
     * @param groupId 群号
     * @param enable 是否禁言
     */
    setGroupWholeBan(groupId: number, enable?: boolean): Promise<void>;
    /**
     * 群组设置管理员
     * @param groupId 群号
     * @param memberId 管理员QQ号
     * @param enable true 为设置，false 为取消
     */
    setGroupAdmin(groupId: number, memberId: number, enable?: boolean): Promise<void>;
    /**
     * 设置成员群名片
     * @param groupId 群号
     * @param memberId 群成员QQ号
     * @param card 群名片
     */
    setGroupCard(groupId: number, memberId: number, card?: string): Promise<void>;
    /**
     * 设置群名
     * @param groupId 群号
     * @param name 群名
     */
    setGroupName(groupId: number, name: string): Promise<void>;
    /**
     * 退出群组
     * @param groupId 群号
     */
    setGroupLeave(groupId: number): Promise<void>;
    /**
     * 设置群组专属头衔
     * @param groupId 群号
     * @param memberId 群成员QQ号，不填或空字符串表示删除专属头衔
     * @param title 群组专属头衔
     */
    setGroupSpecialTitle(groupId: number, memberId: number, title?: string): Promise<void>;
}
