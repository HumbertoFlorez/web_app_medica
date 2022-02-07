<?php 
include_once 'procedimientos.php';
Conectar();
Verificar_Tabla("insumos");

$hoy = date("Y-m-d");

$cadena = "SELECT * FROM `insumos` WHERE (fecha_vencimiento >= '$hoy')";
$resultado = $BaseD->query($cadena);
$listado = [];
$porFecha = [];
$texto_salida = "";
$posicion = 0;
if (mysqli_num_rows($resultado) > 0) {
	while ($r = mysqli_fetch_assoc($resultado)) {
		$listado[] = $r;
		$hallado = false;
		for ($i = 0; $i < count($porFecha); $i++) {
			if ($porFecha[$i]['fecha'] == $r['fecha_ingreso']) {
				$porFecha[$i]['cantidad']++;
				$hallado = true;
				break;
			}
		}
		if (!$hallado) {
			$porFecha[] = ['fecha' => $r['fecha_ingreso'], 'cantidad' => 1];
		}
	}
}
?>