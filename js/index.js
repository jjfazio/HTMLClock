var getTime = function() {
	var currentDate = new Date();
	setTime(currentDate);
};

var setTime = function(currentDate) {
	document.getElementById("time").innerHTML = currentDate.toLocaleTimeString();
	setTimeout(getTime, 1000);
};

document.onload = getTime();