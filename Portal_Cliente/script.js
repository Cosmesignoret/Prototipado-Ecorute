function ingresarCliente() {
    let nombre = document.getElementById("nombreCliente").value;
    let rut = document.getElementById("rutCliente").value;

    if (nombre === "" || rut === "") {
        alert("Debe completar todos los campos.");
        return;
    }

    document.getElementById("login").style.display = "none";
    document.getElementById("panelCliente").style.display = "block";

    document.getElementById("bienvenida").textContent = "Bienvenido/a, " + nombre;

    let fecha = new Date();
    document.getElementById("fechaActual").textContent = fecha.toLocaleDateString();

    setTimeout(function() {
        alert("Notificación: vehículo asignado correctamente.");
    }, 3000);
}

function solicitarRetiro() {
    alert("Solicitud de retiro registrada correctamente.");
}

function verSeguimiento() {
    mostrarSeccion("seguimiento");
}

function mostrarSeccion(nombreSeccion) {
    let secciones = document.getElementsByClassName("seccion");

    for (let i = 0; i < secciones.length; i++) {
        secciones[i].style.display = "none";
    }

    document.getElementById(nombreSeccion).style.display = "block";
}

function cambiarModo() {
    document.body.classList.toggle("oscuro");
}
