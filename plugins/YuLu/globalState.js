class GlobalState {
    #dataPath
    #dataImgPath

    init (dataPath) {
        this.#dataPath = dataPath
        let p = helper.path.new(dataPath).join('img')
        this.#dataImgPath = p.str
        helper.path.createPath(p.str)
    }

    get dataPath () {
        return this.#dataPath
    }

    get dataImgPath () {
        return this.#dataImgPath
    }
}

export const globalState = new GlobalState()