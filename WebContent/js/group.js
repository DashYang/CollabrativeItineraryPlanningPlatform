function getUrlParam(name){
	//构造一个含有目标参数的正则表达式对象
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	//匹配目标参数
	var r = window.location.search.substr(1).match(reg);
	//返回参数值
	if (r!=null) return unescape(r[2]);
	return null;
}

$("#saveGroup").click(function(){
	var name = $("#groupname").val();
	var description = $("#description").val();
	$.ajax({
        type: "post",//请求方式
        url: "./saveGroup",//发送请求地址
        dataType: "json",//返回json格式的数据
        data: {
            name: name,
            description:description,
            type : "saveGroup",
        },
        success: function (jsonData) {
            if (jsonData.result == true) {
                alert("保存成功");
                updateMessageList();
            } else {
                alert("保存失败");
            }
        }
    });
});

updateMessageList();

function updateMessageList() {
	var username = getUrlParam("username");
	$.ajax({
        type: "post",//请求方式
        url: "./saveGroup",//发送请求地址
        dataType: "json",//返回json格式的数据
        data: {
            type : "getGroups",
        },
        success: function (jsonData) {
        	var list = jsonData.list;
        	var str = "<table class='table table-striped'>";
        	str += "<tr><th>name</th><th>description</th></tr>";
        	for(index in list) {
        		str += "<tr><td><a href='calendar.jsp?username=" + username + "&groupId=" + list[index].id + "'>" + list[index].name + "</a></td><td>" + list[index].description  + "</td></tr>";
        	}
        	str += "</table>";
        	$("#grouplist").html(str);
        }
    });
}