var userList = new Array();
var myDate = new Date();

function addUser(username) {
	var content = "";
	var flag = false;
	for ( var i = 0; i < userList.length; i++) {
		var teammate = userList[i].name;
		if (teammate == username) {
			flag = true;
			break;
		}
	}
	if (flag == false) {
		var user = new Object;
		user['name'] = username;
		userList.push(user);
	}
	for ( var i = 0; i < userList.length; i++) {
		var teammate = userList[i].name;
		var viewbutton = "<button id='v"
			+ teammate
			+ "' type='button' class='viewSchedulebuttoon btn btn-default btn-xs'>"
			+ "view" + "</button>";
		content += "<li id='u" + teammate
		+ "'class='list-group-item'>"
		+ teammate + " "
		+ viewbutton + "</li>";
	}
	$("#userList").html(content);
	$(".viewSchedulebuttoon").click(function(e) {
		//view others' schedule
		var targetUsername = $(this).attr("id").substr(1);
		updatePOINodeList(targetUsername);
	});
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