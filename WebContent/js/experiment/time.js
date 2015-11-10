var timeArray = new Array();
var front = 0;

var remoteTimeArray = new Array();

function attachStartTime(tag) {
	var startTime = new Date().getTime();
	var timeObject = {startTime : startTime , tag:tag ,endTime : 0};
	timeArray.push(timeObject);
}

function attachEndTime() {
	var endTime = new Date().getTime();
	var timeObject = timeArray[front];
	timeObject.endTime = endTime;
	front += 1;
	console.log(timeObject.tag + ":" + (timeObject.endTime - timeObject.startTime));
//	console.log(getResult());
}

function getResult() {
	var str = "";
	for(var index in timeArray) {
		var timeObject = timeArray[index];
		str += (timeObject.endTime - timeObject.startTime) + ",";
	}
	str = str.substring(0 , str.length-1);
	return str;
}

function attachRemoteTime(receiveTime , tag) {
	var endTime = new Date().getTime();
	var timeObject = {tag:tag , startTime:receiveTime , endTime : endTime};
	console.log(timeObject.tag + ":" + (timeObject.endTime - timeObject.startTime));
	remoteTimeArray.push(timeObject);
}

function getRemoteResult() {
	var str = "";
	for(var index in remoteTimeArray) {
		var timeObject = remoteTimeArray[index];
		str += (timeObject.endTime - timeObject.startTime) + ",";
	}
	str = str.substring(0 , str.length-1);
	return str;
}