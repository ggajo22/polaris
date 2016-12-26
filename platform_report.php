<?php
  require("view/header.php");
  require("proc/dao_platform_report.php");
?>
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

    <div class="padding30 container">
      <ul>
        <?php
          foreach($platforms as $pfs){
            echo '<div class="panel panel-default" data-pf-id="'.$pfs['platform_id'].'" onclick="panel_open(this);">
                    <div class="panel-heading">
                      <li id="pf_'.$pfs['platform_id'].'">'.$pfs['platform_name'].'</li>
                    </div>
                    <div id="tb_'.$pfs['platform_id'].'" class="panel-body hidden">
                      <table id="payment_report_'.$pfs['platform_id'].'" class="table table-hover text-center ">
                        <thead>
                          <th>날짜</th>
                          <th>현금(건수)</th>
                          <th>현금(총액)</th>
                          <th>카드(건수)</th>
                          <th>카드(총액)</th>
                          <th>입금(건수)</th>
                          <th>입금(총액)</th>
                          <th>플랫폼(건수)</th>
                          <th>플랫폼(총액)</th>
                          <th>합계</th>
                        </thead>
                        <tbody></tbody>
                        <tfoot></tfoot>
                      </table>
                    </div>
                  </div>';
          }
        ?>
      </ul>
    </div>
    <script>
      $('.datepicker').datepicker({
        dateFormat:'yy-mm-dd'
      });

      function getFormatDate(date){
        var year = date.getFullYear();                                 //yyyy
       	var month = (1 + date.getMonth());                     //M
       	month = month >= 10 ? month : '0' + month;     // month 두자리로 저장
       	var day = date.getDate();                                        //d
       	day = day >= 10 ? day : '0' + day;                            //day 두자리로 저장
       	return  month + '-' + day;
       }

      function gfd(date){
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

      $("#select_date_btn").click(function(){
        $.post('proc/dao_payment_report.php', function(pmData){
          $("table tbody").empty();
          $("#summary tbody").empty();
          $(".panel-body").addClass("hidden");
          var pmData = <?=json_encode($pmData);?>;
          var dsData = <?=json_encode($dsData);?>;
          var pfs = <?=json_encode($platforms);?>;
          var start = new Date($('[name=PAYM_START_DATE]').val());
          var end = new Date($('[name=PAYM_END_DATE]').val());
        // 총합 구하기
          var sum = 0;
          for(i=0; i<dsData.length; i++){
            if(new Date(dsData[i]['payment_date']) >= start && new Date(dsData[i]['payment_date']) <= end){
              var number = parseInt(dsData[i]['sum']);
              sum += number;
            }
          }
          $("#summary tbody").append('<tr><td>'+number_format(sum)+'</td></tr>');


          var duration = (end-start)/(24*3600*1000);
          start.setDate(start.getDate()-1);
          for(i=0; i<duration+1; i++){
            start.setDate(start.getDate()+1);
            for(k=0; k<pfs.length+1; k++){
              $("#payment_report_"+k+" tbody").append('<tr><td id="'+gfd(start)+k+'">'+gfd(start)+'</td><td id="'+gfd(start)+k+"cnt1"+'"></td><td id="'+gfd(start)+k+"sum1"+'"></td><td id="'+gfd(start)+k+"cnt2"+'"></td><td id="'+gfd(start)+k+"sum2"+'"></td><td id="'+gfd(start)+k+"cnt3"+'"></td><td id="'+gfd(start)+k+"sum3"+'"></td><td id="'+gfd(start)+k+"cnt4"+'"></td><td id="'+gfd(start)+k+"sum4"+'"></td><td id="'+gfd(start)+k+"5"+'"></td></tr>');
            }
          }

        // 테이블에 데이터 뿌리기
          for(i=0; i<pmData.length; i++){
            $("#"+pmData[i]['payment_date']+pmData[i]['platform_id']+"cnt"+pmData[i]['payment_method_id']).append(number_format(pmData[i]['cnt']));
          }
          for(i=0; i<pmData.length; i++){
            $("#"+pmData[i]['payment_date']+pmData[i]['platform_id']+"sum"+pmData[i]['payment_method_id']).append(number_format(pmData[i]['sum']));
          }
          for(i=0; i<dsData.length; i++){
            $("#"+dsData[i]['payment_date']+dsData[i]['platform_id']+"5").append('<b>'+number_format(dsData[i]['sum'])+'</b>');
          }
        });
      });

      // 패널 열닫
      function panel_open(cell){
        var id = $(cell).attr('data-pf-id');
        $("#pf_"+id).click(function(){
          $("#tb_"+id).toggleClass("hidden");
          console.log(id);
        })
      }
    </script>
  </body>
