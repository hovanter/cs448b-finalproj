  // @andrei: Do stuff with user data to dynamically generate the data columns (See TODO above)
  //assume JSON of form {data: [{cat1:val1, cat2:val2}, {cat1:val1, cat2:val2}}
 $( document ).ready(function() {

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

  //var userData = JSON.parse(sessionStorage.data);

  var userData = parseData();
  var datumObject = userData[0];


  var categoryToValue = {};
  var j = 0;
  for(var key in datumObject){
    var layoutHtml = '<form action="">'+
    '<input type="radio" name="layout'+j+'" value="1"> 1 </input><br />'+
    '<input type="radio" name="layout'+j+'" value="2"> 2 </input><br />'+
    '<input type="radio" name="layout'+j+'" value="3"> 3 </input><br />'+
    '</form>';


    var dataHtml = '<form action="">'+
      '<input type="radio" name="data-type'+j+'" value="Ordinal"> Ordinal </input><br />' +
      '<input type="radio" name="data-type'+j+'" value="Nominal"> Nominal </input><br />';

    // If the datatype is not temporal
    var t = datumObject[key];
    t = String(t);
    var d = new Date(t)
    if((t[2] == ":" && !isNaN(parseInt(t.substring(0,2))) && !isNaN(parseInt(t.substring(3)))) || !isNaN(d.valueOf()))
      dataHtml += '<input type="radio" name="data-type'+j+'" value="Temporal"> Temporal </input><br />'
    else
      dataHtml += '<input type="radio" name="data-type'+j+'" value="Temporal" disabled> <span style="color:#ccc">Temporal</span> </input><br />'

    // If the datatype is not quantitative
    if(isNaN(datumObject[key]))
      dataHtml += '<input type="radio" name="data-type'+j+'" value="Quantitative" disabled> <span style="color:#ccc">Quantitative</span> </input><br />';
    else
      dataHtml += '<input type="radio" name="data-type'+j+'" value="Quantitative"> Quantitative </input><br />';

    dataHtml += '</form>';

    // console.log(key, " ", )
    categoryToValue[key] = [];
    $('#data-body').append('<tr><td id="category">' + key + '</td><td id="example">'+datumObject[key]+'</td><td>'+ dataHtml +'</td><td>'+ layoutHtml+'</td></tr>');
    j = j + 1;
  }

  for(var x = 0; x<userData.length; x++){
    for(var key in userData[x]){
      categoryToValue[key].push(userData[x][key]);
    }
  }

  sessionStorage.categoryToValues = JSON.stringify(categoryToValue);
});

var allFilters;
function populateFilters(){

  allFilters = {Ordinal:[], Nominal:[], Temporal:[], Quantitative:[], 1:[],2:[],3:[]};
  console.log('populating filters');
  var tableBody = document.getElementById("data-body");
  for (var i = 0, row; row = tableBody.rows[i]; i++) {
    var catName;
    for (var j = 0, col; col = row.cells[j]; j++) {
      console.log(col)
      if(col.childNodes[0].nodeType === 3 && j == 0){
        catName = col.childNodes[0].data; //text
      }
      else if (j > 1){
        var radioGroup = col.childNodes[0].children[0].name
        if ($('input[name=' + radioGroup + ']:checked').length > 0) {
          var radioValue = $('input[name=' + radioGroup + ']:checked').val();
          allFilters[radioValue].push(catName);
        }
      }
    }
  }
  // Error: User must specify 2 categories for primary vis. in layout
  if (allFilters[1].length != 2) {
    alert("You assigned " + allFilters[1].length + " data column(s) to PRIMARY visualization. \n\n" +
          "2 categories should be assigned.");
    return;
  }

  /* PLEASE UNCOMMENT */
  // Error: User must specify 1 category for linked vis. in layout
  if (allFilters[2].length > 2 ) {
     alert("You assigned " + allFilters[2].length + " data column(s) to the LINKED visualization. \n\n" +
        "At most 2 categories should be assigned.");
    return;
  }
  sessionStorage.filters = JSON.stringify(allFilters);

  var dataToTags = {};
  var tagsToData = {};
  // For each row in the data table
  $("#data-body tr").each(function() {
    // Get the name of that data columnb
    var dataName = this.childNodes[0].textContent;
    try {
      // Get the type tag, i.e. Ordinal, Nominal, etc.
      dataTag = this.childNodes[2].querySelector("input:checked").value;
      // Get the layout tag, i.e. 1, 2, or 3.
      layoutTag = this.childNodes[3].querySelector("input:checked").value;
      // Store it.
      dataToTags[dataName] = [dataTag, layoutTag];
      if (tagsToData[layoutTag] != undefined) {
        tagsToData[layoutTag].push([dataName, dataTag]);
      }
      else {
        tagsToData[layoutTag] = [[dataName, dataTag]];
      }
    }
    catch (err) {}
  })
  sessionStorage.dataToTags = JSON.stringify(dataToTags);
  sessionStorage.tagsToData = JSON.stringify(tagsToData);

  window.location.href = "visualization.html"
}
