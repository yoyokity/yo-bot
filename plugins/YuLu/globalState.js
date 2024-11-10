class GlobalState {
    #dataPath
    #dataImgPath

    publicGroups = []
    sendHistory = {}

    init (dataPath) {
        //创建data目录
        this.#dataPath = dataPath
        let p = helper.path.new(dataPath).join('img')
        this.#dataImgPath = p.str
        helper.path.createPath(p.str)

        helper.path.createPath(helper.path.new(dataPath).join('config').str)

        //获取publicGroups
        let publicGroups = helper.json.read(this.#publicGroupsPath)
        if (publicGroups) this.publicGroups = publicGroups

        //获取sendHistory
        let sendHistory = helper.json.read(this.#sendHistoryPath)
        if (sendHistory) this.sendHistory = sendHistory
    }

    //
    savePublicGroups () {
        helper.json.write(this.#publicGroupsPath, this.publicGroups)
    }

    saveSendHistory () {
        helper.json.write(this.#sendHistoryPath, this.sendHistory)
    }

    get #publicGroupsPath () {
        return helper.path.new(this.#dataPath).join('config/publicGroups.json').str
    }

    get #sendHistoryPath () {
        return helper.path.new(this.#dataPath).join('config/sendHistory.json').str
    }

    //
    get dataPath () {
        return this.#dataPath
    }

    get dataImgPath () {
        return this.#dataImgPath
    }
}

export const globalState = new GlobalState()