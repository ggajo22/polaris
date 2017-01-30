<?php
$conn = mysqli_connect("localhost", "root", "autoset");
mysqli_select_db($conn, "polaris2");

  $sql = "UPDATE exp SET exp_date='".$_POST['exp_date']."', exp_key='".$_POST['exp_key']."', exp_detail='".$_POST['exp_detail']."', exp_price='".$_POST['exp_price']."', exp_payments='".$_POST['exp_payments']."', exp_where='".$_POST['exp_where']."', exp_requester='".$_POST['exp_requester']."', exp_comment='".$_POST['exp_comment']."', exp_created=now() WHERE exp_id='".$_POST['exp_id']."'";
  $result = mysqli_query($conn, $sql);

  // 메인페이지로 돌아가기
   header('Location: ../expense.php');
?>
