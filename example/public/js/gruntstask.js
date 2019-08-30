this.onmessage = function (event) {
    "use strict";
    var result = eval(event.data.process)(event.data.args);
    gruntmessage({
        kill:true,
        data:result,
        responder:event.responder
    });
}

this.gruntmessage = function(value) {
    try {
        postMessage(JSON.stringify(value),"*");  
    } catch(e) {
        postMessage(JSON.stringify(value)); 
    };
}
