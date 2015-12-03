
	
	function FileWizard(element,options, headers){
		this.$element = $(element);
		this.settings = $.extend({},FileWizard.DEFAULTS, options);
		this.headers = $.extend({},FileWizard.HEADERS, headers);
		this.files = [];
		this.init();
		return this;
	}

	FileWizard.DEFAULTS = {
		dragover:function(){},
		drop: function(){},
		dragenter:function(){},
		dragleave: function(){},

		paramName: 'files',
		url:'',
		method:'POST',

		autoSend: false
		
	};

	FileWizard.HEADERS = {};

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
		removeFile: function(i){
			this.files.splice(i,1);
			return this;
		},
		setOptions: function(options){
			$.extend(this.settings,options)
			return this;
		},
		init: function(){
			fw = this;
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
					drop: function(e){
						e.stopPropagation();
						e.preventDefault();

						if(e.originalEvent.dataTransfer.types.indexOf('Files') > -1){
							var _files = e.originalEvent.dataTransfer.files;
							for(var i =0 ; i < _files.length ; i++ ){
								fw.files.push(_files[i]);
							}
								
							fw.settings.drop.call(this,e);
						}
						
					}
				});

			});

			return this;
		}, //end init

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
			this.fileUploader.abort();
			return this;
		}
	}

	$.extend(FileWizard.prototype, methods);



