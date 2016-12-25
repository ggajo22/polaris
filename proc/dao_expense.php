<?php
// 전체 expense 데이터 가져오기
  $sql = "SELECT * FROM exp ORDER BY exp_date DESC";
  $result = mysqli_query($conn, $sql);
  $expData = array();
  while($row = mysqli_fetch_assoc($result)){
    $expData[] = $row;
  }

// key 리스트 가져오기
  $sql = "SELECT * FROM exp_key";
  $result = mysqli_query($conn, $sql);
  $keyData = array();
  while($row = mysqli_fetch_assoc($result)){
    $keyData[] = $row;
  }

// detail 리스트 가져오기
  $sql = "SELECT * FROM exp_detail";
  $result = mysqli_query($conn, $sql);
  $detailData = array();
  while($row = mysqli_fetch_assoc($result)){
    $detailData[] = $row;
  }

// payment_method 리스트 가져오기
  $sql = "SELECT * FROM exp_payment";
  $result = mysqli_query($conn, $sql);
  $paymData = array();
  while($row = mysqli_fetch_assoc($result)){
    $paymData[] = $row;
  }

// 입력값 가져올 데이터 가져오기
  $sql = "SELECT * FROM exp";
  $result = mysqli_query($conn, $sql);
  $exp_data = array();
  while($row = mysqli_fetch_assoc($result)){
    $exp_data[$row['exp_id']] = $row;
  }
 ?>
