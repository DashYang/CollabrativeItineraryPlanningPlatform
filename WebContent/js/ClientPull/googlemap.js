var map;
var mouse_marker = new google.maps.Marker({});
var service;
var infowindow;
var POIs = new Array();
var Lines = new Array();
var voteNumber = new Array();
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

function updatePOINodeList() {
	var listHtml = "";
	var id = 0;
	for (var index = 1; index < POINodes.length - 1 ; index += 1) {
		if (POINodes[index].item.getVisible() == true) {
			var deleteButton = "<button id='p"
					+ id
					+ "' type='button' class='deltePOIbuttoon btn btn-default btn-xs'>"
					+ "x" + "</button>";
			var connectButton = "<button id='c"
					+ id
					+ "' type='button' class='connectPOIbuttoon btn btn-default btn-xs'>"
					+ "->" + "</button>";
			var updateButtopm = "<button id='u" +
						id +
					"' type='button' class='updatePOIbuttoon btn btn-default btn-xs'>update</button>"
			listHtml += "<li id='poi" + id
					+ "'class='list-group-item list-group-item-info'>"
					+ POINodes[index].item.getTitle() + " "
					+ POINodes[index].item.content + deleteButton
					+ connectButton + updateButtopm + "</li>";
			id += 1;
		}
	}
	$("#POIList").html(listHtml);
	$('.deltePOIbuttoon').click(
			function(e) {
				var POId = $(this).attr("id").substr(1);
				//首节点存在，需要偏移
				var realIndex = getRealIndex(POINodes, POId);
				//
				attachStartTime("deletePOI:" + POINodes[realIndex].item.getTitle());
				//
				deletePOIMessage(POINodes[realIndex].item.getPosition(),
						POINodes[realIndex].item.getTitle(), POId);
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
	var latLng = new google.maps.LatLng(message.start.G, message.start.K);
	var POIMarker = new google.maps.Marker({
		position : latLng,
		title : message.title,
		content : message.content,
	});
	placeMarker(POIMarker, map);

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

// 删除line（原子操作）
function deleteLineBasic(message) {
	var index = message.content;
	var targetIndex = getRealIndex(lineNodes, index);
	lineNodes[targetIndex].appendStateVector(message);
	// lineNodes[index].item.line.setVisible(false);
	// updateLinelist();
}

// 投票line
function voteLineBasic(index) {
	voteNumber[index] += 1;
	updateLinelist();
}

// 更新linelist
function updateLinelist() {
	var listHtml = "";
	var id = 0;
	for (var index = 1 ; index < lineNodes.length - 1 ; index += 1) {
		if (lineNodes[index].item.line.getVisible() == true) {
			listHtml += "<li id='l" + id
					+ "' class='list-group-item list-group-item-success'>"
					+ lineNodes[index].item.start.getTitle() + " to "
					+ lineNodes[index].item.end.getTitle() + " "
					+ lineNodes[index].item.content + "(" + voteNumber[index]
					+ ")" + "</li>";
			id += 1;
		}
	}
	$("#lineList").html(listHtml);
	$('.list-group-item-success').mousedown(
			function(e) {
				if (3 == e.which) { // 这 是右键单击事件
					var lineId = $(this).attr("id").substr(1);
					//首节点的存在，需要偏移
					var realIndex = getRealIndex(lineNodes, lineId);
					//
					attachStartTime("deleteline:" + lineId);
					//
					deleteLineMessage(lineNodes[realIndex].item.start
							.getPosition(), lineNodes[realIndex].item.end
							.getPosition(), lineId);
				} else if (1 == e.which) { // 这 是左键单击事件
					var lineId = $(this).attr("id").substr(1);
					voteLineBasic(lineId);
					voteLineMessage(Lines[lineId].start.getPosition(),
							Lines[lineId].end.getPosition());
				}
			});
}

// 添加line(原子操作)
function addLineBasic(message) {
	var content = message.content;
	var selectedStartPOI = POINodes[getRealIndex(POINodes, message.start)].item;
	var selectedEndPOI = POINodes[getRealIndex(POINodes, message.end)].item;
	$("#piclPOI").html(
			"connect:" + selectedStartPOI.getTitle() + " to "
					+ selectedEndPOI.getTitle());
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

	var newLine = new Object();
	newLine["start"] = selectedStartPOI;
	newLine["end"] = selectedEndPOI;
	newLine["line"] = line;
	newLine['content'] = content;

	node = new Node(newLine);
	node.appendStateVector(message);

	var index = 0;
	for (index = lineNodes.length - 2; index > 0; index -= 1) {
		if (lineNodes[index].getValid() == true) {
			break;
		}
	}
	var targetIndex = rangeScan(lineNodes, index, message);
	lineNodes.splice(targetIndex, 0, node);

	// voteNumber.push(0);
	// updateLinelist();
	// removeListenerToPOIs();
}

//updateNode(原子操作)
function updateNodeBasic(message) {
	var index = message.content;
	var targetIndex = getRealIndex(POINodes, index);
	POINodes[targetIndex].appendStateVector(message);
}

var arrow = null;
function addLine(index) {
	if (arrow == null)
		arrow = new Array();
	var realIndex = getRealIndex(POINodes, index);
	var selectedPOI = POINodes[realIndex].item;
	$("#piclPOI").html("pick:" + selectedPOI.getTitle());
	var button = "#c" + index;
	$(button).remove();
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

