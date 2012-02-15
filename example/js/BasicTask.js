onmessage = function(event) {
	var sum = event.data.x += event.data.y;
	this.postMessage(sum);
	this.postMessage(sum);
	this.postMessage({kill:true,results:sum});
}
