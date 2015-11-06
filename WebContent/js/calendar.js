function getUrlParam(name){
	//构造一个含有目标参数的正则表达式对象
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	//匹配目标参数
	var r = window.location.search.substr(1).match(reg);
	//返回参数值
	if (r!=null) return unescape(r[2]);
	return null;
}

var username = "";
var groupId = "";
var groupName = "";
//验证用户身份
function checkUserIdentity() {
	username = getUrlParam("username");
	groupId = getUrlParam("groupId");
	if( username == null || groupId == null) {
		alert("please log in!");
	//	location.href = "index.jsp";
	}
}

checkUserIdentity();

function getGroupById() {
	$.ajax({
        type: "post",//请求方式
        url: "./saveGroup",//发送请求地址
        dataType: "json",//返回json格式的数据
        data: {
            type : "getGroupById",
            groupId : groupId
        },
        success: function (jsonData) {
        	if (jsonData.result == true) {
        		groupName = jsonData.group.name;
        		$("#group").text(groupName);
        		updateEventList(groupName);
            } else {
                alert("fail");
            }
        } 
    });
}

$(".event_status_item").click(function(){
	var item = $(this).text();
	$("#event_status").html(item+"<span class='caret'></span>");
});

$(".user_status_item").click(function(){
	var item = $(this).text();
	$("#user_status").html(item+"<span class='caret'></span>");
});

function initialise() {
	$("#owner").text(username);
	getGroupById();
}

initialise();

function updateEventList(groupName) {
	$.ajax({
        type: "post",//请求方式
        url: "./saveEvent",//发送请求地址
        dataType: "json",//返回json格式的数据
        data: {
            type : "getEvents",
            groupId : groupId
        },
        success: function (jsonData) {
        	if (jsonData.result == true) {
        		var list = jsonData.list;
            	var str = "<table class='table table-striped'>";
            	str += "<tr><th>username</th><th>groupName</th><th>startDate</th>" +
            			"<th>endDate</th><th>city</th><th>event</th>" +
            			"<th>user_status</th><th>event_status</th></tr>";
            	for(index in list) {
            		var href =  "google.jsp?date=" + list[index].startDate+ "&city=" + list[index].city + "&group=" + groupName + "&username=" + username;
            		str += "<tr><td>" + list[index].username + "</td><td>" + groupName  + "</td><td>" + list[index].startDate  + "</td>" +
            				"<td>" + list[index].endDate + "</td><td>" + list[index].city  + "</td><td><a href='" + href + "'>" + list[index].event  + "</a></td>" +
            						"<td>" + list[index].user_status + "</td><td>" + list[index].event_status  + "</td></tr>";
            	}
            	str += "</table>";
            	$("#eventlist").html(str);
            } else {
                alert("fail");
            }
        } 
    });
}

$("#saveEvent").click(function(){
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var city = $("#city").val();
	var event = $("#event").val();
	var user_status = $("#user_status").text();
	var event_status = $("#event_status").text();
	$.ajax({
        type: "post",//请求方式
        url: "./saveEvent",//发送请求地址
        dataType: "json",//返回json格式的数据
        data: {
            type : "saveEvent",
            username : username ,
            groupId : groupId ,
            startDate : startDate,
            endDate : endDate,
            city : city,
            event : event,
            user_status : user_status,
            event_status : event_status
        },
        success: function (jsonData) {
        	if (jsonData.result == true) {
                alert("保存成功");
                updateEventList(groupName);
            } else {
                alert("保存失败");
            }
        } 
    });
});
