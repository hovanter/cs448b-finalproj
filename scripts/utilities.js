/* 
 * Converts a time_string of form hh:mm to minutes since
 * zero used for comparison of time values
 *
 * @param values - string of form hh:mm
 */

function readableTimeToData(time_string){
	var minutes = parseInt(time_string.substring(0,2)) * 60 +
								parseInt(time_string.substring(3))
	return minutes
}

/* 
 * Converts a integer to readable format on display for user
 * zero used for comparison of time values
 *
 * @param values - string of form hh:mm
 */

function dataToReadableTime(minutes_since_zero){
	var hours = Math.floor(minutes_since_zero / 60);
	var minutes = minutes_since_zero % 60;
	var hoursString = hours.toString();
	var minutesString = minutes.toString();
	if(hours < 10){
		hoursString = "0" + hoursString;
	}
	if (minutes < 10) {
		minutesString = "0" + minutesString;
	}
	return hoursString + ":" + minutesString;
}

/* 
 * Calculates the step size for a given slider.
 * Currently its just the min difference but a more sophisticated
 * algorithm that mimics the distribution may be more appropriate
 * if min difference > 1 return 1 to avoid floats
 *
 * @param values - data array that is comparable
 */

function findStepSize(data){
	data.sort();
	var minDifference = Math.abs(data[1] - data[0]);
	for(var x = 0; x < data.length - 1; x++){
		if(Math.abs(data[x] - data[x-1]) < minDifference){
			minDifference = Math.abs(data[x] - data[x-1]);
		}
	}
	if(minDifference >=1){return 1;}
	return minDifference;
}

/* 
 * Used for filter function so that all duplicate values are removed
 * 
 * @param values - self = array, index and value are obvious
 */

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/*
 * Check if the string that is given can be interpreted as a date object
 *
 */

function isDate(date_string){
	var dateOrTime = new Date(date_string);
	if(isNaN( dateOrTime.getTime())){
		return false;
	}
	return true;			
}

/*
 * Check if the string that is given can be interpreted as a time of form hh:mm
 *
 */

function isTime(time_string){
	var re = new RegExp("..:..");
	return re.test(time_string);
	}