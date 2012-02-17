```
   _____ _____  _    _ _   _ _______ _____ 
  / ____|  __ \| |  | | \ | |__   __/ ____|
 | |  __| |__) | |  | |  \| |  | | | (___  
 | | |_ |  _  /| |  | | . ` |  | |  \___ \ 
 | |__| | | \ \| |__| | |\  |  | |  ____) |
  \_____|_|  \_\\____/|_| \_|  |_| |_____/ .js
```

     
##Overview

grunts is a wrapper and convenience library for web workers. Instantiation and management of web workers is managed by grunts. grunts gets loaded into the global namespace so thereis no need to create an instance of grunts. 

> grunts works in Opera , Firefox , and Chrome.

##Setup

* Download grunts.js and gruntstask.js.
* Place in desired directory.
* Add a script tag to your page or async load grunts.js.
* If you wish to have grunts and gruntstask in seperate locations :
```javascript
grunts.TASK_PATH = './someother/location/here/'
```

##Usage see: [example](https://github.com/radAdam/grunts/blob/master/example/js/main.js)

```javascript
var params = {
    process : "./js/BasicTask.js",
    onmessage : handleMessage,
    onerror : handleError,
};
var deferredParams = {
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
```
* Queue and run a worker inline with an external process.

```javascript
grunts.add("worker1", params).work({
    x : 1,
    y : 3
});
```
* Queue and run a worker inline , with an internal process.

```javascript
grunts.add("worker3", inlineParams).work({
    x : 6,
    y : 11
});
```
* Queue a worker or workers and run by name.

```javascript
grunts.add("worker1b",deferredParams)
      .add("worker1bb",deferredParams);
grunts.work(["worker1b","worker1bb"]);
```
* Queue many workers and then run.

```javascript
grunts.add("worker1c",deferredParams)
      .add("worker1d",deferredParams)
      .add("worker1e",deferredParams)
      .add("worker1f",deferredParams);
grunts.work();
```

##TODO

* Finsih IEWorker due to web workers limtations in IE9 and below.
