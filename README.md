# Ocine Río Shopping - Scraper de Cartelera

Este proyecto utiliza Playwright para extraer automáticamente la información de las películas en cartelera del cine Ocine Río Shopping.

## 🚀 Instalación

1. Clona o descarga este proyecto
2. Instala las dependencias:
```bash
npm install
```

3. Instala los navegadores de Playwright:
```bash
npx playwright install
```

## 📋 Uso

### Ejecución básica
```bash
npm start
```

### Modo desarrollo (con watch)
```bash
npm run dev
```

## 🎬 Funcionalidades

El scraper extrae la siguiente información de cada película:

- **Título** de la película
- **Horarios** disponibles para el día actual
- **URL del tráiler** (si está disponible)
- **URL de información** detallada
- **URL del póster**
- **Estado** de sesiones (si hay funciones hoy)

## 📊 Salida

El script genera:

1. **Salida por consola** con formato legible
2. **Archivo JSON** (`cartelera.json`) con todos los datos estructurados

### Ejemplo de salida por consola:
```
🎭 CARTELERA DE HOY - OCINE RÍO SHOPPING
==================================================
📅 Fecha: 25/6/2025
🎬 Películas disponibles: 10
==================================================

1. 🎬 Bajo un volcán
   🕐 Horarios: 16:00, 17:50, 21:15
   🎥 Trailer: https://www.youtube.com/watch?v=...
   ℹ️  Más info: https://www.ocinerioshopping.es/film-...
   📸 Póster: https://...

2. 🎬 Misión: Imposible. Sente...
   🕐 Horarios: 19:00, 22:15
   ...
```

### Estructura del JSON:
```json
{
  "allMovies": [...],
  "moviesWithSessionsToday": [...],
  "totalMovies": 10,
  "moviesWithSessions": 5
}
```

## 🛠️ Configuración

El scraper está configurado para:
- Ejecutarse en modo headless (sin interfaz gráfica)
- Usar un User-Agent realista
- Manejar timeouts y errores
- Esperar a que el contenido cargue completamente

## 🔧 Personalización

Puedes modificar el archivo `index.js` para:
- Cambiar el formato de salida
- Añadir filtros por género
- Extraer información adicional
- Cambiar la frecuencia de ejecución

## 📝 Notas

- El scraper respeta los tiempos de carga de la página
- Maneja errores gracefully
- No sobrecarga el servidor con peticiones excesivas
- Los datos se actualizan en tiempo real según la web oficial

## 🐛 Troubleshooting

Si encuentras problemas:

1. Verifica que Playwright esté instalado correctamente:
```bash
npx playwright install
```

2. Asegúrate de tener una conexión a internet estable

3. Si la página web cambia su estructura, es posible que necesites actualizar los selectores en el código

## 📄 Licencia

MIT License
