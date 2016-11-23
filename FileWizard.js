/**
 * Plugin: FileWizard
 * Author: Cres Jie Labasano
 * Email: cresjie@gmail.com
 * Github: http://github.com/cresjie
 * 
 */
(function(window){
	
	var counter = 1,
		fn = function(){};
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
		this.init();
		return this;
	}

	FileWizard.DEFAULTS = {
		dragover: fn,
		drop: fn,
		dragenter:fn,
		dragleave: fn,
		rejected: function(file, error){
			switch(error) {
				case 'file_limit':
					alert('File exceeds file limit');
					break;

				case 'file_type':
					alert('file type not allowed');
					break;	
			}
		},
		fileAdded: fn,
		fileRemoved: fn
		paramName: 'files',
		url:'',
		method:'POST',

		clickable: true,
		autoSend: false,
		acceptedFiles: 'image/*',
		maxSize: 5,
		multipleFiles: true
		
	};

	FileWizard.HEADERS = {};

	FileWizard.sizeToMB = function(b){
		return b/1024/1024;
	}

	var methods = {
		addData: function(key, value){
			if( !this.settings.data || (this.settings.data && this.settings.data.constructor != FormData) )
				this.settings.data = new FormData();

			
			if(key){
				if(key.constructor == Object){
					for(var i in key)
						this.settings.data.append(i, key[i]);
				}else	
					this.settings.data.append(key, value)
			}
			

			return this;
		},
		getFiles: function(){
			return this.files;
		},
		resetFiles:function(){
			/**
			* Clone the files
			*/
			var files = this.files.slice();

			this.files = [];
			this.input.value = null;

			/**
			 * Trigger fileRemoved
			 */
			 this.settings.fileRemoved.call(this, files);

			return this;
		},
		addFiles: function(files){
			var fw = this; 
			limit = fw.settings.multipleFiles ? files.length : 1;
			for(var i =0 ; i < limit ; i++ ){

				if( FileWizard.sizeToMB(files[i].size) > fw.settings.maxSize   ){
					fw.settings.rejected.call(this, files[i],'file_limit')
				} else if( !files[i].type.match(fw.settings.acceptedFiles) ) {
					fw.settings.rejected.call(this, files[i],'file_type')
				} else {
					fw.files.push(files[i]);
					fw.settings.fileAdded.call(this, files[i]);
				}
			}
				
			return this;
		},
		removeFile: function(i,range){
			range = range ? range : 1;
			var files = this.files.splice(i, range);
			this.settings.fileRemoved.call(this, files);
			return this;
		},
		setOptions: function(options){
			$.extend(this.settings,options)
			return this;
		},
		send: function(){
			this.addData.apply(this,arguments);	
			
			for(var i in this.files){
				var paramName = this.files.length > 1 ? this.settings.paramName + '[]' : this.settings.paramName;
				this.addData(paramName, this.files[i]);	

			}
			
			this.fileUploader = new FileUploader(this.settings, this.headers);
			return this;
		},
		abort: function(){
			if( this.fileUploader )
				this.fileUploader.abort();
			return this;
		},
		init: function(){
			var fw = this; 
			this.$element.each(function(i, el){

				$(el).on({
					dragenter: function(e){
						if(e.originalEvent.dataTransfer.types.indexOf('Files') > -1){
							$(this).addClass('filewizard-dragenter');
							fw.settings.dragenter.call(this, e);
						}	
					},
					dragleave: function(e){
						$(this).removeClass('filewizard-dragenter');
						fw.settings.dragleave.call(this, e);
					},
					dragover: function(e){
						e.preventDefault();
						fw.settings.dragover.call(this,e);
					},
					drop: function(_e){
						e = _e.originalEvent;
						e.stopPropagation();
						e.preventDefault();
						$(this).removeClass('filewizard-dragenter');

						if(e.dataTransfer.types.indexOf('Files') > -1){
							files = e.dataTransfer.files;
							fw.settings.drop.call(this,e, files);
							fw.addFiles(files);
						}else
							fw.settings.rejected.call(this,null,'not_file' ,e);
						
					}
				});

			});

			if(fw.settings.clickable)
				this.initForm();

			

			return this;
		}, //end init

		initForm: function(){
			var fw = this;
				fw.input = document.createElement('input');
			 	
			$(fw.input).attr({
				type: 'file',
				class: 'filewizard-input filewizard-input-' + counter
			}).css('display','none').on('change', function(e){
				fw.addFiles(this.files);
			});

			this.$element.on('click', function(e){
				e.preventDefault();
				$(fw.input).trigger('click');
			});
			
			$('body').append(fw.input);
			counter++;
		},
		getSettings: function(){
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




