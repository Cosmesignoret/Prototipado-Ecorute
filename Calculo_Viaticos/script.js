function calcularViatico() {
    const km = parseFloat(document.getElementById('kmRuta').value);
    const peajes = parseFloat(document.getElementById('totalPeajes').value);

    if (isNaN(km) || isNaN(peajes)) {
        alert("Por favor, rellene todos los campos con números válidos.");
        return;
    }

    const valorPorKm = 250; 
    const costoCombustible = km * valorPorKm;
    const viaticoTotal = costoCombustible + peajes;

    document.getElementById('resCombustible').innerText = costoCombustible.toLocaleString('es-CL');
    document.getElementById('resPeajes').innerText = peajes.toLocaleString('es-CL');
    document.getElementById('resTotal').innerText = viaticoTotal.toLocaleString('es-CL');

    document.getElementById('panelResultado').style.display = 'block';
}
