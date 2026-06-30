function calcularViatico() {
    // 1. Obtener los valores ingresados por el usuario
    const km = parseFloat(document.getElementById('kmRuta').value);
    const peajes = parseFloat(document.getElementById('totalPeajes').value);
    
    // Validación por si dejan campos vacíos
    if (isNaN(km) || isNaN(peajes)) {
        alert("Por favor, rellene todos los campos con números válidos.");
        return;
    }

    // 2. Aplicar la fórmula del informe (Asumiendo $250 por kilómetro)
    const valorPorKm = 250; 
    const costoCombustible = km * valorPorKm;
    const viaticoTotal = costoCombustible + peajes;

    // 3. Mostrar los resultados en la página
    document.getElementById('resCombustible').innerText = costoCombustible.toLocaleString('es-CL');
    document.getElementById('resPeajes').innerText = peajes.toLocaleString('es-CL');
    document.getElementById('resTotal').innerText = viaticoTotal.toLocaleString('es-CL');

    // Hacer visible el panel de resultados
    document.getElementById('panelResultado').style.display = 'block';
}
