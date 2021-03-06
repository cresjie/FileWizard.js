/**
 * Plugin: FileWizard
 * Author: Cres Jie Labasano
 * Email: cresjie@gmail.com
 * Github: http://github.com/cresjie
 * 
 */
(function(window){
	
	var counter = 1, // filewizard instance counter
		fn = function(){}; // empty function

	function FileWizard(element, options, headers){
		/*
		if( !(this instanceof FileUploader)){
			return new FileUploader(options, header);
		}
		*/
		this.$element = $(element);
		this.settings = $.extend({},FileWizard.DEFAULTS, options);
		this.headers = $.extend({},FileWizard.HEADERS, headers);
		this.files = [];
		this.queue = [];
		this._callbacks = {};

		this.init();
		return this;
	}

	/**
	 * FileWizard Default Values
	 */
	FileWizard.DEFAULTS = {
		data:{},

		dragover: fn,
		drop: fn,
		dragenter:fn,
		dragleave: fn,
		rejected: function(file, error){
			switch(error) {
				case 'file_size':
					alert('File exceeds file size');
					break;

				case 'file_type':
					alert('File type not allowed');
					break;	
			}
		},

		/**
		 * HTTP request events
		 */
		complete: fn,
		success: fn,
		error: fn,
		progress: fn,

		
		
		paramName: 'files',
		url:'',
		method:'POST',
		
		parallel_upload: true,
		parallel_files: 3,

		clickable: true,
		draggable: true,
		autoSend: false,
		acceptedFiles: ['jpg','jpeg','png','gif'],
		maxSize: 5,
		multipleFiles: true,
		file_limit: 99, //number of files to be stored in the variable files
		
	};

	FileWizard.HEADERS = {};

	FileWizard.sizeToMB = function(b){
		return b/1024/1024;
	}

	var methods = {

		on: function(event, fn){
			if( !this._callbacks[event] ) {
				this._callbacks[event] = [];
			}
			this._callbacks[event].push(fn);
			return this;
		},

		trigger: function(event){
			if( this._callbacks[event] ) {
				var args = Array.prototype.slice.call(arguments);
					args.shift();
					
				this._callbacks[event].forEach(function(callback){
					callback.apply(this, args);
				})

				
			}
			return this;
		},
		/**
		 * add http paramater to the request
		 */
		addData: function(key, value){
			
			if(key){
				if(key.constructor == Object){
					
					$.extend(this.settings.data, key)
				} else {
					this.settings.data[key] = value;
				}
			}
			

			return this;
		},
		getFiles: function(){
			return this.files;
		},

		/**
		 * reset the files
		 */
		resetFiles:function(){
			/**
			* Clone the files
			*/
			var files = this.files.slice();

			this.files = [];
			this.input.value = null;

			/**
			 * Trigger files_removed
			 * pass all the remove files
			 */
			 
			 this.trigger('files_removed', files);

			return this;
		},
		/**
		 * Add files to the list
		 */
		addFiles: function(files){
			var fw = this; 
				loop = fw.settings.multipleFiles ? files.length : (files.length ? 1 : 0),
				remaining = fw.settings.file_limit - fw.files.length;
				addedFiles = [];

			loop = remaining < loop ? remaining : loop ; 

			/**
			 * Loop each files for checking
			 */
			for(var i =0 ; i < loop ; i++ ){

				/**
				 * validate the file extension
				 */
				
				var acceptedFiles = fw.settings.acceptedFiles;
				if(acceptedFiles.length) {
					var parts = files[i].name.split('.'),
						ext = parts[parts.length-1].toLowerCase();
					if(acceptedFiles.indexOf(ext) < 0 ) {
						return fw.settings.rejected.call(this, files[i],'file_type');
					}
				}

				/**
				 * validate for filesize
				 */
				if( FileWizard.sizeToMB(files[i].size) > fw.settings.maxSize   ){
					return fw.settings.rejected.call(this, files[i],'file_size')
				}

				


				/**
				 * if the multiple files allowed then just push directly
				 * the file to the file list
				 */
				if(fw.settings.multipleFiles) {
					fw.files.push(files[i]);
				} else {
					/**
					 * Multiple file is disabled
					 * So always push the file to the first array
					 */
					fw.files[0] = files[i];
				}
				
				addedFiles.push(files[i]);

				
				fw.trigger('file_added', files[i]);
				
			}
			
			
			fw.trigger('files_added', addedFiles);

			return this;
		},
		removeFile: function(i,range){
			range = range ? range : 1;

			if(i && i.constructor == File) {
				i = this.files.indexOf(i);
			}
			
			if(i > -1) {
				var files = this.files.splice(i, range);
				this.trigger('files_removed', files);
			}
			
			return this;
		},
		/**
		 * sets the setting options
		 */
		setOptions: function(options){
			$.extend(this.settings,options);
			return this;
		},

		/**
		 * sent the http request
		 */
		send: function(){
			

			this.addData.apply(this,arguments);	

			var fw = this,
				settings = $.extend({},fw.settings),
				files = fw.files.slice(0),
				progressFn = fw.settings.progress;
				successFn = fw.settings.success,
				completeFn = fw.settings.complete,
				errorFn = fw.settings.error ;

			/**
			 * Parallel uploading technique
			 */

			if(settings.parallel_upload) {
				
				var uploadFile = function(){
						
						/**
						 * check if there's still pending files
						 */
						if(files.length) {
							var file = files.shift(),
								fileUploader = null;

								settings.data[fw.settings.paramName] =  file;

								/**
								 * override complete event
								 * by calling the user's complete event first
								 * then call the uploadFile in order to continue uploading
								 */
								settings.complete = function(response, e){
									
									completeFn.call(fw, response, e, file);
									
									/**
									 * remove uploader from the queue
									 */
									 fw.removeQueue(fileUploader);

									 /**
									  * Continue uploading file
									  */
									uploadFile(); 
								}

								/**
								 * override user's success event listener
								 * inorder to remove a file from the list
								 */
								settings.success = function(response, e){
									successFn.call(fw, response, e, file);

									/**
									 * Remove file from the file listing
									 */
									var i = files.indexOf(file);
									if( i > -1 ){
										files.slice(i,1);
									}
								}

								settings.error = function(response, e){
									errorFn.call(this, response, e, file);
								}
								
								

								settings.progress = function(percent, e){
									progressFn.call(this,percent,e, file, fw, fileUploader);
								}
								
								/**
								 *
								 * Trigger before_submit event
								 */
								fw.trigger('before_submit', settings, file);

								fileUploader =  new FileUploader(settings, fw.headers);
								fw.addQueue(fileUploader);

								
								fw.trigger('submitted', settings, file);

						} else {
							delete settings.data[settings.paramName];
						}
					};

				/**
				 * Loop by the amount of parallel files allowed
				 */
				 var loop = fw.settings.parallel_files > this.queue.length ? fw.settings.parallel_files - this.queue.length : 0 ;

				for( var i = 0; i < loop; i++) {
					uploadFile();
				}



			/**
			 * single instance upload
			 */
			} else{
				var fileUploader = null;

				for(var i in files){
					settings.data[settings.paramName] =  files.length > 1 ? files : files[i];
				}


				/**
				 * override complete event
				 * by calling the user's complete event first
				 * then call the uploadFile in order to continue uploading
				 */
				settings.complete = function(response, e){

					completeFn.call(fw, response, e);

					/**
					 * remove uploader from the queue
					 */
					 fw.removeQueue(fileUploader);
					 delete settings.data[settings.paramName]
				}
				

				/**
				 *
				 * Trigger before_submit event
				 */
				 fw.trigger('before_submit', settings, files);

				fileUploader = new FileUploader(settings, fw.headers);

				
				fw.trigger('submitted', settings, files);
			}
				
			
			
			return this;
		},
		abort: function(i){
			/**
			 * abort specific index
			 */
			i = i ? i : 0;
			var queue = this.queue[0];

			if(queue) {
				queue.abort();
				this.queue.splice(i,1);
			}
			
			return this;
		},
		abortAll: function(){
			/**
			 * abort all queues
			 */
			this.queue.forEach( function(queue) {
				queue.abort()
			});
			this.queue = [];

			return this;
		},
		addQueue: function(queue){
			/**
			 * add a queue in the list
			 */
			this.queue.push(queue); 

			return this;
		},
		removeQueue: function(queue){
			/**
			 * Remove specific queue from the list
			 */
			var i = this.queue.indexOf(queue);
			if(i > -1) {
				this.queue.splice(i,1);
			}

			return this;
		},
		init: function(){
			var fw = this; 

			/**
			 * Loop through each targeted jQuery element
			 */
			this.$element.each(function(i, el){

				/**
				 * add dragging events to the element
				 */
				if(fw.settings.draggable) {
					$(el).on({
						dragenter: function(e){
							if(e.originalEvent.dataTransfer.types.indexOf('Files') > -1){
								$(this).addClass('filewizard-dragenter');
								fw.settings.dragenter.call(this, e);
							}	
						},
						dragleave: function(e){
							$(this).removeClass('filewizard-dragenter filewizard-dragover');
							fw.settings.dragleave.call(this, e);
						},
						dragover: function(e){
							e.preventDefault();
							$(this).addClass('filewizard-dragover');
							fw.settings.dragover.call(this,e);
						},
						drop: function(_e){
							e = _e.originalEvent;
							e.stopPropagation();
							e.preventDefault();
							$(this).removeClass('filewizard-dragenter filewizard-dragover');

							if(e.dataTransfer.types.indexOf('Files') > -1){
								files = e.dataTransfer.files;
								fw.settings.drop.call(this,e, files);
								fw.addFiles(files);
							}else{
								fw.settings.rejected.call(this,null,'not_file' ,e);
							}
							
							this.value = '';	
							
						}
					});
				}
					

			});

			/**
			 * if filewizard can be triggered
			 * by clicking the element
			 */
			if(fw.settings.clickable) {
				this.initForm();
			}
				

			

			return this;
		}, //end init

		initForm: function(){
			/**
			 * Initiate the form in the document
			 * Create input file element in the document
			 */
			var fw = this;
				fw.input = document.createElement('input');
			 	
			$(fw.input).attr({
				type: 'file',
				multiple: fw.settings.multipleFiles,
				class: 'filewizard-input filewizard-input-' + counter
			})
			.css('display','none')
			.on('change', function(e){
				fw.addFiles(this.files);
				this.value = '';
			});

			this.$element.on('click', function(e){
				e.preventDefault();
				$(fw.input).trigger('click');
			});
			
			$('body').append(fw.input);
			counter++;
		},
		getOptions: function(){
			return this.settings;
		}
		
	}

	$.extend(FileWizard.prototype, methods);

	// PLUGIN DEFINITION
  	// ==========================
  	function Plugin(options, headers){
  		
  		var arg = [];
  		if(arguments.length > 1){
  			for(var i in arguments)
  				arg.push(arguments[i]);
  		}
		var $this = $(this),
			data = $this.data('FileWizard');
		if( !data ){
			$this.data('FileWizard',new FileWizard($this, options, headers) );
			return $this;
		}
		else{
			if(data[options]){
				return data[options].apply(data, arg.splice(1,1));
			}
		}
  		
  	}
  	$.fn.FileWizard = Plugin;
  	$.fn.FileWizard.Constructor = FileWizard;
	window.FileWizard =FileWizard;
	
})(window);




