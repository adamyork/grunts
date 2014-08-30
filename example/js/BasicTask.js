this.onmessage = function(event) {
    var sum = event.data.x + event.data.y;
    gruntmessage({
        status: event.data.x,
        responder: event.responder
    });
    gruntmessage({
        status: event.data.y,
        responder: event.responder
    });
    gruntmessage({
        kill : true,
        results : sum,
        responder: event.responder
    });
}

this.gruntmessage = function(value) {
    try {
        postMessage(JSON.stringify(value),"*")
    } catch(e) {
        postMessage(JSON.stringify(value)); 
    };
}
