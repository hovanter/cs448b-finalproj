/* Parses data from sessionStorage into a form useable by Vega-Lite. */
function parseData() {
  var options = {
    header: true,
    dynamicTyping: true
  }
  var csvString = sessionStorage.data;
  var results = Papa.parse(csvString, options);
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
  ft = JSON.parse(sessionStorage.dataToTags);
  fieldString = [ft[0][0], ft[1][0]].sort().join("");
  fieldLabels = ft.slice(0, 2);
  return [fieldString, fieldLabels];
}

/* Returns the appropriate mark for given the user's data tags and
 * primary dimensions. */
function getMark() {
  fieldString = getFieldInfo()[0];
  return {
    "CC": "circle", // scatter plot
    "CQ": "bar",    // bar chart
    "QQ": "circle", // scatter plot
    "QT": "line"   // line plot
  }[fieldString];
}

/* Returns the appropriate encoding for the given fields. */
function getEncoding(fields) {
  fieldLabels = getFieldInfo()[1];
  return {
      "y": {"field": fieldLabels[0].name, "type": fieldLabels[0].type},
      "x": {"field": fieldLabels[1].name, "type": fieldLabels[1].type}
  }
}

/* Creates a Vega-Lite spec given the user's category-to-values
 * mapping for the data. */
function createSpec() {
  data = parseData();
  mark = getMark();
  encoding = getEncoding(fields);

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
  if (sessionStorage.dataToTags.length < 2) {
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