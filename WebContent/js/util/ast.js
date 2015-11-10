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

function retracing(doc, message) {
	//first and last node
	doc[0].setValid(true);
	doc[doc.length -1].setValid(true);
	
	for ( var index = 1 ; index < doc.length - 1; index += 1) {
		doc[index].setValid(false); // 防止这里面没有节点因果先于
		var stateVectors = doc[index].getStateVector();
		var deletePOIFlag = false;
		var content = "" , contentIndex = -1; 
		for ( var vi in stateVectors) {
			var stateVector = stateVectors[vi];
			if (message == true || isHappenedBefore(stateVector, message)) {
				if (stateVector.type == "addPOI"
						|| stateVector.type == "addLine") {
					doc[index].setValid(true);
					content = stateVector.content;
				} else if (stateVector.type == "deletePOI"
						|| stateVector.type == "deleteLine" /**|| stateVector.type == "updatePOI"**/) {
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
		var myItem = null;
		if (doc == POINodes) {
			myItem = doc[index].item;
		} else
			myItem = doc[index].item.line;
		if (doc[index].getValid() == true) {
			myItem.setVisible(true);
			myItem.content = content;
		} else {
			myItem.setVisible(false);
			if (deletePOIFlag == true) {
				deletePOIExtraEffect(index);
			}
		}
	}
	// console.log(runInfo);
}

function displayNodes(doc, type) {
	var NodesInfo =  type + " : ";
	for ( var index = 1 ; index < doc.length - 1 ; index +=1) {
		var title = "";
		if (type.indexOf("POI") >= 0) {
			title = doc[index].item.getTitle();
		} else {
			title = doc[index].item.start.getTitle() + " to "
					+ doc[index].item.end.getTitle() + " "
		}
		if (doc[index].getValid() == true)
			NodesInfo += "[" + title + "]";
		else
			NodesInfo += "(" + title + ")";
	}
	console.log(NodesInfo);
}

function controlalgorithm(message) {

	retracing(lineNodes, message);
	retracing(POINodes, message);
	displayNodes(lineNodes, "Line");
	displayNodes(POINodes, "POI");

	console.log(" message: " + JSON.stringify(message));
	messageProcess(message);
	
	retracing(lineNodes, true);
	retracing(POINodes, true);
	displayNodes(lineNodes, "Line");
	displayNodes(POINodes, "POI");

	updatePOINodeList();
	updateLinelist();
	
	//
	if(message.user == username)
		attachEndTime();
	else
		attachRemoteTime(message.receiveTime , message.type);
	//
}

// Torder(newMessage) < Torder(excuteMessage)
function torder(newMessage, excuteMessage) {
	var excuteSequnce = excuteMessage.timestamp;
	if (excuteMessage.user == username && ( ackHashMap[excuteSequnce] == null
			|| newMessage.id < ackHashMap[excuteSequnce]) ) {
		return true;
	}
	if(excuteMessage.user != username && newMessage.id < excuteMessage.id)
		return true;
	return false;
}

function rangeScan(doc, nodeIndex, newnode) {
	var targetIndex = -1;
	for ( var i = nodeIndex + 1; i < doc.length; i++) {
		var addNode = doc[i].getStateVector()[0];
		if (!isHappenedBefore(addNode , newnode)) {
			if (torder(newnode, addNode) == true && targetIndex == -1) {
				targetIndex = i;
			}
			if (torder(newnode, addNode) == false) {
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
		return doc.length - 1;
}
