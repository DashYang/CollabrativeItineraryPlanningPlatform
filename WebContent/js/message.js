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
			} else {
				alert("fail");
			}
		}
	});
}

function getMyItineraty() {
	$.ajax({
		type : "post",// 请求方式
		url : "./saveMessage",// 发送请求地址
		dataType : "json",// 返回json格式的数据
		data : {
			type : "getItinerary",
			date : "2015/7/28",
			city : "Shanghai",
			group : "cisl",
			user : username
		},
		success : function(jsonData) {
			if (jsonData.result == true) {
				var list = jsonData.list;
				var str = "";
				for (listIndex in list) {
					if (typeof (list[listIndex].start) == "string")
						list[listIndex].start = eval("("
								+ list[listIndex].start + ")");
					if (typeof (list[listIndex].end) == "string")
						list[listIndex].end = eval("(" + list[listIndex].end
								+ ")");
					var startLatLng = new google.maps.LatLng(
							list[listIndex].start.G, list[listIndex].start.K);
					var endLatLng = new google.maps.LatLng(
							list[listIndex].end.G, list[listIndex].end.K);
					var startPOI = getSelectedPOI(startLatLng);
					var endPOI = getSelectedPOI(endLatLng);
					str += startPOI.getTitle() + "(" + startPOI.content + ")"
							+ "to " + endPOI.getTitle() + "(" + endPOI.content
							+ ")" + "\n";
				}
				alert(str);
			} else {
				alert("fail");
			}
		}
	});
}

$("#myItinerary").click(function() {
	getMyItineraty();
});

$("#sendMessage").click(function() {
	var jsonMessage = new Object();
	var content = $("#messagebox").val();
	jsonMessage["timestamp"] = timestamp;
	timestamp += 1;
	jsonMessage["date"] = "2015/7/28";
	jsonMessage["city"] = "Shanghai";
	jsonMessage["group"] = "cisl";
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
			pastContent + user + " 于 " + date.toLocaleString() + " 说:<br>"
					+ content + "<br>");
}
