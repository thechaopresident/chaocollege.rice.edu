/* ============================================================================
   CHAO — SCROLL INTRO
   ----------------------------------------------------------------------------
   The crest and the college's name fill the screen, then settle into the
   positions they hold in the homepage hero as the reader scrolls.

   GSAP's ScrollTrigger pins the stage and turns scroll distance into the
   animation's progress. Nothing else is involved: the crest is the ordinary
   crest image, moved and scaled.

   It gets out of the way when it should. It never runs for a visitor who asks
   for reduced motion, never runs twice in a session, and never holds the page
   back — the homepage is in the document and reachable throughout, so a deep
   link, a screen reader or a search engine never meets a locked gate. Escape
   and a Skip button both end it at once.
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

  /* Every exit runs through here, so there is one definition of "the intro is
     over". `seen` is only true when it actually had its turn — played out, or
     the reader skipped it. Bailing because the browser cannot run it must not
     mark the session, or a fault would look exactly like a returning visitor
     and would never retry. */
  function release(seen) {
    document.documentElement.classList.remove("intro-active");
    stage.remove();
    if (seen) {
      try { sessionStorage.setItem(SKIP_KEY, "1"); } catch (e) { /* private window */ }
    }
  }

  if (calm || seenThisSession() || !window.gsap || !window.ScrollTrigger) {
    release(false);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("intro-active");

  var crest = stage.querySelector(".intro__crest");
  var field = stage.querySelector(".intro__field");
  var hero  = stage.querySelector(".intro__hero");
  var mark  = stage.querySelector(".intro__wordmark");
  var skip  = stage.querySelector(".intro__skip");

  /* The hint arrives after a beat, so the first thing on screen is the crest
     rather than an instruction. */
  var hintTimer = setTimeout(function () {
    stage.classList.add("show-hint");
  }, 2000);

  /* Where the crest and the name sit in the real hero, in viewport
     coordinates, as they will appear once the pin lets go. Measured rather
     than guessed: hard-coded scales drift the moment the type scale, the
     header height or the hero's proportions change, and the whole point is
     that the last frame of the intro and the first frame of the page line up.
     Returns null if the hero is not on this page, in which case the intro
     simply fades. */
  function heroTargets() {
    var hero = document.querySelector(".hero");
    var hc = document.querySelector(".hero__crest img") || document.querySelector(".hero__crest");
    var hm = document.querySelector(".hero__wordmark");
    if (!hero || !hc || !hm) return null;
    var h = hero.getBoundingClientRect();
    var c = hc.getBoundingClientRect();
    var m = hm.getBoundingClientRect();
    if (!c.height || !m.height) return null;
    var head = document.querySelector(".site-header");
    var top = head ? head.getBoundingClientRect().height : 0;
    return {
      crestH: c.height, crestY: top + (c.top - h.top) + c.height / 2,
      markH:  m.height, markY:  top + (m.top - h.top) + m.height / 2
    };
  }

  /* Measured fresh each time ScrollTrigger refreshes, so a resize or a font
     landing late does not leave the landing position stale. */
  function land(el, prop) {
    return function () {
      var t = heroTargets();
      if (!t) return prop === "scale" ? 0.4 : 0;
      var r = el.getBoundingClientRect();
      var isCrest = el === crest;
      if (prop === "scale") return (isCrest ? t.crestH : t.markH) / r.height;
      return (isCrest ? t.crestY : t.markY) - (r.top + r.height / 2);
    };
  }

  var done = false;

  function finish(seen) {
    if (done) return;
    done = true;
    clearTimeout(hintTimer);
    if (tl.scrollTrigger) tl.scrollTrigger.kill();
    tl.kill();
    release(seen);
  }

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top top",
      end: "+=" + Math.round(window.innerHeight * 1.6),
      /* Pin the trigger itself. Pinning a child takes it out of flow and
         leaves the parent with no height, which collapses the page under it. */
      pin: true,
      scrub: 0.7,
      onUpdate: function (self) {
        if (self.progress > 0.02) stage.classList.add("has-moved");
      },
      invalidateOnRefresh: true,
      onLeave: function () { finish(true); }
    }
  });

  /* Both walk to roughly the size and place they occupy in the hero, so the
     handover reads as the same object settling rather than as a cut. The
     crest leads and the name follows a beat behind it. */
  tl.to(crest, { scale: land(crest, "scale"), y: land(crest, "y"),
                 ease: "power2.inOut", duration: 1 }, 0)
    .to(mark,  { scale: land(mark, "scale"),  y: land(mark, "y"),
                 ease: "power2.inOut", duration: 1 }, 0.1)
    /* The opening field gives way to the hero photograph, so what the reader
       is looking at by the end is the homepage itself. No fade to white and
       no cut: the last frame of the intro and the first frame of the page are
       the same picture. */
    .to(hero,  { opacity: 1, ease: "power1.inOut", duration: 0.55 }, 0.3)
    .to(field, { opacity: 0, ease: "power1.inOut", duration: 0.55 }, 0.3);

  if (skip) {
    skip.addEventListener("click", function () {
      finish(true);
      window.scrollTo(0, 0);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !done &&
        document.documentElement.classList.contains("intro-active")) {
      finish(true);
      window.scrollTo(0, 0);
    }
  });
})();
