<?php

function prepare_array($arr) {

    arsort($arr);
    $items = array('items' => array());
    $i = 0;
    foreach($arr as $key => $val) {
        $items['items'][$i]['description'] = $key;
        $items['items'][$i]['count'] = $val;
        $i++;
    }

    return $items;
}

function check_len($str) {
    if(strlen($str) < 1) {
        return "undetermined";
    }
    else {
       return $str;
    }
}

function years_to_decades($arr) {
    $decades = array();
    foreach ($arr as $key => $val) {
        $decade = floor($key / 10) * 10;
        if(array_key_exists($decade, $decades)) {
            $decades[$decade] += $val;
        }
        else {
            $decades[$decade] = $val;
        }
    }

    return $decades;
}

function prepare_multiline($arr, $cull=FALSE) {
    ksort($arr);
    if($cull) {
        $arr = cull_range($arr);
    }
    $items = array('items' => array());
    $i = 0;
    foreach($arr as $key => $val) {
        $items['items'][$i]['date'] = $key;
        $items['items'][$i]['values'] = $val;
        $i++;
    }

    return $items;
}

function calculate_uncategorized(&$arr) {
    $uncategorized = 0;
    foreach($arr as $collection_group => $count) {
        if($count < 100) {
            $uncategorized = $uncategorized + $count;
            unset($arr[$collection_group]);
        }
    }

    if(array_key_exists("Other", $arr)) {
        $arr['Other'] += $uncategorized;
    }
    else {
        $arr['Other'] = $uncategorized;
    }

    return $arr;
}

function is_year_in_range($min, $max, $value) {
    return ($min <= $value) && ($value <= $max);
}

function cull_range(&$arr) {

    if (isset($_REQUEST['start'])) {
        $start = $_REQUEST['start'];
    }
    else {
        $start = 1983;
    }

    if (isset($_REQUEST['end'])) {
        $end = $_REQUEST['end'];
    }
    else {
        $end = date('Y');
    }

    foreach($arr as $key => $val) {
        if(!is_year_in_range($start, $end, $key)) {
            unset($arr[$key]);
        }
    }

    return $arr;
}

$collection = $fields = array(); $i = 0;
$handle = @fopen("../csv/sfmoma_raw_data_artworks.csv", "r");
if ($handle) {
    while (($row = fgetcsv($handle, 4096)) !== false) {
        if (empty($fields)) {
            $fields = $row;
            continue;
        }
        foreach ($row as $k=>$value) {
            $collection[$i][$fields[$k]] = $value;
        }
        $i++;
    }
    if (!feof($handle)) {
        echo "Error: unexpected fgets() fail\n";
    }
    fclose($handle);
}

$collection_groups = array();
$bayareacollections = array();

$regions = array(
    "Bay Area" => 0,
    "United States" => 0,
    "International" => 0,
    // "Undetermined" => 0,
    );
$giftpurchases = array(
    "Gifts" => 0,
    "Purchases" => 0,
    //"Undetermined" => 0,
);

$collection_years = array();
$accession_years = array();

$credline_years = array();

$ad_collections = array(
    "Graphic Design",
    "Architecture",
    "Furniture",
    "Product Design",
    "Transportation",
    "Fashion",
    "Other",
);

$ad_obj_classification = array();

foreach ($collection as $key => $artwork) {
    $dept = $artwork['department'];
    if ($dept == 'Architecture and Design') {

        // breakdown by collection group
        $collection_group = ucwords($artwork['collection']);
        if (!in_array($collection_group, $ad_collections)) {
            $collection_group = "Other";
        }
        if (!array_key_exists($collection_group, $collection_groups)) {
            $collection_groups[$collection_group] = 1;
        }
        else {
            $collection_groups[$collection_group]++;
        }

        // determine gifts and purchases
        if(preg_match("/gift/i",$artwork['credit_line'])) {
            $giftpurchases['Gifts']++;
        }
        elseif(preg_match("/purchase/i",$artwork['credit_line'])) {
            $giftpurchases['Purchases']++;
        }
        else {
            // $giftpurchases['Undetermined']++;
        }

        //determine bay area, US or international
        if(preg_match("/California; Bay Area/i",$artwork['origin_state_province'])) {
            $regions['Bay Area']++;

            // break out bay area A+D
            if (!array_key_exists($collection_group, $bayareacollections)) {
                $bayareacollections[$collection_group] = 1;
            }
            else {
                $bayareacollections[$collection_group]++;
            }
        }
        elseif(preg_match("/United States/i",$artwork['origin_country'])) {
            $regions['United States']++;
        }
        elseif( strlen($artwork['origin_country']) > 0 ) {
            $regions['International']++;
        }
        else {
            // $regions['Undetermined']++;
        }

        // aggregate collection by accession year
        if(is_numeric($artwork['accession_date_year'])) {
            $ayear = $artwork['accession_date_year'];

            if(!array_key_exists($ayear, $credline_years)) {
                $credline_years[$ayear] = array(
                    "Gifts" => 0,
                    "Purchases" => 0,
                    // "Undetermined" => 0,
                );
            }

            // determine gift or purchase
            if(preg_match("/gift/i",$artwork['credit_line'])) {
                $credline_years[$ayear]['Gifts']++;
            }
            elseif(preg_match("/purchase/i",$artwork['credit_line'])) {
                $credline_years[$ayear]['Purchases']++;
            }
            else {
                // $credline_years[$ayear]['Undetermined']++;
            }

            // assign collection area
            if(strlen($artwork['collection']) > 0) {
                $acollection = ucwords($artwork['collection']);
            }
            else {
                $acollection = "Other";
            }

            if (!in_array($acollection, $ad_collections)) {
                $acollection = "Other";
            }

            if(array_key_exists($ayear, $accession_years)) {

                if(array_key_exists($acollection, $accession_years[$ayear])) {
                    $accession_years[$ayear][$acollection]++;
                }
                else {
                    $accession_years[$ayear][$acollection] = 1;
                }
            }
            else {
                $accession_years[$ayear] = array(
                    $acollection => 1,
                );
            }
        }

        $obj_year = explode("-", $artwork['sort_date_earliest'])[0];
        if(is_numeric($obj_year)) {
            $cyear = $obj_year;

            if(strlen($artwork['collection']) > 0) {
                $acollection = ucwords($artwork['collection']);
            }
            else {
                $acollection = "Other";
            }

            if (!in_array($acollection, $ad_collections)) {
                $acollection = "Other";
            }

            if(array_key_exists($cyear, $collection_years)) {

                if(array_key_exists($acollection, $collection_years[$cyear])) {
                    $collection_years[$cyear][$acollection]++;
                }
                else {
                    $collection_years[$cyear][$acollection] = 1;
                }
            }
            else {
                $collection_years[$cyear] = array(
                    $acollection => 1,
                );
            }
        }

        //get object classification
        $col = str_replace(' ', '_', str_replace('-','_', strtolower(check_len($artwork['collection']))));
        $broad = str_replace(' ', '_', str_replace('-','_', strtolower(check_len($artwork['broad_classification']))));
        $general = str_replace(' ', '_', str_replace('-','_', strtolower(check_len($artwork['general_classification']))));
        $narrow = str_replace(' ', '_', str_replace('-','_', strtolower(check_len($artwork['narrow_classification']))));

        $obj_classifiaction = $col."-".$broad."-".$general."-".$narrow;

        if(array_key_exists($obj_classifiaction, $ad_obj_classification)) {
            $ad_obj_classification[$obj_classifiaction]++;
        }
        else {
            $ad_obj_classification[$obj_classifiaction] = 1;
        }
    }
}


$obj_classifiaction_csv = array();
foreach($ad_obj_classification as $key => $val) {
    $obj_classifiaction_csv[] = array($key, $val);
}
$fp = fopen('../csv/ad_obj_classification.csv', 'w');
foreach ($obj_classifiaction_csv as $fields) {
    fputcsv($fp, $fields);
}
fclose($fp);

//print_r($obj_classifiaction_csv);

foreach ($ad_collections as $adc) {
    foreach($accession_years as $year => &$vals) {
        if(!array_key_exists($adc, $vals)) {
            $vals[$adc] = 0;
        }
    }
    foreach($collection_years as $year => &$vals) {
        if(!array_key_exists($adc, $vals)) {
            $vals[$adc] = 0;
        }
    }
}

$credline_years_items = prepare_multiline($credline_years, TRUE);
$fp = fopen('../json/ad_creditline_years.json', 'w');
fwrite($fp, json_encode($credline_years_items));
fclose($fp);

$collection_years = years_to_decades($collection_years);
$collection_years_items = prepare_multiline($collection_years);
$fp = fopen('../json/ad_collection_years.json', 'w');
fwrite($fp, json_encode($collection_years_items));
fclose($fp);

$accesion_years_items = prepare_multiline($accession_years, TRUE);
$fp = fopen('../json/ad_accession_years.json', 'w');
fwrite($fp, json_encode($accesion_years_items));
fclose($fp);

$collection_groups = calculate_uncategorized($collection_groups);
$collection_group_items = prepare_array($collection_groups);
$fp = fopen('../json/ad_collection.json', 'w');
fwrite($fp, json_encode($collection_group_items));
fclose($fp);

$bayareacollections = calculate_uncategorized($bayareacollections);
$bayareacollections_items = prepare_array($bayareacollections);
$fp = fopen('../json/ad_bay_area_collection.json', 'w');
fwrite($fp, json_encode($bayareacollections_items));
fclose($fp);

$giftpurchases_items = prepare_array($giftpurchases);
$fp = fopen('../json/ad_giftspurchases.json', 'w');
fwrite($fp, json_encode($giftpurchases_items));
fclose($fp);

$regions_items = prepare_array($regions);
$fp = fopen('../json/ad_regions.json', 'w');
fwrite($fp, json_encode($regions_items));
fclose($fp);

print "All Done";

?>
