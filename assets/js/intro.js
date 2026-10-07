/* ============================================================================
   CHAO — SCROLL INTRO
   ----------------------------------------------------------------------------
   The crest fills the screen; scrolling makes the dragons peel out of the
   shield, flex as they go and leave the sides, while the crest and wordmark
   settle into the positions they occupy on the homepage.

   Two layers do the work:

     - GSAP + ScrollTrigger pins the stage and turns scroll distance into a
       single 0..1 progress value. Everything else reads that value.
     - A small WebGL canvas draws each dragon on a subdivided grid so its body
       can bend. A flat <img> can only slide; a mesh can undulate.

   It gets out of the way when it should: it never runs for a visitor who asks
   for reduced motion, never runs twice in a session, and never holds back the
   page it sits in front of — the homepage is in the DOM and reachable the
   whole time, so a deep link, a screen reader or a search engine is never
   facing a locked gate.
   ========================================================================= */

(function () {
  "use strict";

  var stage = document.querySelector("[data-intro]");
  if (!stage) return;

  var SKIP_KEY = "chao-intro-seen";
  var calm = window.matchMedia &&
             window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function seenThisSession() {
    try { return sessionStorage.getItem(SKIP_KEY) === "1"; } catch (e) { return false; }
  }
  function markSeen() {
    try { sessionStorage.setItem(SKIP_KEY, "1"); } catch (e) { /* private window */ }
  }

  /* Remove the stage and hand the page back. Every exit runs through here, so
     there is one definition of "the intro is over".

     `seen` is only true when the intro actually had its turn — played out, or
     the reader skipped it. Bailing because the browser cannot run it, or
     because stillness was asked for, must not mark the session: otherwise a
     machine that never shows the intro also never retries, and a fault looks
     exactly like a visitor who has already seen it. */
  function release(seen) {
    document.documentElement.classList.remove("intro-active");
    stage.remove();
    if (seen) markSeen();
  }

  if (calm || seenThisSession() || !window.gsap || !window.ScrollTrigger) {
    release(false);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("intro-active");

  /* ---------------------------------------------------------------------- *
     WebGL: one textured, subdivided quad per dragon
     ---------------------------------------------------------------------- */

  var GRID = 24;        /* subdivisions per side — enough to bend smoothly */

  var VERT = [
    "attribute vec2 aXY;",
    "uniform vec2 uPos;",        /* centre, in clip space */
    "uniform vec2 uSize;",       /* half-extent, in clip space */
    "uniform float uTime;",
    /* Explicitly mediump: the fragment shader declares mediump floats, and a
       uniform shared by both stages has to agree on precision or the program
       will not link. */
    "uniform mediump float uProg;",   /* 0 at rest in the shield, 1 fully gone */
    "uniform float uDir;",       /* -1 leaves left, +1 leaves right */
    "varying vec2 vUV;",
    "void main() {",
    "  vUV = aXY * 0.5 + 0.5;",
    "  vec2 p = aXY;",
    /* Serpentine travelling wave along the body. It is near zero at rest so
       the dragon sits still inside the shield, and grows as it leaves. */
    "  float along = vUV.x;",
    "  float amp = 0.055 * smoothstep(0.0, 0.35, uProg);",
    "  float wave = sin(along * 7.0 - uTime * 3.2) * amp;",
    "  p.y += wave * (0.35 + along);",
    /* The tail lags the head, so the body stretches rather than sliding
       rigidly, and curls slightly as it goes. */
    "  float lag = (1.0 - along) * uProg * 0.55;",
    "  p.x -= uDir * lag;",
    "  float curl = sin(along * 3.1) * uProg * 0.18;",
    "  p.y += curl;",
    "  vec2 pos = uPos + p * uSize;",
    /* Flight path: out to the side and gently up, accelerating. */
    "  float fly = uProg * uProg;",
    "  pos.x += uDir * fly * 2.6;",
    "  pos.y += fly * 0.55;",
    "  gl_Position = vec4(pos, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAG = [
    "precision mediump float;",
    "uniform sampler2D uTex;",
    "uniform float uProg;",
    "varying vec2 vUV;",
    "void main() {",
    "  vec4 c = texture2D(uTex, vUV);",
    /* Fade only at the very end, so the dragon is solid for most of its exit. */
    "  c.a *= 1.0 - smoothstep(0.72, 1.0, uProg);",
    "  if (c.a < 0.01) discard;",
    "  gl_FragColor = vec4(c.rgb * c.a, c.a);",   /* premultiplied */
    "}"
  ].join("\n");

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("intro shader:", gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  function buildGrid(n) {
    var verts = [], idx = [];
    for (var y = 0; y <= n; y++) {
      for (var x = 0; x <= n; x++) {
        verts.push((x / n) * 2 - 1, (y / n) * 2 - 1);
      }
    }
    for (var j = 0; j < n; j++) {
      for (var i = 0; i < n; i++) {
        var a = j * (n + 1) + i, b = a + 1, c = a + (n + 1), d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    }
    return { verts: new Float32Array(verts), idx: new Uint16Array(idx) };
  }

  function makeDragons(canvas, sources, onReady) {
    var gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true,
                                          antialias: true });
    if (!gl) return null;

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("intro link:", gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);

    var mesh = buildGrid(GRID);
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.verts, gl.STATIC_DRAW);
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.idx, gl.STATIC_DRAW);

    var aXY = gl.getAttribLocation(prog, "aXY");
    gl.enableVertexAttribArray(aXY);
    gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ["uPos", "uSize", "uTime", "uProg", "uDir", "uTex"].forEach(function (n) {
      U[n] = gl.getUniformLocation(prog, n);
    });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);   /* premultiplied */

    var loaded = 0;
    var dragons = sources.map(function (src) {
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      /* one opaque pixel until the real image lands */
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA,
                    gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      var img = new Image();
      img.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (++loaded === sources.length && onReady) onReady();
      };
      img.onerror = function () { if (++loaded === sources.length && onReady) onReady(); };
      img.src = src.url;
      return { tex: tex, dir: src.dir, rect: src.rect };
    });

    return {
      gl: gl,
      resize: function () {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      },
      draw: function (progress, time) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        dragons.forEach(function (d) {
          var r = d.rect();                     /* css px, relative to canvas */
          var w = canvas.clientWidth, h = canvas.clientHeight;
          if (!w || !h) return;
          gl.uniform2f(U.uPos,
            ((r.x + r.w / 2) / w) * 2 - 1,
            -(((r.y + r.h / 2) / h) * 2 - 1));
          gl.uniform2f(U.uSize, (r.w / w), (r.h / h));
          gl.uniform1f(U.uTime, time);
          gl.uniform1f(U.uProg, progress);
          gl.uniform1f(U.uDir, d.dir);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, d.tex);
          gl.uniform1i(U.uTex, 0);
          gl.drawElements(gl.TRIANGLES, mesh.idx.length, gl.UNSIGNED_SHORT, 0);
        });
      }
    };
  }

  /* ---------------------------------------------------------------------- *
     Wiring
     ---------------------------------------------------------------------- */

  var root     = stage.querySelector(".intro__stage");
  var crest    = stage.querySelector(".intro__crest");
  var wordmark = stage.querySelector(".intro__wordmark");
  var hint     = stage.querySelector(".intro__hint");
  var skip     = stage.querySelector(".intro__skip");
  var canvas   = stage.querySelector(".intro__gl");
  var GEO      = window.CHAO_INTRO_GEOMETRY || {};

  /* Where each dragon sits on the crest, in canvas pixels. Read from the
     live crest element so it tracks whatever size it currently is. */
  function rectFor(side) {
    return function () {
      var g = GEO[side] || { x: 0.25, y: 0.42, w: 0.23, h: 0.37 };
      var c = crest.getBoundingClientRect();
      var s = canvas.getBoundingClientRect();
      return {
        x: c.left - s.left + g.x * c.width,
        y: c.top - s.top + g.y * c.height,
        w: g.w * c.width,
        h: g.h * c.height
      };
    };
  }

  var scene = makeDragons(canvas, [
    { url: canvas.dataset.left,  dir: -1, rect: rectFor("left") },
    { url: canvas.dataset.right, dir:  1, rect: rectFor("right") }
  ], function () { stage.classList.add("is-ready"); });

  if (!scene) {                 /* no WebGL: do not show a broken intro */
    release(false);
    return;
  }
  scene.resize();
  window.addEventListener("resize", function () { scene.resize(); });

  var progress = 0, clock = 0, last = null, raf = null;

  function frame(now) {
    if (last == null) last = now;
    clock += Math.min((now - last) / 1000, 0.05);
    last = now;
    scene.draw(progress, clock);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  /* The hint appears on its own after a beat, so the first thing on screen is
     the crest rather than an instruction. */
  var hintTimer = setTimeout(function () { stage.classList.add("show-hint"); }, 2000);

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top top",
      end: "+=" + (window.innerHeight * 2.2),
      pin: root,
      scrub: 0.8,
      onUpdate: function (self) {
        progress = self.progress;
        if (self.progress > 0.02) stage.classList.add("has-moved");
      },
      onLeave: finish
    }
  });

  /* The crest and wordmark walk from filling the screen to the size and place
     they hold in the homepage hero, so the handover is not a cut. */
  tl.to(crest,    { scale: 0.26, y: "-28vh", ease: "power2.inOut" }, 0)
    .to(wordmark, { scale: 0.42, y: "-14vh", ease: "power2.inOut" }, 0.08)
    .to(hint,     { autoAlpha: 0, duration: 0.15 }, 0)
    .to(stage,    { autoAlpha: 0, ease: "power1.in" }, 0.72);

  function finish() {
    if (raf) cancelAnimationFrame(raf);
    clearTimeout(hintTimer);
    if (tl.scrollTrigger) tl.scrollTrigger.kill();
    tl.kill();
    release(true);
  }

  /* Always a way out: the button, and Escape. */
  if (skip) skip.addEventListener("click", function () { finish(); window.scrollTo(0, 0); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.documentElement.classList.contains("intro-active")) {
      finish(); window.scrollTo(0, 0);
    }
  });
})();
