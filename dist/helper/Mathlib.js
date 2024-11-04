export class Mathlib {
    randomArrayHistory = new Map();
    /**
     * 从数组中随机获取一个元素
     */
    randomArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    /**
     * 从数组中随机获取一个元素，但每个元素只能被选取一次，直到所有元素都被选到一遍
     * @param array 目标数组
     * @param [onObj=true] 是否使用数组的对象引用作为判断同一数组的标准，否的话使用数组的JSON文本
     */
    randomArrayOnce(array, onObj = true) {
        let arrayKey = onObj ? array : JSON.stringify(array); //map的key
        let history = this.randomArrayHistory.get(arrayKey);
        if (!history || history.length === 0) {
            history = [...array];
        }
        function randomAndRemove(array) {
            const randomIndex = Math.floor(Math.random() * array.length);
            const element = array[randomIndex];
            array.splice(randomIndex, 1);
            return element;
        }
        let select = randomAndRemove(history);
        if (history.length === 0) {
            this.randomArrayHistory.delete(arrayKey);
        }
        else {
            this.randomArrayHistory.set(arrayKey, history);
        }
        return select;
    }
}
//# sourceMappingURL=Mathlib.js.map