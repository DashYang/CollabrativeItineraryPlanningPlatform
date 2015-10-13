<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Background</title>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
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
			<h2>Background</h2>
			<P>旅游路线规划这个问题有着长远而深刻的研究与讨论，有的人将他看作是求解定向越野问题（orienteering problem）[1]，即在有限制的图上寻找最优解的问题。这是一类NP-Hard问题，不少人已经在特定情况下给出了该问题的一般算法。比如分支限界解法[2,3]和DP解法[4,5]。后来，人们开始采用启发式算法（Meta-heuristics）去解决此类问题，比如遗传算法[6]，神经网络算法[7]，还有的研究是通过聚类的方式解决具有分类限制的定向越野问题[8]。有的人将他看成是路径生成问题（itinerary generation）一般有“两阶段过程”(two-step scheme).首先通过数据发掘的方式从用户的网上行为模式中发现用户的旅行模式[9,10,11],然后再根据这些信息推荐新的路径规划[12,13,14]。后来有人在OP的基础上引入了TOP(team orienteering problem)思路去解决多天的路径规划问题[15]。还有的人将重心放在兴趣点（POI）的获取上，他们研究的侧重点在包含了一系列POI的travel package上与路径推荐的关系上[16]。而上述的几种方式，都采取自动化路径推荐的方式，采用特定的算法去完成路径推荐，用户本身不需要主动的参与其中。后来有人将众包的方式引入旅游路线规划之中，发现自动化的路径规划方式可能无法满足一些软考虑（soft consideration）的问题，而且众包的方式能够充分的利用群体的智慧，并且结合组件的思想将参与旅游规划的人能够协同编辑同一份旅游规划[18]。组件工作的思想是将多人能够同时操作共享的内容[19],在操作共享内容的时候，并发操作会导致冲突从而引起结果的不一致，因此提出了并发控制的思想[20],通过变换操作来消除冲突操作。此外也提出了通过地址空间转化来消除冲突操作的思路[21]。研究表明，在规划过程中往往会出现收敛（analytical）或者发散（creative）的过程[22]。而我们的工作，就是借由地址空间转换算法的思路来完成路径规划的平台，实现多人同时工作，满足用户的软考虑，同时利用群体的智慧性，并且最后的路径可以收敛或者发散。</P>
			<h2>Question</h2>
			<p>假设你们是一个团体，打算去上海旅游，请在地图上标记你们的旅游路线，点击add POI在图上添加点，右键点可以取消，点击add line后，分别选择起点和终点进行连线</p>
			<h2>Operation</h2>
			<p>add POI(添加兴趣点):在图中添加一个点，表示将会在此处停留，这个点可以是景点，车站或者旅店 ,右键删除</p>
			<p>add Line(添加有向线段):在图中选取一个起点和一个终点进行连线，表示将会从哪个POI到哪个POI,选取的不是POI则无法连线，右键删除</p>
		</div>
	</div>
</body>
</html>