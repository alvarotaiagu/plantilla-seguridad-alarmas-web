# Créditos y procedencia de los recursos

**Sitio de demostración. ALDRABA Seguridad es un negocio ficticio.**

## Fotografías: ninguna

No hay ni una fotografía. En este sector concreto es además una decisión de
fondo: las imágenes de archivo del ramo —la sombra en la ventana, la mano con la
palanca, el niño asustado— son el argumento de venta que esta plantilla evita.
Todo lo visual está dibujado a mano en SVG para este repositorio.

## Estadísticas: tampoco

**No hay ni un dato de delincuencia en toda la web.** Ni porcentajes de robos, ni
«cada X minutos», ni comparativas entre municipios. Una empresa inventada no tiene
datos propios, y una cifra con pinta de dato es lo que convierte una web de
alarmas en un folleto de miedo.

Las únicas cifras que aparecen —años, municipios, personas, horas de central— son
**datos de la empresa ficticia**, están marcados como tales y no dicen nada sobre
el mundo real.

## Obra gráfica

| Archivo | Qué es |
|---|---|
| `assets/logo.svg` | Marca: una aldraba —la argolla de llamar a una puerta— con la señal saliendo a los lados. |
| `assets/favicon.svg` | La misma aldraba, simplificada, sobre el fondo. |
| `assets/og.png` | Imagen para compartir (1200×630), capturada de una composición HTML propia (`og-fuente.html`). |
| Placa del encabezado | SVG en línea: la retícula, el círculo de la señal y la aguja que gira. |
| Plano de cámaras | SVG en línea: parcela, vivienda, cono de visión permitido, vía pública y casa del vecino con sus dos vetos. |
| Carril de la secuencia | HTML y CSS: ocho tarjetas con su segundo, y el marcador con el reloj. |

## Cómo funciona la secuencia

El scroll mueve un único valor —el segundo— entre 0 y 120. De ese valor salen tres
cosas: el reloj, qué tarjeta se marca como activa y cuánto se desplaza el carril.
Todo se recalcula, no hay una animación grabada. Y lo importante: **la misma
función que pinta el estado se llama al cargar la página**, así que con GSAP
bloqueado o con movimiento reducido el carril sigue siendo una lista que se lee y
se recorre con el teclado.

## Tipografías

| Familia | Uso | Licencia |
|---|---|---|
| [Khand](https://fonts.google.com/specimen/Khand) | Titulares, cifras y reloj | SIL Open Font License 1.1 |
| [Space Mono](https://fonts.google.com/specimen/Space+Mono) | Rótulos, segundos, tablas y botones | SIL Open Font License 1.1 |
| [Sora](https://fonts.google.com/specimen/Sora) | Texto corrido | SIL Open Font License 1.1 |

## Librerías

| Librería | Versión | Origen | Licencia |
|---|---|---|---|
| GSAP + ScrollTrigger | 3.12.5 | jsDelivr | Licencia estándar de GreenSock |
| Lenis | 1.1.13 | jsDelivr | MIT |

## Mapa

`iframe` de Google Maps sin clave de API que **solo se inserta al pulsar el
botón**, nunca antes —sería contradecir el propio aviso de cookies—. Apunta a la
localidad de **Ferrol**, nunca a un portal concreto: la dirección es inventada.
