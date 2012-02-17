onmessage = function(event) {
    this.postMessage(eval(event.data.process)(event.data.args));
}