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

function checkUserIdentity() {
	username = getUrlParam("username");
	if (username == null) {
		alert("please log in!");
		location.href = "index.jsp";
	}
}

var username = "";

//判断是否广播消息
function isBroadMessage() {
	var flag = $("#broadMessage").is(':checked');
	if (flag != null && flag == true)
		return true;
	return false;
}

$("#toIssue").click(function() {
	if (username != "")
		location.href = "issue.jsp?username=" + username;
});

// 产生操作的相关信息
function createMessageLog(var1, var2, var3, type) {
	var jsonMessage = new Object();
	jsonMessage["date"] = date;
	jsonMessage["city"] = city;
	jsonMessage["group"] = group;
	jsonMessage["type"] = type;
	jsonMessage["user"] = username;
	if (type == "addPOI") {
		latLng = var1;
		title = var2;
		content = var3;
		jsonMessage['start'] = latLng;
		jsonMessage['end'] = ""; // id
		jsonMessage['title'] = title;
		jsonMessage["content"] = content;
	} else if (type == "deletePOI") {
		position = var1;
		title = var2;
		index = var3; // POId
		jsonMessage['start'] = position;
		jsonMessage['end'] = ""; // id
		jsonMessage['title'] = title;
		jsonMessage["content"] = index;
	} else if (type == "updatePOI") {
		index = var1;
		type = var2;
		content = var3;
		jsonMessage["content"] = content;
		jsonMessage['start'] = index;
		jsonMessage['end'] = type;
	} else {
		startIndex = var1;
		endIndex = var2;
		index = var3;
		jsonMessage["content"] = index;
		jsonMessage['start'] = startIndex; // id
		jsonMessage['end'] = endIndex; // id
	}
	return jsonMessage;
}

function addPOIMessage(latLng, title, content) {
	jsonMessage = createMessageLog(latLng, title, content, "addPOI");
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}

function deletePOIMessage(latLng, title, content) {
	jsonMessage = createMessageLog(latLng, title, content, "deletePOI");
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}

function addLineMessage(startIndex, endIndex, content) {
	jsonMessage = createMessageLog(startIndex, endIndex, content, "addLine");
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}

function deleteLineMessage(startIndex, endIndex, content) {
	jsonMessage = createMessageLog(startIndex, endIndex, content, "deleteLine");
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}

function updatePOIMessage(index, type, content) {
	jsonMessage = createMessageLog(index, type, content, "updatePOI");
	localMessageLog.push(jsonMessage);
	if (isBroadMessage() == true) {
		var message = JSON.stringify(localMessageLog.pop());
		ws.send(message);
	}
}
// 投票
function voteLineMessage(startLatLng, endLatLng) {
	jsonMessage = createMessageLog(startLatLng, endLatLng, "vote", "voteLine");
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

$("#broadMessage").click(function() {
	if (isBroadMessage() == true) {
		while (localMessageLog.getSize() > 0) {
			var message = localMessageLog.pop();
			var jsonMessageString = JSON.stringify(message);
			ws.send(jsonMessageString);
		}
	}
});

$("#receiveMessage").click(function() {
	if (isReceiveMessage() == true) {
		while (remoteMessageLog.getSize() > 0) {
			var message = remoteMessageLog.pop();
			messageProcess(message);
		}
	}
});

var ws = null;

function lock_sync_method() { 
	
ws = new WebSocket(wshostPath
		+ "/CollabrativeItineraryPlanningPlatform/LockWebSocketServer");

ws.onopen = function() {
	var jsonMessage = new Object();
	jsonMessage["date"] = date;
	jsonMessage["city"] = city;
	jsonMessage["group"] = group;
	jsonMessage["user"] = username;
	jsonMessage["type"] = "connect";
	console.log(date + " " + city + " " + group);
	var jsonMessageString = JSON.stringify(jsonMessage);
	ws.send(jsonMessageString);
};

// 判断是否接受消息
function isReceiveMessage() {
	var flag = $("#receiveMessage").is(':checked');
	if (flag != null && flag == true)
		return true;
	return false;
}

// 处理事件
POINodes = new Array();
lineNodes = new Array();

function messageProcess(message) {
	var list = message.list;
	
	clearMarkers();
	
	POINodes = new Array();
	lineNodes = new Array();
	
	for ( var index in list) {
		if (list[index].type == "addPOI") {
			addPOIBasic(list[index]);
		} else {
			addLineBasic(list[index]); 
		}
	}
	updatePOINodeList();
	updateLinelist();
	
	//
	if(message.user == username)
		attachEndTime();
	//
}

ws.onmessage = function(evt) {
	if (evt.data == "Connection Established")
		return;
	var jsonMessage = eval("(" + evt.data + ")");
	remoteMessageLog.push(jsonMessage);
	messageProcess(jsonMessage);
};

ws.onclose = function(evt) {
	deleteUser(username);
};

ws.onerror = function(evt) {
	console.log("WebSocketError!");
};
}