import { Pathlib } from './Pathlib.js'
import { Logging } from './logging.js'
import { JSONlib } from './JSONlib.js'
import { Mathlib } from './Mathlib.js'

export class Helper {
    private readonly _path: Pathlib
    private readonly _logging: Logging
    private readonly _jsonLib: JSONlib
    private readonly _math: Mathlib

    constructor (appDir: string) {
        this._path = new Pathlib(appDir)
        console.log(`appDir: ${appDir}`)

        this._jsonLib = new JSONlib()
        this._math = new Mathlib()

        //log目录
        let logDir = this._path.appDir.join('log')
        this._path.createPath(logDir.str)
        this._logging = new Logging(logDir)

        console.log(`logDir: ${logDir.str}`)
    }

    /**
     * 路径相关
     */
    get path () {
        return this._path
    }

    /**
     * 日志相关
     */
    get logging () {
        return this._logging
    }

    /**
     * json相关
     */
    get json () {
        return this._jsonLib
    }

    /**
     * 数学相关
     */
    get math () {
        return this._math
    }

    /**
     * 获取当前时间戳
     */
    get nowTime () {
        return Date.now()
    }
}