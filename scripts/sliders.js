$( document ).ready(function() {

	//slider_index is global used for creation to know which child to refer to
	var slider_index = 1;
	var allDomNodes = [];
	/********* divy up data types to appropriate UI widgets $ *******/
	var quantSliders = JSON.parse(sessionStorage.filters).Quantitative;
	var temporalSliders = JSON.parse(sessionStorage.filters).Temporal;
	var nominalForms = JSON.parse(sessionStorage.filters).Nominal;
	var ordinalForms = JSON.parse(sessionStorage.filters).Ordinal;
	var categoryToValues = JSON.parse(sessionStorage.categoryToValues);

	var visibleCategories = new Object();
	var visibleRanges = new Object();

	var name = "";
	for(var x = 0; x< quantSliders.length; x++){
		name = quantSliders[x];
		createSliderHTML(categoryToValues[name], name);
		createSliderQuantitative(categoryToValues[name], name);
	}
	for(var x = 0; x< temporalSliders.length; x++){
		name = temporalSliders[x];
		createSliderHTML(categoryToValues[name], name);
		var dateOrTime = new Date(categoryToValues[name][0]);
		if(isNaN( dateOrTime.getTime() )){
			createSliderTime(categoryToValues[name], name);
		}
		else{
			createSliderDate(categoryToValues[name], name);
		}
	}
	for(var x = 0; x< nominalForms.length; x++){
		name = nominalForms[x];
		createCheckBoxHTML(categoryToValues[name], name);
	}

	for(var x = 0; x< ordinalForms.length; x++){
		name = ordinalForms[x];
		createCheckBoxHTML(categoryToValues[name], name);
	}

	function updateData(){
		var filteredLists = [];
		for(var i in visibleRanges){
			if(isDate(visibleRanges[i][0])){
				filteredLists.push(selectDataByColumnValueRangeDate(i, visibleRanges[i]));	
			}
			else if(isTime(visibleRanges[i][0])){
				filteredLists.push(selectDataByColumnValueRangeTime(i, visibleRanges[i]));	
			}
			else{
				filteredLists.push(selectDataByColumnValueRange(i, visibleRanges[i]));	
			}
		}

		for(var i in visibleCategories){
			console.log(i);
			console.log(visibleCategories[i]);
			filteredLists.push(selectDataByColumnValues(i, visibleCategories[i]));
		}
		var selectedIntersection = _.intersection.apply(_, filteredLists);
		rebindData(selectedIntersection);
		updateDOMNodes();
	}



	function updateCategory(data_name){
		var checkboxCategory = document.getElementById('checkbox-form-' + data_name);
		var listItems = checkboxCategory.children[0].children;
		var allItems = [];
		var toDisplay = [];
		visibleCategories[data_name] = [];

		for(var x = 0; x < listItems.length; x++){
			var input = listItems[x].children[0];
			if(input.checked){
				visibleCategories[data_name].push(input.value);
			}
		}
		updateData();
	}

	function createSliderHTML(data, data_name){
		var sliderHTML = '<div id="slider-'+data_name+'"></div>' +
			'<div id="'+data_name+'-values">' +
				'<span class="widget-label">'+data_name+'  </span>' +
				'<span id='+data_name+'-start"></span>' +
				'<span id='+data_name+'-end"></span>' +
			'</div>' +
			'</div>';

		$("#sliders").append(sliderHTML);
		return sliderHTML;
	}

	function createCheckBoxHTML(data, data_name){

		data  = data.filter(onlyUnique)
		var checkboxDiv = document.createElement('div');
		checkboxDiv.className = "checkbox-div";
		checkboxDiv.id = "checkbox-container-" + data_name;
		var label = document.createElement('span');
		label.className = "widget-label";
		label.innerText = data_name;
		var checkboxForm = document.createElement('form');
		checkboxForm.id = "checkbox-form-" + data_name;
		var checkboxList = document.createElement('ul');

		checkboxForm.appendChild(checkboxList);
		checkboxDiv.appendChild(label);
		checkboxDiv.appendChild(checkboxForm);
		document.getElementById('checkboxes').appendChild(checkboxDiv);
		visibleCategories[data_name] = [];

		for(var x=0; x<data.length;x++){
			visibleCategories[data_name].push(data[x]);
			var listItem = document.createElement('li');
			var inputItem = document.createElement('input');
			var itemDescrip = document.createElement('span');
			itemName = data[x];
			inputItem.type = "checkbox";
			inputItem.checked = true;
			inputItem.name = data_name;
			inputItem.value = data[x];
			itemDescrip.innerHTML = itemName;
			listItem.appendChild(inputItem);
			listItem.appendChild(itemDescrip);
			checkboxList.appendChild(listItem);
			inputItem.onclick = function(e){
        updateCategory(e.target.name);
    	}
		}
	}

	function createSliderQuantitative(data, data_name){
		// Replace NaN in quantititative dataset
		for(var i=0; i < data.length; i++) {
			if(isNaN(data[i]))
		 		data[i] = data[i].replace(data[i], '0');
		}
		var min = Math.min.apply(null, data);
	  var max = Math.max.apply(null, data);
		var slider = document.getElementById('slider-'+data_name);
		var stepSize = findStepSize(data);
		var decimals = 0;
		if(stepSize <= 1){decimals = 6;}
		visibleRanges[data_name] = [min,max];
		noUiSlider.create(slider, {
			start: [min, max],
			connect: true,
			step: stepSize,
			range: {
				'min': min,
				'max': max
			},
			format: wNumb({
				decimals: decimals
			})
		});
		var sliderValues = [
			document.getElementById('sliders').children[slider_index].children[1],
			document.getElementById('sliders').children[slider_index].children[2]
		];

		slider_index = slider_index + 2;

		slider.noUiSlider.on('update', function( values, handle ) {
			if(handle === 0){
				sliderValues[handle].textContent = "start: " + values[handle] + " ";
				visibleRanges[data_name][0] = values[handle];
				updateData();
			}
			else{
				sliderValues[handle].textContent = "end: " + values[handle] + " ";
				visibleRanges[data_name][1] = values[handle];
				updateData();
			}
		});
	}

	//will accept of form hh:mm raging from 00:00 - 23:59
	function createSliderTime(data, data_name){

		var slider = document.getElementById('slider-'+data_name);
		var transformedData = data.map(readableTimeToData);
		var min = Math.min.apply(null, transformedData);
	  var max = Math.max.apply(null, transformedData);
		visibleRanges[data_name] = [min,max];

		noUiSlider.create(slider, {
			start: [min, max],
			connect: true,
			range: {
				'min': min,
				'max': max
			},
			format: wNumb({
				decimals: 0
			})
		});
		var sliderValues = [
			document.getElementById('sliders').children[slider_index].children[1],
			document.getElementById('sliders').children[slider_index].children[2]
		];
		slider_index = slider_index + 2;

		slider.noUiSlider.on('update', function( values, handle ) {
			if(handle === 0){
				sliderValues[handle].textContent = "start: " + dataToReadableTime(values[handle]) + " ";
				visibleRanges[data_name][0] = dataToReadableTime(values[handle]);
				updateData();
			}
			else{
				sliderValues[handle].textContent = "end: " + dataToReadableTime(values[handle]) + " ";
				visibleRanges[data_name][1] = dataToReadableTime(values[handle]);
				updateData();
			}
		});
	}

	//only will accept properly formatted javascript dates e.g mm/dd/yyyy
	function createSliderDate(data, data_name){
		var slider = document.getElementById('slider-'+data_name);
		var date_array = [];
		for(var x=0; x < data.length; x++){
			date_array.push(new Date(data[x]));
		}

		var maxDate=new Date(Math.max.apply(null,date_array));
		var minDate=new Date(Math.min.apply(null,date_array));
		visibleRanges[data_name] = [minDate,maxDate];


		noUiSlider.create(slider, {
			connect: true,
	    range: {
	        min: minDate.getTime(),
	        max: maxDate.getTime()
	    },
			// Steps of one day
	    step: 24 * 60 * 60 * 1000,
	    start: [ minDate.getTime(), maxDate.getTime() ],
		});
		var sliderValues = [
			document.getElementById('sliders').children[slider_index].children[1],
			document.getElementById('sliders').children[slider_index].children[2]
		];
		slider_index = slider_index + 2;

		slider.noUiSlider.on('update', function( values, handle ) {
			if(handle === 0){
				var dStart = new Date(0);
				dStart.setUTCSeconds(values[handle]/1000);
				var dStringStart = (dStart.getUTCMonth() + 1) + "/" + (dStart.getUTCDate()) + "/" + dStart.getUTCFullYear();
				sliderValues[handle].textContent = "start: " + dStringStart + " ";
				visibleRanges[data_name][0] = dStart;
				updateData();

			}
			else{
				var dEnd = new Date(0);
				dEnd.setUTCSeconds(values[handle]/1000);
				var dStringEnd = (dEnd.getUTCMonth() + 1) + "/" + (dEnd.getUTCDate() ) + "/" + dEnd.getUTCFullYear();
				sliderValues[handle].textContent = "end: " + dStringEnd + " ";
				visibleRanges[data_name][1] = dEnd;
				updateData();
			}
		});
	}
});
