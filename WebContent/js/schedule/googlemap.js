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

//function updatePOIBasic(message) {
//	var index = message.start;
//	var targetIndex = getRealIndex(POINodes, index);
//	POINodes[targetIndex].appendStateVector(message);
//}

function updatePOIBasic(message) {
	var index = message.start;
	var type = message.end;
	var doc = POINodes;
	if(type == "line") 
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
	var addButton = "<button id='i"
		+ id
		+ "' type='button' class='connectPOIbuttoon btn btn-default btn-xs'>"
		+ "add" + "</button>";
	if(targetUsername == username)
		userboard.text("My");
	else
		userboard.text(targetUsername);
	
	if(POINodes == null) {
		listHtml += "<li id='poi" + id
		+ "'class='list-group-item list-group-item-info'>"
		+ addButton
		+ "</li>"
		targetBoard.html(listHtml);
		return;
	}
	
	for (var index = 1; index < POINodes.length - 1 ; index += 1) {
		if (POINodes[index].item.getVisible() == true) {
			var updateButton = "<button id='u" +
						id +
					"' type='button' class='updatePOIbuttoon btn btn-default btn-xs'>update</button>";
			var insertButton = "<button id='i"
				+ id
				+ "' type='button' class='connectPOIbuttoon btn btn-default btn-xs'>"
				+ "insert before" + "</button>";
			listHtml += "<li id='poi" + id
					+ "'class='list-group-item list-group-item-info'>"
					+ POINodes[index].item.getTitle() + " " + POINodes[index].item.content
					+ insertButton + updateButton + "</li>";
			id += 1;
		}
	}
	
	addButton = "<button id='i"
		+ id
		+ "' type='button' class='connectPOIbuttoon btn btn-default btn-xs'>"
		+ "add" + "</button>";
	
	listHtml += "<li id='poi" + id
	+ "'class='list-group-item list-group-item-info'>"
	+ addButton
	+ "</li>";
	
	targetBoard.html(listHtml);
	
	$(".updatePOIbuttoon").click(function(e) {
		var POId = $(this).attr("id").substr(1);
		updateNode(POId);
	});
}

function addLineBasic(selectedStartPOI,selectedEndPOI) {
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
	for(name in allSchedule) {
		var POINodes = allSchedule[name];
		var lastPOI = null;
		for(var index=1; index < POINodes.length - 1; index +=1) {
			var POI = POINodes[index].item;
			placeMarker(POI, map);
			if(lastPOI != null) {
				addLineBasic(lastPOI,POI);
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


function addPOIBasic(message) {
	var POINodes = allSchedule[message.user];
	var latLng = new google.maps.LatLng(message.start.G, message.start.K);
	var POIMarker = new google.maps.Marker({
		position : latLng,
		title : message.title,
		content : message.content,
	});
	node = new Node(POIMarker);
	node.appendStateVector(message);

	var index = 0;
	for (index = POINodes.length - 2; index > 0; index -= 1) {
		if (POINodes[index].getValid() == true) {
			break;
		}
	}
	var targetIndex = rangeScan(POINodes, index, message);
	POINodes.splice(targetIndex, 0, node);

	node.item.uuid = POINodes.length; // uuid

	// node.setValid(true);
	// POINodes.push(node);
	map.panTo(latLng);

	// updatePOINodeList();

}

// 文字搜索的回调函数，标记地点
function callback(results, status) {
	var content = $("#POIContent").val();
	if (status == google.maps.places.PlacesServiceStatus.OK /** && content != ""* */
	) {
		if (results.length > 0) {
			var place = results[0];
			var latLng = new Object();
			latLng['G'] = place.geometry.location.lat();
			latLng['K'] = place.geometry.location.lng();

			//
			attachStartTime("addPOI:" + place.name);
			//
			
			addPOIMessage(latLng, place.name, content);
			
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


//updateNode(原子操作)
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
	
	updatePOIMessage(index, "node" , content);
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

