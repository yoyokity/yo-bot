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
     * @param [beautify=true] 是否美化输出
     */
    write(file: string, data: any, beautify?: boolean): boolean;
}
