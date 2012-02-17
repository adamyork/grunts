function demo() {
    var params = {
        process : "./js/BasicTask.js",
        onmessage : handleMessage,
        onerror : handleError,
    };
    var differedParams = {
        process : "./js/BasicTask.js",
        onmessage : handleMessage,
        onerror : handleError,
        work : {
            x : 10,
            y : 20
        }
    };
    var inlineParams = {
        process : customFunc,
        onmessage : handleMessage,
        onerror : handleError,
    };
    //Queue and run a worker inline with an external process.
    grunts.add("worker1", params).work({
        x : 1,
        y : 3
    });
    //Queue and run a worked inline , with an internal process.
    grunts.add("worker3", inlineParams).work({
        x : 6,
        y : 11
    });
    //Queue a worker or workers and run by name.
    grunts.add("worker1b",differedParams);
    grunts.work(["worker1b"]);
    //Queue many workers and then run.
    grunts.add("worker1c",differedParams);
    grunts.add("worker1d",differedParams);
    grunts.add("worker1e",differedParams);
    grunts.add("worker1f",differedParams);
    grunts.work();
}

function customFunc(obj) {
    return obj.x + obj.y;
}

function handleMessage(event) {
    console.log("message " + event.data);
}

function handleError(event) {
    console.log("error " + event.data);
}