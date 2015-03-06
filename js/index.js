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

var insertAlarm = function(time, alarmName, alarmId) {
	var nameDiv = $("<p/>", { class: "name", text: alarmName});
	var timeDiv = $("<p/>", { class: "time", text: time});
	var containerDiv = $("<div/>", { class: "flexable"});
	var checkboxDiv = $("<input/>", {type: "checkbox", name: "checkboxAlarm", id: alarmId});

	containerDiv.append(nameDiv);
	containerDiv.append(timeDiv);
	containerDiv.append(checkboxDiv);

	$("#alarms").append(containerDiv);
};

var addAlarm = function() {
	var hours, mins, ampm, alarmName, time, userId;

	userId = localStorage["userId"];

	if (userId !== null) {
		hours = $("#hours option:selected").text();
		mins = $("#mins option:selected").text();
		ampm = $("#ampm option:selected").text();
		alarmName = $("#alarmName").val();
		time = hours.concat(":").concat(mins).concat(ampm);

		var AlarmObject = Parse.Object.extend("Alarm");
		var alarmObject = new AlarmObject();
		alarmObject.save({"time": time,"alarmName": alarmName, "userId": userId}, {
			success: function(myAlarm) {
				ga('send', 'event', 'Alarm', 'Add');
				insertAlarm(time, alarmName, myAlarm.id);
				hideAlarmPopup();
			},
			error: function(object, error) {
				console.log("Error creating " + object + " " + error);
			}
		});

	} else {
		alert('Must be logged in to set alarm');
	}
};

var getAlarmsToDelete = function() {
	var alarmIds = [];

   $(":checkbox").each(function() {
   	if (this.checked) {
   		alarmIds.push(this.id);
   	}
   });

   deleteAlarm(alarmIds);
}

var deleteAlarm = function(alarmIds) {

	alarmIds.forEach(function(alarmId) {
		var alarm = Parse.Object.extend("Alarm");
		var query = new Parse.Query(alarm);

		$("#" + alarmId).parent().addClass("hide");

		query.get(alarmId, {
	  		success: function(myAlarm) {
	    		myAlarm.destroy({
	    			sucess: function(alarm) {
	    				ga('send', 'event', 'Alarm', 'Delete');
	    			},
				   error: function(myObject, error) {
				     console.log("Error deleting " + object + " " + error);
				   }
				});
	  		},
	  		error: function(object, error) {
		   	console.log("Error getting " + object + " " + error);
	  		}
		});
	});
};

var getAllAlarms = function() {
	var userId = window.localStorage["userId"];

	if (userId !== null) {
		Parse.initialize("8LTFc6zT0wo7rIhp6Py33skJlKoTb9Um2uFVSovQ", "v4AFiOe49foBi66PTpt1oyr5kp4IyxY5cqQuQEZA");

		var AlarmObject = Parse.Object.extend("Alarm");
		var query = new Parse.Query(AlarmObject);

		query.equalTo("userId", userId)
		query.find({
			success: function(results) {
				for (var i = 0; i < results.length; i++) { 
					insertAlarm(results[i].get("time"), results[i].get("alarmName"), results[i].id);
				}
			}
		});
	}

};

function testCall() {
	console.log("Worked");
}

$(document).ready(function() {
	getTime();
	getTemp();
	getAllAlarms();
});