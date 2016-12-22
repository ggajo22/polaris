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
    <script src="./res/js/jquery-1.11.3.min.js"></script>
    <script src="./res/jquery-ui/jquery-ui.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="./res/bootstrap/js/bootstrap.min.js"></script>
    <script src="./res/js/common.js"></script>
    <script src="./res/js/mgTable.js"></script>
    <script src="./res/js/mgImg.js"></script>
    <script src="./res/js/string.js"></script>
  </head>
  <body>
    <table id='pratice' width="200px" border="1px">
      <thead>
        <tr>
          <th>a</th>
          <th>b</th>
        </tr>
      </thead>
    </table>

    <div class='hidden'>
      <table>
        <tr class='skeleton'>
          <td><span name="a"></span></td>
          <td><span name="b"></span></td>
        </tr>
      </table>
    </div>

    <script type="text/javascript">
      var temp = [{a:1, b:'hi'}, {a:2, b:'hello'}];
      for(i=0; i<temp.length; i++){
        var $mashedObj = mashSkeleton('.skeleton', temp[i], true);
        $('#pratice').append($mashedObj);
      }
    </script>
  </body>
