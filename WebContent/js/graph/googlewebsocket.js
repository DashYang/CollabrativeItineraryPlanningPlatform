function getUrlParam(name) {
	// 构造一个含有目标参数的正则表达式对象
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	// 匹配目标参数
	var r = window.location.search.substr(1).match(reg);
	// 返回参数值
	if (r != null)
		return unescape(r[2]);
	return null;
}

var username = "";
var myTimestamp = 0;
var lastUpdateId = -1;

function getTimestamp() {
	myTimestamp += 1;
	console.log("opcnt:" + myTimestamp);
	return myTimestamp - 1;
}

$("#toIssue").click(function() {
	if (username != "")
		location.href = "issue.jsp?username=" + username;
});

function checkUserIdentity() {
	username = getUrlParam("username");
	if (username == null) {
		alert("please log in!");
		location.href = "index.jsp";
	}
}

function sendMessage(message) {
	if (isBroadMessage() == true) {
		var sMessage = JSON.stringify(localToServerMessage(localMessageLog.pop()));
		console.log(sMessage);
		ws.send(sMessage);
	}
}
function deletePOIMessage(targetUsername,position) {
	jsonMessage = createMessageLog("", "", "",
			position,targetUsername,"deletePOI");
	// messageProcess(jsonMessage);
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}

checkUserIdentity();

var currentPath = window.document.location.href;
var pathName = window.document.location.pathname;
var pos = currentPath.indexOf(pathName);
var localhostPath = currentPath.substring(0, pos);
var wshostPath = localhostPath.replace("http", "ws");

var ws = new WebSocket(wshostPath
		+ "/CollabrativeItineraryPlanningPlatform/WebSocketServer");

alert(wshostPath+ "/CollabrativeItineraryPlanningPlatform/WebSocketServer");

ws.onopen = function() {
	var jsonMessage = new Object();
	jsonMessage["date"] = date;
	jsonMessage["city"] = city;
	jsonMessage["group"] = group;
	jsonMessage["user"] = username;
	jsonMessage["type"] = "connect";
	var jsonMessageString = JSON.stringify(jsonMessage);
	ws.send(jsonMessageString);
};

// 判断是否广播消息
function isBroadMessage() {
	var flag = $("#broadMessage").is(':checked');
	if (flag != null && flag == true)
		return true;
	return false;
}

$("#broadMessage").click(function() {
	if (isBroadMessage() == true) {
		while (localMessageLog.getSize() > 0) {
			var message = localMessageLog.pop();
			var sMessage = JSON.stringify(localToServerMessage(message));
			ws.send(sMessage);
		}
	}
});

// 判断是否接受消息
function isReceiveMessage() {
	var flag = $("#receiveMessage").is(':checked');
	if (flag != null && flag == true)
		return true;
	return false;
}

$("#receiveMessage").click(function() {
	if (isReceiveMessage() == true) {
		while (remoteMessageLog.getSize() > 0) {
			var message = remoteMessageLog.pop();
			messageProcess(message);
		}
	}
});

ws.onmessage = function(evt) {
	// console.log(evt.data);
	if (evt.data == "Connection Established")
		return;
	var jsonMessage = eval("(" + evt.data + ")");
	var LMessage = serverToLocalMessage(jsonMessage);
	// messageProcess(jsonMessage);
	if(LMessage.user != null)
		addUser(LMessage.user);
	if (LMessage.type == "ack" && LMessage.user == username) {
		localMessageLog.ack(LMessage);
	} else if (jsonMessage.type != "connect" && jsonMessage.type != "close") {
		remoteMessageLog.push(LMessage);
		control(LMessage);
	}
};

ws.onclose = function(evt) {
	deleteUser(username);
};

ws.onerror = function(evt) {
	console.log("WebSocketError!");
};