# ALDRABA Seguridad · plantilla para una empresa de alarmas

> **Sitio de demostración.** ALDRABA Seguridad es una empresa **ficticia**. El
> nombre, el CIF, la dirección, el teléfono, el correo, los horarios, los planes,
> los precios, los tiempos de la secuencia y la zona de trabajo están
> **inventados** para enseñar la plantilla. No corresponden a ninguna empresa
> real.
>
> **Y no hay ni una estadística de robos en toda la web.** Es la otra mitad del
> encargo y está explicada abajo.

Plantilla estática —HTML, CSS y un `main.js`— sin framework, sin build, sin
backend y sin npm. Se sirve tal cual desde GitHub Pages.

---

## El concepto: «Secuencia»

El sector de las alarmas vende, casi sin excepción, con miedo: la sombra en la
ventana, el porcentaje de robos de tu provincia, el «cada X minutos entran en una
casa». Es eficaz y es tramposo, porque desplaza la conversación justo del sitio
donde debería estar.

Esta plantilla la desplaza de vuelta:

> Lo que contratas no es una sirena. Es lo que pasa en los dos minutos siguientes.

Lo que una empresa de alarmas vende de verdad es **un procedimiento**: quién
recibe la señal, quién la verifica, a quién llama, en qué orden, qué queda por
escrito y —sobre todo— **qué no puede hacer**. Así que el recurso protagonista no
es una recreación de un robo: es la secuencia entera, segundo a segundo, incluido
el paso en el que resulta que era el gato.

### Las tres decisiones que definen la plantilla

1. **Cero miedo, cero estadísticas.** No hay datos de delincuencia porque una
   empresa inventada no los tiene, y porque una cifra con pinta de dato es
   precisamente el mecanismo que se está evitando. Las únicas cifras son de la
   empresa ficticia y están marcadas como tales.
2. **La sección que nadie publica: las falsas alarmas.** Es el problema cotidiano
   real de este oficio —el que decide si dentro de un año sigues armando el
   sistema— y ocupa una sección entera, con las causas y qué se hace con cada una.
   Sin porcentajes: los nuestros serían inventados y se dice así.
3. **Una sección entera de límites.** Lo que una empresa de alarmas **no puede
   hacer**: no detiene a nadie, no garantiza que venga la policía, no avisa sin
   verificar, no mira tus cámaras «por si acaso». Son límites legales, y ponerlos
   en portada es el argumento de venta honesto que el sector no usa.

Y por eso el nombre. Una **aldraba** es la argolla de llamar a una puerta: el
aparato más viejo del oficio, que no impide entrar a nadie —solo avisa de que hay
alguien ahí—. Que es exactamente lo que hace una alarma.

---

## Mapa de secciones

| # | Sección | `id` | Qué hace |
|---|---|---|---|
| — | Hero | `inicio` | El titular del concepto, la placa SVG con la señal expandiéndose y el aviso de que aquí no habrá estadísticas. |
| — | Franja | — | Marquesina de servicios enganchada a la velocidad del scroll. |
| 01 | **La secuencia** | `secuencia` | **La protagonista.** Escena anclada: el scroll es el reloj, de 00:00 a 02:00. Ocho pasos en un carril horizontal, el reloj y la etapa actualizándose, y una **rama** en 00:12 donde termina la mayoría de las secuencias. |
| 02 | Qué se instala | `equipo` | Las seis piezas reales de un sistema, con la nota de que más sensores no es mejor. |
| 03 | **Falsas alarmas** | `falsas` | Pila de tarjetas con las cuatro causas más comunes y qué se hace con cada una. Sin un solo porcentaje, y dicho. |
| 04 | **Límites** | `limites` | Seis cosas que una empresa de alarmas no puede hacer. Sobre fondo de panel y con filo rojo. |
| 05 | Cámaras | `camaras` | Plano SVG de dónde puede mirar una cámara y dónde no, más las cinco reglas de privacidad. |
| 06 | Planes | `planes` | Tabla de precios **de muestra**, la letra pequeña en grande, y las cifras de la empresa con contador. |
| 07 | Preguntas | `preguntas` | `<details>` nativos, incluida la respuesta «puede que no necesites esto». |
| 08 | Visita | `visita` | Formulario de demostración (no envía nada) y mapa que **solo se carga al pulsar**. |

---

## Los recursos de movimiento

1. **El reloj de la secuencia** (`#secuencia-escena`): escena anclada con `scrub`.
   El scroll mueve **un solo valor**, el segundo. De ese valor salen el reloj, el
   paso activo y el desplazamiento horizontal del carril, que se calcula en cada
   refresco porque depende del ancho real del contenido.
2. **Pila de tarjetas** en las falsas alarmas: el `sticky` va en el `<li>` y su
   recorrido lo da el `margin-bottom`. (Ponerlo en la tarjeta y dar `min-height`
   al `<li>` deja tarjetas fantasma.)
3. **Revelado por palabras** en los titulares, con `aria-label` en el encabezado y
   las piezas en `aria-hidden`.
4. **Franja ligada al scroll**: acelera con la velocidad de la rueda (`timeScale`)
   y vuelve sola a su ritmo.
5. **La señal de la placa**: una onda que se expande en bucle y la aguja girando
   con `svgOrigin` (con `transformOrigin` a secas, GSAP mide sobre el *bbox* y la
   aguja se va de sitio).
6. **Apariciones por `IntersectionObserver`**, no `ScrollTrigger {once:true}`, que
   no dispara para lo que ya está en pantalla al cargar.
7. **Contadores**, **botones magnéticos** y **cursor contextual**, estos dos solo
   donde hay `hover` real.
8. **Lenis** como único motor de scroll, con `lerp: 0.18`: con un scrub
   horizontal, el asentamiento normal de Lenis se lee como «el carril se va un
   segundo para el otro lado».

### Sin JavaScript, con GSAP bloqueado o con movimiento reducido

La página **se lee entera**. Los estados vacíos solo se aplican bajo
`html.has-motion`, que se añade cuando GSAP existe **y** el usuario no ha pedido
movimiento reducido.

Con movimiento reducido se apaga **el movimiento, no el contenido**: el carril de
la secuencia deja de anclarse y vuelve a ser una lista con scroll horizontal que
se recorre con el dedo o con el teclado, los ocho pasos se leen igual, y los
contadores muestran su cifra final.


---

## La cortina de entrada

Obligatoria en toda la biblioteca, y **el gesto sale del concepto de esta
plantilla**, no es la misma cortina repintada: aquí la argolla se dibuja, la señal sale en ondas y **el reloj cuenta la ventana de entrada** de 00:03 a 00:00; al llegar a cero sin incidencia pone «DESARMADO» y la hoja se levanta con el canto curvado.

La mecánica es la de siempre: línea de tiempo encadenada, `expo.inOut`, borde
curvo y **entrega limpia al hero** —el revelado del titular arranca mientras la
cortina todavía se está yendo, no después—.

**Se retira siempre.** Sin GSAP y con `prefers-reduced-motion` la hoja de estilos
ni la pinta (`html:not(.has-motion) .cortina{display:none}`), y con movimiento hay
una red de seguridad por tiempo en `main.js` que la quita y lanza el arranque
pase lo que pase, para que la página no pueda quedarse tapada si una animación se
atasca o las tipografías no resuelven.

---

## Accesibilidad

- Contraste AA sobre el fondo casi negro. **El azul de marca `#3D5AFE` se queda en
  3,9 sobre el fondo, así que no se usa nunca como color de texto pequeño**: para
  texto va `--azul-claro` (5,99) y el azul de marca queda para rellenos, bordes y
  fondos de botón, donde encima va hueso (5,1). Es el mismo truco de siempre —el
  color de marca no se retoca, se cambia dónde se usa—.
- El texto secundario se apaga **con color, nunca con `opacity`**.
- Menú móvil con `aria-expanded`, `aria-controls`, cierre con `Escape` y foco
  devuelto al botón.
- El carril y la tabla reciben `tabindex="0"` y `role="group"` **solo cuando de
  verdad desbordan**.
- El reloj y la etapa van en un `role="status"`, así que el cambio de paso se
  anuncia sin robar el foco.
- Preguntas con `<details>`/`<summary>` nativos: funcionan sin JavaScript.

---

## Cómo adaptarla a una empresa real

1. **Los datos ficticios, todos fuera.** Busca `ALDRABA`, `981 00 00 00`,
   `aldraba.example`, `Mareas`, `Ferrol` y `B00000000` en `index.html`,
   `aviso-legal.html`, `404.html` y `manifest.json`.
2. **Pon el número de inscripción.** En el aviso legal hay un hueco marcado donde
   va el número del Registro Nacional de Empresas de Seguridad, y el de la central
   receptora. Aquí **no se ha inventado ninguno a propósito**: es un dato
   verificable y falsificarlo sería grave.
3. **Los tiempos de la secuencia son de ejemplo.** Cámbialos por los de tu
   procedimiento real —están en los `data-seg` de cada `.paso` y en el texto— y
   deja el aviso de que se configuran caso por caso.
4. **Quita los sellos de demostración**: el comentario al principio de cada HTML,
   el `<meta name="robots" content="noindex, nofollow">` y el `<p class="sello">`.
5. **El acento vive en dos tokens**: `--azul` (rellenos) y `--azul-claro` (texto)
   en `css/style.css`. Si cambias el primero, recomprueba el segundo: el texto
   necesita 4,5 sobre el fondo.
6. **El mapa** apunta a la localidad. Mantén la carga **solo al pulsar**: si no, el
   aviso de cookies estaría mintiendo.
7. **No metas estadísticas de robos.** Si tienes datos propios y verificables,
   publícalos con su fuente y su fecha. Si no, deja la web como está: se vende
   igual de bien y se sostiene mucho mejor.
8. Sustituye `assets/og.png` regenerándolo de `og-fuente.html`.

---

## Estructura

```
index.html          portada
aviso-legal.html    aviso legal y privacidad
404.html            página de error
css/style.css       toda la hoja de estilos
js/main.js          contenido, la secuencia y el movimiento
assets/             logotipo, icono e imagen para compartir
og-fuente.html      composición de la que se captura assets/og.png
manifest.json       manifiesto de aplicación web
CREDITOS.md         procedencia de cada recurso
.nojekyll           para que GitHub Pages sirva los archivos tal cual
```

## Licencia y uso

Plantilla de muestra. Reutilizable, pero **no se publica tal cual**: antes hay que
sustituir todos los datos ficticios por los reales, poner el número de inscripción
y retirar los avisos de demostración. Tipografías y librerías, en `CREDITOS.md`.
