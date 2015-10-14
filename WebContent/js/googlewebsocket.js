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
var timestamp = 0;
var lastUpdateId = -1;

$("#toIssue").click(function() {
	if (username != "")
		location.href = "issue.jsp?username=" + username;
})

function checkUserIdentity() {
	username = getUrlParam("username");
	if (username == null) {
		alert("please log in!");
		location.href = "index.jsp";
	}
}

// 产生操作的相关信息
function createMessageLog(var1, var2, var3, type) {
	var jsonMessage = new Object();
	jsonMessage["timestamp"] = timestamp;
	timestamp += 1;
	jsonMessage['lastUpdateId'] = lastUpdateId;
	jsonMessage["date"] = date;
	jsonMessage["city"] = city;
	jsonMessage["group"] = group;
	jsonMessage["user"] = username;
	jsonMessage["type"] = type;
	if (type == "addPOI") {
		latLng = var1;
		title = var2;
		content = var3;
		jsonMessage['start'] = latLng;
		jsonMessage['title'] = title;
		jsonMessage["content"] = content;
	} else if (type == "deletePOI") {
		position = var1;
		title = var2;
		index = var3;
		jsonMessage['start'] = position;
		jsonMessage['title'] = title;
		jsonMessage["content"] = index;
	} else {
		startIndex = var1;
		endIndex = var2;
		index = var3;
		jsonMessage["content"] = index;
		jsonMessage['start'] = startIndex;
		jsonMessage['end'] = endIndex;
	}
	return jsonMessage;
}

function addPOIMessage(latLng, title, content) {
	jsonMessage = createMessageLog(latLng, title, content, "addPOI");
	// messageProcess(jsonMessage);
	controlalgorithm(jsonMessage);
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}

function deletePOIMessage(latLng, title, content) {
	jsonMessage = createMessageLog(latLng, title, content, "deletePOI");
	// messageProcess(jsonMessage);
	controlalgorithm(jsonMessage);
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}

function addLineMessage(startIndex, endIndex, content) {
	jsonMessage = createMessageLog(startIndex, endIndex, content, "addLine");
	// messageProcess(jsonMessage);
	controlalgorithm(jsonMessage);
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}

function deleteLineMessage(startIndex, endIndex, content) {
	jsonMessage = createMessageLog(startIndex, endIndex, content, "deleteLine");
	// messageProcess(jsonMessage);
	controlalgorithm(jsonMessage);
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}

function updateNodeMessage(startIndex, endIndex, content) {
	jsonMessage = createMessageLog(startIndex, endIndex, content, "updatePOI");
	// messageProcess(jsonMessage);
	controlalgorithm(jsonMessage);
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}
// 投票
function voteLineMessage(startLatLng, endLatLng) {
	jsonMessage = createMessageLog(startLatLng, endLatLng, "vote", "voteLine");
	// messageProcess(jsonMessage);
	controlalgorithm(jsonMessage);
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
			var jsonMessageString = JSON.stringify(message);
			ws.send(jsonMessageString);
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
		addPOIBasic(message);
		break;
	case "deletePOI":
		deletePOIBasic(message);
		break;
	case "addLine":
		addLineBasic(message);
		break;
	case "deleteLine":
		deleteLineBasic(message);
		break;
	case "voteLine":
		if (typeof (message.start) == "string")
			message.start = eval("(" + message.start + ")");
		if (typeof (message.end) == "string")
			message.end = eval("(" + message.end + ")");
		var start = new google.maps.LatLng(message.start.G, message.start.K);
		var end = new google.maps.LatLng(message.end.G, message.end.K);
		var selectedLineIndex = findLineByPoistion(start, end);
		voteLineBasic(selectedLineIndex);
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
		updatePOINodeList();
		updateLinelist();
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
		ackHashMap[jsonMessage.timestamp] = jsonMessage.id;
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