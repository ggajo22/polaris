<?php
  require("view/header.php");
  require("proc/dao_expense.php");
?>

<div class='padding30 container'>
  <table id="summary" class="lead table table-hover text-center">
    <thead>
      <th>총 지출</th>
    </thead>
    <tbody><tr><td>0</tr></td></tbody>
    <tfoot></tfoot>
  </table>
</div>

<!-- 입력창-->
<div class="container">
  <form id="inputLayer" class="hidden row inputLayer" action="add_process/expense_add.php" method="post" style="position:absolute; width:1000px; top:250px;">
    <div class="form-group col-xs-4">
      <label for="exp_date">결제일(필수)</label>
      <input type="text" class="form-control datepicker" name="exp_date" id="input_exp_date">
    </div>
    <div class="form-group col-xs-4">
      <label for="exp_key">대분류(필수)</label>
      <select class="form-control" name="exp_key" id="input_room_id">
        <option>대분류 선택</option>
        <?php
          foreach($keyData as $kd){
            echo '<option value="'.$kd['key_name'].'">'.$kd['key_name'].'</option>';
          }
        ?>
      </select>
    </div>
    <div class="form-group col-xs-4">
      <label for="exp_detail">상세분류(필수)</label>
      <select class="form-control" name="exp_detail" id="input_platform_id">
        <option>상세분류 선택</option>
        <?php
          foreach($detailData as $dd){
            echo '<option value="'.$dd['detail_name'].'">'.$dd['detail_name'].'</option>';
          }
        ?>
      </select>
    </div>
    <div class="form-group col-xs-3">
      <label for="exp_where">구매처(필수)</label>
      <input type="text" class="form-control" name="exp_where" id="input_total_price">
    </div>
    <div class="form-group col-xs-3">
      <label for="exp_requester">구매(요청)자</label>
      <input type="text" class="form-control" name="exp_requester" id="input_paid_price">
    </div>
    <div class="form-group col-xs-3">
      <label for="exp_price">지출금액(필수)</label>
      <input type="text" class="form-control" name="exp_price" id="input_paid_price">
    </div>
    <div class="form-group col-xs-3">
      <label for="exp_payments">결제방법(필수)</label>
      <select class="form-control" name="exp_payments" id="input_platform_id">
        <option>결제방법 선택</option>
        <?php
          foreach($paymData as $pd){
            echo '<option value="'.$pd['payment_name'].'">'.$pd['payment_name'].'</option>';
          }
        ?>
      </select>
    </div>
    <div class="form-group col-xs-12 rowspan-2">
      <label for="exp_comment">코멘트</label>
      <textarea type="text" class="form-control" name="exp_comment" id="input_comment" maxlength='200' style='min-height:105px; max-width:1000px;'></textarea>
    </div>

    <div class="col-xs-offset-5">
      <input type="submit" class="btn btn-success btn-lg" value="저장" id="submit_btn">
      <input type="button" class="btn btn-danger btn-lg" value="닫기" id="close_btn">
    </div>
  </form>
</div>

<div class="container">
  <div class="input-group">
      <input type="text" name='PAYM_START_DATE' class="datepicker" id="paym_start_date" name="paym_start_date" value="<?=date("Y-m-d")?>" />
      <input type="text" name='PAYM_END_DATE' class="datepicker" id="paym_end_date" name="paym_end_date" value="<?=date("Y-m-d")?>" />
      <input type="submit" class="btn btn-danger" value="날짜별 검색" id="select_date_btn">
      <input type="button" class="btn btn-success" value="추가" id="add_btn">
  </div>
</div>
<div class='padding30'>
  <table id="exp_report" class="table table-hover text-center">
    <thead>
      <th>결제번호</th>
      <th>결제일</th>
      <th>대분류</th>
      <th>상세분류</th>
      <th>구매처</th>
      <th>구매(요청)자</th>
      <th>내용</th>
      <th>지출금액</th>
      <th>결제방법</th>
    </thead>
    <tbody></tbody>
    <tfoot></tfoot>
  </table>
</div>
<div class="hidden">
  <table>
    <tbody>
      <tr class="skeleton" name="id" data-inflate="id">
        <td><span name="id"></span></td>
        <td><span name="exp_date"></span></td>
        <td><span name="exp_key"></span></td>
        <td><span name="exp_detail"></span></td>
        <td><span name="exp_where"></span></td>
        <td><span name="exp_requester"></span></td>
        <td><span name="exp_comment"></span></td>
        <td><span name="exp_price"></span></td>
        <td><span name="exp_payments"></span></td>
      </tr>
    </tbody>
  </table>
</div>

<script src="./res/js/mgTable.js"></script>
<script src="./res/js/mgImg.js"></script>
<script src="./res/js/string.js"></script>
<script src="./res/js/common.js"></script>
<script type="text/javascript">
  $("#add_btn").click(function(){
    $("#inputLayer").toggleClass("hidden");
  })

  $(window).keydown(closeBtn_ESC);
  $("#close_btn").click(function(){
    $("#inputLayer").addClass("hidden");
  });

  function closeBtn_ESC(){
    // ESC키 누르면 입력창 닫기 설정
    var keycode = window.event.keyCode;
    if(keycode == 27) {$("#close_btn").click();}
  }

  $('.datepicker').datepicker({
    dateFormat:'yy-mm-dd'
  });


  $("#select_date_btn").click(function(){
    $.post("proc/dao_expense.php", function(expData){
      $("#exp_report").empty();
      $("#summary tbody").empty();
      var expData = <?=json_encode($expData);?>;
      var start = new Date($('[name=PAYM_START_DATE]').val());
      var end = new Date($('[name=PAYM_END_DATE]').val());
      // 총합 구하기
        var sum = 0;
        for(i=0; i<expData.length; i++){
          if(new Date(expData[i]['exp_date']) >= start && new Date(expData[i]['exp_date']) <= end){
            var number = parseInt(expData[i]['exp_price']);
            sum += number;
          }
        }
        $("#summary tbody").append('<tr><td>'+number_format(sum)+'</td></tr>');
      // 데이터 뿌리기
      var _expData = [];
      for(i=0; i<expData.length; i++){
        if(new Date(expData[i]['exp_date']) >= start && new Date(expData[i]['exp_date']) <= end){
            expData[i]['exp_price'] = number_format(expData[i]['exp_price']);
            _expData.push(expData[i]);
          }
        }
        console.log(_expData);

      var skeleton = $(".skeleton");
      for(i=0; i<_expData.length; i++){
        var $mashedObj = mashSkeleton(skeleton, _expData[i], true);
        $('#exp_report').append($mashedObj);
      }
    })
  })

  function number_format(data){
   var tmp = '';
   var number = '';
   var cutlen = 3;
   var comma = ',';
   var i;
   var data = String(data);
   len = data.length;

   mod = (len % cutlen);
   k = cutlen - mod;
   for (i=0; i<data.length; i++)
   {
       number = number + data.charAt(i);

       if (i < data.length - 1)
       {
           k++;
           if ((k % cutlen) == 0)
           {
               number = number + comma;
               k = 0;
           }
       }
   }

   return number;
  }


  function check_input(){
    if($('#input_guest_name').val() == ""){
      alert("이름을 입력하세요.");
      $("#input_guest_name").focus();
      return false;
    } else if($('#input_room_id').val() == ""){
      alert("방번호를 입력하세요.");
      $("#input_room_id").focus();
      return false;
    }
  }
</script>
