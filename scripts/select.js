/* Returns the DOM nodes of all data where the given column
 * has the given value. */
function selectDataByColumnValue(column, value) {
	matches = [];
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
function selectDataByColumnValues(column, values) {
	matches = [];
	$("g.marks").children().each(function() {
		if (values.includes(this.__data__.datum[column])) {
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
function selectDataByColumnValueRange(column, range) {
	matches = [];
	$("g.marks").children().each(function() {
		if (this.__data__.datum[column] >= range[0] &&
			this.__data__.datum[column] <= range[1]) {
			matches.push(this);
		}
	});
	return matches;
}