<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>calendar</title>
	<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=2c22bfaefe981ae538e17e182eff2bdf"></script>
	<!-- 新 Bootstrap 核心 CSS 文件 -->
	<link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">

	<!-- 可选的Bootstrap主题文件（一般不用引入） -->
	<link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">

	<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
	<script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
 
	<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
	<script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
</head>
<body>
	<div class="container">
		<div class='jumbotron'>
			<h2>Calendar</h2>
		</div>
		<form class="form-inline">
			<div class="form-group">
    			<label for="owner">owner:</label>
    			<label id="owner">owner</label>
    		</div>
    		<div class="form-group">
    			<label for="owner">group:</label>
    			<label id="group">group</label>
    		</div>
    	</form>
		<form class="form-inline">
  			<div class="form-group">
    			<label for="startDate">Start</label>
    			<input type="date" class="form-control" id="startDate" >
  			</div>
  			<div class="form-group">
    			<label for="endDate">End</label>
    			<input type="date" class="form-control" id="endDate" >
  			</div>
  			<div class="form-group">
    			<label for="city">city</label>
    			<input type="city" class="form-control" id="city" >
  			</div>
  		</form>
  		<form class="form-inline">
  			<div class="form-group">
    			<label for="Event">Event</label>
    			<input type="text" class="form-control" id="event" >
  			</div>
  			<div class="form-group">
    			<div class="btn-group">
  					<button id="user_status" class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    					 free<span class="caret"></span>
  					</button>
  					<ul class="dropdown-menu">
  						 <li><a class="user_status_item" href="#">busy</a></li>
    					 <li><a class="user_status_item" href="#">free</a></li>
  					</ul>
				</div>
  			</div>
  			<div class="form-group">
    			<div class="btn-group">
  					<button id="event_status" class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    					 public<span class="caret"></span>
  					</button>
  					<ul class="dropdown-menu">
  						 <li><a class="event_status_item">public</a></li>
    					 <li><a class="event_status_item">private</a></li>
  					</ul>
				</div>
  			</div>
  			<button id="saveEvent" type="button" class="btn btn-default">Save Event</button>
		</form>
		<h3><span class="label label-default">Event List</span></h3>
		<div id='eventlist'>Loading...</div>
	</div>
</body>
</html>
<script type="text/javascript" src="./js/calendar.js"></script>