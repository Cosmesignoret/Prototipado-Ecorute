// ESTADO GLOBAL DEL AMBIENTE (Control de seguridad del cascarón)
        const estadoPlataforma = {
            sesionIniciada: false,
            nombreEmpresa: "Empresa Logística Austral Ltda.",
            alertaActual: "despejado", // Opciones: 'despejado', 'riesgo', 'demora', 'eventualidad'
            tipoUsuarioRegistrado: 'empresa' // Opciones: 'empresa', 'persona'
        };

        // SISTEMA DE NOTIFICACIONES TOAST (No bloqueantes para la experiencia de usuario)
        function lanzarNotificaciónSencilla(mensaje, tipo = 'info') {
            const toastContainer = document.getElementById("toastContainer");
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

        // LÓGICA DE NAVEGACIÓN Y ACCESO PROTEGIDO
        function alternarModulo(modulo) {
            if (modulo !== "login-view" && !estadoPlataforma.sesionIniciada) {
                lanzarNotificaciónSencilla("Acceso Restringido: Debe iniciar sesión con las credenciales de su empresa.", "warning");
                return;
            }
            alternarModuloDirecto(modulo);
        }

        // Ejecuta el cambio de pantallas ocultando los elementos correspondientes
        function alternarModuloDirecto(modulo) {
            document.getElementById("seccionLogin").classList.add("oculto");
            document.getElementById("seccionRegistro").classList.add("oculto");
            document.getElementById("seccionMenuHub").classList.add("oculto");
            document.getElementById("panelAdminContenedor").classList.add("oculto");

            document.getElementById("tab-login").classList.remove("activo");
            document.getElementById("tab-admin").classList.remove("activo");

            document.getElementById("cambiarRol").value = modulo;

            if (modulo === "login-view") {
                if (estadoPlataforma.sesionIniciada) {
                    document.getElementById("seccionMenuHub").classList.remove("oculto");
                    document.getElementById("tab-login").classList.add("activo");
                    document.getElementById("headerTitulo").textContent = "EcoRoute Portal";
                    document.getElementById("headerSubtitulo").textContent = "Menú de Módulos Autorizados";
                } else {
                    document.getElementById("seccionLogin").classList.remove("oculto");
                    document.getElementById("tab-login").classList.add("activo");
                    document.getElementById("headerTitulo").textContent = "EcoRoute Central";
                    document.getElementById("headerSubtitulo").textContent = "Control de Acceso de Usuarios";
                }
            } 
            else if (modulo === "hub-view") {
                document.getElementById("seccionMenuHub").classList.remove("oculto");
                document.getElementById("headerTitulo").textContent = "EcoRoute Portal";
                document.getElementById("headerSubtitulo").textContent = "Menú de Módulos Autorizados";
            } 
            else if (modulo === "admin-view") {
                document.getElementById("panelAdminContenedor").classList.remove("oculto");
                document.getElementById("tab-admin").classList.add("activo");
                document.getElementById("headerTitulo").textContent = "EcoRoute Central";
                document.getElementById("headerSubtitulo").textContent = "Sistema de Gestión de Flota";
            }
        }

        // Validador secundario para clics en pestañas del menú
        function alternarModuloConSeguridad(modulo) {
            alternarModulo(modulo);
        }

        // Bypass del Modo Administrador superior (Permite saltar el flujo rápido de login)
        function bypassModulo(modulo) {
            if (modulo !== "login-view") {
                desbloquearPlataformaVisualmente("Empresa Logística Austral Ltda.");
            }
            alternarModuloDirecto(modulo);
        }

        // LÓGICA DE REGISTRO INTUITIVO ADAPTATIVO
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
                document.getElementById("regNombre").placeholder = "Ej: Transportes del Biobío Express S.A.";
            } else {
                btnEmpresa.classList.remove("seleccionada");
                btnPersona.classList.add("seleccionada");
                bloqueEmpresa.classList.add("oculto");
                bloquePersona.classList.remove("oculto");
                helpNombre.textContent = "Ingrese su nombre y apellido completo.";
                document.getElementById("regNombre").placeholder = "Ej: Juan Pérez Oyarzún";
            }
        }

        // Control visual del rol
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
                lanzarNotificaciónSencilla("Error: Debe ingresar el Nombre/Razón Social y el RUT para registrarse de forma exitosa.", "danger");
                return;
            }

            // Simulación interactiva exitosa de guardado de datos
            let tipoMensaje = (estadoPlataforma.tipoUsuarioRegistrado === 'empresa') ? "Empresa" : "Usuario";
            lanzarNotificaciónSencilla(`Registro de ${tipoMensaje} completado con éxito. Sesión pre-completada.`, "success");
            
            // Auto-completamos los inputs para facilitar la UX
            document.getElementById("nombreCliente").value = nombre;
            document.getElementById("rutCliente").value = rut;

            mostrarRegistro(false);
        }

        // Autenticación de Entrada (Acepta cualquier valor)
        function ingresarUsuario() {
            let nombre = document.getElementById("nombreCliente").value;
            let rut = document.getElementById("rutCliente").value;

            if (nombre === "" || rut === "") {
                lanzarNotificaciónSencilla("Por favor, ingrese sus datos de acceso para autenticar.", "warning");
                return;
            }

            desbloquearPlataformaVisualmente(nombre);
            alternarModuloDirecto("hub-view");
            lanzarNotificaciónSencilla("Sesión iniciada con éxito. Plataforma de operaciones desbloqueada.", "success");
        }

        // Remueve bloqueos visuales al entrar
        function desbloquearPlataformaVisualmente(usuario) {
            estadoPlataforma.sesionIniciada = true;
            estadoPlataforma.nombreEmpresa = usuario;

            document.getElementById("bienvenidaHub").textContent = "Bienvenido, " + usuario;

            let tabAdmin = document.getElementById("tab-admin");
            tabAdmin.classList.remove("bloqueado");
            tabAdmin.textContent = "📊 Panel de Operaciones";
        }

        // Restablece estado del login corporativo
        function cerrarSesion() {
            estadoPlataforma.sesionIniciada = false;
            estadoPlataforma.nombreSocio = "";

            let tabAdmin = document.getElementById("tab-admin");
            tabAdmin.classList.add("bloqueado");
            tabAdmin.textContent = "📊 Panel de Operaciones 🔒";

            document.getElementById("nombreCliente").value = "Empresa Logística Austral Ltda.";
            document.getElementById("rutCliente").value = "76.123.456-7";

            lanzarNotificaciónSencilla("Sesión cerrada correctamente.", "info");
            alternarModuloDirecto("login-view");
        }

        function cambiarModo() {
            document.body.classList.toggle("oscuro");
        }

        // Limpia el resultado previo de asignación cuando cambia un parámetro de origen/destino
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

        // Procesamiento de asignación inteligente y autocompletado de datos básicos
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

                // Autocompletado inteligente basado en requerimientos básicos del destino
                let etaTexto = "";

                if (destino === "punta_arenas") {
                    cond.textContent = "Carlos Mendoza";
                    lic.textContent = "A5 Profesional";
                    lic.className = "badge badge-azul";
                    camion.textContent = (tipoCarga === "frio") ? "Camión Refrigerado" : "Camión Carga Pesada";
                    
                    // Modificación de tiempos de llegada según la alerta activa
                    if (estadoPlataforma.alertaActual === "riesgo") {
                        fechaETA.setDate(fechaETA.getDate() + 7);
                        eta.innerHTML = fechaETA.toLocaleDateString() + " <span style='color: #d9534f;'>(Demorado por Alerta de Riesgo)</span>";
                    } else if (estadoPlataforma.alertaActual === "demora") {
                        fechaETA.setDate(fechaETA.getDate() + 5);
                        eta.innerHTML = fechaETA.toLocaleDateString() + " <span style='color: #f0ad4e;'>(Demorado por Neblina)</span>";
                    } else {
                        fechaETA.setDate(fechaETA.getDate() + 4);
                        etaTexto = fechaETA.toLocaleDateString() + " (ETA Estándar: 4 días)";
                        eta.textContent = etaTexto;
                    }
                } else if (destino === "biobio") {
                    cond.textContent = "Juan Pérez";
                    lic.textContent = "A4 Profesional";
                    lic.className = "badge badge-azul";
                    camion.textContent = "Camión Carga General";
                    
                    fechaETA.setDate(fechaETA.getDate() + 1);
                    etaTexto = fechaETA.toLocaleDateString() + " (ETA Estándar: 24 horas)";
                    eta.textContent = etaTexto;
                } else {
                    cond.textContent = "Raúl Torres";
                    lic.textContent = "A5 Profesional";
                    lic.className = "badge badge-azul";
                    camion.textContent = (tipoCarga === "frio") ? "Camión Refrigerado" : "Camión Cerrado Estándar";
                    
                    if (estadoPlataforma.alertaActual === "eventualidad") {
                        fechaETA.setDate(fechaETA.getDate() + 3);
                        eta.innerHTML = fechaETA.toLocaleDateString() + " <span style='color: #0288d1;'>(Demorado por Operación Transbordador)</span>";
                    } else {
                        fechaETA.setDate(fechaETA.getDate() + 2);
                        etaTexto = fechaETA.toLocaleDateString() + " (ETA Estándar: 2 días)";
                        eta.textContent = etaTexto;
                    }
                }

                document.getElementById("resultadoAsignacion").classList.remove("oculto");
                lanzarNotificaciónSencilla("Algoritmo de Control: Conductor y vehículo compatible asignados con éxito.", "success");

            }, 1200); 
        }

        // LÓGICA DE INTEGRACIÓN METEOROLÓGICA (Riesgos, Demoras y Eventualidades)
        function emitirAlertaMeteorologica(tipo) {
            estadoPlataforma.alertaActual = tipo;
            let banner = document.getElementById("bannerAlertaClimatica");
            let textoAlerta = document.getElementById("textoAlertaGlobal");
            let numRetrasos = document.getElementById("numRetrasos");
            let numAlertas = document.getElementById("numAlertasMeteorologicas");

            // Limpiamos estilos de clases previos
            banner.className = "contenedor";

            if (tipo === "riesgo") {
                // RIESGO: Situación crítica extrema (Nevadas fuertes Paso Monte Aymond)
                banner.classList.add("banner-riesgo");
                textoAlerta.innerHTML = "⚠️ ALERTA DE RIESGO: Nevadas extremas en Paso Monte Aymond. Desvíos preventivos activos para resguardar la flota.";
                numRetrasos.textContent = "25%";
                numRetrasos.style.color = "#d9534f";
                numAlertas.textContent = "1";
                lanzarNotificaciónSencilla("Alerta climática de RIESGO emitida. Tasa de retrasos recalculada al 25%.", "danger");
            } 
            else if (tipo === "demora") {
                // DEMORA: Conditions adversas parciales (Lluvia o Neblina densa Ruta 5)
                banner.classList.add("banner-demora");
                textoAlerta.innerHTML = "⏳ ALERTA DE DEMORA: Reducción de velocidad obligatoria por neblina densa en Ruta 5 Sur.";
                numRetrasos.textContent = "12%";
                numRetrasos.style.color = "#f0ad4e";
                numAlertas.textContent = "1";
                lanzarNotificaciónSencilla("Alerta climática de DEMORA emitida. Tránsito con retraso parcial.", "warning");
            } 
            else if (tipo === "eventualidad") {
                // EVENTUALIDAD: Problemas operacionales indirectos (Vientos en el Canal de Chacao que demoran transbordadores)
                banner.classList.add("banner-eventualidad");
                textoAlerta.innerHTML = "⚓ ALERTA DE EVENTUALIDAD: Fuertes vientos en Canal de Chacao. Interrupción temporal de transbordadores marítimos.";
                numRetrasos.textContent = "8%";
                numRetrasos.style.color = "#0288d1";
                numAlertas.textContent = "1";
                lanzarNotificaciónSencilla("Alerta de EVENTUALIDAD emitida. Cruce marítimo afectado temporalmente.", "info");
            } 
            else {
                // DESPEJADO: Todo limpio
                banner.classList.add("oculto");
                numRetrasos.textContent = "0%";
                numRetrasos.style.color = "inherit";
                numAlertas.textContent = "0";
                lanzarNotificaciónSencilla("Rutas despejadas. Condiciones climatológicas estándar restablecidas.", "success");
            }

            // Recalcular automáticamente si la tabla de asignación ya es visible
            if (!document.getElementById("resultadoAsignacion").classList.contains("oculto")) {
                procesarAsignacionAutomatica();
            }
        }

        function cerrarBanner() {
            document.getElementById("bannerAlertaClimatica").classList.add("oculto");
        }