<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>map</title>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<!-- 新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet"
	href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">

<!-- 可选的Bootstrap主题文件（一般不用引入） -->
<link rel="stylesheet"
	href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">

<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<style>
html,body,#map-canvas {
	height: 100%;
}

.board {
	height: 800px;
}
</style>
</head>
<body>
	<div class='container'>
		<div class='jumbotron'>
			<h2>
				<a href='background.jsp'>Background</a>
			</h2>
			<button type="submit" id="toIssue">对于该系统有更好的建议，请点击此处留言！</button>
			<input type="checkbox" id="broadMessage" checked>广播</input> <!-- <input
				type="checkbox" id='receiveMessage' checked type="hidden">同步</input> -->
		</div>
		<div class='row'>
			<div class='col-md-8'>
				<input id='POIContent' placeholder="content" type="time"></input> <input
					id='POInfo' placeholder="POI"></input>
				<button id="addPOI">add POI</button>
				<button id="addLine">add line</button>
				<br>
				<span id='piclPOI'></span>
				<div class='board'>
					<div id="map-canvas"></div>
				</div>
			</div>
			<div class='col-md-4'>
				<div id='dashboard' class="board">
					<h3>
						<span class="label label-default">在线用户</span>
					</h3>
					<div id='userList'></div>
					<h3>
						<span class="label label-default">聊天框</span>
					</h3>
					<div id='messagelist'></div>
					<textarea id='messagebox' class="form-control" rows="3"></textarea>
					<button id='sendMessage' class="btn btn-default" type="button">发送</button>
					<h3>
						<span class="label label-default">添加的兴趣点(右键对应项可删除)</span>
					</h3>
					<ul id='POIList' class="list-group">
					</ul>
					<h3>
						<span class="label label-default">添加的连线(右键对应项可删除)</span>
					</h3>
					<ul id='lineList' class="list-group">
					</ul>
					<button id="myItinerary">My Itinerary</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- modal  -->
	<div class="modal fade" id="myModal">
  		<div class="modal-dialog modal-sm">
    		<div class="modal-content">
      			<div class="modal-header">
        			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        			<h4 class="modal-title">选择要替换的点</h4>
      			</div>
      			<div class="modal-body" id="updateList">
        			<p>One fine body&hellip;</p>
      			</div>
      			<div class="modal-footer">
        			<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        			<button type="button" class="btn btn-primary">确定</button>
      			</div>
    		</div><!-- /.modal-content -->
  		</div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
</body>
</html>
<script type="text/javascript" src="./js/util/node.js"></script>
<script type="text/javascript" src="./js/util/queue.js"></script>
<script type="text/javascript" src="./js/util/ast.js"></script>
<script
	src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places"></script>
<script type="text/javascript" src="./js/googlemap.js"></script>
<script type="text/javascript" src="./js/googlewebsocket.js"></script>
<script type="text/javascript" src="./js/user.js"></script>
<script type="text/javascript" src="./js/message.js"></script>
