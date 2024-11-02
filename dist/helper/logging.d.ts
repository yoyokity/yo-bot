import type { Path } from './Pathlib.js';
export declare class Logging {
    private readonly _logDir;
    constructor(logDir: Path);
    /**
     * 获取 年-月-日
     */
    private get date();
    private getTime;
    private writeFile;
    success(...message: any[]): void;
    info(...message: any[]): void;
    error(...message: any[]): void;
    warn(...message: any[]): void;
}
