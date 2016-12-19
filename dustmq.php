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
      .silver {background-color:green;}
    </style>
  </head>
  <body>

    아이디 : <input type="text" id="txtUserID" /><hr />
    <input type="button" id="btnCopy" value="복사" /><hr />
    아이디 : <input type="text" id="txtID" />


    <!-- jQuery 소환! -->
    <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="./res/js/jquery-1.11.3.min.js"></script>
    <script src="./res/jquery-ui/jquery-ui.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="./res/bootstrap/js/bootstrap.min.js"></script>

    <script type="text/javascript">
       $(document).ready(function() {
           // 모든 텍스트박스의 배경을 Silver로 설정
           $(':text').addClass("silver");
           // 첫번째 텍스트박스의 값을 두번째 텍스트박스로 복사
           $('#btnCopy').click(function() {
               $('#txtID').val($('#txtUserID:text').val());
           });
       });
   </script>

  </body>
</html>
