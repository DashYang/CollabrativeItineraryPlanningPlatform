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

function findPOIByPoistion(latLng) {
	for (index in POIs) {
		if (POIs[index].getPosition().toUrlValue() == latLng.toUrlValue())
			return index;
	}
	return -1;
}

// 删除marker（原子操作）
function deletePOIBasic(message) {
	var index = message.content;
	var targetIndex = getRealIndex(POINodes, index);
	POINodes[targetIndex].appendStateVector(message);
	// deletePOIExtraEffect(index);
	// updatePOINodeList();
	// updateLinelist();
}

// function updatePOIBasic(message) {
// var index = message.start;
// var targetIndex = getRealIndex(POINodes, index);
// POINodes[targetIndex].appendStateVector(message);
// }

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
	var id = 0;
	var POINodes = allSchedule[targetUsername];
	var targetBoard = $("#schedule");
	var userboard = $("#who");

	if (targetUsername == username)
		userboard.text("My");
	else
		userboard.text(targetUsername);

	if (POINodes != null) {
		for ( var index = 1; index < POINodes.length - 1; index += 1) {
			if (POINodes[index].item.getVisible() == true) {
				var updateButton = "<button id='u"
						+ id
						+ "' type='button' class='updatePOIbuttoon btn btn-default btn-xs'>update</button>";
				var insertButton = "<button id='i"
						+ id
						+ "' type='button' class='insertPOIbuttoon btn btn-default btn-xs'>"
						+ "insert before" + "</button>";
				listHtml += "<li id='poi" + id
						+ "'class='list-group-item list-group-item-info'>"
						+ POINodes[index].item.getTitle() + " "
						+ POINodes[index].item.content + insertButton
						+ updateButton + "</li>";
				id += 1;
			}
		}
	}

	var addButton = "<button id='i"
			+ id
			+ "' type='button' class='insertPOIbuttoon btn btn-default btn-xs'>"
			+ "add" + "</button>";

	listHtml += "<li id='poi" + id
			+ "'class='list-group-item list-group-item-info'>" + addButton
			+ "</li>"

	targetBoard.html(listHtml);

	$(".insertPOIbuttoon").click(function(e) {
		var position = $(this).attr("id").substr(1);
		if(lastActivePOI != null) {
			addPOIMessage(lastActivePOI,targetUsername,position);
			lastActivePOI.setMap(null);
		}
		else
			alert("pick up a POI!");
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
	for (name in allSchedule) {
		var POINodes = allSchedule[name];
		var lastPOI = null;
		for ( var index = 1; index < POINodes.length - 1; index += 1) {
			var POI = POINodes[index].item;
			placeMarker(POI, map);
			if (lastPOI != null) {
				addLineBasic(lastPOI, POI);
			}
			lastPOI = POI;
		}
	}
}

function deletePOIButtonOfAgent(POId) {
	var realIndex = getRealIndex(POINodes, POId);

	//
	attachStartTime("deletePOI:" + POINodes[realIndex].item.getTitle());
	//

	deletePOIMessage(POINodes[realIndex].item.getPosition(),
			POINodes[realIndex].item.getTitle(), POId);
}

function getRealIndex(doc, index) {
	var targetIndex = 1;
	for (; targetIndex < doc.length - 1; targetIndex += 1) {
		if (index == 0 & doc[targetIndex].getValid() == true)
			break;
		if (doc[targetIndex].getValid() == true)
			index -= 1;
	}
	return targetIndex;
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
			attachStartTime("addPOI:" + place.name);
			//

			addPOIBasic(place.geometry.location, place.name, content);
		}
	} else {
		alert("输入备注");
	}
}

// 对于POI添加监听事件，连线用
function addListenerToPOIs() {
	for (index in POINodes) {
		google.maps.event
				.addDomListener(POINodes[index].item, 'click', addLine);
	}
}

// 清除监听
function removeListenerToPOIs() {
	for (index in POINodes) {
		google.maps.event.clearListeners(POINodes[index].item, 'click');
	}
}

// 根据经纬度找到POI
function getSelectedPOI(latLng) {
	for (index in POIs) {
		if (POIs[index].getPosition().toUrlValue() == latLng.toUrlValue())
			return POIs[index];
	}
	return null;
}

// updateNode(原子操作)
function updateNodeBasic(message) {
	var index = message.content;
	var targetIndex = getRealIndex(POINodes, index);
	POINodes[targetIndex].appendStateVector(message);
}

function updateNode(index) {
	var realIndex = getRealIndex(POINodes, index);
	var selectedPOI = POINodes[realIndex].item;
	var content = $("#POIContent").val();
	$("#piclPOI").html("update:" + selectedPOI.getTitle() + " " + content);

	//
	attachStartTime("updatePOI:" + selectedPOI.getTitle() + " " + content);
	//

	updatePOIMessage(index, "node", content);
}

$("#addLine").click(function() {
	arrow = new Array();
	var content = $("#POIContent").val();
	if (content != "") {
		addListenerToPOIs();
	} else {
		alert("输入备注");
	}
});

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
