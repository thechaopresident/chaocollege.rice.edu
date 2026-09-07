/* ============================================================================
   CHAO COLLEGE — PEOPLE
   ----------------------------------------------------------------------------
   Source: "Chao College Contact Sheet" (Google Drive, Chao Secretaries).
   All names, roles, pronouns, emails, bios and position descriptions below are
   reproduced VERBATIM from that sheet. Nothing here is paraphrased or written
   for the college. Where the sheet was blank, the value is null or a
   "[PLACEHOLDER: ...]" string — never invented copy.

   PHOTOS
   ------
   `photoDrive` is the Drive link from the sheet. The site does NOT hotlink
   Google Drive (those links break and rate-limit). To publish a photo:
     1. Download it from the Drive link.
     2. Save it to assets/img/people/ as e.g. luis-duno-gottberg.jpg
        (square crop, 600x600 or larger).
     3. Set `photo: "luis-duno-gottberg.jpg"` on that entry.
   Until then the entry shows a brand-colored placeholder tile.

   `focus` is an optional CSS object-position for the square crop. Portraits
   shot full-body need the crop pulled up so heads are not cut off — e.g.
   "center 20%". Omit it for a centered crop.

   `optOut: true` means that person declined a photo on the sheet. Do not add
   one for them.

   GROUPED ENTRIES
   ---------------
   Some rows on the sheet share one bio and one photo between two people
   (couples serving together). Those are modeled as a single entry with a
   `people: [...]` array so the bio is not duplicated.

   `group` is optional and only affects the tab an entry appears under on the
   Team page. Without it the entry is grouped by its `role`, which would split
   "Resident Associate" and "Resident Associates" into two tabs.
   ========================================================================= */

window.CHAO_PEOPLE = {

  /* ======================================================================
     LEADERSHIP — Magisters, College Coordinator, Resident Associates
     ================================================================== */
  leadership: [
    {
      role: "Magisters",
      people: [
        { name: "Luis Duno-Gottberg", email: "ld4@rice.edu",  pronouns: "he/him" },
        { name: "Angela Duno",        email: "amg13@rice.edu", pronouns: "she/her" }
      ],
      bio: "Luis and Angela serve as the founding Magisters of Chao, a role they hold with gratitude and joy. Angela, a Houston native, delights in sharing the city's hidden gems, so be ready for her Halloween party and its many surprises. Luis, the Lee Hage Jamail Professor of Latin American Studies and a scholar of Caribbean and cultural studies, explores Houston through his camera and has devoted much of his career to mentoring students. An avid writer on culture and politics, he publishes across Latin America and Europe. They love opening our home to students for dinners and conversation, coffee and pastries, film nights, music, and celebration. They are honored to help shape the traditions that will define Chao for generations to come.",
      photo: "luis-angela-duno.jpg",
      focus: "center 25%",
      photoDrive: "https://drive.google.com/file/d/1hPibuce8lg2jzHSLjEI-Qx-aKxjkVcat/view?usp=sharing"
    },
    {
      role: "College Coordinator",
      people: [
        { name: "Marcela Davis", email: "mcd10@rice.edu", pronouns: "she/her" }
      ],
      bio: "Hello! My name is Marcela Davis, and I am Chao's College Coordinator. I was born in Lima, Peru, and grew up in Houston. I am a Rice alum (Wiess '99) and am thrilled to be back inside the hedges. I graduated from Rice with a B.A. in Economics and Managerial Studies. After graduation, I worked as a financial advisor and then as a management consultant. I am married to a Rice alum, Rich (Will Rice '97), and together we have four children—Katie, Richie, John and James. We also have two furry children, Sweetie Pie and Honey Bear, who may occasionally come to work with me. After many years as a stay-at-home mom, I am back on campus helping to guide, cheer and support one of my favorite groups of people—college students.\n\nI am very excited to be the founding Coordinator for the newest college on campus. My office is right by the entrance from the parking lot, near the laundry room and mailroom, so I hope you'll stop by often to let me know how you are doing. My lounge area is stocked with yummy snacks, games, puzzles, and more. If you need to recharge your phone, I've got you covered! My office hours are typically Monday through Friday from 9-5. Please don't hesitate to stop by with anything that's concerning, intriguing, or exciting you. I am here to support you as we build Chao together. I work alongside the student committees to help the college run smoothly. If you ever misplace your room key, head to my office to check out a spare. Whenever you swing by the mailroom, feel free to say hello—I am always happy to see you and hear about your day.\n\nDuring my spare time, I love to read (historical fiction is my favorite), knit (blankets are my specialty), swim (I compete in a yearly 100-mile swim challenge), go on long walks, and binge-watch TV shows—especially legal dramas, late-night talk shows, and sitcoms. I also love making Peruvian food and hope to host a few cooking study breaks during the year!\n\nMost of all, I love getting to know students and watching them grow during their time at Rice. I can't wait to meet each of you and help make Chao College feel like home. Welcome to the Dragon family!",
      photo: "marcela-davis.jpg",
      focus: "center center",
      photoDrive: "https://drive.google.com/file/d/1eNfbgBiC6OKBmBbvIRu6wqO5lSEpuROd/view?usp=drive_link"
    },
    {
      role: "Resident Associate",
      group: "Resident Associates",
      people: [
        { name: "Tamara Jones", email: "tamarajones@rice.edu", pronouns: "she/her" }
      ],
      bio: "My name is Tamara (pronounced with emphasis on the Tam), and I am the founding Resident Associate and co-chaired the Founding Committee for Chao College. Previously, I served as RA at McMurtry for eight years and truly treasure the friendships and connections that will last a lifetime. My 3 daughters live on campus with me.\n\nMy job title is Student Services Administrator for the Dean of Undergraduates here at Rice which entails helping students navigate their way through college life – some paths are more arduous than others and that's where I can step in and help.\n\nI was born and raised here in Houston. I have a Master's degree in Sociology and love learning about human variation in every form – cultural, familial, personality, life choices, etc. My hobbies include curating music playlists, birdwatching, nature photography, color consulting, consuming pastries, games of all sorts, reading, and exploring new cities.",
      photo: "tamara-jones.jpg",
      focus: "center center",
      photoDrive: "https://drive.google.com/file/d/1i6omlIRowN6CWqq__O-dK8-MT7f3fuWd/view?usp=drive_link"
    },
    {
      role: "Resident Associates",
      group: "Resident Associates",
      people: [
        { name: "Judith Brunton", email: "jb232@rice.edu", pronouns: "she/her" },
        { name: "Sam Robinson",   email: "samuel.joseph.robinson@gmail.com", pronouns: "he/him" }
      ],
      bio: "We are the second floor RAs Judith (she/her) and Sam (he/him) and we live at Chao with our sons Earnest and Shepherd. Judith is an Assistant Professor in the Religion Department and Sam is an audio engineer and current stay-at-home dad.\n\nWe are from Canada! Before Houston we spent 10 years in Toronto (and two years in Cambridge, MA) but Judith is from Calgary, Alberta (mountains and cowboys) and Sam is from Guelph, Ontario (hippies and farms). Canadian culture still lives strong in us so we say sorry too much and don't yet understand fahrenheit.\n\nWe have lots of interests we share as a family. Music is a big one: Ernie is currently learning the violin, Shep likes to bang things, and we all love live music and the symphony. Judith and Sam met while djing indie rock at their campus radio station as undergrads. We are all big readers and like all kinds of books, but Sam has a general interest in non-fiction and history. Judith gets to read for a living and is joyful to read anything and everything. Sam and Judith are also big into hiking, being outdoors, and generally exploring. Ernie and Shep are not yet convinced about these activities. Everyone in the family loves visiting art galleries and museums.\n\nWe both grew up around universities and love campus culture. We can frequently be seen at all kinds of Rice events: cool talks, music, sports, art etc. As RAs we are always working to support students to take advantage of the rare opportunities being at Rice allows for personal growth and exploration.\n\nOur family is very proud and joyful to be part of the Chao community. Chao students can find us in our apartment and generally hanging out.",
      photo: "judith-brunton-sam-robinson.jpg",
      focus: "center center",
      photoDrive: "https://drive.google.com/file/d/1YOS5P5tkp9pu_eiXjwFFjjfTNHl6Bfiq/view?usp=drive_link"
    },
    {
      role: "Resident Associates",
      group: "Resident Associates",
      people: [
        { name: "Derek Bell",    email: "db157@rice.edu",       pronouns: "he/him" },
        { name: "Brittany Bell", email: "britt.c.bell@gmail.com", pronouns: "she/her" }
      ],
      bio: "Derek and Brittany Bell bring a blend of Houston heart and St. Louis soul to the Chao community. Derek, a native Houstonian, and Brittany, originally from St. Louis, Missouri, first crossed paths while Derek was working at WashU. Today, their world revolves around their son, Daniel Langston Bell, and their famously chill Shih Tzu, Dennison.\n\nProfessionally, Derek serves in the Office of Ethics, Compliance, and Enterprise Risk, while Brittany works in Health Information Management at Harris Health. When they aren't exploring the city's newest restaurants or catching up with friends and family, they are dedicated to their roles on the Chao Core Team. Derek and Brittany are honored to be part of the \"Founding Era.\" They are committed to fostering a vibrant student community and take great pride in helping build the traditions and foundation that will define Chao College for generations.",
      photo: "derek-brittany-bell.jpg",
      focus: "center center",
      photoDrive: "https://drive.google.com/file/d/1-wE4ILeHgXXrhdsNlOQKGS2Tk-mN5yqK/view?usp=drive_link"
    }
  ],

  /* ======================================================================
     STUDENT GOVERNMENT — the Chabinet
     ================================================================== */
  government: [
    { name: "Elijah White", role: "President", pronouns: "he/him", email: "thechaopresident@gmail.com",
      description: "The President of Chao College is the highest executive officer of the Chabinet (Chao Cabinet).",
      photo: null, photoDrive: "https://drive.google.com/file/d/1UdrMI3v0yD_-w8DcDXGAVaStPfoPwk4r/view?usp=drive_link" },

    { name: "Olivia Seo", role: "Chief Justice", pronouns: "she/her", email: "thechaocj@gmail.com",
      description: "The Chief Justice (CJ) of Chao College is the primary administrator of judicial policies set by Chao and the university, and shall oversee the safety of Chao's student body. They are Chao College's official liaison between Chao's student body and the Rice University Police Department (RUPD), Student Judicial Programs (SJP), the Student Wellbeing Office, and other health and safety leaders on campus.",
      photo: null, photoDrive: "https://drive.google.com/file/d/1abVCbekd9MTWV9Hh8pWI-B4i94zt8wB8/view?usp=sharing" },

    { name: "Barbare Tetvadze", role: "Internal Vice President (IVP)", pronouns: "she/her", email: "thechaoivp@gmail.com",
      description: "Chao's Internal Vice President (IVP) is the second-highest executive member of the Chabinet regarding the physical space of Chao College, overseeing all of Chao's facilities, and maintaining Chao's equipment.",
      photo: null, photoDrive: "https://drive.google.com/file/d/15Tk9rhtGCA4ya_BFF3jypDZpVBZP1ynT/view?usp=drive_link" },

    { name: "Sammi Frey", role: "External Vice President (EVP)", pronouns: "she/her", email: "chaoevp@gmail.com",
      description: "Chao's External Vice President (EVP) is the second-highest executive member of the Chabinet regarding relationships external to Chao College, facilitating and maintaining cross-college relations and campus-wide interfacing.",
      photo: null, photoDrive: "https://drive.google.com/file/d/1NeuAmjBixxlNcwr6yQFZLeo0-iUjLimZ/view?usp=drive_link" },

    { name: "Matthias Canon", role: "Community Vice President (CVP)", pronouns: "he/him", email: "thechaocvp@gmail.com",
      description: "Chao's Community Vice President (CVP) is the second-highest executive member of the Chabinet regarding the student body of Chao College, facilitating and maintaining Chao's social and cultural wellbeing and traditions.",
      photo: null, photoDrive: null },

    { name: "Ian Rodriguez", role: "Senior Treasurer", pronouns: "he/him", email: "chaotreasurers@gmail.com",
      description: "Chao's Treasurers are the highest financial officers of the Chabinet, overseeing all financial transactions at Chao College.",
      photo: null, photoDrive: "https://drive.google.com/file/d/1BkX62ydOcfiIsSiFgLltZ89nVMOOrpYp/view?usp=sharing" },

    { name: "Rex Rutchik", role: "Junior Treasurer", pronouns: "he/him", email: "chaotreasurers@gmail.com",
      description: "Chao's Treasurers are the highest financial officers of the Chabinet, overseeing all financial transactions at Chao College.",
      photo: null, photoDrive: "https://drive.google.com/file/d/1mLDI6jK2mAe0iIPTLTmCeIElKmEA0eJL/view?usp=drive_link" },

    { name: "Carolina Balboa", role: "Secretary", pronouns: "she/her", email: "chaosecretaries@gmail.com",
      description: "Chao's Secretaries manage all of Chao College's communication systems, oversee all of Chao's historical documentation and maintain all of Chao's record-keeping.",
      photo: null, photoDrive: "https://drive.google.com/file/d/1vg8_e5Sm8Tl75_GK01mTYbRETMJWsWBh/view?usp=sharing" },

    { name: "Raymond Xu", role: "Secretary", pronouns: "he/him", email: "chaosecretaries@gmail.com",
      description: "Chao's Secretaries manage all of Chao College's communication systems, oversee all of Chao's historical documentation and maintain all of Chao's record-keeping.",
      photo: null, photoDrive: "https://drive.google.com/file/d/1z20SoNAiRoP_G2EvN_2yqVws4lIQr-Wl/view?usp=sharing" },

    { name: "Jake Pessin", role: "Senator", pronouns: "he/him", email: "jp231@rice.edu",
      description: "Chao's Rice Student Association (RSA) Senator is the primary liaison between Chao's student body and the Student Association, alongside Chao's President. The Senator represents the interests of Chao's student body to the Rice Student Association.",
      photo: null, photoDrive: "https://drive.google.com/file/d/1ZVyCrcDrdmTvkuszlN_kP7SKOug918Cj/view?usp=drive_link" },

    { name: "Zach Weinbrum", role: "Parlimentarian", pronouns: "he/him", email: "chaoparlimentarian@gmail.com",
      description: "Chao's parliamentarian oversees all election-related processes and communication for executive government positions, attends all government-related meetings, and is the go-to student reference for Constitution and Bylaws accountability, interpretation and education.",
      photo: null, photoDrive: null }
  ],

  /* ======================================================================
     COURT & CLASS REPRESENTATIVES
     "Coming Soon..." rows are kept so the vacancy is visible on the page.
     ================================================================== */
  court: [
    { name: "Amelia Davis", role: "University Court Representative", pronouns: "she/her", email: "awd3@rice.edu",
      photo: null, photoDrive: "https://drive.google.com/file/d/1hRaxyA6TgiyqKUzpmHq389rqp0u9EX2-/view?usp=sharing" },
    { name: "Coming Soon...", role: "Freshman Rep", pronouns: null, email: null, photo: null, photoDrive: null },
    { name: "Prasanna Bendalam", role: "Sophmore Rep", pronouns: "he/him", email: "pa67@rice.edu",
      photo: null, photoDrive: "https://drive.google.com/file/d/16NHr-P1wilsMSGahVfpsB_G2fYCMLeGJ/view?usp=sharing" },
    { name: "Manny Tejada", role: "Sophmore Rep", pronouns: "he/him", email: "mt181@rice.edu",
      photo: null, photoDrive: null, optOut: true },
    { name: "Coming Soon...", role: "Junior Rep", pronouns: null, email: null, photo: null, photoDrive: null },
    { name: "Coming Soon...", role: "Senior Rep", pronouns: null, email: null, photo: null, photoDrive: null }
  ],

  /* ======================================================================
     COMMITTEES & REPRESENTATIVES
     Descriptions are verbatim from the sheet, one per committee.
     NOTE: spellings below ("Improvments", "Matinence", "Sophmore",
     "Parlimentarian") are reproduced exactly as they appear on the sheet.
     Correct them here if the college wants them corrected.
     ================================================================== */
  committees: [
    { name: "Arts",
      description: "This committee defines Chao's visual and creative identity. Every space should feel intentional, dynamic, and well-maintained.",
      members: [
        { name: "Joy Onyeka",    pronouns: null,      email: "jao12@rice.edu", photo: null, photoDrive: null },
        { name: "Susana Cuadra", pronouns: "she/her", email: "sfc3@rice.edu",  photo: null, photoDrive: null, optOut: true }
      ]},

    { name: "Associates & Alumni",
      description: "This committee ensures associates feel meaningfully connected to Chao and serve as mentors to students. The goal is to build a strong, engaged network that consistently interacts with and supports the college community.",
      members: [
        { name: "Abbie Wang", pronouns: "she/her", email: "aw156@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1LQs1wHVO4dlvhaxGMq4Z6daHBhog9y1X/view?usp=sharing" },
        { name: "Ruby Gao",   pronouns: "she/her", email: "yg107@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/17NgaD_syd6Q9rWrgW7w_i8bQ7lWmSfpy/view?usp=drive_link" }
      ]},

    { name: "Beer Bike Coordinators",
      description: "The Beer Bike Coordinators (BBCs) work for months to deliver the best possible Beer Bike Week and shape what Chao's Beer Bike tradition will look like long-term. They collaborate with Bike and Chug Captains to build a strong race-day team and create a week that people are excited about.",
      members: [
        { name: "Vivian Mitchell",  pronouns: "she/her", email: "vm51@rice.edu", photo: null, photoDrive: null },
        { name: "Kristine Wong",    pronouns: "she/her", email: "kw81@rice.edu", photo: null, photoDrive: null },
        { name: "Crystal Vatierra", pronouns: null,      email: "cv50@rice.edu", photo: null, photoDrive: null },
        { name: "Jerry Fan",        pronouns: "he/him",  email: "jf160@rice.edu", photo: null, photoDrive: null }
      ]},

    { name: "External Socials",
      description: "This committee builds Chao's outward-facing social presence by connecting with other colleges and campus groups. The focus is on visibility, collaboration, and high-energy events.",
      members: [
        { name: "John Sneizek", pronouns: "he/him", email: "js512@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1YuWYQI4NleNA0dIGU3-q_Yq7a-XngN9J/view?usp=drive_link" },
        { name: "Manny Tejada", pronouns: "he/him", email: "mt181@rice.edu", photo: null, photoDrive: null, optOut: true }
      ]},

    { name: "Internal Socials",
      description: "This committee develops Chao's internal culture, creating consistent, high-attendance events that build community and make Chao an engaging place to live.",
      members: [
        { name: "Carson Walker", pronouns: "he/him",  email: "cw168@rice.edu", photo: null, photoDrive: null },
        { name: "Njwi Achoh",    pronouns: "she/her", email: "nba5@rice.edu",  photo: null, photoDrive: "https://drive.google.com/file/d/1jS3SoioE92DQiAJIFzaAWbTi2vLDtp1e/view?usp=drivesdk" }
      ]},

    { name: "Jacks",
      description: "This committee defines Chao's reputation through bold, creative, and memorable jacks. The goal is to set a new standard for originality and execution.",
      members: [
        { name: "Grace Doolittle", pronouns: null,     email: "ged1@rice.edu", photo: null, photoDrive: null },
        { name: "John Tucker",     pronouns: "he/him", email: "jrt15@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/13jT9AWbwLVfFCpHxGAC5__3sfdgT63M0/view?usp=drivesdk" }
      ]},

    { name: "Merch",
      description: "This committee is responsible for designing and distributing Chao merchandise, ensuring strong, recognizable college branding and high-quality offerings throughout the year.",
      members: [
        { name: "Joy Kim",       pronouns: "she/her", email: "jk127@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1p5S_C3rbksAhXQspVosvwOndnd6pPNMr/view?usp=sharing" },
        { name: "Katherine Xie", pronouns: "she/her", email: "kx18@rice.edu",  photo: null, photoDrive: null, optOut: true }
      ]},

    { name: "Service",
      description: "This committee builds Chao's identity as a service-oriented college both on and off campus. They create opportunities for consistent engagement and establish long-term service traditions.",
      members: [
        { name: "Aidan Abney",     pronouns: "he/him", email: "aa518@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1G8CSBgL1kDGP8PUoGy2mIm2iqirV0aVv/view?usp=drivesdk" },
        { name: "Aftab Mohammad",  pronouns: "He/him", email: "am562@rice.edu", photo: null, photoDrive: null }
      ]},

    { name: "Sports",
      description: "This committee organizes and supports Chao's athletic presence across intramural and varsity engagement, helping build both competitiveness and community.",
      members: [
        { name: "Saylor Robinson",   pronouns: "she/they", email: "sr206@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1-Hp-UxYT1tsds4yeWlW49I3H3PGFNG0D/view?usp=sharing" },
        { name: "Qais Altarabishi",  pronouns: "he/him",   email: "qa7@rice.edu",   photo: null, photoDrive: "https://drive.google.com/file/d/1ys1XBR_I_yA3KqEFmJuYEjEwchwmWIIW/view?usp=sharing" }
      ]},

    { name: "Culturals Representatives",
      description: "The cultural representatives foster a culturally vibrant and inclusive community by supporting affinity groups, promoting diverse programming, and increasing access to cultural events across campus.",
      members: [
        { name: "Asiyah Bray",       pronouns: "She/her", email: "akb12@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1p6o9CnxlDeelwSbPC1KPkDmqSyafzz3T/view?usp=drivesdk" },
        { name: "Eriyana Woolfolk",  pronouns: "she/her", email: "ew73@rice.edu",  photo: null, photoDrive: "https://drive.google.com/file/d/1X_wRmuS3052o6DZQsGFhpj9WCC_6bHRb/view?usp=drivesdk" }
      ]},

    { name: "Improvments Representative",
      description: "The improvement representative ensures all shared spaces are functional, stocked, and continuously improving.",
      members: [
        { name: "Gabi Brent", pronouns: "he/him", email: "gb83@rice.edu", photo: null, photoDrive: null }
      ]},

    { name: "Kitchen Representatives",
      description: "The kitchen representatives create a fully functional, accessible kitchen where anyone can use the space easily",
      members: [
        { name: "Addmrya Robles", pronouns: "She/her", email: "ar305@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1ZRQ3BQLnyRkKUJubrkMNTbXejJY6_IbS/view?usp=drivesdk" },
        { name: "Zaira Moreno",   pronouns: "she/her", email: "zm31@rice.edu",  photo: null, photoDrive: null, optOut: true }
      ]},

    { name: "Laundry Representative",
      description: "The laundry room representative a clean, clutter-free laundry space with clear systems and accountability.",
      members: [
        { name: "[PLACEHOLDER: name]", pronouns: null, email: null, photo: null, photoDrive: null, optOut: true }
      ]},

    { name: "Student Matinence Representative",
      description: "[PLACEHOLDER: position description]",
      members: [
        { name: "Bradford Mahung", pronouns: "he/him", email: "Chao.college.smr@gmail.com", photo: null, photoDrive: null }
      ]}
  ],

  /* ======================================================================
     STUDENT STAFF — RHAs, AJs, PAAs
     ================================================================== */
  rhas: [
    { name: "Ian Rodriguez", head: true,  pronouns: "he/him",  email: "ir33@rice.edu" },
    { name: "Amy Cheng",     head: false, pronouns: null,      email: "ac303@rice.edu" },
    { name: "Rebecca Tang",  head: false, pronouns: "She/her", email: "Rt66@rice.edu" },
    { name: "Susana Cuadra", head: false, pronouns: "she/her", email: "sfc3@rice.edu" }
  ],

  /* "Coming Soon..." entries are unfilled positions awaiting a new student. */
  ajs: [
    { name: "Eriyana Woolfolk",         floor: "2nd Floor",  pronouns: "She/her", email: "ew73@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1X_wRmuS3052o6DZQsGFhpj9WCC_6bHRb/view?usp=drivesdk" },
    { name: "Olivia Seo",               floor: "2nd Floor",  pronouns: "she/her", email: null,            photo: null, photoDrive: "https://drive.google.com/file/d/1abVCbekd9MTWV9Hh8pWI-B4i94zt8wB8/view?usp=sharing" },
    { name: "John Sneizek",             floor: "3rd Floor",  pronouns: "he/him",  email: "js512@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1YuWYQI4NleNA0dIGU3-q_Yq7a-XngN9J/view?usp=drive_link" },
    { name: "Coming Soon...",           floor: "3rd Floor",  pronouns: null,      email: null,            photo: null, photoDrive: null },
    { name: "Sofia Raistakka",          floor: "4th Floor",  pronouns: null,      email: "sr227@rice.edu", photo: null, photoDrive: null },
    { name: "Brett Leben",              floor: "4th Floor",  pronouns: "he/him",  email: "bl115@rice.edu", photo: null, photoDrive: null },
    { name: "Tyler Neilson",            floor: "5th Floor",  pronouns: null,      email: "tn75@rice.edu",  photo: null, photoDrive: null },
    { name: "Coming Soon...",           floor: "5th Floor",  pronouns: null,      email: null,            photo: null, photoDrive: null },
    { name: "Julian Villamar-Robbins",  floor: "6th Floor",  pronouns: "He/him",  email: "jv70@rice.edu",  photo: null, photoDrive: "https://drive.google.com/file/d/1MBTUquiDUjVF4k3vwVZ88RwU-3kPYUmw/view?usp=drivesdk" },
    { name: "Coming Soon...",           floor: "7th Floor",  pronouns: null,      email: null,            photo: null, photoDrive: null },
    { name: "Jisoo Yoon",               floor: "8th Floor",  pronouns: "She/her", email: "jy182@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1p6emb5bkK7Tpb1jT44xTnWvxjUaLIdqf/view?usp=drivesdk" },
    { name: "Raymond Xu",               floor: "9th Floor",  pronouns: "he/him",  email: "rx20@rice.edu",  photo: null, photoDrive: null },
    { name: "Prasanna Bendalam",        floor: "10th Floor", pronouns: "he/him",  email: "pb67@rice.edu",  photo: null, photoDrive: "https://drive.google.com/file/d/16NHr-P1wilsMSGahVfpsB_G2fYCMLeGJ/view?usp=sharing" }
  ],

  paas: [
    { name: "Ashley Wang",        head: true,  pronouns: "She/her",   email: "aw151@rice.edu", photo: null, photoDrive: null },
    { name: "Carolina Balboa",    head: false, pronouns: "she/her",   email: "cb153@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1vg8_e5Sm8Tl75_GK01mTYbRETMJWsWBh/view?usp=sharing" },
    { name: "Graham Bixby",       head: true,  pronouns: "they/them", email: "db80@rice.edu",  photo: null, photoDrive: "https://drive.google.com/file/d/12fmDURJwUVikLtDcRlOjsObQf-I0aS69/view?usp=drive_link" },
    { name: "Jimin Han",          head: false, pronouns: "he/him",    email: "jh332@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/1LPePH8Fk8G-DhjZGPwUoEh-__xA6GYF_/view?usp=drive_link" },
    { name: "Jehad Mahmoud",      head: true,  pronouns: "he/him",    email: "jm233@rice.edu", photo: null, photoDrive: "https://drive.google.com/file/d/17KXMDlnlRI42t5D9r28wnMvXI0y8ZZnA/view?usp=drivesdk" },
    { name: "Mariam Elsharkawy",  head: false, pronouns: "she/her",   email: "me57@rice.edu",  photo: null, photoDrive: "https://drive.google.com/file/d/1Rw8XZ2WgDxtA_krQoSZ7BiWY9mZ52Lib/view?usp=sharing" },
    { name: "Prasanna Bendalam",  head: false, pronouns: "he/him",    email: "pb67@rice.edu",  photo: null, photoDrive: "https://drive.google.com/file/d/16NHr-P1wilsMSGahVfpsB_G2fYCMLeGJ/view?usp=sharing" },
    { name: "Qais Altarabishi",   head: false, pronouns: "he/him",    email: "qa7@rice.edu",   photo: null, photoDrive: "https://drive.google.com/file/d/1ys1XBR_I_yA3KqEFmJuYEjEwchwmWIIW/view?usp=sharing" },
    { name: "Grace Zhang",        head: false, pronouns: "she/her",   email: "gz25@rice.edu",  photo: null, photoDrive: null, optOut: true }
  ],

  /* ======================================================================
     ASSOCIATES
     `da` marks a Divisional Advisor designation from the sheet.
     ================================================================== */
  associates: {
    faculty: [
      { name: "Cymene Howe",         detail: "Anthropology" },
      { name: "Dominic Boyer",       detail: "Anthropology", da: "SOSC DA" },
      { name: "Jessica Butts",       detail: "Bioengineering" },
      { name: "Jorge Vidal",         detail: "Business", da: "BUSI DA" },
      { name: "Jorge Loyo",          detail: "Civil and Environmental Engineering", da: "ENGI DA" },
      { name: "Melodie French",      detail: "Earth, Environmental and Planetary Sciences" },
      { name: "Shihan Shen",         detail: "Economics", da: "SOSC DA" },
      { name: "Jose Moreto",         detail: "Electrical and Computer Engineering", da: "ENGI DA" },
      { name: "Cassie Diep",         detail: "Kinesiology", da: "NSCI DA" },
      { name: "Nelly-Noury-Ossia",   detail: "Modern and Classical Languages, Literatures and Cultures" },
      { name: "Paula Park",          detail: "Modern and Classical Languages, Literatures and Cultures", da: "HUMA DA" },
      { name: "Teresa Bruno-Nino",   detail: "Philosophy" },
      { name: "Melia Bonomo",        detail: "Physics and Astronomy", da: "NSCI DA" },
      { name: "Kim Orsten Hooge",    detail: "Psychological Sciences" },
      { name: "Carrie Potter",       detail: "Sport Management" },
      { name: "Lorenzo Luzi",        detail: "Statistics" },
      { name: "Sourav Chatterjee",   detail: "Transnational Asian Studies" },
      { name: "Sidney X. Lu",        detail: "Transnational Asian Studies" },
      { name: "Eun Young Oh",        detail: "Transnational Asian Studies" },
      { name: "Chang Xu",            detail: "Transnational Asian Studies" }
    ],
    staff: [
      { name: "Agustina Fernandez-Moya", detail: "Director, Employer Engagement and Experiential Learning" },
      { name: "Carrie Willard",          detail: "Office of Graduate and Postdoctoral Studies, Assistant Dean" },
      { name: "Jeff Yeung",              detail: "Assistant Director of Reporting, Controller's Office" },
      { name: "Danika Brown, PhD",       detail: "Center for Civic Leadership" },
      { name: "James Hurley",            detail: "Associate Vice President of Alumni Relations" },
      { name: "Sandee Cheynet",          detail: "Associate Vice President, Human Resources and CHRO" },
      { name: "Teresa Cisneros",         detail: "Lead administrator for Rice Advanced Materials Institute (RAMI)" },
      { name: "Dr. Tina Jackson. Ed.D",  detail: "Senior Employee Relations Specialist in HR" },
      { name: "Veronica Bernal",         detail: "Facilities and Operations Manager at H&D" },
      { name: "Beth Leaver",             detail: "Interim Assistant VP for Housing, Dining and Hospitality" },
      { name: "Tamara Davis",            detail: "Assistant Director, First-Year Programs" }
    ],
    community: [
      { name: "Reverend Neil Willard",  detail: null },
      { name: "Claudia Vassar",         detail: "Alumni Trustee" },
      { name: "David Vassar",           detail: null },
      { name: "Rushi Bhalani",          detail: null },
      { name: "Jacy Grannis",           detail: null },
      { name: "Dr. Mike Castillo",      detail: null },
      { name: "Kathleen Yen, MD PLLC",  detail: null },
      { name: "Igor Frenkel, Esq.",     detail: null },
      { name: "Dr. Becky Hall",         detail: null },
      { name: "Tony Pule",              detail: null },
      { name: "Heather Pule, Ed. D",    detail: null },
      { name: "Nick Collins",           detail: null },
      { name: "Betty Hammer",           detail: null },
      { name: "Cathryn Rodd Selman",    detail: "Alumni Trustee" },
      { name: "Ryan Hammer",            detail: null },
      { name: "Marc Scott",             detail: null },
      { name: "Dr. Hillary Patuwo",     detail: null }
    ]
  }
};
