// 1. Inicializar el mapa y centrarlo en una ubicación (ej: Ciudad de México)
const map = L.map('map').setView([10.423141, -75.545602], 13);  // [latitud, longitud], nivel de zoom

// 2. Añadir la capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// añadir marcadores por componente excacto
const marcadoresPorComponente = {};
// colores de los marcadores
const colores = {
    Comercio: '0000FF',
    Vivienda: 'FF0000',
    Ambiente: '00AA00',
    Patrimonio: '800080'
};
// se cargan las ubicaciones desde el JSON
let lugares = [];
fetch('datos.json')
  .then(res => res.json())
  .then(data => {
    lugares = data;
    console.log("Lugares cargados:", lugares);
  })
  .catch(error => console.error("Error al cargar datos:", error));
// Detectar cambios en checkboxes
document.querySelectorAll('.filtro').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const componente = checkbox.dataset.componente;

    if (checkbox.checked) {
      // Mostrar marcadores de ese tipo
      const filtrados = lugares.filter(l => l.componente === componente);

      marcadoresPorComponente[componente] = filtrados.map(lugar => {
        const icon = L.icon({
    iconUrl: `fotos/pagina/${componente.toLowerCase()}.png`,
    iconSize: [32, 32],         // Ajusta el tamaño si es necesario
    iconAnchor: [16, 32],       // Punto donde se "clava" el ícono en el mapa
    popupAnchor: [0, -32]       // Donde aparece el popup en relación al icono
    });


        return L.marker([lugar.latitud, lugar.longitud], { icon }).addTo(map)
          .bindPopup(`<b>${lugar.nombre}</b><br>${lugar.direccion}<br><img src="${lugar.foto}" width="100">`);
      });

    } else {
      // Ocultar marcadores
      if (marcadoresPorComponente[componente]) {
        marcadoresPorComponente[componente].forEach(m => map.removeLayer(m));
        delete marcadoresPorComponente[componente];
      }
    }
  });
});
// 4. Evento al hacer clic en el mapa (opcional)
map.on('click', (e) => {
    alert(`Coordenadas: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
});

const boton = document.querySelector('.boton-personalizado');
const panel = document.getElementById('panel-opciones');

boton.addEventListener('click', () => {
    panel.classList.toggle('mostrar');
});
document.addEventListener('click', (event) => {
  const esClickDentroDelPanel = panel.contains(event.target);
  const esClickEnBoton = boton.contains(event.target);

  if (!esClickDentroDelPanel && !esClickEnBoton) {
    panel.classList.remove('mostrar');
  }
});
