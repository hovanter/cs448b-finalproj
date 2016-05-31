  // @andrei: Do stuff with user data to dynamically generate the data columns (See TODO above)
  //assume JSON of form {data: [{cat1:val1, cat2:val2}, {cat1:val1, cat2:val2}}
 $( document ).ready(function() {

  var userData = JSON.parse(sessionStorage.data);
  var datumObject = userData[0];
  var layoutHtml = '<form action="">'+
    '<input type="radio" name="layout" value="1"> 1 </input>'+
    '<input type="radio" name="layout" value="2"> 2 </input>'+
    '<input type="radio" name="layout" value="3"> 3 </input>'+
    '</form>';

  var categoryToValue = {};
  for(var key in datumObject){
    var dataHtml = '<form action="">'+
      '<input type="radio" name="data-type" value="Ordinal"> Ordinal </input>' +
      '<input type="radio" name="data-type" value="Nominal"> Nominal </input>';

    // TODO: Check if the datatype is not temporal
    var d = new Date(datumObject[key])
    if(isNaN(d.valueOf()))
      dataHtml += '<input type="radio" name="data-type" value="Temporal" disabled> <span style="color:#ccc">Temporal</span> </input>'
    else
      dataHtml += '<input type="radio" name="data-type" value="Temporal"> Temporal </input>'

    // If the datatype is not quantitative
    if(isNaN(datumObject[key]))
      dataHtml += '<input type="radio" name="data-type" value="Quantitative" disabled> <span style="color:#ccc">Quantitative</span> </input>';
    else
      dataHtml += '<input type="radio" name="data-type" value="Quantitative"> Quantitative </input>';

    dataHtml += '</form>';

    // console.log(key, " ", )
    categoryToValue[key] = [];
    $('#data-body').append('<tr><td>' + key + '</td><td>'+ dataHtml +'</td><td>'+ layoutHtml+'</td></tr>');
  }

  for(var x = 0; x<userData.length; x++){
    for(var key in userData[x]){
      categoryToValue[key].push(userData[x][key]);
    }
  }

  sessionStorage.categoryToValues = JSON.stringify(categoryToValue);

  (function newNames(){
    var tableBody = document.getElementById("data-body");
    for (var i = 0, row; row = tableBody.rows[i]; i++) {
      for (var j = 0, col; col = row.cells[j]; j++) {
        if(col.childNodes[0].nodeType === 3){
          continue;
        }
        else{
          for(var k = 0; k < col.childNodes[0].children.length; k++){
            col.childNodes[0].children[k].name = col.childNodes[0].children[k].name + i.toString();
          }
        }
      }
    }
  })();
});

var allFilters;
function populateFilters(){
  allFilters = {Ordinal:[], Nominal:[], Temporal:[], Quantitative:[], 1:[],2:[],3:[]};
  console.log('populating filters');
  var tableBody = document.getElementById("data-body");
  for (var i = 0, row; row = tableBody.rows[i]; i++) {
    var catName;
    for (var j = 0, col; col = row.cells[j]; j++) {
      if(col.childNodes[0].nodeType === 3){
        catName = col.childNodes[0].data; //text
      }
      else{
        var radioGroup = col.childNodes[0].children[0].name
        if ($('input[name=' + radioGroup + ']:checked').length > 0) {
          var radioValue = $('input[name=' + radioGroup + ']:checked').val();
          allFilters[radioValue].push(catName);
        }
      }
    }
  }
  console.log(allFilters)
  // Error: User must specify 2 categories for primary vis. in layout
  if (allFilters[1].length != 2) {
    alert("You assigned " + allFilters[1].length + " category(s) to PRIMARY visualization. \n\n" +
          "2 categories can be assigned.");
    return;
  }

  /* PLEASE UNCOMMENT */
  // // Error: User must specify 1 category for linked vis. in layout
  // if (allFilters[2].length != 1) {
  //    alert("You assigned " + allFilters[1].length + " category(s) to the LINKED visualization. \n\n" +
  //       "1 category can be assigned.");
  //   return;
  // }
  sessionStorage.filters = JSON.stringify(allFilters);

  var dataToTags = {};
  var tagsToData = {};
  // For each row in the data table
  $("#data-body tr").each(function() {
    // Get the name of that data column
    var dataName = this.childNodes[0].textContent;
    try {
      // Get the type tag, i.e. Ordinal, Nominal, etc.
      dataTag = this.childNodes[1].querySelector("input:checked").value;
      // Get the layout tag, i.e. 1, 2, or 3.
      layoutTag = this.childNodes[2].querySelector("input:checked").value;
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
}
