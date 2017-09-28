$(document).ready(function(){
	
	var fw1 = new FileWizard('#filewizard-uploader-1',{
		url: 'upload.php',
		fileAdded: function(file){
			var $li = $('<li class="col-md-2 col-sm-4"><div class="image-wrapper"><div class="box-equalizer"><img class="img-equalizer"><div class="filewizard-progress"></div></div></div></li>'),
				$lastLi = $('.filewizard-uploads li').last(),
				filereader = new FileReader;

			filereader.onload = function(e) {

				$li.find('.img-equalizer').attr('src', e.target.result);
				$li.insertBefore($lastLi);

				/**
				 * automatically uploads
				 */
				fw1.send();
				
			}

			file.$content = $li;
			filereader.readAsDataURL(file);
			

		},
		progress: function(percent, e, file){
			/**
			 * remove the file from the list
			 * when it started to process the upload
			 */
			fw1.removeFile(file);
			file.$content.find('.filewizard-progress').css('left', percent.toFixed(2) + '%');
		}
	});

	
})