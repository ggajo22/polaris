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
  <form id="inputLayer" class="hidden row inputLayer" action="add_process/expense_add.php" method="post" style="position:absolute; width:1000px; top:250px;" onsubmit="return check_input()">
    <div class="form-group col-xs-4">
      <label for="exp_date">결제일(필수)</label>
      <input type="text" class="form-control datepicker" name="exp_date" id="input_exp_date">
    </div>
    <div class="form-group col-xs-4">
      <label for="exp_key">대분류(필수)</label>
      <select class="form-control" name="exp_key" id="input_exp_key">
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
      <select class="form-control" name="exp_detail" id="input_exp_detail">
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
      <input type="text" class="form-control" name="exp_where" id="input_exp_where">
    </div>
    <div class="form-group col-xs-3">
      <label for="exp_requester">구매(요청)자</label>
      <input type="text" class="form-control" name="exp_requester" id="input_exp_requester">
    </div>
    <div class="form-group col-xs-3">
      <label for="exp_price">지출금액(필수)</label>
      <input type="text" class="form-control" name="exp_price" id="input_exp_price">
    </div>
    <div class="form-group col-xs-3">
      <label for="exp_payments">결제방법(필수)</label>
      <select class="form-control" name="exp_payments" id="input_exp_payments">
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
      <textarea type="text" class="form-control" name="exp_comment" id="input_exp_comment" maxlength='200' style='min-height:105px; max-width:1000px;'></textarea>
    </div>
    <div class="col-xs-offset-5">
      <input type="submit" class="btn btn-success btn-lg" value="저장" id="submit_btn">
      <input type="button" class="btn btn-danger btn-lg" value="닫기" id="close_btn">
    </div>
  </form>
</div>
    <div class="col-xs-6 col-xs-offset-2">
      <input type="text" name='PAYM_START_DATE' class="datepicker" id="paym_start_date" name="paym_start_date" value="<?=date("Y-m-d")?>" />
      <input type="text" name='PAYM_END_DATE' class="datepicker" id="paym_end_date" name="paym_end_date" value="<?=date("Y-m-d")?>" />
      <input type="submit" class="btn btn-danger" value="날짜별 검색" id="select_date_btn">
    </div>
    <div class="col-xs-1 col-xs-offset-1">
      <input type="button" class="btn btn-success" value="추가" id="add_btn">
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
      <tr class="skeleton" name="id" data-inflate="data-exp-id">
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
      $("#exp_report tbody").empty();
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
    if($('#input_exp_date').val() == ""){
      alert("결제일을 입력하세요.");
      $("#input_exp_date").focus();
      return false;
    } else if($('#input_exp_key').val() == "대분류 선택"){
      alert("대분류를 입력하세요.");
      $("#input_exp_key").focus();
      return false;
    } else if($('#input_exp_detail').val() == "상세분류 선택"){
      alert("상세분류를 입력하세요.");
      $("#input_exp_detail").focus();
      return false;
    } else if($('#input_exp_where').val() == ""){
      alert("구매처를 입력하세요.");
      $("#input_exp_where").focus();
      return false;
    } else if($('#input_exp_price').val() == ""){
      alert("지출금액을 입력하세요.");
      $("#input_exp_price").focus();
      return false;
    } else if($('#input_exp_payments').val() == "결제방법 선택"){
      alert("결제방법을 입력하세요.");
      $("#input_exp_payments").focus();
      return false;
    } return true;
  }
</script>
