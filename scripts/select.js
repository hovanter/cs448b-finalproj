/* This basically implements a few cases of the SQL "SELECT WHERE"
 * statement. Yay, query relaxation lol. */

/*******************************************************
 ******************* DOM NODE METHODS ******************
 *******************************************************/

/* Returns the DOM nodes of all data */
function selectAllDataNodes() {
	var matches = [];
	$("g.marks").children().each(function() {
		matches.push(this);
	});
	return matches;
}

/* Returns the DOM nodes of all data where the given column
 * has the given value. */
function selectDataNodeByColumnValue(column, value) {
	var matches = [];
	$("g.marks").children().each(function() {
		if (this.__data__.datum[column] == value) {
			matches.push(this);
		}
	});
	return matches;
}

/* Returns the DOM nodes of all data where the given column
 * has any of the given values. 
 *
 * @param values - an Array of values
 */
function selectDataNodeByColumnValues(column, column_values) {
	var matches = [];
	$("g.marks").children().each(function() {
		if (column_values.indexOf(this.__data__.datum[column]) != -1) {
			matches.push(this);
		}
	});
	return matches;
}

/* Returns the DOM nodes of all data where the given column
 * has a value in the given range.
 *
 * @param values - an Array of [start, end] denoting the range.
 *
 * WARNING: Be sure that the data type of start and end
 *          corresponds to the data type of the column AND 
 *          that the data type in question is comparable.
 *          Should be obvious why from the implementation
 *          below...
 */
function selectDataNodeByColumnValueRange(column, range) {
	var matches = [];
	$("g.marks").children().each(function() {
		if (this.__data__.datum[column] >= range[0] &&
			this.__data__.datum[column] <= range[1]) {
			matches.push(this);
		}
	});
	return matches;
}

/* Returns the DOM nodes of all data where the given column
 * has a value in the given range. The string of the data value
 * will be interpreted as a date. 
 *
 * @param values - an Array of [start, end] denoting the range.
 *
 * WARNING: Be sure that the data type of start and end
 *          corresponds to the data type of the column AND 
 *          that the data type in question is comparable.
 *          Should be obvious why from the implementation
 *          below...MAKE SURE YOU ACTUALLY USING DATES
 */
function selectDataNodeByColumnValueRangeDate(column, range) {
	var matches = [];
	$("g.marks").children().each(function() {
		var dataDate = new Date(this.__data__.datum[column]);
		if (dataDate >= range[0] &&
			dataDate <= range[1]) {
			matches.push(this);
		}
	});
	return matches;
}

/* Returns the DOM nodes of all data where the given column
 * has a value in the given range. The string of the data value
 * will be interpreted as a time of form hh:mm. Small utility 
 * included from sliders
 *
 * @param values - an Array of [start, end] denoting the range.
 *
 * WARNING: Be sure that the data type of start and end
 *          corresponds to the data type of the column AND 
 *          that the data type in question is comparable.
 *          Should be obvious why from the implementation
 *          below...MAKE SURE YOU ACTUALLY USING TIME 
 *					SPECIFICATION DESCRIBED ABOVE
 */
function selectDataNodeByColumnValueRangeTime(column, range) {
	var matches = [];
	$("g.marks").children().each(function() {
		if (typeof this.__data__.datum[column] != "string") {
			return;
		}
		var dataMinutes = readableTimeToData(this.__data__.datum[column]);
		if (dataMinutes >= readableTimeToData(range[0]) &&
			dataMinutes <= readableTimeToData(range[1])) {
			matches.push(this);
		}
	});
	return matches;
}

function readableTimeToData(time_string){
	var minutes = parseInt(time_string.substring(0,2)) * 60 +
								parseInt(time_string.substring(3));
	return minutes
}


/********************************************************
 ******************* DATA NODE METHODS ******************
 ********************************************************/

/* Returns the (visually selected) DATA objects, which
 * gives both the column name and the column value*/
function selectDataByActiveSelections() {
	var matches = [];
	$("#vis-secondary g.marks").children().each(function() {
		if ($(this).hasClass("selected")) {
			var data = {};
			var keys = Object.keys(this.__data__.datum);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				if (key[0] != "_" && key != "count") {
					console.log(key);
					data[key] = this.__data__.datum[key];
				}
			}
			matches.push(data);
		}
	});
	return matches;
} 

/* Returns the actual DATA objects where the given column
 * has the given value. */
function selectDataByColumnValue(column, value) {
	if (results === undefined || results.data === undefined) {
		// Data not available yet
		return;
	}
	var matches = [];
	for (var i = 0; i < results.data.length; i++) {
		var datum = results.data[i];
		if (datum[column] == value) {
			matches.push(datum);
		}
	}
	return matches;
}

/* Returns the actual DATA objects where the given column
 * has any of the given values. 
 *
 * @param values - an Array of values
 */
function selectDataByColumnValues(column, column_values) {
	if (results === undefined || results.data === undefined) {
		// Data not available yet
		return;
	}
	var matches = [];
	for (var i = 0; i < results.data.length; i++) {
		var datum = results.data[i];
		if (column_values.indexOf(datum[column]) != -1) {
			matches.push(datum);
		}
	}
	console.log(matches);
	return matches;
}

/* Returns the actual DATA objects where the given column
 * has a value in the given range.
 *
 * @param values - an Array of [start, end] denoting the range.
 *
 * WARNING: Be sure that the data type of start and end
 *          corresponds to the data type of the column AND 
 *          that the data type in question is comparable.
 *          Should be obvious why from the implementation
 *          below...
 */
function selectDataByColumnValueRange(column, range) {
	if (typeof(results) === 'undefined' || results.data === undefined) {
		// Data not available yet
		return;
	}
	console.log(column);
	console.log(range);
	var matches = [];
	for (var i = 0; i < results.data.length; i++) {
		var datum = results.data[i];
		if (datum[column] >= range[0] &&
			datum[column] <= range[1]) {
			matches.push(datum);
		}
	}
	return matches;
}

function selectDataByColumnValueRangeDate(column, range) {
	if (typeof(results) === 'undefined' || results.data === undefined) {
		// Data not available yet
		return;
	}
	var matches = [];
	for (var i = 0; i < results.data.length; i++) {
		var datum = results.data[i];
		var date = new Date(datum);
		if (date >= range[0] &&
			date <= range[1]) {
			matches.push(datum);
		}
	}
	return matches;
}

function selectDataByColumnValueRangeTime(column, range) {
	if (typeof(results) === 'undefined' || results.data === undefined) {
		// Data not available yet
		return;
	}
	var matches = [];
	for (var i = 0; i < results.data.length; i++) {
		var datum = results.data[i];
		var dataMinutes = readableTimeToData(datum);
		if (dataMinutes >= readableTimeToData(range[0]) &&
			dataMinutes <= readableTimeToData(range[1])) {
			matches.push(datum);
		}
	}
	return matches;	
}