<script>
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
