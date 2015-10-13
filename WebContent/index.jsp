<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>login in</title>
<script src="./scripts/jquery-1.7.1.js" type="text/javascript"></script>
</head>
<body>
<div class="controls input-prepend">
								<span class="add-on"><i class="icon-user"></i>
								</span> <input type="text" name="loginName" id="loginName" placeholder="用户名">
                        </div>
                        <div class="controls">
                            <button type="submit"
                                    id="login">登录
                            </button>
                        </div>
</body>
</html>
<script type="text/javascript">
$("#login").click(function () {
	var name = $("#loginName").val();
	if(name != "")
		location.href = "group.jsp?username="+name;
})
</script>