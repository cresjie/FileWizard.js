<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");

include('vendor/autoload.php');

use Intervention\Image\ImageManagerStatic as Image;

header('Content-type:application/json');

// configure with favored image driver (gd by default)

if( isset($_FILES['image']) ) {

	

	$img = Image::make($_FILES['image']['tmp_name']);

	if( isset($_POST['x']) && isset($_POST['y']) && isset($_POST['width']) && isset($_POST['height']) ) {
		$img->crop(round($_POST['width']), round($_POST['height']), round($_POST['x']), round($_POST['y']) );
	}

	echo json_encode(['success' => true, 'data' => (string) $img->encode('data-url') ]);
	exit;
}

echo json_encode(['success' => false, 'error_msg' => 'image is required']);