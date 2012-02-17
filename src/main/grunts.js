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
    function buildGrunt(name, data) {
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
                this.onmessage(event);
                if (event.data.kill) {
                    this.worker.terminate();
                    delete this.gruntz[this.name];
                }
            },
            add: self.grunts.add
        };
        return obj;
    }
    function IEWorker(process) {
        if (typeof (process) === 'function') {
            process = this.grunts.TASK_PATH;
        }
        //TODO load process
        var obj = {
            onmessage: {},
            onerror: {},
            terminate: {},
            postMessage: function (msg) {
                window.console.log('ie worker is posting a message to thread main.' + msg);
            }
        };
        return obj;
    }
    function Grunt(name, data) {
        var obj = {};
        try {
            obj = buildGrunt(name, data);
        } catch (e) {
            window.Worker = new IEWorker();
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