var receiver;
var users;
var base = 1000;
var msgLocalID=0;
var increase = 25;
var host="120.26.14.35";

util = {
    urlRE: /https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g,
    //  html sanitizer
    toStaticHTML: function (inputHtml) {
        inputHtml = inputHtml.toString();
        return inputHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    //pads n with zeros on the left,
    //digits is minimum length of output
    //zeroPad(3, 5); returns "005"
    //zeroPad(2, 500); returns "500"
    zeroPad: function (digits, n) {
        n = n.toString();
        while (n.length < digits)
            n = '0' + n;
        return n;
    },
    //it is almost 8 o'clock PM here
    //timeString(new Date); returns "19:49"
    timeString: function (date) {
        var minutes = date.getMinutes().toString();
        var hours = date.getHours().toString();
        return this.zeroPad(2, hours) + ":" + this.zeroPad(2, minutes);
    },

    //does the argument only contain whitespace?
    isBlank: function (text) {
        var blank = /^\s*$/;
        return (text.match(blank) !== null);
    }
};
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = decodeURI(window.location.search).substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 
function showLogin(){
	window.location.href="login.html";
}
//always view the most recent message when it is added
function scrollDown(base) {
    window.scrollTo(0, base);
    $("#entry").focus();
}

// add message on board
function addMessage(from, target, text, time) {
    var name = (target == '*' ? 'all' : target);
    if (text === null) return;
    if (time == null) {
        // if the time is null or undefined, use the current time.
        time = new Date();
    } else if ((time instanceof Date) === false) {
        // if it's a timestamp, interpret it
        time = new Date(time);
    }
    //every message you see is actually a table with 3 cols:
    //  the time,
    //  the person who caused the event,
    //  and the content
    var messageElement = $(document.createElement("table"));
    messageElement.addClass("message");
    // sanitize
    text = util.toStaticHTML(text);
    var content = '<tr>' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">' +util.toStaticHTML(from) + ' 对 ' + name+ '  说: ' + '</td>' + '  <td class="msg-text">' + text + '</td>' + '</tr>';
    messageElement.html(content);
    //the log is the stream that we view
    $("#chatHistory").append(messageElement);
    base += increase;
    scrollDown(base);
}
function addRoomMessage(from, target, text, time) {
    var name = (target == '*' ? 'all' : target);
    if (text === null) return;
    if (time == null) {
        // if the time is null or undefined, use the current time.
        time = new Date();
    } else if ((time instanceof Date) === false) {
        // if it's a timestamp, interpret it
        time = new Date(time);
    }
    //every message you see is actually a table with 3 cols:
    //  the time,
    //  the person who caused the event,
    //  and the content
    var messageElement = $(document.createElement("table"));
    messageElement.addClass("message");
    // sanitize
    text = util.toStaticHTML(text);
    var content = '<tr>' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">[' + name+ ']  ' +util.toStaticHTML(from) + '  说: ' + '</td>' + '  <td class="msg-text">' + text + '</td>' + '</tr>';
    messageElement.html(content);
    //the log is the stream that we view
    $("#chatHistory").append(messageElement);
    base += increase;
    scrollDown(base);
}
function addGroupMessage(from, target, text, time) {
    var name = (target == '*' ? 'all' : target);
    if (text === null) return;
    if (time == null) {
        // if the time is null or undefined, use the current time.
        time = new Date();
    } else if ((time instanceof Date) === false) {
        // if it's a timestamp, interpret it
        time = new Date(time);
    }
    //every message you see is actually a table with 3 cols:
    //  the time,
    //  the person who caused the event,
    //  and the content
    var messageElement = $(document.createElement("table"));
    messageElement.addClass("message");
    // sanitize
    text = util.toStaticHTML(text);
    var content = '<tr>' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">[' + name+ ']  ' +util.toStaticHTML(from) + '  说: ' + '</td>' + '  <td class="msg-text">' + text + '</td>' + '</tr>';
    messageElement.html(content);
    //the log is the stream that we view
    $("#chatHistory").append(messageElement);
    base += increase;
    scrollDown(base);
}
 
 
 
// show chat panel
function showChat() {
    $("#loginView").hide();
    $("#loginError").hide();
    $("#entry").show();
    $("#toolbar").show();
    $("entry").focus();
    scrollDown(base);
}

$(document).ready(function () {

	var token =getUrlParam("token");
	var name = decodeURI(getUrlParam("name"));
	var uid = parseInt(getUrlParam("uid"));
	var fisrtLoad=true;
    $("#name").text(name);
	
	
    observer = {
        handlePeerMessage: function (msg) {
			var msgstr=JSON.parse(msg.content);
			
            addMessage(msgstr.sender, msgstr.receiver, msgstr.content);
            $("#chatHistory").show(); 
        },
		handleRoomMessage: function (msg) {
			var msgstr=JSON.parse(msg.content);
            addRoomMessage(msgstr.sender, msgstr.room, msgstr.content);
            $("#chatHistory").show(); 
        },
		handleGroupMessage: function (msg) {
			var msgstr=JSON.parse(msg.content);
            addGroupMessage(msgstr.sender, msgstr.group, msgstr.content);
            $("#chatHistory").show(); 
        },
        handleMessageACK: function(msgLocalID, receiver) { 
		
        },
        handleMessageFailure: function(msgLocalID, receiver) { 
		
        },
		
        onConnectState: function(state) {
            if (state == IMService.STATE_CONNECTED) {
                console.log("im connected");
                // 连接成功
                showChat();
				if(fisrtLoad==true){
					LoadLists();
					fisrtLoad=false;
				}
            } else if (state == IMService.STATE_CONNECTING) {
                //console.log("im connecting");
            } else if (state == IMService.STATE_CONNECTFAIL) {
                //console.log("im connect fail");
            } else if (state == IMService.STATE_UNCONNECTED) {
                //console.log("im unconnected");
                //showLogin();
            }
        }
    };
 
    var im = new IMService(observer);
	
	
    im.host = host;
    im.accessToken = token;
    im.start();  
   	var $select=  $(".selectable").selectable();
	var $tabs =$( "#tab" ).tabs();
 
	 

 
    //deal with chat mode.
    $("#entry").keypress(function (e) { 
		
        if (e.keyCode != 13 /* Return */) return;
        var msg = $("#entry").val().replace("\n", "");
		
		if(msg.indexOf("Add")>-1){
			var m=msg.split(' ');
			switch(m[1]){
				case "friends":
					var f={"friends":[{"userId":m[2],"name":m[2]}]};
					AddFriends(f.friends);
					return;
				case "rooms":
					var r={"rooms":[{"roomId":m[2],"name":m[2]}]};
					AddRooms(r.rooms);
					return;
				case "groups":
					var g={"groups":[{"groupId":m[2],"name":m[2]}]};
					AddGroups(g.groups);
					return;
			}
		}
		
		
		
		var selectedtab = $tabs.tabs('option', 'active'); 
        if (!util.isBlank(msg)) {
		 switch(selectedtab){
		 case 0:
		    var target = $("#tabs-1 .ui-selected");
			if(target.length==0)
				return;
				
			
			 var msgstr=JSON.stringify({sender:name,receiver:target.text(),content:msg});	
			
            var message = {sender:uid, receiver: parseInt(target.attr("value")), content: msgstr, msgLocalID:msgLocalID++};
            if (im.connectState == IMService.STATE_CONNECTED) {
                im.sendPeerMessage(message);

               $("#entry").val(""); // clear the entry field.
                if (target != '*' && target.val() != uid) {
                    addMessage(name, target.text(), msg);
                    $("#chatHistory").show();
                }
            }
		 break;
		
		case 1: 
		
		    var target = $("#tabs-2 .ui-selected");
			if(target.length==0)
				return;
			
			var msgstr=JSON.stringify({sender:name,room:target.text(),content:msg});	
			
				
		    var message = {sender:uid, receiver: parseInt(target.attr("value")), content: msgstr};
            if (im.connectState == IMService.STATE_CONNECTED) {
                im.sendRoomMessage(message);

                $("#entry").val(""); // clear the entry field.
                if (target != '*' && target.val() != uid) {
                    addRoomMessage(name, target.text(), msg);
                    $("#chatHistory").show();
                }
            }
			 break;
			
		 case 2:
		    var target = $("#tabs-3 .ui-selected");
			if(target.length==0)
				return;
			
			
			 var msgstr=JSON.stringify({sender:name,group:target.text(),content:msg});	
				
		    var message = {sender:uid, receiver: parseInt(target.attr("value")), content: msgstr};
            if (im.connectState == IMService.STATE_CONNECTED) {
                im.sendGroupMessage(message);

                $("#entry").val(""); // clear the entry field.
                if (target != '*' && target.val() != uid) {
                    addGroupMessage(name, target.text(), msg);
                    $("#chatHistory").show();
                }
            }
			break;
			}
        }
    });
	
 
function LoadLists(){
	 $.ajax({
	    url: "list.php",
	    dataType: 'json',
            type: 'GET',
            data:{uid:uid},
            success: function(result, status, xhr) {
                if (result.code == 0) {
				    AddFriends(result.data.friends);//userId,name
				    AddRooms(result.data.rooms);//roomId,name
				    AddGroups(result.data.groups);//groupId,name
                } else {
                    console.log("login error status:", result.msg);
                    alert(result.msg);
                }
	    },
	    error : function(xhr, err) {
	        console.log("load err:", err, xhr.status);
                //alert("load fail");
				//for test
				var data={"friends":[{"userId":"89","name":"月月鸟"},{"userId":"95","name":"yybird"},{"userId":"90","name":"猪头三"}],
						"rooms":[{"roomId":"10000","name":"捞月狗大家庭"},{"roomId":"20000","name":"秋名山车神"}]};
				AddFriends(data.friends);
				AddRooms(data.rooms);
	   	}
     });
}
function AddFriends(friends){ 
    for (var i = 0; i < friends.length; i++) {
        var slElement = $(document.createElement("li"));// <li class="ui-widget-content">Item 1</li> 
		if(getUrlParam("uid")!=friends[i].userId){
        	slElement.attr("value", friends[i].userId);
        	slElement.text(friends[i].name);
			slElement.attr("className", "ui-widget-content");
        	$("#tabFriends").append(slElement);
		}
    }
}
function AddRooms(rooms){ 
    for (var i = 0; i < rooms.length; i++) {
        var slElement = $(document.createElement("li"));// <li class="ui-widget-content">Item 1</li> 
        slElement.attr("value", rooms[i].roomId);
        slElement.text(rooms[i].name);
		slElement.attr("className", "ui-widget-content");
        $("#tabRooms").append(slElement);
		im.enterRoom(parseInt(rooms[i].roomId));
    }
}
function AddGroups(groups){ 
    for (var i = 0; i < groups.length; i++) {
        var slElement = $(document.createElement("li"));// <li class="ui-widget-content">Item 1</li> 
        slElement.attr("value", groups[i].groupId);
        slElement.text(groups[i].name);
		slElement.attr("className", "ui-widget-content");
        $("#tabGroups").append(slElement);
    }
}
});
