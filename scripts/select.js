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


/********************************************************
 ******************* DATA NODE METHODS ******************
 ********************************************************/

/* Returns the actual DATA objects where the given column
 * has the given value. */
function selectDataByColumnValue(column, value) {
	var matches = [];
	$("g.marks").children().each(function() {
		if (this.__data__.datum[column] == value) {
			matches.push(this.__data__.datum);
		}
	});
	return matches;
}

/* Returns the actual DATA objects where the given column
 * has any of the given values. 
 *
 * @param values - an Array of values
 */
function selectDataByColumnValues(column, column_values) {
	var matches = [];
	$("g.marks").children().each(function() {
		if (column_values.indexOf(this.__data__.datum[column]) != -1) {
			matches.push(this.__data__.datum);
		}
	});
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
	var matches = [];
	$("g.marks").children().each(function() {
		if (this.__data__.datum[column] >= range[0] &&
			this.__data__.datum[column] <= range[1]) {
			matches.push(this.__data__.datum);
		}
	});
	return matches;
}

function selectDataByColumnTimeRange(column, date1, date2) {
	// Try to read the column as a Date object
}