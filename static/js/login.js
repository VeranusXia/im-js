function loginSuccess(token,name,uid){
	window.location.href=encodeURI("im.html?token="+token+"&name="+ name + "&uid="+uid);
}
function showError(content) {
    $("#loginError").text(content);
    $("#loginError").show();
}
$(document).ready(function () {
	 $("#login").click(function () {
        username = parseInt($("#loginUser").val());
        $.ajax({
	    url: "auth.php",
	    dataType: 'json',
            type: 'POST',
            data:{uid:username, rid: username},
            success: function(result, status, xhr) {
                if (result.code == 0) {
                    console.log("login success:", result.data.token);
				    loginSuccess(result.data.token,result.data.name,result.data.id);
                    
					
                } else {
                    console.log("login error status:", result.msg);
                    alert(result.msg);
                }
	    },
	    error : function(xhr, err) {
	        console.log("login err:", err, xhr.status);
                showError("login fail");
	    }
        });
    });
});