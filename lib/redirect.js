$(document).ready(function() {
	redirect_init();
});

function redirect_init() {
	var params = {};
	var query = location.hash.substring(1);
	var regex = /([^&=]+)=([^&]*)/g;
	var temp;
	
	while (temp = regex.exec(query)) {
	  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}

	if(!params['access_token']) {
	  alert("Error: Your access was not granted");
	}
	else {
	  localStorage['token'] =  params['access_token'];
	  window.opener.callback();
	}

	window.close();
}