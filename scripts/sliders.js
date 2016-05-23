$( document ).ready(function() {

	var quantSliders = JSON.parse(sessionStorage.filters).Quantitative;
	var temporalSliders = JSON.parse(sessionStorage.filters).Temporal;
	var nominalForms = JSON.parse(sessionStorage.filters).Nominal;

	console.log(temporalSliders);
	var categoryToValues = JSON.parse(sessionStorage.categoryToValues);
	console.log(categoryToValues);

	var name = "";
	for(var x = 0; x< quantSliders.length; x++){
		name = quantSliders[x];
		createSliderHTML(categoryToValues[name], name);
		createSliderQuantitative(categoryToValues[name], name);
	}
	for(var x = 0; x< temporalSliders.length; x++){
		name = temporalSliders[x];
		createSliderHTML(categoryToValues[name], name);
		createSliderTime(categoryToValues[name], name);
	}
	for(var x = 0; x< nominalForms.length; x++){
		name = nominalForms[x];
		createCheckBoxHTML(categoryToValues[name], name);
	}

	function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}


	function createSliderHTML(data, data_name){
		var sliderHTML = '<div id="slider-'+data_name+'"></div>' + 
			'<div id="'+data_name+'-values">' +
				'<span id='+data_name+'-start"></span>' +
				'<span id='+data_name+'-end"></span>' +
			'</div>' +
			'</div>';
			$("#sliders").append(sliderHTML);
		return sliderHTML;
	}

	function createCheckBoxHTML(data, data_name){
		console.log(data);
		data  = data.filter(onlyUnique)
		var checkBoxHTML = '<div id=checkbox-container-'+data_name+'>' + 
											 '<form id=checkbox-form-'+data_name+'>';
		for(var x=0; x<data.length;x++){
			var checkBoxString = '<input type="checkbox" name="'+data_name+'" value="'+data[x]+'">'+data[x];
			checkBoxHTML = checkBoxHTML + checkBoxString;
		}
		checkBoxHTML = checkBoxHTML + '</form></div>';
		$("#checkboxes").append(checkBoxHTML);
	}


	function createSliderQuantitative(data, data_name){
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
		console.log(document.getElementById('sliders').children[1]);
		var sliderValues = [
			document.getElementById('sliders').children[1].children[0],
			document.getElementById('sliders').children[1].children[1]
		];

		slider.noUiSlider.on('update', function( values, handle ) {
			if(handle === 0){ 
				sliderValues[handle].textContent = "start: " + values[handle] + " ";
			}
			else{
				sliderValues[handle].textContent = "end: " + values[handle] + " ";
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
		var slider = document.getElementById('slider-'+data_name);
		var transformedData = data.map(readableTimeToData);
		var min = Math.min.apply(null, transformedData);
	  var max = Math.max.apply(null, transformedData);
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
		console.log(document.getElementById('sliders').children[2].children);
		var sliderValues = [
			document.getElementById('sliders').children[3].children[0],
			document.getElementById('sliders').children[3].children[1]
		];

		slider.noUiSlider.on('update', function( values, handle ) {
			if(handle === 0){ 
				sliderValues[handle].textContent = "start: " + dataToReadableTime(values[handle]) + " ";
			}
			else{
				sliderValues[handle].textContent = "end: " + dataToReadableTime(values[handle]) + " ";
			}
		});
	}

	//only will accept properly formatted javascript dates e.g mm/dd/yyyy
	function createSliderDate(data, data_name){
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