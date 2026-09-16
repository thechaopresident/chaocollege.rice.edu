/* ============================================================================
   CHAO COLLEGE — PAGE CONTENT (About, Resources, O-Week, Calendar)
   ----------------------------------------------------------------------------
   TEXT POLICY: every string here is either reproduced verbatim from material
   supplied by the college, or an explicit "[PLACEHOLDER: ...]" slot awaiting
   exact wording. Nothing is drafted on the college's behalf.

   Two sources are in play, both marked inline:
     DRIVE — "Main Page" in the Chao Secretaries Google Drive.
     DRAFT — the preliminary WordPress site at
             chaocollege.rice.edu/chaosite-home-draft/ (pulled 2026-09-07).
   Draft copy has not necessarily been approved. Confirm before launch.

   Paragraph arrays render as separate <p> elements.
   ========================================================================= */

window.CHAO_PAGES = {

  /* ======================================================================
     ABOUT
     ================================================================== */
  about: {
    /* No page intro — the sections start straight away. Set a string here if
       one is ever wanted; the renderer skips it while this is null. */
    intro: null,

    sections: [
      {
        heading: "About the Chao Family",
        /* DRIVE — verbatim. Do not reword. */
        body: [
          "The Chao family has long been known for its pioneering contributions to the global performance and essential materials industries, for its housing and infrastructure products businesses, and for its legacy of civic and philanthropic leadership in Houston and beyond. The late Ting Tsung (T.T.) Chao built a global enterprise in Asia before moving his business to Houston in the 1980s with his wife, Wei Fong. He and their sons James and Albert went on to found Westlake Corp., now a Fortune 500 company. Four of the siblings' children are Rice alumni, as are Albert's wife and James' daughter-in-law. In 2008, the family's foundation awarded a grant to establish the Chao Center for Asian Studies in the School of Humanities. The family has also supported initiatives such as the establishment of Chao chair professorships and student scholarships, as well as the ongoing Asian American Community Study in the Kinder Institute for Urban Research. Other grant awards have supported the development of affordable life-saving technology through the Rice360 Institute for Global Health Technologies, the Rice Emerging Scholars Program, Brockman Hall for Opera in the Shepherd School of Music and William T. Cannady Hall for Architecture."
        ],
        source: {
          label: "Rice University news release",
          url: "https://www.prnewswire.com/news-releases/chao-family-gift-supports-names-rice-universitys-12th-residential-college-302533728.html"
        }
      },
      {
        heading: "Our Facilities",
        /* DRAFT — was verbatim from the "About: Facilities" page, but that
           text put kitchens on the residential floors, which do not exist.
           The floor sentence now describes the flobbies instead; the commons
           kitchen is real and stays. */
        body: [
          "Chao's building holds every space a Dragon uses: quiet floors for studying, a commons built for bumping into people you like, and the kitchen that feeds both.",
          "Each floor pairs private rooms with its own lobby, a flobby, so you are never more than a few steps from a couch or someone to talk to.",
          "The ground floor commons is where the whole college collides: full kitchen, game tables, and lounge seating built for nights that run later than planned."
        ],
        source: null
      },
      {
        /* WRITTEN FOR THE SITE at Gabi's request, to the sense of "you are the
           history — we are brand new, so the traditions are yours to build".
           Reword freely. */
        heading: "History",
        body: [
          "Chao has no history yet. You are the history. The college is brand new, which means the stories and traditions that will define it are still waiting to be built, by the people here now."
        ],
        source: null
      }
    ],

    /* Quick-facts list. RICE NEWS / RICE MAGAZINE — see `links` below for the
       sources. NOTE: Rice Magazine says the building opened "Fall 2025" while
       Rice News reports the college opening in August 2026; confirm which is
       meant before publishing. */
    facts: [
      { term: "Official name", detail: "Ting Tsung and Wei Fong Chao College" },
      { term: "Opened",        detail: "August 2026" },
      { term: "Standing",      detail: "Rice University's twelfth residential college, and the first new one since McMurtry and Duncan opened in 2009" },
      { term: "Residents",     detail: "Nearly 300 on-campus beds; more than 400 undergraduates including off-campus members" },
      { term: "Known as",      detail: "Chaosens" },
      { term: "Magisters",     detail: "Luis Duno-Gottberg and Angela Duno" },
      { term: "Mascot",        detail: "The dragon" },
      { term: "Motto",         detail: "Una Domus, Multae Viae — \"one home, many paths\"" },
      { term: "Colors",        detail: "Pink, ivory and navy blue" },
      { term: "Architects",    detail: "Henning Larsen, with Kirksey as executive architect" },
      { term: "Building",      detail: "Two towers of 10 and 5 stories, an 11,000 sq ft central quad and a 3,000 sq ft rooftop terrace, targeting LEED Gold" }
    ],

    /* Further reading — Rice's own coverage of the college. */
    links: [
      { label: "Welcome 'Chaosens': Chao College opens its doors as Rice's 12th residential college",
        detail: "Rice News, 2026",
        path: "https://news.rice.edu/news/2026/welcome-chaosens-chao-college-opens-its-doors-rices-12th-residential-college" },
      { label: "Chao College Comes to Life",
        detail: "Rice Magazine, Winter 2026",
        path: "https://magazine.rice.edu/winter-2026/chao-college-comes-life" },
      { label: "Chao family gift supports, names Rice University's 12th residential college",
        detail: "Rice News, 2025",
        path: "https://news.rice.edu/news/2025/chao-family-gift-supports-names-rice-universitys-12th-residential-college" }
    ]
  },

  /* ======================================================================
     RESOURCES
     Each card links somewhere. `path` may be an internal path, an external
     URL, or null (renders as a card with no link).
     ================================================================== */
  resources: {
    /* WRITTEN FOR THE SITE, not supplied by the college — Gabi asked for these
       three strings (this intro, the Wellbeing card and the Funding Requests
       card) to be drafted. They are deliberately plain. Reword freely. */
    intro: "Everything at Chao you can book, request, or ask about, and who to talk to for each.",
    groups: [
      {
        id: "spaces",
        heading: "Spaces & Equipment",
        cards: [
          { title: "Book a Space",
            /* DRAFT. NOTE: "Requests get a response within two business days"
               came from the preliminary draft site, when booking was a form.
               Booking is now a shared spreadsheet you fill in yourself, so that
               sentence may no longer be true — worth trimming. */
            body: "Chao's shared spaces are yours. Go ahead and book one. Requests get a response within two business days.",
            path: "https://docs.google.com/spreadsheets/d/1DIsayLaIsKxKrMVQGrXRUi0AE_iwuW3pKbxvwdVFUg0/edit",
            cta: "Open the reservation sheet" },
          /* DRAFT. There are no kitchens on the residential floors — the only
             kitchen is in the commons — so this card no longer mentions one.
             NOTE: "floor reps" has no matching group in data/people.js, so the
             link goes to the Improvements Representatives, whose stated job is
             upgrading and maintaining shared spaces. Repoint if that is wrong. */
          { title: "Flobbies",
            body: "Each floor has its own lobby, a flobby: shared space a few steps from your room to study, hang out, or run into someone. If you have ideas or thoughts about yours, bring them to the Improvements Representatives.",
            path: "people/committees/#improvements-representatives", cta: "Meet the Improvements Reps" },
          { title: "The Commons",
            /* DRAFT */
            body: "The ground floor commons is where the whole college collides: full kitchen, game tables, and lounge seating built for nights that run later than planned.",
            path: null, cta: null },
          { title: "Laundry",
            body: "For questions or issues with the laundry room, reach out to Brad Mahung, Chao's Student Maintenance Representative.",
            path: "mailto:Chao.college.smr@gmail.com", cta: "Email the SMR" },
          /* WRITTEN FOR THE SITE at Gabi's request — a reminder to treat the
             kitchen well. Reword freely. */
          { title: "Kitchen",
            body: "The commons kitchen belongs to the whole college. Clean up after yourself, put things back where you found them, and leave it the way you would want to find it.",
            path: "people/committees/#kitchen-representatives", cta: "Meet the Kitchen Reps" },
          { title: "Dining",
            body: "Servery hours for the Rice serveries are published by Housing and Dining.",
            path: "https://rice.app.box.com/s/07zf31m146n5efe7aqxods15n1xg6dke",
            cta: "Servery hours" }
        ]
      },
      {
        id: "funding",
        heading: "Funding",
        cards: [
          { title: "Financial Inclusivity",
            /* DRAFT */
            body: "Chao's staff and student government keep the real cost of college life low, subsidizing tickets and keeping merch and formals affordable for everyone, not just whoever can swipe first. If money is ever the reason you are sitting something out, tell Chao's Coordinator or student government. Help is available and it stays between you and them.",
            path: null, cta: null },
          /* WRITTEN FOR THE SITE — see the note at the top of this section.
             STILL MISSING: the actual request process. If there is a form or a
             deadline, add it here as the card's `path` and `cta`. */
          { title: "Funding Requests",
            body: "Chao's funds exist to make student ideas happen. If you want to run an event, start a project, or try something that could become a tradition, bring it to the Treasurers — we want to hear it.",
            path: null, cta: null },
          { title: "Treasurers",
            /* CONTACT SHEET */
            body: "Chao's Treasurers are the highest financial officers of the Chabinet, overseeing all financial transactions at Chao College.",
            path: "mailto:chaotreasurers@gmail.com", cta: "Email the Treasurers" }
        ]
      },
      {
        id: "forms",
        heading: "Governance & Communication",
        cards: [
          { title: "Give Feedback",
            /* DRAFT */
            body: "Feedback goes straight to the Chao Cabinet and shapes real decisions on events, facilities, and policy. Say it with your name, or do not, we will still read it.",
            path: null, cta: "[PLACEHOLDER: link to the feedback form]" },
          { title: "Constitution & Bylaws", body: "[PLACEHOLDER: link to Chao's constitution and bylaws.]", path: null, cta: null },
          /* Form link supplied by Gabi; the wording here is written for the
             site. The link arrived wrapped in Rice's urldefense scanner and
             has been unwrapped to the plain forms.gle target. */
          { title: "Weekly Email",
            body: "The Secretaries send a college-wide email each week. To have your event included, submit it through the form.",
            path: "https://forms.gle/sdqcVMR9prTSYPVd9", cta: "Submit an event" }
        ]
      },
      {
        id: "support",
        heading: "Academic & Wellbeing Support",
        cards: [
          { title: "RHAs",
            /* DRAFT */
            body: "Rice Health Advisors, or RHAs, are students trained on a range of wellbeing topics. They offer peer guidance, health education, and basic health supplies to the Chao community.",
            path: "people/student-staff/", cta: "Meet the RHAs" },
          { title: "PAAs",
            /* RICE — oaa.rice.edu/advising-network/peer-academic-advisors */
            body: "Peer Academic Advisors (PAAs) are an integral part of the advising community at Rice, and have been nationally recognized by the National Academic Advising Association (NACADA).",
            path: "people/student-staff/", cta: "Meet the PAAs" },
          { title: "Divisional Advisors",
            /* RICE — oaa.rice.edu/divisional-advisors */
            body: "Divisional Advisors are faculty associates of a residential college who are selected and engaged by College Magisters and the OAA to provide academic advising to you prior to your declaring a major.",
            path: "https://oaa.rice.edu/divisional-advisors", cta: "Office of Academic Advising" },
          { title: "Diversity & Affinity",
            /* DRAFT */
            body: "The Culturals Representatives build an inclusive community by backing affinity groups, running cultural programming, and making sure every celebration on campus has a way in for Chao residents.",
            path: "people/committees/#culturals-representatives", cta: "Meet the Culturals Reps" },
          { title: "Wellbeing & Counseling",
            /* WRITTEN FOR THE SITE — see the note at the top of this section. */
            body: "Rice's Wellbeing and Counseling Center offers free, confidential support to every student. If you are not sure where to start, any of Chao's RHAs can point you in the right direction.",
            path: "https://wellbeing.rice.edu", cta: "Rice Wellbeing and Counseling Center" },
          { title: "Student Judicial Programs",
            body: "Student Judicial Programs handles alleged violations of Rice's Code of Student Conduct.",
            path: "https://sjp.rice.edu", cta: "Rice Student Judicial Programs" }
        ]
      }
    ]
  },

  /* ======================================================================
     O-WEEK
     ================================================================== */
  oweek: {
    year: "2027",
    /* `label` is what readers see; `start` and `end` are ISO so the <time>
       elements are machine-readable. Update all three together each year. */
    dates: {
      label: "Sunday, August 15 \u2013 Saturday, August 21, 2027",
      start: "2027-08-15",
      end:   "2027-08-21"
    },
    /* DRAFT */
    intro: "Your first week at Chao turns a hallway of strangers into a Dragon family, whether you are ready or not.",
    /* Group photo of the coordinators, named in the caption beneath it rather
       than given a card each — there is nothing to put on a card except the
       name the caption already carries. `alt` describes the scene for screen
       readers; the caption does the naming, so the two do not repeat. */
    coordinatorsPhoto: {
      image:   "oweek-coords.jpg",
      alt:     "Chao O-Week coordinators in front of an O-Week 26 chalkboard",
      focus:   "center 35%",
      caption: "From left: Abbie Wang, Samantha Mahung and Prasanna Bendalam"
    },
    sections: [
      { heading: "Your First Week At Chao",
        /* DRAFT, with one change: "floor mates" -> "peers", at Gabi's request. */
        body: [
          "O-Week pairs every new student with upperclass advisors and a small crew of peers, and gets you through registration, campus life, and Rice tradition before your first class even starts.",
          "By Friday you will know your way around campus, your O-Week group by name, and the people down the hall well enough to borrow their charger."
        ] },
      /* MUST BE WRITTEN BY THE COORDINATORS. This one is not a slot to fill
         with drafted copy: the coordinators are named directly above it on the
         page, so whatever sits here reads as theirs. Leave it empty until they
         write it. A drafted version was offered and rejected for exactly this
         reason. */
      { heading: "Letter to New Students",
        body: [ "[PLACEHOLDER: letter from the O-Week coordinators, in their own words]" ] },
      /* Replaces the separate Move-In, Housing and What to Bring sections —
         all three are sent by email rather than published here. Written for
         the site at Gabi's request; reword freely. */
      { heading: "Before You Arrive",
        body: [
          "Check your email frequently in the weeks before O-Week. Information about housing, what to bring, and move-in instructions will all be sent there."
        ] }
    ],

    /* Photographs from the college's O-Week archive. Filenames describe the
       scene; the `alt` strings were written from the photographs themselves,
       since none came with captions. Correct them freely. */
    gallery: [
      { image: "welcome-signs.jpg",       alt: "Students holding handmade welcome signs on move-in day" },
      { image: "move-in-procession.jpg",  alt: "Students walking up to the college carrying signs on move-in day" },
      { image: "move-in-crew.jpg",        alt: "The move-in crew waiting to welcome new students" },
      { image: "stadium.jpg",             alt: "Chao students filling a section of the stands in Chao shirts" },
      { image: "commons-cheer.jpg",       alt: "Students cheering at tables in the Chao commons" },
      { image: "theme-posters.jpg",       alt: "Chao students in front of hand-painted O-Week theme posters" },
      { image: "family-group-1.jpg",      alt: "An O-Week family group outside the college" },
      { image: "family-group-2.jpg",      alt: "An O-Week family group outside the college" },
      { image: "family-group-3.jpg",      alt: "An O-Week family group outside the college" }
    ],

    /* Rice's own O-Week pages, which cover the university-wide schedule. */
    links: [
      { label: "Rice O-Week",            path: "https://success.rice.edu/first-year-programs/o-week" },
      { label: "O-Week schedule",        path: "https://success.rice.edu/first-year-programs/o-week/o-week-schedule" },
      { label: "New student checklist",  path: "https://success.rice.edu/first-year-programs/o-week/new-student-checklist" },
      { label: "O-Week FAQs",            path: "https://success.rice.edu/first-year-programs/o-week/o-week-faqs" }
    ]
  },

  /* ======================================================================
     CALENDAR
     Paste the Google Calendar "Embed code" src between the quotes below and
     the placeholder panel is replaced by the live calendar automatically.
     ================================================================== */
  calendar: {
    /* DRAFT */
    intro: "From Beer Bike to 2am study breaks, here is everything on Chao's calendar. Scroll below for Chao's upcoming events, socials, and deadlines, kept current by student government all year.",
    /* src pulled from the Google Calendar embed code. The renderer builds its
       own responsive <iframe> around this, so paste only the URL here. */
    embedSrc: "https://calendar.google.com/calendar/embed?src=c_30ab1fc200413c925d8590b1f3c5f6db0bffddc931d3b081adcd7629453887c8%40group.calendar.google.com&ctz=America%2FChicago",
    links: [
      { label: "Rice Academic Calendar", path: "https://registrar.rice.edu/calendars" },
      { label: "Rice O-Week",            path: "https://success.rice.edu/first-year-programs/o-week" }
    ]
  }
};
