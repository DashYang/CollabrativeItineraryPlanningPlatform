<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Issue</title>
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
	<div class='container'>
		<div class='jumbotron'>
			<h1>Issue</h1>
			<p>请留下您对于该协同旅游路线规划系统的一些意见或者建议！</p>
		</div>
		<textarea id='issueBox' class="form-control" rows="3"></textarea>
		<button id='saveIssue' class="btn btn-default" type="button">保存</button>
		<h3><span class="label label-default">评论列表</span></h3>
		<div id='issuelist'>Loading...</div>
	</div>
</body>
</html>
<script type="text/javascript" src="./js/issue.js"></script>