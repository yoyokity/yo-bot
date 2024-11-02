export declare class JSONlib {
    /**
     * 读取json文件
     * @param file 文件路径
     */
    read(file: string): any;
    /**
     * 写入json文件
     * @param file 文件路径
     * @param data 对象数据
     */
    write(file: string, data: any): boolean;
}
