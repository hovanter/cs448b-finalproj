//can we mash it into one object based on category
function updateDOMNodes(){
	var allDomNodes = selectAllDataNodes();
	var selectedData = selectDataByActiveSelections();
	var category = "";
	var values = [];
	var selectedNodes = [];
	var counter = 0;
	var toIntersect = [];
	for(var i in allDomNodes){
		var node = allDomNodes[i];
		for(var x = 0; x < selectedData.length; x++){
			var pass = true;
			for(var propertyName in selectedData[x]) {
				if(node.__data__.datum[propertyName] !== selectedData[x][propertyName]){
					pass = false;
					break; 
				}
			}
			if(pass){
				toIntersect.push(node);
				break;
			}
		}
	}


	for(var y = 0; y < allDomNodes.length; y++){
		$(allDomNodes[y]).removeClass('selected');
	}

	for(var z = 0; z <toIntersect.length; z++){
		$(toIntersect[z]).addClass('selected');
	}
}

function addClickInteractions() {
	$("g.marks").children().each(function() {
		var child = this;
		this.onclick = function() {
			$(child).toggleClass("selected");
			updateDOMNodes();
		}
	});
}