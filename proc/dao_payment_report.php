<?php
  $sql = "SELECT payment_date, pm.payment_method_id, SUM(paid_price) as sum FROM payment as pm LEFT JOIN payment_method as pmm ON pm.payment_method_id = pmm.payment_method_id GROUP BY payment_date, pm.payment_method_id;";
  $result = mysqli_query($conn, $sql);
  $pmData = array();
  while($row = mysqli_fetch_assoc($result)){
    $pmData[] = $row;
  }

  $sql = "SELECT payment_date, SUM(paid_price) as sum FROM payment GROUP BY payment_date";
  $result = mysqli_query($conn, $sql);
  // dsData = date sum data
  $dsData = array();
  while($row = mysqli_fetch_assoc($result)){
    $dsData[] = $row;
  }

  //"SELECT payment_date, payment_method_name, pm.payment_method_id, SUM(paid_price) as sum FROM payment as pm LEFT JOIN payment_method as pmm ON pm.payment_method_id = pmm.payment_method_id WHERE payment_date BETWEEN '".$paym_start_date."' AND '".$paym_end_date."' GROUP BY payment_date, pm.payment_method_id;"
?>
