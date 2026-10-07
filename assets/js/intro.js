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
   ends it at once.
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
     fade up.

     It deliberately does NOT hand scroll restoration back. Handing it back
     here defeats the whole arrangement: this runs when the intro finishes, so
     scrolling through it would re-arm restoration just in time for the next
     reload to restore a position past the intro and kill it the instant it
     appeared. The setting belongs to this page's history entry alone. */
  function release() {
    document.documentElement.classList.remove("intro-active");
  }

  /* Every exit runs through here, so there is one definition of "the intro is
     over".

     The stage and the pin's spacer stand about 2,200px tall, and the real hero
     begins directly below them. Take that height away and the reader's scroll
     position, which was measured against it, now points deep into the page —
     which is what dropped them near the bottom. Leaving the height in place is
     no better: the reader would then scroll on through the intro's last frame
     and meet a second copy of the hero sliding up beneath it.

     So both happen together, in one frame: the stage comes out and the page
     goes to the top. The reader does not see a jump, because the intro's last
     frame IS the hero — same photograph, same scrim, crest and name already
     measured onto their hero positions — so the picture before and the picture
     after are the same picture. */
  /* The site scrolls smoothly, for the anchor links on the longer pages. That
     turns this jump into a journey: the reader is set down deep in the page
     the instant the stage's height goes, and then watches the browser travel
     all the way back up to the top. It reads as the intro ending at the bottom
     of the page and scrolling itself up.

     So smooth scrolling is held off for this one movement and handed straight
     back, rather than being given up site-wide. The scroll happens
     synchronously, so putting the property back on the next line is safe. */
  function jumpToTop() {
    var root = document.documentElement;
    var prior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    /* Setting the property is not enough on its own: nothing has recalculated
       style yet, so the scroll below would still be performed against the old
       value and glide anyway. Reading a layout property forces the recalc. */
    void root.offsetHeight;
    try {
      /* Said on the call itself, where no computed style is consulted. */
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch (e) {
      window.scrollTo(0, 0);     /* older browsers: the property above governs */
    }
    root.style.scrollBehavior = prior;
  }

  function finish() {
    if (done) return;
    done = true;
    clearTimeout(hintTimer);
    /* Escape can land before the timeline is built, so neither is assumed. */
    if (tl) {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    }
    stage.remove();
    jumpToTop();
    release();
  }

  /* The intro is not going to run: asked for stillness, already inside the
     site, or GSAP did not load. Nothing has been pinned, so there is no height
     to lose — the stage comes straight out, and the page is an ordinary page. */
  if (calm || !arriving() || !window.gsap || !window.ScrollTrigger) {
    release();
    stage.remove();
    return;
  }

  /* A reload puts the reader back where they were, and "where they were" is
     usually past the intro. Build the pin while the page sits at 1,600px and
     ScrollTrigger is created beyond its own end: it fires onLeave immediately
     and tears the intro down before anyone sees it — a flash, and then the
     ordinary page.

     Asking the browser not to restore is worth doing but is NOT the guard.
     It is a property of this history entry, and it does not survive the
     reload in every browser — Chrome hands back "auto" on the way in, which
     is exactly the case being defended against. So it is set as a courtesy
     and nothing is allowed to depend on it. */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  jumpToTop();

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("intro-active");

  var crest = stage.querySelector(".intro__crest");
  var field = stage.querySelector(".intro__field");
  var hero  = stage.querySelector(".intro__hero");
  var mark  = stage.querySelector(".intro__wordmark");

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
  var tl = null;


  function build() {
    tl = gsap.timeline({
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
        onLeave: function () {
          /* Reaching the end means nothing on its own: a restored scroll
             position arrives as one jump straight past it, which is identical
             from here to a reader who scrolled the whole way. What is not
             identical is that scrolling takes a wheel, a key, a finger or a
             pointer. With no input behind it, this is the browser putting the
             page back, not the reader arriving — so go to the top and let the
             intro play rather than ending it unseen. */
          if (!engaged) {
            jumpToTop();
            ScrollTrigger.refresh();
            return;
          }
          /* Normally the handover has already happened, while the stage was
             still pinned — see watch(). Reaching here means the reader moved
             faster than the scrub could follow, so the landing is forced to
             its end and the page handed over at once. A snap on a hard flick
             is a far smaller thing than two heroes sliding past each other. */
          clearTimeout(hintTimer);
          if (tl.progress() < motionEnd) tl.progress(motionEnd);
          finish();
        }
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

    /* Everything above is the motion. What follows is slack: scrolling that
       advances the timeline past the end of the animation without anything
       moving.

       It exists so the crest finishes landing while the stage is still
       pinned. Without it the animation can only complete at the very moment
       the pin lets go, and with scrub it is a beat behind even then — so the
       page was handed over late, after the stage had begun to scroll away
       and the real hero had started rising underneath it. Two heroes.

       The slack turns the last stretch of the scroll into room for the scrub
       to catch up in, with the stage still holding the screen. */
    var motionDur = tl.duration();
    tl.to({}, { duration: 0.45 });
    motionEnd = motionDur / tl.duration();
  }


  /* Where in the timeline the animation stops and the slack begins. */
  var motionEnd = 1;

  /* The handover is driven by the ANIMATION arriving, not by the scroll
     reaching the end. Those are different moments — scrub keeps the first
     behind the second — and the gap between them is where two heroes were
     visible: the pin had released and the stage was sliding away while the
     real hero rose underneath.

     Watching the animation instead means the page is handed over at the exact
     frame the crest comes to rest, with the stage still pinned and the slack
     absorbing the rest of the scroll. Nothing is ever seen sliding. */
  function watch() {
    if (done) return;
    if (engaged && tl && tl.progress() >= motionEnd - 0.0005) {
      clearTimeout(hintTimer);
      finish();
      return;
    }
    requestAnimationFrame(watch);
  }

  /* There is no Skip button: the intro is a few seconds of scrolling, and a
     button to leave it was more furniture than help. Escape stays as a quiet
     way out — it costs nothing and it is what someone stuck would try. Anyone
     who asked for reduced motion never arrives here at all. */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !done &&
        document.documentElement.classList.contains("intro-active")) {
      finish();
    }
  });

  /* The pin is built only once the page has finished loading AND has been put
     back at the top. Building it earlier is the whole bug: the browser restores
     the reader's old scroll position around load, and a ScrollTrigger created
     at 1,600px is created past its own end, so it ends the intro before it has
     begun. Forcing the top first and measuring afterwards means it is always
     built against the position the intro actually starts from. */
  /* The reader has touched something: from here on, a scroll is theirs. */
  var engaged = false;
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (t) {
    window.addEventListener(t, function () { engaged = true; },
                            { once: true, passive: true });
  });

  /* Scroll restoration does not always happen before load — Chrome put the
     page back at 4,102px well after the intro had started, and a jump that
     size reads to ScrollTrigger exactly like a reader who has scrolled all
     the way through, so the intro ended on the spot.

     Nothing can distinguish those two after the fact, so the top is simply
     held: while the intro is up and the reader has not touched wheel, key,
     pointer or screen, scroll position is not theirs and is put back. The
     hold lifts the moment they do touch something, and in any case after a
     second and a half, by which time restoration has long since happened. */
  function holdTop(until) {
    if (done || engaged) return;
    if (window.scrollY !== 0) {
      jumpToTop();
      ScrollTrigger.refresh();
    }
    if (performance.now() < until) {
      requestAnimationFrame(function () { holdTop(until); });
    }
  }

  function begin() {
    if (done) return;
    jumpToTop();
    build();
    ScrollTrigger.refresh();
    holdTop(performance.now() + 1500);
    watch();
  }

  if (document.readyState === "complete") begin();
  else window.addEventListener("load", begin);
})();
