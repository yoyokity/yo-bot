export declare class Mathlib {
    private randomArrayHistory;
    /**
     * 从数组中随机获取一个元素
     */
    randomArray(array: any[]): any;
    /**
     * 从数组中随机获取一个元素，但每个元素只能被选取一次，直到所有元素都被选到一遍
     */
    randomArrayOnce(array: any[]): any;
}
