var geocoder;
var map;


//------------------------------------------------------------------------------
function initialize() {
	
	rescatarCoordenadasPosicionActual();
	//document.getElementById("direccion_buscada").value = "Ingrese direccion";
	document.getElementById("latitud_direccion").value = "";
    document.getElementById("longitud_direccion").value = "";
	document.getElementById("direccion_ok").value = 0;
	
	geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-29.912980, -71.243886);
	
    var mapOptions = {
		zoom: 14,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	//map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

}
//--------------------------------------------------------------------------------
 function codeAddress(address) {
    // alert("iniciando code adress");
    geocoder.geocode( {'address':address}, function(results, status) {
			//alert("iniciando geocode ");
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				document.getElementById("latitud_direccion").value = results[0].geometry.location.lat();
				document.getElementById("longitud_direccion").value = results[0].geometry.location.lng();
				document.getElementById("direccion_ok").value = 1;
				
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
			} else {
				document.getElementById("direccion_ok").value = 0;
				//alert("La geocodificación no se pudo realizar. Motivo: " + status);
				alert("No se ha encontrado la direcci\u00F3n espeficada");
			}
		//	alert("fin geocode");
    });
//	alert("fin code aadress");
}

function rescatarCoordenadasDireccion(){
    codeAddress(document.getElementById("direccion_buscada").value);
	setTimeout (function(){
			if(parseInt(document.getElementById("direccion_ok").value)){
			//document.getElementById("form_ingreso_direccion").submit();
			var url_1 = 'consultaMongoDb.php?latitud='+document.getElementById("latitud_direccion").value+'&longitud='+document.getElementById("longitud_direccion").value+'&es_farmacia='+document.getElementById("es_farmacia_2").value+'&rango='+document.getElementById("rango").value;
				resetMap(generarZoomDesdeRango (parseInt(document.getElementById("rango").value)),document.getElementById("latitud_direccion").value,document.getElementById("longitud_direccion").value);
				marcarPosicion(document.getElementById("latitud_direccion").value,document.getElementById("longitud_direccion").value);
				getServicioCercano2(url_1);
			}
		}, 500); 
	
}

//------------------------------------------------------
function rescatarCoordenadasDireccion2(){
    codeAddress(document.getElementById("direccion_buscada2").value);
	setTimeout (function(){
			if(parseInt(document.getElementById("direccion_ok").value)){
			//document.getElementById("form_ingreso_direccion").submit();
			var url_1 = 'consultaMongoDb.php?latitud='+document.getElementById("latitud_direccion").value+'&longitud='+document.getElementById("longitud_direccion").value+'&es_farmacia='+document.getElementById("es_farmacia_2").value+'&rango='+document.getElementById("rango").value;
				resetMap(generarZoomDesdeRango (parseInt(document.getElementById("rango").value)),document.getElementById("latitud_direccion").value,document.getElementById("longitud_direccion").value);
				marcarPosicion(document.getElementById("latitud_direccion").value,document.getElementById("longitud_direccion").value);
				getServicioCercano2(url_1);
			}
		}, 500); 
	
}

//------------------------------------------------------------------------------------------
function generarZoomDesdeRango (rango){ 
	if (121 <= rango && rango <= 200){ return 8; }
	else if (51 <= rango && rango <= 120){ return 9; }
	else if (31 <= rango && rango <= 50){ return 10; }
	else if (15 <= rango && rango <= 30){ return 11; }
	else if (8 <= rango && rango <= 14){ return 12; }
	else if (4 <= rango && rango <= 7){ return 13; }
	else if ( 2<= rango && rango <= 3){ return 14; }
	else{ return 15; } 
}
/*
function generarZoomDesdeRango (rango){
	var conversion_rango = 0.045*rango;
	var aux = parseInt(conversion_rango);
	aux++;
	if (aux < 16){
	    return 16-aux;
	}else{
		return 7;
	}
}

function generarZoomDesdeRango (rango){
	var conversion_rango = 0.045*rango;
	var aux = parseInt(conversion_rango);
	aux = conversion_rango - aux;
	if (aux < 0.5){
	    return 16-parseInt(conversion_rango);
	}else{
		return 16-(parseInt(conversion_rango)+1);
	}
}
*/
//--------------------------------------------------------------------------------------------

function rescatarCoordenadasPosicionActual(){
	document.getElementById("latitud_actual").value = "";
	document.getElementById("longitud_actual").value = "";
	document.getElementById("ubicacion_actual_ok").value = 0;
	var t_lat = document.getElementById("latitud_actual");
	var t_lon = document.getElementById("longitud_actual");
	var t_ok = document.getElementById("ubicacion_actual_ok");
	geolocalizar(t_lat,t_lon,t_ok);
	
}


//---------------------------------------------------------------------
function geolocalizar(lat,lon,ok){
	
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			lat.value = position.coords.latitude;
			lon.value = position.coords.longitude;
			ok.value = 1;
			marcarMiLocalizacion(position)
			//document.getElementById("imagen_listo").src = "si.jpg";
		});
	}else {
		ok.value = 0;
        alert("Geolocation is not supported by this browser.");
    } 
}
//------------------------------------------------------------------------
function buscarEnLocalizacionActual(){	
	if(parseInt(document.getElementById("ubicacion_actual_ok").value)){
		//document.getElementById("form_ubicacion_actual").submit();
	    var url_1 = 'consultaMongoDb.php?latitud='+document.getElementById("latitud_actual").value+'&longitud='+document.getElementById("longitud_actual").value+'&es_farmacia='+document.getElementById("es_farmacia_1").value+'&rango='+document.getElementById("rango").value;
		resetMap(generarZoomDesdeRango (parseInt(document.getElementById("rango").value)),document.getElementById("latitud_actual").value,document.getElementById("longitud_actual").value);
		marcarPosicion(document.getElementById("latitud_actual").value,document.getElementById("longitud_actual").value);
		getServicioCercano2(url_1);
	}
}
// --------------------------------------------------------------------

function marcarPosicion(lat_,long_) {
	//latitud, longitud de la ubicación actual
	var latitud = lat_;
	var longitud = long_;
	var msg = "Estas aqui";
	var pos = new google.maps.LatLng(latitud, longitud);
	map.setCenter(pos);
	var infoBox = new google.maps.InfoWindow({map: map,
											position:pos,
											content: msg});
	
	//dibujar un marcador de Google Maps en la ubicación actual
	var miMarcador = new google.maps.Marker({map: map,
										position: pos,
										animation: google.maps.Animation.BOUNCE,
										icon: 'images/posi.png'});
	//getServicioCercano(latitud, longitud);
	return;
}


//-----------------------------------------------------------------------
function resetMap(zoom2,lat_,long_){
	var latlng = new google.maps.LatLng(lat_,long_);
				var mapOptions = {
					zoom: zoom2,
					center: latlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}
				map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

//----------------------------------------------------------------------

function cambiarSelecionFarmacias(){
      if (document.getElementById("radio_farmacia").checked == true){
			document.getElementById("es_farmacia_1").value = 1;
			document.getElementById("es_farmacia_2").value = 1;
	  }else{
			document.getElementById("es_farmacia_1").value = 0;
			document.getElementById("es_farmacia_2").value = 0;
	  }
			
}

function limpiarCampoDeDireccion (){
	document.getElementById("direccion_buscada").value = "";
}



//-------------------------------------------
function marcarMiLocalizacion(position) {
	//latitud, longitud de la ubicación actual
	var latitud = position.coords.latitude;
	var longitud = position.coords.longitude;
	var msg = "Estas aqui";
	var pos = new google.maps.LatLng(latitud, longitud);
	map.setCenter(pos);
	var infoBox = new google.maps.InfoWindow({map: map,
											position:pos,
											content: msg});
	//dibujar un marcador de Google Maps en la ubicación actual
	var miMarcador = new google.maps.Marker({map: map,
										position: pos,
										animation: google.maps.Animation.BOUNCE,
										icon: 'images/posi.png'});
	//getServicioCercano(latitud, longitud);
	return;
}
//----------------------------------------------------------
function getServicioCercano2(url_a_enviar) {
	//Envía una petición Ajax para obtener los servicios cercanos
	
	$.ajax({
	url : url_a_enviar,
	dataType : 'json',
	success : ajaxSuccess});
}
//----------------------------------------------------------
function getServicioCercano(latitud, longitud) {
	//Envía una petición Ajax para obtener los servicios cercanos
	$.ajax({
	url : 'query2.php?lat='+latitud+'&lon='+longitud,
	dataType : 'json',
	success : ajaxSuccess});
}
//----------------------------------------------------------
function ajaxSuccess(data){
	//la función de devolución de llamada para Ajax, marca cada servicio cerca en Google Maps
	data.forEach(function(servicio){
						var pos = new google.maps.LatLng(servicio.latitude, servicio.longitude);
						if (document.getElementById("radio_farmacia").checked == true){
							var marker = new google.maps.Marker({map: map,
																position: pos,
																icon: 'images/far.png'});
						}else{
							var marker = new google.maps.Marker({map: map,
																position: pos,
																icon: 'images/ben.png'});
						}
					}
				);
}

//---------------------------------------------------------
function actualizarRango(){
	 document.getElementById("valor_rango").value = document.getElementById("rango").value;
}



















