<?php
  $sql = "SELECT payment_date, ri.platform_id, pm.payment_method_id, SUM(paid_price) as sum, COUNT(platform_id) as cnt FROM payment as pm LEFT JOIN res_info as ri ON pm.res_info_id = ri.res_info_id LEFT JOIN payment_method as pmm ON pm.payment_method_id = pmm.payment_method_id GROUP BY payment_date, pm.payment_method_id, ri.platform_id";
  $result = mysqli_query($conn, $sql);
  $pmData = array();
  while($row = mysqli_fetch_assoc($result)){
    $pmData[] = $row;
  }

  $sql = "SELECT payment_date, ri.platform_id, pm.payment_method_id, SUM(paid_price) as sum, COUNT(platform_id) as cnt FROM payment as pm LEFT JOIN res_info as ri ON pm.res_info_id = ri.res_info_id LEFT JOIN payment_method as pmm ON pm.payment_method_id = pmm.payment_method_id GROUP BY payment_date, ri.platform_id";
  $result = mysqli_query($conn, $sql);
  // dsData = date sum data
  $dsData = array();
  while($row = mysqli_fetch_assoc($result)){
    $dsData[] = $row;
  }

  // 플랫폼 list 가져오기
  $result = mysqli_query($conn, "SELECT * FROM platform");
  $platforms = array();
  while($row = mysqli_fetch_assoc($result))
  {
   $platforms[] = $row;
  }

  //"SELECT payment_date, payment_method_name, pm.payment_method_id, SUM(paid_price) as sum FROM payment as pm LEFT JOIN payment_method as pmm ON pm.payment_method_id = pmm.payment_method_id WHERE payment_date BETWEEN '".$paym_start_date."' AND '".$paym_end_date."' GROUP BY payment_date, pm.payment_method_id;"
  //"SELECT payment_date, ri.platform_id, pm.payment_method_id, SUM(paid_price) as sum, COUNT(platform_id) FROM payment as pm LEFT JOIN res_info as ri ON pm.res_info_id = ri.res_info_id LEFT JOIN payment_method as pmm ON pm.payment_method_id = pmm.payment_method_id GROUP BY payment_date, pm.payment_method_id, ri.platform_id"
?>
