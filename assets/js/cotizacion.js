// --- ESTADO GLOBAL DE LA APLICACIÓN ---
let servicios = [];
let extras = [];
let cotizacionDolar = 0;
let monedaActual = 'ars'; // Valor inicial: 'ars' o 'usd'

// --- FUNCIÓN AUXILIAR DE FORMATO ---
// Formatea un precio en ARS a la moneda actualmente seleccionada.
function formatPrice(precioArs) {
    if (monedaActual === 'usd') {
        const precioUsd = precioArs / cotizacionDolar;
        return precioUsd.toLocaleString("en-US", { style: "currency", currency: "USD" });
    }
    // Por defecto, formatea a ARS
    return precioArs.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

// --- LÓGICA PRINCIPAL ---
// 1. OBTENER DATOS DE LA API
fetch('api/servicios.php')
    .then(res => res.json())
    .then(data => {
        servicios = data.servicios;
        extras = data.extras;
        cotizacionDolar = parseFloat(data.cotizacion_dolar);
        renderForm(); // Dibuja el formulario por primera vez
    })
    .catch(error => {
        console.error("Error al cargar los datos del cotizador:", error);
        alert("No se pudieron cargar los servicios. Intenta recargar la página.");
    });

// 2. DIBUJAR O REDIBUJAR EL FORMULARIO
function renderForm() {
    const serviceSelect = document.getElementById("service");
    const extrasDiv = document.getElementById("extras");

    // Limpiar contenido previo para redibujar al cambiar de moneda
    serviceSelect.innerHTML = "";
    extrasDiv.innerHTML = "";

    // Llenar el select de Servicios
    servicios.forEach(s => {
        const opt = document.createElement("option");
        const precioBaseArs = parseFloat(s.precio_ars);
        opt.value = s.id;
        opt.textContent = `${s.nombre} (${formatPrice(precioBaseArs)})`;
        opt.dataset.precioArs = precioBaseArs; // Guardamos el precio base en ARS
        serviceSelect.appendChild(opt);
    });

    // Llenar los checkboxes de Extras
    extras.forEach(e => {
        const label = document.createElement("label");
        const precioExtraArs = parseFloat(e.precio_ars);
        label.innerHTML = `<input type="checkbox" value="${e.id}" data-precio-ars="${precioExtraArs}"> ${e.nombre} (+${formatPrice(precioExtraArs)})`;
        extrasDiv.appendChild(label);
    });

    updateTotal(); // Actualizar el total una vez renderizado
}

// 3. CALCULAR Y MOSTRAR EL TOTAL
function updateTotal() {
    const serviceSelect = document.getElementById("service");
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    
    // Todos los cálculos se hacen en ARS, nuestra moneda base.
    let totalArs = selectedOption ? parseFloat(selectedOption.dataset.precioArs) : 0;

    document.querySelectorAll("#extras input[type='checkbox']:checked").forEach(cb => {
        totalArs += parseFloat(cb.dataset.precioArs);
    });

    // Mostramos el total formateado según la moneda seleccionada.
    document.getElementById("total-display").textContent = formatPrice(totalArs);
}

// --- EVENT LISTENERS (MANEJADORES DE EVENTOS) ---

// Escucha cambios en el selector de moneda
document.getElementById('moneda-selector').addEventListener('change', (e) => {
    if (e.target.name === 'moneda') {
        monedaActual = e.target.value;
        renderForm(); // Redibuja todo el formulario con los nuevos precios
    }
});

// Escucha cualquier cambio en el formulario (seleccionar servicio, marcar extras)
document.getElementById('quoteForm').addEventListener('change', (e) => {
    // Evitamos que el listener del cambio de moneda dispare esto dos veces
    if (e.target.name !== 'moneda') {
        updateTotal();
    }
});

// Escucha el clic en el botón de enviar
document.getElementById("sendQuote").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const serviceSelect = document.getElementById("service");
    const serviceId = serviceSelect.value;
    
    if (!name || !email) {
        alert("Por favor, ingresa tu nombre y email.");
        return;
    }

    // --- CÁLCULO FINAL ---
    const basePriceArs = parseFloat(serviceSelect.options[serviceSelect.selectedIndex]?.dataset.precioArs) || 0;
    let totalArs = basePriceArs;
    const selectedExtras = [];

    document.querySelectorAll("#extras input[type='checkbox']:checked").forEach(cb => {
        totalArs += parseFloat(cb.dataset.precioArs);
        selectedExtras.push(cb.value);
    });
    
    const totalUsd = totalArs / cotizacionDolar;

    // --- PREPARACIÓN DE DATOS Y MENSAJE ---
    const nombreServicio = servicios.find(s => s.id === serviceId)?.nombre || '❓';
    const nombresExtras = extras
        .filter(e => selectedExtras.includes(e.id))
        .map(e => e.nombre)
        .join(", ");

    const mensaje = `Hola! Quiero una cotización para *${nombreServicio}*.\n` +
                    `Extras: ${nombresExtras || "Ninguno"}.\n` +
                    `Precio estimado: *${totalArs.toLocaleString("es-AR", { style: 'currency', currency: 'ARS' })}* (Aprox. ${totalUsd.toLocaleString("en-US", { style: 'currency', currency: 'USD' })})\n\n` +
                    `Nombre: ${name}\n` +
                    `Email: ${email}`;

    // --- ENVÍO A LA API PARA GUARDAR EN DB ---
    const btn = document.getElementById("sendQuote");
    btn.disabled = true;
    btn.textContent = "Procesando...";

    try {
        await fetch('api/cotizar.php', {
            method: 'POST',
            body: JSON.stringify({
                nombre: name,
                email: email,
                servicio_id: serviceId,
                extras: selectedExtras,
                total_ars: totalArs // Enviamos el total en ARS
            }),
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error("Error al guardar la cotización:", e);
    }

   
    const waLink = `https://wa.me/5493517061589?text=${encodeURIComponent(mensaje)}`;
    window.open(waLink, '_blank');
    
    
    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "Enviar por WhatsApp";
    }, 2000);
});