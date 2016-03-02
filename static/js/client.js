var username;
var receiver;
var users;
var base = 1000;
var msgLocalID=0;
var increase = 25;

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
    var content = '<tr>' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">' + name+ '号聊天室  用户 ' +util.toStaticHTML(from) + '  说: ' + '</td>' + '  <td class="msg-text">' + text + '</td>' + '</tr>';
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
    var content = '<tr>' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">' + name+ '号群组  用户 ' +util.toStaticHTML(from) + '  说: ' + '</td>' + '  <td class="msg-text">' + text + '</td>' + '</tr>';
    messageElement.html(content);
    //the log is the stream that we view
    $("#chatHistory").append(messageElement);
    base += increase;
    scrollDown(base);
}
// show tip
function tip(type, name) {
    var tip, title;
    switch (type) {
        case 'online':
            tip = name + ' is online now.';
            title = 'Online Notify';
            break;
        case 'offline':
            tip = name + ' is offline now.';
            title = 'Offline Notify';
            break;
        case 'message':
            tip = name + ' is saying now.';
            title = 'Message Notify';
            break;
    }
    var pop = new Pop(title, tip);
}

// init user list
function initUserList(data) {
    users = data.users;
    for (var i = 0; i < users.length; i++) {
        var slElement = $("#usersList option");
        slElement.attr("value", users[i]);
        slElement.text(users[i]);
        $("#usersList").append(slElement);
    }
}

// add user in user list
function addUser(user) {
 
	for(var i=1;i<=5;i++){
		if(i!=parseInt(user)){
    			var slElement2 = $(document.createElement("option"));
    			slElement2.attr("value", 10063761);
    			slElement2.text(i);
    			//$("#usersList").append(slElement2);
		}
	}
}
function addRoom(roomid) {
	//if($("#room option[@value='"+roomid+"']").length>0)
	//return;
    //var slElement = $(document.createElement("option"));
    //slElement.attr("value", "");
    //slElement.text("");
    //$("#room").append(slElement);
	var slElement2 = $(document.createElement("option"));
    slElement2.attr("value", roomid);
    slElement2.text(roomid);
    $("#room").append(slElement2);
}
function addGroup(groupid) {
	//if($("#Group option[@value='"+groupid+"']").length>0)
	//return;
	var slElement = $(document.createElement("option"));
    slElement.attr("value", groupid);
    slElement.text(groupid);
    $("#Group").append(slElement);
}
// remove user from user list
function removeUser(user) {
    $("#usersList option").each(
        function () {
            if ($(this).val() === user) $(this).remove();
        });
}

// set your name
function setName() {
    $("#name").text(username);
}

// show error
function showError(content) {
    $("#loginError").text(content);
    $("#loginError").show();
}

// show login panel
function showLogin() {
    $("#loginView").show();
    $("#chatHistory").hide();
    $("#entry").hide();
    $("#toolbar").hide();
    $("#loginError").hide();
    $("#loginUser").focus();
	
	
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
    //when first time into chat room.
    showLogin();

    observer = {
        handlePeerMessage: function (msg) {
            //console.log("msg sender:", msg.sender, " receiver:", msg.receiver, " content:", msg.content, " timestamp:", msg.timestamp);
            addMessage(msg.sender, msg.receiver, msg.content);
            $("#chatHistory").show();
            //if (msg.sender !== username)
            //    tip('message', msg.sender);
        },
		handleRoomMessage: function (msg) {
            //console.log("msg sender:", msg.sender, " receiver:", msg.receiver, " content:", msg.content, " timestamp:", msg.timestamp);
            addRoomMessage(msg.sender, msg.roomid, msg.content);
            $("#chatHistory").show();
            //if (msg.sender !== username)
            //    tip('message', msg.sender);
        },
		handleGroupMessage: function (msg) {
            //console.log("msg sender:", msg.sender, " receiver:", msg.receiver, " content:", msg.content, " timestamp:", msg.timestamp);
            addGroupMessage(msg.sender, msg.groupid, msg.content);
            $("#chatHistory").show(); 
        },
        handleMessageACK: function(msgLocalID, receiver) {
            //console.log("message ack local id:", msgLocalID, " receiver:", receiver)
        },
        handleMessageFailure: function(msgLocalID, receiver) {
            //console.log("message fail local id:", msgLocalID, " receiver:", receiver)
        },
		
        onConnectState: function(state) {
            if (state == IMService.STATE_CONNECTED) {
                //console.log("im connected");
                // 连接成功
                setName();
                showChat();
				//roomid = parseInt($("#roomid").val());
			    //addRoom(roomid);	
			    //im.enterRoom(roomid);
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
    im.host = host
    //deal with login button click.
    $("#login").click(function () {
        username = parseInt($("#loginUser").val());
        receiver = parseInt($("#receiver").val());
    
		receiver= 1;
        $.ajax({
	    url: "auth.php",
	    dataType: 'json',
            type: 'POST',
            data:{uid:username, rid: username},
            success: function(result, status, xhr) {
                if (result.code == 0) {
                    console.log("login success:", result.data.token);
                    addUser(username);
					 
                    im.accessToken = result.data.token;
                    im.start();
					
                } else {
                    console.log("login error status:", result.msg);
                    alert(result.msg);
                }
	    },
	    error : function(xhr, err) {
	        console.log("login err:", err, xhr.status);
                alert("login fail");
	    }
        });
    });
	$("#addGroup").click(function(){
				groupid = parseInt($("#addGroupId").val());
			    addGroup(groupid);	
			    im.enterGroup(groupid);
	});
	$("#addRoom").click(function(){
				roomid = parseInt($("#addRoomId").val());
			    addRoom(roomid);	
			    im.enterRoom(roomid);
	})
    //deal with chat mode.
    $("#entry").keypress(function (e) {
        var target = parseInt($("#usersList").val());
        var targetRoom = parseInt($("#room").val());
		var targetGroup =parseInt($("#Group").val());
        if (e.keyCode != 13 /* Return */) return;
        var msg = $("#entry").val().replace("\n", "");
		var test=$("input[name='checkpeer']");
		var testest=$("input[name='checkpeer']").prop("checked");
        if (!util.isBlank(msg)) {
		  if($("input[name='checkpeer']").prop("checked") ==true){
            var message = {sender:username, receiver: target, content: msg, msgLocalID:msgLocalID++};
            if (im.connectState == IMService.STATE_CONNECTED) {
                im.sendPeerMessage(message);

               $("#entry").val(""); // clear the entry field.
                if (target != '*' && target != username) {
                    addMessage(username, target, msg);
                    $("#chatHistory").show();
                }
            }
		 }
		
		  if($("input[name='checkroom']").prop("checked") ==true){
		    var message = {sender:username, receiver: targetRoom, content: msg};
            if (im.connectState == IMService.STATE_CONNECTED) {
                im.sendRoomMessage(message);

                $("#entry").val(""); // clear the entry field.
                if (targetRoom != '*' && targetRoom != username) {
                    addRoomMessage(username, targetRoom, msg);
                    $("#chatHistory").show();
                }
            }
			 }
			
		  if($("input[name='checkgroup']").prop("checked") ==true){
		    var message = {sender:username, receiver: targetGroup, content: msg};
            if (im.connectState == IMService.STATE_CONNECTED) {
                im.sendGroupMessage(message);

                $("#entry").val(""); // clear the entry field.
                if (targetGroup != '*' && targetGroup != username) {
                    addGroupMessage(username, targetGroup, msg);
                    $("#chatHistory").show();
                }
            }
			}
        }
    });
});
