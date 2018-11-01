var socket = io();

var myVue = new Vue({
	el: '#app',

	data: {
		// 临时单个数字储存器
		numberTem: [],
		// 屏幕显示器
		showScreen: "0",
		// 操作暂存
		optionSave: [],
		// 数字暂存
		numberSave: [],
		// 数学公式
		calculatorFormula: [],
		// 形状暂存器
		shapeSave: [],
		// 图形功能公式，关联发送
		shapeNumber: {
			ladder: {
				a: 0,
				b: 0,
				h: 0,
				shape: 'ladder'
			},
			retangle: {
				a: 0,
				b: 0,
				shape: 'retangle'
			},
			circle: {
				r: 0,
				shape: 'circle'
			},
			triangle: {
				a: 0,
				h: 0,
				shape: 'triangle'
			}
		},
		// 图形表单检查，数组类型：boolean
		testShapeForm: [],

		dot: true,
		option: true,
		areaOptionShow: {
			ladder: false,
			retangle: false,
			circle: false,
			triangle: false
		},
		areaOption: false,
		calculatorOptionShow: true,
		toggle: {
			ladder: true,
			retangle: true,
			circle: true,
			triangle: true
		}
	},

	methods: {
		// 点击数字，确认数字，显示数字，暂时保存数字
		configNumber: function(e) {
			this.option = true;
			let number = e.target.getAttribute("data-number");
			if (number == '.') {
				this.dot = false;
			}
			this.numberTem.push(number);
			let str = this.numberTem.join("");
			this.showScreen = str;
			this.numberSave.unshift(str);
		},
		// 清空暂存器，清空数学公式，清空屏幕
		clear: function() {
			this.numberTem = [];
			this.numberSave = ["0"];
			this.showScreen = "0";
			this.optionSave = [];
			this.calculatorFormula = [];
			this.dot = true;
			this.option = true;
		},
		// 退格，单个数字储存器删最后一个，更新数字暂存器
		back: function() {
			this.numberTem.pop();

			let str = this.numberTem.join("");
			this.showScreen = str;

			this.numberSave.unshift(str);
			if (str.length == 0) {
				this.numberSave = ["0"];
				this.showScreen = "0";
			}

		},
		// 从数字储存器取出数字加入公式，确认当前操作，加入公式
		configOption: function(e) {
			this.dot = true;
			this.option = false;
			this.calculatorFormula.push(this.numberSave[0]);
			this.numberTem = [];
			this.numberSave = [];

			let option = e.target.getAttribute("data-option");
			// 如果是+或-操作，显示面结果
			if (option == '+' || option == '-') {
				socket.emit('calculator', {
					numbers: this.calculatorFormula,
					options: this.optionSave
				});
				// this.numberTem=[];
			}

			// 计算操作队列
			this.optionSave.push(option);
			// 计算数字队列

			console.log("optionSave:" + this.optionSave);
			console.log("calculatorNumber:" + this.calculatorFormula);
		},
		// 求结果，利用socket提交两个数组：数字、操作,返回服务端触发show
		equal: function() {
			this.calculatorFormula.push(this.numberSave[0]);
			console.log("optionSave:" + this.optionSave);
			console.log("calculatorNumber:" + this.calculatorFormula);

			socket.emit('calculator', {
				numbers: this.calculatorFormula,
				options: this.optionSave
			});
			this.numberTem = [];
			this.numberSave = ["0"];
			this.optionSave = [];
			this.calculatorFormula = [];
		},
		// 确认模式，包含一些UI的显隐操作，清空检验，初始化公示表，关闭其他功能
		configModel: function(shape) {
			this.testShapeForm = [];
			this.shapeNumber = {
				ladder: {
					a: 0,
					b: 0,
					h: 0,
					shape: 'ladder'
				},
				retangle: {
					a: 0,
					b: 0,
					shape: 'retangle'
				},
				circle: {
					r: 0,
					shape: 'circle'
				},
				triangle: {
					a: 0,
					h: 0,
					shape: 'triangle'
				}
			};
			if (this.toggle[shape]) {
				this.clear();
				this.calculatorOptionShow = false;
				for (val in this.areaOptionShow) {
					this.areaOptionShow[val] = false;
				}
				this.areaOptionShow[shape] = !this.areaOptionShow[shape];
				this.toggle = {
					ladder: true,
					retangle: true,
					circle: true,
					triangle: true
				};
				this.toggle[shape] = !this.toggle[shape];
				this.shapeSave = shape;
			} else {
				this.clear();
				this.calculatorOptionShow = true;
				for (val in this.areaOptionShow) {
					this.areaOptionShow[val] = false;
				}
				this.toggle = {
					ladder: true,
					retangle: true,
					circle: true,
					triangle: true
				};
			}
		},
		// 图形功能求果，表单验证
		result: function(shape) {
			// 数字或带有小数点数字
			this.testShapeForm = [];
			let correct = true;
			let patrn = /^\d+(\.\d+)?$/;

			// 遍历该对象并进行数据验证
			let send = this.shapeNumber[shape];
			let sendArr = Object.keys(send);
			let sendTem;
			for (let i = 0; i < Object.keys(send).length - 1; i++) {
				let bol = !patrn.test(send[sendArr[i]]);
				this.testShapeForm.push(bol);
			}
			for (let val in this.testShapeForm) {
				correct = this.testShapeForm[val] || correct;
			}
			if (correct) {
				socket.emit('calculator-area', send);
			} else {
				return;
			}
		}
	},
	mounted: function() {
		const self = this;
		// 数学计算器显示接收数据
		socket.on('show', function(result) {
			self.showScreen = result;
		});
		// 图形计算器显示接收数据
		socket.on('showArea', function(result) {
			self.showScreen = result;
		});
	}
});