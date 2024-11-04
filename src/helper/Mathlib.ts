export class Mathlib {
    private randomArrayHistory: Map<any[], any> = new Map()

    /**
     * 从数组中随机获取一个元素
     */
    public randomArray (array: any[]): any {
        return array[Math.floor(Math.random() * array.length)]
    }

    /**
     * 从数组中随机获取一个元素，但每个元素只能被选取一次，直到所有元素都被选到一遍
     */
    public randomArrayOnce (array: any[]): any {
        let history = this.randomArrayHistory.get(array)
        if (!history || history.length === 0) {
            history = [...array]
        }

        function randomAndRemove (array: any) {
            const randomIndex = Math.floor(Math.random() * array.length)
            const element = array[randomIndex]
            array.splice(randomIndex, 1)
            return element
        }

        let select = randomAndRemove(history)
        if (history.length === 0) {
            this.randomArrayHistory.delete(array)
        } else {
            this.randomArrayHistory.set(array, history)
        }

        return select
    }
}