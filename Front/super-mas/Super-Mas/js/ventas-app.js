const API_BASE_URL = 'http://localhost:5126/api/Ventas';

// ------------------------------------------------------------------
// FUNCIÓN 1: OBTENER Y MOSTRAR VENTAS (GET)
// ------------------------------------------------------------------
async function loadVentas() {
    const tbody = document.getElementById('ventas-tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7">Cargando ventas desde la API...</td></tr>';

    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}. ¿Está corriendo la API en el puerto 5126?`);
        }

        const ventas = await response.json();
        let htmlContent = '';

        if (ventas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No hay ventas registradas en la API.</td></tr>';
            return;
        }

        ventas.forEach(venta => {
            const clienteNombre = venta.cliente?.nombre || `ID: ${venta.clienteId}`;
            const productoNombre = venta.producto?.nombre || `ID: ${venta.productoId}`;
            
            // Mapeamos 'Zona' del cliente al campo 'Localidad' de la tabla
            const localidad = venta.cliente?.zona || 'N/A'; 
            
            htmlContent += `
                <tr>
                    <td>${venta.id}</td>
                    <td>${clienteNombre}</td>
                    <td>${productoNombre}</td>
                    <td>${venta.cantidad}</td>
                    <td>$${venta.precioUnitario.toFixed(2)}</td>
                    <td>${venta.metodoPago}</td>
                    <td>${localidad}</td>
                </tr>
            `;
        });

        tbody.innerHTML = htmlContent;

    } catch (error) {
        console.error('Error al cargar ventas:', error);
        tbody.innerHTML = `<tr><td colspan="7" style="color: red;">❌ Error de conexión: ${error.message}.</td></tr>`;
    }
}

// ------------------------------------------------------------------
// FUNCIÓN 2: ENVIAR NUEVA VENTA (POST)
// ------------------------------------------------------------------
async function submitVenta(event) {
    event.preventDefault();
    const form = event.target;
    
    // Usamos IDs fijos de los datos precargados
    const clienteIdMock = 1; 
    const productoIdMock = 101; 

    const ventaData = {
        clienteId: clienteIdMock,
        productoId: productoIdMock,
        cantidad: parseInt(document.getElementById('venta-cantidad').value),
        precioUnitario: parseFloat(document.getElementById('venta-precio').value),
        metodoPago: document.getElementById('venta-metodoPago').value,
        // El backend calcula Fecha y Total
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
        });

        if (response.ok) {
            alert('✅ Venta registrada con éxito!');
            form.reset(); 
            loadVentas(); // Recargar la tabla para mostrar la nueva venta
            
            // Opcional: Si está en la pestaña de estadísticas, recargar los gráficos
            if (document.getElementById('estadisticas-section').style.display !== 'none' && typeof loadAllCharts === 'function') {
                loadAllCharts();
            }
        } else {
            const errorText = await response.text();
            throw new Error(`Fallo en el registro. Status: ${response.status}. Mensaje: ${errorText}`);
        }

    } catch (error) {
        console.error('Error al registrar la venta:', error);
        alert(`❌ Error al registrar la venta. Consulte la consola para más detalles.`);
    }
}


// ------------------------------------------------------------------
// INICIO
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('venta-form');
    if (form) {
        form.addEventListener('submit', submitVenta);
    }
    
    // Cargar las ventas registradas al inicio
    loadVentas();
});