/* Parses data from sessionStorage into a form useable by Vega-Lite. */
function parseData() {
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
    results = Papa.parse(csvString, options);
  }
  return results.data;
}

/* Fetches the user tags and returns
 * (1) a "tag string" consisting of the first letters of the types of 
 *     tags in the first two data columns.
 * (2) "tag columns" indicating which coolumn each letter in the tag
 *     string actually refers to.
 */
function getFieldInfo() {
  var ft = JSON.parse(sessionStorage.dataToTags);
  var keys = Object.keys(ft);
  
  // Fetch first two fields.
  dt1 = ft[keys[0]]
  dt2 = ft[keys[1]]

  tagString = [dt1[0][0], dt2[0][0]].sort().join("");
  tagColumns = [{"name": keys[0], "type": dt1[0]}, 
                {"name": keys[1], "type": dt2[0]}];
  return [tagString, tagColumns];
}

/* Returns the appropriate mark for given the user's data tags and
 * primary dimensions. */
function getMark() {
  tagString = getFieldInfo()[0];
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

/* Returns the appropriate encoding for the given fields. */
function getEncoding() {
  tagColumns = getFieldInfo()[1];
  return {
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
}

/* Creates a Vega-Lite spec given the user's category-to-values
 * mapping for the data. */
function createPrimarySpec() {
  data = parseData();
  mark = getMark();
  encoding = getEncoding();

  var vlSpec = {
    "data": {
      "values": data
    },
    "mark": mark,
    "encoding": encoding,
    "config": {
      "cell": {
        width: 600,
        height: 400
      }
    }
  };
  return vlSpec;
}

/* Creates a Vega-Lite spec given the user's category-to-values
 * mapping for the data. */
function createSecondarySpec() {
  data = parseData();
  mark = getMark();
  encoding = getEncoding();

  var vlSpec = {
    "data": {
      "values": data
    },
    "mark": mark,
    "encoding": encoding,
    "config": {
      "cell": {
        width: 600,
        height: 400
      }
    }
  };
  return vlSpec;
}

$(document).ready(function() {
  var ft = JSON.parse(sessionStorage.dataToTags);
  if (Object.keys(ft).length < 2) {
    // Not enough data tags provided to create a viz.
    return;
  }

  var primaryEmbedSpec = {
    mode: "vega-lite",
    renderer: "svg",
    spec: createPrimarySpec()
  }
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

  var secondaryEmbedSpec = {
    mode: "vega-lite",
    renderer: "svg",
    spec: createSecondarySpec()
  }
  vg.embed("#vis-secondary", secondaryEmbedSpec, function(error, result) {
    // Callback receiving the View instance and parsed Vega spec
    // result.view is the View, which resides under the '#vis' element
    $(".vega-actions a").addClass("button");
    //addHoverInteractions();
    //addClickInteractions();
  });

});
