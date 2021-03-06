<?php
  require("view/header.php");
  require("proc/dao_date_report.php");
 ?>

  <body>
    <div class='padding30 container'>
      <table id="summary" class="lead table table-hover text-center">
        <thead>
          <th>총 매출</th>
        </thead>
        <tbody><tr><td>0</tr></td></tbody>
        <tfoot></tfoot>
      </table>
    </div>

    <div class="container">
      <div class="input-group pull-left">

          <input type="text" name='PAYM_START_DATE' class="datepicker" id="paym_start_date" name="paym_start_date" value="<?=date("Y-m-d")?>" />
          <input type="text" name='PAYM_END_DATE' class="datepicker" id="paym_end_date" name="paym_end_date" value="<?=date("Y-m-d")?>" />
          <input type="submit" class="btn btn-danger" value="날짜별 검색" id="select_date_btn">

      </div>
    </div>

    <div class='padding30 container'>
      <table id="date_report" class="table table-hover text-center">
        <thead>
          <th>날짜</th>
          <th>합계</th>
        </thead>
        <tbody></tbody>
        <tfoot></tfoot>
      </table>
    </div>
    <script type="text/javascript">
      $('.datepicker').datepicker({
        dateFormat:'yy-mm-dd'
      });

      $("#select_date_btn").click(function(){
        $.post('proc/dao_date_report.php', function(pmData){
          $("#date_report tbody").empty();
          $("#summary tbody").empty();
          var date_report = <?=json_encode($date_report);?>;
          var start = new Date($('[name=PAYM_START_DATE]').val());
          var end = new Date($('[name=PAYM_END_DATE]').val());
        // 총합 구하기
          var sum = 0;
          for(i=0; i<date_report.length; i++){
            if(new Date(date_report[i]['date_of_stay']) >= start && new Date(date_report[i]['date_of_stay']) <= end){
              var number = parseInt(date_report[i]['sdp']);
              sum += number;
            }
          }
          $("#summary tbody").append('<tr><td>'+number_format(sum)+'</td></tr>');
        // 테이블 만들기
          var duration = (end-start)/(24*3600*1000);
          start.setDate(start.getDate()-1);
          for(i=0; i<duration+1; i++){
            start.setDate(start.getDate()+1);
            $("#date_report tbody").append('<tr><td id="'+getFormatDate2(start)+'">'+getFormatDate2(start)+'</td><td id="'+getFormatDate2(start)+"_1"+'"></td></tr>');
          }

          // 테이블에 데이터 뿌리기
          for(i=0; i<date_report.length; i++){
            $("#"+date_report[i]['date_of_stay']+"_1").append(number_format(Math.round(date_report[i]['sdp'])));
            console.log(date_report[i]['sdp']);
          }
        });
      });

    function getFormatDate2(date){
      var year = date.getFullYear();                                 //yyyy
    	var month = (1 + date.getMonth());                     //M
    	month = month >= 10 ? month : '0' + month;     // month 두자리로 저장
    	var day = date.getDate();                                        //d
    	day = day >= 10 ? day : '0' + day;                            //day 두자리로 저장
    	return  year + '-' + month + '-' + day;
    }

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
    </script>
  </body>
</html>
