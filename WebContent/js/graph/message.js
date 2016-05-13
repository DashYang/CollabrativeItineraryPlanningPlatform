function localToServerMessage(localMessage) {
	var jsonMessage = new Object();
	jsonMessage["timestamp"] = localMessage.opcnt;
	jsonMessage['lastUpdateId'] = localMessage.lastUpdateSRN;
	jsonMessage["date"] = localMessage.date;
	jsonMessage["city"] = localMessage.city;
	jsonMessage["group"] = localMessage.group;
	jsonMessage["user"] = localMessage.user;
	jsonMessage["type"] = localMessage.type;
	jsonMessage["receiveTime"] = localMessage.receiveTime;
	jsonMessage['start'] = localMessage.latlon;
	jsonMessage['title'] = localMessage.title;
	jsonMessage["content"] = localMessage.content;
	jsonMessage["identifier"] = localMessage.identifier;
	jsonMessage["targetUser"] = localMessage.targetUser;
	return jsonMessage;
}

function serverToLocalMessage(jsonMessage) {
	var localMessage = new message(jsonMessage.id);
	localMessage["opcnt"] = jsonMessage.timestamp;
	localMessage['lastUpdateSRN'] = jsonMessage.lastUpdateId;
	localMessage["date"] = jsonMessage.date;
	localMessage["city"] = jsonMessage.city;
	localMessage["group"] = jsonMessage.group;
	localMessage["user"] = jsonMessage.user;
	localMessage["type"] = jsonMessage.type;
	localMessage["receiveTime"] = jsonMessage.receiveTime;
	localMessage['latlon'] = eval("(" + jsonMessage.start+ ")");
	localMessage['title'] = jsonMessage.title;
	localMessage["content"] = jsonMessage.content;
	localMessage["identifier"] = jsonMessage.identifier;
	localMessage["targetUser"] = jsonMessage.targetUser;
	return localMessage;
}

function loadingHistoryMessage() {
	$.ajax({
		type : "post",// 请求方式
		url : "./saveMessage",// 发送请求地址
		dataType : "json",// 返回json格式的数据
		data : {
			type : "getMessageLog",
			date : date,
			city : city,
			group : group
		},
		success : function(jsonData) {
			if (jsonData.result == true) {
				var list = jsonData.list;
				for (listIndex in list) {
					var rMessage = serverToLocalMessage(list[listIndex])
					
					// messageProcess(list[listIndex]);
					if(rMessage.type == "add")
						add(rMessage);
					else
						deleteNode(rMessage);
					if (rMessage.user == username) {
						if (rMessage.opcnt > myTimestamp) {
							myTimestamp = rMessage.opcnt;
						}
						localMessageLog.push(rMessage); 
					} else {
						remoteMessageLog.push(rMessage);
					}
				}
				updatePOINodeList(username);
				createItineraryMap();
			} else {
				alert("fail");
			}
		}
	});
}

$("#sendMessage").click(function() {
	var jsonMessage = new Object();
	var content = $("#messagebox").val();
	jsonMessage["timestamp"] = timestamp;
	timestamp += 1;
	jsonMessage["date"] = date;
	jsonMessage["city"] = city;
	jsonMessage["group"] = group;
	jsonMessage['lastUpdateId'] = lastUpdateId;
	jsonMessage["receiveTime"] = new Date().getTime();
	jsonMessage["user"] = username;
	jsonMessage["type"] = "message";
	jsonMessage['content'] = content;
	var jsonMessageString = JSON.stringify(jsonMessage);
	console.log(jsonMessageString);
	ws.send(jsonMessageString);
	updateMessageList(username, content);
});

function updateMessageList(user, content) {
	var pastContent = $("#messagelist").html();
	var date = new Date();
	$("#messagelist").html(
			pastContent + user + /**" 于 " + date.toLocaleString() + **/" says:<br>"
					+ content + "<br>");
}
