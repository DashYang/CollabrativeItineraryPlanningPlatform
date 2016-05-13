var map;
var mouse_marker = new google.maps.Marker({});
var service;
var infowindow;
var POIs = new Array();
var date, city, group;
// 初始化地图
function initialize() {
	checkMapIdentity();
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		zoom : 10,
		center : {
			lat : 31.233,
			lng : 121.491
		}
	});
	locateMyCity(city);
	checkUserIdentity();
	loadingHistoryMessage();
	initGoogleAutoCompleteText();
}

// 初始化补全框
function initGoogleAutoCompleteText() {
	var input = document.getElementById('POInfo');
	var searchBox = new google.maps.places.SearchBox(input);
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});
}

function checkMapIdentity() {
	date = getUrlParam("date");
	city = getUrlParam("city");
	group = getUrlParam("group");
	if (date == null || city == null || group == null) {
		alert("map info not correct!");
		location.href = "index.jsp";
	}
}

function updatePOIBasic(message) {
	var index = message.start;
	var type = message.end;
	var doc = POINodes;
	if (type == "line")
		doc = lineNodes;
	var targetIndex = getRealIndex(doc, index);
	doc[targetIndex].appendStateVector(message);
}

function updatePOINodeList(targetUsername) {
	var listHtml = "";
	var actList = new Array();
	var start = itineraryGraph['0'];
	if(start.userInfoList[targetUsername] == null) {
		itineraryGraph["0"].userInfoList[targetUsername]= new UserInfo(targetUsername,'1',"",orginalSV,orginalSV);
		itineraryGraph['1'].userInfoList[targetUsername]=  new UserInfo(targetUsername,'',"",orginalSV,orginalSV);
	}
	actList.push(start);
	var cur = start.userInfoList[targetUsername].nextId;
	while(cur != null && cur != "1") {
		actList.push(itineraryGraph[cur]);
		cur = itineraryGraph[cur].userInfoList[targetUsername].nextId;
	}
	var targetBoard = $("#schedule");
	var userboard = $("#who");
	if (targetUsername == username)
		userboard.text("My");
	else
		userboard.text(targetUsername);
	
	for ( var index = 1; index < actList.length ; index += 1) {
		var PreId = actList[index-1].identifier;
		var tarId = actList[index].identifier;
		if (actList[index].userInfoList[targetUsername].death == INFINITE) {
			var insertButton = "<button id='i"
					+ PreId
					+ "' type='button' class='insertPOIbuttoon btn btn-default btn-xs'>"
					+ "ib" + "</button>";
			var deleteButton = "<button id='d"
				+ tarId
				+ "' type='button' class='deletePOIbuttoon btn btn-default btn-xs'>"
				+ "d" + "</button>";
			listHtml += "<li id='poi" + tarId
					+ "'class='list-group-item list-group-item-info'>"
					+ actList[index].title + " "
					+ actList[index].content + insertButton
					+ deleteButton+ "</li>";
		}
	}
	
	var PreId = actList[actList.length - 1].identifier;
	var addButton = "<button id='i"
		+ PreId
		+ "' type='button' class='insertPOIbuttoon btn btn-default btn-xs'>"
		+ "add" + "</button>";
	listHtml += "<li id='poi" + PreId
		+ "'class='list-group-item list-group-item-info'>" + addButton
		+ "</li>";

	targetBoard.html(listHtml);

	$(".insertPOIbuttoon").click(function(e) {
		var preId = $(this).attr("id").substr(1);
		if(lastActivePOI != null) {
			var newMessage = new message(null);
			newMessage.make(preId, lastActivePOI.title, lastActivePOI.content, lastActivePOI.getPosition(), "add", targetUsername);
			add(newMessage);
			sendMessage(newMessage);
			lastActivePOI.setMap(null);
			updatePOINodeList(targetUsername);
			createItineraryMap();
		}
		else
			alert("pick up a POI!");
	});
	
	$(".deletePOIbuttoon").click(function(e) {
		var targetId = $(this).attr("id").substr(1);
		var newMessage = new message(null);
		var target = itineraryGraph[targetId];
		newMessage.make(targetId, target.title, target.content, target.latlon, "delete", targetUsername);
		deleteNode(newMessage);
		sendMessage(newMessage);
		updatePOINodeList(targetUsername);
		createItineraryMap();
	});
}

function addLineBasic(selectedStartPOI, selectedEndPOI) {
	var lineSymbol = {
		path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW
	};
	var line = new google.maps.Polyline(
			{
				path : [ selectedStartPOI.getPosition(),
						selectedEndPOI.getPosition() ],
				icons : [ {
					icon : lineSymbol,
					offset : '100%'
				} ],
				map : map
			});
}

function createItineraryMap() {
	
	var start = itineraryGraph['0'];
	for (name in start.userInfoList) {
		var curId = start.userInfoList[name].nextId;
		var lastPOI = null;
		while(curId != null && curId != "1") {
			var POI = itineraryGraph[curId].getMarker();
			placeMarker(POI, map);
			if (lastPOI != null) {
				addLineBasic(lastPOI, POI);
			}
			lastPOI = POI;
			curId = itineraryGraph[curId].userInfoList[name].nextId;
		}
	}
}


var lastActivePOI = null;
function clictPOIEvent() {
	var nextPOI = $(this)[0];
	if (lastActivePOI != null && nextPOI != lastActivePOI)
		lastActivePOI.setAnimation(null);
	lastActivePOI = nextPOI;
	lastActivePOI.setAnimation(google.maps.Animation.BOUNCE);

}

function addPOIBasic(latLng, title, content) {
	var POIMarker = new google.maps.Marker({
		position : latLng,
		title : title,
		content : content,
		animation : google.maps.Animation.DROP,
	});
	placeMarker(POIMarker, map);
	POIMarker.addListener('click', clictPOIEvent);

	POIs.push(POIMarker);
	map.panTo(latLng);

}

// 文字搜索的回调函数，标记地点
function callback(results, status) {
	var content = $("#POIContent").val();
	if (status == google.maps.places.PlacesServiceStatus.OK /** && content != ""* */
	) {
		if (results.length > 0) {
			var place = results[0];
			//
		//	attachStartTime("addPOI:" + place.name);
			//

			addPOIBasic(place.geometry.location, place.name, content);
		}
	} else {
		alert("输入备注");
	}
}

$("#addPOI").click(function() {
	var text = $("#POInfo").val();
	var centerPoint = map.getCenter();
	var request = {
		location : centerPoint,
		radius : '500',
		query : text
	};
	service = new google.maps.places.PlacesService(map);
	service.textSearch(request, callback);
});

function panToCity(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		if (results.length > 0) {
			var place = results[0];
			map.panTo(place.geometry.location);
		}
	} else {
		alert("找不到该城市");
	}
}
// 定位我的城市
function locateMyCity(city) {
	var request = {
		query : city
	};
	service = new google.maps.places.PlacesService(map);
	service.textSearch(request, panToCity);
}

function placeMarker(marker, map) {
	marker.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);
