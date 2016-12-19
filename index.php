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

    <style>
      th {
        text-align: center;
      }
      .inputLayer {
        background-color : #EAEAEA;
        padding : 10px 10px 10px 10px;
      }
      #dustmq tfoot {
        background-color : skyblue;
      }
      .padding-right-5 {
        padding-right : 5px;
      }

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
?>
  <div class="padding30">
    <!-- 입력창 -->
    <form id="inputLayer" class="hidden row inputLayer" action="process.php" method="post" style="position:absolute; width:800px;">
      <div class="form-group col-xs-6">
        <label for="guest_name">이름(필수)</label>
        <input type="text" class="form-control" name="guest_name" id="input_guest_name">
      </div>
      <div class="form-group col-xs-2">
        <label for="persons">인원</label>
        <input type="text" class="form-control" name="persons" id="input_persons">
      </div>
      <div class="form-group col-xs-4">
        <label for="room_id">방번호(필수)</label>
        <select class="form-control" name="room_id" id="input_room_id">
          <option>방번호를 선택하세요</option>
          <?php
            foreach($room_data as $rm){
              echo '<option value="'.$rm['room_id'].'">'.$rm['type'].' '.$rm['room_no'].'</option>';
            }
          ?>
        </select>
      </div>
      <div class="form-group col-xs-4">
        <label for="start_date">체크인(필수)</label>
        <input type="text" class="datepicker form-control" name="start_date" id="input_start_date">
      </div>
      <div class="form-group col-xs-4">
        <label for="end_date">체크아웃(필수)</label>
        <input type="text" class="datepicker form-control" name="end_date" id="input_end_date">
      </div>
      <div class="form-group col-xs-4">
        <label for="platform_id">플랫폼(필수)</label>
        <select class="form-control" name="platform_id" id="input_platform_id">
          <option>플랫폼을 선택하세요</option>
          <?php
            foreach($platforms as $pfs){
              echo '<option value="'.$pfs['platform_id'].'">'.$pfs['platform_name'].'</option>';
            }
          ?>
        </select>
      </div>
      <div class="form-group col-xs-4">
        <label for="total_price">결제총액(필수)</label>
        <input type="text" class="form-control" name="total_price" id="input_total_price">
      </div>
      <div class="form-group col-xs-4">
        <label for="payment_method_id">결제방법(필수)</label>
        <select class="form-control" name="payment_method_id" id="input_payment_method_id">
          <option>결제방법을 선택하세요</option>
          <?php
            foreach($payment_methods as $pms){
              echo '<option value="'.$pms['payment_method_id'].'">'.$pms['payment_method_name'].'</option>';
            }
          ?>
        </select>
      </div>
      <div class="form-group col-xs-4">
        <label for="paid_price">결제금액(필수)</label>
        <input type="text" class="form-control" name="paid_price" id="input_paid_price">
      </div>
      <div class="form-group col-xs-9 rowspan-2">
        <label for="comment">코멘트</label>
        <textarea type="text" class="form-control" name="comment" id="input_comment" maxlength='200' style='min-height:105px; max-width:500px;'></textarea>
      </div>
      <div class="form-group col-xs-3">
        <label for="payment_date">결제일(필수)</label>
        <input type="text" class="form-control datepicker" name="payment_date" id="input_payment_date">
      </div>
      <div class="form-group col-xs-3">
        <label for="created_by">결제자(필수)</label>
        <input type="text" class="form-control" name="created_by" id="input_created_by">
      </div>
      <div class="col-xs-offset-5">
        <input type="button" class="btn btn-success btn-lg" value="저장" id="submit_btn">
        <input type="button" class="btn btn-danger btn-lg" value="닫기" id="close_btn">
      </div>
    </form>
    <!-- 입력 버튼-->
    <div class="row">
      <div class="col-md-1">
        <input type="button" id="input_res_btn" value="입력">
      </div>
    <!-- 기준일 설정-->
      <div class="col-md-3" id="reference_date">
        <input type="text" data-name="date_selected" id="dateSelected" class="datepicker autodate" placeholder="기준일을 선택하세요">
        <input type="button" id="btnDateSelect" value="이동" />  기준일 -4일~+15일까지 보여집니다.
      </div>
    </div>
    <!-- 테이블 -->
    <table id="dustmq" border="1px" width="1900px" class="table-hover table-striped" style="table-layout:fixed;" height="20px" >
      <thead id="calendar">
      </thead>
      <tbody>
      </tbody>
      <tfoot>
      </tfoot>
    </table>
  </div> <!-- padding30 -->

    <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="./res/js/jquery-1.11.3.min.js"></script>
    <script src="./res/jquery-ui/jquery-ui.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="./res/bootstrap/js/bootstrap.min.js"></script>




<script type="text/javascript">
$(document).ready(function(){
 var today = new Date();
 makeTable();
 dateSelect();
 inputBtn();
 closeBtn();

function dateSelect(){
  // 기준일 설정
  $('#btnDateSelect').click(function(){
    today = new Date($('#dateSelected:text').val());
    $('#dustmq thead').empty();
    $('#dustmq tbody').empty();
    $('#dustmq tfoot').empty();
    makeTable();
  });
}

// 테이블 만들기
function makeTable(){
  // 테이블 구성
  var room_data = <?=json_encode($room_data)?>;
  for(i=0; i<room_data.length; i++){
      var $row = $('<tr name="row_'+room_data[i]['room_no']+'" height="20px"><td class="text-right padding-right-5" id="'+room_data[i]['room_no']+'">'+room_data[i]['type']+' '+room_data[i]['room_no']+'</td></tr>');
      $("#dustmq tbody").append($row);
      var today_instance = new Date(today);
      today_instance.setDate(today_instance.getDate()-5);
      for(k=0; k<20; k++){
         today_instance.setDate(today_instance.getDate()+1);
         $row.append('<td class="whereCell text-center" onclick="showInputLayer(this);" width="90px" id="'+room_data[i]['room_no']+'_'+getFormatDate2(today_instance)+'" data-room-id="'+room_data[i]['room_id']+'" data-startdate="'+getFormatDate2(today_instance)+'"></td>');
      }
   }
   // 하단 점유율 표시할 부분 (tfoot) 만들기
   $("#dustmq tfoot").append('<td class="text-center">점유율</td>');
   var today_temp = new Date(today);
   today_temp.setDate(today_temp.getDate()-5);
   for(i=0; i<20; i++){
     today_temp.setDate(today_temp.getDate()+1);
     $("#dustmq tfoot").append('<td class="text-center" id=own_'+getFormatDate2(today_temp)+'></td>')
   }
  // 상단 날짜 표시
  $("#dustmq thead").append('<th width="120px">방번호</th>');
  today.setDate(today.getDate()-5);
  for(i=0; i<20; i++){
    today.setDate(today.getDate()+1);
    $("#dustmq thead").append('<th id="'+getFormatDate2(today)+'" width="80px">'+getFormatDate(today)+'</th>');
  }
  // 달력에 데이터 뿌리기
  var res_data = <?=json_encode($res_data)?>;
  for(i=0; i<res_data.length; i++){
    $("#"+res_data[i]['room_no']+"_"+res_data[i]['date_of_stay']).append('<div style="width:100%;height:100%;overflow:auto;">'+res_data[i]['guest_name']+'</div>').css("background-color", res_data[i]['color']).attr('data-resi-id',res_data[i]['res_info_id']);
  }

  // 하단 점유율 뿌리기
  var cnt_date = <?=json_encode($cnt_date)?>;
  for(i=0; i<cnt_date.length; i++){
    $("#own_"+cnt_date[i]['date_of_stay']).append(cnt_date[i]['cnt_date']);
  }
}
}); // 전체 function 닫는 괄호(왜 여기에 있어야만 작동하는지 모르겠음)

function getFormatDate(date){
  var year = date.getFullYear();                                 //yyyy
 	var month = (1 + date.getMonth());                     //M
 	month = month >= 10 ? month : '0' + month;     // month 두자리로 저장
 	var day = date.getDate();                                        //d
 	day = day >= 10 ? day : '0' + day;                            //day 두자리로 저장
 	return  month + '-' + day;
 }

function getFormatDate2(date){
  var year = date.getFullYear();                                 //yyyy
 	var month = (1 + date.getMonth());                     //M
 	month = month >= 10 ? month : '0' + month;     // month 두자리로 저장
 	var day = date.getDate();                                        //d
 	day = day >= 10 ? day : '0' + day;                            //day 두자리로 저장
 	return  year + '-' + month + '-' + day;
 }

<!-- datepicker 설정 -->
$('.datepicker').datepicker({
  dateFormat:'yy-mm-dd'
});
$("#input_start_date").datepicker();
$("#input_start_date").datepicker("option", "maxDate", $("#input_end_date").val());
$("#input_start_date").datepicker("option", "onClose", function (selectedDate){
  $("#input_end_date").datepicker("option", "minDate", selectedDate);
});

$("#input_end_date").datepicker();
$("#input_end_date").datepicker("option", "minDate", $("#input_start_date").val());
$("#input_end_date").datepicker("option", "onClose", function (selectedDate){
  $("#input_start_date").datepicker("option", "maxDate", selectedDate);
});

function inputBtn(){
  // 입력창 생성
  $("#input_res_btn").click(function(){
    $("#inputLayer").toggleClass("hidden");
    $("#inputLayer").css({
      left:600,
      top:200
    });
  });
}

  var resData = <?=json_encode($resData);?>;
function showInputLayer(cell){
  var $targetCell = $(cell);
  // 위치 값 구하기
  var pos = $targetCell.position();
  var startX = pos.left+20;
  var startY = pos.top+20;
  if(startX >= 900){startX=startX-810;}
  if(startY >= 500){startY=startY-460;}
  $("#inputLayer").css({
   left:startX,
   top:startY
  });
  $("#inputLayer").removeClass("hidden");

  // 정보뿌려주기
  var id = $(cell).attr('data-resi-id');
  if(id){
    var _resDat = resData[id];

    for(var _attrName in _resDat){
      var _value = _resDat[_attrName];
      if($('#input_'+_attrName).length > 0){
         $('#input_'+_attrName).val(_resDat[_attrName]);
       }
      }

    if(_resDat['payment']){
      var __paid_price = [];
      var __payment_date = [];
      var __created_by = [];
      var __payment_method_id = [];
      for(var i = 0; i < _resDat['payment'].length; i++){
         __paid_price.push(_resDat['payment'][i].paid_price);
         __payment_date.push(_resDat['payment'][i].payment_date);
         __created_by.push(_resDat['payment'][i].created_by);
         __payment_method_id.push(_resDat['payment'][i].payment_method_id);
      }
      $("#input_paid_price").val(__paid_price.join(',')); // 표현형식은 알아서바꾸기
      $("#input_payment_date").val(__payment_date.join(',')); // 표현형식은 알아서바꾸기
      $("#input_created_by").val(__created_by.join(',')); // 표현형식은 알아서바꾸기
      $("#input_payment_method_id").val(__payment_method_id.join(',')); // 표현형식은 알아서바꾸기
    }
    if(_resDat['res']){
        _resDat['res'].sort(function(a,b){
           return a.date_of_stay >= b.date_of_stay ? -1 : 1;
        });
        var __min_date_of_stay = _resDat['res'][_resDat['res'].length-1].date_of_stay;
        var __max_date_of_stay = _resDat['res'][0].date_of_stay;
        $("#input_start_date").val(__min_date_of_stay);
        $("#input_end_date").val(__max_date_of_stay);
     }
  } else {
    $("#input_guest_name").val('');
    $("#input_persons").val('');
    $("#input_room_id").val($(cell).attr('data-room-id'));
    $("#input_start_date").val($(cell).attr('data-startdate'));
    $("#input_end_date").val('');
    $("#input_platform_id").val('플랫폼을 선택하세요');
    $("#input_total_price").val('');
    $("#input_payment_method_id").val('결제방법을 선택하세요');
    $("#input_paid_price").val('');
    $("#input_comment").val('');
    $("#input_payment_date").val('');
    $("#input_created_by").val('');
  }
}

  // 입력창 닫기
  function closeBtn(){
    $(window).keydown (closeBtn_ESC);
    $("#close_btn").click(function(){
      $("#inputLayer").addClass("hidden");
    });
  }


function closeBtn_ESC(){
  // ESC키 누르면 입력창 닫기 설정
  var keycode = window.event.keyCode;
  if(keycode == 27) {$("#close_btn").click();}
}

$("#submit_btn").click(function(){
  $.ajax({
    url : 'process.php',
    dataType : 'json',
    type : 'POST',
    data : {'guest_name':$("#input_guest_name").val(), 'persons':$("#input_persons").val(), 'room_id':$("#input_room_id").val(),
            'start_date':$("#input_start_date").val(), 'end_date':$("#input_end_date").val(), 'platform_id':$("#input_platform_id").val(),
            'total_price':$("#input_total_price").val(), 'payment_method_id':$("#input_payment_method_id").val(), 'paid_price':$("#input_paid_price").val(),
            'comment':$("#input_comment").val(), 'payment_date':$("#input_payment_date").val(), 'created_by':$("#input_created_by").val()},
    success : function(data){
      if(data['result']==true){
        $("#inputLayer").addClass("hidden");
        console.log(data);
      }
    },

    error : function(data){
      console.log("에러입니다");
    }
  });
});
</script>
 </body>
</html>
