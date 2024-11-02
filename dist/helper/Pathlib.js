import path_module from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
export class Path {
    _path;
    constructor(path) {
        this._path = path_module.resolve(path);
    }
    /**
     * 返回path的字符串形式
     */
    get str() {
        return path_module.normalize(this._path);
    }
    /**
     * 判断path是否存在于磁盘上
     */
    get isExist() {
        return fs.existsSync(this._path);
    }
    /**
     * 判断path是否为目录
     */
    get isDir() {
        if (this.isExist) {
            return fs.statSync(this._path).isDirectory();
        }
        else {
            return path_module.extname(this._path) === '';
        }
    }
    /**
     * 判断path是否为文件
     */
    get isFile() {
        if (this.isExist) {
            return fs.statSync(this._path).isFile();
        }
        else {
            return path_module.extname(this._path) !== '';
        }
    }
    /**
     * 拼接路径
     */
    join(...paths) {
        const basePath = this.isFile ? this.parent.str : this._path;
        return new Path(path_module.join(basePath, ...paths));
    }
    /**
     * 完整文件名，非文件则抛出错误
     */
    get fileName() {
        if (this.isDir)
            throw new Error(`"${this._path}" is not a file`);
        return path_module.basename(this._path);
    }
    /**
     * 文件后缀名，非文件则抛出错误
     */
    get extname() {
        if (this.isDir)
            throw new Error(`"${this._path}" is not a file`);
        return path_module.extname(this._path);
    }
    /**
     * 无后缀文件名，非文件则抛出错误
     */
    get basename() {
        if (this.isDir)
            throw new Error(`"${this._path}" is not a file`);
        return path_module.basename(this._path, this.extname);
    }
    /**
     * 路径所在的父目录
     */
    get parent() {
        return new Path(path_module.dirname(this._path));
    }
}
export class Pathlib {
    _appDir;
    constructor(appDir) {
        this._appDir = appDir;
    }
    new(path) {
        return new Path(path);
    }
    /**
     * 程序所在根目录
     */
    get appDir() {
        return new Path(this._appDir);
    }
    /**
     * C盘的用户temp文件夹
     */
    get tempDir() {
        const { TEMP } = process.env;
        return TEMP ? new Path(TEMP) : null;
    }
    /**
     * 是否为完整路径
     */
    isAbsolute(path) {
        return path_module.isAbsolute(path);
    }
    /**
     * 创建一个目录或文件。
     *
     * 如果path为目录且已创建，则忽略；path为文件且已创建，则覆盖
     * @param path 要创建的路径
     */
    createPath(path) {
        const basePath = new Path(path);
        try {
            if (basePath.isDir) {
                if (!basePath.isExist)
                    fs.mkdirSync(basePath.str, { recursive: true });
            }
            else if (basePath.isFile) {
                const fileDir = basePath.parent;
                if (!fileDir.isExist) {
                    fs.mkdirSync(fileDir.str, { recursive: true });
                }
                if (basePath.isExist) {
                    fs.unlinkSync(basePath.str);
                }
                fs.writeFileSync(basePath.str, '');
            }
            else {
                throw new Error(`"${path}" is not a directory or file`);
            }
        }
        catch (e) {
            helper.logging.error(`"${path}" create failed: ${e}`);
        }
    }
    /**
     * 在一个路径中搜索文件
     *
     * @param dirPath 搜索路径
     * @param [extensions=[]] 要搜索的文件扩展名的数组，例如 ['.txt', '.jpg']。
     * @param [recursive=false] 是否递归子目录查找文件。
     * @return {string[]} 表示所有文件的路径的数组。
     */
    searchFiles(dirPath, extensions = [], recursive = false) {
        const allFiles = [];
        const basePath = new Path(dirPath);
        if (!basePath.isDir)
            throw new Error(`${dirPath} is not a directory`);
        function traverseDir(currentDir) {
            const files = fs.readdirSync(currentDir.str);
            files.forEach(file => {
                const filePath = currentDir.join(file);
                if (filePath.isFile) {
                    if (!extensions || extensions.includes(filePath.extname))
                        allFiles.push(filePath.str);
                }
                else if (filePath.isDir) {
                    traverseDir(filePath);
                }
            });
        }
        traverseDir(basePath);
        return allFiles;
    }
    /**
     * 删除文件或文件夹
     */
    delete(path) {
        const basePath = new Path(path);
        if (!basePath.isExist)
            return;
        if (basePath.isDir) {
            try {
                fs.rmdirSync(basePath.str, { recursive: true });
            }
            catch (e) {
                helper.logging.error(`delete "${path}" failed: ${e}`);
            }
        }
        else if (basePath.isFile) {
            try {
                fs.unlinkSync(basePath.str);
            }
            catch (e) {
                helper.logging.error(`delete "${path}" failed: ${e}`);
            }
        }
    }
    /**
     * 移动或复制文件
     * @param sourceFile 源文件
     * @param [targetPath=''] 新文件所在文件夹路径，默认空为原文件夹
     * @param [newFileName=''] 新文件名（不包含后缀名），默认空为原文件名
     * @param [isCopy=false] 是否为复制，默认移动文件
     * @returns {Promise<void>}
     */
    async moveFile(sourceFile, targetPath = '', newFileName = '', isCopy = false) {
        //检查原路径
        const sourceFilePath = new Path(sourceFile);
        if (!sourceFilePath.isExist)
            return;
        if (sourceFilePath.isDir)
            return;
        //检查新路径
        if (targetPath === '')
            targetPath = sourceFilePath.parent.str;
        let targetDirectoryPath = new Path(targetPath);
        if (!targetDirectoryPath.isExist)
            this.createPath(targetPath);
        if (targetDirectoryPath.isFile)
            targetDirectoryPath = targetDirectoryPath.parent;
        if (newFileName === '')
            newFileName = sourceFilePath.basename;
        let extname = sourceFilePath.extname;
        let targetFilePath = targetDirectoryPath.join(newFileName + extname);
        if (sourceFilePath.str === targetFilePath.str)
            return;
        //复制文件
        if (isCopy) {
            try {
                await fs.promises.copyFile(sourceFilePath.str, targetFilePath.str);
                return;
            }
            catch (error) {
                helper.logging.error('Error copy file:', error);
            }
        }
        //移动文件
        let com = process.platform === 'win32' ? 'move' : 'mv';
        try {
            execSync(`${com} "${sourceFilePath.str}" "${targetFilePath.str}"`);
        }
        catch (e) {
            helper.logging.error('Error moving file:', e);
        }
    }
}
//# sourceMappingURL=Pathlib.js.map