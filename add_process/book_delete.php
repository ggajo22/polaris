<?php
  $conn = mysqli_connect("localhost", "root", "autoset");
  mysqli_select_db($conn, "polaris2");

  $sql = "DELETE FROM res_info WHERE res_info_id='".$_POST['res_info_id']."'";
  $result = mysqli_query($conn, $sql);

  header('Location: http://localhost/vhfrhksfl/index.php');

?>
