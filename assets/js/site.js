/* ============================================================================
   CHAO COLLEGE — RENDERER
   ----------------------------------------------------------------------------
   Builds the header, footer and every data-driven section from the files in
   /data. You should rarely need to edit this file — change /data/*.js instead.

   How a page wires itself up:
     <html data-root="../">            <- "" on the homepage, "../" one level in
     <body data-page="people">         <- which page renderer to run
     <div data-mount="people"></div>   <- where the content is injected

   Placeholder handling: any string containing "[PLACEHOLDER" is rendered inside
   <span class="tbd"> so unfinished copy is visually obvious during review.
   ========================================================================= */
(function () {
  "use strict";

  var SITE  = window.CHAO_SITE   || {};
  var PPL   = window.CHAO_PEOPLE || {};
  var PAGES = window.CHAO_PAGES  || {};

  /* --- Path + text helpers --------------------------------------------- */

  var ROOT = document.documentElement.getAttribute("data-root") || "";

  function url(path) {
    if (!path) return null;
    if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
    return ROOT + path;
  }
  function isExternal(path) {
    return !!path && /^https?:/.test(path);
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  /* Escape, then highlight unfinished copy. */
  function fmt(s) {
    return esc(s).replace(/\[PLACEHOLDER[^\]]*\]/g,
      function (m) { return '<span class="tbd">' + m + "</span>"; });
  }
  function paras(arr) {
    if (!arr) return "";
    return (Array.isArray(arr) ? arr : [arr])
      .filter(Boolean)
      .map(function (p) { return "<p>" + fmt(p) + "</p>"; }).join("");
  }
  /* Bios arrive as one string with blank lines between paragraphs. */
  function bioParas(s) {
    if (!s) return "";
    return s.split(/\n\s*\n/).map(function (p) {
      return "<p>" + fmt(p.trim()) + "</p>";
    }).join("");
  }
  function mount(name) { return document.querySelector('[data-mount="' + name + '"]'); }

  /* --- Placeholder / photo figure --------------------------------------- *
     Renders a brand-colored tile. If `image` is supplied it is layered on top,
     so the tile is never a broken-image icon.                               */
  function figure(opts) {
    var cls   = "ph " + (opts.className || "");
    var img   = opts.image
      ? '<img src="' + esc(opts.image) + '" alt="' + esc(opts.alt || "") + '"' +
        (opts.focus ? ' style="object-position:' + esc(opts.focus) + '"' : "") + ">" : "";
    var initial = (!opts.image && opts.initial)
      ? '<span class="ph__initial" aria-hidden="true">' + esc(opts.initial) + "</span>" : "";
    var label = "";
    if (opts.title || opts.caption) {
      label = '<span class="ph__label">' +
        (opts.title   ? "<b>" + fmt(opts.title) + "</b>" : "") +
        (opts.caption ? fmt(opts.caption) : "") + "</span>";
    }
    return '<div class="' + cls.trim() + '" role="img" aria-label="' +
      esc(opts.alt || opts.title || "Placeholder image") + '">' + img + initial + label + "</div>";
  }
  /* ======================================================================
     HEADER
     ================================================================== */
  function crest(size) {
    var big = size === "lg" ? " crest--lg" : "";
    if (SITE.crestImage) {
      return '<img class="crest' + big + '" src="' +
        esc(ROOT + "assets/img/" + SITE.crestImage) + '" alt="" aria-hidden="true">';
    }
    return '<span class="crest crest--letter' + big + '" aria-hidden="true">' +
      esc(SITE.crestLetter || "C") + "</span>";
  }

  function currentPath() {
    /* Normalise "/people/index.html" and "/people/" to "people/". */
    var p = window.location.pathname.replace(/index\.html$/, "");
    var seg = p.split("/").filter(Boolean).pop();
    return seg ? seg + "/" : "";
  }

  function navLink(item, cur) {
    var href = url(item.path);
    var active = item.path === cur ||
      (item.path && cur && item.path.indexOf(cur) === 0 && cur !== "");
    return '<a class="nav__link" href="' + esc(href) + '"' +
      (active ? ' aria-current="page"' : "") +
      (isExternal(item.path) ? ' target="_blank" rel="noopener"' : "") +
      ">" + esc(item.label) + "</a>";
  }

  function renderHeader() {
    var host = document.querySelector("[data-site-header]");
    if (!host) return;
    var cur = currentPath();

    var items = (SITE.nav || []).map(function (item, i) {
      if (!item.children || !item.children.length) {
        return '<li class="nav__item">' + navLink(item, cur) + "</li>";
      }
      var id = "navmenu-" + i;
      var sub = item.children.map(function (c) {
        return '<li><a href="' + esc(url(c.path)) + '"' +
          (isExternal(c.path) ? ' target="_blank" rel="noopener"' : "") +
          ">" + esc(c.label) + "</a></li>";
      }).join("");
      /* The parent label is a real link too — the caret opens the submenu. */
      return '<li class="nav__item" data-has-menu>' +
        '<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="' + id + '">' +
          esc(item.label) + '<span class="nav__caret" aria-hidden="true"></span>' +
        "</button>" +
        '<ul class="nav__submenu" id="' + id + '">' +
          '<li><a href="' + esc(url(item.path)) + '">' + esc(item.label) + " Overview</a></li>" +
          sub +
        "</ul></li>";
    }).join("");

    var cta = SITE.navCta
      ? '<a class="btn nav__cta" href="' + esc(url(SITE.navCta.path)) + '"' +
        (isExternal(SITE.navCta.path) ? ' target="_blank" rel="noopener"' : "") +
        ">" + esc(SITE.navCta.label) + "</a>"
      : "";

    host.innerHTML =
      '<div class="wrap nav">' +
        '<a class="nav__brand" href="' + esc(ROOT || "./") + '">' + crest() +
          "<span>" + esc(SITE.name || "") + "</span></a>" +
        '<button class="nav__hamburger" type="button" aria-expanded="false" aria-label="Menu">' +
          "<span></span><span></span><span></span></button>" +
        '<ul class="nav__menu">' + items + (cta ? '<li class="nav__item">' + cta + "</li>" : "") + "</ul>" +
      "</div>";

    /* Behaviour */
    var header = host;
    var burger = host.querySelector(".nav__hamburger");
    burger.addEventListener("click", function () {
      var open = header.classList.toggle("site-header--open");
      burger.setAttribute("aria-expanded", String(open));
    });

    host.querySelectorAll("[data-has-menu]").forEach(function (li) {
      var btn = li.querySelector(".nav__toggle");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = li.classList.contains("nav__item--open");
        closeMenus();
        if (!open) { li.classList.add("nav__item--open"); btn.setAttribute("aria-expanded", "true"); }
      });
    });
    function closeMenus() {
      host.querySelectorAll(".nav__item--open").forEach(function (li) {
        li.classList.remove("nav__item--open");
        var b = li.querySelector(".nav__toggle");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    }
    document.addEventListener("click", closeMenus);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeMenus();
        header.classList.remove("site-header--open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ======================================================================
     FOOTER
     ================================================================== */
  function renderFooter() {
    var host = document.querySelector("[data-site-footer]");
    if (!host) return;
    var c = SITE.contact || {};

    var cols = (SITE.footerColumns || []).map(function (col) {
      var links = (col.links || []).map(function (l) {
        return "<li><a href=\"" + esc(url(l.path)) + "\"" +
          (isExternal(l.path) ? ' target="_blank" rel="noopener"' : "") +
          ">" + esc(l.label) + "</a></li>";
      }).join("");
      return "<div><h2 class=\"footer__h\">" + esc(col.heading) + "</h2>" +
        '<ul class="footer__list">' + links + "</ul></div>";
    }).join("");

    host.innerHTML =
      '<div class="wrap">' +
        '<div class="footer__grid">' +
          "<div>" +
            '<p class="footer__wordmark">' + esc(SITE.shortName || SITE.name) + "<br>College</p>" +
            (SITE.motto ? '<p class="motto">' + esc(SITE.motto) + "</p>" : "") +
            "<p>" + (c.mailStop ? fmt(c.mailStop) + " &middot; " : "") + "Rice University<br>" +
              fmt(c.street) + "<br>" + fmt(c.city) + "</p>" +
            "<p>" +
              (c.phone ? "&#9742; " + fmt(c.phone) + "<br>" : "") +
              (c.email ? '&#9993; <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>" : "") +
            "</p>" +
          "</div>" +
          cols +
        "</div>" +
        '<div class="footer__bottom">' +
          "<span>&copy; " + new Date().getFullYear() + " " + esc(SITE.name) + ", Rice University</span>" +
          (SITE.footerNote ? "<span>" + fmt(SITE.footerNote) + "</span>" : "<span></span>") +
        "</div>" +
      "</div>";
  }

  /* ======================================================================
     SHARED BLOCKS
     ================================================================== */
  function renderBanner() {
    var host = mount("banner");
    if (!host) return;
    host.innerHTML = figure({ className: "banner__bg" });
  }

  function renderLocate() {
    var host = mount("locate");
    if (!host) return;
    var c = SITE.contact || {};
    host.innerHTML =
      '<div class="locate">' +
        '<div class="locate__text"><div class="wrap wrap--narrow">' +
          '<p class="eyebrow">Find us at Rice</p>' +
          "<h2>" + esc(SITE.name) + "</h2>" +
          "<p>" + fmt(c.street) + " &middot; " + fmt(c.city) + "</p>" +
          "<p>" + (c.mailStop ? fmt(c.mailStop) + " &middot; " : "") + "Rice University</p>" +
          (c.mapLink ? '<p><a class="btn btn--outline" href="' + esc(c.mapLink) +
            '" target="_blank" rel="noopener">Get Directions</a></p>' : "") +
        "</div></div>" +
        '<div class="locate__map">' +
          (c.mapEmbed
            ? '<iframe title="Map to ' + esc(SITE.name) + '" src="' + esc(c.mapEmbed) +
              '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
            : figure({ title: "Map", caption: "[PLACEHOLDER: map embed]" })) +
        "</div>" +
      "</div>";
  }

  /* ======================================================================
     PAGE: HOME
     ================================================================== */
  function renderHome() {
    var h = SITE.hero || {};

    var hero = mount("hero");
    if (hero) {
      /* crestPlacement: "above" (own line, centered), "between" (set into the
         wordmark) or "none". */
      var place = h.crestPlacement || "above";
      var wordmark = place === "between"
        ? esc(h.wordmarkA) + crest("lg") + esc(h.wordmarkB)
        : esc(h.wordmarkA) + " " + esc(h.wordmarkB);
      var crestAbove = place === "above" ? '<div class="hero__crest">' + crest("lg") + "</div>" : "";
      var links = (h.links || []).map(function (l) {
        return '<a class="btn btn--ghost" href="' + esc(url(l.path)) + '"' +
          (isExternal(l.path) ? ' target="_blank" rel="noopener"' : "") +
          ">" + esc(l.label) + "</a>";
      }).join("");
      hero.className = "hero ph";
      hero.innerHTML =
        (h.image ? '<img src="' + esc(ROOT + "assets/img/" + h.image) + '" alt=""' +
          (h.focus ? ' style="object-position:' + esc(h.focus) + '"' : "") + ">" : "") +
        '<div class="hero__inner">' +
          crestAbove +
          '<h1 class="hero__wordmark">' + wordmark + "</h1>" +
          (SITE.motto ? '<p class="motto">' + esc(SITE.motto) + "</p>" : "") +
          (h.tagline ? '<p class="hero__tagline">' + fmt(h.tagline) + "</p>" : "") +
          '<div class="hero__links">' + links + "</div>" +
        "</div>";
    }

    var w = mount("welcome");
    if (w && SITE.welcome) {
      w.innerHTML =
        '<div class="wrap"><div class="grid grid--2">' +
          '<div class="prose"><p class="eyebrow">Welcome</p><h2>' + fmt(SITE.welcome.heading) + "</h2>" +
            paras(SITE.welcome.body) + "</div>" +
          "<div>" + figure({
            className: "welcome__photo",
            image: SITE.welcome.image ? ROOT + "assets/img/" + SITE.welcome.image : null,
            alt: SITE.welcome.alt || "",
            focus: SITE.welcome.focus,
            title: SITE.welcome.image ? null : "[PLACEHOLDER: photo]"
          }) + "</div>" +
        "</div></div>";
    }

    var a = mount("announcements");
    if (a) {
      var rows = (SITE.announcements || []).map(function (n) {
        var title = n.link
          ? '<a href="' + esc(url(n.link)) + '">' + fmt(n.title) + "</a>" : fmt(n.title);
        return "<li>" +
          "<time" + (n.datetime ? ' datetime="' + esc(n.datetime) + '"' : "") + ">" + fmt(n.date) + "</time>" +
          "<div><h3>" + title + "</h3><p>" + fmt(n.body) + "</p></div></li>";
      }).join("");
      a.innerHTML = '<div class="wrap"><p class="eyebrow">News</p><h2>Announcements</h2>' +
        '<ul class="announce">' + rows + "</ul></div>";
    }

    var p = mount("photos");
    if (p) {
      var tiles = (SITE.photos || []).map(function (t) {
        return figure({
          title: t.title, caption: t.caption, focus: t.focus,
          image: t.image ? ROOT + "assets/img/" + t.image : null,
          alt: t.image ? (t.alt || t.title || t.caption) : ""
        });
      }).join("");
      p.innerHTML = '<div class="wrap">' +
        (SITE.photosHeading ? "<h2>" + fmt(SITE.photosHeading) + "</h2>" : "") +
        (SITE.photosLead ? '<p class="section__lead">' + fmt(SITE.photosLead) + "</p>" : "") +
        '<div class="strip" style="margin-top:var(--space-6)">' + tiles + "</div></div>";
    }
  }

  /* ======================================================================
     PAGE: ABOUT
     ================================================================== */
  function renderAbout() {
    var host = mount("about");
    if (!host || !PAGES.about) return;
    var a = PAGES.about;

    var sections = (a.sections || []).map(function (s) {
      var src = s.source
        ? '<p class="section__lead" style="font-size:.85rem">Source: <a href="' +
          esc(s.source.url) + '" target="_blank" rel="noopener">' + esc(s.source.label) + "</a></p>"
        : "";
      return '<section class="prose"><h2>' + fmt(s.heading) + "</h2>" + paras(s.body) + src + "</section>";
    }).join("");

    var facts = (a.facts || []).map(function (f) {
      return "<div><dt>" + esc(f.term) + "</dt><dd>" + fmt(f.detail) + "</dd></div>";
    }).join("");

    var reading = (a.links || []).map(function (l) {
      return '<li><a href="' + esc(l.path) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>" +
        (l.detail ? '<br><span class="rcard__pronouns" style="text-align:left;display:block">' +
          esc(l.detail) + "</span>" : "") + "</li>";
    }).join("");

    host.innerHTML =
      '<div class="wrap section">' +
        '<p class="section__lead">' + fmt(a.intro) + "</p>" +
        '<div class="grid grid--2" style="margin-top:var(--space-7);align-items:start">' +
          "<div>" + sections + "</div>" +
          "<aside><h2>At a Glance</h2>" +
            '<dl class="info-list">' + facts + "</dl>" +
            (reading
              ? '<h2 style="margin-top:var(--space-7)">Further Reading</h2>' +
                '<ul class="footer__list" style="gap:var(--space-4)">' + reading + "</ul>"
              : "") +
          "</aside>" +
        "</div>" +
      "</div>";
  }

  /* ======================================================================
     PEOPLE — shared building blocks
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     Two layouts, deliberately kept apart:

       rosterCard()  Uniform card — role, name, pronouns, fixed-ratio portrait,
                     contact. Nothing variable-length goes inside, so a grid row
                     can never go ragged. Long position descriptions are lifted
                     out into a duties list beneath the grid.

       profile()     Flowing article with a floated portrait, for the long
                     leadership bios. Text wraps the photo, so a 400-word bio
                     and a 60-word bio both read correctly.
     ================================================================== */

  function initialOf(name) {
    var m = String(name || "").trim().charAt(0).toUpperCase();
    return /[A-Z]/.test(m) ? m : "";
  }

  function rosterCard(p, opts) {
    opts = opts || {};
    var role = opts.role || p.role || "";
    var mail = p.email
      ? '<a href="mailto:' + esc(p.email) + '">' + esc(p.email) + "</a>"
      : '<span class="rcard__note">[PLACEHOLDER: email]</span>';

    return '<article class="rcard">' +
      '<div class="rcard__bar"></div>' +
      '<div class="rcard__body">' +
        (role ? '<p class="rcard__role">' + fmt(role) + "</p>" : "") +
        '<p class="rcard__name">' + fmt(p.name) +
          (p.year ? ' <span class="rcard__year">' + esc(p.year) + "</span>" : "") + "</p>" +
        '<p class="rcard__pronouns">' + (p.pronouns ? esc(p.pronouns) : "&nbsp;") + "</p>" +
        figure({
          className: "rcard__photo",
          image: p.photo ? ROOT + "assets/img/people/" + p.photo : null,
          alt: p.photo ? p.name : "",
          focus: p.focus,
          initial: initialOf(p.name)
        }) +
        '<p class="rcard__contact">' + mail +
          (p.optOut ? '<br><span class="rcard__note">Photo not shown by request</span>' : "") +
        "</p>" +
      "</div></article>";
  }

  function roster(list, opts) {
    if (!list || !list.length) return "";
    return '<div class="grid grid--4">' +
      list.map(function (p) { return rosterCard(p, opts); }).join("") + "</div>";
  }

  function groupHead(title, lead) {
    return '<div class="group-head"><h2>' + fmt(title) + "</h2>" +
      (lead ? "<p>" + fmt(lead) + "</p>" : "") + "</div>";
  }

  /* Position descriptions, collected below a roster instead of inside it. */
  function duties(list, heading) {
    var seen = {}, rows = [];
    (list || []).forEach(function (p) {
      if (!p.description || seen[p.description]) return;
      seen[p.description] = true;
      rows.push("<div><dt>" + esc(p.role || p.name) + "</dt><dd>" + fmt(p.description) + "</dd></div>");
    });
    if (!rows.length) return "";
    return '<div class="duties"><h3>' + esc(heading) + "</h3>" +
      '<dl class="info-list">' + rows.join("") + "</dl></div>";
  }

  function profile(entry) {
    var people = entry.people || [{ name: entry.name, email: entry.email, pronouns: entry.pronouns }];
    var names = people.map(function (n) {
      return esc(n.name) +
        (n.pronouns ? ' <span class="profile__pronouns">(' + esc(n.pronouns) + ")</span>" : "");
    }).join(" &amp; ");
    var mails = people.filter(function (n) { return n.email; }).map(function (n) {
      return '<a href="mailto:' + esc(n.email) + '">' + esc(n.email) + "</a>";
    }).join(" &middot; ");

    return '<article class="profile">' +
      '<div class="profile__head">' +
        (entry.role ? '<p class="profile__role">' + esc(entry.role) + "</p>" : "") +
        '<h3 class="profile__name">' + names + "</h3>" +
        (mails ? '<p class="profile__contact">' + mails + "</p>" : "") +
      "</div>" +
      '<div class="profile__body">' +
        figure({
          className: "profile__photo",
          image: entry.photo ? ROOT + "assets/img/people/" + entry.photo : null,
          alt: entry.photo ? people.map(function (n) { return n.name; }).join(" and ") : "",
          focus: entry.focus,
          initial: initialOf(people[0] && people[0].name)
        }) +
        bioParas(entry.bio) +
      "</div></article>";
  }

  /* Pill tab switcher. `groups` is [{ label, html }]. */
  function tabs(groups, idBase) {
    groups = groups.filter(function (g) { return g && g.html; });
    if (!groups.length) return "";
    if (groups.length === 1) return groups[0].html;

    var pills = groups.map(function (g, i) {
      return '<li role="presentation"><button class="pill" type="button" role="tab" ' +
        'id="' + idBase + "-tab-" + i + '" aria-controls="' + idBase + "-panel-" + i + '" ' +
        'aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? "0" : "-1") + '">' +
        esc(g.label) + "</button></li>";
    }).join("");

    var panels = groups.map(function (g, i) {
      return '<div class="tabpanel" role="tabpanel" id="' + idBase + "-panel-" + i + '" ' +
        'aria-labelledby="' + idBase + "-tab-" + i + '"' + (i === 0 ? "" : " hidden") + ">" +
        g.html + "</div>";
    }).join("");

    return '<ul class="pills" role="tablist" data-tabs="' + idBase + '">' + pills + "</ul>" + panels;
  }

  function wireTabs(scope) {
    (scope || document).querySelectorAll("[data-tabs]").forEach(function (list) {
      var btns = [].slice.call(list.querySelectorAll(".pill"));
      function select(i) {
        btns.forEach(function (b, j) {
          var on = i === j;
          b.setAttribute("aria-selected", String(on));
          b.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(b.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
      }
      btns.forEach(function (b, i) {
        b.addEventListener("click", function () { select(i); });
        b.addEventListener("keydown", function (e) {
          var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var n = (i + d + btns.length) % btns.length;
          btns[n].focus(); select(n);
        });
      });
    });
  }

  /* ======================================================================
     PEOPLE — page renderers (one per subpage)
     ================================================================== */

  function renderPeopleIndex() {
    var host = mount("people");
    if (!host) return;
    var cards = (SITE.peopleSections || []).map(function (s) {
      return '<a class="card" href="' + esc(url(s.path)) + '">' +
        "<h3>" + esc(s.label) + "</h3><p>" + fmt(s.blurb) + "</p></a>";
    }).join("");
    host.innerHTML = '<div class="wrap section"><div class="grid grid--3">' + cards + "</div></div>";
  }

  function renderTeam() {
    var host = mount("team");
    if (!host) return;
    /* One pill per role group, in the order the data lists them. */
    var order = [], byRole = {};
    (PPL.leadership || []).forEach(function (e) {
      var key = e.group || e.role || "Team";
      if (!byRole[key]) { byRole[key] = []; order.push(key); }
      byRole[key].push(e);
    });
    var groups = order.map(function (key) {
      return { label: key, html: byRole[key].map(profile).join("") };
    });
    host.innerHTML = '<div class="wrap section">' + tabs(groups, "team") + "</div>";
  }

  function renderGovernment() {
    var host = mount("government");
    if (!host) return;
    host.innerHTML = '<div class="wrap section">' +
      groupHead("The Chabinet", SITE.blurbs && SITE.blurbs.government) +
      roster(PPL.government) +
      duties(PPL.government, "What each officer does") +
      "</div>";
  }

  function renderCourt() {
    var host = mount("court");
    if (!host) return;
    host.innerHTML = '<div class="wrap section">' +
      groupHead("Court & Class Representatives", SITE.blurbs && SITE.blurbs.court) +
      roster(PPL.court) +
      "</div>";
  }

  function renderCommittees() {
    var host = mount("committees");
    if (!host) return;
    /* Jurisdiction codes as they appear in the committees document. */
    var JURIS = {
      EVP: "External Vice President",
      IVP: "Internal Vice President",
      CVP: "Community Vice President"
    };

    function respList(items) {
      return "<ul>" + (items || []).map(function (r) {
        if (typeof r === "string") return "<li>" + fmt(r) + "</li>";
        return "<li><strong>" + fmt(r.heading) + "</strong>" + respList(r.items) + "</li>";
      }).join("") + "</ul>";
    }

    var blocks = (PPL.committees || []).map(function (c) {
      var juris = c.jurisdiction
        ? '<p class="juris">' + esc(JURIS[c.jurisdiction] || c.jurisdiction) +
          " (" + esc(c.jurisdiction) + ") jurisdiction</p>"
        : "";
      var resp = (c.responsibilities && c.responsibilities.length)
        ? '<details class="resp"><summary>Responsibilities</summary>' +
          respList(c.responsibilities) + "</details>"
        : "";
      return '<section style="margin-bottom:var(--space-9)">' +
        '<div class="group-head"><h3>' + fmt(c.name) + "</h3>" + juris +
          (c.description ? "<p>" + fmt(c.description) + "</p>" : "") + "</div>" +
        roster(c.members) + resp + "</section>";
    }).join("");
    var B = SITE.blurbs || {};
    var expect = (B.committeeExpectations && B.committeeExpectations.length)
      ? '<details class="resp expect"><summary>General expectations for every committee</summary><ul>' +
        B.committeeExpectations.map(function (e) { return "<li>" + fmt(e) + "</li>"; }).join("") +
        "</ul></details>"
      : "";
    var propose = B.committeeProposal
      ? '<p class="propose">' + fmt(B.committeeProposal.text) +
        ' <a href="' + esc(B.committeeProposal.path) + '" target="_blank" rel="noopener">' +
        esc(B.committeeProposal.label) + "</a></p>"
      : "";

    host.innerHTML = '<div class="wrap section">' +
      groupHead("Committees & Representatives", B.committees) +
      expect + propose + blocks + "</div>";
  }

  function renderStudentStaff() {
    var host = mount("student-staff");
    if (!host) return;
    var B = SITE.blurbs || {};

    var rhas = (PPL.rhas || []).map(function (r) {
      return { name: r.name, role: r.head ? "Head RHA" : "RHA", pronouns: r.pronouns,
               email: r.email, photo: r.photo, focus: r.focus, optOut: r.optOut };
    });
    var ajs = (PPL.ajs || []).map(function (r) {
      return { name: r.name, role: r.floor, pronouns: r.pronouns,
               email: r.email, photo: r.photo, focus: r.focus, optOut: r.optOut };
    });
    var paas = (PPL.paas || []).map(function (r) {
      return { name: r.name, role: r.head ? "Head PAA" : "PAA", pronouns: r.pronouns,
               email: r.email, photo: r.photo, focus: r.focus, optOut: r.optOut };
    });

    function panel(title, lead, link, list) {
      return '<div class="group-head"><h3>' + esc(title) + "</h3>" +
        (lead ? "<p>" + fmt(lead) + "</p>" : "") +
        (link ? '<p><a href="' + esc(link.path) + '" target="_blank" rel="noopener">' +
          esc(link.label) + "</a></p>" : "") +
        "</div>" + roster(list);
    }

    host.innerHTML = '<div class="wrap section">' + tabs([
      { label: "RHAs", html: panel("Rice Health Advisors", B.rhas, B.rhasLink, rhas) },
      { label: "AJs",  html: panel("AJs", B.ajs, B.ajsLink, ajs) },
      { label: "PAAs", html: panel("Peer Academic Advisors", B.paas, B.paasLink, paas) }
    ], "staff") + "</div>";
  }

  function renderAssociates() {
    var host = mount("associates");
    if (!host) return;
    var A = PPL.associates || {};
    function list(items) {
      return '<ul class="footer__list" style="gap:var(--space-3)">' + (items || []).map(function (a) {
        return "<li><strong>" + esc(a.name) + "</strong>" +
          (a.detail ? '<br><span class="rcard__pronouns" style="text-align:left;display:block">' +
            esc(a.detail) + "</span>" : "") +
          (a.da ? ' <span class="rcard__pronouns" style="display:inline">&middot; ' + esc(a.da) + "</span>" : "") +
          "</li>";
      }).join("") + "</ul>";
    }
    host.innerHTML = '<div class="wrap section">' +
      groupHead("Faculty, Staff & Community Associates", SITE.blurbs && SITE.blurbs.associates) +
      '<div class="grid grid--3">' +
        "<div><h3>Faculty Associates</h3>"   + list(A.faculty)   + "</div>" +
        "<div><h3>Staff Associates</h3>"     + list(A.staff)     + "</div>" +
        "<div><h3>Community Associates</h3>" + list(A.community) + "</div>" +
      "</div></div>";
  }

  /* ======================================================================
     PAGE: RESOURCES
     ================================================================== */
  function renderResources() {
    var host = mount("resources");
    if (!host || !PAGES.resources) return;
    var r = PAGES.resources;

    var groups = (r.groups || []).map(function (g, i) {
      var cards = (g.cards || []).map(function (c) {
        var inner =
          "<h3>" + fmt(c.title) + "</h3>" +
          "<p>" + fmt(c.body) + "</p>" +
          (c.cta
            ? '<p class="card__foot">' +
              (c.path ? '<span class="btn btn--outline">' + fmt(c.cta) + "</span>"
                      : '<span class="rcard__note" style="text-align:left">' + fmt(c.cta) + "</span>") +
              "</p>"
            : "");
        return c.path
          ? '<a class="card" href="' + esc(url(c.path)) + '"' +
            (isExternal(c.path) ? ' target="_blank" rel="noopener"' : "") + ">" + inner + "</a>"
          : '<article class="card">' + inner + "</article>";
      }).join("");
      return '<section id="' + esc(g.id) + '" class="section' + (i % 2 ? " section--tint" : "") + '">' +
        '<div class="wrap"><h2>' + fmt(g.heading) + "</h2>" +
        '<div class="grid grid--3">' + cards + "</div></div></section>";
    }).join("");

    host.innerHTML = '<div class="wrap section"><p class="section__lead">' + fmt(r.intro) + "</p></div>" + groups;
  }

  /* ======================================================================
     PAGE: O-WEEK
     ================================================================== */
  function renderOweek() {
    var host = mount("oweek");
    if (!host || !PAGES.oweek) return;
    var o = PAGES.oweek;

    var coords = roster(o.coordinators);
    var sections = (o.sections || []).map(function (s) {
      return '<section class="prose" style="margin-bottom:var(--space-7)"><h2>' +
        fmt(s.heading) + "</h2>" + paras(s.body) + "</section>";
    }).join("");

    host.innerHTML =
      '<div class="wrap section">' +
        '<p class="section__lead">' + fmt(o.intro) + "</p>" +
      "</div>" +
      '<section class="section section--tint"><div class="wrap">' +
        "<h2>Coordinators</h2>" +
        (o.coordinatorsPhoto
          ? '<div class="oweek-photo">' + figure({
              className: "oweek-photo__img",
              image: ROOT + "assets/img/" + o.coordinatorsPhoto.image,
              alt:   o.coordinatorsPhoto.alt,
              focus: o.coordinatorsPhoto.focus
            }) + "</div>"
          : "") +
        coords +
      "</div></section>" +
      '<section class="section"><div class="wrap wrap--narrow">' + sections +
        (o.links && o.links.length
          ? "<h2>At Rice</h2><ul class=\"footer__list\">" + o.links.map(function (l) {
              return '<li><a href="' + esc(l.path) + '" target="_blank" rel="noopener">' +
                esc(l.label) + "</a></li>";
            }).join("") + "</ul>"
          : "") +
      "</div></section>";
  }

  /* ======================================================================
     PAGE: CALENDAR
     ================================================================== */
  function renderCalendar() {
    var host = mount("calendar");
    if (!host || !PAGES.calendar) return;
    var c = PAGES.calendar;

    var panel = c.embedSrc
      ? '<iframe class="calendar-embed" title="' + esc(SITE.name) + ' calendar" src="' +
        esc(c.embedSrc) + '" loading="lazy"></iframe>'
      : figure({
          className: "calendar-ph",
          title: "Calendar",
          caption: "[PLACEHOLDER: paste the Google Calendar embed URL into data/pages.js]"
        });

    var links = (c.links || []).map(function (l) {
      return l.path
        ? '<li><a href="' + esc(url(l.path)) + '"' + (isExternal(l.path) ? ' target="_blank" rel="noopener"' : "") +
          ">" + fmt(l.label) + "</a></li>"
        : "<li>" + fmt(l.label) + "</li>";
    }).join("");

    host.innerHTML =
      '<div class="wrap section">' +
        '<p class="section__lead">' + fmt(c.intro) + "</p>" +
        '<div style="margin:var(--space-6) 0">' + panel + "</div>" +
        '<h2>Related Calendars</h2><ul class="footer__list">' + links + "</ul>" +
      "</div>";
  }

  /* ======================================================================
     BOOT
     ================================================================== */
  function init() {
    /* Page <title> and the browser tab stay in sync with the college name. */
    document.title = document.title.replace(/\{\{site\}\}/g, SITE.name || "");

    renderHeader();
    renderBanner();

    var page = document.body.getAttribute("data-page");
    if (page === "home")          renderHome();
    if (page === "about")         renderAbout();
    if (page === "people")        renderPeopleIndex();
    if (page === "team")          renderTeam();
    if (page === "government")    renderGovernment();
    if (page === "court")         renderCourt();
    if (page === "committees")    renderCommittees();
    if (page === "student-staff") renderStudentStaff();
    if (page === "associates")    renderAssociates();
    if (page === "resources")     renderResources();
    if (page === "oweek")         renderOweek();
    if (page === "calendar")      renderCalendar();

    wireTabs(document);

    renderLocate();
    renderFooter();

    /* Deep links like /people/#committees must clear the sticky header. */
    if (window.location.hash) {
      var target = document.querySelector(window.location.hash);
      if (target) setTimeout(function () { target.scrollIntoView(); }, 0);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
