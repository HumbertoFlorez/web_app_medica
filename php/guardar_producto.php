<?php
include_once 'procedimientos.php';
Conectar();
Verificar_Tabla("insumos");

$id = $_POST['id'];
if ($id === '') {
	$referencia  = $BaseD->real_escape_string($_POST['referencia']);
	$nombre      = $BaseD->real_escape_string($_POST['nombre']);
	$laboratorio = $BaseD->real_escape_string($_POST['laboratorio']);
}
$creacion    = $_POST['creacion'];
$vencimiento = $_POST['vencimiento'];
$cantidad    = $_POST['cantidad'];

if ($id == "") {
	$cadena = "INSERT INTO `insumos` (identificador, nombre, laboratorio, fecha_ingreso, fecha_vencimiento, cantidad) VALUES ('$referencia', '$nombre', '$laboratorio', NOW(), '$vencimiento', $cantidad)";
} else {
	$cadena = "UPDATE `insumos` SET cantidad = $cantidad, fecha_vencimiento = '$vencimiento' WHERE (id = $id)";
}
$resultado = $BaseD->query($cadena);

include "listar_productos.php";
$salida = ['listado' => $listado, 'porFecha' => $porFecha];
echo json_encode($salida);
?>