# Bitácora de Aprendizaje · Rueda Nocturna

---

### MiniReto 1: Prototipo nocturno con Play CDN
Se creó el archivo `nocturna/prototipo.html` para validar rápidamente la sección principal con el equipo de diseño utilizando Tailwind Play CDN, estructurando un único encabezado `<h1>`, la etiqueta de campaña, métricas clave y el botón "Inscríbete". Se aplicaron exclusivamente utilidades atómicas de espaciado, dimensiones, color y tipografía sin escribir estilos personalizados ni recurrir a Bootstrap, documentando la diferencia fundamental entre el modelo rígido basado en componentes prediseñados y la flexibilidad compositiva del enfoque *utility-first*.

---

### MiniReto 2: Del prototipo al proyecto real: CLI y botones
Se realizó la transición del prototipo hacia un entorno de compilación profesional con Tailwind CLI, configurando `src/input.css`, `.gitignore` y la generación vigilada de `src/output.css` en `nocturna/index.html`. Se construyeron las tres variantes base de botones (primario, secundario y contorno) con halos de enfoque (`ring-*`) accesibles para navegación por teclado, comprobando el mecanismo de eliminación de código muerto (JIT) donde clases no utilizadas como `bg-pink-500` son totalmente excluidas del archivo final.

---

### MiniReto 3: Cards de rutas nocturnas
Se construyó la sección "Rutas" diseñando una tarjeta estructurada y reutilizable para cada uno de los tres recorridos nocturnos (*Luces del Centro*, *Miradores de la Ciudad* y *Luna en Las Palmas*), incorporando fotografías con altura uniforme, lista jerarquizada de detalles técnicos y el botón primario del kit. Las dificultades se identificaron mediante color y texto explícito sin depender únicamente de la percepción visual, sumando microinteracciones en estado `:hover` con elevación de sombra que evitan cualquier desplazamiento indeseado del contenido.

---

### MiniReto 4: Kit de componentes Rueda Nocturna v0.1
Se centralizó la librería de diseño en `nocturna/componentes.html`, reuniendo los botones, las tarjetas de ruta, tres alertas semánticas con atributos ARIA accesibles (`role="alert"` y `role="status"`) y campos de formulario con etiquetas `<label>` vinculadas y foco visible. Se establecieron y aplicaron las reglas transversales de consistencia en radios de curvatura, escala de espaciado y paleta cromática, publicando la página en GitHub Pages para garantizar la carga de `src/output.css` sin enlaces rotos ni errores 404.

---

### MiniReto 5: Maquetación de la landing
Se implementó la maquetación completa de la landing de escritorio en `nocturna/index.html` utilizando elementos semánticos nativos (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) con identificadores para navegación fluida mediante anclas. La estructura organiza el encabezado con Flexbox, distribuye las tres rutas en una cuadrícula CSS Grid de 3 columnas, ordena la guía paso a paso de "¿Cómo funciona?" y estandariza todas las secciones dentro de un mismo contenedor centrado con ancho máximo y relleno homogéneo.

---

### MiniReto 6: La noche cabe en tu celular: responsive
Se refactorizó la landing page bajo la metodología *mobile-first*, garantizando una navegación fluida a 360 px sin desbordamientos ni scroll horizontal mediante utilidades base sin prefijo para dispositivos móviles. Con los puntos de interrupción `sm:`, `md:` y `lg:`, el encabezado pasa de apilado a barra horizontal, las rutas escalan gradualmente de 1 a 2 y 3 columnas, los pasos del proceso se redistribuyen en 4 columnas y los enlaces secundarios de cabecera se ocultan en pantallas pequeñas para priorizar el botón de acción principal.

---

### MiniReto 7: Marca nocturna: tema propio y modo oscuro
Se configuró la identidad visual oficial dentro del archivo `tailwind.config.js`, mapeando los colores institucionales (incluyendo *Amarillo Farol* `#FFD166`), extendiendo las familias tipográficas *Montserrat* y *Open Sans*, y reemplazando cualquier color genérico del código. Asimismo, se implementó el soporte nativo para modo oscuro mediante la variante `dark:` vinculada a las preferencias del sistema (`prefers-color-scheme`), verificando con herramientas de desarrollo que los ratios de contraste superen holgadamente las pautas WCAG (mínimo 4.5:1).

---

### MiniReto 8: Código legible y veredicto: Bootstrap vs Tailwind
Se mejoró la mantenibilidad y legibilidad del marcado HTML extrayendo clases atómicas repetitivas en botones hacia utilidades semánticas (`.btn-primary`, `.btn-secondary`, `.btn-outline`) mediante `@apply` en `@layer components`. Además, se auditó el rendimiento en red tras compilar con `--minify`, registrando que Tailwind genera una hoja de apenas ~36 KB libre de JavaScript bloqueante frente a los más de 312 KB de Bootstrap, sustentando la recomendación técnica de migrar todo el ecosistema hacia Tailwind CSS.

---

### MiniReto 9: Contrarreloj 1: inscripción a Rueda Nocturna
En una sesión cronometrada de 40 minutos se construyó el formulario de inscripción accesible y semántico en la landing page, agrupado en conjuntos de campos con `<fieldset>` y `<legend>`. El formulario incorpora validación nativa estricta en HTML5 (campos obligatorios, longitud mínima de nombre, expresión regular para celulares colombianos de 10 dígitos y rango de acompañantes de 0 a 3), estilizado con la estética del kit, compatibilidad completa con navegación por teclado y soporte para modo oscuro.

---

### MiniReto 10: Contrarreloj 2: un solo ecosistema
Se integraron en 40 minutos de desarrollo el sitio corporativo diurno en Bootstrap (v2.0) y la landing nocturna en Tailwind CSS, unificando paleta de colores, tipografías y datos de contacto oficiales. Se estableció navegación cruzada bidireccional mediante enlaces relativos entre carpetas, sumando la opción "Rueda Nocturna" a la barra de navegación del sitio principal, una cuarta diapositiva promocional en su carrusel y botones de retorno y reserva diurna en la landing sin generar fallos 404.

---

### MiniReto 11: Contrarreloj 3: requerimiento de última hora
Se diseñó e implementó la sección comercial "Planes Rueda Nocturna" en un contrarreloj de 45 minutos, estructurando una cuadrícula responsive (1 columna en móviles y 3 columnas desde `lg:`) con tarjetas de idéntica altura y botones alineados al fondo mediante Flexbox. El plan *Pareja* se jerarquizó visualmente con el distintivo "Más elegido", borde esmeralda de 2px y sombra profunda sin alterar las proporciones de las tarjetas adyacentes, preservando el modelo de caja y el soporte de contraste en modo oscuro.

---

### MiniReto 12: Lanzamiento Rueda Nocturna: entrega y demo
Se consolidó la entrega oficial auditando el ecosistema con el validador Nu HTML Checker del W3C (0 errores y 0 advertencias), verificando la ausencia de estilos en línea y comprobando el despliegue automático del CSS minificado en GitHub Pages. Finalmente, se documentó el producto en el `README.md` y se ensayó una presentación ejecutiva de 3 minutos estructurada en contexto, demostración multidispositivo en vivo y decisiones técnicas estratégicas, registrando la retroalimentación positiva de evaluadores pares.

