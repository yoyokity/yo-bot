export declare class Path {
    private readonly _path;
    constructor(path: string);
    /**
     * 返回path的字符串形式
     */
    get str(): string;
    /**
     * 判断path是否存在于磁盘上
     */
    get isExist(): boolean;
    /**
     * 判断path是否为目录
     */
    get isDir(): boolean;
    /**
     * 判断path是否为文件
     */
    get isFile(): boolean;
    /**
     * 拼接路径
     */
    join(...paths: string[]): Path;
    /**
     * 完整文件名，非文件则抛出错误
     */
    get fileName(): string;
    /**
     * 文件后缀名，非文件则抛出错误
     */
    get extname(): string;
    /**
     * 无后缀文件名，非文件则抛出错误
     */
    get basename(): string;
    /**
     * 路径所在的父目录
     */
    get parent(): Path;
}
export declare class Pathlib {
    private readonly _appDir;
    constructor(appDir: string);
    new(path: string): Path;
    /**
     * 程序所在根目录
     */
    get appDir(): Path;
    /**
     * C盘的用户temp文件夹
     */
    get tempDir(): Path | null;
    /**
     * 是否为完整路径
     */
    isAbsolute(path: string): boolean;
    /**
     * 创建一个目录或文件。
     *
     * 如果path为目录且已创建，则忽略；path为文件且已创建，则覆盖
     * @param path 要创建的路径
     */
    createPath(path: string): void;
    /**
     * 在一个路径中搜索文件
     *
     * @param dirPath 搜索路径
     * @param [extensions=[]] 要搜索的文件扩展名的数组，例如 ['.txt', '.jpg']。
     * @param [recursive=false] 是否递归子目录查找文件。
     * @return {string[]} 表示所有文件的路径的数组。
     */
    searchFiles(dirPath: string, extensions?: string[], recursive?: boolean): string[];
    /**
     * 删除文件或文件夹
     */
    delete(path: string): void;
    /**
     * 移动或复制文件
     * @param sourceFile 源文件
     * @param [targetPath=''] 新文件所在文件夹路径，默认空为原文件夹
     * @param [newFileName=''] 新文件名（不包含后缀名），默认空为原文件名
     * @param [isCopy=false] 是否为复制，默认移动文件
     * @returns {Promise<void>}
     */
    moveFile(sourceFile: string, targetPath?: string, newFileName?: string, isCopy?: boolean): Promise<void>;
}
