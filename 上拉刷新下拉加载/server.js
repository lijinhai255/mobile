// 引入模块
var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
// 定义MimeType对象
var MT = {
	txt: "text/plain",
	html: "text/html",
	css: "text/css",
	js: "application/x-javascript",
	png: "image/png"
};

// 定义一个数组 该数组中有一个一个的成员 每一个成员是一个对象 该数组用于模拟数据库
var arr = [
	{
		username: "wanglaowu",
		password: "wanglaowu"
	},
	{
		username: "wanglaosi",
		password: "wanglaosi"
	},
	{
		username: "wanglaosan",
		password: "wanglaosan"
	}
];
// 搭建服务器
var server = http.createServer(function(req, res) {
	// 获取URL
	var urlStr = req.url;
	// 解析成对象
	var urlObj = url.parse(urlStr, true);
	// 获取pathname
	var pathname = "." +  decodeURIComponent(urlObj.pathname);
	// 获取拓展名
	var extName = urlObj.pathname.split(".").pop();
	// 获取请求方式
	var method = req.method.toLowerCase();
	// 配置第一个接口
	if (urlObj.pathname === "/login" && method === "get") {
		// 用户登录时，会提交用户名和密码上来 我们要在这里得到
		// 获取用户名
		var username = urlObj.query.username;
		// 获取密码
		var password = urlObj.query.password;
		console.log("用户输入的名称是 " + username, "用户输入的密码是" + password)
		// 设置响应头
		res.setHeader("content-type", "text/plain;charset=utf-8");
		// 开始判断 
		for (var i = 0; i < arr.length; i++) {
			if (username === arr[i].username && password === arr[i].password) {
				// 登录成功
				var result = {
					error: 0,
					data: "登录成功"
				}
				res.end(JSON.stringify(result));
				return;
			}
		}
		// 登录失败
		var result = {
			error: 1,
			data: "登录失败"
		}
		res.end(JSON.stringify(result));
		// 添加return 不要往后执行
		return;
	}

	// 配置第二个接口
	if (urlObj.pathname === "/login" && method === "post") {
		var n = 0;
		var str = '';
		// 监听事件
		req.on("data", function(data) {
			console.log("事件触发了" + n + "次")
			n++;
			str += data;
		})
		// 监听事件
		req.on("end", function() {
			// 解析数据
			var obj = qs.parse(str);
			// 获取用户名
			var username = obj.username;
			// 获取密码
			var password = obj.password;
			// 循环匹配
			for (var i = 0; i < arr.length; i++) {
				// 判断是否匹配
				if (username === arr[i].username && password === arr[i].password) {
					// 登录成功
					var result = {
						error: 0,
						data: "登录成功"
					}
					res.end(JSON.stringify(result));
					return;
				}
			}
			// 循环完毕还没有匹配上 说明没有
			// 登录失败
			var result = {
				error: 1,
				data: "登录失败"
			}
			res.end(JSON.stringify(result));
			return;
		})
		return;
	}
	// 开始读取
	fs.readFile(pathname, function(err, data) {
		// 判定是否读取失败
		if (err) {
			res.setHeader("content-type", "text/html;charset=utf-8");
			res.end("抱歉，您读取的目录不正确");
			return;
		}
		res.setHeader("content-type", MT[extName] + ";charset=utf-8");
		// 读取成功 应当返回data给前端
		res.end(data);
	})
})

// 监听端口号
server.listen(3000);