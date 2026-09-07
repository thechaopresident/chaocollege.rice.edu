/* ============================================================================
   CHAO COLLEGE — SITE DATA
   ----------------------------------------------------------------------------
   Edit this file to change navigation, the hero, quick links, announcements
   and the footer. You do not need to touch any .html file.

   Paths are relative to the site root and must NOT start with "/".
     ""            -> homepage
     "people/"     -> /people/
     "https://..." -> external link (opens in a new tab automatically)

   TEXT POLICY: no copy on this site is written by anyone but Chao. Any string
   that reads "[PLACEHOLDER: ...]" is a slot awaiting exact wording from the
   college. Replace the whole string, brackets included. Search the repo for
   "[PLACEHOLDER" to find every one.
   ========================================================================= */

window.CHAO_SITE = {

  /* --- Identity -------------------------------------------------------- */
  name:        "Chao College",
  shortName:   "Chao",
  domain:      "chaocollege.rice.edu",

  /* From the college crest. */
  motto:       "Una Domus, Multae Viae",
  mascot:      "Dragons",

  /* File in assets/img/. Set to null to fall back to the lettered mark. */
  crestImage:  "crest.png",
  crestLetter: "C",

  /* --- Contact (footer + Find Us band) --------------------------------- */
  contact: {
    mailStop: null,
    street:   "6380 Main St",
    city:     "Houston, TX 77005",
    phone:    "[PLACEHOLDER: college phone]",
    email:    "chaosecretaries@gmail.com",
    mapEmbed: "https://www.google.com/maps?q=6380+Main+St,+Houston,+TX+77005&output=embed",
    mapLink:  "https://www.google.com/maps/search/?api=1&query=6380+Main+St+Houston+TX+77005"
  },

  /* --- Primary navigation ---------------------------------------------- *
     Add a page: add an entry here AND create the matching folder with an
     index.html. A `children` array turns the item into a dropdown.         */
  nav: [
    { label: "About",  path: "about/" },
    { label: "People", path: "people/",
      children: [
        { label: "The Chao Team",      path: "people/team/" },
        { label: "Student Government", path: "people/government/" },
        { label: "Court & Class Reps", path: "people/court/" },
        { label: "Committees",         path: "people/committees/" },
        { label: "RHAs, AJs & PAAs",   path: "people/student-staff/" },
        { label: "Associates",         path: "people/associates/" }
      ]
    },
    { label: "Resources", path: "resources/" },
    { label: "O-Week",    path: "oweek/" },
    { label: "Calendar",  path: "calendar/" }
  ],

  /* Button pinned to the right of the nav. Set to null to remove it. */
  navCta: null,   // e.g. { label: "Donate", path: "https://riceconnect.rice.edu/..." }

  /* --- Homepage hero ---------------------------------------------------- */
  hero: {
    wordmarkA: "Chao",
    wordmarkB: "College",
    /* Where the crest sits in the hero:
         "above"   — its own line, centered over the wordmark (current)
         "between" — set into the wordmark, between the two words
         "none"    — no crest in the hero */
    crestPlacement: "above",
    /* Verbatim from the preliminary draft site. */
    tagline: "Home of the Chaosens",
    /* Architectural rendering of the college. Master in brand/photo-originals/. */
    image: "hero.jpg",
    focus: "center 60%",
    links: [
      { label: "Calendar",      path: "calendar/" },
      { label: "People",        path: "people/" },
      { label: "Resources",     path: "resources/" },
      { label: "O-Week",        path: "oweek/" },
      { label: "About Chao",    path: "about/" }
    ]
  },

  /* --- People landing page ----------------------------------------------
     Cards on /people/ that link through to each subpage.                  */
  peopleSections: [
    { label: "The Chao Team",      path: "people/team/",
      blurb: "Magisters, the College Coordinator, and the Resident Associates." },
    { label: "Student Government", path: "people/government/",
      blurb: "The Chabinet — Chao's elected executive officers." },
    { label: "Court & Class Reps", path: "people/court/",
      blurb: "University Court representative and the class representatives." },
    { label: "Committees",         path: "people/committees/",
      blurb: "The committees and representatives that run college life." },
    { label: "RHAs, AJs & PAAs",   path: "people/student-staff/",
      blurb: "Rice Health Advisors, floor AJs, and Peer Academic Advisors." },
    { label: "Associates",         path: "people/associates/",
      blurb: "Faculty, staff, and Houston community members attached to Chao." }
  ],

  /* --- Group descriptions used at the top of each People subpage --------
     SOURCES: RHA and PAA wording is quoted from the official Rice pages
     linked beside them. The associates line is from the preliminary draft
     site. Everything else is still open.                                   */
  blurbs: {
    government: "[PLACEHOLDER: one or two sentences about Chao's student government.]",
    court:      "[PLACEHOLDER: one or two sentences about the Court and class representatives.]",
    committees: "[PLACEHOLDER: one or two sentences about how Chao's committees work.]",
    associates: "Rice faculty, staff, and Houston community members who volunteer their time to mentor and support Chao students.",

    rhas:     "RHAs are students who have been trained on a variety of wellbeing topics. These students work at their college to provide health education opportunities, health supplies and peer guidance.",
    rhasLink: { label: "Rice Student Wellbeing — Peer Resources", path: "https://wellbeing.rice.edu/student-wellbeing/peer-resources" },

    ajs:      "[PLACEHOLDER: what AJs do at Chao, and what the initials stand for.]",
    ajsLink:  null,

    /* COMMITTEES DOC — verbatim from "Chao Committees Descriptions". */
    committeeExpectations: [
      "Attend all Cab meetings and actively contribute to discussions",
      "Communicate regularly with your VP and provide updates on progress",
      "Plan ahead and execute events in a timely, organized manner",
      "Take ownership of your committee's responsibilities and outcomes",
      "Delegate tasks effectively and hold committee members accountable",
      "Maintain clear, consistent communication with the college (GroupMe, etc.)",
      "Be proactive: identify opportunities, solve problems, and help improve processes",
      "Uphold and contribute to Chao's culture, energy, and standards"
    ],
    committeeProposal: {
      text:  "Don't see a committee? Want to start one?",
      label: "Committee Proposal and New Ideas Form",
      path:  "https://forms.gle/DkDdqQBefKfBgDXLA"
    },

    paas:     "Peer Academic Advisors (PAAs) are an integral part of the advising community at Rice, and have been nationally recognized by the National Academic Advising Association (NACADA).",
    paasLink: { label: "Rice Office of Academic Advising — Peer Academic Advisors", path: "https://oaa.rice.edu/advising-network/peer-academic-advisors" }
  },

  /* --- Homepage welcome ------------------------------------------------- */
  welcome: {
    /* Verbatim from the preliminary draft site (chaosite-home-draft).
       Confirm this is the wording the college wants to keep. */
    heading: "Welcome to the Newest (and best) College",
    body: [
      "Chao College is Rice University's twelfth residential college. It is a home for three hundred undergraduates, their magisters, their resident associates, and a growing kindness of dragons. Our rooms face the oak grove. Our commons faces south. Our door is always open.",
      "This is a place where firsts belong: first O-Weeks, first traditions, first public speeches, first all-nighters. We are new. That's what makes it good."
    ],
    image: "construction-interior.jpg",
    alt:   "Building tour interior",
    focus: "center center"
  },

  /* --- Homepage announcements ------------------------------------------- *
     Newest first. `date` is the visible label; `datetime` is machine-readable
     (YYYY-MM-DD) and may be left "". Delete an entry to remove its row.     */
  announcements: [
    { date: "September 7, 2026", datetime: "2026-09-07", title: "We have a website!",
      body: "It’s what you’re looking at right now", link: null },
    { date: "9/6/2026", datetime: "2026-09-06", title: "It's Sunday, but it’s like a Saturday!",
      body: "I love labor day weekend :)", link: null },
    { date: "September 5, 2026", datetime: "2026-09-05", title: "We got a ping-pong table!",
      body: "Pretty self-explanatory…", link: null }
  ],

  /* --- Homepage photo strip --------------------------------------------- *
     Each entry renders a brand-colored placeholder tile. Add `image` (a
     filename in assets/img/) to swap in a real photo.                       */
  photosHeading: "The college in motion.",
  photosLead:    "A few frames from the first year of Chao College.",
  /* No visible captions on these — the tiles run clean. The `alt` strings are
     for screen readers only and are verbatim from the preliminary draft site.
     Note: the first image shows lion dance costumes rather than a dragon
     mascot, so that alt text is worth correcting with the college.
     Setting `caption` (or `title`) on an entry brings the label back. */
  photos: [
    { title: null, caption: null, alt: "Chao College community celebration with the dragon mascot",
      image: "hall-of-fame.jpg", focus: "center 40%" },
    { title: null, caption: null, alt: "Chao students with the Rice servery chef",
      image: "servery-event.jpg", focus: "center 30%" },
    { title: null, caption: null, alt: "Chao College reception",
      image: "reception.jpg", focus: "center 40%" },
    { title: null, caption: null, alt: "Building tour exterior",
      image: "construction-exterior.jpg", focus: "center center" }
  ],

  /* --- Footer link columns ---------------------------------------------- */
  footerColumns: [
    { heading: "The College", links: [
      { label: "About Chao", path: "about/" },
      { label: "People",     path: "people/" },
      { label: "Resources",  path: "resources/" },
      { label: "O-Week",     path: "oweek/" },
      { label: "Calendar",   path: "calendar/" }
    ]},
    { heading: "Rice University", links: [
      { label: "Rice Home",              path: "https://www.rice.edu" },
      { label: "Housing",                path: "https://housing.rice.edu" },
      { label: "Dining",                 path: "https://dining.rice.edu" },
      { label: "Academic Advising",      path: "https://oaa.rice.edu" },
      { label: "Wellbeing & Counseling", path: "https://wellbeing.rice.edu" },
      { label: "O-Week",                 path: "https://success.rice.edu/first-year-programs/o-week" },
      { label: "Rice Emergency",         path: "https://emergency.rice.edu" }
    ]}
  ],

  footerNote: null
};
