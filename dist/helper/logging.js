import fs from 'fs';
export class Logging {
    _logDir;
    constructor(logDir) {
        this._logDir = logDir;
    }
    /**
     * 获取 年-月-日
     */
    get date() {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    }
    getTime() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    writeFile(lineText) {
        const date = this.date;
        let filePath = this._logDir.join(`${date}.log`);
        if (!lineText.endsWith('\n'))
            lineText += '\n';
        fs.appendFileSync(filePath.str, lineText);
    }
    success(...message) {
        console.info(`[${this.getTime()}] [success]`, ...message);
        this.writeFile(`[${this.getTime()}] [success] ${message.join(' ')}`);
    }
    info(...message) {
        console.log(`[${this.getTime()}] [info]`, ...message);
        this.writeFile(`[${this.getTime()}] [info] ${message.join(' ')}`);
    }
    error(...message) {
        message = formatError(...message);
        console.error(`[${this.getTime()}] [error]`, ...message);
        this.writeFile(`[${this.getTime()}] [error] ${message.join(' ')}`);
    }
    warn(...message) {
        message = formatError(...message);
        console.warn(`[${this.getTime()}] [warn]`, ...message);
        this.writeFile(`[${this.getTime()}] [warn] ${message.join(' ')}`);
    }
}
/**
 * 格式化错误信息
 */
function formatError(...message) {
    message.forEach((value, index, array) => {
        if (typeof value === 'object' && 'stack' in value) {
            value = value.stack;
            value = value.replaceAll('file:///', '');
            array[index] = value;
        }
    });
    return message;
}
//# sourceMappingURL=logging.js.map