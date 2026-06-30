        const estadoPlataforma = {
            sesionIniciada: false,
            nombreEmpresa: "Empresa Logística Austral Ltda.",
            alertaActual: "despejado",
            tipoUsuarioRegistrado: 'empresa'
        };

        // ==========================================================================
        // SISTEMA DE NOTIFICACIONES TOAST (Erradicación total de alert)
        // ==========================================================================
        function lanzarNotificaciónSencilla(mensaje, tipo = 'info') {
            const toastContainer = document.getElementById("toastContainer");
            if (!toastContainer) return;

            const toast = document.createElement("div");
            toast.className = `toast ${tipo}`;
            
            let icono = '🔔';
            if (tipo === 'success') icono = '✅';
            if (tipo === 'warning') icono = '⚠️';
            if (tipo === 'danger') icono = '❄️';

            toast.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>${icono}</span>
                    <span>${mensaje}</span>
                </div>
                <span onclick="this.parentElement.remove()" style="margin-left: 15px; cursor: pointer; font-weight: bold; opacity: 0.7;">×</span>
            `;

            toastContainer.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = "fadeOut 0.3s ease-out forwards";
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        }

        // ==========================================================================
        // LÓGICA DE CONTROL DE ACCESOS Y NAVEGACIÓN
        // ==========================================================================
        function alternarModulo(modulo) {
            if (modulo !== "login-view" && !estadoPlataforma.sesionIniciada) {
                lanzarNotificaciónSencilla("Acceso Restringido: Debe iniciar sesión con las credenciales de su empresa.", "warning");
                return;
            }
            alternarModuloDirecto(modulo);
        }

        function alternarModuloDirecto(modulo) {
            document.getElementById("seccionLogin").classList.add("oculto");
            document.getElementById("seccionRegistro").classList.add("oculto");
            document.getElementById("seccionMenuHub").classList.add("oculto");
            document.getElementById("panelAdminContenedor").classList.add("oculto");
            document.getElementById("portalClienteContenedor").classList.add("oculto");
            document.getElementById("panelViaticosContenedor").classList.add("oculto");

            document.getElementById("tab-login").classList.remove("activo");
            document.getElementById("tab-admin").classList.remove("activo");
            document.getElementById("tab-cliente").classList.remove("activo");
            document.getElementById("tab-viaticos").classList.remove("activo");

            document.getElementById("cambiarRol").value = modulo;

            if (modulo === "login-view") {
                if (estadoPlataforma.sesionIniciada) {
                    document.getElementById("seccionMenuHub").classList.remove("oculto");
                    document.getElementById("tab-login").classList.add("activo");
                } else {
                    document.getElementById("seccionLogin").classList.remove("oculto");
                    document.getElementById("tab-login").classList.add("activo");
                }
            } 
            else if (modulo === "hub-view") {
                document.getElementById("seccionMenuHub").classList.remove("oculto");
            } 
            else if (modulo === "admin-view") {
                document.getElementById("panelAdminContenedor").classList.remove("oculto");
                document.getElementById("tab-admin").classList.add("activo");
            }
            else if (modulo === "cliente-view") {
                document.getElementById("portalClienteContenedor").classList.remove("oculto");
                document.getElementById("tab-cliente").classList.add("activo");
            }
            else if (modulo === "viaticos-view") {
                document.getElementById("panelViaticosContenedor").classList.remove("oculto");
                document.getElementById("tab-viaticos").classList.add("activo");
            }
        }

        function alternarModuloConSeguridad(modulo) {
            alternarModulo(modulo);
        }

        function bypassModulo(modulo) {
            if (modulo !== "login-view") {
                desbloquearPlataformaVisualmente("Empresa Logística Austral Ltda.");
            }
            alternarModuloDirecto(modulo);
        }

        // LÓGICA DE REGISTRO
        function mostrarRegistro(mostrar) {
            if (mostrar) {
                document.getElementById("seccionLogin").classList.add("oculto");
                document.getElementById("seccionRegistro").classList.remove("oculto");
            } else {
                document.getElementById("seccionRegistro").classList.add("oculto");
                document.getElementById("seccionLogin").classList.remove("oculto");
            }
        }

        function seleccionarTipoRegistro(tipo) {
            estadoPlataforma.tipoUsuarioRegistrado = tipo;
            const btnEmpresa = document.getElementById("btnTipoEmpresa");
            const btnPersona = document.getElementById("btnTipoPersona");
            const bloqueEmpresa = document.getElementById("bloqueEmpresa");
            const bloquePersona = document.getElementById("bloquePersona");
            const helpNombre = document.getElementById("helpNombre");

            if (tipo === 'empresa') {
                btnEmpresa.classList.add("seleccionada");
                btnPersona.classList.remove("seleccionada");
                bloqueEmpresa.classList.remove("oculto");
                bloquePersona.classList.add("oculto");
                helpNombre.textContent = "Ingrese el nombre oficial de su compañía o razón social corporativa.";
            } else {
                btnEmpresa.classList.remove("seleccionada");
                btnPersona.classList.add("seleccionada");
                bloqueEmpresa.classList.add("oculto");
                bloquePersona.classList.remove("oculto");
                helpNombre.textContent = "Ingrese su nombre y apellido completo.";
            }
        }

        function toggleLicenciaHelp(rol) {
            const campoLicencia = document.getElementById("campoLicencia");
            if (rol === 'conductor') {
                campoLicencia.classList.remove("oculto");
            } else {
                campoLicencia.classList.add("oculto");
            }
        }

        function guardarRegistroSimulado() {
            let nombre = document.getElementById("regNombre").value;
            let rut = document.getElementById("regRUT").value;

            if (nombre === "" || rut === "") {
                lanzarNotificaciónSencilla("Error: Debe ingresar el Nombre/Razón Social y el RUT para registrarse.", "danger");
                return;
            }

            lanzarNotificaciónSencilla("Registro de colaborador pre-aprobado e ingresado al sistema.", "success");
            
            document.getElementById("nombreCliente").value = nombre;
            document.getElementById("rutCliente").value = rut;

            mostrarRegistro(false);
        }

        // LOGIN DE USUARIO
        function ingresarUsuario() {
            let nombre = document.getElementById("nombreCliente").value;
            let rut = document.getElementById("rutCliente").value;

            if (nombre === "" || rut === "") {
                lanzarNotificaciónSencilla("Por favor, ingrese sus datos de acceso para autenticar.", "warning");
                return;
            }

            desbloquearPlataformaVisualmente(nombre);
            alternarModuloDirecto("hub-view");
            lanzarNotificaciónSencilla("Acceso autorizado. Módulos desbloqueados.", "success");
        }

        function desbloquearPlataformaVisualmente(usuario) {
            estadoPlataforma.sesionIniciada = true;
            estadoPlataforma.nombreEmpresa = usuario;

            document.getElementById("bienvenidaHub").textContent = "Bienvenido, " + usuario;
            document.getElementById("bienvenidaCliente").textContent = "Bienvenido/a, " + usuario;

            // Desbloquear pestañas
            document.getElementById("tab-admin").classList.remove("bloqueado");
            document.getElementById("tab-admin").textContent = "Panel de Operaciones";

            document.getElementById("tab-cliente").classList.remove("bloqueado");
            document.getElementById("tab-cliente").textContent = "Portal de Clientes";

            document.getElementById("tab-viaticos").classList.remove("bloqueado");
            document.getElementById("tab-viaticos").textContent = "Cálculo de Viáticos";

            // Sincronizar fechas
            let fecha = new Date();
            document.getElementById("fechaActualCliente").textContent = fecha.toLocaleDateString();
        }

        function cerrarSesion() {
            estadoPlataforma.sesionIniciada = false;

            document.getElementById("tab-admin").classList.add("bloqueado");
            document.getElementById("tab-admin").textContent = "Panel de Operaciones 🔒";

            document.getElementById("tab-cliente").classList.add("bloqueado");
            document.getElementById("tab-cliente").textContent = "Portal de Clientes 🔒";

            document.getElementById("tab-viaticos").classList.add("bloqueado");
            document.getElementById("tab-viaticos").textContent = "Cálculo de Viáticos 🔒";

            document.getElementById("nombreCliente").value = "Empresa Logística Austral Ltda.";
            document.getElementById("rutCliente").value = "76.123.456-7";

            lanzarNotificaciónSencilla("Sesión cerrada correctamente.", "info");
            alternarModuloDirecto("login-view");
        }

        function cambiarModo() {
            document.body.classList.toggle("oscuro");
        }

        // ==========================================================================
        // LÓGICA PORTAL DE CLIENTES (Teammate - script.js)
        // ==========================================================================
        function mostrarSubseccionCliente(nombreSeccion) {
            let secciones = document.getElementsByClassName("seccion-cliente");
            for (let i = 0; i < secciones.length; i++) {
                secciones[i].classList.add("oculto");
            }
            document.getElementById("sub-" + nombreSeccion).classList.remove("oculto");
        }

        function solicitarRetiro() {
            lanzarNotificaciónSencilla("Solicitud de retiro registrada correctamente en los servidores de la central.", "success");
        }

        // ==========================================================================
        // LÓGICA DE GEOLOCALIZACIÓN GPS SATELITAL (geolocalizacion.html)
        // ==========================================================================
        function obtenerUbicacionReal() {
            let divMensaje = document.getElementById("mensajeGPS");
            let divMapa = document.getElementById("mapaContenedorOSM");

            if (navigator.geolocation) {
                divMensaje.innerHTML = "Consultando satélites GPS...";
                navigator.geolocation.getCurrentPosition(mostrarPosicionGPS, mostrarErrorGPS);
            } else {
                divMensaje.innerHTML = "Error: Este navegador no tiene soporte de geolocalización.";
            }
        }

        function mostrarPosicionGPS(posicion) {
            let latitud = posicion.coords.latitude;
            let longitud = posicion.coords.longitude;
            let divMensaje = document.getElementById("mensajeGPS");
            let divMapa = document.getElementById("mapaContenedorOSM");

            divMensaje.innerHTML = "Ubicación detectada -> Latitud: " + latitud.toFixed(4) + " | Longitud: " + longitud.toFixed(4);

            let urlMapa = "https://www.openstreetmap.org/export/embed.html?bbox=" + 
                          (longitud - 0.01) + "%2C" + (latitud - 0.01) + "%2C" + 
                          (longitud + 0.01) + "%2C" + (latitud + 0.01) + 
                          "&layer=mapnik&marker=" + latitud + "%2C" + longitud;

            divMapa.innerHTML = "<iframe width='100%' height='100%' frameborder='0' src='" + urlMapa + "'></iframe>";
            lanzarNotificaciónSencilla("Mapa satelital de OpenStreetMap renderizado con éxito.", "success");
        }

        function mostrarErrorGPS(error) {
            let divMensaje = document.getElementById("mensajeGPS");
            if (error.code == 1) {
                divMensaje.innerHTML = "Error: El usuario denegó los permisos de geolocalización.";
            } else if (error.code == 2) {
                divMensaje.innerHTML = "Error: Señal GPS no disponible en este sector.";
            } else if (error.code == 3) {
                divMensaje.innerHTML = "Error: Tiempo de espera agotado al consultar la red GPS.";
            } else {
                divMensaje.innerHTML = "Error desconocido de geolocalización.";
            }
            lanzarNotificaciónSencilla("Error al obtener posición. Verifique los permisos del navegador.", "warning");
        }

        // ==========================================================================
        // LÓGICA DE ASIGNACIÓN INTELIGENTE (RF01)
        // ==========================================================================
        function limpiarAsignacion() {
            document.getElementById("resultadoAsignacion").classList.add("oculto");
            
            let destino = document.getElementById("destinoSelector").value;
            let inputDir = document.getElementById("direccionDestino");
            if (destino === "punta_arenas") {
                inputDir.value = "Ruta 9 Sur, Km 15 - Centro Logístico Punta Arenas";
            } else if (destino === "biobio") {
                inputDir.value = "Pasaje Los Aromos 1234, Concepción";
            } else {
                inputDir.value = "Calle Manuel Rodríguez 982, Osorno";
            }
        }

        function procesarAsignacionAutomatica() {
            document.getElementById("resultadoAsignacion").classList.add("oculto");
            document.getElementById("loaderIA").classList.remove("oculto");

            setTimeout(function() {
                document.getElementById("loaderIA").classList.add("oculto");

                let destino = document.getElementById("destinoSelector").value;
                let tipoCarga = document.getElementById("tipoCargaSelector").value;

                let cond = document.getElementById("resConductor");
                let lic = document.getElementById("resLicencia");
                let camion = document.getElementById("resCamion");
                let eta = document.getElementById("resETA");

                let fechaETA = new Date();
                let conductorAsignado = "";
                let camionAsignado = "";

                if (destino === "punta_arenas") {
                    conductorAsignado = "Carlos Mendoza";
                    camionAsignado = (tipoCarga === "frio") ? "Camión Refrigerado" : "Camión Carga Pesada";
                    
                    cond.textContent = "Carlos Mendoza";
                    lic.textContent = "A5 Profesional";
                    lic.className = "badge badge-azul";
                    camion.textContent = camionAsignado;
                    
                    if (estadoPlataforma.alertaActual === "riesgo") {
                        fechaETA.setDate(fechaETA.getDate() + 7);
                        eta.innerHTML = fechaETA.toLocaleDateString() + " <span style='color: #d9534f;'>(Demorado por Alerta de Riesgo)</span>";
                    } else if (estadoPlataforma.alertaActual === "demora") {
                        fechaETA.setDate(fechaETA.getDate() + 5);
                        eta.innerHTML = fechaETA.toLocaleDateString() + " <span style='color: #f0ad4e;'>(Demorado por Neblina)</span>";
                    } else {
                        fechaETA.setDate(fechaETA.getDate() + 4);
                        eta.textContent = fechaETA.toLocaleDateString() + " (ETA Estándar: 4 días)";
                    }
                } else if (destino === "biobio") {
                    conductorAsignado = "Juan Pérez";
                    camionAsignado = "Camión Carga General";

                    cond.textContent = "Juan Pérez";
                    lic.textContent = "A4 Profesional";
                    lic.className = "badge badge-azul";
                    camion.textContent = camionAsignado;
                    
                    fechaETA.setDate(fechaETA.getDate() + 1);
                    eta.textContent = fechaETA.toLocaleDateString() + " (ETA Estándar: 24 horas)";
                } else {
                    conductorAsignado = "Raúl Torres";
                    camionAsignado = (tipoCarga === "frio") ? "Camión Refrigerado" : "Camión Cerrado Estándar";

                    cond.textContent = "Raúl Torres";
                    lic.textContent = "A5 Profesional";
                    lic.className = "badge badge-azul";
                    camion.textContent = camionAsignado;
                    
                    if (estadoPlataforma.alertaActual === "eventualidad") {
                        fechaETA.setDate(fechaETA.getDate() + 3);
                        eta.innerHTML = fechaETA.toLocaleDateString() + " <span style='color: #0288d1;'>(Demorado por Operación Transbordador)</span>";
                    } else {
                        fechaETA.setDate(fechaETA.getDate() + 2);
                        eta.textContent = fechaETA.toLocaleDateString() + " (ETA Estándar: 2 días)";
                    }
                }

                // Sincronizar Portal del Cliente de forma instantánea
                document.getElementById("cliConductor").textContent = conductorAsignado;
                document.getElementById("cliCamion").textContent = camionAsignado;
                document.getElementById("cliDestino").textContent = document.getElementById("direccionDestino").value;

                document.getElementById("resultadoAsignacion").classList.remove("oculto");
                lanzarNotificaciónSencilla("Algoritmo de Control: Conductor y camión compatible asignados con éxito al despacho.", "success");

            }, 1200); 
        }

        // ==========================================================================
        // LÓGICA DE INTEGRACIÓN METEOROLÓGICA (RF05)
        // ==========================================================================
        function emitirAlertaMeteorologica(tipo) {
            estadoPlataforma.alertaActual = tipo;
            let banner = document.getElementById("bannerAlertaClimatica");
            let textoAlerta = document.getElementById("textoAlertaGlobal");
            let numRetrasos = document.getElementById("numRetrasos");
            let numAlertas = document.getElementById("numAlertasMeteorologicas");

            // Elementos del cliente a actualizar
            let cliAlerta = document.getElementById("cliAlertaMeteo");
            let cliTextoProgreso = document.getElementById("cliEstadoTexto");

            banner.className = "contenedor";

            if (tipo === "riesgo") {
                banner.classList.add("banner-riesgo");
                textoAlerta.innerHTML = "Alerta de Riesgo: Nevadas extremas en Paso Monte Aymond. Desvíos preventivos activos para resguardar la flota.";
                numRetrasos.textContent = "25%";
                numRetrasos.style.color = "#d9534f";
                numAlertas.textContent = "1";

                cliAlerta.className = "badge badge-rojo";
                cliAlerta.textContent = "Advertencia Extrema: Nevadas en Paso Monte Aymond. Tránsito temporalmente interrumpido.";
                cliTextoProgreso.innerHTML = "<span style='color:#c62828;'>Vehículo en zona de acopio por riesgo de nevadas.</span>";

                lanzarNotificaciónSencilla("Alerta climática de riesgo propagada de forma global.", "danger");
            } 
            else if (tipo === "demora") {
                banner.classList.add("banner-demora");
                textoAlerta.innerHTML = "Alerta de Demora: Reducción de velocidad obligatoria por neblina densa en Ruta 5 Sur.";
                numRetrasos.textContent = "12%";
                numRetrasos.style.color = "#f0ad4e";
                numAlertas.textContent = "1";

                cliAlerta.className = "badge badge-amarillo";
                cliAlerta.textContent = "Advertencia de Demora: Neblina densa en Ruta 5. Retrasos moderados estimados.";
                cliTextoProgreso.innerHTML = "<span style='color:#e65100;'>Vehículo transitando bajo velocidad reducida.</span>";

                lanzarNotificaciónSencilla("Alerta de demora inyectada al sistema.", "warning");
            } 
            else if (tipo === "eventualidad") {
                banner.classList.add("banner-eventualidad");
                textoAlerta.innerHTML = "Alerta de Eventualidad: Fuertes vientos en Canal de Chacao. Interrupción temporal de transbordadores marítimos.";
                numRetrasos.textContent = "8%";
                numRetrasos.style.color = "#0288d1";
                numAlertas.textContent = "1";

                cliAlerta.className = "badge badge-azul";
                cliAlerta.textContent = "Eventualidad Logística: Cruce Canal de Chacao demorado por ráfagas de viento.";
                cliTextoProgreso.innerHTML = "<span style='color:#01579b;'>Vehículo en puerto de embarque esperando ventana de transbordo.</span>";

                lanzarNotificaciónSencilla("Alerta de eventualidad de puerto propagada.", "info");
            } 
            else {
                banner.classList.add("oculto");
                numRetrasos.textContent = "0%";
                numRetrasos.style.color = "inherit";
                numAlertas.textContent = "0";

                cliAlerta.className = "badge badge-verde";
                cliAlerta.textContent = "☀️ Rutas despejadas hacia el sur. Sin novedades meteorológicas reportadas.";
                cliTextoProgreso.textContent = "Vehículo asignado y en camino a la zona indicada según parámetros de optimización.";

                lanzarNotificaciónSencilla("Rutas despejadas. Condiciones meteorológicas normales.", "success");
            }

            if (!document.getElementById("resultadoAsignacion").classList.contains("oculto")) {
                procesarAsignacionAutomatica();
            }
        }

        function cerrarBanner() {
            document.getElementById("bannerAlertaClimatica").classList.add("oculto");
        }

        // ==========================================================================
        // LÓGICA DE VIÁTICOS REAL (Teammate - script de calculo viaticos.js)
        // ==========================================================================
        function calcularViaticosDeFormaReal() {
            const km = parseFloat(document.getElementById('kmRuta').value);
            const peajes = parseFloat(document.getElementById('totalPeajes').value);

            if (isNaN(km) || isNaN(peajes) || km < 0 || peajes < 0) {
                lanzarNotificaciónSencilla("Por favor, rellene todos los campos con números válidos mayores a cero.", "warning");
                return;
            }

            const valorPorKm = 250; 
            const costoCombustible = km * valorPorKm;
            const viaticoTotal = costoCombustible + peajes;

            document.getElementById('resCombustible').innerText = costoCombustible.toLocaleString('es-CL');
            document.getElementById('resPeajes').innerText = peajes.toLocaleString('es-CL');
            document.getElementById('resTotal').innerText = viaticoTotal.toLocaleString('es-CL');

            document.getElementById('panelResultadoViaticos').classList.remove('oculto');
            lanzarNotificaciónSencilla("Cálculo de viáticos procesado según tarifas estándar.", "success");
        }

        function autorizarTransferencia() {
            lanzarNotificaciónSencilla("Transferencia de viáticos autorizada de forma segura a la cuenta bancaria del chofer.", "success");
            document.getElementById('panelResultadoViaticos').classList.add('oculto');
            document.getElementById('kmRuta').value = "";
            document.getElementById('totalPeajes').value = "";
        }