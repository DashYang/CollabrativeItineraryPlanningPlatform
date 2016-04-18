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
					list[listIndex].start = eval("(" + list[listIndex].start
							+ ")");
					remoteMessageLog.push(list[listIndex]);
					// messageProcess(list[listIndex]);
					controlalgorithm(list[listIndex]);
					if (list[listIndex].user == username) {
						if (list[listIndex].timestamp > timestamp) {
							timestamp = list[listIndex].timestamp;
						}
						ackHashMap[list[listIndex].timestamp] = list[listIndex].id;
					}
				}
				timestamp += 1;
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
