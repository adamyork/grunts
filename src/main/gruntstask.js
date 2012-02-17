this.onmessage = function (event) {
    "use strict";
    this.postMessage(eval(event.data.process)(event.data.args));
};