/**
 * 防抖函数(回调函数，时间)
 * 作用：
 *      方法会等待n秒后再执行，如果没有等够n秒就执行，将重行等待n秒
 * 思路：
 *      防抖 = 执行重新等待 -> 执行方法
 */
export default (func, delay = 1000) => {
    let timeout; //定时器
    return function () {
        // 如果没有等待足够久，之前等待过的将被清除
        if (timeout) clearTimeout(timeout);
        // 方法被包裹在定时器中，执行方法前总是要等待足够久
        timeout = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    }
}
