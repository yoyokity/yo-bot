import { Pathlib } from './Pathlib.js';
import { Logging } from './logging.js';
import { JSONlib } from './JSONlib.js';
import { Mathlib } from './Mathlib.js';
import { NetworkLib } from './NetworkLib.js';
export declare class Helper {
    private readonly _path;
    private readonly _logging;
    private readonly _jsonLib;
    private readonly _math;
    private readonly _newtwork;
    constructor(appDir: string);
    /**
     * 路径相关
     */
    get path(): Pathlib;
    /**
     * 日志相关
     */
    get logging(): Logging;
    /**
     * json相关
     */
    get json(): JSONlib;
    /**
     * 数学相关
     */
    get math(): Mathlib;
    /**
     * 获取当前时间戳
     */
    get nowTime(): number;
    /**
     * 网络相关
     */
    get newtwork(): NetworkLib;
}
