const estadoPlataforma = {
            sesionIniciada: false,
            nombreEmpresa: "Empresa Logística Austral Ltda.",
            alertaActual: "despejado",
            tipoUsuarioRegistrado: "empresa"
        };

        // SISTEMA DE NOTIFICACIONES TOAST (Seguro ante cualquier evento y no intrusivo)
        function lanzarNotificaciónSencilla(mensaje, tipo = 'info') {
            const toastContainer = document.getElementById("toastContainer");
            if (!toastContainer) return;

            const toast = document.createElement("div");
            toast.className = `toast p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xl border-l-4 bg-slate-900 text-white animate-slide-in`;
            
            let colorBorde = "border-slate-500";
            let icono = "🔔";

            if (tipo === "success") {
                colorBorde = "border-emerald-500";
                icono = "✅";
            } else if (tipo === "warning") {
                colorBorde = "border-amber-500";
                icono = "⚠️";
            } else if (tipo === "danger") {
                colorBorde = "border-rose-500";
                icono = "❄️";
            }

            toast.classList.add(colorBorde);

            toast.innerHTML = `
                <div class="flex items-center gap-2.5">
                    <span class="text-base">${icono}</span>
                    <span>${mensaje}</span>
                </div>
                <button onclick="this.parentElement.remove()" class="text-white hover:opacity-75 focus:outline-none ml-4 text-base font-bold">&times;</button>
            `;

            toastContainer.appendChild(toast);

            // Cierre automático del Toast
            setTimeout(() => {
                toast.classList.add("transition-all", "duration-300", "opacity-0", "translate-y-2");
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        }

        // CONTROLADOR DE ACCESOS Y REDIRECCIÓN DE PESTAÑAS
        function alternarModulo(modulo) {
            if (modulo !== "login-view" && !estadoPlataforma.sesionIniciada) {
                lanzarNotificaciónSencilla("Acceso Restringido: Debe iniciar sesión con las credenciales de su empresa.", "warning");
                return;
            }
            alternarModuloDirecto(modulo);
        }

        // INTERRUPTOR DE PESTAÑAS (Fácil de extender, seguro contra referencias nulas)
        function alternarModuloDirecto(modulo) {
            const vistas = {
                "login-view": ["seccionLogin"],
                "hub-view": ["seccionMenuHub"],
                "admin-view": ["panelAdminContenedor"],
                "cliente-view": ["portalClienteContenedor"],
                "viaticos-view": ["panelViaticosContenedor"]
            };

            // Ocultar todas las secciones
            Object.values(vistas).forEach(vista => {
                const elem = document.getElementById(vista[0]);
                if (elem) elem.classList.add("hidden");
            });

            // Mostrar sección activa
            if (vistas[modulo]) {
                const elemVisible = document.getElementById(vistas[modulo][0]);
                if (elemVisible) elemVisible.classList.remove("hidden");
            } else if (modulo === "hub-view") {
                const hub = document.getElementById("seccionMenuHub");
                if (hub) hub.classList.remove("hidden");
            }

            // Sincronizar clases en botones de navegación principal
            const tabs = {
                "login-view": "tab-login",
                "admin-view": "tab-admin",
                "cliente-view": "tab-cliente",
                "viaticos-view": "tab-viaticos"
            };

            Object.values(tabs).forEach(tabId => {
                const elTab = document.getElementById(tabId);
                if (elTab) {
                    elTab.classList.remove("bg-emerald-700", "text-white");
                    elTab.classList.add("text-emerald-300", "hover:text-white", "hover:bg-emerald-800");
                }
            });

            const elTabActivo = document.getElementById(tabs[modulo]);
            if (elTabActivo) {
                elTabActivo.classList.remove("text-emerald-300", "hover:text-white", "hover:bg-emerald-800");
                elTabActivo.classList.add("bg-emerald-700", "text-white");
            }

            // Actualizar selector del Modo Administrador
            const cambiarRol = document.getElementById("cambiarRol");
            if (cambiarRol) cambiarRol.value = modulo;

            // Actualizar cabecera semántica
            const headerTitulo = document.getElementById("headerTitulo");
            const headerSubtitulo = document.getElementById("headerSubtitulo");

            if (headerTitulo && headerSubtitulo) {
                if (modulo === "login-view") {
                    headerTitulo.textContent = "EcoRoute Central";
                    headerSubtitulo.textContent = "Plataforma Logística Inteligente y Gestión Ambiental";
                } else if (modulo === "hub-view") {
                    headerTitulo.textContent = "Panel General de Navegación";
                    headerSubtitulo.textContent = "Módulos de Coordinación de Carga Desbloqueados";
                } else if (modulo === "admin-view") {
                    headerTitulo.textContent = "Central de Operaciones de Despacho";
                    headerSubtitulo.textContent = "Panel de Control de Flota y Gestión Satelital del Clima";
                } else if (modulo === "cliente-view") {
                    headerTitulo.textContent = "Portal del Socio Comercial";
                    headerSubtitulo.textContent = "Seguimiento en Ruta y Transparencia Logística";
                } else if (modulo === "viaticos-view") {
                    headerTitulo.textContent = "Control Financiero de Viáticos";
                    headerSubtitulo.textContent = "Rendición de Combustible y Peajes de Trayectos";
                }
            }
        }

        // Adaptación del control de seguridad para las pestañas superiores
        function alternarModuloConSeguridad(modulo) {
            alternarModulo(modulo);
        }

        // BYPASS DIRECTO (Consola del Profesor): Desbloquea los módulos en el acto para evaluación
        function bypassModulo(modulo) {
            desbloquearPlataformaVisualmente("Empresa Logística Austral Ltda.");
            alternarModuloDirecto(modulo);
        }

        // MOSTRAR/OCULTAR MÓDULO DE REGISTRO
        function mostrarRegistro(mostrar) {
            const login = document.getElementById("seccionLogin");
            const registro = document.getElementById("seccionRegistro");
            if (login && registro) {
                if (mostrar) {
                    login.classList.add("hidden");
                    registro.classList.remove("hidden");
                } else {
                    registro.classList.add("hidden");
                    login.classList.remove("hidden");
                }
            }
        }

        // REGISTRO INTUITIVO: Seleccionar Tipo de Cuenta (Filtro por rol v/s empresa)
        function seleccionarTipoRegistro(tipo) {
            estadoPlataforma.tipoUsuarioRegistrado = tipo;
            const btnEmpresa = document.getElementById("btnTipoEmpresa");
            const btnPersona = document.getElementById("btnTipoPersona");
            const bloqueEmpresa = document.getElementById("bloqueEmpresa");
            const bloquePersona = document.getElementById("bloquePersona");
            const helpNombre = document.getElementById("helpNombre");

            if (tipo === 'empresa') {
                if (btnEmpresa) btnEmpresa.className = "py-3 px-4 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold text-xs sm:text-sm transition-all";
                if (btnPersona) btnPersona.className = "py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-semibold text-xs sm:text-sm transition-all";
                if (bloqueEmpresa) bloqueEmpresa.classList.remove("hidden");
                if (bloquePersona) bloquePersona.classList.add("hidden");
                if (helpNombre) helpNombre.textContent = "Ingrese el nombre oficial de su compañía.";
            } else {
                if (btnEmpresa) btnEmpresa.className = "py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-semibold text-xs sm:text-sm transition-all";
                if (btnPersona) btnPersona.className = "py-3 px-4 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold text-xs sm:text-sm transition-all";
                if (bloqueEmpresa) bloqueEmpresa.classList.add("hidden");
                if (bloquePersona) bloquePersona.classList.remove("hidden");
                if (helpNombre) helpNombre.textContent = "Ingrese su nombre y apellido completo.";
            }
        }

        // REGISTRO DE PERSONA: Ocultar o mostrar combo de licencia si no es Conductor
        function toggleLicenciaHelp(rol) {
            const campoLicencia = document.getElementById("campoLicencia");
            if (campoLicencia) {
                if (rol === 'conductor') {
                    campoLicencia.classList.remove("hidden");
                } else {
                    campoLicencia.classList.add("hidden");
                }
            }
        }

        // GUARDADO DE REGISTRO SIMULADO
        function guardarRegistroSimulado() {
            const regNombre = document.getElementById("regNombre");
            const regRUT = document.getElementById("regRUT");
            let nombre = regNombre ? regNombre.value : "";
            let rut = regRUT ? regRUT.value : "";

            if (nombre === "" || rut === "") {
                lanzarNotificaciónSencilla("Error: Debe ingresar el Nombre/Razón Social y el RUT para registrarse de forma exitosa.", "danger");
                return;
            }

            let tipoMensaje = (estadoPlataforma.tipoUsuarioRegistrado === 'empresa') ? "Empresa" : "Usuario";
            lanzarNotificaciónSencilla(`Registro de ${tipoMensaje} completado con éxito. Sesión pre-completada.`, "success");
            
            const nombreCliente = document.getElementById("nombreCliente");
            const rutCliente = document.getElementById("rutCliente");
            if (nombreCliente) nombreCliente.value = nombre;
            if (rutCliente) rutCliente.value = rut;

            mostrarRegistro(false);
        }

        // LOGIN DE USUARIO (Acceso Real)
        function ingresarUsuario() {
            const nombreCliente = document.getElementById("nombreCliente");
            const rutCliente = document.getElementById("rutCliente");
            let nombre = nombreCliente ? nombreCliente.value : "";
            let rut = rutCliente ? rutCliente.value : "";

            if (nombre === "" || rut === "") {
                lanzarNotificaciónSencilla("Por favor, ingrese sus datos de acceso para autenticar.", "warning");
                return;
            }

            desbloquearPlataformaVisualmente(nombre);
            alternarModuloDirecto("hub-view");
            lanzarNotificaciónSencilla("Sesión iniciada con éxito. Plataforma de operaciones desbloqueada.", "success");
        }

        // DESBLOQUEO VISUAL: Activa y remueve los candados de todos los módulos
        function desbloquearPlataformaVisualmente(usuario) {
            estadoPlataforma.sesionIniciada = true;
            estadoPlataforma.nombreEmpresa = usuario;

            const bienvenidaHub = document.getElementById("bienvenidaHub");
            const bienvenidaCliente = document.getElementById("bienvenidaCliente");
            if (bienvenidaHub) bienvenidaHub.textContent = "Bienvenido, " + usuario;
            if (bienvenidaCliente) bienvenidaCliente.textContent = "Bienvenido/a, " + usuario;

            const tabAdmin = document.getElementById("tab-admin");
            const tabCliente = document.getElementById("tab-cliente");
            const tabViaticos = document.getElementById("tab-viaticos");

            if (tabAdmin) {
                tabAdmin.classList.remove("opacity-60");
                tabAdmin.textContent = "Panel Operativo";
            }
            if (tabCliente) {
                tabCliente.classList.remove("opacity-60");
                tabCliente.textContent = "Portal de Clientes";
            }
            if (tabViaticos) {
                tabViaticos.classList.remove("opacity-60");
                tabViaticos.textContent = "Control de Viáticos";
            }

            const fechaActualCliente = document.getElementById("fechaActualCliente");
            if (fechaActualCliente) {
                let fecha = new Date();
                fechaActualCliente.textContent = fecha.toLocaleDateString();
            }
        }

        // CERRAR SESIÓN
        function cerrarSesion() {
            estadoPlataforma.sesionIniciada = false;

            const tabAdmin = document.getElementById("tab-admin");
            const tabCliente = document.getElementById("tab-cliente");
            const tabViaticos = document.getElementById("tab-viaticos");

            if (tabAdmin) {
                tabAdmin.classList.add("opacity-60");
                tabAdmin.textContent = "Panel Operativo 🔒";
            }
            if (tabCliente) {
                tabCliente.classList.add("opacity-60");
                tabCliente.textContent = "Portal de Clientes 🔒";
            }
            if (tabViaticos) {
                tabViaticos.classList.add("opacity-60");
                tabViaticos.textContent = "Control de Viáticos 🔒";
            }

            const nombreCliente = document.getElementById("nombreCliente");
            const rutCliente = document.getElementById("rutCliente");
            if (nombreCliente) nombreCliente.value = "Empresa Logística Austral Ltda.";
            if (rutCliente) rutCliente.value = "76.123.456-7";

            lanzarNotificaciónSencilla("Sesión cerrada correctamente.", "info");
            alternarModuloDirecto("login-view");
        }

        // MODO OSCURO GLOBAL
        function cambiarModo() {
            document.body.classList.toggle("bg-slate-900");
            document.body.classList.toggle("text-slate-100");
            document.body.classList.toggle("bg-slate-50");
            document.body.classList.toggle("text-slate-800");
        }

        // ==========================================================================
        // LÓGICA DE ASIGNACIÓN INTELIGENTE (RF01)
        // ==========================================================================
        function limpiarAsignacion() {
            const resultadoAsignacion = document.getElementById("resultadoAsignacion");
            if (resultadoAsignacion) resultadoAsignacion.classList.add("hidden");
            
            let destino = document.getElementById("destinoSelector") ? document.getElementById("destinoSelector").value : "punta_arenas";
            let inputDir = document.getElementById("direccionDestino");
            if (inputDir) {
                if (destino === "punta_arenas") {
                    inputDir.value = "Ruta 9 Sur, Km 15 - Centro Logístico Punta Arenas";
                } else if (destino === "biobio") {
                    inputDir.value = "Pasaje Los Aromos 1234, Concepción";
                } else {
                    inputDir.value = "Calle Manuel Rodríguez 982, Osorno";
                }
            }
        }

        // Asistente para procesar fletes y predecir ETA según Clima
        function processAsignacionLocalHelper(destino, tipoCarga, cond, lic, camion, eta, fechaETA) {
            let conductorAsignado = "";
            let camionAsignado = "";

            if (destino === "punta_arenas") {
                conductorAsignado = "Carlos Mendoza";
                camionAsignado = (tipoCarga === "frio") ? "Camión Refrigerado" : "Camión Carga Pesada";
                
                if (cond) cond.textContent = "Carlos Mendoza";
                if (lic) {
                    lic.textContent = "A5 Profesional";
                    lic.className = "ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700";
                }
                if (camion) camion.textContent = camionAsignado;
                
                if (eta) {
                    if (estadoPlataforma.alertaActual === "riesgo") {
                        fechaETA.setDate(fechaETA.getDate() + 7);
                        eta.innerHTML = `${fechaETA.toLocaleDateString()} <span class="text-rose-600 font-extrabold text-[11px] block sm:inline sm:ml-2">(Demorado por Alerta de Riesgo Climático)</span>`;
                    } else if (estadoPlataforma.alertaActual === "demora") {
                        fechaETA.setDate(fechaETA.getDate() + 5);
                        eta.innerHTML = `${fechaETA.toLocaleDateString()} <span class="text-amber-600 font-extrabold text-[11px] block sm:inline sm:ml-2">(Retraso Moderado por Neblina)</span>`;
                    } else {
                        fechaETA.setDate(fechaETA.getDate() + 4);
                        eta.textContent = `${fechaETA.toLocaleDateString()} (ETA Estándar: 4 días)`;
                    }
                }
            } else if (destino === "biobio") {
                conductorAsignado = "Juan Pérez";
                camionAsignado = "Camión Carga General";

                if (cond) cond.textContent = "Juan Pérez";
                if (lic) {
                    lic.textContent = "A4 Profesional";
                    lic.className = "ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700";
                }
                if (camion) camion.textContent = camionAsignado;
                
                fechaETA.setDate(fechaETA.getDate() + 1);
                if (eta) eta.textContent = `${fechaETA.toLocaleDateString()} (ETA Estándar: 24 horas)`;
            } else {
                conductorAsignado = "Raúl Torres";
                camionAsignado = (tipoCarga === "frio") ? "Camión Refrigerado" : "Camión Cerrado Estándar";

                if (cond) cond.textContent = "Raúl Torres";
                if (lic) {
                    lic.textContent = "A5 Profesional";
                    lic.className = "ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700";
                }
                if (camion) camion.textContent = camionAsignado;
                
                if (eta) {
                    if (estadoPlataforma.alertaActual === "eventualidad") {
                        fechaETA.setDate(fechaETA.getDate() + 3);
                        eta.innerHTML = `${fechaETA.toLocaleDateString()} <span class="text-sky-600 font-extrabold text-[11px] block sm:inline sm:ml-2">(Demora por Canal/Transbordador)</span>`;
                    } else {
                        fechaETA.setDate(fechaETA.getDate() + 2);
                        eta.textContent = `${fechaETA.toLocaleDateString()} (ETA Estándar: 2 días)`;
                    }
                }
            }
            return { conductorAsignado, camionAsignado };
        }

        // Ejecutar Algoritmo Asíncrono de IA
        function procesarAsignacionAutomatica() {
            const resultadoAsignacion = document.getElementById("resultadoAsignacion");
            const loaderIA = document.getElementById("loaderIA");
            
            if (resultadoAsignacion) resultadoAsignacion.classList.add("hidden");
            if (loaderIA) loaderIA.classList.remove("hidden");

            setTimeout(function() {
                if (loaderIA) loaderIA.classList.add("hidden");

                let destino = document.getElementById("destinoSelector") ? document.getElementById("destinoSelector").value : "punta_arenas";
                let tipoCarga = document.getElementById("tipoCargaSelector") ? document.getElementById("tipoCargaSelector").value : "general";

                let cond = document.getElementById("resConductor");
                let lic = document.getElementById("resLicencia");
                let camion = document.getElementById("resCamion");
                let eta = document.getElementById("resETA");

                let fechaETA = new Date();
                const res = processAsignacionLocalHelper(destino, tipoCarga, cond, lic, camion, eta, fechaETA);

                // Sincronizar de forma inmediata con el Portal de Clientes
                const cliConductor = document.getElementById("cliConductor");
                const cliCamion = document.getElementById("cliCamion");
                const cliDestino = document.getElementById("cliDestino");
                const direccionDestino = document.getElementById("direccionDestino");

                if (cliConductor) cliConductor.textContent = res.conductorAsignado;
                if (cliCamion) cliCamion.textContent = res.camionAsignado;
                if (cliDestino && direccionDestino) cliDestino.textContent = direccionDestino.value;

                if (resultadoAsignacion) resultadoAsignacion.classList.remove("hidden");
                lanzarNotificaciónSencilla("Algoritmo de Control: Recursos óptimos asignados con éxito al despacho.", "success");

            }, 1200); 
        }

        // ==========================================================================
        // LÓGICA DE INTEGRACIÓN CLIMÁTICA GLOBAL (RF05)
        // ==========================================================================
        function emitirAlertaMeteorologica(tipo) {
            estadoPlataforma.alertaActual = tipo;
            let banner = document.getElementById("bannerAlertaClimatica");
            let bannerEstilos = document.getElementById("bannerEstilos");
            let textoAlerta = document.getElementById("textoAlertaGlobal");
            let iconoAlerta = document.getElementById("iconoAlertaGlobal");
            let numRetrasos = document.getElementById("numRetrasos");
            let numAlertas = document.getElementById("numAlertasMeteorologicas");

            // Elementos correspondientes del portal de clientes
            let cliAlerta = document.getElementById("cliAlertaMeteo");
            let cliTextoProgreso = document.getElementById("cliEstadoTexto");

            if (banner) banner.classList.remove("hidden");

            if (tipo === "riesgo") {
                if (bannerEstilos) bannerEstilos.className = "max-w-7xl mx-auto my-3 mx-4 sm:mx-6 lg:mx-8 rounded-xl p-4 flex justify-between items-center shadow-lg bg-rose-50 border-l-6 border-rose-600 text-rose-800 pulse-critical";
                if (textoAlerta) textoAlerta.innerHTML = "<strong>Alerta de Riesgo Crítico:</strong> Fuertes nevadas en Paso Monte Aymond. Desvíos preventivos activos.";
                if (iconoAlerta) iconoAlerta.textContent = "❄️";
                if (numRetrasos) {
                    numRetrasos.textContent = "25%";
                    numRetrasos.className = "text-3xl font-extrabold block text-rose-400";
                }
                if (numAlertas) numAlertas.textContent = "1";

                if (cliAlerta) {
                    cliAlerta.className = "p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3";
                    cliAlerta.innerHTML = "<span>⚠️</span> <span>Advertencia Extrema: Nevadas en Paso Monte Aymond. Tránsito temporalmente interrumpido por seguridad.</span>";
                }
                if (cliTextoProgreso) cliTextoProgreso.innerHTML = "<span class='text-rose-600 font-extrabold'>Vehículo retenido de forma preventiva en zona de acopio por tormenta de nieve.</span>";

                lanzarNotificaciónSencilla("Alerta de Riesgo emitida a nivel global de forma inmediata.", "danger");
            } 
            else if (tipo === "demora") {
                if (bannerEstilos) bannerEstilos.className = "max-w-7xl mx-auto my-3 mx-4 sm:mx-6 lg:mx-8 rounded-xl p-4 flex justify-between items-center shadow-lg bg-amber-50 border-l-6 border-amber-500 text-amber-800";
                if (textoAlerta) textoAlerta.innerHTML = "<strong>Alerta de Demora Vial:</strong> Reducción obligatoria de velocidad por neblina densa en Ruta 5 Sur.";
                if (iconoAlerta) iconoAlerta.textContent = "🌫️";
                if (numRetrasos) {
                    numRetrasos.textContent = "12%";
                    numRetrasos.className = "text-3xl font-extrabold block text-amber-400";
                }
                if (numAlertas) numAlertas.textContent = "1";

                if (cliAlerta) {
                    cliAlerta.className = "p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3";
                    cliAlerta.innerHTML = "<span>🌫️</span> <span>Precaución: Tránsito con velocidad reducida en Ruta 5 Sur debido a neblina.</span>";
                }
                if (cliTextoProgreso) cliTextoProgreso.innerHTML = "<span class='text-amber-600 font-extrabold'>El vehículo transita a velocidad reducida según la norma de seguridad EcoRoute.</span>";

                lanzarNotificaciónSencilla("Alerta climática de demora inyectada al sistema.", "warning");
            } 
            else if (tipo === "eventualidad") {
                if (bannerEstilos) bannerEstilos.className = "max-w-7xl mx-auto my-3 mx-4 sm:mx-6 lg:mx-8 rounded-xl p-4 flex justify-between items-center shadow-lg bg-sky-50 border-l-6 border-sky-500 text-sky-800";
                if (textoAlerta) textoAlerta.innerHTML = "<strong>Alerta de Puerto / Canal:</strong> Fuertes ráfagas de viento en Canal de Chacao interrumpen transbordadores temporales.";
                if (iconoAlerta) iconoAlerta.textContent = "⚓";
                if (numRetrasos) {
                    numRetrasos.textContent = "8%";
                    numRetrasos.className = "text-3xl font-extrabold block text-sky-400";
                }
                if (numAlertas) numAlertas.textContent = "1";

                if (cliAlerta) {
                    cliAlerta.className = "p-4 bg-sky-50 border border-sky-200 text-sky-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3";
                    cliAlerta.innerHTML = "<span>⚓</span> <span>Embarque demorado: Operación de transbordadores en Canal de Chacao sujeta a viento.</span>";
                }
                if (cliTextoProgreso) cliTextoProgreso.innerHTML = "<span class='text-sky-600 font-extrabold'>Camión esperando ventana de cruce seguro en puerto marítimo.</span>";

                lanzarNotificaciónSencilla("Alerta de eventualidad meteorológica en puerto consolidada.", "info");
            } 
            else {
                if (banner) banner.classList.add("hidden");
                if (numRetrasos) {
                    numRetrasos.textContent = "0%";
                    numRetrasos.className = "text-3xl font-extrabold block text-white";
                }
                if (numAlertas) numAlertas.textContent = "0";

                if (cliAlerta) {
                    cliAlerta.className = "p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3";
                    cliAlerta.innerHTML = "<span>☀️</span> <span>Rutas despejadas hacia el extremo austral del país. No se registran incidentes.</span>";
                }
                if (cliTextoProgreso) cliTextoProgreso.textContent = "El vehículo avanza hacia su destino optimizando el combustible en base al clima.";

                lanzarNotificaciónSencilla("Condiciones climatológicas restablecidas a parámetros estándar.", "success");
            }

            // Recalcular ETA automáticamente si la tabla de asignación ya está visualizada
            const resultadoAsignacion = document.getElementById("resultadoAsignacion");
            if (resultadoAsignacion && !resultadoAsignacion.classList.contains("hidden")) {
                procesarAsignacionAutomatica();
            }
        }

        function cerrarBanner() {
            const banner = document.getElementById("bannerAlertaClimatica");
            if (banner) banner.classList.add("hidden");
        }

        // ==========================================================================
        // LÓGICA PORTAL DE CLIENTES (NAVEGACIÓN INTERNA)
        // ==========================================================================
        function mostrarSubseccionCliente(nombreSeccion) {
            let secciones = document.getElementsByClassName("seccion-cliente");
            for (let i = 0; i < secciones.length; i++) {
                secciones[i].classList.add("hidden");
            }
            const subSec = document.getElementById("sub-" + nombreSeccion);
            if (subSec) subSec.classList.remove("hidden");
        }

        function solicitarRetiro() {
            lanzarNotificaciónSencilla("Solicitud de retiro registrada en bodega de origen con éxito.", "success");
        }

        // ==========================================================================
        // GEOLOCALIZACIÓN GPS REAL (API NATIVA)
        // ==========================================================================
        function obtenerUbicacionReal() {
            let divMensaje = document.getElementById("mensajeGPS");
            if (navigator.geolocation) {
                if (divMensaje) divMensaje.innerHTML = "Estableciendo conexión satelital GPS...";
                navigator.geolocation.getCurrentPosition(mostrarPosicionGPS, mostrarErrorGPS);
            } else {
                if (divMensaje) divMensaje.innerHTML = "Error: Este navegador no cuenta con soporte de geolocalización.";
            }
        }

        function mostrarPosicionGPS(posicion) {
            let latitud = posicion.coords.latitude;
            let longitud = posicion.coords.longitude;
            let divMensaje = document.getElementById("mensajeGPS");
            let divMapa = document.getElementById("mapaContenedorOSM");

            if (divMensaje) divMensaje.innerHTML = `Satélite Conectado -> Coordenadas: <strong>Lat ${latitud.toFixed(4)} | Long ${longitud.toFixed(4)}</strong>`;

            // Enlazar mapa de OpenStreetMap en base a su ubicación real
            let urlMapa = `https://www.openstreetmap.org/export/embed.html?bbox=${longitud - 0.01}%2C${latitud - 0.01}%2C${longitud + 0.01}%2C${latitud + 0.01}&layer=mapnik&marker=${latitud}%2C${longitud}`;

            if (divMapa) {
                divMapa.innerHTML = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="${urlMapa}" class="rounded-xl shadow-inner"></iframe>`;
            }
            lanzarNotificaciónSencilla("Georreferenciación GPS procesada con éxito en OpenStreetMap.", "success");
        }

        function mostrarErrorGPS(error) {
            let divMensaje = document.getElementById("mensajeGPS");
            if (divMensaje) {
                if (error.code == 1) {
                    divMensaje.innerHTML = "<strong>Error:</strong> Permiso de ubicación denegado por el usuario.";
                } else if (error.code == 2) {
                    divMensaje.innerHTML = "<strong>Error:</strong> Señal satelital no disponible.";
                } else if (error.code == 3) {
                    divMensaje.innerHTML = "<strong>Error:</strong> Se agotó el tiempo de espera de respuesta GPS.";
                } else {
                    divMensaje.innerHTML = "Fallo desconocido de geolocalización.";
                }
            }
            lanzarNotificaciónSencilla("No se pudo establecer conexión satelital. Verifique los permisos.", "warning");
        }

        // ==========================================================================
        // CÁLCULO DE VIÁTICOS REAL
        // ==========================================================================
        function calcularViaticosDeFormaReal() {
            const kmRuta = document.getElementById('kmRuta');
            const totalPeajes = document.getElementById('totalPeajes');
            const km = kmRuta ? parseFloat(kmRuta.value) : NaN;
            const peajes = totalPeajes ? parseFloat(totalPeajes.value) : NaN;

            if (isNaN(km) || isNaN(peajes) || km < 0 || peajes < 0) {
                lanzarNotificaciónSencilla("Por favor, rellene todos los campos con valores numéricos mayores a cero.", "warning");
                return;
            }

            // Constantes estándar de rendición vial
            const valorCombustiblePorKm = 250; 
            const costoCombustible = km * valorCombustiblePorKm;
            const viaticoTotal = costoCombustible + peajes;

            const resCombustible = document.getElementById('resCombustible');
            const resPeajes = document.getElementById('resPeajes');
            const resTotal = document.getElementById('resTotal');
            const panelResultadoViaticos = document.getElementById('panelResultadoViaticos');

            if (resCombustible) resCombustible.innerText = costoCombustible.toLocaleString('es-CL');
            if (resPeajes) resPeajes.innerText = peajes.toLocaleString('es-CL');
            if (resTotal) resTotal.innerText = viaticoTotal.toLocaleString('es-CL');

            if (panelResultadoViaticos) panelResultadoViaticos.classList.remove('hidden');
            lanzarNotificaciónSencilla("Rendición de viáticos calculada y lista para aprobación.", "success");
        }

        function autorizarTransferencia() {
            lanzarNotificaciónSencilla("Transferencia bancaria autorizada de forma segura a la cuenta del conductor.", "success");
            const panelResultadoViaticos = document.getElementById('panelResultadoViaticos');
            const kmRuta = document.getElementById('kmRuta');
            const totalPeajes = document.getElementById('totalPeajes');

            if (panelResultadoViaticos) panelResultadoViaticos.classList.add('hidden');
            if (kmRuta) kmRuta.value = "";
            if (totalPeajes) totalPeajes.value = "";
        }