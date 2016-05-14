var ackIndex = 0;
var localMessageLog = new Queue();
localMessageLog.init();
var remoteMessageLog = new Queue();
remoteMessageLog.init();

function isHappenedBefore(sv1, sv2) {
	if (sv1.user == sv2.user) {   //L->L R->R(same user)
		if (sv1.opcnt < sv2.opcnt) {
			return true;
		} else {
			return false;
		}
	} else if (sv1.user != username && sv2.user != username) { // R->R(different user)
		if (sv1.SRN <= sv2.lastUpdateSRN) {
			return true;
		}
		else {
			return false;
		}
	} else if (sv1.user == username) {                     //L->R
		var opcnt = sv1.opcnt;
		var srn = localMessageLog.get(opcnt).SRN;
		if (srn != null
				&& srn <= sv2.lastUpdateSRN) {
			return true;
		} else {
			return false;
		}
	} else {                                                
		if (sv1.SRN <= sv2.lastUpdateSRN) {           //R->L
			return true;
		}
		else {
			return false;
		}
	}
}

function isConcurrent(sv1, sv2) {
	if(isHappenedBefore(sv1,sv2) || isHappenedBefore(sv2,sv1))
		return false;
	return true;
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

function torder(identifier1, identifier2) {
	return identifier1 < identifier2;
}

//sv1 < sv2
function compareSV(sv1, sv2) {
	if(sv1.user == sv2.user)
		return sv1.opcnt < sv2.opcnt;
	else if(sv1.user == username) {
		var srn = localMessageLog.list[sv1.opcnt].SRN;
		if(srn == null) {
			return false;
		} else {
			return srn < sv2.SRN;
		}
	} else if(sv2.user == username) {
		var srn = localMessageLog.list[sv2.opcnt].SRN;
		if(srn == null) {
			return true;
		} else {
			return sv1.SRN < srn;
		}
	} else {
		return sv1.SRN < sv2.SRN;
	}
}
//parameter should be message
function add(message) {
	var targetUser = message.targetUser;
	//check
	var start = itineraryGraph['0'];
	if(start.userInfoList[targetUser] == null) {
		itineraryGraph["0"].userInfoList[targetUser]= new UserInfo(targetUser,'1',"",orginalSV,orginalSV);
		itineraryGraph['1'].userInfoList[targetUser]=  new UserInfo(targetUser,'1',"",orginalSV,orginalSV);
	}
	//check
	
	var preId = message.identifier;
	var activity = message.getActivity();
	var lastUpdateSRN = message.lastUpdateSRN;
	var previous = itineraryGraph[preId];
	if(itineraryGraph[activity.identifier] == null) {
		itineraryGraph[activity.identifier] = activity;
		itineraryGraph[activity.identifier].userInfoList[targetUser] = new UserInfo(targetUser,-1,-1,orginalSV,orginalSV);
	} else {
		console.log("wrong operation");
	}
	var current = itineraryGraph[activity.identifier];

	/**
	 * trick
	 */
//	if(current.userInfoList[targetUser] != null) {
//		if(current.userInfoList[targetUser].birth > lastUpdateId)
//			return
//		// rollBack other add operation
//		var originalPrevious = itineraryGraph[current.userInfoList[targetUser].previousId];
//		var originalNextId = current.userInfoList[targetUser].nextId;
//		originalPrevious.userInfoList[targetUser].nextId = originalNextId;
//	} 
	var sv = new stateVector(message.opcnt, message.user,message.SRN, lastUpdateSRN)
	var realPreviousId = rangeScan(previous, targetUser, sv);
	var realPrevious = itineraryGraph[realPreviousId];
	var nextId =  realPrevious.userInfoList[targetUser].nextId;
	realPrevious.userInfoList[targetUser].nextId = current.identifier;
	current.userInfoList[targetUser].nextId = nextId;
	current.userInfoList[targetUser].birth = sv;   // id could be null
	current.userInfoList[targetUser].death = getMyINFINITE(message.user);
	itineraryGraph[activity.identifier] = current;
	itineraryGraph[realPreviousId] = realPrevious;
	
	if(POIMap[message.latlon] == null) {
		POIMap[message.latlon] = activity.getMarker();
	} else {
		alert("exist poi");
	}
};

function deleteNode(message) {
	var targetUser = message.targetUser;
	var activity = message.getActivity();
	var current = itineraryGraph[activity.identifier];
	var originalDeath = current.userInfoList[targetUser].death;
	var lastUpdateSRN = message.lastUpdateSRN;
	var newDeath = new stateVector(message.opcnt, message.user,message.srn,lastUpdateSRN)
	if(compareSV(newDeath,originalDeath))
		itineraryGraph[activity.identifier].userInfoList[targetUser].death = newDeath;
};

function rangeScan(previous, targetUser, sv) {
	var nextId = itineraryGraph[previous.identifier].userInfoList[targetUser].nextId;
	var realPreviousId = "-1";
	previousId = previous.identifier;
	var current = itineraryGraph[nextId];
	currentSV = current.userInfoList[targetUser].birth;
	while(isConcurrent(currentSV,sv) || 
			!isHappenedBefore(currentSV,sv)) {
		if(torder(sv,currentSV) && realPreviousId == "-1") {
			realPreviousId = previousId;
		}
		if(torder(currentSV,sv) && realPreviousId != -1 && isHappenedBefore(currentSV,
				itineraryGraph[realPreviousId].userInfoList[targetUser].birth)) {
			realPreviousId = "-1";
		}
		previousId = current.identifier;
		current = itineraryGraph[current.userInfoList[targetUser].nextId];
		currentSV = current.userInfoList[targetUser].birth;
	}
	if(realPreviousId == -1)
		return previousId;
	else
		return realPreviousId;
}

function control(message) {
	if(message.type == "add") {
		add(message);
	} else {
		deleteNode(message);
	}
	updatePOINodeList(message.targetUser);
	createItineraryMap();
}
