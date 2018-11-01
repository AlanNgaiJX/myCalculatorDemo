// 打包一个计算函数，通过传入形状shape匹配处理函数，返回结果
const PI = 3.14;

let circleArea = function(tarr) {
	return Math.pow(Number(tarr.r), 2) * PI;
}
let retangleArea = function(tarr) {
	return Number(tarr.a) * Number(tarr.b);
}
let ladderArea = function(tarr) {
	return (Number(tarr.a) + Number(tarr.b)) * Number(tarr.h) / 2;
}
let triangleArea = function(tarr) {
	return Number(tarr.a) * Number(tarr.h) / 2;
}

let calc_area = function(tarr) {
	if (tarr.shape == 'circle') {
		// console.log(circleArea(arr));
		return circleArea(tarr);
	}
	if (tarr.shape == 'retangle') {
		// console.log(retangleArea(arr));
		return retangleArea(tarr);
	}
	if (tarr.shape == 'ladder') {
		// console.log(ladderArea(arr));
		return ladderArea(tarr);
	}
	if (tarr.shape == 'triangle') {
		return triangleArea(tarr);
	}
}


module.exports = exports = calc_area;