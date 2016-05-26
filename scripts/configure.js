  // @andrei: Do stuff with user data to dynamically generate the data columns (See TODO above)
  //assume JSON of form {data: [{cat1:val1, cat2:val2}, {cat1:val1, cat2:val2}}
 $( document ).ready(function() {

  var userData = JSON.parse(sessionStorage.data);
  var datumObject = userData[0];
  var dataHtml = '<form action="">'+
    '<input type="radio" name="data-type" value="Ordinal"> Ordinal </input>' +
    '<input type="radio" name="data-type" value="Nominal"> Nominal </input>' +
    '<input type="radio" name="data-type" value="Temporal"> Temporal </input>' +
    '<input type="radio" name="data-type" value="Quantitative"> Quantitative </input></form>';
  var interactiveHtml = '<form action="">'+
    '<input type="radio" name="interactive" value="Interactive"> Interactive </input>'+
    '<input type="radio" name="interactive" value="Static"> Static </input>'+
    '<input type="radio" name="interactive" value="Auto"> Auto </input>'+
    '</form>';


  var categoryToValue = {};
  for(var key in datumObject){
    categoryToValue[key] = [];
    $('#data-body').append('<tr><td>' + key + '</td><td>'+ dataHtml +'</td><td>'+ interactiveHtml+'</td></tr>');
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

var allFilters = {Ordinal:[], Nominal:[], Temporal:[], Quantitative:[], Interactive:[],nonInteractive:[]};
function populateFilters(){
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
  sessionStorage.filters = JSON.stringify(allFilters);

  var dataToTags = {};
  // For each row in the data table
  $("#data-body tr").each(function() {
    // Get the name of that data column
    var dataName = this.childNodes[0].textContent;
    try {
      // Get the type tag, i.e. Ordinal, Nominal, etc.
      dataTag = this.childNodes[1].querySelector("input:checked").value;
      // Get the interaction tag, i.e. Interactive, Static, etc.
      interactionTag = this.childNodes[2].querySelector("input:checked").value;
      // Store it.
      dataToTags[dataName] = [dataTag, interactionTag];
    }
    catch (err) {}
  })
  sessionStorage.dataToTags = JSON.stringify(dataToTags);
}
  