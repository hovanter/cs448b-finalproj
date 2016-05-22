$( document ).ready(function() {

	var quantSliders = JSON.parse(sessionStorage.filters).Quantitative;
	var categoryToValues = JSON.parse(sessionStorage.categoryToValues);
	console.log(categoryToValues);

	for(var x = 0; x< quantSliders.length; x++){
		var name = quantSliders[x];
		createSliderHTML(categoryToValues[name], name);
	}

	function createSliderHTML(data, data_name){
		var sliderHTML = '<div id="slider-'+data_name+'"></div>' + 
			'<div id="'+data_name+'-values">' +
				'<span id='+data_name+'-start">hello</span>' +
				'<span id='+data_name+'-end"></span>' +
			'</div>' +
			'</div>';
			document.body.innerHTML += sliderHTML
			createSliderJavascript(data,data_name);
		return sliderHTML;
	}

	function createSliderJavascript(data, data_name){
		var min = Math.min.apply(null, data);
	  var max = Math.max.apply(null, data);
		var slider = document.getElementById('slider-'+data_name);

		noUiSlider.create(slider, {
			start: [min, max],
			connect: true,
			range: {
				'min': min,
				'max': max
			}
		});
	}
});