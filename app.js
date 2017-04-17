jQuery(document).ready(function(){
	window.filewizard = new FileWizard('body',{
		clickable: false,
		url: 'upload.php',
		fileAdded: function(file){

			var fileReader = new FileReader,
				$imgContainer = $('<div class="img-container"><img class="img-responsive middle" src=""><div class="progress middle"><div class="progress-bar"></div></div></div>'),
				$dragDropContainer = $('.drag-drop-container');

			fileReader.onload = function(e) {
				$imgContainer.find('img').attr('src', e.target.result);

				$dragDropContainer.append($imgContainer);
			}

			

			file.$container = $imgContainer;

			

			fileReader.readAsDataURL(file);

		},
		filesAdded: function(files){
			this.send(); 
		},
		progress: function(p,e, file, fw){
			
			file.$container.find('.progress-bar').width(p + '%');
		},
		success: function(response, e, file){
			file.$container.find('.progress').hide();
		}
	});


});