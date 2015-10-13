function getUrlParam(name){
	//构造一个含有目标参数的正则表达式对象
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	//匹配目标参数
	var r = window.location.search.substr(1).match(reg);
	//返回参数值
	if (r!=null) return unescape(r[2]);
	return null;
}

var username = "";

$("#toIssue").click(function () {
	if(username != "")
		location.href = "issue.jsp?username="+username;
})

function checkUserIdentity() {
	username = getUrlParam("username")
	if( username == null) {
		alert("please log in!");
		location.href = "index.jsp";
	}
}

function addPOIMessage(point) {
	var jsonMessage = new Object();
	jsonMessage["user"] = username;
	jsonMessage["type"] = "addPOI";
	jsonMessage['point'] = point;
	var jsonMessageString = JSON.stringify(jsonMessage);
	console.log(jsonMessageString);
	ws.send(jsonMessageString);
}

function deletePOIMessage(point) {
	var jsonMessage = new Object();
	jsonMessage["user"] = username;
	jsonMessage["type"] = "deletePOI";
	jsonMessage['point'] = point;
	var jsonMessageString = JSON.stringify(jsonMessage);
	console.log(jsonMessageString);
	ws.send(jsonMessageString);
}

function addLineMessage(start , end , content) {
	var jsonMessage = new Object();
	jsonMessage["user"] = username;
	jsonMessage["type"] = "addLine";
	jsonMessage['start'] = start;
	jsonMessage['end'] = end;
	jsonMessage['content'] = content;
	var jsonMessageString = JSON.stringify(jsonMessage);
	console.log(jsonMessageString);
	ws.send(jsonMessageString);
}

function deleteLineMessage(start , end) {
	var jsonMessage = new Object();
	jsonMessage["user"] = username;
	jsonMessage["type"] = "deleteLine";
	jsonMessage['start'] = start;
	jsonMessage['end'] = end;
	var jsonMessageString = JSON.stringify(jsonMessage);
	console.log(jsonMessageString);
	ws.send(jsonMessageString);
}

var currentPath = window.document.location.href; 
var pathName = window.document.location.pathname; 
var pos= currentPath.indexOf(pathName); 
var localhostPath = currentPath.substring(0,pos); 
var wshostPath = localhostPath.replace("http","ws");

var ws = new WebSocket( wshostPath + "/CollabrativeItineraryPlanningPlatform/WebSocketServer");

ws.onopen = function(){
	var jsonMessage = new Object();
	jsonMessage["user"] = username;
	jsonMessage["type"] = "connect";
	var jsonMessageString = JSON.stringify(jsonMessage);
	ws.send(jsonMessageString);
};

ws.onmessage = function(evt){
	console.log(evt.data);
	if(evt.data == "Connection Established")
		return;
	var jsonMessage = eval("(" + evt.data + ")");
	addUser(jsonMessage.user);
	switch(jsonMessage.type) {
	case "addPOI":
		var mkr = new BMap.Marker(jsonMessage.point); 
		POIs.push(mkr);
		map.addOverlay(mkr);
		break;
	case "deletePOI":
		for(index in POIs) {
			if(isSameLocated(POIs[index].point,jsonMessage.point)) {
				POIs[index].hide();
			}
		}
		break;
	case "addLine":
		var start = jsonMessage.start;
		var end = jsonMessage.end;
		addArrow(start , end , 10,Math.PI/7);
		break;
	case "deleteLine":
		var start = jsonMessage.start;
		var end = jsonMessage.end;
		for(index in arrows) {
			var points = arrows[index].body.getPath();
			if(isSameLocated(points[0] , start) && isSameLocated(points[1] , end)) {
				arrows[index].body.hide();
				arrows[index].head.hide();
			}
		}
		break;
	case "connect":
		
		break;
	case "close":
		deleteUser(jsonMessage.user);
		break;
	case "message":
		var name = jsonMessage.user;
		var content = jsonMessage.content;
		updateMessageList(name , content);
		break;
	}
};

ws.onclose = function(evt){
	var jsonMessage = new Object();
	jsonMessage["user"] = username;
	jsonMessage["type"] = "close";
	var jsonMessageString = JSON.stringify(jsonMessage);
	ws.send(jsonMessageString);
};

ws.onerror = function(evt){console.log("WebSocketError!");};