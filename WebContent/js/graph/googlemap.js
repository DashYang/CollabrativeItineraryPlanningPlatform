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

function updatePOINodeList(targetUsername) {
	var cnt = 0;  //experiment
	
	var docInfo = "";
	var listHtml = "";
	var actList = new Array();
	var start = itineraryGraph['0'];
	if (start.userInfoList[targetUsername] == null) {
		itineraryGraph["0"].userInfoList[targetUsername] = new UserInfo(
				targetUsername, '1', "", orginalSV, orginalSV);
		itineraryGraph['1'].userInfoList[targetUsername] = new UserInfo(
				targetUsername, '', "", orginalSV, orginalSV);
	}
	actList.push(start);
	var cur = start.userInfoList[targetUsername].nextId;
	while (cur != null && cur != "1") {
		actList.push(itineraryGraph[cur]);
		cur = itineraryGraph[cur].userInfoList[targetUsername].nextId;
	}
	var targetBoard = $("#schedule");
	var userboard = $("#who");
	if (targetUsername == username)
		userboard.text("My");
	else
		userboard.text(targetUsername);

	myINFINITE = getMyINFINITE(username);
	var PreId = actList[0].identifier;
	for ( var index = 1; index < actList.length; index += 1) {
		if (actList[index].userInfoList[targetUsername].death.opcnt == 0x3fffffff) {
			var tarId = actList[index].identifier;
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
					+ actList[index].title + " " + actList[index].content
					+ insertButton + deleteButton + "</li>";
			docInfo += "[" + actList[index].title + "]";
			PreId = tarId;
			
			
			//experiment
			cnt ++;
			if(cnt >= 10)
				break
				
		} else {
			docInfo += "(" + actList[index].title + ")";
		}
	}

	console.log(docInfo);
	var addButton = "<button id='i"
			+ PreId
			+ "' type='button' class='insertPOIbuttoon btn btn-default btn-xs'>"
			+ "add" + "</button>";
	listHtml += "<li id='poi" + PreId
			+ "'class='list-group-item list-group-item-info'>" + addButton
			+ "</li>";

	targetBoard.html(listHtml);

	$(".insertPOIbuttoon").click(
			function(e) {
				var preId = $(this).attr("id").substr(1);
				if (lastActivePOI != null) {
					var newMessage = new message(null);
					newMessage.make(preId, lastActivePOI.title,
							lastActivePOI.content, lastActivePOI.getPosition(),
							"add", targetUsername);
					display(targetUsername);
					control(newMessage);
					sendMessage(newMessage);
					lastActivePOI.setMap(null);
				} else
					alert("pick up a POI!");
			});

	$(".deletePOIbuttoon").click(
			function(e) {
				var targetId = $(this).attr("id").substr(1);
				var newMessage = new message(null);
				var target = itineraryGraph[targetId];
				newMessage.make(targetId, target.title, target.content,
						target.latlon, "delete", targetUsername);
				display(targetUsername);
				control(newMessage);
				sendMessage(newMessage);
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
	return line;
}

function createItineraryMap() {
	for (latlon in POIMap) {
		POIMap[latlon].marker.setVisible(false);
		POIMap[latlon].userList = new Object();
	}
	for (identifier in ArrowMap) {
		ArrowMap[identifier].line.setVisible(false);
		ArrowMap[identifier].userList = new Object();
	}
	var start = itineraryGraph['0'];
	for (name in start.userInfoList) {
		var curId = start.userInfoList[name].nextId;
		var lastPOI = null;
		var route = new Array();
		while (curId != null && curId != "1") {
			var latlon = JSON.stringify(itineraryGraph[curId].latlon);
			if (POIMap[latlon] == null) {
				var marker = itineraryGraph[curId].getMarker();
				POIMap[latlon] = new POItem(latlon, marker);
				// placeMarker(POIMap[latlon].marker, map);
			}
			if (itineraryGraph[curId].userInfoList[name].death.opcnt == 0x3fffffff) {
				var POI = POIMap[latlon];
				if (lastPOI != null) {
					var str1 = latlon;
					var str2 = lastPOI.latlon;
					var identifier = str1 + ":" + str2;
					if (str1 != str2 && ArrowMap[identifier] == null) {
						// var line = addLineBasic(lastPOI.marker, POI.marker);
						// //arrow
						// ArrowMap[identifier] = new Arrow(identifier,line);
						// //arrow
						// drawRealLine(lastPOI.marker.getPosition(),
						// POI.marker.getPosition()); //real route
					}
					// ArrowMap[identifier].line.setVisible(true); //arrow
					// ArrowMap[identifier].insert(name); //arrow

				}
				// POIMap[latlon].marker.setVisible(true);
				// POIMap[latlon].insert(name);
				route.push(POIMap[latlon].marker.getPosition());
//				console.log(POIMap[latlon].marker.getTitle());
				lastPOI = POI;
			} else {
				// POIMap[latlon].marker.setVisible(false);
			}
			curId = itineraryGraph[curId].userInfoList[name].nextId;
		}
		if (allAgents[name] == null)
			allAgents[name] = new directionAgent();
		RouteMap(route, name);
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
			// attachStartTime("addPOI:" + place.name);
			//
			var lat = place.geometry.location.lat();
			var lng = place.geometry.location.lng();
			var myLatLng = new google.maps.LatLng(lat.toFixed(10), lng.toFixed(10)); 
			addPOIBasic(myLatLng, place.name, content);
		}
	} else {
//		alert("输入备注");
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
//		alert("找不到该城市");
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

function drawRealLine(start, end) {
	var directionsDisplay = new google.maps.DirectionsRenderer({
		map : map
	});

	// Set destination, origin and travel mode.
	var request = {
		destination : end,
		origin : start,
		waypoints : [ {
			location : start,
			stopover : true
		} ],
		travelMode : google.maps.TravelMode.DRIVING
	};

	// Pass the directions request to the directions service.
	var directionsService = new google.maps.DirectionsService();
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			// Display the route on the map.
			directionsDisplay.setDirections(response);
		}
	});
}

var allAgents = new Object();
function directionAgent() {
	this.directionsService = new google.maps.DirectionsService();
	this.directionsDisplay = new google.maps.DirectionsRenderer();
}

function RouteMap(arr, username) {
	// set waypoints
	var directionsService = allAgents[username].directionsService;
	var directionsDisplay = allAgents[username].directionsDisplay;
	var waypoints = [];
	for ( var i = 1; i < arr.length - 1; i++) {
		waypoints.push({
			location : arr[i],
			stopover : true
		});
	}

	// Set destination, origin and travel mode.
	var request = {
		destination : arr[arr.length - 1],
		origin : arr[0],
		waypoints : waypoints,
		travelMode : google.maps.TravelMode.DRIVING
	};

	// Pass the directions request to the directions service.

	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			// Display the route on the map.
			// directionsDisplay.setOptions();
			directionsDisplay.setMap(map);
			directionsDisplay.setDirections(response);
		}
	});
}

// test function
function possesActivity(name) {
	var centerPoint = map.getCenter();
	var request = {
		location : centerPoint,
		radius : '500',
		query : name
	};
	service = new google.maps.places.PlacesService(map);
	service.textSearch(request, function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			if (results.length > 0) {
				var place = results[0];
				var POIMarker = new google.maps.Marker({
					position : place.geometry.location,
					title : place.name,
					content : "test",
					animation : google.maps.Animation.DROP,
				});
				lastActivePOI = POIMarker;
			}
		} else {
//			alert("输入备注");
		}
	});
}