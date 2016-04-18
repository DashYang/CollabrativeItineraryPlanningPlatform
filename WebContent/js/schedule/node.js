
function StateVector(lastUpdateId , owner , timestamp) {
	this.lastUpdateId = lastUpdateId;
	this.owner = owner;
	this.timestamp = timestamp;
}

function Node(item) {
	this.item = item;
	this.stateVectors = new Array();
	this.valid = false;
	this.appendStateVector = function(stateVector) {
		this.stateVectors.push(stateVector);
	}; 
	this.getValid = function() {
		return this.valid;
	};
	this.setValid = function(valid) {
		this.valid = valid;
	};
	this.getStateVector = function() {
		return this.stateVectors;
	};
}

var allSchedule = new Object();

function initMyNodes(username) {
	var POINodes = new Array();
	var firstPOINode = new Node(null);
	var POIMessage1 = new Object();
	POIMessage1['lastUpdateId'] = -1000;
	POIMessage1['id'] = -999;
	POIMessage1['type'] = "addPOI";
	POIMessage1['content'] = "first";
	firstPOINode.appendStateVector(POIMessage1);
	POINodes.push(firstPOINode);
	
	var lastPOINode = new Node(null);
	var POIMessage2 = new Object();
	POIMessage2['lastUpdateId'] = -1;
	POIMessage2['id'] = -999;
	POIMessage2['type'] = "addPOI";
	POIMessage2['content'] = "last";
	lastPOINode.appendStateVector(POIMessage2);
	POINodes.push(lastPOINode);
	
	if(allSchedule[username] == null) 
		allSchedule[username] = POINodes;
}

function deletePOIExtraEffect(POIndex) {
	var uuid = POINodes[POIndex].item.uuid;
	for(var index = 1 ; index < lineNodes.length -1 ;  index += 1 ) {
		if(lineNodes[index].getValid() == true) {
			var start = lineNodes[index].item.start.uuid;
			var end = lineNodes[index].item.end.uuid;
			if(uuid == start || uuid == end) {
				lineNodes[index].setValid(false);
				lineNodes[index].item.line.setVisible(false);
			};
		};
	};
};

