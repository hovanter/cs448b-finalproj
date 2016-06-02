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
  return [firstLetters.sort().join(""), columns];

  /*
  var ft = JSON.parse(sessionStorage.dataToTags);
  var keys = Object.keys(ft);

  // Fetch first two fields.
  dt1 = ft[keys[0]]
  dt2 = ft[keys[1]]

  tagString = [dt1[0][0], dt2[0][0]].sort().join("");
  tagColumns = [{"name": keys[0], "type": dt1[0]},
                {"name": keys[1], "type": dt2[0]}];
  return [tagString, tagColumns];*/
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
  else if (tagString.length == 1) {
    return "bar"; // bar chart
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

    var tagString = fieldInfo[0];
    if (tagString == "OO" || tagString == "NN") {
      encoding["size"] = {
        "aggregate": "count",
        "field": "*", "type":
        "quantitative"
      };
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
    addHoverInteractions();
    addClickInteractions();
  });

});
