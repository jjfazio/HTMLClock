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

var showAlarmPopup = function() {
	$("#mask, #popup").removeClass("hide");
};

var hideAlarmPopup = function() {
	$("#mask, #popup").addClass("hide");
};

var insertAlarm = function(time, alarmName) {
	var containerDiv = $("<div/>", { class: "flexable"});
	var nameDiv = $("<div/>", { class: "name", text: alarmName});
	var timeDiv = $("<div/>", { class: "time", text: time});

	containerDiv.append(nameDiv);
	containerDiv.append(timeDiv);

	$("#alarms").append(containerDiv);
};

var addAlarm = function() {
	var hours, mins, ampm, alarmName, time;

	hours = $("#hours option:selected").text();
	mins = $("#mins option:selected").text();
	ampm = $("#ampm option:selected").text();
	alarmName = $("#alarmName").val();
	time = hours.concat(":").concat(mins).concat(ampm);

	var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();
      alarmObject.save({"time": time,"alarmName": alarmName}, {
      success: function(object) {
      	insertAlarm(time, alarmName);
			hideAlarmPopup();
      }
   });
};

var getAllAlarms = function() {
	Parse.initialize("8LTFc6zT0wo7rIhp6Py33skJlKoTb9Um2uFVSovQ", "v4AFiOe49foBi66PTpt1oyr5kp4IyxY5cqQuQEZA");

	var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   	query.find({
        success: function(results) {
          for (var i = 0; i < results.length; i++) { 
            insertAlarm(results[i].get("time"), results[i].get("alarmName"));
          }
        }
   });

};

$(document).ready(function() {
	getTime();
	getTemp();
	getAllAlarms();
});