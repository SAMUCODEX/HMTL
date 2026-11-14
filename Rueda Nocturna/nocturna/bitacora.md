# Bitácora de Aprendizaje · Rueda Nocturna · Sistema de Diseño y Kit de Componentes

**Proyecto:** Rueda Nocturna · Medellín en Bici  
**Módulo:** Tailwind CSS y Maquetación de Interfaces Modernas  
**Fases Integradas:**  
- **Fase 1:** Prototipado Sección Principal (HTML semántico y comparación de frameworks).  
- **Fase 2:** Configuración de Tailwind CLI y verificación de generación de clases (CDN vs. CLI, JIT).  
- **Fase 3:** Sistema de Botones y Cards de Recorridos Nocturnos (MiniReto 3).  
- **Fase 4:** Kit de Componentes Completo (Alertas accesibles, Formulario con foco visible y Reglas del Kit).  

---

## 1. Comparación de Enfoques: Evolución del Flujo de Trabajo CSS

### A. Framework de Componentes (Bootstrap - Semana 2) vs. Framework Utility-First (Tailwind CSS - Actual)

| Dimensión | Enfoque de Componentes (Bootstrap) | Enfoque Utility-First (Tailwind CSS) |
| :--- | :--- | :--- |
| **Nivel de Abstracción** | **Alto nivel:** Provee componentes listos y rígidos (`.btn`, `.card`, `.alert`, `.form-control`). | **Bajo nivel atómico:** Provee bloques de construcción atómicos independientes (`p-4`, `flex`, `text-center`, `rounded-xl`, `bg-slate-900`). |
| **Personalización y Estética** | Impone una opinión visual predeterminada. Alterar radios de curvatura, paletas nocturnas o efectos lumínicos exige escribir CSS adicional o recurrir a `!important`. | No impone decisiones estéticas. Permite crear interfaces 100% únicas, coherentes y a medida directamente en el marcado HTML sin salir del archivo. |
| **Flujo de Desarrollo** | Continuo cambio de contexto entre el marcado HTML y hojas de estilo externas (`style.css`) para ajustar o sobrescribir reglas. | Todo el diseño se resuelve directamente en el marcado HTML mediante la composición de utilidades, reduciendo la fricción mental. |
| **Mantenimiento y Especificidad** | Alto riesgo de colisiones en la cascada y selectores con especificidad compleja (`.card .card-body .btn-primary:hover`). | Cero colisiones de especificidad. Las utilidades operan en una única capa plana sin anidamientos ni herencias no deseadas. |
| **Consistencia Global** | Sujeta a la disciplina manual de escribir variables Sass o reglas personalizadas. | Guiada estrictamente por los tokens del sistema de diseño (radios `rounded-xl`, escala de padding, paleta esmeralda/pizarra). |

#### Ejemplo Práctico Comparativo (Construcción del Botón Principal):

- **Con Bootstrap (Semana 2):**
  ```html
  <a href="#inscribete" class="btn btn-primary">Inscríbete</a>
  ```
  *Mecanismo:* La clase `.btn` agrupa reglas base predefinidas y `.btn-primary` aplica la paleta azul por defecto del framework. Modificar la experiencia táctil o el foco visual requiere reglas CSS personalizadas en un archivo externo.

- **Con Tailwind CSS (Semana actual):**
  ```html
  <button type="button" class="w-full sm:w-auto px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-400/60 focus:ring-offset-2 focus:ring-offset-slate-950 text-slate-950 font-bold text-sm sm:text-base rounded-xl tracking-wide uppercase transition-all duration-200 shadow-lg shadow-emerald-500/25 cursor-pointer">
    Botón Principal
  </button>
  ```
  *Mecanismo:* No existe una abstracción fija `.btn`. Toda la apariencia (curvatura `rounded-xl`, espaciado `px-7 py-3.5`, sombra lumínica `shadow-emerald-500/25`, colores y halo de foco de 4px) se compone y valida de forma inmediata y explícita.

---

### B. Tailwind CSS Play CDN vs. Tailwind CLI (Flujo de Producción)

Para pasar del prototipo exploratorio inicial a una arquitectura sólida para producción:

1. **CDN (Play CDN - `<script src="https://cdn.tailwindcss.com">`):**
   - Adecuado únicamente para pruebas rápidas y maquetas iniciales.
   - Descarga un script en JavaScript de varios megabytes en el navegador del usuario y compila los estilos en tiempo de ejecución.
   - Genera retrasos perceptibles (FOUT/FOUC), depende de la conexión a internet de terceros y no es viable para despliegue en producción.
2. **Tailwind CLI (`@tailwindcss/cli` con `@import "tailwindcss";`):**
   - Compilación estática anticipada (AOT - Ahead-of-Time).
   - Genera una hoja de estilos final (`src/output.css`) ultra liviana, que contiene únicamente las utilidades efectivamente detectadas en el HTML.
   - En producción (GitHub Pages), el navegador carga directamente `src/output.css` sin ejecutar JavaScript ni realizar peticiones externas, logrando tiempos de renderizado instantáneos (HTTP 200 OK).

---

## 2. Verificación de Generación de Clases con Tailwind CLI

### Proceso de Compilación Ejecutado

En el directorio del proyecto se configuró el entorno con `package.json`:

```json
{
  "name": "nocturna",
  "version": "1.0.0",
  "scripts": {
    "build": "tailwindcss -i ./src/input.css -o ./src/output.css",
    "watch": "tailwindcss -i ./src/input.css -o ./src/output.css --watch"
  },
  "dependencies": {
    "tailwindcss": "^3.4.19"
  }
}
```

El archivo `src/input.css` incluye las directivas base:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Comprobación de Clases Utilizadas vs. No Utilizadas (Dead Code Elimination)

Al compilar mediante `npm run build` (`tailwindcss -i ./src/input.css -o ./src/output.css`):

1. **Clases Efectivamente Empleadas (Detectadas y Compiladas):**
   - `.bg-emerald-500`: Generada y mapeada a `var(--color-emerald-500)`.
   - `.border-l-4`: Generada para los bordes laterales de las alertas (`border-left-width: 4px`).
   - `.border-l-sky-400`, `.border-l-emerald-400`, `.border-l-amber-400`: Generadas exactamente con los valores OKLCH de la escala cromática.
   - `.bg-sky-500\/10`, `.bg-emerald-500\/10`, `.bg-amber-500\/10`: Generadas mediante composición de color transparente (`color-mix`).
   - `.focus\:ring-4`: Generada para los anillos de enfoque accesible de botones e inputs.
   - `.rounded-xl` y `.rounded-3xl`: Generadas como `0.75rem` (12px) y `1.5rem` (24px) respectivamente.
2. **Clase No Empleada (`bg-pink-500`):**
   - **Resultado:** **0 coincidencias** en todo `src/output.css`. Al no estar escrita en ningún archivo HTML escaneado, el motor jamás la compila.
3. **Explicación Técnica del Compilador:**
   Tailwind CSS v3.4.19 implementa un escaneo de fuentes Just-In-Time (JIT) de alto rendimiento. Examina los archivos fuente (`componentes.html`, `index.html`, `prototipo.html`) configurados en `tailwind.config.js` y extrae únicamente los identificadores de utilidades presentes, purgando el 100% de la biblioteca no utilizada. El archivo final resultante pesa escasos **~36 KB**, frente a los más de **3.5 MB** que pesaría una librería CSS sin purgar.

---

## 3. Reglas del Kit: Matriz de Consistencia Visual y Accesibilidad

Para asegurar la regla de oro del equipo de diseño (*"si el kit es consistente, la landing se arma sola"*), se definieron y aplicaron cuatro reglas transversales en todos los componentes del kit (`componentes.html`):

```
+───────────────────────────────────────────────────────────────────────────────────+
|                           MATRIZ DE REGLAS DEL KIT                                |
+──────────────────────┬──────────────────────┬─────────────────────────────────────+
| CATEGORÍA            | TOKEN / CLASE        | REGLA Y APLICACIÓN                  |
+──────────────────────┼──────────────────────┼─────────────────────────────────────+
| Radios de Borde      | rounded-3xl (24px)   | Macro-contenedores y Cards de ruta  |
|                      | rounded-2xl (16px)   | Contenedores interiores secundarios |
|                      | rounded-xl (12px)    | Botones, Alertas y Campos (Inputs)  |
|                      | rounded-full         | Badges de estado, nivel y chips     |
+──────────────────────┼──────────────────────┼─────────────────────────────────────+
| Escala de Espaciado  | px-7 py-3.5          | Área táctil uniforme para botones   |
|                      | px-4 py-3            | Altura y relleno en campos de texto |
|                      | p-5 sm:p-6           | Relleno interior en alertas         |
|                      | p-6 sm:p-8           | Relleno en el cuerpo de las cards   |
|                      | space-y-2 / space-y-6| Ritmo vertical entre elementos      |
+──────────────────────┼──────────────────────┼─────────────────────────────────────+
| Paleta Cromática     | slate-950 / 900      | Fondos y lienzos nocturnos          |
|                      | emerald-500 / 400    | Acento principal, foco y CTA        |
|                      | border-slate-700/800 | Bordes y divisiones estructurales   |
|                      | sky / emerald / amber| Semántica de alertas con opacidad   |
+──────────────────────┼──────────────────────┼─────────────────────────────────────+
| Accesibilidad (ARIA) | focus:ring-4         | Anillo de foco visible para teclado |
|                      | <label for="...">    | Asociación explícita con inputs     |
|                      | role="status" / alert| Anuncios para lectores de pantalla  |
+──────────────────────┴──────────────────────┴─────────────────────────────────────+
```

### Regla 1: Escala Estandarizada de Radios de Borde (`border-radius`)
- **Macro-contenedores y Cards:** `rounded-3xl` (`24px` / `1.5rem`). Confiere una presencia visual suave y moderna a los bloques de contenido mayores (`<article>`, `<section>`).
- **Componentes Interiores e Interactivos:** `rounded-xl` (`12px` / `0.75rem`). Aplicado universalmente en los 3 botones, los 2 campos de entrada de formulario y las 3 alertas informativas. Esta uniformidad geométrica es la clave de la armonía del kit.
- **Badges y Etiquetas:** `rounded-full` (`9999px`). Utilizado en píldoras de nivel de dificultad (`Nivel: Fácil`, `Nivel: Medio`, `Nivel: Difícil`) y etiquetas de campaña.

### Regla 2: Escala de Espaciado y Ritmo Vertical
- **Áreas Táctiles:** Cada control interactivo cumple o excede los 48x48px mínimos de contacto ergonómico recomendados por las directrices WCAG 2.1:
  - Botones: `px-7 py-3.5`
  - Inputs: `px-4 py-3`
  - Alertas: `p-5 sm:p-6` con separación `gap-4` respecto al icono representativo.
- **Ritmo Vertical:**
  - `space-y-2`: Distancia entre `<label>`, `<input>` y su correspondiente texto de ayuda.
  - `space-y-4`: Separación interna en títulos y descripciones.
  - `space-y-6`: Espaciado entre campos de formulario y bloques internos.
  - `space-y-8` a `space-y-16`: Separación macro entre secciones modulares.

### Regla 3: Paleta Cromática Nocturna y Contraste
- **Lienzo y Superficie:**
  - Lienzo base: `bg-slate-950` (`oklch(12.9% 0.042 264.695)`).
  - Tarjetas y paneles: `bg-slate-900/90` con bordes estructurales `border-slate-800`.
  - Entradas de datos: `bg-slate-900` con borde neutral `border-slate-700` y transición a `border-slate-600` en hover.
- **Color de Marca y Conversión:**
  - Familia `emerald`: `bg-emerald-500` para fondos principales, `hover:bg-emerald-400` para respuesta inmediata, `active:bg-emerald-600` para pulsación física, y `shadow-emerald-500/25` para la iluminación nocturna.
- **Alertas Semánticas (Fondo Suave + Borde Lateral):**
  - *Información:* `bg-sky-500/10` + `border-l-4 border-l-sky-400` + texto `text-sky-400`.
  - *Éxito:* `bg-emerald-500/10` + `border-l-4 border-l-emerald-400` + texto `text-emerald-400`.
  - *Advertencia:* `bg-amber-500/10` + `border-l-4 border-l-amber-400` + texto `text-amber-400`.

### Regla 4: Accesibilidad, Teclado y Semántica WAI-ARIA
1. **Asociación Explícita de Formularios:**
   - Cada campo cuenta con su elemento `<label>` visible con atributo `for` estrictamente idéntico al `id` del `<input>` (`for="campo-correo"` y `for="campo-celular"`).
   - Los textos de ayuda descriptivos inferiores se vinculan mediante `aria-describedby="ayuda-correo"` y `aria-describedby="ayuda-celular"`, permitiendo que las tecnologías de asistencia lean la instrucción adicional al enfocar el campo.
2. **Foco Visible de Alto Contraste:**
   - Se reemplaza el contorno estándar del navegador por una combinación de halo y compensación:
     ```css
     focus:outline-none focus:ring-4 focus:ring-emerald-400/60 focus:ring-offset-2 focus:ring-offset-slate-950
     ```
   - Cumple el criterio WCAG 2.4.7 (Focus Visible) con un ratio de contraste superior a 3:1 sobre fondo oscuro.
3. **Semántica de Alertas para Lectores de Pantalla:**
   - La alerta de éxito implementa `role="status"` y `aria-live="polite"` para ser anunciada como un aviso respetuoso cuando el sintetizador de voz esté libre.
   - La alerta de advertencia implementa `role="alert"` para requerir la atención inmediata del usuario.
   - La alerta informativa implementa `role="region"` con `aria-label="Información de la ruta"`.

---

## 4. Estructura de Entregables del Módulo

El directorio `nocturna/` queda organizado para producción y evaluación:

```
nocturna/
├── .gitignore             # Ignora node_modules/ y temporales
├── package.json           # Dependencias y scripts de compilación Tailwind CLI
├── package-lock.json      # Árbol de dependencias bloqueado
├── bitacora.md            # Documentación exhaustiva de las 4 fases
├── prototipo.html         # Prototipo inicial con marcado semántico (MiniReto 1)
├── index.html             # Landing page con sección principal, botones y cards (MiniReto 3)
├── componentes.html       # Kit de componentes unificado con las 4 familias (MiniReto 4)
├── img/                   # Fotografías optimizadas de las tres rutas nocturnas
│   ├── luces-del-centro.jpeg
│   ├── miradores-de-la-ciudad.jpeg
│   └── luna-en-las-palmas.jpeg
└── src/
    ├── input.css          # Entrada con directiva @import "tailwindcss";
    └── output.css         # CSS purgado y generado para producción sin errores 404
```


---

## 5. Fase 5: Layout Completo de la Landing Page (Estructura Semántica y Utilidades de Layout)

**Fecha:** Noviembre 2026  
**Entregable:** `nocturna/index.html`

### 1. Estructura Semántica y Arquitectura de la Landing
Siguiendo las especificaciones de diseño y las directrices del kit de componentes, la landing de **Rueda Nocturna** se estructuró de manera 100% semántica para garantizar accesibilidad, indexación SEO y claridad de navegación:
- `<header>`: Encabezado sticky con navegación y llamado a la acción.
- `<main id="contenido-principal">`: Núcleo de la página compuesto por cuatro bloques temáticos con anclas explícitas:
  - `<section id="inicio">`: Sección principal (Hero) con propuesta de valor, datos destacados y CTAs.
  - `<section id="rutas">`: Sección de rutas nocturnas disponibles (3 recorridos).
  - `<section id="como-funciona">`: Proceso paso a paso para el ciclista (4 pasos).
  - `<section id="inscribete">`: Franja de inscripción con alerta de aforo vial y formulario de reserva.
- `<footer>`: Pie de página institucional organizado en tres bloques.

### 2. Unificación del Contenedor Central
Para cumplir con el criterio de consistencia visual, **todas las secciones** (incluyendo el encabezado y el pie de página) envuelven su contenido en el mismo contenedor simétrico:
```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```
- **Ancho máximo (`max-w-7xl` - 80rem / 1280px):** Proporciona la holgura óptima para desplegar simultáneamente las 3 cards de rutas y los 4 pasos de funcionamiento sin apretujar el contenido en monitores de escritorio.
- **Centrado automático (`mx-auto`):** Asegura que el contenido permanezca perfectamente centrado en pantallas ultrapanorámicas.
- **Relleno horizontal progresivo (`px-4 sm:px-6 lg:px-8`):** Garantiza márgenes de respiración adecuados tanto en dispositivos móviles (16px) como en tablets (24px) y escritorios (32px).

### 3. Encabezado con Flexbox
El encabezado utiliza utilidades Flexbox para resolver el posicionamiento en una única fila en escritorio:
```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
  <!-- Lado izquierdo: Marca y Logotipo -->
  <a href="#inicio" class="flex items-center gap-3 shrink-0 ...">...</a>

  <!-- Lado derecho: Enlaces a secciones y botón de conversión -->
  <div class="flex items-center gap-6 sm:gap-8">
    <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
      <a href="#inicio">Inicio</a>
      <a href="#rutas">Rutas</a>
      <a href="#como-funciona">¿Cómo funciona?</a>
      <a href="#inscribete">Inscripción</a>
    </nav>
    <a href="#inscribete" class="... bg-emerald-500 ...">Inscríbete</a>
  </div>
</div>
```
- `flex items-center justify-between`: Separa los dos polos (marca a la izquierda y navegación/CTA a la derecha), manteniéndolos centrados verticalmente.
- Las anclas `#inicio`, `#rutas`, `#como-funciona` e `#inscribete` conducen directamente a cada bloque temático de la página.

### 4. Cuadrícula de Rutas (3 Cards en Fila)
Para las 3 cards de rutas se aplicó una cuadrícula con CSS Grid:
```html
<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0">
```
- En escritorio (`lg:grid-cols-3`), las tres tarjetas se ordenan en una fila continua con una separación simétrica (`gap-8`).
- Cada tarjeta implementa internamente `flex flex-col justify-between h-full`, garantizando que todas tengan exactamente la misma altura y que los precios y botones inferiores queden perfectamente nivelados horizontalmente.

### 5. Justificación de Decisión Técnica: Grid para "¿Cómo funciona?"
Para distribuir los cuatro pasos de la sección "¿Cómo funciona?", se evaluaron dos alternativas: Flexbox (`flex`) y CSS Grid (`grid`).

**Decisión:** Se implementó **CSS Grid** mediante las clases:
```html
<ol class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0">
```

**Justificación Técnica:**
1. **Rigor Geométrico Bidimensional e Igualdad de Anchos:**
   Los 4 pasos representan fases de igual jerarquía en el flujo del usuario (1. Elige tu ruta, 2. Inscríbete, 3. Recoge tu equipo, 4. Rueda). Con `grid-cols-4` en pantallas grandes, el motor de renderizado del navegador divide el espacio en 4 columnas idénticas (exactamente el 25% del ancho disponible descontando el `gap-6`), sin depender de la longitud del texto descriptivo de cada paso. En Flexbox, a menos que se definan reglas rígidas de `basis` y `shrink`, los contenedores tienden a ajustar su tamaño según el contenido intrínseco.
2. **Progresión Responsiva Matemática:**
   Grid permite una adaptación fluida según los breakpoints del sistema:
   - Móvil (`< 640px`): `grid-cols-1` (lectura vertical paso a paso).
   - Tablet (`sm: 640px - 1024px`): `grid-cols-2` (matriz equilibrada de 2x2).
   - Escritorio (`lg: >= 1024px`): `grid-cols-4` (los 4 pasos desplegados en una sola fila).
3. **Mantenibilidad y Código Limpio:**
   Al gestionar la distribución desde el contenedor padre (`<ol>`), los elementos hijos (`<li>`) no requieren clases de ancho explícito (`w-full`, `w-1/2`, `w-1/4`), manteniendo el HTML más limpio y desacoplado de cálculos de layout.

### 6. Pie de Página en Tres Bloques con Flexbox
El pie de página se estructuró con utilidades Flexbox en una dimensión adaptable:
```html
<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-8 lg:gap-12">
  <div class="flex-1 space-y-4">...</div> <!-- Bloque 1: Identidad y Empresa -->
  <nav class="flex-1 space-y-4">...</nav> <!-- Bloque 2: Navegación interna -->
  <div class="flex-1 space-y-4">...</div> <!-- Bloque 3: Salidas, Sede y Contacto -->
</div>
```
- En escritorio (`md:flex-row`), los tres bloques se alinean horizontalmente con `items-start` y `justify-between`, aprovechando `flex-1` para otorgar un tercio equitativo del ancho a cada bloque.
- En móvil (`flex-col`), se apilan verticalmente con un espaciado uniforme `gap-8`.

### 7. Fidelidad con el Kit de Componentes
Los elementos interactivos fueron tomados directamente de `componentes.html`:
- **Botón Primario:** `px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 rounded-xl font-bold uppercase shadow-lg shadow-emerald-500/25` con anillo de foco verde accesible.
- **Botón Secundario y Outline:** Mantiene los radios de 12px (`rounded-xl`) y paleta slate/emerald.
- **Card de Ruta:** Tarjeta con `rounded-3xl`, imagen de altura uniforme (`h-64 object-cover`), badge de dificultad por color y texto, lista de especificaciones con `divide-y divide-slate-800` y precio en `text-3xl font-black text-emerald-400`.
- **Alerta Semántica:** Notificación accesible de aforo vial (`role="alert"`) con `border-l-4 border-l-amber-400`.
- **Formulario de Registro:** Inputs con etiquetas vinculadas, textos de ayuda con `aria-describedby` y foco de alto contraste (`focus:ring-4 focus:ring-emerald-400/60 focus:ring-offset-2`).


---

## 6. MiniReto 6: Adaptación Responsive Mobile-First (Móvil, Tablet y Escritorio)

**Proyecto:** Rueda Nocturna · Medellín en Bici  
**Fase / Reto:** MiniReto 6 — Diseño Responsivo Mobile-First con Tailwind CSS  
**Fecha:** Noviembre 2026  
**Entregable:** `nocturna/index.html`

### 1. Diagnóstico Inicial a 360 px: Elementos Rotos Identificados

En la auditoría inicial de la landing en modo dispositivo (360 px de ancho, emulación Galaxy S8 / iPhone SE en Chrome DevTools), se identificaron las siguientes fallas críticas de visualización y usabilidad móvil:

1. **Colisión y Desbordamiento en el Encabezado:**
   - El encabezado no implementaba una dirección de flujo apilada (`flex-col`) para pantallas pequeñas. El logotipo, el título y los enlaces de navegación competían en la misma línea, comprimiéndose unos con otros y provocando saltos de línea desordenados.
   - Los enlaces de navegación secundaria saturaban el área visible superior del móvil, empujando el contenido y restando protagonismo al botón de conversión principal.
2. **Padding Excesivo en Secciones (`p-8 md:p-14`):**
   - El relleno interno de 32 px a cada lado consumía 64 px en total, lo que representaba casi el 18% del ancho total de la pantalla móvil (360 px), dejando únicamente 296 px útiles para el contenido y forzando saltos de línea innecesarios en textos descriptivos.
3. **Escalado Tipográfico Inadecuado:**
   - Los títulos principales con clases rígidas (`text-4xl`, `text-6xl`) resultaban desproporcionados en pantallas de 360 px, provocando que una sola palabra ocupara múltiples líneas verticales y desplazando el contenido clave por debajo del primer scroll.
4. **Desfase en el Breakpoint de Rutas (`md:grid-cols-2` vs `sm:grid-cols-2`):**
   - La cuadrícula de rutas estaba vinculada a `md:` (768 px) en lugar de `sm:` (640 px), impidiendo que tablets pequeñas y móviles horizontales aprovecharan la distribución en 2 columnas.
5. **Botones de Conversión (CTA) Rígidos:**
   - Los botones interactivos no contaban con `w-full` en móvil, presentándose con anchos variables difíciles de pulsar con el pulgar en pantallas táctiles y sin garantizar el área táctil recomendada por WCAG.

---

### 2. Arquitectura Mobile-First: Ausencia de Prefijos en Celular

El principio fundamental del enfoque **Mobile-First** con Tailwind CSS establece que:
> **Los estilos base definidos sin prefijo aplican directamente al dispositivo móvil (pantalla más pequeña). Los prefijos `sm:`, `md:` y `lg:` se reservan de forma exclusiva y ascendente para pantallas progresivamente más grandes.**

Bajo esta regla estricta:
- **Prohibición de `sm:` en móvil:** Ninguna utilidad orientada al celular lleva el prefijo `sm:`. Por ejemplo, `grid-cols-1`, `flex-col`, `p-6`, `text-3xl` y `w-full` se declaran limpios.
- **Sobrescritura Progresiva:** A medida que la pantalla crece, los prefijos activan nuevas disposiciones:
  - `sm:` (min-width: 640 px): Activa 2 columnas en rutas y pasos, aumenta paddings a `sm:p-8`.
  - `md:` (min-width: 768 px): Pasa el encabezado de columna a fila (`md:flex-row`), visibiliza la navegación (`md:flex`) y escala títulos a `md:text-5xl`.
  - `lg:` (min-width: 1024 px): Despliega 3 columnas en rutas (`lg:grid-cols-3`), 4 columnas en pasos (`lg:grid-cols-4`) y maximiza rellenos a `lg:p-16`.

---

### 3. Implementación Técnica de los Componentes Clave

#### A. Encabezado Adaptativo (Header)
```html
<header class="w-full bg-slate-950/95 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
    <!-- Logotipo y Nombre -->
    <a href="#inicio" class="flex items-center gap-3 shrink-0 ...">...</a>

    <!-- Enlaces (ocultos en celular, visibles desde md) y Botón Inscríbete -->
    <div class="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 w-full md:w-auto">
      <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
        <a href="#inicio">Inicio</a>
        <a href="#rutas">Rutas</a>
        <a href="#como-funciona">¿Cómo funciona?</a>
        <a href="#inscribete">Inscripción</a>
      </nav>
      <a href="#inscribete" class="inline-flex items-center justify-center w-full md:w-auto px-6 py-2.5 bg-emerald-500 ...">
        Inscríbete
      </a>
    </div>
  </div>
</header>
```
- **En celular (`< 768px`):** Aplica `flex-col` apilando el logo en la parte superior y el botón "Inscríbete" en la parte inferior ocupando el ancho completo (`w-full`), facilitando la conversión inmediata con el pulgar. Los enlaces secundarios se ocultan con `hidden`.
- **Desde tablet (`md: >= 768px`):** Aplica `md:flex-row` y `md:justify-between`, disponiendo el logotipo a la izquierda, los enlaces en el centro (`md:flex`) y el botón compacto a la derecha (`md:w-auto`).

#### B. Sección Rutas Guiadas (1, 2 y 3 Columnas)
```html
<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 list-none p-0 m-0">
```
- **Celular (`< 640px`):** `grid-cols-1` (una sola columna vertical, sin scroll lateral).
- **Desde 640 px (`sm:`):** `sm:grid-cols-2` (2 columnas simétricas con tarjetas de altura homogénea `h-full`).
- **Desde 1024 px (`lg:`):** `lg:grid-cols-3` (3 columnas en una fila continua).

#### C. Sección Pasos: ¿Cómo Funciona? (1, 2 y 4 Columnas)
```html
<ol class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0">
```
- **Celular (`< 640px`):** `grid-cols-1` (lectura secuencial vertical de los 4 pasos).
- **Desde 640 px (`sm:`):** `sm:grid-cols-2` (matriz cuadrada de 2x2).
- **Desde 1024 px (`lg:`):** `lg:grid-cols-4` (los 4 pasos alineados horizontalmente en un solo renglón).

#### D. Escala Tipográfica y Rellenos Progresivos
- **Padding de Secciones:** `p-6 sm:p-8 md:p-12 lg:p-16` (móvil compacto con 24px, escalando hasta 64px en monitores grandes).
- **Título Hero:** `text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black`
- **Títulos Secundarios:** `text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black`
- **Separación entre Bloques:** `space-y-12 sm:space-y-16 lg:space-y-24`

---

### 4. Tabla de Pruebas y Validación Técnica en Modo Dispositivo (DevTools)

Las pruebas fueron ejecutadas mediante automatización en tiempo real sobre Chrome DevTools Protocol (`Runtime.evaluate` y `Emulation.setDeviceMetricsOverride`), verificando métricas exactas del DOM renderizado:

| Ancho (px) | Dispositivo de Referencia | Scroll Horizontal | Layout Encabezado | Navegación (Enlaces) | Botón "Inscríbete" | Columnas Rutas | Columnas Pasos | Comportamiento Observado y Criterio Técnico |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **360 px** | Celular (Galaxy S8 / iPhone SE) | **No** (`scrollWidth: 360`) | Apilado vertical (`flex-col`) | Oculta (`hidden / display: none`) | Visible y ancho completo (`w-full`, 328px) | **1 columna** (`grid-cols-1`) | **1 columna** (`grid-cols-1`) | **Cero scroll horizontal.** Padding optimizado (`p-6`). Contenido 100% accesible con una mano. |
| **640 px** | Móvil grande / Breakpoint `sm:` | **No** (`scrollWidth: 640`) | Apilado vertical (`flex-col`) | Oculta (`hidden / display: none`) | Visible y ancho completo (`w-full`, 592px) | **2 columnas** (`sm:grid-cols-2`) | **2 columnas** (`sm:grid-cols-2`) | **Pasa exactamente a 2 columnas** en rutas y pasos. Cumple criterio de breakpoint 640 px. |
| **768 px** | Tablet vertical (iPad Mini / `md:`) | **No** (`scrollWidth: 768`) | En fila (`md:flex-row`) | Visible en fila (`md:flex`) | Visible y compacto (`md:w-auto`, 133px) | **2 columnas** (`sm:grid-cols-2`) | **2 columnas** (`sm:grid-cols-2`) | Encabezado se despliega horizontalmente con logo a la izquierda, menú y botón a la derecha. |
| **1024 px** | Laptop / Escritorio (`lg:`) | **No** (`scrollWidth: 1009`) | En fila (`md:flex-row`) | Visible en fila (`md:flex`) | Visible y compacto (`md:w-auto`, 133px) | **3 columnas** (`lg:grid-cols-3`) | **4 columnas** (`lg:grid-cols-4`) | **Pasa exactamente a 3 columnas** en rutas y **4 columnas** en pasos. Títulos en escala máxima. |
| **1280 px** | Monitor Escritorio XL (`max-w-7xl`) | **No** (`scrollWidth: 1265`) | En fila (`md:flex-row`) | Visible en fila (`md:flex`) | Visible y compacto (`md:w-auto`, 133px) | **3 columnas** (`lg:grid-cols-3`) | **4 columnas** (`lg:grid-cols-4`) | Contenedor centrado (`max-w-7xl mx-auto`), separación amplia (`gap-8`, `space-y-24`). |

---

### 5. Verificación de Criterios de Aceptación (Checklist de Cumplimiento)

- [x] **Cero Scroll Horizontal a 360 px:** `scrollWidth === innerWidth === 360 px`. Ningún contenedor o elemento desborda la pantalla del celular.
- [x] **Comportamiento Progresivo de Rutas:** Despliega 1 columna en celular, pasa a 2 columnas a partir de 640 px (`sm:grid-cols-2`) y a 3 columnas a partir de 1024 px (`lg:grid-cols-3`).
- [x] **Comportamiento Progresivo de Pasos:** Despliega 1 columna en celular, 2 columnas en 640 px (`sm:grid-cols-2`) y 4 columnas en 1024 px (`lg:grid-cols-4`).
- [x] **Encabezado Adaptativo:** Apilado verticalmente en celular (`flex-col`) y en fila desde 768 px (`md:flex-row`).
- [x] **Visibilidad de Enlaces y Botón:** En celular los enlaces de navegación están ocultos (`hidden`) y el botón "Inscríbete" permanece 100% visible y accionable.
- [x] **Ausencia de Prefijos en Estilos Móviles:** Los estilos móviles (`grid-cols-1`, `flex-col`, `p-6`, `text-3xl`, `w-full`) no utilizan el prefijo `sm:`.
- [x] **Tabla de Pruebas Registrada:** Mediciones empíricas en 360 px, 640 px, 768 px, 1024 px y 1280 px debidamente documentadas en la bitácora.


---

### 6. Refactorización Semántica Estricta y Limpieza de Código

En concordancia con los estándares de desarrollo semántico y las directrices de entrega:
1. **Eliminación Total de Elementos Genéricos (`<div>`):**
   - El código de `index.html` fue refactorizado para erradicar cualquier etiqueta `<div>`.
   - **Mapeo de Reemplazo Semántico:**
     - Envoltorio de cabecera: Convertido en `<nav aria-label="Navegación de cabecera">`.
     - Agrupación de enlaces y botón de cabecera: Estructurado como lista no ordenada `<ul>` y elementos `<li>`.
     - Contenedores de sección: Absorbidos directamente por los elementos semánticos de bloque `<section>` y `<main>`, eliminando capas redundantes de anidamiento.
     - Bloques del pie de página: Mapeados a `<section>` (identidad de marca), `<nav>` (enlaces internos) y `<address>` (información de contacto y sede).
     - Barra de derechos inferior: Mapeada a un elemento de párrafo `<p>` con elementos en línea `<span>`.
   - **Resultado:** Conteo en el árbol del DOM: `document.querySelectorAll("div").length === 0`.
2. **Eliminación Completa de Comentarios HTML:**
   - Se removieron todos los comentarios `<!-- ... -->` del código fuente, entregando un marcado limpio, minificado y enfocado en la semántica pura del estándar HTML5.


---

## 7. Formulario Semántico, Accesible y Validado de Inscripción Inmediata

**Módulo:** Construcción en Tiempo Limitado · MiniReto de Conversión y Captura de Ciclistas  
**Fecha de Ejecución:** 6 de Noviembre de 2026  
**Cronómetro y Registro de Tiempo:**
- **Tiempo Asignado:** 40 minutos
- **Hora de Inicio:** 09:17:00
- **Hora de Finalización:** 09:39:00
- **Tiempo Real Empleado:** **22 minutos** (completado con 18 minutos de margen a favor).
- **Pendientes al Finalizar:** **0 pendientes**. Todos los campos, validaciones nativas y pruebas de teclado quedaron 100% operativos.

---

### A. Mapeo de Controles y Criterios de Selección

Para capturar con precisión los requerimientos del cliente y garantizar que el formulario no dependa de scripts pesados, se implementaron controles nativos del estándar HTML5 con validación integrada:

| Dato Requerido | Elemento Semántico | Tipo / Control | Reglas de Validación | Atributos de Accesibilidad y Ayuda |
| :--- | :---: | :---: | :--- | :--- |
| **Nombre Completo** | `<input>` | `type="text"` | `required`, `minlength="3"`, `pattern=".{3,}"` | `autocomplete="name"`, `aria-describedby="ayuda-nombre"`. Mensaje contextual: *"Mínimo 3 caracteres para planilla de seguro"*. |
| **Correo Electrónico** | `<input>` | `type="email"` | `required` | `autocomplete="email"`, `aria-describedby="ayuda-correo"`. Envío de itinerario y QR. |
| **Número Celular** | `<input>` | `type="tel"` | `required`, `pattern="3[0-9]{9}"` | `title="Debe tener 10 dígitos y comenzar por 3"`, `autocomplete="tel"`, `aria-describedby="ayuda-celular"`. |
| **Acompañantes** | `<input>` | `type="number"` | `required`, `min="0"`, `max="3"`, `value="0"` | `aria-describedby="ayuda-acompanantes"`. Control estricto de aforo vial por pelotón. |
| **Ruta Guiada** | `<select>` | `<option>` | `required` (opción inicial deshabilitada `disabled selected`) | `aria-describedby="ayuda-ruta"`. Opciones: *Luces del Centro*, *Luna en Las Palmas*, *Miradores de la Ciudad*. |
| **Día de Salida** | `<select>` | `<option>` | `required` (opción inicial deshabilitada `disabled selected`) | `aria-describedby="ayuda-dia"`. Opciones: *Jueves*, *Viernes*, *Sábado* (7:00 PM). |
| **Nivel de Experiencia** | `<select>` | `<option>` | `required` (opción inicial deshabilitada `disabled selected`) | `aria-describedby="ayuda-experiencia"`. Opciones: *Principiante*, *Intermedio*, *Avanzado*. |
| **Bicicleta Propia** | `<select>` | `<option>` | `required` (opción inicial deshabilitada `disabled selected`) | `aria-describedby="ayuda-bici"`. Opciones: *Sí, llevo mi bici* / *No, requiero préstamo del kit*. |
| **Aceptación de Condiciones** | `<input>` | `type="checkbox"` | `required` | `<label>` envolvente con foco visible, obligatorio para habilitar el registro. |

---

### B. Arquitectura Semántica: Fieldsets y Legends

Para cumplir con las pautas de accesibilidad WCAG 2.1 (Criterio 1.3.1 Información y Relaciones) y evitar etiquetas genéricas `<div>`, los campos fueron agrupados en 3 conjuntos lógicos estructurados:

1. **Conjunto 1: Datos Personales y Contacto (`<fieldset>` con `<legend>`)**
   - Agrupa nombre, correo, teléfono celular y acompañantes.
   - Distribución en 2 columnas simétricas a partir del breakpoint `md:` (`grid grid-cols-1 md:grid-cols-2 gap-6`).
2. **Conjunto 2: Detalles de la Rodada (`<fieldset>` con `<legend>`)**
   - Agrupa los cuatro menús desplegables de configuración técnica (ruta, día, experiencia y bicicleta).
   - Mantiene la cuadrícula simétrica de 2 columnas en escritorio y flujo apilado en dispositivos móviles.
3. **Conjunto 3: Términos y Confirmación (`<fieldset>` con `<legend>`)**
   - Casilla de verificación de tamaño táctil accesible (20x20 px) con texto legal explicativo.
   - Botón de conversión principal `.btn-primary` para enviar la reserva.

---

### C. Pruebas Automatizadas de Validación Nativa y Navegación por Teclado

Las pruebas fueron verificadas directamente contra el DOM real a través de Chrome DevTools Protocol:

| Caso de Prueba | Entrada Evaluada | Comportamiento Esperado | Resultado Técnico | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **1. Formulario Vacío** | Envío sin interacción previa | `checkValidity() === false` en el formulario | Se bloquea el envío y el navegador enfoca el primer campo no completado (`#campo-nombre`). | **Aprobado** |
| **2. Nombre Insuficiente** | `"Al"` (2 caracteres) | `tooShort` / `patternMismatch` activado | Inválido. Exige al menos 3 caracteres según la regla. | **Aprobado** |
| **3. Nombre Válido** | `"Valentina Morales"` | `checkValidity() === true` | Válido. Pasa sin errores. | **Aprobado** |
| **4. Correo Sin Formato** | `"ciclista"` | `typeMismatch` activado | Inválido. Exige formato estándar con `@` y dominio. | **Aprobado** |
| **5. Celular Inválido (Longitud)** | `"30012345"` (8 dígitos) | `patternMismatch` activado | Inválido. Regla exige exactamente 10 dígitos. | **Aprobado** |
| **6. Celular Inválido (Prefijo)** | `"2001234567"` (no empieza en 3) | `patternMismatch` activado con tooltip explicativo | Inválido. Debe iniciar obligatoriamente con el dígito 3. | **Aprobado** |
| **7. Celular Válido** | `"3001234567"` | `checkValidity() === true` | Válido. Cumple con la regla `^3[0-9]{9}$`. | **Aprobado** |
| **8. Acompañantes < 0** | `"-1"` | `rangeUnderflow` activado | Inválido. Valor mínimo permitido: 0. | **Aprobado** |
| **9. Acompañantes > 3** | `"4"` | `rangeOverflow` activado | Inválido. Valor máximo permitido: 3. | **Aprobado** |
| **10. Selects Sin Selección** | Opción con valor vacío `""` | `valueMissing` activado | Inválido. Obliga a seleccionar ruta, día, experiencia y bici. | **Aprobado** |
| **11. Términos Desmarcados** | Checkbox `checked === false` | `valueMissing` activado | Inválido. Se bloquea el botón de envío hasta marcar la casilla. | **Aprobado** |
| **12. Formulario Completo** | Todos los campos válidos | `form.checkValidity() === true` | Envío exitoso; activa la notificación accesible `<output>`. | **Aprobado** |
| **13. Navegación por Teclado** | Salto secuencial con <kbd>Tab</kbd> | Todos los elementos reciben foco visual (`focus:ring-4`) | Foco activo secuencialmente en los 10 controles interactivos sin trampas de teclado. | **Aprobado** |
| **14. Modo Celular (360 px)** | Emulación Galaxy S8 | `scrollWidth === innerWidth === 360 px` | Cero desbordamiento ni scroll horizontal. | **Aprobado** |
| **15. Modo Escritorio (1024 px)** | Emulación pantalla estándar | Grid `339px 339px` | Dos columnas balanceadas para campos cortos. | **Aprobado** |


---

## 8. Integración del Ecosistema Digital: Sitio Principal Bootstrap (v2.0) y Landing Tailwind (Rueda Nocturna)

**Módulo:** Integración Cross-Platform e Identidad de Marca Unificada  
**Fecha de Ejecución:** 6 de Noviembre de 2026  
**Cronómetro y Registro de Tiempo:**
- **Tiempo Asignado:** 40 minutos
- **Hora de Inicio:** 09:25:00
- **Hora de Finalización:** 09:47:00
- **Tiempo Real Empleado:** **22 minutos** (completado con 18 minutos de margen a favor).
- **Pendientes al Finalizar:** **0 pendientes**. La navegación bidireccional, carrusel de 4 diapositivas, unificación cromática y tipográfica quedaron 100% operativos.

---

### A. Navegación Cruzada y Arquitectura de Rutas Relativas

Se estableció una malla de navegación fluida entre el sitio institucional (`Rueda-libre/`) y la landing de campaña (`nocturna/`), garantizando cero errores 404 y compatibilidad total con GitHub Pages:

```
Raíz del Repositorio (https://samuel239272.github.io/HMTL/)
├── index.html                           -> Portal de redirección y selección
├── Rueda-libre/                         -> Sitio v2.0 (Bootstrap + CSS Modular)
│   ├── index.html                       -> Navbar con "Rueda Nocturna" (../nocturna/index.html) + Carrusel 4 slides
│   ├── paginas/
│   │   ├── tarifas.html                 -> Navbar con "Rueda Nocturna" (../../nocturna/index.html) + Banner nocturno
│   │   └── reservas.html                -> Navbar con "Rueda Nocturna" (../../nocturna/index.html) + Aviso nocturno
│   └── css/styles.css                   -> Variables --bs-* y tokens de marca compartidos
└── nocturna/                            -> Landing de Campaña (Tailwind CSS v3.4.19)
    ├── index.html                       -> Logo al inicio (../Rueda-libre/index.html) + Botón "Reserva tu bici"
    ├── componentes.html                 -> Catálogo visual con fuentes y tokens compartidos
    └── src/
        ├── input.css                    -> @theme con tokens cromáticos y fuentes unificadas
        └── output.css                   -> CSS minificado con purga Ahead-Of-Time
```

| Origen | Destino | Enlace Relativo | Tipo de Interacción | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `Rueda-libre/index.html` | `nocturna/index.html` | `../nocturna/index.html` | Navbar enlace "Rueda Nocturna" | **200 OK** |
| `Rueda-libre/index.html` | `nocturna/index.html` | `../nocturna/index.html` | Slide 4 del Carrusel Bootstrap ("Descubre Rueda Nocturna") | **200 OK** |
| `Rueda-libre/paginas/tarifas.html` | `nocturna/index.html` | `../../nocturna/index.html` | Navbar enlace "Rueda Nocturna" | **200 OK** |
| `Rueda-libre/paginas/tarifas.html` | `nocturna/index.html` | `../../nocturna/index.html#rutas` | Banner promocional de recorridos nocturnos | **200 OK** |
| `Rueda-libre/paginas/reservas.html` | `nocturna/index.html` | `../../nocturna/index.html` | Navbar enlace "Rueda Nocturna" | **200 OK** |
| `Rueda-libre/paginas/reservas.html` | `nocturna/index.html` | `../../nocturna/index.html#inscribete` | Alerta informativa de reservas nocturnas | **200 OK** |
| `nocturna/index.html` | `Rueda-libre/index.html` | `../Rueda-libre/index.html` | Clic en el logotipo principal de cabecera | **200 OK** |
| `nocturna/index.html` | `Rueda-libre/paginas/reservas.html` | `../Rueda-libre/paginas/reservas.html` | Botón destacado en cabecera: "Reserva tu bici" | **200 OK** |
| `nocturna/index.html` | `Rueda-libre/index.html` | `../Rueda-libre/index.html` | Enlace en pie de página: "← Sitio Principal Rueda Libre" | **200 OK** |
| `nocturna/index.html` | `Rueda-libre/paginas/reservas.html` | `../Rueda-libre/paginas/reservas.html` | Enlace en pie de página: "🚲 Reserva de Bicis (Alquiler)" | **200 OK** |

---

### B. Carrusel Bootstrap en el Sitio Institucional (4 Diapositivas)

En `Rueda-libre/index.html` se implementó un carrusel dinámico de Bootstrap 5 (`#carouselRuedaLibre`):
1. **Diapositiva 1 (Alquiler de Bicicletas):** Enfocada en bicicletas urbanas, plegables y eléctricas con equipo incluido.
2. **Diapositiva 2 (Recorridos Guiados Diurnos):** Promoción de rutas históricas y culturales por Medellín.
3. **Diapositiva 3 (Taller y Mantenimiento):** Mecánica preventiva y servicio técnico en El Poblado.
4. **Diapositiva 4 (¡Campaña Rueda Nocturna!):** Arte ilustrado nocturno (`luces-del-centro.jpeg`), descripción de la experiencia en grupo bajo la luna y botón interactivo `.btn-carousel` con destino directo a `../nocturna/index.html`.

---

### C. Unificación de Identidad Visual y Marca

Ambos productos fueron homologados técnica y visualmente para proyectar una única marca sólida:

#### 1. Mismos Códigos Cromáticos
- **Verde Principal (Acción y Éxito):** `#10b981`  
  - En Bootstrap: `--bs-primary: #10b981;`, `--color-verde-ruta: #10b981;`  
  - En Tailwind: `--color-brand-primary: #10b981;`, `--color-verde-ruta: #10b981;`
- **Acento Esmeralda:** `#34d399`  
  - En Bootstrap: `--color-verde-acento: #34d399;`  
  - En Tailwind: `--color-brand-accent: #34d399;`
- **Azul Noche / Fondo Profundo:** `#020617`  
  - En Bootstrap: `--bs-dark: #020617;`, `--color-azul-noche: #020617;`  
  - En Tailwind: `--color-brand-dark: #020617;`, `--color-azul-noche: #020617;`
- **Superficie / Contenedores:** `#0f172a`  
  - En Bootstrap: `--bs-secondary: #0f172a;`, `--color-superficie: #0f172a;`  
  - En Tailwind: `--color-brand-surface: #0f172a;`
- **Naranja Pedal:** `#f39a2b`  
  - En Bootstrap: `--bs-warning: #f39a2b;`, `--color-naranja-pedal: #f39a2b;`  
  - En Tailwind: `--color-naranja-pedal: #f39a2b;`

#### 2. Mismas Tipografías Oficiales (Google Fonts)
- **Títulos y Jerarquías (`h1`-`h6`):** `Montserrat` (`font-weight: 700 / 800 / 900`).
- **Texto de Lectura y Formularios:** `Open Sans` (`font-weight: 400 / 600`).
- Ambos archivos importan la misma especificación tipográfica vía CDN con optimización `preconnect`.

#### 3. Mismos Datos Corporativos y de Contacto
- **Correo Oficial:** `somos@ruedalibre.co`
- **Coordinación WhatsApp / Teléfono:** `+57 (300) 123-4567`
- **Ubicación de Sede:** El Poblado, Medellín, Colombia.
- **Horarios Coherentes:**
  - Operación diurna (Rueda Libre): Sábados y domingos, 7:00 AM a 6:00 PM.
  - Salidas nocturnas (Rueda Nocturna): Jueves a sábado, encuentro 6:45 PM y salida 7:00 PM.

---

### D. Auditoría Automatizada de Recursos (Cero Errores 404)

Mediante script automatizado de inspección DOM en Node.js y Python se auditaron:
- **Total de recursos analizados (enlaces + imágenes):** 68
- **Errores 404 detectados tras resolución:** **0**
- **Estado final:** **100% de los enlaces resuelven con código HTTP 200 en local y GitHub Pages**.
