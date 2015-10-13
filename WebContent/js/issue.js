function getUrlParam(name){
	//构造一个含有目标参数的正则表达式对象
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	//匹配目标参数
	var r = window.location.search.substr(1).match(reg);
	//返回参数值
	if (r!=null) return unescape(r[2]);
	return null;
}

$("#saveIssue").click(function(){
	var content = $("#issueBox").val();
	$.ajax({
        type: "post",//请求方式
        url: "./saveIssue",//发送请求地址
        dataType: "json",//返回json格式的数据
        data: {
        	username: username = getUrlParam("username"),
            content: content,
            type : "saveIssue",
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
	$.ajax({
        type: "post",//请求方式
        url: "./saveIssue",//发送请求地址
        dataType: "json",//返回json格式的数据
        data: {
            type : "getIssues",
        },
        success: function (jsonData) {
        	$("#issuelist").html(jsonData.list);
        }
    });
}
