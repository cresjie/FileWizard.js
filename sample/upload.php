<?php

include('vendor/autoload.php');

use Intervention\Image\ImageManagerStatic as Image;

header('Content-type:application/json');

// configure with favored image driver (gd by default)

if( isset($_FILES['image']) ) {

	Image::configure(array('driver' => 'imagick'));

	$img = Image::make($_FILES['image']['tmp_name']);

	if( isset($_POST['x']) && isset($_POST['y']) && isset($_POST['width']) && isset($_POST['height']) ) {
		$img->crop($_POST['width'], $_POST['height'], $_POST['x'], $_POST['y']);
	}

	echo json_encode(['success' => true, 'data' => (string) $img->encode('data-url') ]);
	exit;
}

echo json_encode(['success' => false, 'error_msg' => 'image is required']);