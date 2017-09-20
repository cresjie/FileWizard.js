<?php

print_r($_POST);
print_r($_FILES);
//move_uploaded_file($_FILES['files']['tmp_name'], __DIR__ . '/' . basename($_FILES["files"]["name"]));