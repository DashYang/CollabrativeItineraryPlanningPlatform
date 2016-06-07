var executeTime = new Array();
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
	if (typeof (jsonMessage.start) != "object")
		localMessage['latlon'] = eval("(" + jsonMessage.start + ")");
	else
		localMessage['latlon'] = jsonMessage.start;
	localMessage['title'] = jsonMessage.title;
	localMessage["content"] = jsonMessage.content;
	localMessage["identifier"] = jsonMessage.identifier;
	localMessage["targetUser"] = jsonMessage.targetUser;
	return localMessage;
}

function getExResult() {
	var str = "";
	for(var index in executeTime) {
		var time = executeTime[index];
		str += time + ",";
	} 
	str = str.substring(0 , str.length-1);
	return str;
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
				var start = new Date().getTime();
				for (listIndex in list) {
					var rMessage = serverToLocalMessage(list[listIndex])

					if (rMessage.user == username) {
						if (rMessage.opcnt + 1 > myTimestamp) {
							myTimestamp = rMessage.opcnt + 1;
						}
						localMessageLog.push(rMessage);
						localMessageLog.pop();
						localMessageLog.ack(rMessage);
					} else {
						remoteMessageLog.push(rMessage);
					}

					// messageProcess(list[listIndex]);
					if (rMessage.type == "add") {
						add(rMessage);
					} else {
						deleteNode(rMessage);
					}
					
					var end = new Date().getTime();
					console.log(end - start)
					executeTime.push((end - start));
				}
				var end = new Date().getTime();
				console.log("restore record time:" + start + " " + end);
				console.log("restore record time:" + (end - start));
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
	$("#messagelist").html(pastContent + user + /** " 于 " + date.toLocaleString() + * */
	" says:<br>" + content + "<br>");
}
