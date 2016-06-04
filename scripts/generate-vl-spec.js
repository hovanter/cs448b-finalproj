/* Parses data from sessionStorage into a form useable by Vega-Lite. */
function parseData() {
  // TODO: Skip parsing the second time.
  var options = {
    header: true,
    dynamicTyping: true
  }
  var input = sessionStorage.data.trim();
  if (input[0] == "[") {
    // Try as JSON
    csvString = Papa.unparse(sessionStorage.data);
    results = Papa.parse(csvString, options);
  }
  else {
    // Try as CSV
    results = Papa.parse(input, options);
  }
  return results.data;
}

function fixTimeColumn(column, unit) {
  if (typeof results.data == "undefined") {
    // Abort because data not available yet
    return;
  }
  /*
  for (var row in results.data) {
    var datum = results.data[row];
    if (unit == "date") {
      Date d = new Date(results.data[row][column]);
      results.data[row][column] = 
    }
    else if (unit == "hoursminutes") {
      results.data[row][column] = 
    }
  }*/
}

/* Returns the proper time unit for a given time data column. 
 * Additionally triggers a fixup of column in the data
 * if we verify that the column indeed corresponds to a Date
 * or a hh:mm time. We just convert the column in question
 * from a string to the appropriate date format for
 * Vega-Lite.
 */
function getTimeUnit(column) {
  if (typeof results.data == "undefined") {
    // Abort because data not available yet
    return null;
  }
  var datum = results.data[0];
  var time = datum[column.name];
  if (!isNaN(Date.parse(time))) {
    // Try as date string, succeeded
    return "yearmonthdate";
  }
  var minutes = parseInt(time.substring(0,2)) * 60 +
                parseInt(time.substring(3));
  if (!isNaN(minutes)) {
    // Try as hh:mm, succeeded
    return "hoursminutes";
  }
  return null;
}

/* Rebinds data to the visualization(s). If the visualization(s)
 * have not yet been created, this is a no-op. */
function rebindData(values) {
  if (typeof(viz1) !== 'undefined') {
    viz1.data("source")
      .remove(function(d) { return true; }) // Remove all old data
      .insert(values);
    viz1.update();
  }
  if (typeof(viz2) !== 'undefined') {
    viz2.data("source")
      .remove(function(d) { return true; }) // Remove all old data
      .insert(values);
    viz2.update();
  }
  addHoverInteractions();
  addClickInteractions();
}

/* Fetches the user tags and returns
 * (1) a "tag string" consisting of the first letters of the types of
 *     tags in the first two data columns.
 * (2) "tag columns" indicating which coolumn each letter in the tag
 *     string actually refers to.
 */
function getFieldInfo(section) {
  var tagsToData = JSON.parse(sessionStorage.tagsToData);
  var keys = tagsToData[section]

  if (keys.length < 2 && section == 1 ||
      keys.length < 1 && section == 2) {
    return null;
  }

  var firstLetters = []
  var columns = []
  for (var i = 0; i < keys.length; i++) {
    var dataName = keys[i][0];
    var dataType = keys[i][1];
    firstLetters.push(dataType[0]);
    columns.push({
      "name": dataName,
      "type": dataType
    });
  }
  if (firstLetters.length > 0 && firstLetters[1] < firstLetters[0]) {
    var ltmp = firstLetters[0];
    firstLetters[0] = firstLetters[1];
    firstLetters[1] = ltmp;

    var ctmp = columns[0];
    columns[0] = columns[1];
    columns[1] = ctmp;
  }
  return [firstLetters.join(""), columns];
}

/* Returns the appropriate mark for given the user's data tags and
 * primary dimensions. */
function getMark(section) {
  var fieldInfo = getFieldInfo(section);
  if (!fieldInfo) {
    // Inadequate data was provided in the config.
    return null;
  }
  var tagString = fieldInfo[0];
  if (tagString.length == 1) {
    return "bar"; // bar chart
  }
  if (tagString.length == 2) {
    return {
      "NO": "circle", // scatter plot
      "NN": "circle", // scatter plot
      "NQ": "bar",    // bar chart
      "NT": "line",   // line plot
      "OO": "circle", // scatter plot
      "OQ": "bar",    // bar chart
      "OT": "circle", // line plot
      "QQ": "circle", // scatter plot
      "QT": "line",   // line plot
      "TT": "circle", // scatter plot
    }[tagString];
  }
  else {
    return null;
  }
}

/* Returns the appropriate encoding for the given fields. */
function getEncoding(section) {
  var fieldInfo = getFieldInfo(section);
  if (!fieldInfo) {
    // Inadequate data was provided in the config.
    return null;
  }
  var tagColumns = fieldInfo[1];
  if (tagColumns.length > 1) {
    var encoding = {
      "y": {
        "field": tagColumns[0].name,
        "type": tagColumns[0].type,
        "scale": {"zero": false}
      },
      "x": {
        "field": tagColumns[1].name,
        "type": tagColumns[1].type,
        "scale": {"zero": false}
      }
    }

    // Extra tweaks for specific tag strings
    var tagString = fieldInfo[0];
    if (tagString == "OO" || tagString == "NN") {
      // Matrix plot --> Add aggregate count as a third dimension
      encoding["size"] = {
        "aggregate": "count",
        "field": "*", "type":
        "quantitative"
      };
    }
    else if (tagString == "NT" || tagString == "OT" ||
             tagString == "QT" || tagString == "TT") {
      // Time plot --> Add proper time unit(s)
      tu1 =  getTimeUnit(tagColumns[1]);
      if (tu1 != null) {
        encoding["x"]["timeUnit"] = tu1;
      }
      if (tagString == "TT") {
        tu2 = getTimeUnit(tagColumns[0]);
        if (tu2 != null) {
          encoding["y"]["timeUnit"] = tu2;
        }
      }
    }

    return encoding;
  }
  else if (tagColumns.length > 0) {
    return {
      "y": {
        "field": tagColumns[0].name,
        "type": "quantitative",
        "aggregate": "count",
      },
      "x": {
        "field": tagColumns[0].name,
        "type": tagColumns[0].type,
      }
    }
  }
}

/* Creates a Vega-Lite spec given the user's category-to-values
 * mapping for the data. */
function createSpec(section) {
  var data = parseData();
  var mark = getMark(section);
  var encoding = getEncoding(section);
  if (!mark || !encoding) {
    // Inadequate data was provided in the config.
    return null;
  }
  return {
    mode: "vega-lite",
    renderer: "svg",
    spec: {
      "data": {
        "values": data
      },
      "mark": mark,
      "encoding": encoding,
      "config": {
        "cell": {
          width: 500,
          height: 400
        }
      }
    }
  };
}

$(document).ready(function() {
  var ft = JSON.parse(sessionStorage.dataToTags);
  if (Object.keys(ft).length < 2) {
    // Not enough data tags provided to create a viz.
    return;
  }

  var primaryEmbedSpec = createSpec(1);
  vg.embed("#vis", primaryEmbedSpec, function(error, result) {
    // Callback receiving the View instance and parsed Vega spec
    // result.view is the View, which resides under the '#vis' element
    $(".vega-actions a").addClass("button");
    viz1 = result.view;
    addHoverInteractions();
    addClickInteractions();
  });

  if (Object.keys(ft).length < 3) {
    // Not enough data tags provided to create a secondary viz.
    return;
  }

  var secondaryEmbedSpec = createSpec(2);
  vg.embed("#vis-secondary", secondaryEmbedSpec, function(error, result) {
    // Callback receiving the View instance and parsed Vega spec
    // result.view is the View, which resides under the '#vis' element
    $(".vega-actions a").addClass("button");
    viz2 = result.view;
    addHoverInteractions();
    addClickInteractions();
  });

});
