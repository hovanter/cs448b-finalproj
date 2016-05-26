function addHoverInteractions() {
	$("g.marks").children().each(function() {
		var child = this;
		this.onmouseover = function() {
			onHover(child.__data__)
		}
	});
}

/* Called when the mouse hovers over a particular item. 
 * This can be a jumping off point for fancier Javascript
 * hover interactions.
 */
function onHover(datum) {
	console.log("Hover!");
	console.log(datum);
}