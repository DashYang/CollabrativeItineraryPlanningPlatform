var map;
var mouse_marker = new google.maps.Marker({});
var service;
var infowindow;
var voteNumber = new Array();
var date, city, group;
// 初始化地图
function initialize() {
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		zoom : 10,
		center : {
			lat : 31.233,
			lng : 121.491
		}
	});
	checkMapIdentity();
	checkUserIdentity();
	addUser(username);
	locateMyCity(city);
	initGoogleAutoCompleteText();
	lock_sync_method();
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

function findLineByPoistion(startLatLng, endLatLng) {
	for (index in Lines) {
		if (Lines[index].start.getPosition().toUrlValue() == startLatLng
				.toUrlValue()
				&& Lines[index].end.getPosition().toUrlValue() == endLatLng
						.toUrlValue())
			return index;
	}
	return -1;
}

// 删除marker（原子操作）
function deletePOIBasic(message) {
	var index = message.content;
	var targetIndex = getRealIndex(POINodes, index);
	POINodes[targetIndex].appendStateVector(message);
}

function updatePOINodeList() {
	var listHtml = "";
	for ( var index = 0; index < POINodes.length; index += 1) {
		var deleteButton = "<button id='p"
				+ POINodes[index].id
				+ "' type='button' class='deltePOIbuttoon btn btn-default btn-xs'>"
				+ "x" + "</button>";
		var connectButton = "<button id='c"
				+ POINodes[index].id
				+ "' type='button' class='connectPOIbuttoon btn btn-default btn-xs'>"
				+ "->" + "</button>";
		var updateButtopm = "<button id='u"
				+ POINodes[index].id
				+ "' type='button' class='updatePOIbuttoon btn btn-default btn-xs'>update</button>"
		listHtml += "<li id='poi" + POINodes[index].id
				+ "'class='list-group-item list-group-item-info'>"
				+ POINodes[index].title + " " + POINodes[index].content
				+ deleteButton + connectButton + updateButtopm + "</li>";
	}
	$("#POIList").html(listHtml);
	$('.deltePOIbuttoon').click(function(e) {
		var POId = $(this).attr("id").substr(1);
		// 首节点存在，需要偏移

		//
		attachStartTime("deletePOI:" + POId);
		//
		
		deletePOIMessage("", "", POId);
	});
	$('.connectPOIbuttoon').click(function(e) {
		var POId = $(this).attr("id").substr(1);
		addLine(POId);
	});
	$(".updatePOIbuttoon").click(function(e) {
		var POId = $(this).attr("id").substr(1);
		updateNode(POId);
	});
}

function clearMarkers() {
	for ( var i in POINodes) {
		POINodes[i].setMap(null);
	}
	
	for ( var i in lineNodes) {
		lineNodes[i].item.line.setMap(null);
		lineNodes[i].item.line.setVisible(false);
	}
}

function addPOIBasic(message) {
	var latLng = new google.maps.LatLng(message.start.G, message.start.K);
	var POIMarker = new google.maps.Marker({
		position : latLng,
		title : message.title,
		content : message.content,
		id : message.id
	});
	placeMarker(POIMarker, map);
	map.panTo(latLng);
	POINodes.push(POIMarker);
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


// 投票line
function voteLineBasic(index) {
	voteNumber[index] += 1;
	updateLinelist();
}

// 更新linelist
function updateLinelist() {
	var listHtml = "";
	for ( var index = 0; index < lineNodes.length; index += 1) {
		listHtml += "<li id='l" + lineNodes[index].item.line.id
				+ "' class='list-group-item list-group-item-success'>"
				+ lineNodes[index].item.start.getTitle() + " to "
				+ lineNodes[index].item.end.getTitle() + " "
				+ lineNodes[index].item.content
				+ "</li>";
	}
	$("#lineList").html(listHtml);
	$('.list-group-item-success').mousedown(
			function(e) {
				if (3 == e.which) { // 这 是右键单击事件
					var lineId = $(this).attr("id").substr(1);
					// 首节点的存在，需要偏移
					//
					attachStartTime("deleteline:" + lineId);
					//
					deleteLineMessage("", "", lineId);
				} else if (1 == e.which) { // 这 是左键单击事件
					var lineId = $(this).attr("id").substr(1);
					voteLineBasic(lineId);
					voteLineMessage(Lines[lineId].start.getPosition(),
							Lines[lineId].end.getPosition());
				}
			});
}

function getRealIndex(doc, index) {
	for ( var targetIndex = 0; targetIndex < doc.length; targetIndex += 1) {
		if (doc[targetIndex].id == index)
			break;
	}
	return targetIndex;
}

// 添加line(原子操作)
function addLineBasic(message) {
	var content = message.content;
	var selectedStartPOI = POINodes[getRealIndex(POINodes, message.start)];
	var selectedEndPOI = POINodes[getRealIndex(POINodes, message.end)];
	$("#piclPOI")
			.html(
					"connect:" + selectedStartPOI.title + " to "
							+ selectedEndPOI.title);
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
				map : map,
				id : message.id,
				content : message.content
			});

	var newLine = new Object();
	newLine["start"] = selectedStartPOI;
	newLine["end"] = selectedEndPOI;
	newLine["line"] = line;
	newLine['content'] = content;

	node = new Node(newLine);

	lineNodes.push(node);

}

// updateNode(原子操作)
function updateNodeBasic(message) {
	var index = message.content;
	var targetIndex = getRealIndex(POINodes, index);
	POINodes[targetIndex].appendStateVector(message);
}

var arrow = null;
function addLine(index) {
	if (arrow == null)
		arrow = new Array();
	var button = "#c" + index;
//	$(button).remove();
	arrow.push(index);
	if (arrow.length >= 2) {
		var content = $("#POIContent").val();
		//
		attachStartTime("addLine:" + arrow[0] + "to" + arrow[1]);
		//
		
		addLineMessage(arrow[0], arrow[1], content);
		arrow = null;
	}
}

var pair = null;

function updateNode(index) {
	var realIndex = getRealIndex(POINodes, index);
	var selectedPOI = POINodes[realIndex];
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
