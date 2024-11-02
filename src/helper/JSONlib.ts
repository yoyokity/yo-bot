import fs from 'fs'

export class JSONlib {

    /**
     * 读取json文件
     * @param file 文件路径
     */
    read (file: string): any {
        try {
            let path = helper.path.new(file)
            if (!path.isExist) {
                helper.logging.warn(`json文件不存在：${file}`)
                return null
            }
            const data = fs.readFileSync(path.str, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            helper.logging.error('读取json文件失败：', error)
            return null
        }
    }

    /**
     * 写入json文件
     * @param file 文件路径
     * @param data 对象数据
     */
    write (file: string, data: any): boolean {
        try {
            //确保目录存在
            let path = helper.path.new(file)
            if (!path.isExist) {
                helper.path.createPath(path.str)
            }

            const jsonData = JSON.stringify(data, null, 2)
            fs.writeFileSync(path.str, jsonData, 'utf8')
            return true
        } catch (error) {
            helper.logging.error('写入json文件失败：', error)
            return false
        }
    }
}