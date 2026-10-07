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
  var mark  = stage.querySelector(".intro__wordmark");
  var skip  = stage.querySelector(".intro__skip");

  /* The hint arrives after a beat, so the first thing on screen is the crest
     rather than an instruction. */
  var hintTimer = setTimeout(function () {
    stage.classList.add("show-hint");
  }, 2000);

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
      onLeave: function () { finish(true); }
    }
  });

  /* Both walk to roughly the size and place they occupy in the hero, so the
     handover reads as the same object settling rather than as a cut. The
     crest leads and the name follows a beat behind it. */
  tl.to(crest, { scale: 0.30, yPercent: -34, ease: "power2.inOut", duration: 1 }, 0)
    .to(mark,  { scale: 0.44, yPercent: -22, ease: "power2.inOut", duration: 1 }, 0.1)
    .to(stage, { autoAlpha: 0, ease: "power1.in", duration: 0.3 }, 0.75);

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
