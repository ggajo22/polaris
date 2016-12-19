<?php
$conn = mysqli_connect("localhost", "root", "autoset");
mysqli_select_db($conn, "polaris2");
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <link rel="stylesheet" type="text/css" href="style.css">

    <link href="./res/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="./res/jquery-ui/jquery-ui.min.css" rel="stylesheet">
    <style media="screen">
    .padding30{
      padding-top: 40px;
    }
    </style>
  </head>
<?php
    // 뿌릴 정보 가져오기 payment_date, payment_method_name, type, room_no, start_date, end_date, 숙박일수, guest_name, total_price, paid_price, platform_name, comment
    // room, platfrom join 해서 가져오기
    $result = mysqli_query($conn, "SELECT ri.res_info_id, type, room_no, guest_name, total_price, platform_name, comment FROM res_info as ri LEFT JOIN room as rm ON ri.room_id = rm.room_id LEFT JOIN platform as pf ON ri.platform_id = pf.platform_id");
    $resData = array();
    while($row = mysqli_fetch_assoc($result)){
      // $row['res_info_id'] 가 유니크하게 무조건 1 개만 있다는 가정하에
      $resData[$row['res_info_id']] = $row;
    }
    // payment 에서 가져오기
    $result = mysqli_query($conn, "SELECT pm.res_info_id, payment_date, payment_method_name, paid_price FROM payment as pm LEFT JOIN res_info as ri ON pm.res_info_id = ri.res_info_id");
    while($row = mysqli_fetch_assoc($result)){
      if(isset($resData[$row['res_info_id']])){
        // $resData[$row['res_info_id']] 가 위에서 선언이 돼 있어야만 한다.
        // 즉 이미 불러온 res_info 데이터에만 추가해 줄 것.
        if(!isset($resData[$row['res_info_id']]['payment'])){
          $resData[$row['res_info_id']]['payment'] = array();
        }
        $resData[$row['res_info_id']]['payment'][] = $row;
      }
    }
    // res 에서 가져오기 (날짜 관련)
    $result = mysqli_query($conn, "SELECT * FROM res as r LEFT JOIN res_info as ri ON r.res_info_id = ri.res_info_id");
    while($row = mysqli_fetch_assoc($result)){
      if(isset($resData[$row['res_info_id']])){
        if(!isset($resData[$row['res_info_id']]['res'])){
          $resData[$row['res_info_id']]['res'] = array();
        }
        $resData[$row['res_info_id']]['res'][] = $row;
      }
    }

?>


  <body>
    <!-- 네비 -->
    <div class="navbar navbar-fixed-top">
      <div class="navbar-default">
        <div class="container-fluid">
          <ul class="nav nav-pills">
            <li role="presentation"><a href ="/vhfrhksfl"> 예약현황 </a></li>
            <li role="presentation"><a href ="/vhfrhksfl/report.php"> 예약집계 </a></li>
            <li role="presentation"><a href ="/index.php/exp"> 지출현황 </a></li>
            <li role="presentation"><a href ="/index.php/res/room"> 방정보 </a></li>
          </ul>
        </div>
      </div>
    </div>
  <div class="padding30">
    <header>
      <h1>예약 집계</h1>
    </header>
    <table class="container" style="text-align:center;">
      <tr>
        <td class="col-mid-6">
          <h3>총 매출</h3>
          <h2></h2>
        </td>
        <td class="col-mid-6" style="text-align:center;">
          <h3>총 예약수</h3>
          <h2></h2>
        </td>
      </tr>
    </table>
      <!-- 날짜 입력 -->
      <form class="form-horizontal" action="" method="post" id="write_action">
        <input type="text" class="datepicker" id="paym_start_date" name="paym_start_date" value="" />
        <input type="text" class="datepicker" id="paym_end_date" name="paym_end_date" value="" />
        <input type="submit" class="btn btn-danger" value="날짜별 검색">
      </form>
      <!-- 추가 버튼 -->
      <a href="/index.php/res/add/" class="btn btn-success" id="right-btn">+추가</a>
      <!-- 테이블 시작 -->
    <table cellspacing="0" cellpadding="0" class="table table-hover">
      <thead>
        <tr id="reportTable">
          <th scope="col" style="min-width:90px">결제일</th>
          <th scope="col" style="min-width:60px">결제수단</th>
          <th scope="col" style="min-width:60px">방타입</th>
          <th scope="col" style="min-width:60px">방번호</th>
          <th scope="col" style="min-width:90px">체크인</th>
          <th scope="col" style="min-width:90px">체크아웃</th>
          <th scope="col" style="min-width:90px">숙박일수</th>
          <th scope="col" style="min-width:110px">이름</th>
          <th scope="col" style="min-width:90px">총금액</th>
          <th scope="col" style="min-width:90px">지불액</th>
          <th scope="col" style="min-width:110px">플랫폼</th>
          <th scope="col" style="min-width:90px">코멘트</th>
        </tr>
      </thead>
      <tbody></tbody>
      <tfoot>
      </tfoot>
    </table>
  </div> <!-- 패딩30 -->

  <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
  <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
  <script src="./res/js/jquery-1.11.3.min.js"></script>
  <script src="./res/jquery-ui/jquery-ui.min.js"></script>
  <!-- Include all compiled plugins (below), or include individual files as needed -->
  <script src="./res/bootstrap/js/bootstrap.min.js"></script>
  <script type="text/javascript">

  </script>
  </body>
</html>
