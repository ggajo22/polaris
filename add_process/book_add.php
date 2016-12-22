<?php
$conn = mysqli_connect("localhost", "root", "autoset");
mysqli_select_db($conn, "polaris2");

  $start_date = $_POST['start_date'];
  $end_date = $_POST['end_date'];

  // $end_date 하루 전날까지 저장
  $end_date = date("Y-m-d", strtotime("-1 day", strtotime($end_date)));
  // 룸아이디, 숙박일자가 중복되어 있는지 확인
  $sql =  "SELECT * FROM res r LEFT JOIN res_info ri ON r.res_info_id = ri.res_info_id WHERE room_id='".$_POST['room_id']."' AND date_of_stay BETWEEN '".$start_date."' AND '".$end_date."'";
  $result = mysqli_query($conn, $sql);
  if($result->num_rows == 0){
    // 중복이 없을 시 처리

    // res_info 테이블에 저장하기 위한 쿼리
    // 금액 편리하게 입력
    if($_POST['total_price'] < 300){
      $total_price = $_POST['total_price'] * 10000;
    } else {
      $total_price = $_POST['total_price'];
    }
    $sql = "INSERT INTO res_info (room_id, platform_id, total_price, guest_name, persons, comment) VALUES('".$_POST['room_id']."', '".$_POST['platform_id']."', '".$total_price."', '".$_POST['guest_name']."', '".$_POST['persons']."', '".$_POST['comment']."')";
    $result = mysqli_query($conn, $sql);

    // res_info id 가져오기
    $res_info_id = mysqli_insert_id($conn);

    // res 테이블에 저장하기 위한 쿼리
    // 일자별로 저장하기 위해 변수 $record_date 생성
    $record_date = date("Y-m-d", strtotime("-1 day", strtotime($start_date)));
    while(true) {
       $record_date = date("Y-m-d", strtotime("+1 day", strtotime($record_date)));
       $sql2 = "INSERT INTO res (res_info_id, date_of_stay) VALUES('".$res_info_id."', '".$record_date."')";
       $result2 = mysqli_query($conn, $sql2);
       if($record_date == $end_date) break;
     }

     // payment 테이블에 저장하기 위한 쿼리
     // 금액 편리하게 입력
     if($_POST['paid_price'] < 300){
       $paid_price = $_POST['paid_price'] * 10000;
     } else {
       $paid_price = $_POST['paid_price'];
     }
     $sql3 = "INSERT INTO payment (res_info_id, payment_date, paid_price, created_by, payment_method_id) VALUES('".$res_info_id."', '".$_POST['payment_date']."', '".$paid_price."', '".$_POST['created_by']."', '".$_POST['payment_method_id']."')";
     $result3 = mysqli_query($conn, $sql3);

    // 메인페이지로 돌아가기
     header('Location: http://localhost/vhfrhksfl/index.php');

   } else {
     // 중복이 발생 시 처리
     echo "중복날짜발생";
   }
 ?>
