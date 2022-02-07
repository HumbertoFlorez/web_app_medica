<?php
function Conectar() { // Establecer la conexión al servidor y seleccionar la Base de datos
	global $BaseD, $NomBD, $puerto, $usuario, $clave; // Variables globales de la Base de datos
	// Definir la Base de datos en la que se opera
	include 'acceso.php';
	$BaseD = new mysqli('p:'.$puerto, $usuario,  $clave);
	if (!$BaseD) {
		echo "No ha sido posible conectarse con el servidor";
		exit;
	}
	$BaseD->select_db($NomBD);
} // Establecer la conexión al servidor y seleccionar la Base de datos

function Verificar_Tabla($Tabla = "") { // Buscar una estructura y crearla si aún no existe en la base de datos
	if ($Tabla == "") {
		return;
	}
	global $BaseD, $NomBD;
	$Estructura = Sacar_Estructura($Tabla);
	if (count($Estructura) == 0) {
		echo "No se ha definido aún la estructura para '$Tabla'";
		return;
	}
	$Tabla = "`$Tabla`";
	$Texto_Estructura = "";
	foreach ($Estructura as $campo) { // Alistar cada campo de la estructura
		if (!empty($Texto_Estructura)) $Texto_Estructura .= ', ';
		if ($campo[2] != 0) {
			$Texto_Estructura .= "`".$campo[0]."` ".$campo[1]."(".$campo[2].")";
		}
		else {
			$Texto_Estructura .= "`".$campo[0]."` ".$campo[1];
		}
		if ($campo[3] == 'auto') {
			$Texto_Estructura .= " NOT NULL AUTO_INCREMENT PRIMARY KEY";
		}
		if ($campo[3] != 'auto' && $campo[3] != '') {
			$Texto_Estructura .= $campo[3];
		}
	}
	$Texto_Estructura = "CREATE TABLE IF NOT EXISTS $Tabla ($Texto_Estructura) CHARSET=utf8 COLLATE utf8_spanish_ci";
	$Ord_Tab = $BaseD->query($Texto_Estructura);
	if (!$Ord_Tab) {
		echo "<script> alert('No se pudo crear la tabla $Tabla $Texto_Estructura.'); </script>";
	}
} // Buscar una estructura y crearla si aún no existe en la base de datos

function Sacar_Estructura($Nombre_Tabla = "") {
	$estructura = [];
	switch ($Nombre_Tabla) {
		case "insumos":
			$estructura = [
				["id",                "int",     "10", "auto"],
				["identificador",     "varchar", "13",     ""],
				["nombre",            "varchar", "80",     ""],
				["laboratorio",       "varchar", "50",     ""],
				["fecha_ingreso",     "date",     "0",     ""],
				["fecha_vencimiento", "date",     "0",     ""],
				["cantidad",          "int",      "6",     ""]
			];
	}
	return $estructura;
}
?>