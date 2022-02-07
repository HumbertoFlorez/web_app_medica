Agrega_Producto   = document.querySelector("#Agrega_Producto");
listado_productos = document.querySelector(".listado_productos");
modal_formulario  = document.querySelector(".contenedor_formulario");
formulario        = document.querySelector("form");
titulo_formulario = document.querySelector("#titulo_formulario");
Id_Producto       = document.querySelector("#Id_Producto");
referencia        = document.querySelector("#referencia");
nombre            = document.querySelector("#nombre");
laboratorio       = document.querySelector("#laboratorio");
creacion          = document.querySelector("#creacion");
vencimiento       = document.querySelector("#vencimiento");
cantidad          = document.querySelector("#cantidad");
btn_enviar        = document.querySelector("#enviar");
btn_cancelar      = document.querySelector("#cancelar");

Agrega_Producto.addEventListener('click', Agregar_Producto);
listado_productos.addEventListener('click', Verificar_Accion_Listado);
btn_cancelar.addEventListener('click', Cerrar_Formulario);

Ver_Listado_Productos();

document.addEventListener("DOMContentLoaded", function() {
	fechero = document.querySelector("#calendar");
	calendario = new FullCalendar.Calendar(fechero, {
		locale: 'es',
		aspectRatio:5,
		height:520,
		handleWindowResize:false,
		editable:true,
		dateClick: function(info) {
			Fecha_Filtro = info.dateStr;
			Ver_Listado_Productos();
			info.dayEl.style.backgroundColor = 'rgba(200,200,200,0.5)';
		}
	});
	calendario.render();
	eventos = [];
	for (i = 0; i < Cursor_Entradas.length; i++) {
		eventos.push({title:Cursor_Entradas[i].cantidad, start:Cursor_Entradas[i].fecha});
	}
	calendario.addEventSource(eventos);
	document.querySelector("form").addEventListener('submit', Validar_Envio);
});

function Agregar_Producto() {
	modal_formulario.style.display = "block";
	creacion.valueAsDate = new Date();
	titulo_formulario.innerHTML = "Agregar Producto";
	Id_Producto.value = "";
	referencia.disabled  = false;
	nombre.disabled      = false;
	laboratorio.disabled = false;
	referencia.focus();
}

function Verificar_Accion_Listado(evento) {
	activo = evento.srcElement;
	borrar = activo.tagName == "BUTTON";
	if (activo.id === "") {
		activo = activo.parentNode;
	}
	registro = Cursor_Filtro[activo.id.substr(5)];
	console.log(registro);
	if (!borrar) {
		if (registro.fecha_vencimiento < Fecha_Hoy) {
			Mostrar_Mensaje("No es posible hacer cambios en un producto vencido");
			return;
		}
		modal_formulario.style.display = "block";
		titulo_formulario.innerHTML = "Editar Producto";
		Id_Producto.value    = registro.id;
		referencia.value     = registro.identificador;
		nombre.value         = registro.nombre;
		laboratorio.value    = registro.laboratorio;
		creacion.value       = registro.fecha_ingreso;
		vencimiento.value    = registro.fecha_vencimiento;
		cantidad.value       = registro.cantidad;
		referencia.disabled  = true;
		nombre.disabled      = true;
		laboratorio.disabled = true;
		vencimiento.focus();
	} else {
		Confirma_Accion(`Está seguro de eliminar el producto '${registro.identificador} - ${registro.nombre}'?`, `Eliminar(${registro.id})`);
	}
}

function Ver_Listado_Productos() {
	Cursor_Filtro = Cursor_Productos.filter(Registro => Registro.fecha_ingreso == Fecha_Filtro);
	if (Cursor_Filtro.length == 0) {
		listado_productos.innerHTML = "Aun no existen productos registrados, haga clic en el botón Agregar para crear uno --->";
		return;
	}
	listado = '';
	for (i = 0; i < Cursor_Filtro.length; i++) {
		listado += `<div class='detalle' id='deta_${i}'>
						<div>${Cursor_Filtro[i].id}</div>
						<div>${Cursor_Filtro[i].identificador}</div>
						<div>${Cursor_Filtro[i].nombre}</div>
						<div>${Cursor_Filtro[i].laboratorio}</div>
						<div>${Fecha(Cursor_Filtro[i].fecha_ingreso, 2)}</div>
						<div>${Fecha(Cursor_Filtro[i].fecha_vencimiento, 2)}</div>
						<div>${Cursor_Filtro[i].cantidad}</div>
						<button>Eliminar</button>
					</div>`;
	}
	listado_productos.innerHTML = listado;
}
function Validar_Envio(envio) {
	envio.preventDefault();
	hay_error = false;
	mensaje = '';
	if (referencia.value == '') {
		hay_error = true;
		mensaje += 'La referencia está vacía';
	}
	if (Id_Producto.value == '') {
		existe = Cursor_Productos.filter(registro => registro.identificador === referencia.value && registro.fecha_ingreso === creacion.value);
		if (existe.length > 0) {
			hay_error = true;
			mensaje += (mensaje.length > 0 ? '<br>' : '') + 'No se puede crear la misma referencia en este día';
		}
	}
	if (nombre.value == '') {
		hay_error = true;
		mensaje += (mensaje.length > 0 ? '<br>' : '') + 'El nombre del producto está vacío';
	}
	if (laboratorio.value == '') {
		hay_error = true;
		mensaje += (mensaje.length > 0 ? '<br>' : '') + 'El laboratorio está vacío';
	}
	if (vencimiento.value == '') {
		hay_error = true;
		mensaje += (mensaje.length > 0 ? '<br>' : '') + 'La fecha de vencimiento está vacía';
	} else if (vencimiento.value < creacion.value) {
		hay_error = true;
		mensaje += (mensaje.length > 0 ? '<br>' : '') + 'El producto ya está vencido';
		vencimiento.focus();
	}
	if (hay_error) {
		Mostrar_Mensaje(mensaje);
		return false;
	}
	datosEnvio = new FormData(formulario);
	datosEnvio.append("creacion", creacion.value);
	datosEnvio.append("id", Id_Producto.value);
	fetch("./php/guardar_producto.php", { method: "POST", body: datosEnvio })
	.then(respuesta => respuesta.text()).then(function (data) {
		if (data.indexOf("xdebug") >= 0) {
			Mostrar_Mensaje(`Hay un error:<br>${data}`);
			return;
		}
		datos = JSON.parse(data);
		Cursor_Productos = datos.listado;
		Cursor_Entradas  = datos.porFecha;
		Ver_Listado_Productos();
		modal_formulario.style.display = "none";
		eventos = [];
		for (i = 0; i < Cursor_Entradas.length; i++) {
			eventos.push({title:Cursor_Entradas[i].cantidad, start:Cursor_Entradas[i].fecha});
		}
		calendario.refetch();
	});

}
function Cerrar_Formulario(e) {
	e.preventDefault();
	modal_formulario.style.display = "none";
}
function Eliminar(id) {
	datosEnvio = new FormData(formulario);
	datosEnvio.append("borra", id);
	fetch("./php/eliminar_producto.php", { method: "POST", body:datosEnvio })
	.then(respuesta => respuesta.text()).then(function (data) {
		if (data.indexOf("xdebug") >= 0) {
			Mostrar_Mensaje(`Hay un error:<br>${data}`);
			return;
		}
		datos = JSON.parse(data);
		Cursor_Productos = datos.listado;
		Cursor_Entradas  = datos.porFecha;
		Ver_Listado_Productos();
		modal_formulario.style.display = "none";
		eventos = [];
		for (i = 0; i < Cursor_Entradas.length; i++) {
			eventos.push({title:Cursor_Entradas[i].cantidad, start:Cursor_Entradas[i].fecha});
		}
		calendario.refetch();
	});
}
function Mostrar_Mensaje(texto) {
	modal = document.createElement("div");
	modal.classList.add("contenedor_formulario");
	cuadro_texto = document.createElement("div");
	cuadro_texto.innerHTML = texto;
	cuadro_texto.classList.add("mensajes");
	cerrar = document.createElement("p");
	cerrar.classList.add("texto_cierre");
	cerrar.innerHTML = "Click en cualquier lugar para cerrar";
	modal.appendChild(cuadro_texto);
	modal.appendChild(cerrar);
	modal.addEventListener('click', function() {
		modal.remove();
	})
	principal = document.querySelector("body");
	principal.appendChild(modal);
	modal.style.display = "block";
}
function Confirma_Accion(texto, accion) {
	modal = document.createElement("div");
	modal.classList.add("contenedor_formulario");
	cuadro_texto = document.createElement("div");
	cuadro_texto.innerHTML = texto;
	cuadro_texto.classList.add("mensajes");

	botonera = document.createElement("div");
	botonera.classList.add("botonera");

	boton_si = document.createElement("button");
	boton_si.innerHTML = "Sí";

	boton_no = document.createElement("button");
	boton_no.innerHTML = "No";
	botonera.appendChild(boton_si);
	botonera.appendChild(boton_no);

	modal.appendChild(cuadro_texto);
	modal.appendChild(botonera);

	principal = document.querySelector("body");
	principal.appendChild(modal);
	modal.style.display = "block";
	boton_si.addEventListener('click', function() {
		modal.remove();
		eval(accion);
	})
	boton_no.addEventListener('click', function() {
		modal.remove();
	})
}

function Fecha(Que_Fecha, Forma) {
	if (Que_Fecha === null) {
		return "";
	}
	meses = [{mes:"01", nombre:"Enero"},{mes:"02", nombre:"Febrero"}, {mes:"03", nombre:"Marzo"}, {mes:"04", nombre:"Abril"}, {mes:"05", nombre:"Mayo"}, {mes:"06", nombre:"Junio"}, {mes:"07", nombre:"Julio"}, {mes:"08", nombre:"Agosto"}, {mes:"09", nombre:"September"}, {mes:"10", nombre:"Octubre"}, {mes:"11", nombre:"Noviembre"}, {mes:"12", nombre:"Diciembre"}];
	xdia = Que_Fecha.substr(8, 2);
	xmes = Que_Fecha.substr(5, 2);
	xani = Que_Fecha.substr(0, 4);
	nmes = meses.filter(Reg => Reg.mes == xmes);
	switch (Forma) {
		case 1: $sale = `${nmes[0].nombre} ${xdia} de ${xani}`; break;
		case 2: $sale = `${nmes[0].nombre.substr(0, 3)} ${xdia} / ${xani.substr(3, 2)}`; break;
		default: $sale = `${xmes}/${xdia}/${xani}`; break;
	}
	return $sale;
}