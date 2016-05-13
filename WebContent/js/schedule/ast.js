var ackHashMap = new Object();

// message1 -> message2
function isHappenedBefore(message1, message2) {
	if (message1.user == message2.user) {
		if (message1.timestamp < message2.timestamp) {
			return true;
		} else {
			return false;
		}
	} else {
		if (message1.user != username && message2.user != username) {
			if (message1.id <= message2.lastUpdateId) {
				return true;
			}
			else {
				return false;
			}
		}
		else if (message1.user == username) {
			var m1sequnce = message1.timestamp;
			if (ackHashMap[m1sequnce] != null
					&& ackHashMap[m1sequnce] <= message2.lastUpdateId) {
				return true;
			} else {
				return false;
			}
		} else {
			if (message1.id <= message2.lastUpdateId) {
				return true;
			}
			else {
				return false;
			}
		}
	}
	return false;
}

function retracing(username, message) {
	//first and last node
	if(allSchedule[username] == null)
		initMyNodes(username);
	
	var doc = allSchedule[username];
	doc[0].setValid(true);
	doc[doc.length -1].setValid(true);
	
	for ( var index = 1 ; index < doc.length - 1; index += 1) {
		doc[index].setValid(false); // 防止这里面没有节点因果先于
		var stateVectors = doc[index].getStateVector();
		var content = "" , contentIndex = -1; 
		for ( var vi in stateVectors) {
			var stateVector = stateVectors[vi];
			if (message == true || isHappenedBefore(stateVector, message)) {
				if (stateVector.type == "addPOI") {
					doc[index].setValid(true);
					content = stateVector.content;
				} else if (stateVector.type == "deletePOI" /**|| stateVector.type == "updatePOI"**/) {
					doc[index].setValid(false);
					if (stateVector.type == "deletePOI" /**|| stateVector.type == "updatePOI"**/) {
						deletePOIFlag = true;
					}
				} else if (stateVector.type == "updatePOI") {
					var stateVectorId = 0;
					doc[index].setValid(true);
					var m1sequnce = stateVector.timestamp;
					if(stateVector.user == username) {
						stateVectorId = ackHashMap[m1sequnce];
					} else {
						stateVectorId = stateVector.id;
					}
					if(stateVectorId == null || stateVectorId > contentIndex) {
						contentIndex = stateVectorId;
						content = stateVector.content;
					}  
				}
			}
		}
		var myItem = doc[index].item;
		if (doc[index].getValid() == true) {
			myItem.setVisible(true);
			myItem.content = content;
		} else {
			myItem.setVisible(false);
		}
	}
	// console.log(runInfo);
}

function displayNodes(username, type) {
	var doc = allSchedule[username];
	var NodesInfo =  type + " : ";
	for ( var index = 1 ; index < doc.length - 1 ; index +=1) {
		var title = "";
		title = doc[index].item.getTitle();
		if (doc[index].getValid() == true)
			NodesInfo += "[" + title + "]";
		else
			NodesInfo += "(" + title + ")";
	}
	console.log(NodesInfo);
}

function controlalgorithm(message) {
	
	var targetUsername = message.targetUser;
	retracing(targetUsername,message);
	displayNodes(targetUsername, "POI");
	
	messageProcess(message);
//	console.log(" message: " + JSON.stringify(message));
	
	retracing(targetUsername, true);
	displayNodes(targetUsername, "POI");
	//
	
	if(targetUsername == $("#who").text())
		updatePOINodeList(targetUsername);
	else if(targetUsername == username && $("#who").text() == "My")
		updatePOINodeList(targetUsername);
	if(message.user == username)
		attachEndTime();
	else
		attachRemoteTime(message.receiveTime , message.type);
	//
}

// Torder(newMessage) < Torder(excuteMessage)
//function torder(newMessage, excuteMessage) {
//	var excuteSequnce = excuteMessage.timestamp;
//	if (excuteMessage.user == username && ( ackHashMap[excuteSequnce] == null
//			|| newMessage.id < ackHashMap[excuteSequnce]) ) {
//		return true;
//	}
//	if(excuteMessage.user != username && newMessage.id < excuteMessage.id)
//		return true;
//	return false;
//}
function torder(newMessage, excuteMessage) {
	var newMessageSequence = newMessage.timestamp;
	var excuteMessageSequence = excuteMessage.timestamp;
	if (excuteMessage.user == newMessage.user && (newMessageSequence < excuteMessageSequence))   
		return true;
	if(newMessage.user == username && ackHashMap[newMessageSequence] != null && ackHashMap[newMessageSequence] < excuteMessage.id)
		return true;
	if(excuteMessage.user == username && ackHashMap[excuteMessageSequence] == null || newMessage.id < ackHashMap[excuteMessageSequence])
		return true;
	if(newMessage.id < excuteMessage.id)
		return true;
	return false;
}

function rangeScan(doc, start, end, newnode) {
	console.log("start:" + start + " end:" + end);
	console.log("POI:" + newnode.title);
	var targetIndex = -1;
	for ( var i = start+1 ; i <= end ; i++) {
		var addNode = doc[i].getStateVector()[0];
		if (!isHappenedBefore(addNode , newnode) && !isHappenedBefore(newnode , addNode)) {
			if (torder(newnode, addNode) == true && targetIndex == -1) {
				targetIndex = i;
			}
			if (torder(newnode, addNode) == false && 
					(targetIndex != -1 && isHappenedBefore(addNode , doc[targetIndex].getStateVector()[0]))) {  
				targetIndex = -1;
			}
		}
		if (isHappenedBefore(addNode, newnode)) {
			if (targetIndex == -1) {
				targetIndex = i;
			}
			break;
		}
	}
	if (targetIndex != -1) {
		return targetIndex;
	} else
		return end;
}

//parameter should be message
function add(message) {
	var targetUsername = message.targetUser;
	var position = message.end;
	var POINodes = allSchedule[targetUsername];
	var start = 0,end = 0;
	var validcnt = 0;
	for (var index = 0; index < POINodes.length && end <= position; index += 1) {
		if (POINodes[index].getValid() == true) {
			validcnt += 1;
			if(validcnt - 1 == position)
				start = index;
			if(validcnt - 2== position) {
				end = index;
				break;
			}
		}
	}
	var targetIndex = rangeScan(POINodes, start, end, message);
	
	var latLng = new google.maps.LatLng(message.start.G, message.start.K);
	var POIMarker = new google.maps.Marker({
		position : latLng,
		title : message.title,
		content : message.content,
	});
	placeMarker(POIMarker, map);

	node = new Node(POIMarker);
	node.appendStateVector(message);
	
	POINodes.splice(targetIndex, 0, node);
	
};

function deleteNode(message) {
	var targetUsername = message.targetUser;
	var position = message.end;
	var POINodes = allSchedule[targetUsername];
	var targetIndex = 1;
	for (; targetIndex < POINodes.length - 1; targetIndex += 1) {
		if (position == 0 & POINodes[targetIndex].getValid() == true)
			break;
		if (POINodes[targetIndex].getValid() == true)
			position -= 1;
	}
	POINodes[targetIndex].appendStateVector(message);
};