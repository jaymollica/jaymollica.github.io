<?php

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

$departments = array();

foreach ($collection as $key => $artwork) {
	$dept = $artwork['department'];
	if (!array_key_exists($dept, $departments)) {
		$departments[$dept] = 1;
	}
	else {
		$departments[$dept]++;
	}
}

$uncategorized = 0;
foreach($departments as $dept => $count) {
	if($count < 100) {
		$uncategorized = $uncategorized + $count;
		unset($departments[$dept]);
	}
}

// $departments['Uncategorized'] = $uncategorized;

arsort($departments);

$items = array('items' => array());
$i = 0;
foreach($departments as $dept => $count) {
    $items['items'][$i]['description'] = $dept;
    $items['items'][$i]['count'] = $count;
    $i++;
}

//header('Content-Type: application/json');

$fp = fopen('../json/artwork_depts_pie.json', 'w');
fwrite($fp, json_encode($items));
fclose($fp);

?>
