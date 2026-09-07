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
    intro: "[PLACEHOLDER: one-paragraph introduction to Chao College.]",

    sections: [
      {
        heading: "About the Chaos",
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
        /* DRAFT — verbatim from the "About: Facilities" page. */
        body: [
          "Chao's building holds every space a Dragon uses: quiet floors for studying, kitchens for cooking, and a commons built for bumping into people you like.",
          "Each floor pairs private rooms with a shared kitchen and lounge, so you are never more than a few steps from a stove, a couch, or someone to talk to.",
          "The ground floor commons is where the whole college collides: full kitchen, game tables, and lounge seating built for nights that run later than planned."
        ],
        source: null
      },
      {
        /* The draft's History and Namesake pages are still lorem ipsum, so
           there is nothing to lift. These stay open. */
        heading: "Our History & Namesake",
        body: [ "[PLACEHOLDER: the college's founding and the story of its namesake.]" ],
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
    intro: "[PLACEHOLDER: one-sentence introduction to the resources page.]",
    groups: [
      {
        id: "spaces",
        heading: "Spaces & Equipment",
        cards: [
          { title: "Book a Space",
            /* DRAFT */
            body: "Chao's shared spaces are yours. Go ahead and book one. Requests get a response within two business days.",
            path: null, cta: "[PLACEHOLDER: link to the reservation form]" },
          { title: "Floor Kitchens & Lounges",
            /* DRAFT */
            body: "Each floor pairs private rooms with a shared kitchen and lounge, so you are never more than a few steps from a stove, a couch, or someone to talk to.",
            path: null, cta: null },
          { title: "The Commons",
            /* DRAFT */
            body: "The ground floor commons is where the whole college collides: full kitchen, game tables, and lounge seating built for nights that run later than planned.",
            path: null, cta: null },
          { title: "Laundry",       body: "[PLACEHOLDER: laundry information.]", path: null, cta: null },
          { title: "Item Checkout", body: "[PLACEHOLDER: what can be checked out and from whom.]", path: null, cta: null },
          { title: "Housing",       body: "[PLACEHOLDER: a line on room assignments and the housing draw.]",
            path: "https://housing.rice.edu/undergraduate-housing", cta: "Rice Housing" },
          { title: "Dining",        body: "[PLACEHOLDER: a line on servery hours and meal plans.]",
            path: "https://dining.rice.edu/residential-dining", cta: "Rice Dining" }
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
          { title: "Funding Requests", body: "[PLACEHOLDER: how to request funding from the college.]", path: null, cta: null },
          { title: "Treasurers",
            /* CONTACT SHEET */
            body: "Chao's Treasurers are the highest financial officers of the Chabinet, overseeing all financial transactions at Chao College.",
            path: "mailto:chaotreasurers@gmail.com", cta: "Email the Treasurers" }
        ]
      },
      {
        id: "forms",
        heading: "Governance & Feedback",
        cards: [
          { title: "Give Feedback",
            /* DRAFT */
            body: "Feedback goes straight to the Chao Cabinet and shapes real decisions on events, facilities, and policy. Say it with your name, or do not, we will still read it.",
            path: null, cta: "[PLACEHOLDER: link to the feedback form]" },
          { title: "Constitution & Bylaws", body: "[PLACEHOLDER: link to Chao's constitution and bylaws.]", path: null, cta: null },
          { title: "Contact the Chabinet",  body: "[PLACEHOLDER: how to reach student government.]", path: "people/government/", cta: "See Student Government" }
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
            path: "people/committees/", cta: "Meet the Culturals Reps" },
          { title: "Wellbeing & Counseling",
            body: "[PLACEHOLDER: a line pointing students to campus wellbeing support.]",
            path: "https://wellbeing.rice.edu", cta: "Rice Wellbeing and Counseling Center" },
          { title: "Student Judicial Programs",
            body: "[PLACEHOLDER: a line on when to contact SJP.]",
            path: "https://sjp.rice.edu", cta: "Rice Student Judicial Programs" }
        ]
      }
    ]
  },

  /* ======================================================================
     O-WEEK
     ================================================================== */
  oweek: {
    year: "[PLACEHOLDER: year]",
    /* DRAFT */
    intro: "Your first week at Chao turns a hallway of strangers into a Dragon family, whether you are ready or not.",
    /* Group photo of the coordinators, from the college photo folder.
       Three people are in it; their names are still needed below. */
    coordinatorsPhoto: {
      image: "oweek-coords.jpg",
      alt:   "Chao O-Week coordinators in front of an O-Week 26 chalkboard",
      focus: "center 35%"
    },
    coordinators: [
      { name: "[PLACEHOLDER: name]", role: "O-Week Coordinator", pronouns: null, email: null, photo: null, photoDrive: null },
      { name: "[PLACEHOLDER: name]", role: "O-Week Coordinator", pronouns: null, email: null, photo: null, photoDrive: null },
      { name: "[PLACEHOLDER: name]", role: "O-Week Coordinator", pronouns: null, email: null, photo: null, photoDrive: null }
    ],
    sections: [
      { heading: "Your First Week At Chao",
        /* DRAFT */
        body: [
          "O-Week pairs every new student with upperclass advisors and a small crew of floor mates, and gets you through registration, campus life, and Rice tradition before your first class even starts.",
          "By Friday you will know your way around campus, your O-Week group by name, and the people down the hall well enough to borrow their charger."
        ] },
      { heading: "Letter to New Students", body: [ "[PLACEHOLDER: letter text.]" ] },
      { heading: "Move-In",                body: [ "[PLACEHOLDER: move-in date, time, and logistics.]" ] },
      { heading: "Housing",                body: [ "[PLACEHOLDER: housing and room assignment information.]" ] },
      { heading: "What to Bring",          body: [ "[PLACEHOLDER: packing guidance.]" ] }
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
