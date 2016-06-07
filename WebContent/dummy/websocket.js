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
var ok = null;
function checkUserIdentity() {
	username = getUrlParam("username");
}

function sendMessage(message) {
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
	jsonMessage["user"] = username;
	jsonMessage["type"] = "connect";
	var jsonMessageString = JSON.stringify(jsonMessage);
	ws.send(jsonMessageString);
	ok = true;
};

ws.onmessage = function(evt) {
	// console.log(evt.data);
	if (evt.data == "Connection Established")
		return;
	var jsonMessage = eval("(" + evt.data + ")");
	var ops = jsonMessage.OPS;
	console.log(ops);
};

ws.onclose = function(evt) {
};

ws.onerror = function(evt) {
	console.log("WebSocketError!");
};

function createDummy() {
	var obj = new Object();
	obj["event"]=  "add";
	obj["timestamp"]= myTimestamp+=1;
	obj["lastUpdateId"]= -1;
	obj["date"]= "2016-04-30";
	obj["city"]= "Shanghai";
	obj["group"]= "cisl";
	obj["user"]= username;
	obj["type"]= "add";
	obj["receiveTime"]= new Date().getTime();
	obj["start"]=
			"dum";
	obj["title"]= "同济大学";
	obj["content"]= "";
	obj["identifier"]= "0";
	obj["targetUser"]= username;
	jsonmessage = JSON.stringify(obj);
	console.log(jsonmessage);
	ws.send(jsonmessage);
}