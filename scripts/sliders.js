$( document ).ready(function() {

	//may be error prone
	var slider_index = 1;
	console.log('hello');


	console.log(sessionStorage.filters)

	var quantSliders = JSON.parse(sessionStorage.filters).Quantitative;
	var temporalSliders = JSON.parse(sessionStorage.filters).Temporal;
	var nominalForms = JSON.parse(sessionStorage.filters).Nominal;
	var ordinalForms = JSON.parse(sessionStorage.filters).Ordinal;

	var categoryToValues = JSON.parse(sessionStorage.categoryToValues);


	var visibleCategories = new Object();
	var visibleRanges = new Object();

	var name = "";
	for(var x = 0; x< quantSliders.length; x++){
		console.log("QUANTITATIVE slider")
		name = quantSliders[x];
		createSliderHTML(categoryToValues[name], name);
		createSliderQuantitative(categoryToValues[name], name);
	}
	for(var x = 0; x< temporalSliders.length; x++){
		console.log("TEMPORAL slider")
		name = temporalSliders[x];
		createSliderHTML(categoryToValues[name], name);
		var dateOrTime = new Date(categoryToValues[name][0]);
		if(categoryToValues[name] !== undefined){
			createSliderDate(categoryToValues[name], name);
		}
		else{
			createSliderTime(categoryToValues[name], name);
		}
	}
	for(var x = 0; x< nominalForms.length; x++){
		console.log("NOMINAL slider")
		name = nominalForms[x];
		createCheckBoxHTML(categoryToValues[name], name);
	}

	for(var x = 0; x< ordinalForms.length; x++){
		console.log("ORDINAL slider")
		name = ordinalForms[x];
		createCheckBoxHTML(categoryToValues[name], name);
	}

	var allDomNodes = [];




	function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
	}


	function updateDOMNodes(){
		allDomNodes = selectAllDataNodes();
		for(var x = 0; x< allDomNodes.length; x++){
			allDomNodes[x].style.visibility = 'hidden';
		}
		var filteredLists = []
		for(var i in visibleRanges){
			filteredLists.push(selectDataNodeByColumnValueRange(i, visibleRanges[i]));	
		}
		for(var j in visibleCategories){
			console.log(j);
			console.log(visibleCategories[j]);
			filteredLists.push(selectDataNodeByColumnValues(j, visibleCategories[j]));	
		}
		var selectedIntersection = _.intersection.apply(_, filteredLists);
		for(var k = 0; k< selectedIntersection.length; k++){
			selectedIntersection[k].style.visibility = 'visible';
		}

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
		updateDOMNodes();
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
			console.log(data)
			if (typeof data[x] == "string") {
				var itemName = data[x][0] + data[x].slice(1).toLowerCase();
			}
			inputItem.type = "checkbox";
			inputItem.checked = true;
			inputItem.name = data_name;
			inputItem.value = itemName;
			itemDescrip.innerHTML = itemName;
			listItem.appendChild(inputItem);
			listItem.appendChild(itemDescrip);
			checkboxList.appendChild(listItem);
			inputItem.onclick = function(e){
        updateCategory(e.target.name);
    	}
		}
	}

	//if min difference > 1 return 1
	function findStepSize(data){
		data.sort();
		var minDifference = Math.abs(data[1] - data[0]);
		for(var x = 0; x < data.length - 1; x++){
			if(Math.abs(data[x] - data[x-1]) < minDifference){
				minDifference = Math.abs(data[x] - data[x-1]);
			}
		}
		if(minDifference >=1){return 1;}
		return minDifference;
	}

	function createSliderQuantitative(data, data_name){
		console.log('Creating Slider Quantitative for ' + data_name)
		console.log(data)
		// Replace NaN in quantititative dataset
		for(var i=0; i < data.length; i++) {
			if(isNaN(data[i]))
		 		data[i] = data[i].replace(data[i], '0');
		}
		var min = Math.min.apply(null, data);
	  var max = Math.max.apply(null, data);
		console.log(min, ' ', max)
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
				updateDOMNodes();
			}
			else{
				sliderValues[handle].textContent = "end: " + values[handle] + " ";
				visibleRanges[data_name][1] = values[handle];
				updateDOMNodes();
			}
		});
	}

	function readableTimeToData(time_string){
		console.log('timestr: ' + time_string)
		var minutes = parseInt(time_string.substring(0,2)) * 60 +
									parseInt(time_string.substring(3))
		console.log('min: ' + minutes)
		return minutes
	}

	function dataToReadableTime(minutes_since_zero){
		console.log('minutes_since_zero: ' + minutes_since_zero)
		var hours = Math.floor(minutes_since_zero / 60);
		var minutes = minutes_since_zero % 60;
		var hoursString = hours.toString();
		var minutesString = minutes.toString();
		if(hours < 10){
			hoursString = "0" + hoursString;
		}
		if (minutes < 10) {
			minutesString = "0" + minutesString;
		}
		console.log('final: ' + hoursString + ":" + minutesString)
		return hoursString + ":" + minutesString;
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
				visibleRanges[data_name][0] = values[handle];
				updateDOMNodes();
			}
			else{
				sliderValues[handle].textContent = "end: " + dataToReadableTime(values[handle]) + " ";
				visibleRanges[data_name][0] = values[handle];
				updateDOMNodes();
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
		visibleRanges[data_name] = [minDate.getTime(),maxDate.getTime()];


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
				var dStringStart = (dStart.getUTCMonth() + 1) + "/" + dStart.getUTCDate() + "/" + dStart.getUTCFullYear();
				sliderValues[handle].textContent = "start: " + dStringStart + " ";
				visibleRanges[data_name][0] = values[handle];
				updateDOMNodes();

			}
			else{
				var dEnd = new Date(0);
				dEnd.setUTCSeconds(values[handle]/1000);
				var dStringEnd = (dEnd.getUTCMonth() + 1) + "/" + dEnd.getUTCDate() + "/" + dEnd.getUTCFullYear();
				sliderValues[handle].textContent = "end: " + dStringEnd + " ";
				visibleRanges[data_name][0] = values[handle];
				updateDOMNodes();
			}
		});
	}



});
