<?php
  require("config/db_config.php");
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

    <!--<script src="./res/js/mgTable.js"></script>
    <script src="./res/js/mgImg.js"></script>
    <script src="./res/js/string.js"></script>
    <script src="./res/js/common.js"></script>-->

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
      .skyblue {
        background-color : skyblue;
      }
      #right-btn{
        float: right;
      }
      .uncomplete{
        background-color : #ff0000 !important;
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
            <li role="presentation"><a href ="/vhfrhksfl/expense.php"> 지출 현황 </a></li>
            <li role="presentation"><a href ="/vhfrhksfl/payment_report.php"> 결제일별 집계 </a></li>
            <li role="presentation"><a href ="/vhfrhksfl/date_report.php"> 일별 집계 </a></li>
            <!--<li role="presentation"><a href ="/index.php/res/room"> 방정보 </a></li>-->
          </ul>
        </div>
      </div>
    </div>
