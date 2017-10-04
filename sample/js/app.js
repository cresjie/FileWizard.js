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



	/**
	 * profile image sample
	 */
	var readyAndShowed = false;

	function initCropper(){
		/**
		 * making sure the modal fadein animation is complete
		 * and the image is already loaded
		 * then thats the time that we're gonna init the cropper 
		 */
		if(readyAndShowed) {
			$('.profile-preview').cropper({
				aspectRatio: 1,
				viewMode: 1,
				zoomable: false
			})
		}

		readyAndShowed = true;
	}

	var profileUploader = new FileWizard('#profile-uploader',{
		url: 'upload.php',
		multipleFiles: false,
		paramName: 'image',
		fileAdded: function(file){
			$('#profile-modal').modal('show');

			var filereader = new FileReader;

			filereader.onload = function(e) {

				$('#profile-modal .profile-preview').attr('src', e.target.result);
				initCropper();
				
			}


			filereader.readAsDataURL(file);
		},
		progress: function(percent){
			$('#profile-modal .progress-bar').width(percent.toFixed(2) + '%');
		},
		success: function(response){
			if(response.success) {
				$('.profile-entry .profile-image').attr('src', response.data);
				$('#profile-modal').modal('hide');
			}
		}
	});

	$('#profile-modal').on('shown.bs.modal', initCropper)
		.on('hide.bs.modal', function(){
			$('.profile-preview').cropper('destroy');
			$('#profile-modal .progress').hide().find('.progress-bar').width(0);
			readyAndShowed = false;
		});

	$('#submit-profile').on('click', function(){
		$('#profile-modal .progress').show();
		
		/**
		 * send the filewizard image
		 * pass additional http parameters to our request for the crop
		 * http params: x,y, width, height
		 */
		profileUploader.send( $('.profile-preview').cropper('getData') )
	})

	
	
})