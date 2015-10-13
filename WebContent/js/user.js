var userList = new Array();
var myDate = new Date();

function addUser(username) {
	var content = "";
	var flag = false;
	for ( var i = 0; i < userList.length; i++) {
		content += userList[i].name + " " + userList[i].connectTime + "<br>";
		if (userList[i].name == username) {
			flag = true;
		}
	}
	if (flag == false) {
		var user = new Object;
		user['name'] = username;
		var date = new Date();
		user['connectTime'] = date.toLocaleString(); // 获取当前日期
		userList.push(user);
		$("#userList").html(content + user.name + " " + user.connectTime);
	}else
		$("#userList").html(content);
}

function deleteUser(username) {
	var content = "";
	var pos = -1;
	for ( var i = 0; i < userList.length; i++) {
		if (userList[i].name != username)
			content += userList[i].name + " " + userList[i].connectTime
					+ "<br>";
		else
			pos = i;
	}
	if (pos != -1)
		userList.splice(pos, 1);
	$("#userList").html(content);
}

addUser(username);