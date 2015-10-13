var map = new BMap.Map('map_canvas');
map.centerAndZoom(new BMap.Point(121.491, 31.233), 11);
map.enableScrollWheelZoom();
map.disableDoubleClickZoom();
var arrows = new Array();
var POIs = new Array();

//是否为同一个point
function isSameLocated(point1 , point2) {
	if(point1.lat == point2.lat  && point1.lng == point2.lng)
		return true;
	return false;
}

//根据point返回poi下标，没有则-1
function getPOIndexByPoint(overlay) {
	for(index in POIs) {
		if(isSameLocated(POIs[index].point,overlay.point)) {
			return index;
		}
	}
	return -1;
}

function deletePOIOverlayByPoint(point) {
	var POIndex = getPOIndex(e.overlay);
	if(POIndex != -1) {
		POIs[index].hide();
		return true;
	}
	return false;
}

var deleteOverlay = function(e) {
	for(index in arrows) {
		if(arrows[index].body == e.overlay) {
			arrows[index].body.hide();
			arrows[index].head.hide();
			var points = arrows[index].body.getPath();
			deleteLineMessage(points[0] , points[1]);
		}
	}
	
	for(index in POIs) {
		if(POIs[index] == e.overlay) {
			POIs[index].hide();
			deletePOIMessage(POIs[index].point);
		}
	}
	
};

map.addEventListener("rightclick" , deleteOverlay);

var mkrTool = new BMapLib.MarkerTool(map, {
	followText : "place your POI"
});

$("#addPOI").click(function() {
	mkrTool.open();
})

$("#addLine").click(function() {
	var points       = [],   //用户绘制的点
	drawPoint    = null, //实际需要画在地图上的点
	isBinded = false,
	polylineOptions = {
			strokeColor : "blue",
			strokeWeight : 3,
			strokeOpacity : 0.5
		};
	
	var addLine = function (e) {
		var POIndex = getPOIndexByPoint(e.overlay);
		if(POIndex == -1) {
			alert("wrong pick!");
			map.removeEventListener("click", addLine);
			return;
		}
			
		points.push(e.overlay.point);
		drawPoint = points.concat(points[points.length - 1]);
		if (points.length == 1) {
            overlay = new BMap.Polyline(drawPoint, polylineOptions);
            map.addOverlay(overlay);
		} else {
			map.removeOverlay(overlay);
			addArrow(drawPoint[0] , drawPoint[1] , 10,Math.PI/7);
			addLineMessage(drawPoint[0] , drawPoint[1]);
			map.removeEventListener("click", addLine);
			map.removeEventListener('mousemove', mousemoveAction);
		}
		if (!isBinded) {
	          isBinded = true;
	          map.addEventListener('mousemove', mousemoveAction);
	    }		
	}
	
	/**
     * 鼠标移动过程的事件
     */
    var mousemoveAction = function(e) {
    	overlay.setPositionAt(drawPoint.length - 1, e.point);
    }
	
    var endAddLine = function(e) {
    	map.removeOverlay(overlay);
    	map.removeEventListener('mousemove', mousemoveAction);
    	map.removeEventListener("click", addLine);
    }
    
    map.addEventListener("click", addLine);
    map.addEventListener("rightclick", endAddLine);
})

function storeArrow(polyline , head) {
	var arrow = new Object();
	arrow['body'] = polyline;
	arrow['head'] = head;
	arrows.push(arrow);
}

function addArrow(start, end, length, angleValue) { // 绘制箭头的函数
	var polyline = new BMap.Polyline([
	start, end,
	], {
		strokeColor : "blue",
		strokeWeight : 3,
		strokeOpacity : 0.5,
		StrokeWeight : "dashed"
	});
	polyline.enableMassClear();
	map.addOverlay(polyline);
	var linePoint = polyline.getPath();// 线的坐标串
	var arrowCount = linePoint.length;
	for ( var i = 1; i < arrowCount; i++) { // 在拐点处绘制箭头
		var pixelStart = map.pointToPixel(linePoint[i - 1]);
		var pixelEnd = map.pointToPixel(linePoint[i]);
		var angle = angleValue;// 箭头和主线的夹角
		var r = length; // r/Math.sin(angle)代表箭头长度
		var delta = 0; // 主线斜率，垂直时无斜率
		var param = 0; // 代码简洁考虑
		var pixelTemX, pixelTemY;// 临时点坐标
		var pixelX, pixelY, pixelX1, pixelY1;// 箭头两个点
		if (pixelEnd.x - pixelStart.x == 0) { // 斜率不存在是时
			pixelTemX = pixelEnd.x;
			if (pixelEnd.y > pixelStart.y) {
				pixelTemY = pixelEnd.y - r;
			} else {
				pixelTemY = pixelEnd.y + r;
			}
			// 已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
			pixelX = pixelTemX - r * Math.tan(angle);
			pixelX1 = pixelTemX + r * Math.tan(angle);
			pixelY = pixelY1 = pixelTemY;
		} else // 斜率存在时
		{
			delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
			param = Math.sqrt(delta * delta + 1);

			if ((pixelEnd.x - pixelStart.x) < 0) // 第二、三象限
			{
				pixelTemX = pixelEnd.x + r / param;
				pixelTemY = pixelEnd.y + delta * r / param;
			} else// 第一、四象限
			{
				pixelTemX = pixelEnd.x - r / param;
				pixelTemY = pixelEnd.y - delta * r / param;
			}
			// 已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
			pixelX = pixelTemX + Math.tan(angle) * r * delta / param;
			pixelY = pixelTemY - Math.tan(angle) * r / param;

			pixelX1 = pixelTemX - Math.tan(angle) * r * delta / param;
			pixelY1 = pixelTemY + Math.tan(angle) * r / param;
		}

		var pointArrow = map.pixelToPoint(new BMap.Pixel(pixelX, pixelY));
		var pointArrow1 = map.pixelToPoint(new BMap.Pixel(pixelX1, pixelY1));
		var Arrow = new BMap.Polyline(
				[ pointArrow, linePoint[i], pointArrow1 ], {
					strokeColor : "blue",
					strokeWeight : 3,
					strokeOpacity : 0.5
				});
		map.addOverlay(Arrow);
		
		storeArrow(polyline , Arrow);
	}
}