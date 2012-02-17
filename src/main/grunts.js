(function(window) {
    if(!Function.bind) {
        Function.prototype.bind = function(bind) {
            var self;
            self = this;
            return function() {
                var args;
                args = Array.prototype.slice.call(arguments);
                return self.apply(bind || null, args);
            };
        };
    }
    window.grunts = (function() {
        return {
            gruntz : [],
            add : function(name, data) {
                grunt = new Grunt(name, data);
                this.gruntz[name] = grunt;
                grunt.gruntz = this.gruntz;
                var file = data.process;
                if( typeof (data.process) == 'function') {
                    file = this.TASK_PATH;
                    grunt.data = {};
                    grunt.data.process = "(function wrap(){return " + data.process + ";}())";
                }
                grunt.worker = new grunt.type(file);
                grunt.worker.onmessage = grunt.kill.bind(grunt);
                grunt.worker.onerror = grunt.err.bind(grunt);
                return grunt;
            },
            work : function(args) {
                if(args) {
                    for(worker in args) {
                        var target = this.gruntz[args[worker]];
                        this.checkDataAndRun(target);                       
                    };
                } else {
                    for(worker in this.gruntz) {
                        var target = this.gruntz[worker];
                        if(!target.active) {
                           this.checkDataAndRun(target);
                        };
                    };
                };
            },
            checkDataAndRun: function(target) {
                if(target.datum) {
                    target.work(target.datum);
                } else {
                    console.log("gruntz" +target.name+" has no work.");  
                };
            },
            TASK_PATH: '../src/main/gruntstask.js'
        }
    })()
    function Grunt(name,data) {
        obj = {};
        try {
            obj = buildGrunt(name,data);
        } catch (e) {
            window.Worker = IEWorker();
            obj = buildGrunt(name,data);
        }
        return obj;
    }
    function IEWorker(process) {        
        if(typeof(process) == 'function') {
            process = gruntz.TASK_PATH;
        }
        //TODO load process
        obj = {
            onmessage: {},
            onerror: {},
            terminate:{},
            postMessage: function(msg) {
                console.log('ie worker is posting a message to thread main.');
            }
        }
        return obj;
    }
    function buildGrunt(name,data) {
        obj = {
            name : name,
            type : Worker,
            worker : {},
            onmessage : data.onmessage,
            onerror : data.onerror,
            active: false,
            datum: data.work,
            work : function(data) {
                this.active = true;
                if(this.data) {
                    this.data.args = data;
                    data = this.data;
                }
                this.worker.postMessage(data);
            },
            err : function(event) {
                this.onerror(event);
                delete this.gruntz[this.name]
            },
            kill : function(event) {
                this.onmessage(event);
                if(event.data.kill) {
                    this.worker.terminate();
                    delete this.gruntz[this.name]
                }
            },
            add: grunts.add
        }
        return obj;
    }
})(window)