/* Creates a Vega-Lite spec given the user's category-to-values
 * mapping for the data. */
function createSpec(categoryToValues) {
  var csvString = sessionStorage.data;
  var results = Papa.parse(csvString, {
    header: true,
    dynamicTyping: true
  });
  if (results.errors.length > 0) {
    // Try again as JSON
    csvString = Papa.unparse(sessionStorage.data);
    results = Papa.parse(csvString, {
      header: true,
      dynamicTyping: true
    });
  }

  var vlSpec = {
    "data": {
      "values": results.data
    },
    "mark": "circle",
    "encoding": {
      // TODO: Write code to generate the correct fields and types here automatically
      "y": {"field": "lat", "type": "quantitative"},
      "x": {"field": "lng", "type": "quantitative"}
    },
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