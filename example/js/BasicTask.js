this.onmessage = function(event) {
    var sum = event.data.x += event.data.y;
    this.gruntmessage({
        status: sum,
        responder: event.responder
    });
    this.gruntmessage({
        status: sum,
        responder: event.responder
    });
    this.gruntmessage({
        kill : true,
        results : sum,
        responder: event.responder
    });
}
