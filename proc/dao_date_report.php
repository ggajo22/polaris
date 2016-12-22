<?php
   $sql = "SELECT date_of_stay, sum(date_price) as sdp FROM (SELECT date_of_stay, res_info_id FROM res GROUP BY date_of_stay, res_info_id) as rs LEFT JOIN (SELECT r.res_info_id, (total_price / count(r.res_info_id)) as date_price FROM res as r LEFT JOIN res_info as ri ON r.res_info_id = ri.res_info_id GROUP BY r.res_info_id) as rss ON rs.res_info_id = rss.res_info_id GROUP BY date_of_stay";
   $result = mysqli_query($conn, $sql);
   $date_report = array();
   while($row = mysqli_fetch_assoc($result))
   {
    $date_report[] = $row;
   }
   // 원하는정보1 "SELECT * FROM res GROUP BY date_of_stay, res_info_id";
   // 원하는정보2 "SELECT r.res_info_id, (total_price / count(r.res_info_id)) as date_price FROM res as r LEFT JOIN res_info as ri ON r.res_info_id = ri.res_info_id GROUP BY r.res_info_id"
   // 원하는정보join "SELECT date_of_stay, sum(date_price) as sdp, FROM (SELECT date_of_stay, res_info_id, FROM res GROUP BY date_of_stay, res_info_id) as rs LEFT JOIN (SELECT r.res_info_id, (total_price / count(r.res_info_id)) as date_price FROM res as r LEFT JOIN res_info as ri ON r.res_info_id = ri.res_info_id GROUP BY r.res_info_id) as rss ON rs.res_info_id = rss.res_info_id GROUP BY date_of_stay"
 ?>
