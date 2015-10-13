/**
 * 调用格式
 *	$.widgetSaveHotSpot({
 *		contextName: "/",
 *		successFunc: function(data){
 *			alert(data.toSource());
 *		}
 *	});
 * @author zhaocanchen
 * @param contextName 当前工程名，可选
 * @param successFunc 回调函数，可选
 * 					  返回data为{userId:用户ID, name:用户名, type:用户类型}
 * @return 快速登录的弹出框，不提供回调函数默认刷新当前页面
 */
(function($) {
	var _defaults = {
		contextName: "/",
		successFunc : null
	}
	var _coverObj = null;
	var _panelObj = null;
	$.extend({
		widgetSaveHotSpot : function (options){
			if(_coverObj == null && _panelObj == null){
				$.extend(_defaults, options || {});
				_coverObj = createConver();
				_panelObj = createPanel();
			}
		}
	});
	function createConver(){
	    var winHeight = $(document).height();
	    var conver = $("<div></div>").addClass("widget-userlogin-conver")
	    .height(winHeight)
	    .appendTo($("#mapIframe"));
	    return conver;
	}
	function createPanel(){
		var panel = $("<div></div>").addClass("widget-userlogin-panel");
		panel.html(
			  "<div class='title'><a class='close' >关闭</a>填写其它信息 </div>"
			+ "<ul>"
			+ 	"<li><label>登录邮箱：</label><input name='email' type='text' /><span class='error'></span></li>"
			+ 	"<li><label>密码：</label><input name='password' type='password' /><span class='error'></span></li>"
			+ 	"<li><button class='button-red'> 登 录 </button></li>"
			+ 	"<li class='error'>用户类型或邮箱或密码错误，请重新输入</li>"
			+ "</ul>"
		);
		//加事件
		$(".title > a", panel).click(function(){
			removeObj();
		});
		$("button", panel).mousedown(function(){
			$(this).removeClass("button-red");
			$(this).addClass("button-red-down");
		}).mouseup(function(){
			$(this).removeClass("button-red-down");
			$(this).addClass("button-red");
		}).click(function(){
			var emailObj = $("input[name='email']", panel); 
			var passwordObj = $("input:password", panel);
			var emailStr = emailObj.val();
			var passwordStr = passwordObj.val();
			if(!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(emailStr)){
				emailObj.next().html("登录邮箱不正确");
				return;
			}
			if(passwordStr.length < 6 || passwordStr.length > 20){
				passwordObj.next().html("密码长度在6-20个字符之间");
				return;
			}
			emailObj.next().html("");
			passwordObj.next().html("");
			validateLogin(emailStr, passwordStr);
		});
        panel.appendTo($("body"));
		return panel;
	}
	function validateLogin(emailStr, passwordStr){
	    $.getJSON('@Url.Action("GetDeparmentDevices", "Map")', {
			 email: emailStr,
			 password: passwordStr
			}, function(data){
				if(data.loginAjaxFlag === true){
					if (typeof _defaults.successFunc == "function") {
						_defaults.successFunc.call(this, data.bpUser);
						removeObj();
					} else {
						window.location.reload();
					}
				}else{
					$("li.error", _panelObj).slideDown("fast");
				}
			}
		);
	}
	function removeObj(){
		_coverObj.remove();
		_panelObj.remove();
		_coverObj = null;
		_panelObj = null;
	}
})(jQuery);