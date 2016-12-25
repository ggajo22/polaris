<?php
    // room list 가져오기
    $result = mysqli_query($conn, "SELECT * FROM room");
    $room_data = array();
    while($row = mysqli_fetch_assoc($result))
    {
      $room_data[] = $row;
    }
    // 달력에 뿌릴 정보 가져오기
    $result = mysqli_query($conn, "SELECT r.res_info_id, room_no, date_of_stay, guest_name, pf.platform_id, color FROM res as r LEFT JOIN res_info as ri ON r.res_info_id = ri.res_info_id LEFT JOIN room as rm ON ri.room_id = rm.room_id LEFT JOIN platform as pf ON ri.platform_id = pf.platform_id");
    $res_data = array();
    while($row = mysqli_fetch_assoc($result)){
      $res_data[] = $row;
    }

    // 플랫폼 list 가져오기
    $result = mysqli_query($conn, "SELECT * FROM platform");
    $platforms = array();
    while($row = mysqli_fetch_assoc($result))
    {
     $platforms[] = $row;
    }

    // 결제방법 list 가져오기
    $result = mysqli_query($conn, "SELECT * FROM payment_method");
    $payment_methods = array();
    while($row = mysqli_fetch_assoc($result))
    {
     $payment_methods[] = $row;
    }

    // 날짜별 카운트 정보 가져오기
    $result = mysqli_query($conn, "SELECT date_of_stay, count('date_of_stay') as cnt_date FROM res GROUP BY date_of_stay");
    $cnt_date = array();
    while($row = mysqli_fetch_assoc($result))
    {
     $cnt_date[] = $row;
    }

    // 입력창에 입력되어있는 정보 가져와서 뿌릴 정보 가져오기
    $resData = array();
    $result = mysqli_query($conn, "SELECT * FROM res_info as ri LEFT JOIN room as rm ON ri.room_id = rm.room_id");
    while($row = mysqli_fetch_assoc($result)){
      // $row['res_info_id'] 가 유니크하게 무조건 1 개만 있다는 가정하에
      $resData[$row['res_info_id']] = $row;
    }

    $result = mysqli_query($conn, "SELECT * FROM res");
    while($row = mysqli_fetch_assoc($result)){
      if(isset($resData[$row['res_info_id']])){
         // $resData[$row['res_info_id']] 가 위에서 선언이 돼 있어야만 한다.
         // 즉 이미 불러온 res_info 데이터에만 추가해 줄 것.
         if(!isset($resData[$row['res_info_id']]['res'])){
           $resData[$row['res_info_id']]['res'] = array();// $resData에 res라는 어트리뷰트가 없으면 res어트리뷰트를 array로 먼저 선언해준다.
         }
         $resData[$row['res_info_id']]['res'][] = $row;
      }
    }

    $result = mysqli_query($conn, "SELECT * FROM payment pm LEFT JOIN payment_method pmm ON pm.payment_method_id = pmm.payment_method_id");
    while($row = mysqli_fetch_assoc($result)){
      if(isset($resData[$row['res_info_id']])){
         if(!isset($resData[$row['res_info_id']]['payment'])){
           $resData[$row['res_info_id']]['payment'] = array();
         }
         $resData[$row['res_info_id']]['payment'][] = $row;
      }
    }

    // 미결제자 파악하기
    $sql = "SELECT pm.res_info_id, paid_price, total_price FROM payment pm LEFT JOIN res_info ri ON pm.res_info_id = ri.res_info_id";
    $result = mysqli_query($conn, $sql);
    $compData = array();
    while($row = mysqli_fetch_assoc($result)){
      $compData[] = $row;
    }
?>
