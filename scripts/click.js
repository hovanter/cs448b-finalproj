function addClickInteractions() {
	$("g.marks").children().each(function() {
		var child = this;
		this.onclick = function() {
			onClick(child.__data__)
		}
	});
}

/* Called when the mouse clicks over a particular item. 
 * This can be a jumping off point for fancier Javascript
 * click interactions. (Linked visualizations?)
 */
function onClick(datum) {
	console.log("Click!");
	console.log(datum);
}