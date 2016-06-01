$( document ).ready(function() {

	//may be error prone
	var slider_index = 1;



	var quantSliders = JSON.parse(sessionStorage.filters).Quantitative;
	var temporalSliders = JSON.parse(sessionStorage.filters).Temporal;
	var nominalForms = JSON.parse(sessionStorage.filters).Nominal;
	var ordinalForms = JSON.parse(sessionStorage.filters).Ordinal;


	console.log(temporalSliders);
	var categoryToValues = JSON.parse(sessionStorage.categoryToValues);

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
		createSliderTime(categoryToValues[name], name);
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

	function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
	}

	function updateDOMNodes(allValues, toDisplay){
		console.log(allValues);
		console.log(toDisplay);
		for(var x = 0; x< allValues.length; x++){
			allValues[x].style.visibility = 'hidden';
		}
		for(var x = 0; x< toDisplay.length; x++){
			allValues[x].style.visibility = 'visible';
		}
	}

	function updateCategory(data_name){
		var checkboxCategory = document.getElementById('checkbox-form-' + data_name);
		var listItems = checkboxCategory.children[0].children;
		var allItems = [];
		var toDisplay = [];
		for(var x = 0; x < listItems.length; x++){
			var input = listItems[x].children[0];
			if(input.checked){
				toDisplay.push(input.value);
			}
			allItems.push(input.value);
		}
		console.log(data_name);
		var allItemsDOM = selectDataNodeByColumnValues(data_name, allItems);
		var toDisplayDOM = selectDataNodeByColumnValues(data_name, toDisplay);
		updateDOMNodes(allItemsDOM, toDisplayDOM);
	}

	function createSliderHTML(data, data_name){
		console.log('Creating slider HTML')
		var sliderHTML = '<div id="slider-'+data_name+'">'+data_name+'</div>' +
			'<div id="'+data_name+'-values">' +
				'<span id='+data_name+'-start"></span>' +
				'<span id='+data_name+'-end"></span>' +
			'</div>' +
			'</div>';
			$("#sliders").append(sliderHTML);
		return sliderHTML;
	}

	function createCheckBoxHTML(data, data_name){
		console.log('Creating CheckBox HTML')
		console.log(data_name);
		data  = data.filter(onlyUnique)
		var checkboxDiv = document.createElement('div');
		checkboxDiv.className = "checkbox-div";
		checkboxDiv.id = "checkbox-container-" + data_name;
		checkboxDiv.innerText = data_name;
		var checkboxForm = document.createElement('form');
		checkboxForm.id = "checkbox-form-" + data_name;
		var checkboxList = document.createElement('ul');

		checkboxForm.appendChild(checkboxList);
		checkboxDiv.appendChild(checkboxForm);
		document.getElementById('checkboxes').appendChild(checkboxDiv);

		for(var x=0; x<data.length;x++){
			var listItem = document.createElement('li');
			var inputItem = document.createElement('input');
			var itemDescrip = document.createElement('span');
			var itemName = data[x][0] + data[x].slice(1).toLowerCase();
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

	function createSliderQuantitative(data, data_name){
		console.log('Creating Slider Quantitative')

		var min = Math.min.apply(null, data);
	  var max = Math.max.apply(null, data);
		var slider = document.getElementById('slider-'+data_name);
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
			document.getElementById('sliders').children[slider_index].children[0],
			document.getElementById('sliders').children[slider_index].children[1]
		];

		slider_index = slider_index + 2;

		slider.noUiSlider.on('update', function( values, handle ) {
			if(handle === 0){
				sliderValues[handle].textContent = "start: " + values[handle] + " ";
				var allValues = selectDataNodeByColumnValueRange(data_name, [min, max]);
				var toDisplay = selectDataNodeByColumnValueRange(data_name, [values[0], values[1]]);
				updateDOMNodes(allValues, toDisplay);
			}
			else{
				sliderValues[handle].textContent = "end: " + values[handle] + " ";
				var allValues = selectDataNodeByColumnValueRange(data_name, [min, max]);
				var toDisplay = selectDataNodeByColumnValueRange(data_name, [values[0], values[1]]);
				updateDOMNodes(allValues, toDisplay);
			}
		});
	}

	function readableTimeToData(time_string){
		var minutes = parseInt(time_string.substring(0,2)) * 60 +
									parseInt(time_string.substring(3))
		return minutes
	}

	function dataToReadableTime(minutes_since_zero){
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
		return hoursString + ":" + minutesString;
	}

	//will accept of form hh:mm raging from 00:00 - 23:59
	function createSliderTime(data, data_name){
		console.log('Creating Time Slider')
		var slider = document.getElementById('slider-'+data_name);
		var transformedData = data.map(readableTimeToData);
		console.log(transformedData)
		var min = Math.min.apply(null, transformedData);
	  var max = Math.max.apply(null, transformedData);
		console.log(min, ' ', max)
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
			document.getElementById('sliders').children[slider_index].children[0],
			document.getElementById('sliders').children[slider_index].children[1]
		];
		slider_index = slider_index + 2;

		slider.noUiSlider.on('update', function( values, handle ) {
			if(handle === 0){
				sliderValues[handle].textContent = "start: " + dataToReadableTime(values[handle]) + " ";
				var allValues = selectDataNodeByColumnValueRange(data_name, [min, max]);
				var toDisplay = selectDataNodeByColumnValueRange(data_name, [values[0], values[1]]);
				updateDOMNodes(allValues, toDisplay);

			}
			else{
				sliderValues[handle].textContent = "end: " + dataToReadableTime(values[handle]) + " ";
				var allValues = selectDataNodeByColumnValueRange(data_name, [min, max]);
				var toDisplay = selectDataNodeByColumnValueRange(data_name, [values[0], values[1]]);
				updateDOMNodes(allValues, toDisplay);
			}
		});
	}

	//only will accept properly formatted javascript dates e.g mm/dd/yyyy
	function createSliderDate(data, data_name){
		console.log('Creating Date Slider')

		var date_array = [];
		for(var x=0; x < data.length; x++){
			date_array.push(new Date(data[x]));
		}
		var maxDate=new Date(Math.max.apply(null,dates));
		var minDate=new Date(Math.min.apply(null,dates));
		noUiSlider.create(dateSlider, {
	    range: {
	        min: minDate.getTime(),
	        max: maxDate.getTime()
	    },
			// Steps of one day
	    step: 24 * 60 * 60 * 1000,
	    start: [ minDate.getTime(), maxDate.getTime() ],
		});
	}



});
