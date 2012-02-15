onmessage = function(event) {
	var sum = event.data.x += event.data.y;
	this.postMessage(sum);
}
