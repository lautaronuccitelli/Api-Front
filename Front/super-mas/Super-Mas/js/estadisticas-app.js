// Variable global para mantener las instancias de los gráficos
let chartInstances = {};

// Colores base para los gráficos (más variados)
const chartColors = [
    '#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffc107', '#a05195', 
    '#00876c', '#60a374', '#a0bf7e', '#d8db9c', '#fbe7b3', '#fff8e3'
];

// ------------------------------------------------------------------
// FUNCIÓN BASE PARA DIBUJAR (Destruye instancias para evitar el mal desempeño)
// ------------------------------------------------------------------
function drawChart(canvasId, config) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) {
        console.error(`Canvas ID '${canvasId}' no encontrado.`);
        return; // Detiene la ejecución si el lienzo no existe
    }
    
    // Destruir instancia previa (CRUCIAL para rendimiento)
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }
    
    chartInstances[canvasId] = new Chart(ctx, config);
    return chartInstances[canvasId];
}

// ------------------------------------------------------------------
// CORRECCIÓN DE LA CORRELACIÓN (Stock vs Precio)
// ------------------------------------------------------------------

async function loadStockVsPrecio() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/StockVsPrecio');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        const scatterData = data.map(item => ({ 
            x: item.precio, 
            y: item.stock, 
            nombre: item.nombre 
        }));

        drawChart('stockVsPrecioChart', {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Stock vs Precio',
                    data: scatterData,
                    backgroundColor: chartColors[0],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const item = context.raw;
                                return `${item.nombre} | Precio: $${item.x} | Stock: ${item.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: { 
                        type: 'linear', 
                        position: 'bottom', 
                        title: { display: true, text: 'Precio del Producto ($)' },
                        min: 0, 
                        max: 400 
                    },
                    y: { 
                        title: { display: true, text: 'Stock Disponible' },
                        min: 0,
                        max: 350
                    }
                }
            }
        });
    } catch (error) { console.error('Error StockVsPrecio:', error); }
}


// --- OTRAS FUNCIONES DE CARGA (Aseguramos que loadAllCharts las llame correctamente) ---

async function loadValorStockPorCategoria() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/ValorStockPorCategoria');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        drawChart('valorStockChart', {
            type: 'bar',
            data: {
                labels: data.map(item => item.categoria),
                datasets: [{
                    label: 'Valor Total de Stock ($)',
                    data: data.map(item => item.valorTotalInventario),
                    backgroundColor: chartColors[6],
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    } catch (error) { console.error('Error ValorStockPorCategoria:', error); }
}

async function loadTop5Productos() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/Top5ProductosPorVenta');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        drawChart('top5ProductosChart', {
            type: 'doughnut',
            data: {
                labels: data.map(item => item.producto),
                datasets: [{
                    label: 'Ingresos',
                    data: data.map(item => item.ingresoTotal),
                    backgroundColor: chartColors.slice(0, data.length),
                }]
            }
        });
    } catch (error) { console.error('Error Top5Productos:', error); }
}

async function loadCLV() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/ValorVidaCliente');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        drawChart('clvChart', {
            type: 'bar',
            data: {
                labels: data.map(item => item.cliente),
                datasets: [{
                    label: 'Gasto Total por Cliente ($)',
                    data: data.map(item => item.totalGastado),
                    backgroundColor: chartColors[2],
                }]
            },
            options: { indexAxis: 'y', scales: { x: { beginAtZero: true } } }
        });
    } catch (error) { console.error('Error CLV:', error); }
}

// ... [El contenido de loadVentasPorMetodoPago, loadVentasPorZona, loadEdadPorProducto, loadVentasPorDia, loadVentasPorHora debe estar aquí] ...
// Asumiendo que esas funciones están correctas y solo faltan las llamadas de abajo:


// ------------------------------------------------------------------
// FUNCIÓN PRINCIPAL QUE CARGA TODOS LOS GRÁFICOS
// ------------------------------------------------------------------
function loadAllCharts() {
    console.log('Cargando todos los gráficos...');
    loadValorStockPorCategoria();
    loadTop5Productos();
    loadCLV();
    // AÑADA AQUÍ LAS OTRAS LLAMADAS PARA ASEGURAR QUE SE EJECUTEN:
    loadVentasPorMetodoPago(); 
    loadVentasPorZona();
    loadStockVsPrecio(); 
    loadEdadPorProducto();
    loadVentasPorDia();
    loadVentasPorHora();
    console.log('Intento de carga completado.');
}
// ... [Otras funciones] ...

async function loadValorStockPorCategoria() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/ValorStockPorCategoria');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        // Se usa 'valorStockChart' del HTML
        drawChart('valorStockChart', { 
            type: 'bar',
            data: {
                labels: data.map(item => item.categoria),
                datasets: [{
                    label: 'Valor Total de Stock ($)',
                    data: data.map(item => item.valorTotalInventario),
                    backgroundColor: chartColors[6],
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    } catch (error) { console.error('Error al cargar ValorStockPorCategoria:', error); }
}

async function loadTop5Productos() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/Top5ProductosPorVenta');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        // Se usa 'top5ProductosChart' del HTML
        drawChart('top5ProductosChart', { 
            type: 'doughnut',
            data: {
                labels: data.map(item => item.producto),
                datasets: [{
                    label: 'Ingresos',
                    data: data.map(item => item.ingresoTotal),
                    backgroundColor: chartColors.slice(0, data.length),
                }]
            }
        });
    } catch (error) { console.error('Error al cargar Top5Productos:', error); }
}

async function loadCLV() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/ValorVidaCliente');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        // Se usa 'clvChart' del HTML
        drawChart('clvChart', {
            type: 'bar',
            data: {
                labels: data.map(item => item.cliente),
                datasets: [{
                    label: 'Gasto Total por Cliente ($)',
                    data: data.map(item => item.totalGastado),
                    backgroundColor: chartColors[2],
                }]
            },
            options: { indexAxis: 'y', scales: { x: { beginAtZero: true } } }
        });
    } catch (error) { console.error('Error al cargar CLV:', error); }
}

async function loadVentasPorMetodoPago() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/VentasPorMetodoPago');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        drawChart('metodoPagoChart', {
            type: 'pie',
            data: {
                labels: data.map(item => item.metodo),
                datasets: [{
                    label: 'Total Vendido ($)',
                    data: data.map(item => item.totalVentas),
                    backgroundColor: chartColors.slice(0, data.length),
                }]
            }
        });
    } catch (error) { console.error('Error VentasPorMetodoPago:', error); }
}

async function loadEdadPorProducto() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/EdadPorProducto');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        drawChart('edadPorProductoChart', {
            type: 'bar',
            data: {
                labels: data.map(item => item.producto),
                datasets: [{
                    label: 'Edad Promedio de Compradores',
                    data: data.map(item => item.edadPromedio),
                    backgroundColor: chartColors[3],
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    } catch (error) { console.error('Error EdadPorProducto:', error); }
}

// --- FUNCIÓN 4: Ventas Totales por Día ---
async function loadVentasPorDia() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/VentasPorDia');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        drawChart('ventasPorDiaChart', {
            type: 'line',
            data: {
                labels: data.map(item => item.dia),
                datasets: [{
                    label: 'Ventas Diarias ($)',
                    data: data.map(item => item.totalVentas),
                    borderColor: '#00876c',
                    tension: 0.1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    } catch (error) { console.error('Error VentasPorDia:', error); }
}

// --- FUNCIÓN 5: Ventas Totales por Hora ---
async function loadVentasPorHora() {
    try {
        const response = await fetch('http://localhost:5126/api/Estadisticas/VentasPorHora');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        drawChart('ventasPorHoraChart', {
            type: 'bar',
            data: {
                labels: data.map(item => `${item.hora}:00`),
                datasets: [{
                    label: 'Ventas por Hora del Día ($)',
                    data: data.map(item => item.totalVentas),
                    backgroundColor: chartColors[1],
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    } catch (error) { console.error('Error VentasPorHora:', error); }
}

// ... [El resto del archivo se mantiene igual, incluyendo la llamada loadAllCharts] ...
window.loadAllCharts = loadAllCharts;