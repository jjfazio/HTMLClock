var getTime = function() {
	var currentDate = new Date();
	setTime(currentDate);
};

var setTime = function(currentDate) {
	$("#time").html(currentDate.toLocaleTimeString());
	setTimeout(getTime, 1000);
};

var getBackgroundClass = function(temp) {
	var color;

	if (temp >= 90)
		color = "hot";
	else if (temp >= 80)
		color = "warm";
	else if (temp >= 70)
		color = "nice";
	else if (temp >= 60)
		color = "chilly";
	else
		color = "cold";

	return color;
};

var getTemp = function() {
	var url = "https://api.forecast.io/forecast/c03b65ce336c18d80689f131370032e5/35.300399,-120.662362?callback=?";

	$.ajax({
		dataType: "json",
		url: url,
	})
	.done(function (data) {
		var imgPath = "img/" + data.currently.icon + ".png";

		$("#forecastLabel").html(data.daily.summary);
		$("#forecastIcon").attr("src", imgPath);
		$("body").addClass(getBackgroundClass(data.currently.temperature));
	})
	.fail (function (jqXHR, status) {
		console.log(jqXHR);
	});
};

$(document).ready(function() {
	getTime();
	getTemp();
});