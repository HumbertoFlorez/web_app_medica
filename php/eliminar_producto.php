<?php
include_once 'procedimientos.php';
//$_POST = json_decode(file_get_contents("php://input"), true);
Conectar();
Verificar_Tabla("insumos");

$id = $_POST['borra'];
$cadena = "DELETE FROM `insumos` WHERE id = $id";
$resultado = $BaseD->query($cadena);

include "listar_productos.php";
$salida = ['listado' => $listado, 'porFecha' => $porFecha];
echo json_encode($salida);