# 📖 Templates - Nueva Estructura Modular

## 🎯 Estructura del Proyecto

```
src/templates/
├── index.js                 # Exportador principal
├── love/                    # Categoría: Amor
│   ├── galaxy.js           # Galaxia de Amor
│   ├── love-proposal.js    # Propuesta de Amor
│   └── book-love.js        # Libro del Amor (próximamente)
├── games/                   # Categoría: Juegos
│   ├── puzzle.js           # Puzzle del Amor
│   ├── ruleta.js           # Ruleta del Amor
│   └── scratch.js          # Raspa y Gana
├── events/                  # Categoría: Eventos
│   ├── birthday.js         # Feliz Cumpleaños
│   ├── christmas.js        # Árbol de Navidad
│   └── new-year.js         # Feliz Año Nuevo
├── fun/                     # Categoría: Divertido
│   ├── marvel-book.js      # ⭐ Libro Marvel (NUEVO)
│   ├── forgive-cats.js     # Me Perdonas (Gatitos)
│   └── pocoyo.js           # Pocoyo Dance
└── special/                 # Categoría: Especiales
    ├── heart-photo.js      # Corazón con Fotos
    ├── our-year.js         # Nuestro Año
    └── hidden-message.js   # Mensaje Oculto
```

## ✨ Plantillas Mejoradas

### 🦸 Libro Marvel ❤️ (RENOVADO)

**Ubicación:** `src/templates/fun/marvel-book.js`

#### Características Nuevas:
- ✅ **Diseño Tipo Tarjeta de Superhéroe** estilo trading card
- ✅ **Efecto Flip 3D** (frontal y trasera)
- ✅ **Estilo Cómic Auténtico** con fuente Bangers
- ✅ **Partículas de Energía** flotantes
- ✅ **Barras de Estadísticas Animadas** (Amor, Poder, Magia)
- ✅ **Colores Marvel Oficiales** (#ed1d24 rojo, #ffd700 dorado)
- ✅ **Sombras y Efectos de Luz** profesionales
- ✅ **Responsive Design** optimizado para móvil
- ✅ **Intro Cinematográfica** con logo Marvel
- ✅ **Reproductor de Audio Temático**

#### Elementos Visuales:
```
FRONTAL:
- Header con título dorado y borde
- Marco de foto con efecto 3D
- Estadísticas con barras animadas
- Mensaje personalizado

TRASERA:
- Historia de Origen
- Poderes Especiales
- Clasificación "NIVEL ALTO"
- Firma del remitente
```

#### Uso en App.jsx:
```javascript
import { MARVEL_BOOK_TEMPLATE } from './templates';

const template = {
  id: 'marvel-book',
  category: 'divertido',
  name: 'Libro Marvel ❤️',
  content: MARVEL_BOOK_TEMPLATE,
  hasImage: true,
  hasExtra: true,      // Historia de Origen
  hasExtra2: true,     // Poderes Especiales
  extraLabel: 'Historia de Origen',
  extraLabel2: 'Poderes Especiales'
}
```

## 📝 Guía de Migración

### Para Agregar Nueva Plantilla:

1. **Crear archivo en categoría correspondiente:**
   ```javascript
   // src/templates/love/nueva-plantilla.js
   export const NUEVA_PLANTILLA = `<!DOCTYPE html>
   <html lang="es">
   ...
   </html>`;
   ```

2. **Exportar desde index.js:**
   ```javascript
   export { NUEVA_PLANTILLA } from './love/nueva-plantilla.js';
   ```

3. **Agregar en App.jsx:**
   ```javascript
   import { NUEVA_PLANTILLA } from './templates';
   
   const TEMPLATES = [
     {
       id: 'nueva',
       name: 'Nueva Plantilla',
       content: NUEVA_PLANTILLA,
       ...
     }
   ];
   ```

## 🎨 Estándares de Diseño

### Colores por Categoría:
- **Amor:** `#ff4d94` (Rosa)
- **Marvel:** `#ed1d24` (Rojo Marvel), `#ffd700` (Dorado)
- **Navidad:** `#2e7d32` (Verde)
- **Juegos:** `#7000ff` (Morado)
- **Eventos:** `#00f2ff` (Cyan)

### Componentes Comunes:
1. **Intro Overlay** con animación de apertura
2. **Audio Controls** unificados (MP3 + YouTube)
3. **Responsive Design** (móvil primero)
4. **Efectos de Partículas** opcionales
5. **Tipografía:** Outfit (principal), Bangers (Marvel), Dancing Script (romántico)

## 🚀 Próximos Pasos

### Fase 1: Migración Completa (En Progreso)
- [x] Marvel Book mejorado
- [x] Galaxia de Amor modular
- [x] Love Proposal modular
- [ ] Book Love mejorado
- [ ] Puzzle interactivo mejorado
- [ ] Ruleta con más opciones
- [ ] Birthday con más temas

### Fase 2: Optimización
- [ ] Lazy loading de templates
- [ ] Compresión de assets
- [ ] Cache de plantillas
- [ ] Modo offline

### Fase 3: Nuevas Características
- [ ] Editor visual de plantillas
- [ ] Temas personalizables
- [ ] Más efectos de animación
- [ ] Integración con redes sociales

## 📚 Documentación Técnica

### Sistema de Variables:
```javascript
{{name}}           // Nombre del destinatario
{{sender}}         // Nombre del remitente
{{message}}        // Mensaje principal
{{extra_text}}     // Texto adicional 1
{{extra_text_2}}   // Texto adicional 2
{{image_src}}      // URL de imagen 1
{{image_src_2}}    // URL de imagen 2
{{image_src_3}}    // URL de imagen 3
{{audio_src}}      // URL de audio MP3
{{youtube_id}}     // ID de video YouTube
{{audio_display}}  // CSS display para controles
{{image_display}}  // CSS display para imágenes
```

### Sistema de Audio:
```javascript
// Detecta automáticamente:
activePlatform = youtubeId ? 'youtube' : 'native'

// Controles unificados:
- Play/Pause
- Barra de progreso
- Tiempo transcurrido
- Loop automático
```

## 🔧 Mantenimiento

### Actualizar Template Existente:
1. Editar archivo en carpeta correspondiente
2. Probar con `npm run dev`
3. Verificar responsive
4. Commit con mensaje descriptivo

### Eliminar Template Obsoleto:
1. Remover export de `index.js`
2. Eliminar archivo
3. Actualizar `App.jsx`
4. Documentar en changelog

---

**Última actualización:** 20 de Enero, 2026  
**Mantenedor:** Equipo InteractivoMagic  
**Versión:** 2.0.0-modular
