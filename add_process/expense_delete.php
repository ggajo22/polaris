<?php
  $conn = mysqli_connect("localhost", "root", "autoset");
  mysqli_select_db($conn, "polaris2");

  $sql = "DELETE FROM exp WHERE exp_id='".$_POST['exp_id']."'";
  $result = mysqli_query($conn, $sql);

  header('Location: http://localhost/vhfrhksfl/expense.php');

?>
