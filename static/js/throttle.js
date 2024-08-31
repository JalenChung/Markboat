/**
 * 节流函数(回调函数，时间)
 * 作用：
 *      在方法执行时，会设置一个（暂时关闭）会定时开启的“阀门”
 * 思路：
 *      节流 = 执行 -> 关闸门 -> 等待 -> 开阀门 -> 执行
 */
function throttle(fn, delay){
	let valid = true;
	return function(){
		if(valid) { //如果阀门已经打开，就继续往下
			setTimeout(()=> {
				fn.apply(this, arguments);//定时器结束后执行
				valid = true;//执行完成后打开阀门
			}, delay)
			valid = false;//关闭阀门
		}
	}
}

export default throttle