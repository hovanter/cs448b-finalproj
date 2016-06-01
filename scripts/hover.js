function addHoverInteractions() {
	$("g.marks").children().each(function() {
		var child = this;
		this.onmouseover = function(event) {
			onHover(child.__data__.datum)
		}
		this.onmousemove = function(event) {
			onMove(event)
		}
		this.onmouseout = function(event) {
			onOut(child.__data__.datum)
		}
	});
}

/* Called when the mouse hovers over a particular item. 
 * This can be a jumping off point for fancier Javascript
 * hover interactions.
 */
function onHover(datum) {
	showTooltip(datum);
}

function onOut(datum) {
	hideToolTip(datum);
}

function onMove(event) {
	$(showTooltip.tooltip).removeClass("hidden");
	showTooltip.tooltip.style.left = "" + (event.clientX + 20) + "px";
	showTooltip.tooltip.style.top = "" + (event.clientY + 20) + "px";
}

/* Writes out a datum object to a string.
 */
function datumToString(datum) {
	var str = "";
	var keys = Object.keys(datum);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		if (key[0] == "_") {
			continue;
		}
		var val = datum[key];
		if (typeof val == "string") {
			val = val[0] + val.slice(1).toLowerCase();
		}
		str += key + ": " + val + "<br />";
	}
	return str;
}

/* Shows a tooltip at the mouse position.
 */
function showTooltip(datum) {
	if (showTooltip.tooltip == undefined) {
		var div = document.createElement("div");
		div.className = "tooltip hidden";
		document.body.appendChild(div);
		showTooltip.tooltip = div;
	}
	showTooltip.tooltip.innerHTML = datumToString(datum);
}

/* Hides tooltip at mouse position.
 */
function hideToolTip(datum) {
	$(showTooltip.tooltip).addClass("hidden");
}