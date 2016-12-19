<?php

echo json_encode(array('result'=>true, 'title'=>$_REQUEST['title'], 'description'=>$_REQUEST['description']));

$conn = mysqli_connect("localhost", "root", "autoset");
mysqli_select_db($conn, "ajax");
$sql = "INSERT INTO test (title, description) VALUES('".$_POST['title']."', '".$_POST['description']."')";
$result = mysqli_query($conn, $sql);
?>
