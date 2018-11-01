var server = require('http').createServer(handler);
var fs = require('fs');
var path = require('path');
// 附加的mime模块有根据文件扩展名得出MIME类型的能力
var mime = require("mime");
// cache是用来缓存文件内容的对象,cache:高速缓冲储存器
var cache = {};

var Calc = require('./lib/Calc.js');
var calc_area = require('./lib/calc_area.js');

function send404(response){
	response.writeHead('404',{'Content-Type':'text/plain'});
	response.write('Error 404 : resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents){
	response.writeHead(200,{'Content-Type':mime.lookup(path.basename(filePath))});
	response.end(fileContents);
}

function serveStatic(response , cache, absPath){
	// 检查文件是否处在缓存当中，如果有，从缓存中取出并返回
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	}else {
		// 检查文件是否存在，如果不存在：发送404，如果存在：从硬盘中取出
		fs.exists(absPath, function(exists) {
			if (exists) {
				fs.readFile(absPath, function(err,data) {
					if (err) {
						send404(response);
					}else{
						cache[absPath] = data;
						sendFile(response,absPath,data);
					}
				});
			}else{
				send404(response);
			}
		})
	}
}

function handler(request,response){
	var filePath = false;

	if (request.url == "/") {
		filePath = "public/index.html";
	}else{
		filePath = "public" + request.url;
	}

	var absPath = "./" + filePath;
	// 返回静态文件
	serveStatic(response, cache, absPath);
}


server.listen('3011',function(){
	console.log('server is on!!!');
});

var io = require('socket.io').listen(server);


io.on("connection",function(socket){

	socket.on("calculator",function(msg){
		io.emit("show",Calc(msg));
	});

	socket.on("calculator-area",function(msg){
		console.log(msg);
		io.emit("showArea",calc_area(msg));
		console.log(calc_area(msg));
	});

});

console.log("success");