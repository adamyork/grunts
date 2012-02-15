function demo() {
	var params = {
		process: "./js/BasicTask.js",
		onmessage: handleMessage,
		onerror: handleError
	}
	var inlineParams = {
		process: customFunc,
		onmessage: handleMessage,
		onerror: handleError
	}
	grunts.add("worker1",params).work({x:1,y:3})
	grunts.add("worker2",params).work({x:4,y:5})
	grunts.add("worker3",inlineParams).work({x:6,y:11});
}

function customFunc(obj){
	return obj.x + obj.y;
}

function handleMessage(event) {
	console.log("message " + event.data);
}

function handleError(event) {
	console.log("error " + event.data);
}