class GlobalState {
    #dataPath
    #dataImgPath

    publicGroups = []

    init (dataPath) {
        //创建data目录
        this.#dataPath = dataPath
        let p = helper.path.new(dataPath).join('img')
        this.#dataImgPath = p.str
        helper.path.createPath(p.str)

        //获取publicGroups
        let publicGroups = helper.json.read(this.#publicGroupsPath)
        if (publicGroups) this.publicGroups = publicGroups
    }

    savePublicGroups () {
        helper.json.write(this.#publicGroupsPath, this.publicGroups)
    }

    get #publicGroupsPath () {
        return helper.path.new(this.#dataPath).join('publicGroups.json').str
    }

    get dataPath () {
        return this.#dataPath
    }

    get dataImgPath () {
        return this.#dataImgPath
    }
}

export const globalState = new GlobalState()