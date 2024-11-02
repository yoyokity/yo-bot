import { got } from 'got';
import { Message } from './MessageType.js';
export class Api {
    _instance;
    constructor(bot) {
        this._instance = bot.instance;
    }
    /**
     * 发送消息
     * @param structsText 要发送的消息
     * @param id 发送对象为群组时id指群号，为私聊时id指QQ号
     * @param [isGroup=true] 对象是否为群组，否则为私聊
     * @return {Promise<number>} 返回本条发送的消息的id
     */
    async sendMessage(structsText, id, isGroup = true) {
        const config = isGroup
            ? { group_id: id, message: structsText }
            : { user_id: id, message: structsText };
        const re = await this._instance.send_msg(config);
        return re['message_id'];
    }
    /**
     * 通过消息id获取消息内容
     * @param id 消息id
     */
    async getMessage(id) {
        const re = await this._instance.get_msg({ message_id: id });
        return new Message(re);
    }
    /**
     * 撤回消息
     * @param {number} id 消息id
     */
    async deleteMessage(id) {
        await this._instance.delete_msg({ message_id: id });
    }
    /**
     * 通过QQ号获取头像
     * @param {number} id QQ号
     * @return {Promise<Buffer | null>} 返回图片的raw数据
     */
    async getHeadImage(id) {
        const imgUrl = `http://q.qlogo.cn/headimg_dl?dst_uin=${id}&spec=640&img_type=jpg`;
        try {
            const response = await got(imgUrl, {
                responseType: 'buffer',
            });
            return response.body;
        }
        catch (error) {
            helper.logging.error(`获取头像失败：${imgUrl}`, error);
        }
        return null;
    }
    /**
     * 获取某个群成员信息
     * @param groupId 群号
     * @param memberId 群成员QQ号
     */
    async getGroupMemberInfo(groupId, memberId) {
        return await this._instance.get_group_member_info({
            group_id: groupId,
            user_id: memberId,
        });
    }
    /**
     * 获取机器人QQ信息
     */
    async getBotInfo() {
        return await this._instance.get_login_info();
    }
    /**
     * 获取机器人在群组中是否有管理员权限
     * @param groupId 群号
     */
    async getBotAdminInfo(groupId) {
        const re = await this.getBotInfo();
        const memberInfo = await this.getGroupMemberInfo(groupId, re.user_id);
        return memberInfo.role === 'admin';
    }
    /**
     * 获取某个QQ号的信息
     * @param id QQ号
     */
    async getQQInfo(id) {
        return await this._instance.get_stranger_info({ user_id: id });
    }
    /**
     * 获取群信息
     * @param id 群号
     */
    async getGroupInfo(id) {
        return await this._instance.get_group_info({ group_id: id });
    }
    /**
     * 获取好友列表
     */
    async getFriendList() {
        return await this._instance.get_friend_list();
    }
    /**
     * 获取QQ群列表
     */
    async getGroupList() {
        return await this._instance.get_group_list();
    }
    /**
     * 获取群成员列表
     * @param id 群号
     */
    async getGroupMemberList(id) {
        let re = await this._instance.get_group_member_list({ group_id: id });
        return re;
    }
    /**
     * 获取群禁言列表
     * @param id 群号
     */
    async getGroupShutList(id) {
        const list = await this.getGroupMemberList(id);
        return list.filter((value) => value.shut_up_timestamp > 0);
    }
    /**
     * 用于其他一些api的调用
     */
    get instance() {
        return this._instance;
    }
    /**
     * 群组踢人
     * @param groupId 群号
     * @param memberId 被踢人QQ号
     * @param refuseToJoin 是否拒绝再次入群请求
     */
    async setGroupKick(groupId, memberId, refuseToJoin = false) {
        await this._instance.set_group_kick({
            group_id: groupId,
            user_id: memberId,
            reject_add_request: refuseToJoin,
        });
    }
    /**
     * 群组单人禁言
     * @param groupId 群号
     * @param memberId 被禁言人QQ号
     * @param duration 禁言时长，单位秒，0为取消禁言
     */
    async setGroupBan(groupId, memberId, duration = 600) {
        await this._instance.set_group_ban({
            group_id: groupId,
            user_id: memberId,
            duration: duration,
        });
    }
    /**
     * 群组全体禁言
     * @param groupId 群号
     * @param enable 是否禁言
     */
    async setGroupWholeBan(groupId, enable = true) {
        await this._instance.set_group_whole_ban({
            group_id: groupId,
            enable: enable,
        });
    }
    /**
     * 群组设置管理员
     * @param groupId 群号
     * @param memberId 管理员QQ号
     * @param enable true 为设置，false 为取消
     */
    async setGroupAdmin(groupId, memberId, enable = true) {
        await this._instance.set_group_admin({
            group_id: groupId,
            user_id: memberId,
            enable: enable,
        });
    }
    /**
     * 设置成员群名片
     * @param groupId 群号
     * @param memberId 群成员QQ号
     * @param card 群名片
     */
    async setGroupCard(groupId, memberId, card = '') {
        await this._instance.set_group_card({
            group_id: groupId,
            user_id: memberId,
            card: card,
        });
    }
    /**
     * 设置群名
     * @param groupId 群号
     * @param name 群名
     */
    async setGroupName(groupId, name) {
        await this._instance.set_group_name({
            group_id: groupId,
            group_name: name,
        });
    }
    /**
     * 退出群组
     * @param groupId 群号
     */
    async setGroupLeave(groupId) {
        await this._instance.set_group_leave({
            group_id: groupId,
        });
    }
    /**
     * 设置群组专属头衔
     * @param groupId 群号
     * @param memberId 群成员QQ号，不填或空字符串表示删除专属头衔
     * @param title 群组专属头衔
     */
    async setGroupSpecialTitle(groupId, memberId, title = '') {
        await this._instance.set_group_special_title({
            group_id: groupId,
            user_id: memberId,
            special_title: title,
        });
    }
}
//# sourceMappingURL=ApiType.js.map