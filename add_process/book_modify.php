<?php
  $conn = mysqli_connect("localhost", "root", "autoset");
  mysqli_select_db($conn, "polaris2");

  $start_date = $_POST['start_date'];
  $end_date = $_POST['end_date'];
  $res_info_id = $_POST['res_info_id'];
  // $end_date 하루 전날까지 저장
  $end_date = date("Y-m-d", strtotime("-1 day", strtotime($end_date)));

  // 룸아이디, 숙박일자가 중복되어 있는지 확인
  $sql =  "SELECT * FROM res r LEFT JOIN res_info ri ON r.res_info_id = ri.res_info_id WHERE ri.res_info_id != '".$res_info_id."' AND room_id='".$_POST['room_id']."' AND date_of_stay BETWEEN '".$start_date."' AND '".$end_date."'";
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
    // UPDATE 하고
    $sql = "UPDATE res_info SET room_id='".$_POST['room_id']."', platform_id='".$_POST['platform_id']."', total_price='".$total_price."', guest_name='".$_POST['guest_name']."', persons='".$_POST['persons']."', comment='".$_POST['comment']."' WHERE res_info_id = '".$res_info_id."'";
    $result = mysqli_query($conn, $sql);

    // res 에서 res_info_id 조회에서 삭제
    $sql = "DELETE FROM res WHERE res_info_id='".$res_info_id."'";
    $result = mysqli_query($conn, $sql);

    // res 테이블에 다시 저장하기 위한 쿼리
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
     $sql3 = "UPDATE payment SET payment_date='".$_POST['payment_date']."', paid_price='".$_POST['paid_price']."', created_by='".$_POST['created_by']."', payment_method_id='".$_POST['payment_method_id']."' WHERE res_info_id='".$res_info_id."'";
     $result3 = mysqli_query($conn, $sql3);

     // 메인페이지로 돌아가기
    header('Location: http://localhost/vhfrhksfl/index.php');

   } else {
     // 중복이 발생 시 처리
     echo "중복날짜발생";
   }

 ?>
