/* Parses data from sessionStorage into a form useable by Vega-Lite. */
function parseData() {
  var options = {
    header: true,
    dynamicTyping: true
  }
  var csvString = sessionStorage.data;
  results = Papa.parse(csvString, options);
  if (results.errors.length > 0) {
    // Try again as JSON
    csvString = Papa.unparse(sessionStorage.data);
    results = Papa.parse(csvString, options);
  }
  return results.data;
}

/* Fetches the user tags and returns
 * (1) a "field string" consisting of the first letter of the types of 
 *     the first two fields.
 * (2) "field labels" indicating which field each letter in the field
 *     string actually refers to.
 */
function getFieldInfo() {
  var ft = JSON.parse(sessionStorage.dataToTags);
  var keys = Object.keys(ft);
  
  // Fetch first two fields.
  dt1 = ft[keys[0]]
  dt2 = ft[keys[1]]

  fieldString = [dt1[0][0], dt2[0][0]].sort().join("");
  fieldLabels = [{"name": keys[0], "type": dt1[0]}, 
                 {"name": keys[1], "type": dt2[0]}];
  return [fieldString, fieldLabels];
}

/* Returns the appropriate mark for given the user's data tags and
 * primary dimensions. */
function getMark() {
  fieldString = getFieldInfo()[0];
  return {
    "NO": "circle", // scatter plot
    "NN": "bar",    // bar chart
    "NQ": "circle", // scatter plot
    "NT": "line",   // line plot
    "OO": "circle", // scatter plot
    "OQ": "circle", // scatter plot
    "OT": "circle", // scatter plot
    "QQ": "circle", // scatter plot
    "QT": "line",   // line plot
    "TT": "circle", // scatter plot
  }[fieldString];
}

/* Returns the appropriate encoding for the given fields. */
function getEncoding() {
  fieldLabels = getFieldInfo()[1];
  return {
      "y": {
        "field": fieldLabels[0].name, 
        "type": fieldLabels[0].type, 
        "scale": {"zero": false}
      },
      "x": {
        "field": fieldLabels[1].name, 
        "type": fieldLabels[1].type, 
        "scale": {"zero": false}
      }
  }
}

/* Creates a Vega-Lite spec given the user's category-to-values
 * mapping for the data. */
function createSpec() {
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
        height: 600
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
  var embedSpec = {
    mode: "vega-lite",
    renderer: "svg",
    spec: createSpec(sessionStorage.categoryToValues)
  }
  vg.embed("#vis", embedSpec, function(error, result) {
    // Callback receiving the View instance and parsed Vega spec
    // result.view is the View, which resides under the '#vis' element
    $(".vega-actions a").addClass("button");
  });
});
