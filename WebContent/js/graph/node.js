var INFINITE = new stateVector(0x3fffffff,username,0x3fffffff,0x3fffffff);
var orginalSV = new stateVector(-1,"root",-1,-1);

function getMyINFINITE(username) {
	return new stateVector(0x3fffffff,username,0x3fffffff,0x3fffffff);
}

POIMap = new Object();
itineraryGraph = new Object();
function Activity(id,title, content,latlon) {
	this.title = title;
	this.content = content;
	this.identifier = id;
	this.latlon = latlon;
	this.userInfoList = new Object();
	this.getMarker = function() {
		var POIMarker = new google.maps.Marker({
			position : this.latlon,
			title : this.title,
			content : this.content,
			animation : google.maps.Animation.DROP,
		});
		return POIMarker;
	};
}

function UserInfo(user,nextId,previousId,birth,death) {
	this.user = user;
	this.nextId = nextId;
	this.previousId = previousId;
	this.birth = birth;
	this.death = death;
}

function Operation(activity, type, user, id, lastUpdateSRN) {
	this.activity = activity;
	this.type = type;
	this.targetUser = user;
	this.identifier = id;   //add is preId,delete is target id
	this.lastUpdateSRN = lastUpdateSRN;
}

function message(id) {
/**	this.SRN;
	this.date, city, group, receiveTime, user;   // task
	this.title, content, identifier = id, latlon;   //activity, start is latitude and longtitude
	this.type, targetUser, opcnt, lastUpdateSRN; // operation
**/
	this.init = function() {
		this.date = date;
		this.city = city;
		this.group = group;
		this.user = username;
		this.receiveTime = new Date().getTime();
	}
	this.pack = function(operation) {
		this.title = operation.activity.title;
		this.content = operation.activity.content;
		this.identifier = operation.activity.id;
		this.latlon = operation.activity.latlon;
		this.type = operation.type;
		this.targetUser = operation.targetUser;
		this.identifier = operation.id;
		this.opcnt = myTimestamp;
		myTimestamp += 1;
		this.lastUpdateSRN = operation.lastUpdateSRN;
	}
	
	this.make = function(identifier, title, content, latlon, type, targetUser) {
		this.init();
		this.identifier = identifier;
		this.title = title;
		this.content = content;
		this.latlon = latlon;
		this.type = type;
		this.targetUser = targetUser;
		this.opcnt = getTimestamp();
		this.lastUpdateSRN = remoteMessageLog.getSRN();
	}
	
	this.getActivity = function() {
		return new Activity(this.user+":"+this.opcnt, this.title, this.content, this.latlon);
	}
	this.getOperation = function() {
		return new Operaion(getActivity(), this.type, this.targetUser, this.identifier, this.lastUpdateId);
	}
}

itineraryGraph['0'] = new Activity('0',"start", "","");
itineraryGraph['1'] = new Activity('1',"end", "","");


function stateVector(opcnt, user, SRN,lastUpdateSRN) {
	this.opcnt = opcnt;
	this.user = user;
	this.SRN = SRN;
	this.lastUpdateSRN = lastUpdateSRN;
}
