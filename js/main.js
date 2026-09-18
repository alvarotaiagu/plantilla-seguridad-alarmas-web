/* ==========================================================================
   ALDRABA Seguridad — plantilla de demostración (negocio ficticio)
   Concepto «Secuencia». GSAP, ScrollTrigger y Lenis por CDN; sin ellos la
   página se lee entera y la secuencia se recorre como una lista normal.
   ========================================================================== */

(function () {
  "use strict";

  var raiz = document.documentElement;
  var mqReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducido = mqReducido.matches;
  var gsapListo = !!(window.gsap && window.ScrollTrigger);
  var movimiento = gsapListo && !reducido;

  if (gsapListo) { window.gsap.registerPlugin(window.ScrollTrigger); }
  if (movimiento) { raiz.classList.add("has-motion"); }

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ======================================================================
     1. CONTENIDO
     ====================================================================== */

  (function menu() {
    var boton = $("#hamburguesa"), nav = $("#nav");
    if (!boton || !nav) { return; }
    function cerrar() {
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-label", "Abrir menú");
      nav.classList.remove("esta-abierto");
    }
    boton.addEventListener("click", function () {
      var abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", abierto ? "false" : "true");
      boton.setAttribute("aria-label", abierto ? "Abrir menú" : "Cerrar menú");
      nav.classList.toggle("esta-abierto", !abierto);
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", cerrar); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("esta-abierto")) { cerrar(); boton.focus(); }
    });
  })();

  (function cookies() {
    var banner = $("#cookie-banner"), ok = $("#cookie-ok");
    if (!banner || !ok) { return; }
    var CLAVE = "aldraba-cookies";
    var aceptado = false;
    try { aceptado = localStorage.getItem(CLAVE) === "1"; } catch (e) {}
    if (!aceptado) { banner.hidden = false; }
    ok.addEventListener("click", function () {
      banner.hidden = true;
      try { localStorage.setItem(CLAVE, "1"); } catch (e) {}
    });
  })();

  (function mapa() {
    var boton = $("#mapa-boton"), caja = $("#mapa");
    if (!boton || !caja) { return; }
    boton.addEventListener("click", function () {
      var marco = document.createElement("iframe");
      /* la localidad entera, nunca una calle: la dirección es inventada */
      marco.src = "https://www.google.com/maps?q=Ferrol+A+Coruna&output=embed";
      marco.title = "Mapa de Ferrol, A Coruña (la dirección de la oficina es ficticia)";
      marco.loading = "lazy";
      marco.referrerPolicy = "no-referrer-when-downgrade";
      marco.setAttribute("width", "600");
      marco.setAttribute("height", "320");
      caja.insertBefore(marco, boton.nextSibling);
      boton.remove();
    });
  })();

  (function formulario() {
    var form = $("#formulario"), salida = $("#formulario-respuesta");
    if (!form || !salida) { return; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = $("#f-nombre").value.trim();
      var tel = $("#f-tel").value.trim();
      if (!nombre || !tel || !$("#f-ok").checked) {
        salida.textContent = "Faltan el nombre, el teléfono o el aviso legal.";
        return;
      }
      salida.textContent = "Demostración: no se envía nada. Te llamaríamos, " + nombre + ".";
      form.reset();
    });
  })();

  /* --- Contenedores con scroll accesibles por teclado ---------------------- */
  (function scrollAccesible() {
    var cajas = $$("[data-scroll-teclado]");
    if (!cajas.length) { return; }
    function revisar() {
      cajas.forEach(function (c) {
        var desborda = (c.scrollWidth > c.clientWidth + 4) || (c.scrollHeight > c.clientHeight + 4);
        if (desborda) { c.setAttribute("tabindex", "0"); }
        else { c.removeAttribute("tabindex"); }
      });
    }
    revisar();
    window.addEventListener("resize", revisar);
    window.addEventListener("load", revisar);
  })();

  /* ======================================================================
     2. LA SECUENCIA
     Es el recurso protagonista y también contenido: el reloj, la etapa y el
     paso activo se calculan igual con o sin GSAP. Sin movimiento, el carril
     es una lista que se recorre con el dedo o con el teclado y el marcador
     se queda en el estado de partida.
     ====================================================================== */

  var secuencia = (function () {
    var carril = $("#secuencia-carril");
    var lista = $("#secuencia-lista");
    if (!carril || !lista) { return null; }

    var pasos = $$(".paso", lista).map(function (el) {
      return { el: el, seg: parseInt(el.dataset.seg, 10) || 0 };
    });
    var reloj = $("#secuencia-reloj");
    var etapa = $("#secuencia-etapa");
    var total = pasos.length ? pasos[pasos.length - 1].seg : 120;

    function reloj2(seg) {
      var m = Math.floor(seg / 60), s = Math.floor(seg % 60);
      return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    }

    return {
      total: total,
      carril: carril,
      lista: lista,
      /* pinta el estado correspondiente a un segundo dado */
      pintar: function (seg) {
        var activo = pasos[0];
        pasos.forEach(function (p) {
          if (seg >= p.seg) { activo = p; }
          p.el.classList.toggle("esta-pasado", seg >= p.seg);
        });
        pasos.forEach(function (p) { p.el.classList.toggle("esta-activo", p === activo); });
        if (reloj) { reloj.textContent = reloj2(seg); }
        if (etapa && activo) {
          var t = $("h3", activo.el);
          etapa.textContent = t ? t.textContent : "";
        }
      }
    };
  })();

  /* estado de partida: el segundo cero, que es donde empieza a leerse */
  if (secuencia) { secuencia.pintar(0); }

  /* ======================================================================
     3. MOVIMIENTO
     ====================================================================== */
  if (!movimiento) { return; }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  var lenis = null;
  if (window.Lenis) {
    /* lerp alto a propósito: con un scrub horizontal, el asentamiento normal
       de Lenis se lee como «el carril se va un segundo para el otro lado». */
    lenis = new window.Lenis({ lerp: 0.18, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var destino = document.querySelector(a.getAttribute("href"));
        if (!destino) { return; }
        e.preventDefault();
        lenis.scrollTo(destino, { offset: -80 });
      });
    });
  }

  function alEntrar(el, hacer) {
    if (!("IntersectionObserver" in window)) { hacer(); return; }
    var io = new IntersectionObserver(function (ent) {
      ent.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); hacer(); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
    io.observe(el);
  }

  function titulares() {
    $$("[data-revelar]").forEach(function (el) {
      var texto = (el.textContent || "").replace(/\s+/g, " ").trim();
      el.setAttribute("aria-label", texto);
      el.textContent = "";
      var frag = document.createDocumentFragment();
      var partes = [];
      texto.split(" ").forEach(function (palabra) {
        var caja = document.createElement("span");
        caja.className = "palabra";
        caja.setAttribute("aria-hidden", "true");
        var dentro = document.createElement("i");
        dentro.textContent = palabra;
        caja.appendChild(dentro);
        frag.appendChild(caja);
        frag.appendChild(document.createTextNode(" "));
        partes.push(dentro);
      });
      el.appendChild(frag);
      /* y:0 explícito: GSAP lee un translate3d del CSS como `y` en píxeles */
      gsap.set(partes, { y: 0, yPercent: 112 });
      alEntrar(el, function () {
        gsap.to(partes, { yPercent: 0, duration: 0.68, ease: "power3.out", stagger: 0.04 });
      });
    });
  }

  function apariciones() {
    $$("[data-aparecer]").forEach(function (el, i) {
      alEntrar(el, function () {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: (i % 4) * 0.06 });
      });
    });
  }

  function franja() {
    var pista = $("#franja-pista");
    if (!pista) { return; }
    var bucle = gsap.to(pista, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
    var vuelta;
    ScrollTrigger.create({
      onUpdate: function (self) {
        bucle.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 700, 5));
        clearTimeout(vuelta);
        vuelta = setTimeout(function () { gsap.to(bucle, { timeScale: 1, duration: 0.8 }); }, 140);
      }
    });
  }

  /* --- El reloj avanza con el scroll y el carril se desplaza ---------------
     El recorrido horizontal se calcula en cada refresco (invalidateOnRefresh),
     porque depende del ancho real del carril. */
  function laSecuencia() {
    if (!secuencia || window.innerWidth < 1000) { return; }
    var escena = $("#secuencia-escena");
    if (!escena) { return; }
    escena.classList.add("esta-anclada");
    secuencia.carril.style.overflowX = "hidden";

    var estado = { seg: 0 };
    var recorrido = function () {
      return Math.max(secuencia.lista.scrollWidth - secuencia.carril.clientWidth, 0);
    };

    gsap.to(estado, {
      seg: secuencia.total,
      ease: "none",
      scrollTrigger: {
        trigger: escena,
        start: "top top",
        end: function () { return "+=" + Math.round(window.innerHeight * 2.8); },
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: function () { secuencia.carril.scrollLeft = 0; }
      },
      onUpdate: function () {
        var p = estado.seg / secuencia.total;
        secuencia.pintar(estado.seg);
        gsap.set(secuencia.lista, { x: -recorrido() * p });
      }
    });
  }

  /* --- La onda de la placa del hero ---------------------------------------- */
  function ondaDelHero() {
    var onda = $(".placa-onda"), aguja = $(".placa-aguja");
    if (onda) {
      gsap.fromTo(onda,
        { attr: { r: 12 }, opacity: 0.9 },
        { attr: { r: 84 }, opacity: 0, duration: 2.6, ease: "power1.out", repeat: -1, repeatDelay: 0.5 });
    }
    if (aguja) {
      gsap.to(aguja, { rotation: 360, transformOrigin: "150px 150px", svgOrigin: "150 150",
        duration: 14, ease: "none", repeat: -1 });
    }
  }

  function contadores() {
    $$(".contador").forEach(function (el) {
      var hasta = parseFloat(el.dataset.hasta || el.textContent) || 0;
      var estado = { v: 0 };
      el.textContent = "0";
      alEntrar(el, function () {
        gsap.to(estado, {
          v: hasta, duration: 1.2, ease: "power2.out",
          onUpdate: function () { el.textContent = Math.round(estado.v); }
        });
      });
    });
  }

  function imanes() {
    if (!window.matchMedia("(hover:hover)").matches) { return; }
    $$("[data-iman]").forEach(function (el) {
      var aX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      var aY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      el.addEventListener("mousemove", function (e) {
        var c = el.getBoundingClientRect();
        aX((e.clientX - (c.left + c.width / 2)) * 0.3);
        aY((e.clientY - (c.top + c.height / 2)) * 0.42);
      });
      el.addEventListener("mouseleave", function () { aX(0); aY(0); });
    });
  }

  function cursor() {
    var caja = $("#cursor"), texto = $("#cursor-texto");
    if (!caja || !window.matchMedia("(hover:hover)").matches) { return; }
    var aX = gsap.quickTo(caja, "x", { duration: 0.2, ease: "power3.out" });
    var aY = gsap.quickTo(caja, "y", { duration: 0.2, ease: "power3.out" });
    window.addEventListener("mousemove", function (e) { aX(e.clientX); aY(e.clientY); }, { passive: true });

    [
      { sel: ".paso", txt: "paso" },
      { sel: ".limite", txt: "límite" },
      { sel: ".plano-svg", txt: "el plano" },
      { sel: ".tarjeta", txt: "causa" },
      { sel: ".tabla tbody tr", txt: "plan" }
    ].forEach(function (g) {
      $$(g.sel).forEach(function (el) {
        el.addEventListener("mouseenter", function () { caja.classList.add("es-grande"); texto.textContent = g.txt; });
        el.addEventListener("mouseleave", function () { caja.classList.remove("es-grande"); texto.textContent = ""; });
      });
    });
    $$("a, button, summary").forEach(function (el) {
      el.addEventListener("mouseenter", function () { caja.classList.add("es-grande"); });
      el.addEventListener("mouseleave", function () { caja.classList.remove("es-grande"); });
    });
  }

  function arrancar() {
    titulares();
    apariciones();
    franja();
    laSecuencia();
    ondaDelHero();
    contadores();
    imanes();
    cursor();
    ScrollTrigger.refresh();
  }


  /* --- Cortina de entrada ---------------------------------------------------
     El gesto sale del concepto; la mecánica es la misma en toda la biblioteca.
     Se retira SIEMPRE: sin GSAP y con movimiento reducido la hoja de estilos ni
     la pinta, y aquí abajo hay una red de seguridad por tiempo. */
  var elCortina = $("#cortina");
  var cortinaFuera = false;

  function quitarCortina() {
    if (cortinaFuera) { return; }
    cortinaFuera = true;
    if (elCortina) { elCortina.classList.add("esta-fuera"); }
    if (lenis) { lenis.start(); }
  }

  function cortina(alHero) {
    if (!elCortina) { alHero(); return; }
    if (lenis) { lenis.stop(); }
    try { window.scrollTo(0, 0); } catch (e) {}
    var elReloj = $("#cortina-reloj");
    var cuenta = { s: 3 };
    var tl = gsap.timeline({ onComplete: quitarCortina });
    tl.to(".cortina-argolla", { strokeDashoffset: 0, duration: .8, ease: "expo.inOut" })
      .to(".cortina-boca", { opacity: 1, duration: .3, ease: "power2.out" }, "-=.26")
      /* immediateRender:false o la onda se pinta ya expandida al crear la línea
         de tiempo, antes de que le toque */
      .fromTo(".cortina-onda",
        { attr: { r: 30 }, opacity: .85 },
        { attr: { r: 70 }, opacity: 0, duration: .85, ease: "power1.out",
          repeat: 2, immediateRender: false }, "-=.1")
      .to(cuenta, {
        s: 0, duration: 1.5, ease: "none",
        onUpdate: function () {
          if (elReloj) {
            elReloj.textContent = "00:0" + Math.max(0, Math.ceil(cuenta.s));
          }
        }
      }, "<")
      .to(".cortina-marca", { opacity: 1, duration: .4, ease: "power2.out" }, "-=.5")
      .call(function () { if (elReloj) { elReloj.textContent = "DESARMADO"; } })
      .add(alHero, "+=.22")
      .to(".cortina-centro", { opacity: 0, duration: .32, ease: "power2.in" })
      .to(".cortina-hoja", { yPercent: -102, borderRadius: 0, duration: 1.1, ease: "expo.inOut" }, "-=.14");
  }

  var yaArranco = false;
  function arrancarUnaVez() { if (yaArranco) { return; } yaArranco = true; arrancar(); }
  function abrirLaPagina() { cortina(arrancarUnaVez); }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(abrirLaPagina);
  } else {
    window.addEventListener("load", abrirLaPagina);
  }

  /* Red de seguridad: si las tipografías no resuelven, si una animación se
     atasca o si algo revienta a mitad, ni la cortina se queda puesta ni el
     arranque se pierde. */
  setTimeout(function () { quitarCortina(); arrancarUnaVez(); }, 4600);

  if (mqReducido.addEventListener) {
    mqReducido.addEventListener("change", function () { window.location.reload(); });
  }
})();
