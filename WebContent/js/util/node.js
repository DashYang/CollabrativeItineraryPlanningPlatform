
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

var POINodes = new Array();
var lineNodes = new Array();

initMyNodes();

function initMyNodes() {
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
	
	var firstLineNode = new Node(null);
	var LineMessage1 = new Object();
	LineMessage1['lastUpdateId'] = -1000;
	LineMessage1['id'] = 0;
	LineMessage1['type'] = "addPOI";
	LineMessage1['content'] = "first";
	firstLineNode.appendStateVector(LineMessage1);
	lineNodes.push(firstLineNode);
	
	var lastLineNode = new Node(null);
	var LineMessage2 = new Object();
	LineMessage2['lastUpdateId'] = -1;
	LineMessage2['id'] = 0;
	LineMessage2['type'] = "addPOI";
	LineMessage2['content'] = "last";
	lastLineNode.appendStateVector(LineMessage2);
	lineNodes.push(lastLineNode);
	
	
	
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

