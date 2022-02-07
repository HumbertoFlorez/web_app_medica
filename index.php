<?php
include_once 'php/procedimientos.php';
Conectar();
Verificar_Tabla("insumos");

include 'php/listar_productos.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Productos Médicos</title>
	<link rel="stylesheet" href="css/estilos.css">
	<link rel="stylesheet" href="js/main.css">
	<script defer src="js/main.js"></script>
	<script defer src="js/app.js"></script>
</head>
<body>
	<h1>Insumos Médicos</h1>
	<div class="contenedor_principal">
		<div class="contenedor_lista">
			<div class="titulo_lista">
				<div>Id</div>
				<div>Identificación</div>
				<div>Descripción</div>
				<div>Laboratorio</div>
				<div>Ingreso</div>
				<div>Vence</div>
				<div>Cantidad</div>
				<button id="Agrega_Producto">Agregar</button>
			</div>
			<div class="listado_productos">
			</div>
			<p class="Mensaje_Pie">Haga clic en cualquier producto para editarlo</p>
		</div>
		<div id="calendar">
			<p class="Mensaje_Pie">Clic en una fecha para filtrar</p>
		</div>
	</div>
	<div class="contenedor_formulario">
		<form action="" method="POST">
			<h2 id="titulo_formulario">Agregar Producto</h2>
			<div class="campo_formulario">
				<label for="Id_Producto">Id</label>
				<input type="text" id="Id_Producto" name="Id_Producto" maxlength="10" disabled>
			</div>
			<div class="campo_formulario">
				<label for="Referencia">Referencia producto</label>
				<input type="text" id="referencia" name="referencia" maxlength="13" placeholder="Referencia máx 13 caracteres" required autofocus>
			</div>
			<div class="campo_formulario">
				<label for="nombre">Nombre producto</label>
				<input type="text" id="nombre" name="nombre" maxlength="80" placeholder="Nombre máx 80 caracteres" required>
			</div>
			<div class="campo_formulario">
				<label for="laboratorio">Laboratorio</label>
				<input type="text" id="laboratorio" name="laboratorio" maxlength="50" placeholder="Laboratorio máx 50 caracteres" required>
			</div>
			<div class="campo_formulario">
				<label for="creacion">Fecha Ingreso</label>
				<input type="date" id="creacion" name="creacion" disabled>
			</div>
			<div class="campo_formulario">
				<label for="vencimiento">Fecha Vencimiento</label>
				<input type="date" id="vencimiento" name="vencimiento" required>
			</div>
			<div class="campo_formulario">
				<label for="cantidad">Cantidad Ingresa</label>
				<input type="number" id="cantidad" name="cantidad" maxlength="6" placeholder="Cantidad máx 6 digitos" required min="0" max="999999">
			</div>
			<div class="campo_formulario">
				<button type="submit" id="enviar">Guardar</button>
				<button id="cancelar">Cancelar</button>
			</div>
		</form>
	</div>
	<script>
		Cursor_Productos = <?php echo json_encode($listado); ?>;
		Cursor_Entradas  = <?php echo json_encode($porFecha); ?>;
		Fecha_Hoy        = <?php echo "'".$hoy."'"; ?>;
		Fecha_Filtro 	 = <?php echo "'".$hoy."'"; ?>;
	</script>
</body>
</html>