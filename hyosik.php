<?php
  require("view/header.php");

  $sql = "SELECT ri.res_info_id, room_no, guest_name, total_price, platform_name FROM res_info as ri LEFT JOIN room as r ON ri.room_id = r.room_id LEFT JOIN platform as p ON ri.platform_id = p.platform_id WHERE ri.platform_id = '1' or ri.platform_id = '2' or ri.platform_id = '3' ORDER BY ri.res_info_id DESC";
  $result = mysqli_query($conn, $sql);
  $resData = array();
  while($row = mysqli_fetch_array($result))
  {
    $resData[$row['res_info_id']] = $row;
  }

  $sql = "SELECT * FROM res";
  $result = mysqli_query($conn, $sql);
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

  $sql = "SELECT p.res_info_id, payment_date, payment_method_name, paid_price FROM payment as p LEFT JOIN res_info as ri ON p.res_info_id = ri.res_info_id LEFT JOIN payment_method as pm ON p.payment_method_id = pm.payment_method_id";
  $result = mysqli_query($conn, $sql);
  $payment = array();
  while($row = mysqli_fetch_assoc($result))
  {
    $payment[] = $row;
  }
?>

<div class='container' style="padding-top:100px;">
  <table id="hyosik_report" class="table table-hover text-center">
    <thead>
      <th>결제일</th>
      <th>결제수단</th>
      <th>방번호</th>
      <th>체크인</th>
      <th>체크아웃</th>
      <th>이름</th>
      <th>총금액</th>
      <th>지불액</th>
      <th>플랫폼</th>
    </thead>
    <tbody></tbody>
    <tfoot></tfoot>
  </table>
</div>

<script>
  resData = <?=json_encode($resData);?>;
  var payment = <?=json_encode($payment);?>;

  // object를 정렬하기위해 sortData 배열 선언
  var sortData = new Array();
  $.each(resData, function(index, value){
    sortData.push({key: index, value:value});
  })

  // ORDER BY res_info_id DESC 효과 주기
  sortData.sort(function(a, b){
    return parseInt(a.value.res_info_id) >= parseInt(b.value.res_info_id) ? -1 : 1;
  })

  // 테이블 만들기
  var str = null;
  $.each(sortData, function(index, ri){
    _resData = resData[ri.value.res_info_id];
    if(_resData['res']){
      _resData['res'].sort(function(a,b){
         return a.date_of_stay >= b.date_of_stay ? -1 : 1;
      });
      var __min_date_of_stay = _resData['res'][_resData['res'].length-1].date_of_stay;
      var __max_date_of_stay = _resData['res'][0].date_of_stay;
    }
    str += '<tr>';
    $.each(payment, function(index, p){
      if(ri.value.res_info_id == p.res_info_id){
        str += '<td>'+p.payment_date+'</td><td>'+p.payment_method_name+'</td><td>'+ri.value.room_no+'</td><td>'+__min_date_of_stay+'</td><td>'+__max_date_of_stay+'</td><td>'+ri.value.guest_name+'</td><td>'+ri.value.total_price+'</td><td>'+p.paid_price+'</td><td>'+ri.value.platform_name+'</td>';
      }
    })
    str += '</tr>';
  })
  $('#hyosik_report tbody').append(str);
</script>
