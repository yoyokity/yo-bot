export declare class Mathlib {
    private randomArrayHistory;
    /**
     * 从数组中随机获取一个元素
     */
    randomArray(array: any[]): any;
    /**
     * 从数组中随机获取一个元素，但每个元素只能被选取一次，直到所有元素都被选到一遍
     * @param array 目标数组
     * @param [onObj=true] 是否使用数组的对象引用作为判断同一数组的标准，否的话使用数组的JSON文本
     */
    randomArrayOnce(array: any[], onObj?: boolean): any;
}
