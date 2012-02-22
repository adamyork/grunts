this.onmessage = function(event) {
    var sum = event.data.x += event.data.y;
    postMessage(JSON.stringify({
        status: sum,
        ref: event.ref
    }),"*");
    postMessage(JSON.stringify({
        status: sum,
        ref: event.ref
    }),"*");
    postMessage(JSON.stringify({
        kill : true,
        results : sum,
        ref: event.ref
    }),"*");
}