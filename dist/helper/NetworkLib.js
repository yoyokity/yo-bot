import { got } from 'got';
export class NetworkLib {
    /**
     * 从网络获取图片数据
     */
    async getImage(url) {
        if (!url.startsWith('http'))
            url = 'https://' + url;
        try {
            const response = await got(url, {
                responseType: 'buffer',
            });
            return response.body;
        }
        catch (error) {
            helper.logging.error(`获取图片失败：${url}`, error);
        }
        return null;
    }
}
//# sourceMappingURL=NetworkLib.js.map