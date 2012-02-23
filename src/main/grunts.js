(function (window) {
    "use strict";
    if (!Function.bind) {
        Function.prototype.bind = function (bind) {
            var self;
            self = this;
            return function () {
                var args;
                args = Array.prototype.slice.call(arguments);
                return self.apply(bind || null, args);
            };
        };
    }
    window.gruntmessage = function(value) {
        try {
            postMessage(JSON.stringify(value),"*");  
        } catch(e) {
            postMessage(JSON.stringify(value)); 
        };
    }
    function buildGrunt(name, data) {
        if (!window.Worker) {
            throw "Error";
        }
        var self, obj;
        self = window;
        obj = {
            name : name,
            type : window.Worker,
            worker : {},
            onmessage : data.onmessage,
            onerror : data.onerror,
            active: false,
            datum: data.work,
            work : function (data) {
                this.active = true;
                if (this.data) {
                    this.data.args = data;
                    data = this.data;
                }
                this.worker.postMessage(data);
            },
            err : function (event) {
                this.onerror(event);
                delete this.gruntz[this.name];
            },
            kill : function (event) {
                var msg = JSON.parse(event.data);
                this.onmessage({data:msg});
                if (msg.kill) {
                    this.worker.terminate();
                    delete this.gruntz[this.name];
                }
            },
            add: self.grunts.add
        };
        return obj;
    }
    function IEWorker(process) {
        var obj = new Object();
        obj = {
            ieworker:true,
            onmessage: function(args){},
            onerror: function(args){},
            terminate: function() {},
            active: false,
            postMessage: function (data) {
                this.active = true;
                if(this.process) {
                    var func = eval(this.process);
                    console.log("responder will be " + this.name)
                    func({data:this.deferedData,responder:this.name});
                } else {
                    this.deferedData = data;
                }
            }
        };
        if (typeof (process) === 'string') {
            var oReq = XMLHttpRequest();
            if (oReq != null) {
                oReq.open("GET",process, true);
                oReq.onreadystatechange = function () {
                    if (oReq.readyState == 4) {
                        if (oReq.status == 200) {
                            obj.process = oReq.responseText;
                            if (obj.active) {
                                obj.postMessage(obj.deferedData);
                            }
                        }
                    }
                };
                oReq.send();
            }
        }
        return obj;
    }
    function Grunt(name, data) {
        var obj = {};
        try {
            obj = buildGrunt(name, data);
        } catch (e) {
            window.Worker = IEWorker;
            window.attachEvent('onmessage',function(e) {
                var d = JSON.parse(e.data);
                var target = this.grunts.gruntz[d.responder];
                target.onmessage({data:d});
                if(d.kill) {
                    delete this.grunts.gruntz[d.responder];
                };
            });
            obj = buildGrunt(name, data);
        }
        return obj;
    }
    window.grunts = (function () {
        return {
            gruntz : [],
            add : function (name, data) {
                var grunt, file;
                grunt = new Grunt(name, data);
                this.gruntz[name] = grunt;
                grunt.gruntz = this.gruntz;
                file = data.process;
                if (typeof (data.process) === 'function') {
                    file = this.TASK_PATH;
                    grunt.data = {};
                    grunt.data.process = "(function wrap(){return " + data.process + ";}())";
                }
                grunt.worker = new grunt.type(file);
                if(grunt.worker.ieworker) {
                    grunt.worker.name = grunt.name;
                }
                grunt.worker.onmessage = grunt.kill.bind(grunt);
                grunt.worker.onerror = grunt.err.bind(grunt);
                return grunt;
            },
            work : function (args) {
                var worker, target, i;
                worker = {};
                if (args) {
                    for (i = 0; i < args.length; i += 1) {
                        target = this.gruntz[args[i]];
                        this.checkDataAndRun(target);
                    }
                } else {
                    for (worker in this.gruntz) {
                        if (this.gruntz.hasOwnProperty(worker)) {
                            target = this.gruntz[worker];
                            if (!target.active) {
                                this.checkDataAndRun(target);
                            }
                        }
                    }
                }
            },
            checkDataAndRun: function (target) {
                if (target.datum) {
                    target.work(target.datum);
                } else {
                    window.console.log("gruntz" + target.name + " has no work.");
                }
            },
            TASK_PATH: '../src/main/gruntstask.js'
        };
    }());
}(this.window));