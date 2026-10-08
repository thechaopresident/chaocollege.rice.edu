/* ============================================================================
   CHAO — SCROLL INTRO
   ----------------------------------------------------------------------------
   The crest and the college's name fill the screen, then settle into the
   positions they hold in the homepage hero as the reader scrolls.

   The intro takes up no room in the document. It is a fixed overlay, and
   scrolling it does not scroll the page: the reader's wheel, finger or arrow
   key feeds a figure between 0 and 1, and that figure drives the animation.
   The page underneath stays exactly where it belongs — at the top, showing the
   hero — for the whole of it.

   That is the whole design, and it is what makes the end quiet. An intro built
   out of real scrolling has to give its height back when it finishes, which
   moves the ground under the reader, and it arrives at the homepage carrying
   whatever was left of their gesture. Here there is no height to give back and
   nothing to land on: the last frame of the intro and the first frame of the
   page are the same picture, and what remains of the gesture is swallowed
   rather than spent on the page.

   It gets out of the way when it should. It never runs for a visitor who asks
   for reduced motion, and never holds the page back — the homepage is in the
   document and reachable throughout, so a deep link, a screen reader or a
   search engine never meets a locked gate. Escape ends it at once.
   ========================================================================= */

(function () {
  "use strict";

  var stage = document.querySelector("[data-intro]");
  if (!stage) return;

  var calm = window.matchMedia &&
             window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* The intro greets an arrival, so it plays for someone coming to the site
     and stays out of the way for someone already moving around inside it.

       reload           -> play. Asking for the page again asks for the intro.
       back / forward   -> skip. That is moving within the site, not arriving.
       no referrer      -> play. Typed, bookmarked, or opened from an app.
       referrer is ours -> skip. Followed a link from another Chao page.
       referrer is not  -> play. Came from a search result or someone's link.

     Nothing is remembered between loads: the question is only ever where this
     particular visit came from. */
  function arriving() {
    var nav = (performance.getEntriesByType &&
               performance.getEntriesByType("navigation")[0]) || null;
    if (nav && nav.type === "reload") return true;
    if (nav && nav.type === "back_forward") return false;

    var ref = document.referrer;
    if (!ref) return true;
    try {
      return new URL(ref).host !== location.host;
    } catch (e) {
      return true;                 /* unparseable referrer: treat as outside */
    }
  }

  /* Hands the page back: the header returns and the parts that were waiting
     fade up. */
  function release() {
    document.documentElement.classList.remove("intro-active");
  }

  function discard() {
    release();
    if (stage.parentNode) stage.parentNode.removeChild(stage);
  }

  if (calm || !arriving() || !window.gsap) {
    discard();
    return;
  }

  document.documentElement.classList.add("intro-active");

  var crest = stage.querySelector(".intro__crest");
  var field = stage.querySelector(".intro__field");
  var name  = stage.querySelector(".intro__name");
  var motto = stage.querySelector(".intro__motto");

  /* The hint arrives after a beat, so the first thing on screen is the crest
     rather than an instruction. */
  var hintTimer = setTimeout(function () {
    stage.classList.add("show-hint");
  }, 2000);

  /* The page must be at the top before anything is measured against it, since
     a reload hands back the reader's old position. None of this is seen: the
     overlay covers the screen throughout.

     Instant, not smooth. The site sets scroll-behavior: smooth for the anchor
     links on the longer pages, and a glide would leave the page still moving
     while positions are being read off it. Saying so on the call itself is
     what works — setting the property alone is not enough, because nothing has
     recalculated style yet. */
  function toTop() {
    var root = document.documentElement;
    var prior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    void root.offsetHeight;
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch (e) {
      window.scrollTo(0, 0);
    }
    root.style.scrollBehavior = prior;
  }

  /* A courtesy, not a guard: it belongs to this history entry and does not
     survive a reload in every browser. Nothing here depends on it — the page
     is simply held at the top while the intro is up. */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  toTop();

  var done = false;
  var tl = null;

  /* target is where the reader has pushed to. shown is where the animation
     actually is, which follows a beat behind — the lag that makes a scrubbed
     animation feel weighted rather than twitchy. */
  var target = 0;
  var shown = { p: 0 };

  /* Where each piece has to arrive. The homepage is sitting in its final
     position underneath, so the answer is simply where its counterpart in the
     hero already is — no arithmetic about header heights or hero offsets,
     which is what used to drift when the type scale changed.

     Measured rather than guessed, and measured again on resize. */
  /* One piece of the intro and the thing in the hero it has to become.

     The name and the motto are listed separately because the hero keeps them
     apart — an h1 for the name, a .motto beside it. Moving them as one block,
     which is what the markup used to invite, meant scaling a box containing
     both to the size of a box containing only the name: the lettering landed
     too small and then jumped up to full size at the handover. */
  function pieces() {
    return [
      { el: crest, twin: document.querySelector(".hero__crest img") ||
                         document.querySelector(".hero__crest"),
        by: "box",  at: 0 },
      { el: name,  twin: document.querySelector(".hero__wordmark"),
        by: "type", at: 0.07 },
      { el: motto, twin: document.querySelector(".hero .motto"),
        by: "type", at: 0.11 }
    ];
  }

  /* Text is matched on font size rather than on the height of its box. The
     box carries line-height, margins and whatever else sits in it, so two
     boxes of equal height can hold letters of different sizes — and the
     letters are the thing that has to match. An image has no such distinction,
     so the crest is matched on height. */
  function ratio(piece) {
    if (piece.by === "type") {
      var a = parseFloat(getComputedStyle(piece.twin).fontSize);
      var b = parseFloat(getComputedStyle(piece.el).fontSize);
      return (a && b) ? a / b : 1;
    }
    var h = piece.el.getBoundingClientRect().height;
    return h ? piece.twin.getBoundingClientRect().height / h : 1;
  }

  /* Every piece scales about its own centre, so the centre is the one point
     that does not move when it is scaled — which is what makes "put this
     centre where that centre is" the whole of the positioning. */
  function shift(piece) {
    var r = piece.el.getBoundingClientRect();
    var t = piece.twin.getBoundingClientRect();
    return (t.top + t.height / 2) - (r.top + r.height / 2);
  }

  function build() {
    var list = pieces();

    if (tl) {
      tl.kill();
      gsap.set([crest, name, motto], { clearProps: "all" });
      gsap.set(field, { opacity: 1 });
      list = pieces();
    }

    tl = gsap.timeline({ paused: true });

    /* Each walks to the size and place its counterpart already occupies, so
       the handover reads as the same lettering settling rather than as a cut.
       The crest leads and the name follows a beat behind it.

       The ease is a sine rather than a cubic, and the beat between them is
       shorter than it was, because together those two were making the motion
       very uneven against the scroll: the middle third of the scroll carried
       about three quarters of the movement, with the crest barely stirring at
       the start and only the motto still going at the end. It now carries a
       little over half. Not even — an ease that is even is a linear one, and
       that starts and stops too abruptly to be worth it — but no longer a
       lurch in the middle of a scroll that otherwise does nothing. */
    list.forEach(function (piece) {
      if (!piece.el || !piece.twin) return;
      tl.to(piece.el, {
        scale: ratio(piece),
        y: shift(piece),
        ease: "sine.inOut", duration: 1
      }, piece.at);
    });

    /* The opening field dissolves off the photograph, so what the reader is
       looking at by the end is the homepage itself. No fade to white and no
       cut: the last frame of the intro and the first frame of the page are the
       same picture.

       Only the field moves. The photograph is painted underneath from the
       first frame and left alone — fading the two against each other left a
       moment in the middle where neither covered the screen and the homepage
       showed through, which read as the page flashing past before the hero
       had even arrived. */
    tl.to(field, { opacity: 0, ease: "power1.inOut", duration: 0.55 }, 0.3);

    tl.progress(shown.p);
  }

  /* How much pushing it takes to get through, in the pixels a wheel or a
     finger reports. Roughly one screen's worth, so it costs about what
     scrolling past a screen of page would. */
  var distance = 1;
  function measure() {
    distance = Math.max(700, Math.round(window.innerHeight * 1.05));
  }
  measure();

  /* The end is noticed here, on every frame, rather than when the catch-up
     tween reports itself complete. Each new wheel event replaces that tween
     and pushes its completion back, so during a flick — a stream of events
     arriving over several hundred milliseconds — "complete" kept being
     deferred and the intro sat on its last frame waiting for the reader to
     stop pushing. Watching the value instead ends it the moment it arrives. */
  function render() {
    if (tl) tl.progress(shown.p);
    if (shown.p > 0.02) stage.classList.add("has-moved");
  }

  var closing = false;

  /* Once the reader has scrolled the whole way, the rest is run off as one
     known movement and the intro ends when it ends.

     It used to wait for the catch-up tween to creep past 0.999 instead, and
     that tween eases out, so its last fraction takes far longer than the
     distance deserves: it covers 98% of the way in 0.37s and needs 0.45s for
     99.9%. Nothing visible is happening in that time — the crest has finished
     at 0.862 of the timeline and the name at 0.948 — so the intro sat there
     looking complete, with the page waiting behind it and the buttons not yet
     begun. That was the pause before the buttons, and it was never the fade.

     The length is taken from the distance actually left, so a reader who has
     scrubbed almost to the end gets a short finish rather than the same
     three-quarters of a second as someone who flicked from the top. The floor
     is what keeps the nearly-done case brisk; the multiplier is what paces a
     flick. */
  function close() {
    closing = true;
    var left = 1 - shown.p;
    gsap.to(shown, {
      p: 1,
      duration: Math.max(0.2, left * 0.9),
      ease: "power2.out",
      overwrite: true,
      onUpdate: render,
      onComplete: function () { render(); finish(); }
    });
  }

  function advance(px) {
    if (done || closing) return;
    target = Math.min(1, Math.max(0, target + px / distance));
    if (target >= 1) { close(); return; }

    /* How long the animation takes to catch up is measured against how far it
       has to come. It used to be half a second whatever the distance, which
       is what made a gentle scroll feel slack: a small push moved the target
       a little and then the lettering took just as long to cover that little
       as it would have taken to cover the whole screen. Short pushes arrive
       quickly now, and only a long one takes a long time. */
    var gap = Math.abs(target - shown.p);
    gsap.to(shown, {
      p: target,
      duration: Math.min(0.5, Math.max(0.15, gap * 1.4)),
      ease: "power3.out",
      overwrite: true, onUpdate: render, onComplete: render
    });
  }

  /* --- the end ------------------------------------------------------------ *
     Nothing moves and nothing is given back. The overlay is lifted off a page
     that has been sitting at the top the whole time, in its final state, under
     a last frame that looks exactly like it. */
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(hintTimer);

    /* Begin swallowing NOW, in the same breath as finishing.

       The teardown below waits a frame, and the swallowing used to start
       there with it. For that one frame the intro was over and nothing was
       refusing input — and a flick is still delivering events at that moment.
       They went straight through to the page, which scrolled. That is the
       page jumping down the instant the intro ends. */
    draining = true;
    lastSwallowed = Infinity;
    stillGoing();
    /* The end is noticed from inside the catch-up tween's own callback, and
       the first thing the teardown does is kill that tween — killing the
       thing that is in the middle of calling you. The teardown therefore
       waits for the next frame, by which time that callback has returned.
       One frame is nothing to look at. */
    requestAnimationFrame(teardown);
  }

  function teardown() {
    gsap.killTweensOf(shown);
    if (tl) { tl.progress(1); tl.kill(); tl = null; }
    discard();
  }

  /* A flick does not stop when the intro does. Its remaining wheel events keep
     arriving for a few hundred milliseconds, and without this they would land
     on the homepage the instant it appeared and scroll it out from under the
     reader — the page showing up and immediately sliding away.

     So the rest of the gesture is swallowed: input keeps being refused until
     it goes quiet, and only then does the page start accepting scrolling
     again. What the reader sees is the homepage arriving, and staying put. */
  var draining = false;
  var quiet = null;
  var drainUntil = 0;
  var lastSwallowed = Infinity;

  /* How long the gesture must be silent before the page is handed back, and
     the longest this may go on for in any case.

     Both used to be longer, and the ceiling especially so. Every event put
     the silence off again, so a reader who flicked to finish the intro and
     then simply carried on scrolling — which is the ordinary thing to do —
     kept the page locked against themselves for as long as the ceiling
     allowed. The way out of that is below, in swallow(); these two are only
     the backstop now, and can afford to be short. */
  function stillGoing() {
    if (!drainUntil) drainUntil = Date.now() + 900;
    clearTimeout(quiet);
    if (Date.now() > drainUntil) { stopDraining(); return; }
    quiet = setTimeout(stopDraining, 220);
  }

  /* Momentum only ever decays: every push of it is weaker than the one
     before. So a push that is STRONGER than the one before it is not the
     gesture that ended the intro still running down — it is the reader
     starting a new one. The page goes back to them on the spot, and the event
     that told us is theirs to keep rather than being swallowed.

     That is what separates "the rest of the flick, which must not reach the
     page" from "they want to read on now", which no amount of waiting can. */
  function swallow(e, delta) {
    var d = Math.abs(delta);
    if (d > lastSwallowed * 1.25 + 4) { stopDraining(); return; }
    lastSwallowed = d;
    e.preventDefault();
    stillGoing();
  }

  function stopDraining() {
    clearTimeout(quiet);
    draining = false;
    detach();
  }

  /* --- input -------------------------------------------------------------- */

  /* Wheels report in pixels, lines or pages depending on the device. */
  function wheelPixels(e) {
    if (e.deltaMode === 1) return e.deltaY * 16;
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
    return e.deltaY;
  }

  function onWheel(e) {
    if (done) {
      if (draining) swallow(e, wheelPixels(e));
      return;
    }
    e.preventDefault();
    advance(wheelPixels(e));
  }

  var touchY = null;

  function onTouchStart(e) {
    /* A finger put down is unambiguously a new gesture, whatever is left of
       the last one. */
    if (done && draining) stopDraining();
    touchY = e.touches.length ? e.touches[0].clientY : null;
  }

  function onTouchMove(e) {
    if (done) {
      if (draining && e.touches.length && touchY !== null) {
        swallow(e, touchY - e.touches[0].clientY);
        touchY = e.touches[0].clientY;
      }
      return;
    }
    e.preventDefault();
    if (!e.touches.length) return;
    var y = e.touches[0].clientY;
    if (touchY !== null) advance(touchY - y);   /* dragging up moves forward */
    touchY = y;
  }

  function onTouchEnd() {
    touchY = null;
  }

  function onKey(e) {
    if (e.key === "Escape" && !done) { finish(); return; }
    if (done) return;
    switch (e.key) {
      case "ArrowDown":  e.preventDefault(); advance(120);  break;
      case "ArrowUp":    e.preventDefault(); advance(-120); break;
      case "PageDown":
      case " ":
      case "Spacebar":   e.preventDefault(); advance(440);  break;
      case "PageUp":     e.preventDefault(); advance(-440); break;
      case "End":        e.preventDefault(); advance(distance); break;
    }
  }

  /* The reader cannot scroll the page while the intro is up, but the browser
     still can — a restored position arriving late, or a dragged scrollbar. It
     is simply put back, and none of it is visible. */
  /* The belt to the swallowing's braces. Refusing the events ought to be
     enough, but anything that does get through — an event landing in a gap,
     a device that scrolls by some other means — moves the page, and this puts
     it back before it can be seen. It stays on through the drain for exactly
     that reason. */
  function onScroll() {
    if ((!done || draining) && window.scrollY !== 0) toTop();
  }

  var resizeTimer = null;
  function onResize() {
    if (done) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (done) return;
      measure();
      build();
    }, 150);
  }

  function attach() {
    /* Not passive: these have to be refusable, both to drive the intro and to
       swallow what is left of the gesture afterwards. */
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
  }

  function detach() {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
  }

  /* Built once the page has finished loading, so the hero is measured with its
     fonts and its photograph in place rather than halfway there. */
  function begin() {
    if (done) return;
    toTop();
    build();
    attach();
  }

  if (document.readyState === "complete") begin();
  else window.addEventListener("load", begin);
})();
