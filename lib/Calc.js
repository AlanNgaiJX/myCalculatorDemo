// 传递两个队列数组的json，一个为数字数组，一个为操作数组tarr:{numbers:{},options:{}}
// 求计算结果
let Calc = function(tarr) {
	// 1)获取这两个数组
	let numbers = tarr.numbers;
	let options = tarr.options;
	// 2)判断两数组长度，保证公式准确性

	if (numbers.length == options.length) {
		// 丢弃最后一个运算符
		options.pop();
	}

	// 3)设计算法，遍历

	while (numbers.length > 1) {

		for (var index in options) {
			if (options[index] == '**') {
				let resultTem = parseFloat(numbers[index]) ** parseFloat(numbers[parseInt(index) + 1]);
				numbers.splice(index, 2, resultTem);
				options.splice(index, 1);
			}
		}

		for (var index in options) {
			if (options[index] == '*') {
				let resultTem = parseFloat(numbers[index]) * parseFloat(numbers[parseInt(index) + 1]);
				numbers.splice(index, 2, resultTem);
				options.splice(index, 1);
			}

			if (options[index] == '/') {
				let resultTem = parseFloat(numbers[index]) / parseFloat(numbers[parseInt(index) + 1]);
				numbers.splice(index, 2, resultTem);
				options.splice(index, 1);
			}
		}

		for (var index in options) {
			if (options[index] == '+') {
				let resultTem = parseFloat(numbers[index]) + parseFloat(numbers[parseInt(index) + 1]);
				numbers.splice(index, 2, resultTem);
				options.splice(index, 1);
			}

			if (options[index] == '-') {
				let resultTem = parseFloat(numbers[index]) - parseFloat(numbers[parseInt(index) + 1]);
				numbers.splice(index, 2, resultTem);
				options.splice(index, 1);
			}
		}
	}

	let result = numbers[0];

	return result;
}

// let res = Calc({numbers:[1,2,3,2,1],options:["/","+","*","-"]});
// console.log(res);

module.exports = exports = Calc;