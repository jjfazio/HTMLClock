var callback;

$(document).ready(function() {
	var data = {
		client_id: 'd578ef9b0bb526f',
		type: 'token',
		callback: displayMyURL
	};

	$('#login').click(function() {
		login();
	});


	init(data);
})

function init(data) {
	localStorage["client_id"] = data.client_id;
	localStorage["type"] = data.type;
	callback = data.callback;
}

function login() {
	var imgurLogin = 'https://api.imgur.com/oauth2/authorize?' +
		'client_id=d578ef9b0bb526f&' + 
		'response_type=token&' +
		'state=running';

	window.open(imgurLogin, 'Imgur Login', 'height=700,width=700');
}

function displayMyURL() {
	$.ajax({
		url: 'https://api.imgur.com/3/account/me',
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + localStorage['token']
		},
		success: function(data, textStatus, xhr) {
			alert('Your URL is: ' + data.data.url);
		}
	});
}
