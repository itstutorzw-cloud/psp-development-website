/* PSP Development - main script */
(function () {
  "use strict";
  var RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var EMAIL = document.documentElement.getAttribute("data-email") || "info@example.com";
  var nv = $("#nav"), menu = $("#menu"), up = $("#up");

  /* mobile menu, sticky nav, back to top */
  if (menu) menu.addEventListener("click", function () {
    var o = nv.classList.toggle("open"); menu.setAttribute("aria-expanded", o);
  });
  addEventListener("scroll", function () {
    nv.classList.toggle("sc", scrollY > 30);
    if (up) up.classList.toggle("on", scrollY > 700);
  }, { passive: true });
  if (up) up.addEventListener("click", function (e) { e.preventDefault(); scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); });

  /* splash screen: once per visit, home page only */
  var sp = $("#splash");
  if (sp) {
    var seen = false; try { seen = sessionStorage.getItem("psp-splash"); sessionStorage.setItem("psp-splash", "1"); } catch (e) {}
    setTimeout(function () { sp.classList.add("off"); }, seen || RM ? 0 : 2800);
    setTimeout(function () { sp.remove(); }, 4200);
  }

  /* scroll reveal and number counters */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var t = e.target;
      if (t.classList.contains("r")) t.classList.add("in");
      if (t.dataset.n) {
        var n = +t.dataset.n, s = t.dataset.s || "", st = null;
        (function f(ts) {
          st = st || ts; var p = Math.min((ts - st) / 1600, 1);
          t.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + s;
          if (p < 1) requestAnimationFrame(f);
        })(performance.now());
      }
      io.unobserve(t);
    });
  }, { threshold: 0.2 });
  $$(".r,[data-n]").forEach(function (el) { io.observe(el); });

  /* 3D tech products in the hero */
  try {
    var cv = $("#gl");
    if (window.THREE && cv) (function () {
      var T = THREE, hd = cv.parentNode, mx = 0, tk = 0, P = [], i;
      var r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
      r.setPixelRatio(Math.min(devicePixelRatio, 2));
      var sc = new T.Scene(), cam = new T.PerspectiveCamera(50, 1, .1, 100); cam.position.z = 9;
      sc.add(new T.AmbientLight(0xbcd2ff, .9));
      var dl = new T.DirectionalLight(0xffffff, 1.3); dl.position.set(3, 5, 6); sc.add(dl);
      var pl = new T.PointLight(0x2f5bff, 3, 30); pl.position.set(-4, -2, 5); sc.add(pl);
      var M = function (c, m, q) { return new T.MeshStandardMaterial({ color: c, metalness: m, roughness: q }); };
      var wh = M(0xe8f0ff, .5, .3), dk = M(0x0b2a7a, .6, .35), gm = new T.MeshBasicMaterial({ color: 0x8bdb2b });
      var bx = function (w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x || 0, y || 0, z || 0); return o; };
      var ed = function (o) { o.add(new T.LineSegments(new T.EdgesGeometry(o.geometry), new T.LineBasicMaterial({ color: 0xb4ef63, transparent: true, opacity: .7 }))); return o; };
      var G = function (a) { var g = new T.Group(); a.forEach(function (o) { g.add(o); }); return g; };
      var add = function (g, x, y, z, s) { g.position.set(x, y, z); g.userData = { x: x, y: y, sc: s, rx: g.rotation.x, s: Math.random() * .004 + .003 }; sc.add(g); P.push(g); };
      var scr = ed(bx(2, 1.3, .08, dk, 0, .75, -.6)); scr.rotation.x = -.25; scr.add(bx(1.8, 1.1, .02, gm, 0, 0, .05));
      add(G([ed(bx(2, .1, 1.3, wh)), scr]), 3.6, 1.2, -.5, 1);
      var ph = ed(bx(.7, 1.35, .08, dk)); ph.add(bx(.6, 1.2, .02, gm, 0, 0, .05)); add(G([ph]), 5.4, -1.7, 0, 1);
      var cp = [ed(bx(1, .14, 1, dk)), bx(.5, .16, .5, gm)];
      for (i = -1; i <= 1; i++) cp.push(bx(.1, .06, .3, wh, i * .3, 0, .65), bx(.1, .06, .3, wh, i * .3, 0, -.65), bx(.3, .06, .1, wh, .65, 0, i * .3), bx(.3, .06, .1, wh, -.65, 0, i * .3));
      var c = G(cp); c.rotation.x = .9; add(c, 1.2, -2.6, -1, 1.3);
      var sv = []; for (i = 0; i < 3; i++) sv.push(ed(bx(1.2, .35, .9, i % 2 ? wh : dk, 0, i * .42, 0)), bx(.1, .06, .02, gm, .45, i * .42, .46));
      add(G(sv), -5.4, -2.2, -2, 1);
      add(G([ed(bx(1.9, 1.2, .1, dk)), bx(1.7, 1, .02, gm, 0, 0, .06), bx(.12, .5, .1, wh, 0, -.85, 0), bx(.8, .06, .4, wh, 0, -1.12, 0)]), -4.3, 2.4, -3, 1);
      add(new T.Mesh(new T.IcosahedronGeometry(.9, 1), new T.MeshBasicMaterial({ color: 0xb4ef63, wireframe: true })), .4, 3, -2.5, 1);
      var rs = function () {
        var w = hd.offsetWidth, h = hd.offsetHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
        var k = Math.min(1, cam.aspect / 1.6);
        P.forEach(function (g) { g.position.x = g.userData.x * k; g.scale.setScalar(g.userData.sc * Math.max(.6, k)); });
        if (RM) r.render(sc, cam);
      };
      var fr = function () {
        tk += .016;
        P.forEach(function (g, j) {
          g.userData.v = (g.userData.v || 0) * .94; g.rotation.y += g.userData.s + g.userData.v;
          g.rotation.x = g.userData.rx + Math.sin(tk * .6 + j) * .12; g.position.y = g.userData.y + Math.sin(tk * .9 + j * 1.7) * .25;
        });
        cam.position.z += (9 - cam.position.z) * .08; cam.position.x += (mx * 1.5 - cam.position.x) * .04; cam.lookAt(0, 0, 0);
        r.render(sc, cam); if (!RM) requestAnimationFrame(fr);
      };
      window.kick = function () { P.forEach(function (g) { g.userData.v = .22; }); cam.position.z = 7.6; };
      addEventListener("mousemove", function (e) { mx = e.clientX / innerWidth - .5; });
      rs(); addEventListener("resize", rs); fr();
    })();
  } catch (e) {}

  /* 3D touch and click effects */
  var F = ".btn,.ico,.pc b,#up,.logo,nav a,.more", W = ".card,.ph,details,.ind div,.glass,.pc,.svc-block,.sg div", TL = ".card,.ph,.glass,.ind div";
  var on = null;
  function rd(a, b) { return a + Math.random() * (b - a); }
  function burst(x, y) {
    var L = [], e, a, d, k;
    for (k = 0; k < 2; k++) { e = document.createElement("i"); e.className = "ring" + (k ? " b" : ""); e.style.left = x + "px"; e.style.top = y + "px"; L.push(e); }
    for (k = 0; k < 12; k++) {
      e = document.createElement("i"); e.className = "cube"; a = rd(0, 6.28); d = rd(50, 150);
      e.style.cssText = "left:" + x + "px;top:" + y + "px;--x:" + Math.cos(a) * d + "px;--y:" + Math.sin(a) * d + "px;--z:" + rd(-100, 200) + "px;--rx:" + rd(180, 720) + "deg;--ry:" + rd(180, 720) + "deg";
      L.push(e);
    }
    L.forEach(function (n) { document.body.appendChild(n); });
    setTimeout(function () { L.forEach(function (n) { n.remove(); }); }, 1200);
  }
  function tilt(el, e) {
    var b = el.getBoundingClientRect();
    el.style.setProperty("--ry", ((e.clientX - b.left) / b.width - .5) * 18 + "deg");
    el.style.setProperty("--rx", -((e.clientY - b.top) / b.height - .5) * 18 + "deg");
  }
  if (!RM) {
    addEventListener("pointerdown", function (e) {
      burst(e.clientX, e.clientY); if (window.kick) window.kick();
      var t = e.target.closest && e.target.closest(F + "," + W); if (!t) return;
      t.classList.remove("flip", "wob"); tilt(t, e); t.classList.add("pr");
      var end = function () {
        t.classList.remove("pr"); void t.offsetWidth; t.classList.add(t.matches(F) ? "flip" : "wob");
        setTimeout(function () { t.classList.remove("flip", "wob"); }, 900);
        removeEventListener("pointerup", end); removeEventListener("pointercancel", end);
      };
      addEventListener("pointerup", end); addEventListener("pointercancel", end);
    }, { passive: true });
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var t = e.target.closest && e.target.closest(TL);
      if (on && on !== t) { on.classList.remove("tl"); on.style.removeProperty("--rx"); on.style.removeProperty("--ry"); }
      on = t; if (t && !t.classList.contains("pr")) { t.classList.add("tl"); tilt(t, e); }
    });
  }

  /* 3D page transitions between pages */
  var pt = $("#pt"), busy = false;
  if (pt) {
    if (document.documentElement.classList.contains("cv")) {
      pt.className = "out"; document.documentElement.classList.remove("cv");
      try { sessionStorage.removeItem("psp-pt"); } catch (e) {}
      setTimeout(function () { pt.className = ""; }, 900);
    }
    addEventListener("pageshow", function (e) { if (e.persisted) { pt.className = ""; busy = false; } });
    document.addEventListener("click", function (e) {
      if (window.CSSViewTransitionRule) return;
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || busy || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute("download")) return;
      var h = a.getAttribute("href");
      if (/^(mailto:|tel:|https?:|#|javascript:)/i.test(h)) return;
      if (RM) return;
      e.preventDefault(); busy = true;
      try { sessionStorage.setItem("psp-pt", "1"); } catch (x) {}
      pt.className = "in";
      setTimeout(function () { location.href = a.href; }, 220);
    });
  }

  /* contact form: delivered by email through FormSubmit, with an email-app fallback */
  var f = $("#f");
  if (f) f.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(f), ok = $("#ok"), btn = f.querySelector("button");
    var data = { name: d.get("n"), email: d.get("e"), phone: d.get("p") || "-", service: d.get("svc") || "-", budget: d.get("bud") || "-", confidential: d.get("nda") ? "Yes" : "No", message: d.get("m"),
      _subject: (d.get("rt") || "Website enquiry") + ": " + (d.get("svc") || "General") + " (" + d.get("n") + ")", request: d.get("rt") || "Enquiry", preferred_date: d.get("dt") || "-", _replyto: d.get("e"), _template: "table", _captcha: "false" };
    btn.disabled = true; ok.textContent = "Sending...";
    fetch("https://formsubmit.co/ajax/" + EMAIL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json(); })
      .then(function (r) { if (r.success === true || r.success === "true") { ok.textContent = "Thank you! Your message has been sent. We will reply soon."; f.reset(); } else { throw new Error("x"); } })
      .catch(function () {
        var s = encodeURIComponent(data._subject), b = encodeURIComponent(data.message + "\n\nName: " + data.name + "\nEmail: " + data.email + "\nPhone: " + data.phone + "\nRequest: " + data.request + "\nPreferred date: " + data.preferred_date + "\nService: " + data.service + "\nBudget: " + data.budget + "\nConfidential: " + data.confidential);
        ok.textContent = "We could not send it directly, so your email app will open to send the message.";
        location.href = "mailto:" + EMAIL + "?subject=" + s + "&body=" + b;
      })
      .then(function () { btn.disabled = false; });
  });
  /* service simulations: play/pause, and pause when off-screen */
  document.querySelectorAll("svg.sim").forEach(function (sv) {
    var btn = sv.parentNode.querySelector(".simbtn"), paused = false, seen = true;
    function upd() { try { (paused || !seen) ? sv.pauseAnimations() : sv.unpauseAnimations(); } catch (e) {} if (btn) btn.textContent = paused ? "\u25B6 Play" : "\u275A\u275A Pause"; }
    if (RM) { try { sv.setCurrentTime(parseFloat(sv.dataset.d) * 0.9); } catch (e) {} paused = true; }
    if (btn) btn.addEventListener("click", function () { paused = !paused; upd(); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { seen = en[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe(sv);
    upd();
  });

  /* hm-slides: rotating header media, gallery videos, contact dock */
  document.querySelectorAll(".hm").forEach(function (hm) {
    var sl = hm.querySelectorAll(".hs"), i = 0;
    function load(s) { var v = s.querySelector("video"); if (v && !v.getAttribute("src") && v.dataset.src) v.src = v.dataset.src; }
    function show(n) {
      i = (n + sl.length) % sl.length;
      sl.forEach(function (s, k) {
        var on = k === i, v = s.querySelector("video");
        s.classList.toggle("on", on);
        if (!v) return;
        if (on) { load(s); if (!RM) { try { v.currentTime = 0; } catch (e) {} var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
        else { setTimeout(function () { if (!s.classList.contains("on")) v.pause(); }, 1400); }
      });
      if (sl.length > 1) load(sl[(i + 1) % sl.length]);
    }
    show(0);
    if (sl.length > 1 && !RM) setInterval(function () { show(i + 1); }, 7000);
    else { var v0 = hm.querySelector("video"); if (v0 && v0.hasAttribute("src")) v0.loop = true; }
  });
  document.querySelectorAll(".ph video").forEach(function (v) {
    if (RM || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (en) { if (en[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); } }, { threshold: 0.3 }).observe(v);
  });
  var dk = $("#dock"), dkc = $("#dkc");
  if (dk && dkc) {
    dkc.addEventListener("click", function (e) { e.stopPropagation(); var o = dk.classList.toggle("open"); dkc.setAttribute("aria-expanded", o); });
    document.addEventListener("click", function (e) { if (!dk.contains(e.target)) { dk.classList.remove("open"); dkc.setAttribute("aria-expanded", "false"); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { dk.classList.remove("open"); dkc.setAttribute("aria-expanded", "false"); } });
  }

  /* real-footage / simulation tabs, video plays only when visible */
  document.querySelectorAll(".simbox").forEach(function (box) {
    var tabs = box.querySelectorAll(".stab"); if (!tabs.length) return;
    var v = box.querySelector("video"), inView = false;
    function vp() { if (!v) return; var on = box.querySelector(".pv").classList.contains("on") && inView && !RM; if (on) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); } }
    if (v) { v.controls = RM; v.addEventListener("click", function () { if (RM) return; if (v.paused) { v.play(); } else { v.pause(); } }); }
    tabs.forEach(function (t) { t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.toggle("on", x === t); });
      box.querySelectorAll(".pane").forEach(function (p) { p.classList.toggle("on", p.classList.contains(t.dataset.p)); });
      vp();
    }); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { inView = en[0].isIntersecting; vp(); }, { threshold: 0.25 }).observe(box); else { inView = true; vp(); }
  });

  /* announcements and testimonials from js/content.js */
  var P = window.PSP || {};
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var al = $("#ann-list");
  if (al && P.announcements && P.announcements.length) al.innerHTML = P.announcements.map(function (a) {
    return '<article class="acard' + (a.featured ? " feat" : "") + '"><span class="atag">' + esc(a.tag) + "</span><h3>" + esc(a.title) + "</h3><p>" + esc(a.text) + "</p>" +
      (a.href ? '<a class="btn ' + (a.featured ? "pri" : "blue") + '" href="' + esc(a.href) + '">' + esc(a.cta || "Learn more") + "</a>" : "") + "</article>";
  }).join("");
  var tm = $("#tm");
  if (tm) {
    var L = P.testimonials || [];
    if (!L.length) {
      tm.innerHTML = '<div class="tinv"><h3>Worked with PSP Development?</h3><p>We would love to hear about your experience. Your feedback helps other organisations choose with confidence.</p><div class="tinv-b"><a class="btn blue" target="_blank" rel="noopener" href="https://wa.me/263780192367?text=Hello%20PSP%2C%20I%20would%20like%20to%20share%20my%20experience%20working%20with%20you">Share on WhatsApp</a><a class="btn" href="mailto:its.tutor.zw@gmail.com?subject=My%20experience%20with%20PSP%20Development">Send by email</a></div></div>';
    } else {
      tm.innerHTML = '<div class="tslides">' + L.map(function (t, i) { return '<figure class="tslide' + (i ? "" : " on") + '"><blockquote>\u201C' + esc(t.quote) + '\u201D</blockquote><figcaption><b>' + esc(t.name) + "</b><span>" + esc(t.role) + "</span></figcaption></figure>"; }).join("") +
        '</div><div class="tdots">' + L.map(function (t, i) { return '<button type="button" aria-label="Testimonial ' + (i + 1) + '"' + (i ? "" : ' class="on"') + "></button>"; }).join("") + "</div>";
      var ix = 0, sl = tm.querySelectorAll(".tslide"), ds = tm.querySelectorAll(".tdots button");
      var go = function (n) { ix = (n + sl.length) % sl.length; sl.forEach(function (s, i) { s.classList.toggle("on", i === ix); }); ds.forEach(function (d, i) { d.classList.toggle("on", i === ix); }); };
      ds.forEach(function (d, i) { d.addEventListener("click", function () { go(i); }); });
      if (sl.length > 1 && !RM) setInterval(function () { go(ix + 1); }, 6500);
    }
  }

  /* projects from content.js, and inspection link preselect */
  var pjc = $("#proj");
  if (pjc && P.projects && P.projects.length) pjc.innerHTML = P.projects.map(function (a) {
    return '<article class="acard"><span class="atag">' + esc(a.tag) + "</span><h3>" + esc(a.title) + "</h3><p>" + esc(a.text) + "</p></article>";
  }).join("") + '<article class="acard"><span class="atag">Your project</span><h3>Your idea could be next</h3><p>Tell us what you need and we will design the system around it.</p><a class="btn blue" href="contact.html">Start a project</a></article>';
  var rtSel = document.querySelector('select[name="rt"]');
  if (rtSel && /type=inspection/.test(location.search)) rtSel.value = "Book a private inspection";

  /* technology filter tabs */
  var tb = document.querySelectorAll(".tab"), cp = document.querySelectorAll(".chip");
  tb.forEach(function (t) { t.addEventListener("click", function () {
    tb.forEach(function (x) { x.classList.toggle("on", x === t); });
    cp.forEach(function (c) { c.classList.toggle("hide", t.dataset.f !== "all" && c.dataset.g !== t.dataset.f); });
  }); });
  var y = $("#yr"); if (y) y.textContent = new Date().getFullYear();
})();
