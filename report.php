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
        <tr>
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
  </body>
</html>
