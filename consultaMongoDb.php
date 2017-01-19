<?php
$m = new MongoClient();
$db = $m->selectDB('bdd_final');
$collection_bencinera = new MongoCollection($db, 'bencineras');
$collection_farmacia = new MongoCollection($db, 'farmacias');


$auz = 0.0 + $_GET['rango'];

$rango_busqueda = 0.0 + ($_GET['rango'])/111;
$lat_inf  = -$rango_busqueda + $_GET['latitud'];
$lat_sup  = $rango_busqueda + $_GET['latitud'];
$long_inf = -$rango_busqueda + $_GET['longitud'];
$long_sup = $rango_busqueda + $_GET['longitud'];

$nombre_latitud = "";
$nombre_longitud = "";
if ($_GET['es_farmacia'] == '1'){
	$nombre_latitud = "Latitud";
	$nombre_longitud = "Longitud";
}else{
	$nombre_latitud = "Latitud";
	$nombre_longitud = "Longitud";
}

$fQuery = array($nombre_latitud => array ('$gt' => $lat_inf , '$lt' => $lat_sup), $nombre_longitud => array ('$gt' => $long_inf , '$lt' => $long_sup));
$cursor;

if ($_GET['es_farmacia'] == '1'){
	$cursor = $collection_farmacia->find($fQuery);
}else{
	$cursor = $collection_bencinera->find($fQuery);
}
// ------------------------------------------------------------------------------
// Trabajar con los datos desde aqui
// ------------------------------------------------------------------------------


$response = array();
if ($_GET['es_farmacia'] == '1'){
	while($doc = $cursor->getNext()) {
		$obj = array(
			'ID_Region' => $doc['ID_Region'],
			'ID_Comuna' => $doc['ID_Comuna'],
			'Direccion' => $doc['Direccion'],
			'Nombre_de_Farmacia' => $doc['Nombre_de_Farmacia'],
			'Horario_Apertura' => $doc['Horario_Apertura'],
			'Horario_de_Cierre' => $doc['Horario_de_Cierre'],
			'latitude' => $doc['coordenadas'][0],
			'longitude' => $doc['coordenadas'][1],
			'Telefono' => $doc['Telefono']
		);
		array_push($response, $obj);
	}
}else{
	while($doc = $cursor->getNext()) {
		$obj = array(
			'nombre' => $doc['nombre'],
			'Latitud' => $doc['Latitud'],
			'Longitud' => $doc['Longitud'],
			'autoservicio' => $doc['autoservicio'],
			'direccion' => $doc['direccion'],
			'horario' => $doc['horario'],
			'latitude' => $doc['coordenadas'][0],
			'longitude' => $doc['coordenadas'][1]
		);
		array_push($response, $obj);
	}
}

//convierte el array en JSON y se envia de nuevo al cliente
echo json_encode($response);
?>



























