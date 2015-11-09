var timeArray = new Array();
var front = 0;

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