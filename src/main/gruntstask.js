this.onmessage = function (event) {
    "use strict";
    var result = eval(event.data.process)(event.data.args);
    this.gruntmessage({
        kill:true,
        data:result,
        responder:event.responder
    });
}