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

  /* Every exit runs through here, so there is one definition of "the intro is
     over".

     It deliberately does NOT hand scroll restoration back. Handing it back
     here defeats the whole arrangement: release() runs when the intro
     finishes, so scrolling through it re-armed restoration just in time for
     the next reload to restore a position past the intro, which killed it the
     instant it appeared. The setting belongs to this page's history entry
     alone and is left as it is. */
  function release() {
    document.documentElement.classList.remove("intro-active");
    stage.remove();
  }

  if (calm || !arriving() || !window.gsap || !window.ScrollTrigger) {
    release();
    return;
  }

  /* A reload puts the reader back where they were, and "where they were" is
     usually past the intro. ScrollTrigger would then be beyond its end before
     anyone saw anything, fire onLeave and tear the intro down — a flash of the
     intro and then nothing.

     Turning restoration off applies to the NEXT load of this history entry,
     which is the reload we are guarding against, so it has to be set now and
     left set. It scopes to this page only; everywhere else on the site keeps
     the browser's own behaviour. */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  /* Restoration can already have happened by the time this runs, so the top is
     asserted again once loading finishes. */
  window.addEventListener("load", function () {
    if (document.documentElement.classList.contains("intro-active")) {
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }
  });

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

  function finish() {
    if (done) return;
    done = true;
    clearTimeout(hintTimer);
    if (tl.scrollTrigger) tl.scrollTrigger.kill();
    tl.kill();
    release();
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
      onLeave: function () { finish(); }
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
      finish();
      window.scrollTo(0, 0);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !done &&
        document.documentElement.classList.contains("intro-active")) {
      finish();
      window.scrollTo(0, 0);
    }
  });
})();
