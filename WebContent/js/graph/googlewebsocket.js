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
	localMessageLog.push(message);
	if (isBroadMessage() == true) {
		var sMessage = JSON.stringify(localToServerMessage(localMessageLog.pop()));
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
// 处理事件
function messageProcess(message) {
	if (message == null)
		return;
	switch (message.type) {
	case "addPOI":
		add(message);
		break;
	case "deletePOI":
		deleteNode(message);
		break;
	case "connect":
		break;
	case "ack":
		break;
	case "close":
		deleteUser(message.user);
		break;
	case "message":
		var name = message.user; 
		var content = message.content;
		updateMessageList(name, content);
		break;
	case "updatePOI":
		updatePOIBasic(message);
		break;
	}
	if (message.id > lastUpdateId)
		lastUpdateId = message.id;
	if (message.user == username) {
//		updatePOINodeList(username);
	}
	// console.log("lastUpdateId = " + lastUpdateId);
}

ws.onmessage = function(evt) {
	// console.log(evt.data);
	if (evt.data == "Connection Established")
		return;
	var jsonMessage = eval("(" + evt.data + ")");
	addUser(jsonMessage.user);
	remoteMessageLog.push(jsonMessage);
	// messageProcess(jsonMessage);
	if (jsonMessage.type == "ack") {
		remoteMessageLog[jsonMessage.timestamp] = jsonMessage.id;
	} else if (jsonMessage.type != "connect" && jsonMessage.type != "close") {
//		if (isReceiveMessage() == true) {
//			while(remoteMessageLog.getSize() != 0);
			controlalgorithm(jsonMessage);
//		}
	}
};

ws.onclose = function(evt) {
	// var jsonMessage = new Object();
	// jsonMessage["user"] = username;
	// jsonMessage["type"] = "close";
	// var jsonMessageString = JSON.stringify(jsonMessage);
	// ws.send(jsonMessageString);
	deleteUser(username);
};

ws.onerror = function(evt) {
	console.log("WebSocketError!");
};