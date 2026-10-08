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
        by: "type", at: 0.1 },
      { el: motto, twin: document.querySelector(".hero .motto"),
        by: "type", at: 0.16 }
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
       The crest leads and the name follows a beat behind it. */
    list.forEach(function (piece) {
      if (!piece.el || !piece.twin) return;
      tl.to(piece.el, {
        scale: ratio(piece),
        y: shift(piece),
        ease: "power2.inOut", duration: 1
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

  function render() {
    if (tl) tl.progress(shown.p);
    if (shown.p > 0.02) stage.classList.add("has-moved");
  }

  /* The two things that decide how it moves: the fastest it may travel, in
     progress per second, and how hard it may change that speed, in the same
     units per second. */
  var MAX_RATE = 1.3;
  var ACCEL    = 3.6;

  var rate = 0;
  var last = 0;

  /* Nothing but a number: where the reader has pushed to. What is drawn is a
     separate thing that follows it. */
  function advance(px) {
    if (done) return;
    target = Math.min(1, Math.max(0, target + px / distance));
  }

  /* The follower, running every frame for as long as the intro is up.

     It carries a speed, and the speed itself is what is steered: each frame it
     works out how fast it would like to be going — proportional to the
     distance left, never above MAX_RATE — and then moves its actual speed
     toward that, by no more than ACCEL allows.

     Bounding the speed was not enough on its own, and that is worth spelling
     out, because it looked like it was. A capped follower still went from a
     standstill to full speed in a single frame; only the acceleration was
     unbounded. From a standing start that is invisible, because the easing on
     the lettering is flat at the beginning and hides it. Pick the intro up
     again from halfway, where the easing is at its steepest, and the same
     instant jump to full speed is plainly visible — which is why it looked
     smooth on a first flick and jumped on a second.

     With the speed itself steered there is no step anywhere: it winds up,
     holds at the cap if there is far to go, and winds down as it arrives, from
     wherever the reader happens to have left it. */
  function follow(now) {
    if (done) return;

    var dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;

    var gap = target - shown.p;

    /* The fastest it could be going and still be able to stop exactly on the
       target, given how hard it is allowed to brake. Simply aiming at a speed
       proportional to the distance left is the obvious thing and is worse: it
       approaches without ever quite arriving, so the last of the movement
       crawls — a tenth of the travel taking as long as the first half. */
    var want = Math.sqrt(2 * ACCEL * Math.abs(gap));
    if (want > MAX_RATE) want = MAX_RATE;
    if (gap < 0) want = -want;

    var dv = ACCEL * dt;
    if (want > rate + dv) rate += dv;
    else if (want < rate - dv) rate -= dv;
    else rate = want;

    if (rate) {
      shown.p += rate * dt;
      /* Never past the reader's own position. */
      if ((gap > 0 && shown.p >= target) || (gap < 0 && shown.p <= target)) {
        shown.p = target;
        rate = 0;
      }
      render();
    }

    if (target >= 1 && shown.p > 0.999) { finish(); return; }
    requestAnimationFrame(follow);
  }

  /* --- the end ------------------------------------------------------------ *
     Nothing moves and nothing is given back. The overlay is lifted off a page
     that has been sitting at the top the whole time, in its final state, under
     a last frame that looks exactly like it. */
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(hintTimer);
    /* The end is noticed from inside the catch-up tween's own callback, and
       the first thing the teardown does is kill that tween — killing the
       thing that is in the middle of calling you. The teardown therefore
       waits for the next frame, by which time that callback has returned.
       One frame is nothing to look at. */
    requestAnimationFrame(teardown);
  }

  function teardown() {
    if (tl) { tl.progress(1); tl.kill(); tl = null; }

    /* The page's own crest, name and motto come back first, underneath the
       copies that are sitting exactly on them, and the buttons begin to
       arrive. Then the overlay is faded off rather than cut away — see
       .intro.is-leaving — and only then taken out of the document. */
    release();
    stage.classList.add("is-leaving");
    setTimeout(function () {
      if (stage.parentNode) stage.parentNode.removeChild(stage);
    }, 260);

    drain();
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

  function drain() {
    draining = true;
    stillGoing();
  }

  function stillGoing() {
    clearTimeout(quiet);
    quiet = setTimeout(function () {
      draining = false;
      detach();
    }, 160);
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
      if (draining) { e.preventDefault(); stillGoing(); }
      return;
    }
    e.preventDefault();
    advance(wheelPixels(e));
  }

  var touchY = null;

  function onTouchStart(e) {
    touchY = e.touches.length ? e.touches[0].clientY : null;
  }

  function onTouchMove(e) {
    if (done) {
      if (draining) { e.preventDefault(); stillGoing(); }
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
  function onScroll() {
    if (!done && window.scrollY !== 0) toTop();
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
    requestAnimationFrame(follow);
  }

  if (document.readyState === "complete") begin();
  else window.addEventListener("load", begin);
})();
