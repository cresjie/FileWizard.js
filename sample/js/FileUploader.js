/**
 * Plugin: FileUploader
 * Author: Cres Jie Labasano
 * Email: cresjie@gmail.com
 * Github: http://github.com/cresjie
 * 
 */
(function(window){
	
	window.FileUploader = function(options, header){

		var fn = function(){},
			_options = {
			method: 'post',
			error: fn,
			complete: fn,
			success: fn,
			progress: fn,

			data:{}
		},
			_header = {
				'Cache-Control': 'no-cache',
				'X-Requested-With': 'XMLHttpRequest',
		};

		if( !(this instanceof FileUploader)){
			return new FileUploader(options, header);
		}

		FileUploader.extend(_options, options);
		FileUploader.extend(_header, header);
		var xhr = new XMLHttpRequest();

		if(_options.method.toLowerCase() == 'get'){
			var params = Object.keys(_options.data).map(function(k) {
					    return encodeURIComponent(k) + '=' + encodeURIComponent(_options.data[k])
					}).join('&')
			xhr.open(_options.method, _options.url + '?'+params, true);
		} else {
			xhr.open(_options.method, _options.url, true);
			
		}
			

		for(var key in _header)
			xhr.setRequestHeader(key, _header[key]);

		
		if( !_options.data || ( _options.data && _options.data.constructor != FormData) ) {
			_options.data = FileUploader.toFormData(_options.data);
		}

		//add events
		
		xhr.onabort = _options.abort;
		xhr.upload.onprogress =  function(e){
			_options.progress.call(this, (e.loaded/e.total) * 100, e);
		};
		xhr.onreadystatechange = function(e){
			if( xhr.readyState === 4 ){
				var response = xhr.responseText;

				if(xhr.getResponseHeader("content-type") && xhr.getResponseHeader("content-type").indexOf("application/json") > -1 ){
					try {
		              response = JSON.parse(response);
		            } catch (_error) {
		              e = _error;
		              response = "Invalid JSON response from server.";
		            }
				}
				if(xhr.status == 200){
					_options.success.call(this,response,e);
				}else{
					_options.error.call(this,response,e)
				}

				
				_options.complete.call(this,response,e)
				
			}

					
		};
		
		xhr.onerror = function(e,r){
			_options.error.call(this,e,r);
		}

		xhr.send(_options.data);

		this.abort = function(){
			xhr.abort();
			return this;
		}
		this.getRequest = function(){
			return xhr;
		}
		return this;
	}

	FileUploader.toFormData = function(key,value){
		var formData = new FormData();
		if(key){
			if(key.constructor == String){
				formData.append(key,value);
			}
			if(key.constructor == Object){
				FileUploader.appendFormdata(formData, key);
			}
		}
		
		return formData;
	}

	FileUploader.appendFormdata = function(formdata, data, name){
		name = name || '';
	    if (data && (data.constructor == Object || data.constructor == Array) ){
	    	for(var index in data) {
	    		if (name == ''){
	                FileUploader.appendFormdata(formdata, data[index], index);
	            } else {
	                FileUploader.appendFormdata(formdata, data[index], name + '['+index+']');
	            }
	    	}
	       
	    } else {
	        formdata.append(name, data);
	    }
	}
	
	FileUploader.extend = function(obj,obj2){
		for(var field in obj2){
			obj[field] = obj2[field];
		}
		return obj;
	}

})(window);
