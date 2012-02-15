(function(window){
	if (!Function.bind) {
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
            gruntz: [],
            add: function(name,data) {
                grunt = new Grunt(name,data);
                this.gruntz[name] = grunt;
                grunt.gruntz = this.gruntz;
                var file = data.process;
                if(typeof(data.process) == 'function') {
                	file = '../src/main/InlineTask.js';
                	grunt.data = {};
                	grunt.data.process = "(function wrap(){return "+data.process+";}())";
                }
                grunt.worker = new grunt.type(file);
                grunt.worker.onmessage = grunt.kill.bind(grunt);
                grunt.worker.onerror = grunt.err.bind(grunt);
                return grunt;          
            }
        }
    })()
    function Grunt(name,data) {
        obj = {};
        if(Worker) {
			obj = {
				name:name,
				type: Worker,
				worker: {},
				onmessage: data.onmessage,		
				onerror: data.onerror,
				work: function(data) {
					if(this.data) {
						this.data.args = data;
						data = this.data;
					}
	   				this.worker.postMessage(data);
				},
				err: function(event) {
					this.onerror(event);
					delete this.gruntz[this.name]
    			},
				kill:function(event) {
					this.onmessage(event);
					if(event.data.kill) {
						this.worker.terminate();
						delete this.gruntz[this.name]
					}
				}
			}
        } else {
        	//build a pass through object because this is ie
        }
        return obj;
    }
})(window)

