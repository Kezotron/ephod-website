/* ============================================================
   EPHOD Church Strengthening Seminars — course content.
   ------------------------------------------------------------
   This is the only file to edit to change the course:
   titles, descriptions, Scriptures, reflection questions,
   quiz questions and the handout for each seminar.

   Source: Rev. Herb and Rev. Karen Johnson's seminar PowerPoints
   and the 2020 fill-in-the-blank handouts. Every quiz question
   is one of the handout's blanks, so someone who watched the
   video and filled in the handout will pass.

   Each seminar:
     n           seminar number (order matters — the course is taken in order)
     group       "defined" | "noun" | "verb"
     title       one word, as on the handouts
     vimeo       Vimeo video id
     minutes     running time, whole minutes
     commitment  the commitment this seminar asks for (shown under the title)
     summary     one or two sentences for the course page card
     body        paragraphs for the lesson page (plain text, one per array item)
     scriptures  key passages
     reflect     reflection / small-group questions
     quiz        multiple-choice questions; "a" is the index of the right answer (0-based)
     handout     { href, pages } — the fill-in-the-blank handout (PDF)
   ============================================================ */
window.EPHOD_SEMINARS = {
  intro: { vimeo: "795072887", title: "Course introduction", minutes: 1 },
  passMark: 0.75, // share of quiz questions that must be right to pass
  groups: [
    { id: "defined", title: "EPHOD Defined", kicker: "Seminars 1–5", cover: "images/cover-defined.webp",
      blurb: "What EPHOD is and why it exists: the Purpose, the Pattern, the Plan, the Process and the Power behind it all." },
    { id: "noun", title: "EPHOD the Noun — being a disciple", kicker: "Seminars 6–9", cover: "images/cover-noun.webp",
      blurb: "“If you continue in my word, then are you my disciples indeed” (John 8:31). Four commitments that make a disciple: Magnify, Membership, Maturity and Ministry." },
    { id: "verb", title: "EPHOD the Verb — making disciples", kicker: "Seminars 10–13", cover: "images/cover-verb.webp",
      blurb: "“Go and make disciples” (Matthew 28:19). Four commitments that make a disciple maker: Monitor, Management, Mission and Mabuhay." }
  ],
  seminars: [
    /* ───────────────────────── EPHOD DEFINED ───────────────────────── */
    {
      n: 1, group: "defined", title: "Purpose", vimeo: "794997783", minutes: 18,
      commitment: "Every Person, Household, Oikos, Discipled.",
      summary: "What the word EPHOD means, what the five letters stand for, and the two sides of the word “disciple” — the noun and the verb.",
      body: [
        "EPHOD is a Hebrew word. It was the priestly garment — colour-coded and custom-made — that the priest put on to come into the presence of God. When David had lost everything at Ziklag he said, “Bring me the ephod,” asked the Lord, and was told he would recover everything that had been taken (1 Samuel 30). That is the picture behind the whole programme.",
        "The five letters spell out the purpose: Every Person, Household, Oikos, Discipled. Oikos is a Greek word for every person in your life — your household oikos, your extended oikos and your church oikos. Each word carries a verse: John 3:16 (every), 2 Peter 3:9 (person), 1 Samuel 30 (household), Acts 10:24 (oikos, where Cornelius gathered his relatives and close friends) and Matthew 28:19–20 with John 8:31 (discipled).",
        "“Disciple” is both a noun and a verb. I am a disciple — the noun, John 8:31: “If ye continue in my word, then are ye my disciples indeed.” I disciple someone — the verb, Matthew 28:19: “Go and make disciples.” The seminars that follow are built on those two sides. And who makes disciples? We do, and Jesus is with us as we do it.",
        "This first seminar also sets out the five parts of EPHOD Defined — Purpose, Pattern, Plan, Process and Power — which are Seminars 1 to 5 of this course."
      ],
      scriptures: ["1 Samuel 30:1–20", "John 3:16", "2 Peter 3:9", "Acts 10:24", "John 8:31", "Matthew 28:18–20", "Ephesians 4:11–16"],
      reflect: [
        "David asked the Lord before he went after what was lost. Where in your life or church is something lost that needs recovering — and have you asked Him about it?",
        "Write down your household oikos, your extended oikos and your church oikos — the actual names. How many people is that?",
        "“I am a disciple” and “I disciple someone.” Which of the two is stronger in your life right now? Why?",
        "The seminars are for all believers, all ages. Who in your church — young or old — is usually left out of discipleship, and how could they be included?"
      ],
      quiz: [
        { q: "EPHOD is a word from which language?", c: ["Hebrew", "Greek", "Latin", "Tagalog"], a: 0 },
        { q: "The ephod was the garment the priest put on to come into the ______ of God.", c: ["temple", "presence", "service", "fear"], a: 1 },
        { q: "Which of these is NOT one of the five parts of EPHOD Defined?", c: ["Purpose", "Pattern", "Prayer", "Power"], a: 2 },
        { q: "What do the letters of EPHOD stand for?", c: ["Every Pastor Helping Other Disciples", "Every Person, Household, Oikos, Discipled", "Equipping People for Holy Outreach Daily", "Evangelism, Prayer, Holiness, Obedience, Devotion"], a: 1 },
        { q: "Oikos is a Greek word for…", c: ["the church building", "every person in your life", "a priest’s robe", "a small group leader"], a: 1 },
        { q: "In 1 Samuel 30, when David asked the Lord through the ephod whether to chase the raiders, what was the answer?", c: ["Wait until morning", "No, let them go", "Yes — you will surely recover everything that was taken", "Send Abiathar instead"], a: 2 },
        { q: "“I am a disciple” is the ______; “I disciple someone” is the ______.", c: ["verb; noun", "noun; verb", "pattern; plan", "process; power"], a: 1 },
        { q: "Who makes disciples?", c: ["Only pastors and missionaries", "Only those with a Bible school degree", "We make disciples, and Jesus is with us as we do it", "Jesus alone, without us"], a: 2 }
      ],
      handout: { href: "handouts/seminar-01-purpose-handout.pdf", pages: 1 }
    },
    {
      n: 2, group: "defined", title: "Pattern", vimeo: "794998645", minutes: 16,
      commitment: "Make everything according to the pattern shown you on the mountain.",
      summary: "A model to copy, a design to follow and detailed instructions — where God’s pattern is found and how a disciple is clothed, colour-coded and custom-made.",
      body: [
        "A pattern is a model to copy, a design to follow and detailed instructions. When God told Moses to build the tabernacle He said, “See to it that you make everything according to the pattern shown you on the mountain” (Hebrews 8:5, quoting Exodus 25:40). EPHOD applies that command to making disciples: God has a pattern, and He expects us to follow it rather than improvise.",
        "Where do we find the pattern? In the Word — “the whole will of God” (Acts 20:27) — and in mentoring: “Pattern yourselves after me, as I imitate and follow Christ” (1 Corinthians 11:1). A disciple needs both the Book and a person.",
        "How is the EPHOD pattern developed? Like the priest’s ephod itself. Clothed: “stay in the city until you have been clothed with power from on high” (Luke 24:49). Colour-coded: Exodus 28:6 names gold, blue, purple and scarlet yarn and finely twisted linen — in the seminars gold stands for finishing strong, blue for prayer, purple for worship and royalty, scarlet for the blood of Jesus, and white linen for being clean through the Word. Custom-made: Paul laid a foundation as an expert builder and “each one should be careful how he builds” (1 Corinthians 3:10); the garments were made for ministering in the sanctuary, as the Lord commanded (Exodus 39:1).",
        "A pilot keeps a plane on course by constant small adjustments — only one percent of the flight is flying straight. The Word, prayer and monitoring are how a disciple keeps coming back to God’s original pattern."
      ],
      scriptures: ["Hebrews 8:5", "Exodus 25:40", "Acts 20:27", "1 Corinthians 11:1", "Luke 24:49", "Exodus 28:6", "1 Corinthians 3:10", "Exodus 39:1"],
      reflect: [
        "Why do you think God was so exact about the tabernacle? What does “according to the pattern” mean for how a church makes disciples?",
        "The pattern is found in the Word and in mentoring. Who has been a pattern for you? Who are you a pattern for?",
        "Gold, blue, purple, scarlet, white: finishing strong, prayer, worship, the blood of Jesus, the Word. Which colour is strongest in your life, and which is faded?",
        "“Each one should be careful how he builds.” What are you building on the foundation someone else laid in your life?"
      ],
      quiz: [
        { q: "A pattern is a model to copy, a design to follow and…", c: ["a picture to admire", "detailed instructions", "a rule to enforce", "a list of leaders"], a: 1 },
        { q: "Hebrews 8:5 says: “See to it that you make everything according to the ______ shown you on the mountain.”", c: ["plan", "law", "pattern", "promise"], a: 2 },
        { q: "Where do we find the pattern? (two places)", c: ["Tradition and culture", "The Word and mentoring", "Conferences and books", "Dreams and visions"], a: 1 },
        { q: "Who said, “Pattern yourselves after me, as I imitate and follow Christ” (1 Corinthians 11:1)?", c: ["Peter", "Moses", "Paul", "John"], a: 2 },
        { q: "The three ways the EPHOD pattern is developed are Clothed, Colour-coded and…", c: ["Counted", "Custom-made", "Copied", "Completed"], a: 1 },
        { q: "In Luke 24:49 Jesus told the disciples to stay in the city until they were…", c: ["ordained by the apostles", "clothed with power from on high", "joined by Paul", "baptized in water"], a: 1 },
        { q: "Which colour is NOT named in Exodus 28:6 for the ephod?", c: ["Gold", "Blue", "Green", "Scarlet"], a: 2 }
      ],
      handout: { href: "handouts/seminar-02-pattern-handout.pdf", pages: 1 }
    },
    {
      n: 3, group: "defined", title: "Plan", vimeo: "794999431", minutes: 18,
      commitment: "A custom-made plan for the local church, so that every believer grows.",
      summary: "The EPHOD 10 Point Plan introduced, and the Full Life Study Bible reading plan that runs through the whole of it — the same plan you will find on this website.",
      body: [
        "The Plan is a custom-made plan for the local church to help every believer grow spiritually, be an effective disciple and be an active disciple maker. It has ten points: daily Bible reading; weekly Scripture memorisation; Sunday school and worship; a weekly care cell or Bible study; a devotional journal; praying and fasting one meal each week; sharing or witnessing Jesus; tithes and offerings; a daily prayer and worship time; and taking notes in services. Each point is taught in full in the Maturity seminar.",
        "The reading plan EPHOD uses is the Full Life Study Bible reading plan, a study Bible made for Spirit-filled believers. The one-year plan reads the Old Testament in the morning and the New Testament in the evening; a two-year plan takes the Old Testament in the first year and the New in the second. The Old Testament books are read in Biblical order except the prophets, who are read in the order they lived and wrote, beginning with Obadiah and ending with Malachi. The New Testament begins with Matthew, then Acts, then Mark and the General Epistles, then Luke and the Pauline Epistles, and finally John and John’s epistles — so the plan keeps coming back to the life, death and resurrection of Jesus.",
        "The same passages give the church its Sunday sermon, its Sunday school lesson and its house-fellowship discussion, so the whole church is in the same Word together. And preaching must come from the anointing of the Holy Spirit and your own study of the Word — not copied from a book or the internet.",
        "EPHOD Discipleship is a biblical lifestyle and it is a process — not a book, and not a one-year training programme."
      ],
      scriptures: ["John 8:31", "Psalm 1:1–3", "Joshua 1:8", "2 Timothy 3:16–17"],
      reflect: [
        "Go through the ten points and mark the ones you already practise. Which one would change the most if you started it this week?",
        "The plan puts the whole church in the same passages — sermon, Sunday school and small group. What would that do for your church?",
        "Why do you think the New Testament plan returns to a Gospel four times a year?",
        "“A biblical lifestyle, not a one-year programme.” What is the difference, in practice, between a programme and a lifestyle?"
      ],
      quiz: [
        { q: "The Plan is custom-made for the local church to help every believer grow spiritually, be an effective disciple and be…", c: ["a church officer", "an active disciple maker", "a Bible school graduate", "a worship leader"], a: 1 },
        { q: "How many points are in the EPHOD Discipleship Plan?", c: ["Five", "Eight", "Ten", "Twelve"], a: 2 },
        { q: "Which of these is NOT one of the ten points?", c: ["Weekly Scripture memorisation", "A yearly church retreat", "Devotional journal", "Take notes in services"], a: 1 },
        { q: "The plan asks you to pray and fast…", c: ["one day each month", "one meal each week", "one week each year", "every Friday"], a: 1 },
        { q: "The reading plan comes from which study Bible?", c: ["The Scofield Reference Bible", "The Life Application Bible", "The Full Life Study Bible", "The Ryrie Study Bible"], a: 2 },
        { q: "In the one-year plan, the Old Testament is read in the ______ and the New Testament in the ______.", c: ["evening; morning", "morning; evening", "first year; second year", "winter; summer"], a: 1 },
        { q: "The Old Testament prophets are read in the order they lived and wrote, beginning with ______ and ending with ______.", c: ["Isaiah; Malachi", "Obadiah; Malachi", "Hosea; Daniel", "Jonah; Zechariah"], a: 1 },
        { q: "The reading plan keeps coming back to…", c: ["the law of Moses", "the life, death and resurrection of Jesus", "the Psalms", "the book of Revelation"], a: 1 },
        { q: "EPHOD Discipleship is a biblical lifestyle and it is a…", c: ["book", "one-year programme", "process", "denomination"], a: 2 }
      ],
      handout: { href: "handouts/seminar-03-plan-handout.pdf", pages: 1 }
    },
    {
      n: 4, group: "defined", title: "Process", vimeo: "795000283", minutes: 28,
      commitment: "Every seminar builds on the one before — then take someone else around the bases.",
      summary: "How the 10 Point Plan, the eight seminars and small groups fit together — explained with a baseball diamond — and the commitment each seminar asks for.",
      body: [
        "The EPHOD discipling process has three parts: the 10 Point Discipleship Plan, the eight EPHOD seminars, and small groups. The game of baseball illustrates it. Each base represents an EPHOD seminar in the disciple-making process; every seminar builds on the one before; and after completing the process, the disciple takes someone else around the bases. That is discipleship multiplication.",
        "The real issue is not how many decisions for Christ, but how many we are helping on their way to heaven. It’s not how we start, but how we finish that counts.",
        "Each seminar asks the believer for a specific commitment: Magnify — praise and worship; Membership — the local church; Maturity — a biblical lifestyle; Ministry — service; Monitor — finishing strong; Management — the Holy Spirit and the pastoral team; Mission — EPHOD; Mabuhay — relationships.",
        "A small group is an effective tool in the important process of making disciples (Matthew 28:19). Why small groups? They allow time for every person to talk, give every person a sense of belonging, provide learning and sharing through interaction, give a time and place to minister to every person, and keep the focus on individual needs.",
        "Put together: the Purpose and the Pattern give direction and develop unity; the Plan produces quality; the Process results in quantity. But for fruitful multiplication the church and the believers need the power of the Holy Spirit — which is the next seminar."
      ],
      scriptures: ["Matthew 28:19", "Ephesians 4:13", "2 Timothy 2:2", "Mark 6:39–41"],
      reflect: [
        "Which base are you on? Be honest with your group about it.",
        "“Not how many decisions, but how many we are helping on their way to heaven.” How would your church measure differently if it believed that?",
        "Of the five reasons for small groups, which one is most missing from your church’s gatherings?",
        "Direction and unity, quality, quantity. Which of the three does your church have most of, and which least?"
      ],
      quiz: [
        { q: "The EPHOD discipling process has three parts: the 10 Point Plan, the eight seminars and…", c: ["Sunday school", "small groups", "a yearly convention", "a building programme"], a: 1 },
        { q: "In the baseball picture, each base represents…", c: ["a year of membership", "an EPHOD seminar", "a church department", "a Bible book"], a: 1 },
        { q: "After completing the process, what does the disciple do?", c: ["Rest for a year", "Take someone else around the bases", "Apply for ordination", "Start a new church"], a: 1 },
        { q: "“The real issue is not how many decisions for Christ, but how many we are ______ on their way to heaven.”", c: ["counting", "baptizing", "helping", "teaching"], a: 2 },
        { q: "Monitor is a commitment to…", c: ["praise and worship", "finishing strong", "relationships", "the local church"], a: 1 },
        { q: "Mabuhay is a commitment to…", c: ["service", "finishing strong", "relationships", "a biblical lifestyle"], a: 2 },
        { q: "Which of these is NOT one of the reasons given for small groups?", c: ["Allows time for every person to talk", "Gives every person a sense of belonging", "Needs fewer leaders than a Sunday service", "Group focus is on individual needs"], a: 2 },
        { q: "The Plan produces ______; the Process results in ______.", c: ["quantity; quality", "quality; quantity", "unity; direction", "power; purpose"], a: 1 }
      ],
      handout: { href: "handouts/seminar-04-process-handout.pdf", pages: 1 }
    },
    {
      n: 5, group: "defined", title: "Power", vimeo: "850700923", minutes: 36,
      commitment: "Our power source is the Baptism in the Holy Spirit.",
      summary: "The power behind the whole process: the Baptism in the Holy Spirit — what it is, how it is received, and the door it opens to the gifts of the Spirit.",
      body: [
        "Our power source is the Baptism in the Holy Spirit. Jesus executes it: “I baptize you with water, but He will baptize you with the Holy Spirit” (Mark 1:8). The Word explains it: “You will receive power when the Holy Spirit comes on you; and you will be my witnesses” (Acts 1:8). And the believer experiences it: “All of them were filled with the Holy Spirit and began to speak in other tongues as the Spirit enabled them” (Acts 2:4).",
        "The Holy Spirit is a gentleman. He will not force you to speak in tongues; you will use your own lips, teeth, tongue and voice to give voice to the words He gives you, and you keep control of your voice and body. The initial outward sign is tongues — Peter and his companions heard the household of Cornelius speaking in tongues and praising God (Acts 10:46). It is not an emotional state one works up. How do you receive? Be a committed disciple of Jesus; desire to be filled; ask — “how much more will your heavenly Father give the Holy Spirit to those who ask him” (Luke 11:13); and when the Holy Spirit gives the words, you are the one who gives voice to them.",
        "The Baptism in the Holy Spirit is the door to the spiritual gifts: wisdom, knowledge, faith, gifts of healing, miracles, prophecy, distinguishing between spirits, tongues and interpretation of tongues (1 Corinthians 12:8–10). The gifts are manifestations of the Holy Spirit, and pastors and leaders especially need the manifestation of wisdom to finish strong.",
        "The seminar closes with guidelines for finishing strong: no unwise counselling with the opposite sex alone; remember the rule of three; do not stop daily devotions; do not think “it will not happen to me”; do the EPHOD 10 Point Plan. These matter most when small groups come into a church — leadership is entrusted to reliable people, and male-female relations must be protected. EPHOD is more than a purpose, pattern, plan and process: it is a covering, a protection, a prevention and a power. Remember: believers can only go as far as their leaders can take them."
      ],
      scriptures: ["Mark 1:8", "Acts 1:8", "Acts 2:4", "Acts 10:44–46", "Luke 11:13", "1 Corinthians 12:7–11"],
      reflect: [
        "Jesus told the disciples to wait for power before they went. Where have you been going without waiting?",
        "“The Holy Spirit is a gentleman.” What fears or misunderstandings about the Baptism in the Holy Spirit have you heard, and how does this seminar answer them?",
        "Which of the nine gifts have you seen operate in your church? Which have you never seen?",
        "The guidelines for finishing strong are mostly about protecting yourself before anything goes wrong. Which one do you most need to put in place now?"
      ],
      quiz: [
        { q: "According to the seminar, our power source is…", c: ["Bible knowledge", "the Baptism in the Holy Spirit", "church membership", "strong leadership"], a: 1 },
        { q: "Mark 1:8 — who baptizes the believer in the Holy Spirit?", c: ["John the Baptist", "The pastor", "Jesus", "The apostles"], a: 2 },
        { q: "Acts 1:8: “You will receive ______ when the Holy Spirit comes on you.”", c: ["wisdom", "healing", "power", "peace"], a: 2 },
        { q: "The initial outward sign of the Baptism in the Holy Spirit is…", c: ["tears", "trembling", "tongues", "prophecy"], a: 2 },
        { q: "“The Holy Spirit is a gentleman” means…", c: ["He speaks only to men", "He will not force you to speak in tongues; you keep control of your voice and body", "He only comes in quiet services", "He waits for the pastor’s permission"], a: 1 },
        { q: "The Baptism in the Holy Spirit is not…", c: ["for believers today", "promised by Jesus", "an emotional state one works up", "the door to the spiritual gifts"], a: 2 },
        { q: "Which of these is NOT one of the nine gifts listed in 1 Corinthians 12:8–10?", c: ["Word of wisdom", "Gifts of healing", "Preaching", "Interpretation of tongues"], a: 2 },
        { q: "Which is one of the guidelines to finish strong?", c: ["Counsel the opposite sex alone when necessary", "Remember the rule of three", "Rest from daily devotions when busy", "Trust that it will not happen to you"], a: 1 },
        { q: "EPHOD Discipleship is a covering, a protection, a prevention and a…", c: ["programme", "power", "promise", "plan"], a: 1 }
      ],
      handout: { href: "handouts/seminar-05-power-handout.pdf", pages: 3 }
    },

    /* ───────────────────────── EPHOD THE NOUN ───────────────────────── */
    {
      n: 6, group: "noun", title: "Magnify", vimeo: "850739922", minutes: 49,
      commitment: "Magnify is a commitment to become a true worshipper of God.",
      summary: "Praise and worship as a lifestyle: what they are, who, when, why and how — including singing in the Spirit and the things that hinder worship.",
      body: [
        "Magnify is a commitment to become a true worshipper of God. Worship is both individual and corporate; Pentecostals worship in spirit and in truth, and the Assemblies of God have a distinctive style of worship. Magnify has two parts: praise, and worship or adoration. Worship is a love relationship — “Love the Lord your God with all your heart and with all your soul and with all your mind and with all your strength” (Mark 12:30).",
        "Praise is more of an outward expression: spoken or sung audibly, in the vernacular or mother tongue, and in corporate prayer in tongues (Ephesians 5:18–19). Worship is an attitude of the heart — a deep meditation on the greatness and worthiness of God and a spontaneous overflow of those thoughts and emotions; it cannot be worked up (Psalm 103:1). Who should worship? All believers (Psalm 79:13). When? Every day, at all times (Psalm 145:2; 113:3; 34:1). Why? It is commanded by God (Psalms 146–150), the Father seeks worshippers (John 4:23), praise is a garment of the Spirit (Isaiah 61:3 — the Hebrew ‘atah means a total covering, leaving no openings for the enemy), and we are to be filled with the Spirit again and again (Ephesians 5:18).",
        "How do we worship? With a clean heart (1 John 1:9; John 15:3) and with spiritual songs (1 Corinthians 14:15). Singing in the Spirit is singing to the Lord with words the Holy Spirit gives us; every Spirit-filled believer can do it, by yielding our voices in song to the Holy Spirit. In solemn worship, don’t be afraid of silence — pauses are necessary to allow the Holy Spirit time and place to speak through tongues and interpretation and through prophecy, and to minister the nine spiritual gifts, which He alone distributes (1 Corinthians 12:11).",
        "Hindrances to worship: sin (Isaiah 59:2) — the solution is to confess (1 John 1:9) — and any activity or action that takes the focus off Jesus: late-comers, talking habits, non-participation, physical manifestations that do not edify the church, suppressing the impulses of the Holy Spirit, phones and texting. Congregational worship is at its purest when every member of the body is participating, when the whole body is alive, inspired and indwelt by the Holy Spirit and yielded to His operation."
      ],
      scriptures: ["Mark 12:30", "Psalm 103:1", "Psalm 145:2", "John 4:23", "Isaiah 61:3", "Ephesians 5:18–19", "1 Corinthians 14:15", "1 Corinthians 12:11", "Isaiah 59:2", "1 John 1:9"],
      reflect: [
        "Praise is outward; worship is an attitude of the heart that cannot be worked up. Which comes more easily to you, and what does that tell you?",
        "“When distressed, be dressed — with praise.” Describe a time praise changed a heavy spirit in you or in a service.",
        "What happens in your church when there is silence in worship? Is there room for the Holy Spirit to speak?",
        "Go through the list of hindrances honestly. Which one are you guilty of, and what will you change this Sunday?"
      ],
      quiz: [
        { q: "Magnify is a commitment to become a…", c: ["worship leader", "true worshipper of God", "member of the choir", "song writer"], a: 1 },
        { q: "The two parts of Magnify are…", c: ["singing and giving", "praise and worship/adoration", "prayer and fasting", "preaching and teaching"], a: 1 },
        { q: "According to the seminar, worship is a ______ relationship.", c: ["working", "love", "formal", "weekly"], a: 1 },
        { q: "Which describes praise rather than worship?", c: ["An attitude of the heart", "Cannot be worked up", "More of an outward expression — spoken or sung audibly", "A deep meditation on the greatness of God"], a: 2 },
        { q: "Who should worship?", c: ["The praise team", "All believers", "Pastors and elders", "Those with musical gifts"], a: 1 },
        { q: "Praise is a ______ of the Spirit (Isaiah 61:3).", c: ["weapon", "fruit", "garment", "reward"], a: 2 },
        { q: "Who should sing in the Spirit?", c: ["Only trained singers", "Only the worship leader", "Every believer who is Spirit-filled", "No one — it was only for the apostles"], a: 2 },
        { q: "Why are pauses important in solemn worship?", c: ["To rest the musicians", "To allow the Holy Spirit time and place to speak through tongues, interpretation and prophecy", "To let late-comers find seats", "To make announcements"], a: 1 },
        { q: "Which is listed as a hindrance to worship?", c: ["Lifting hands", "Singing in the mother tongue", "Suppressing the impulses of the Holy Spirit", "Children praising"], a: 2 }
      ],
      handout: { href: "handouts/seminar-06-magnify-handout.pdf", pages: 5 }
    },
    {
      n: 7, group: "noun", title: "Membership", vimeo: "850891875", minutes: 45,
      commitment: "Membership is a commitment to God and to the local Assembly of God church.",
      summary: "Why a disciple belongs: the church as a family, commitment as the difference between an attender and a member, and what the Assemblies of God believe — the 16 Fundamental Truths and 4 Cardinal Doctrines.",
      body: [
        "Membership is a commitment to God and a commitment to the local Assembly of God church. The church is a family — “you are members of God’s very own family … and you belong in God’s household with every other Christian” (Ephesians 2:19). The difference between a church attender and a member is commitment, and commitment is necessary before becoming a leader in the local church. “Those who are planted in the house of the Lord shall flourish in the courts of our God” (Psalm 92:13).",
        "The Assemblies of God have 16 Fundamental Truths and 4 Cardinal Doctrines. The seminar walks through all sixteen with a verse for each: the Bible is the Word of God; the one true God in three Persons; the deity of the Lord Jesus Christ; the fall of man; the salvation of man through the shed blood of Christ; the ordinances of the church — water baptism and holy communion; the Baptism in the Holy Spirit; the initial physical evidence of the Baptism in the Holy Spirit is speaking in tongues; sanctification; the church and its mission; the ministry; divine healing; the blessed hope; the millennial reign of Christ; the final judgment; and the new heavens and the new earth.",
        "Why tongues? It is the biblical pattern (Acts 10:44–46): the outward evidence of being filled, a prayer language that edifies, the means of messages in tongues, and a sign to the unbeliever. The four Cardinal Doctrines — the principal, basic ones — are that Jesus saves, Jesus baptizes in the Holy Spirit, Jesus heals, and Jesus is coming again.",
        "The seminar ends with a Membership Commitment to sign: daily Bible reading and praying in the Spirit, faithful attendance, tithes and offerings, prayer for the pastor and church, following the leadership, avoiding gossip, being used in the gifts, being equipped to serve, a Christ-like attitude, love toward other members, a warm welcome for visitors, and sharing Jesus. We become what we are committed to: commitment to the Great Commandment and the Great Commission produces a dedicated EPHOD disciple. The vision of the church is for every person in the church to become an EPHOD disciple — and when you have completed the first round of the bases, you will be ready to be used in the Leadership Base of the church."
      ],
      scriptures: ["Ephesians 2:19", "Psalm 92:12–13", "2 Peter 1:21", "Acts 2:4", "Romans 12:1–2", "Titus 2:13", "Acts 10:44–46", "Mark 12:28–31", "Matthew 28:18–20"],
      reflect: [
        "“The difference between an attender and a member is commitment.” Which are you, by that definition — and which are most of the people in your church?",
        "Pick three of the 16 Fundamental Truths you could not have explained before this seminar. Say each one in your own words.",
        "Read the Membership Commitment line by line. Which line would be hardest to keep? Which would change your church most if everyone kept it?",
        "“We become what we are committed to.” What are you actually committed to, judging by your time and money?"
      ],
      quiz: [
        { q: "Membership is a commitment to God and to…", c: ["a denomination in general", "the local Assembly of God church", "a weekly television ministry", "the pastor personally"], a: 1 },
        { q: "According to Ephesians 2:19, the church is a…", c: ["building", "business", "family", "school"], a: 2 },
        { q: "The difference between a church attender and a member is…", c: ["baptism", "commitment", "age", "giving"], a: 1 },
        { q: "The Assemblies of God have ______ Fundamental Truths and ______ Cardinal Doctrines.", c: ["10; 2", "12; 3", "16; 4", "20; 5"], a: 2 },
        { q: "The two ordinances of the church are…", c: ["Prayer and fasting", "Water baptism and holy communion", "Tithing and witnessing", "Preaching and teaching"], a: 1 },
        { q: "The initial physical evidence of the Baptism in the Holy Spirit is…", c: ["joy", "speaking in tongues", "healing", "boldness"], a: 1 },
        { q: "Which is NOT one of the four Cardinal Doctrines?", c: ["Jesus saves", "Jesus baptizes in the Holy Spirit", "Jesus is the Good Shepherd", "Jesus is coming again"], a: 2 },
        { q: "The vision of the church is for ______ in the church to become an EPHOD disciple.", c: ["every leader", "every person", "every young person", "every family head"], a: 1 },
        { q: "When you have completed the first round of the bases you are ready to be used in the…", c: ["pulpit", "Leadership Base of the church", "mission field", "choir"], a: 1 }
      ],
      handout: { href: "handouts/seminar-07-membership-handout.pdf", pages: 7 }
    },
    {
      n: 8, group: "noun", title: "Maturity", vimeo: "795008748", minutes: 54,
      commitment: "Maturity is a commitment to develop spiritual habits — the EPHOD 10 Point Plan — for growth.",
      summary: "The heart of the course: all ten points of the EPHOD plan, strand by strand. Your spiritual maturity is determined by your EPHOD lifestyle.",
      body: [
        "Maturity is a commitment to develop spiritual habits — the EPHOD 10 Point Plan — for growth. Your spiritual maturity is determined by your EPHOD lifestyle. It is a process; there are no shortcuts; it takes discipline. “If ye continue in my word, then are ye my disciples indeed” (John 8:31). Each of the ten points is like a strand of a cord that together makes a complete and strong biblical lifestyle: “a cord of three strands is not quickly broken” (Ecclesiastes 4:12).",
        "Strand 1, daily Bible reading: have a reading plan, custom-make your own schedule around the Word and your available time, and use the Full Life Study Bible plan — Old Testament in Biblical order except the prophets, New Testament always coming back to the life, death and resurrection of Jesus. Read the whole passage first, marking the verses you want to come back to; it is like mining for gold. Strand 2, weekly Scripture memorisation: “Guard my words as your most precious possession. Write them down, and also keep them within your heart” (Proverbs 7:2–3). Strand 3, Sunday school and worship: do not stay away from the church meetings, but meet together and encourage each other (Hebrews 10:25). Strand 4, the weekly house fellowship or Bible study: a channel of pastoral care for all who belong to the local church, and the place where potential leaders are recognised and groomed (Nehemiah 8). Strand 5, the devotional journal: “Write my answer in large, clear letters on a tablet, so that a runner can read it and tell everyone else” (Habakkuk 2:2) — the date, the passage, God’s message to you, your thoughts, prayer requests and answered prayers.",
        "Strand 6, pray and fast one meal each week: fasting is abstaining from food during mealtime and spending that time in prayer; fasting without prayer is just skipping a meal. Strand 7, sharing or witnessing Jesus: you are the salt of the earth and the light of the world (Matthew 5:13–16); “go home to your family and tell them how much the Lord has done for you” (Mark 5:19). Strand 8, tithes and offerings: the tithe is the tenth that automatically belongs to God (Malachi 3:10); offerings are gifts given above the tithe to advance God’s mission and ministry, including benevolence to the poor (Proverbs 19:17). Strand 9, daily prayer and worship time: enter His presence with thanksgiving every day (Psalm 145:2), pray in the Spirit daily (Jude 20; 1 Corinthians 14:4; Romans 8:26), be still and listen (Psalm 32:8), and watch God work (Psalm 5:3). Strand 10, take notes in services: it keeps your focus, overcomes distractions, brings the points together and lets you review — you will forget 95% of what you only hear.",
        "Everything on this website — the Morning and Evening Passages, the weekly memory verse, the Gold Nugget and the devotions — exists to help you keep this plan every day."
      ],
      scriptures: ["John 8:31–32", "Ecclesiastes 4:12", "Proverbs 7:2–3", "Hebrews 10:25", "Nehemiah 8:5–8", "Habakkuk 2:2", "Matthew 5:13–16", "Malachi 3:10", "Jude 20", "Psalm 5:3"],
      reflect: [
        "Give yourself an honest mark out of ten for each strand. Which two will you work on first, and who will ask you about them next week?",
        "A cord of many strands: which strand, if it broke, would weaken the others most in your life?",
        "“Fasting without prayer is just skipping a meal.” What has your experience of fasting been, and what would make it prayer?",
        "What is in your devotional journal from this week? If nothing, what stopped you?"
      ],
      quiz: [
        { q: "Maturity is a commitment to develop ______ for growth.", c: ["leadership skills", "spiritual habits — the EPHOD 10 Point Plan", "Bible knowledge", "church programmes"], a: 1 },
        { q: "Your spiritual maturity is determined by your…", c: ["years as a Christian", "position in the church", "EPHOD lifestyle", "Bible school training"], a: 2 },
        { q: "Each of the ten points is like a ______ of a cord.", c: ["knot", "strand", "link", "stitch"], a: 1 },
        { q: "What is the devotional journal for, according to Habakkuk 2:2?", c: ["Recording attendance", "Writing God’s answer plainly so that a runner can read it and tell everyone", "Listing prayer requests only", "Keeping sermon outlines"], a: 1 },
        { q: "Fasting is abstaining from food during mealtime and…", c: ["resting", "spending that time in prayer", "reading a book", "drinking only water"], a: 1 },
        { q: "The tithe is…", c: ["whatever you decide to give", "the tenth that automatically belongs to God", "a gift above your offerings", "money for the poor"], a: 1 },
        { q: "The weekly house fellowship is a channel of ______ and a place where ______ are recognised and groomed.", c: ["entertainment; singers", "pastoral care; potential leaders", "fundraising; donors", "announcements; visitors"], a: 1 },
        { q: "Strand 9 says to pray in the ______ daily.", c: ["morning only", "Spirit", "church building", "same place"], a: 1 },
        { q: "Why take notes in services? Because you will forget ______ of what you hear.", c: ["25%", "50%", "75%", "95%"], a: 3 }
      ],
      handout: { href: "handouts/seminar-08-maturity-handout.pdf", pages: 4 }
    },
    {
      n: 9, group: "noun", title: "Ministry", vimeo: "795011499", minutes: 46,
      commitment: "Ministry is the commitment to discover and use your God-given gifts and abilities in serving God and others.",
      summary: "God’s plan for ministry, ministering the nine gifts of the Spirit, your unique SHAPE, and finding your place in the local church.",
      body: [
        "Ministry is the commitment to discover and use your God-given gifts and abilities in serving God and others. The seminar has four parts: God’s plan for ministry, ministering the gifts of the Spirit, your unique SHAPE, and your place in the ministry of the local church. God’s plan: “the Son of Man did not come to be served, but to serve” (Matthew 20:28). Ministry is serving; it is building up the body of Christ; it is using the abilities God has given us; it is expressing love.",
        "The nine gifts of the Holy Spirit (the pneumatika) are the word of wisdom, the word of knowledge, faith, gifts of healing, the working of miracles, prophecy, discerning of spirits, a message in tongues, and the interpretation of a message in tongues (1 Corinthians 12:8–10). Who may minister them? “The manifestation of the Spirit is given to each one for the profit of all” (1 Corinthians 12:7): the Holy Spirit desires every Spirit-filled believer to be a willing vessel, and pastors and leaders need to be used in the gifts to set the example — always under the guidance of the Holy Spirit and of the pastor as overseer. How? Be teachable; be filled with the Holy Spirit daily; learn about the gifts; seek to be used; develop a rich devotional life; memorise Scripture; do not let fear stop you — take a step of faith (2 Timothy 1:7); and respond boldly to the urge to minister a gift.",
        "God has a unique design and plan for every person in ministry (Romans 12:2). Your unique SHAPE: Spiritual gifts — two kinds of permanent gifts, the charismata or grace gifts of Romans 12:6–8 and the diakoniai or ministry gifts of Ephesians 4:11, which exist to prepare God’s people for works of service; we discover our gifts when we serve. Heart — the centre of your motivation; your heart is your passion (Ephesians 6:7). Anointed abilities — your natural abilities become anointed abilities as you use them in ministry for the glory of God (Exodus 31:3). Personality — very important in matching people with ministry (1 Corinthians 2:11). Experience — we can pass to others the same help and comfort God has given us in our own spiritual, painful, educational and ministry experiences (2 Corinthians 1:3–4).",
        "How to find your place in the local church: submit to the leadership and vision of the senior pastor (Hebrews 13:17); be a team player; remember that when you are not in God’s place you cannot do your best — you take someone else’s place and rob them of their blessing; have the attitude of Christ Jesus (Philippians 2:5); and find the place where you belong — you will be effective and fulfilled, you will be loved, and you will love it. The pastor’s part is to list the ministry needs of the church, list the members already active in them, and communicate the needs to the leaders; the small-group leaders’ part is to communicate the needs to the members, help each member identify their SHAPE, and mobilise them to meet the needs under the ministry leader."
      ],
      scriptures: ["Matthew 20:28", "1 Corinthians 12:7–11", "2 Timothy 1:7", "Romans 12:2–8", "Ephesians 4:11–13", "Ephesians 6:7", "Exodus 31:3", "2 Corinthians 1:3–4", "Hebrews 13:17", "Philippians 2:5", "Colossians 3:23–24"],
      reflect: [
        "Work through your own SHAPE on paper: gifts, heart, abilities, personality, experience. What does the whole picture point to?",
        "“Do not let fear stop you.” What has fear stopped you from doing in a service or small group when you sensed the Spirit prompting you?",
        "“When you are not in God’s place you take someone else’s place and rob them of their blessing.” Is anyone in your church in the wrong place? Are you?",
        "If your church listed its ministry needs and its active members side by side, where would the gaps be?"
      ],
      quiz: [
        { q: "Ministry is the commitment to discover and use your God-given gifts and abilities in…", c: ["building a career", "serving God and others", "leading worship", "earning a title"], a: 1 },
        { q: "Matthew 20:28 says the Son of Man came not to be served but to…", c: ["rule", "teach", "serve", "judge"], a: 2 },
        { q: "How many gifts of the Holy Spirit are listed in 1 Corinthians 12:8–10?", c: ["Three", "Seven", "Nine", "Twelve"], a: 2 },
        { q: "Who may minister the gifts of the Spirit?", c: ["Only ordained ministers", "Only prophets", "Every Spirit-filled believer who is a willing vessel", "Only those over forty"], a: 2 },
        { q: "What does the “H” in SHAPE stand for?", c: ["Holiness", "Heart", "Habits", "Hope"], a: 1 },
        { q: "The two kinds of permanent spiritual gifts are the grace gifts (charismata) and the…", c: ["ministry gifts (diakoniai)", "fruit of the Spirit", "nine manifestations", "natural talents"], a: 0 },
        { q: "Your natural abilities become ______ abilities as you use them in ministry for the glory of God.", c: ["professional", "anointed", "paid", "public"], a: 1 },
        { q: "The first step in finding your place in the local church is to…", c: ["volunteer for everything", "submit to the leadership and vision of the senior pastor", "wait to be asked", "take a spiritual gifts test"], a: 1 },
        { q: "Which is part of the small-group leaders’ part?", c: ["Approve the church budget", "Help members identify their unique SHAPE", "Preach on Sunday", "Appoint the elders"], a: 1 }
      ],
      handout: { href: "handouts/seminar-09-ministry-handout.pdf", pages: 5 }
    },

    /* ───────────────────────── EPHOD THE VERB ───────────────────────── */
    {
      n: 10, group: "verb", title: "Monitor", vimeo: "795014039", minutes: 68,
      commitment: "Monitor is the commitment to finishing strong.",
      summary: "The first Verb seminar: staying alert against the enemy’s ambushes, and the four danger zones of integrity — vision, doctrine, finance and morals.",
      body: [
        "Monitor is the commitment to finishing strong. Be alert against the ambushes of the enemy: “Put on the full armour of God so that you can take your stand against the devil’s schemes” (Ephesians 6:11). To monitor is accountability — it observes, warns and instructs in overseeing the church. Saul started strong, with a changed heart and the empowering of the Spirit, and ended with a rebellious heart and a lost kingdom; he did not finish strong. Samuel, a man of prayer and integrity, and Ruth, a Moabite who chose the God of Israel and is in the genealogy of Christ, finished strong. Integrity is faithfulness to biblical principles.",
        "There are four danger zones. Integrity of vision: how many visions are possible for an effective church? One. Two visions equal di-vision (Mark 3:25). Support the vision of the pastor for the church, and do not entertain the Jezebel spirit (Revelation 2:20), which uses people in the church to usurp, control, destroy and divide — Miriam, Korah, Balaam and Absalom are the examples. How to deal with it: depend on the Holy Spirit, do not tolerate Jezebel activities, expose them to the leadership, and let the leadership deal with it. The Holy Spirit restores and does not divide, strengthens and does not weaken, reveals what is hidden, and allows the power of God to flow through His people.",
        "Doctrinal integrity (Joshua 1:8): every leader speaks the same language in unity with the church and has accepted the 16 Fundamental Truths. Do not compromise them — all guest speakers, all written materials, all videos and all discussion topics must be approved by the senior pastor; small-group topics come from the weekly reading plan, the Full Life Study Bible articles and notes, and approved discipleship books. Financial integrity (Deuteronomy 8:18): it is wisdom when pastors do not collect, count, bank, loan or borrow church funds — the pastor oversees, helps make the budget and approves disbursement — and there is no borrowing, lending or selling among the members within the cell or the church.",
        "Moral integrity: “Keep away from every kind of evil” (1 Thessalonians 5:22). Attraction and passion are God’s gifts, to be enjoyed within the fidelity of marriage (Hebrews 13:4; 1 Corinthians 7:2–5). Remember Joseph’s ten-second window of escape (1 Corinthians 10:13; Genesis 39:12) and Job’s pact with his eyes (Job 31:1). In counselling, remember the rule of three: let men minister to men and women to women, and no unwise counselling with the opposite sex alone (Luke 10:1). Guard your daily devotions and prayer time; remember David, and do not think “it will not happen to me.” To finish strong you need salvation, the Baptism in the Holy Spirit, an up-to-date experience with God, the EPHOD plan, and to be a disciple and a disciple maker — with five tools: a Bible (the Full Life Study Bible if possible), an EPHOD devotional journal, an EPHOD bookmark, a pencil and a tithe envelope. Let’s grow, glow, go and make disciples."
      ],
      scriptures: ["Ephesians 6:11", "Mark 3:25", "Revelation 2:20", "Joshua 1:8", "Deuteronomy 8:18", "1 Thessalonians 5:22–23", "Hebrews 13:4", "1 Corinthians 10:13", "Genesis 39:12", "Luke 10:1", "Job 31:1"],
      reflect: [
        "Saul and Samuel both started with God’s anointing. What was the difference in how they finished, and what does that warn you about?",
        "Vision, doctrine, finance, morals: in the ministries you have seen fall, which danger zone was it? Which is your own weakest point?",
        "Who are you accountable to right now — someone who observes, warns and instructs? If no one, who could it be?",
        "The rule of three and the ten-second window are both about deciding beforehand. What decisions do you need to make now, before the moment comes?"
      ],
      quiz: [
        { q: "Monitor is the commitment to…", c: ["church growth", "finishing strong", "Sunday attendance", "leadership titles"], a: 1 },
        { q: "To monitor is accountability — it observes, warns and…", c: ["punishes", "instructs", "replaces", "records"], a: 1 },
        { q: "Who did NOT finish strong?", c: ["Samuel", "Ruth", "Saul", "Daniel"], a: 2 },
        { q: "Integrity is faithfulness to…", c: ["the pastor", "biblical principles", "church tradition", "your own conscience"], a: 1 },
        { q: "How many visions are possible for an effective church?", c: ["One", "Two", "One per department", "As many as there are leaders"], a: 0 },
        { q: "What is the right way to deal with the Jezebel spirit?", c: ["Ignore it and hope it leaves", "Confront it alone in public", "Depend on the Holy Spirit, do not tolerate it, expose it to the leadership, and let the leadership deal with it", "Start a second group"], a: 2 },
        { q: "Who must approve all guest speakers, written materials, videos and discussion topics?", c: ["The worship leader", "The senior pastor", "The treasurer", "The oldest member"], a: 1 },
        { q: "For financial integrity, it is wisdom when pastors do not…", c: ["preach about money", "help make the budget", "collect, count, bank, loan or borrow church funds", "approve disbursements"], a: 2 },
        { q: "The rule of three in counselling means…", c: ["meet for three sessions only", "let men minister to men and women to women — no unwise counselling with the opposite sex alone", "counsel in groups of three families", "wait three days before advising"], a: 1 },
        { q: "Which is NOT one of the five tools needed to finish strong?", c: ["EPHOD devotional journal", "Tithe envelope", "Smartphone", "Pencil"], a: 2 }
      ],
      handout: { href: "handouts/seminar-10-monitor-handout.pdf", pages: 4 }
    },
    {
      n: 11, group: "verb", title: "Management", vimeo: "795017609", minutes: 27,
      commitment: "Management is the commitment to the management of the Holy Spirit and the pastoral team.",
      summary: "For new leaders: the Leadership Base — Vision, Role, Reproduction and Progression — and how to raise an apprentice who will raise others.",
      body: [
        "Management is the commitment to the management of the Holy Spirit and the pastoral team, and the commitment to reproduce Spirit-filled leaders: “the things you have heard me say … entrust to reliable men who will also be qualified to teach others” (2 Timothy 2:2). The purpose of this seminar is to help new leaders understand their role under the management of the Holy Spirit and the pastoral team in their EPHOD lifestyle and ministry assignment. The leader’s EPHOD lifestyle: broken free from the past (not a recent convert in leadership), grounded in the Word, a tither; round one of the bases completed; now ready to be used in the Leadership Base of the church.",
        "The Leadership Base has four parts. Vision: the senior pastor needs leaders committed to the vision of the church, and vision and commitment will determine the pastor’s entrustment and the release into ministry. First base — Membership — is a must; each church has its own dialect and its own vision; the vision is taught and caught; two visions equal di-vision. Role: understand your role as a leader — you are a team member. “Be sure you know the condition of your flocks” (Proverbs 27:23): know the spiritual condition of your cell members, anticipate moving the cell to the next base once it is functioning at the present one, and schedule and announce the EPHOD seminars. A small group is an effective tool in the process of making disciples; its five-step process gives every person time to talk, a sense of belonging, learning through interaction, time to be ministered to, and a focus on individual needs — the leader moderates it.",
        "Reproduction: a leader can only take you as far as he has gone himself — first-base leaders reproduce only first-base disciples. True reproduction is the completion of all of EPHOD: EPHOD Defined and the eight seminars. The next step for a small-group leader is to choose an apprentice, and there are five steps to work with one: I do and you watch, then we talk; I do and you help, then we talk; you do and I help, then we talk; you do and I watch, then we talk; you are released — to be a leader and mentor, and to select a new apprentice. Debrief every time: what happened, what do we want to happen, what changes do we need to make.",
        "Progression: convert; disciple; apprentice (beginning the discipleship process, faithfully doing the EPHOD plan, reliable); care-cell or house-fellowship leader (one round completed, a reliable apprentice, qualified); sectional leader (has mentored three apprentices into care-cell leaders); district leader (has mentored three care-cell leaders into sectional leaders); church planter (has mentored three sectional leaders into district leaders). You will continue the never-ending process of going around the bases."
      ],
      scriptures: ["2 Timothy 2:2", "Proverbs 27:23", "Luke 6:39", "Exodus 18:17–23", "1 Corinthians 3:5–9"],
      reflect: [
        "“A leader can only take you as far as he has gone himself.” How far have you gone? What does that mean for who you can lead?",
        "Vision, Role, Reproduction, Progression. Which base is your church strongest on, and which is missing altogether?",
        "Walk through the five apprentice steps with someone you are already helping. Which step are you on — and have you ever got to “you are released”?",
        "Who is your apprentice? If you don’t have one, who could it be, and what is stopping you from asking?"
      ],
      quiz: [
        { q: "Management is the commitment to the management of…", c: ["the church budget", "the Holy Spirit and the pastoral team", "the worship schedule", "the building"], a: 1 },
        { q: "A leader’s EPHOD lifestyle must include being broken free from the past, grounded in the Word, and being a…", c: ["tither", "singer", "preacher", "graduate"], a: 0 },
        { q: "The four parts of the Leadership Base are Vision, Role, Reproduction and…", c: ["Promotion", "Progression", "Protection", "Provision"], a: 1 },
        { q: "Two visions equal…", c: ["double growth", "di-vision", "a bigger church", "a new district"], a: 1 },
        { q: "As a leader, your role is to be a…", c: ["boss", "team member", "spectator", "critic"], a: 1 },
        { q: "“A leader can only take you as far as…”", c: ["the pastor allows", "he has gone himself", "the budget stretches", "the building holds"], a: 1 },
        { q: "What is the first of the five steps with an apprentice?", c: ["You do, I watch", "I do, you help", "I do, you watch, then we talk", "You are released"], a: 2 },
        { q: "What does the final step with an apprentice release them to do?", c: ["Rest from ministry", "Be a leader/mentor and select a new apprentice", "Move to another church", "Collect the offering"], a: 1 },
        { q: "A sectional leader must have nurtured and mentored how many apprentices to be care-cell leaders?", c: ["One", "Two", "Three", "Ten"], a: 2 }
      ],
      handout: { href: "handouts/seminar-11-management-handout.pdf", pages: 3 }
    },
    {
      n: 12, group: "verb", title: "Mission", vimeo: "795018843", minutes: 32,
      commitment: "Mission is the commitment to Every Person, Household, Oikos, Discipled.",
      summary: "Jesus’ mission pattern applied: choosing your few, mission match-making, affinity groups that multiply, and every believer’s part in mission to the world.",
      body: [
        "Mission is the commitment to Every Person, Household, Oikos, Discipled. Jesus’ mission statement — “Go and make disciples” (Matthew 28:19) — is a command given to every disciple. A disciple, a leader, is a learner or follower of Jesus, one who reflects His lifestyle, one who obeys His teaching, and one who is actively reproducing this pattern in others. The qualifications for the verb: empowered by the Holy Spirit (Acts 2:4); agrees with the vision of the local church; has completed the discipleship process; is active in the 10 Point Plan; has a servant-leader attitude; and is willing to invest himself in others.",
        "Jesus’ mission pattern: the best way to make leaders is on-the-job training — just letting them do it; the mentor coaches the disciple as he disciples his few; Jesus focused His investment on a few; He chose His few with prayer; and He had a 91.67% success rate — eleven of twelve. So choose your few under the management of the Holy Spirit, the senior pastor and the pastoral team, after prayer. In the few there are two categories: the target, a group of six to eight, drawn from uncommitted church attenders, your household and your oikos; and the apprentice, one or two believers baptized in the Holy Spirit, committed to Magnify and Membership and ready to commit to Maturity and Ministry.",
        "Mission match-making: who? The pastor and the pastoral team are the facilitators. What? Matching leaders and target. When? Whenever there are available leaders. How to get started: make a list of available leaders, a list of possible apprentices and a list of potential target; pray; and under the management of the Holy Spirit and the pastoral team choose affinity groups — people with common interests and natural bonds. The affinity group meets as a small group for discipleship, goes through the discipleship process, the apprentice becomes ready to lead, and the match-making is repeated for small-group multiplication.",
        "Mission to the world (Acts 1:8): crossing the cultural barrier through the missions convention, praying, sending and missionary going. A missions convention creates a world vision; Faith Promise allows everyone to have a part in fulfilling the Great Commission with a set amount given each month for six or twelve months; and a mission budget puts it to work. Missionary going means leaving your comfort zone, obeying His purpose for your life and experiencing His comfort — “how can they preach unless they are sent?” (Romans 10:15). God uses every person, every household and every oikos to get the job done. The chicken offers eggs for breakfast — a contribution; the pig offers bacon — a commitment. Which will it be?"
      ],
      scriptures: ["Matthew 28:18–20", "Acts 2:4", "Acts 1:8", "Hebrews 12:1", "Luke 10:1–9", "Romans 10:13–15", "Ecclesiastes 11:1–2"],
      reflect: [
        "Go through the six qualifications for the verb one by one. Which do you meet? Which is the next one to work on?",
        "Jesus chose His few with prayer and invested in them. Who are your six to eight? Who are your one or two?",
        "If your pastoral team made the three lists this month — leaders, apprentices, target — what would be on them?",
        "Contribution or commitment: what is your household’s part in world missions right now, and what would Faith Promise change?"
      ],
      quiz: [
        { q: "Mission is the commitment to…", c: ["overseas travel", "Every Person, Household, Oikos, Discipled", "church planting only", "a yearly convention"], a: 1 },
        { q: "Jesus’ mission statement, “Go and make disciples,” is given to…", c: ["the twelve apostles only", "pastors and missionaries", "every disciple", "the church board"], a: 2 },
        { q: "Which is NOT one of the six qualifications for the verb?", c: ["Empowered by the Holy Spirit", "Agrees with the vision of the local church", "Has a seminary degree", "Is willing to invest himself in others"], a: 2 },
        { q: "According to the seminar, the best way to make leaders is…", c: ["classroom lectures", "on-the-job training — just letting them do it", "reading books", "watching from a distance"], a: 1 },
        { q: "Jesus’ success rate with the twelve was…", c: ["50%", "75%", "91.67%", "100%"], a: 2 },
        { q: "In the few, the target group is…", c: ["one or two", "six to eight", "twelve", "as many as possible"], a: 1 },
        { q: "Who are the facilitators of mission match-making?", c: ["The small-group members", "The pastor and the pastoral team", "The district office", "The missionaries"], a: 1 },
        { q: "An affinity group is formed around…", c: ["the same age", "common interests and natural bonding", "the same street", "the same job"], a: 1 },
        { q: "Faith Promise is…", c: ["a one-time gift", "a set amount given each month for six or twelve months so everyone can have a part in the Great Commission", "the church’s general offering", "a loan to missionaries"], a: 1 }
      ],
      handout: { href: "handouts/seminar-12-mission-handout.pdf", pages: 3 }
    },
    {
      n: 13, group: "verb", title: "Mabuhay", vimeo: "795020173", minutes: 37,
      commitment: "Mabuhay is a commitment to welcome people and build relationships — the beginning of disciple making.",
      summary: "Welcome, and life: creating Mabuhay in the church, the small group and in between, the teachable moment, and the ten-step nurturing process for a new believer.",
      body: [
        "Mabuhay is a Tagalog word for welcome, and buhay means life (Psalm 46:4; John 7:38). Mabuhay is a commitment to welcome people, to build relationships, and for EPHODers to begin the disciple-making process. The goal is to create a warm welcome and relationship opportunities for every person, so that the nurturing process can begin. Names matter: Jesus looked up and said, “Zacchaeus, come down immediately. I must stay at your house today” (Luke 19:5). It takes time to build relationships.",
        "Mabuhay is created in the church, in the small group, and in between meetings. In the church: the pastor is coach and overseer, carrying the vision and the flock, arriving early to pray. The Jethro principle (Exodus 18:21–23) spreads the load — select capable, God-fearing, trustworthy people, as in Acts 6:3, and choose EPHODers. Greeters are caregivers before and after the service; ushers are caregivers during it; the first person to greet determines who you attract, and the last goodbye determines whether they return. The pastoral team debriefs weekly: what happened last week, what needs to change this week. In the small group: Believers Empowered Leadership Training (BELT) meetings and sectional debriefings for leaders; the leader and apprentice form the core of two or three, debriefing weekly in between to meet the needs of the group; and synergy — “where two or three come together in my name, there am I with them” (Matthew 18:20). In between meetings: creative follow-up — special occasions, hospital visits, calls and texts, cards, merienda — and Mabuhay events such as a Holy Week retreat, water baptisms, the church anniversary and Christmas.",
        "The EPHODer builds the relationship; the Holy Spirit prepares the teachable moment — the readiness to learn, as when Jesus asked at Caesarea Philippi, “Who do people say the Son of Man is?” (Matthew 16:13). Then the EPHODer begins the nurturing process with the new oikos. Like rice, a new believer is first soaked, then grown in a seedbed, then transplanted to the field to mature and be harvested.",
        "That seedbed is Empowered Living, ten steps for the new convert. Starting a new life (2 Corinthians 5:17): Step 1, I’m saved — empowered living starts with knowing you are saved (Romans 10:9); Step 2, Who am I — realising how God sees you (John 1:12). Leaving the past behind (John 8:32): Step 3, the Great Exchange — how God exchanges my past for a wonderful future (Galatians 5:1); Step 4, I want to break free — letting go of the past (Exodus 20:3–5). Taking hold of the future (Philippians 3:13–14): Step 5, Celebrate God’s wonderful future — water baptism and holy communion; Step 6, Tapping into the power — the Baptism in the Holy Spirit (Acts 2:4); Step 7, Grow and glow — the fruit of the Spirit; Step 8, Empowered to serve — understanding the gifts of the Spirit; Step 9, I have a destiny — embracing God’s purpose for my life (Romans 8:28–29); Step 10, Never alone again — discovering God’s plan for me in the local church (1 Corinthians 12:12–13). Then help them into EPHOD Defined — Purpose, Pattern, Plan, Process, Power — and the convert begins the Noun, and the Noun disciple begins the Verb. The course ends where it began, and now you are the one welcoming the next person in."
      ],
      scriptures: ["Psalm 46:4", "John 7:38", "Luke 19:1–10", "Exodus 18:21–23", "Acts 6:3", "Matthew 18:20", "Matthew 16:13", "2 Corinthians 5:17", "Romans 10:9", "Galatians 5:1", "Philippians 3:13–14", "Romans 8:28–29"],
      reflect: [
        "“The first person to greet determines who you attract; the last goodbye determines whether they return.” Who are those two people at your church, and are they EPHODers?",
        "Jesus called Zacchaeus by name and invited Himself to his house. Who could you call by name and visit this week?",
        "Think of a teachable moment you have seen the Holy Spirit prepare in someone. How did you know it was the moment?",
        "You have finished the thirteen seminars. Who is the first person you will take through Empowered Living — and when will you start?"
      ],
      quiz: [
        { q: "Mabuhay is a Tagalog word for…", c: ["goodbye", "welcome", "thank you", "peace"], a: 1 },
        { q: "Mabuhay is a commitment to welcome people, to build relationships, and for EPHODers to…", c: ["plan church events", "begin the disciple-making process", "collect the offering", "lead the singing"], a: 1 },
        { q: "The goal of Mabuhay is to create a warm welcome and relationship opportunities for every person to begin the ______ process.", c: ["membership", "nurturing", "budget", "building"], a: 1 },
        { q: "Mabuhay is created in the church, in the small group, and…", c: ["online", "in between meetings", "at conventions", "in Bible school"], a: 1 },
        { q: "Greeters are caregivers ______ the service; ushers are caregivers ______ the service.", c: ["during; after", "before and after; during", "after; before", "only before; only after"], a: 1 },
        { q: "The Jethro principle (Exodus 18) is about…", c: ["building a bigger tabernacle", "selecting capable, trustworthy people to share the load", "fasting forty days", "collecting the tithe"], a: 1 },
        { q: "Who prepares the “teachable moment”?", c: ["The pastor", "The small-group leader", "The Holy Spirit", "The new believer"], a: 2 },
        { q: "How many steps are in the Empowered Living nurturing process?", c: ["Five", "Eight", "Ten", "Twelve"], a: 2 },
        { q: "Step 6, “Tapping into the power,” is about…", c: ["water baptism", "the Baptism in the Holy Spirit", "tithing", "church membership"], a: 1 },
        { q: "After Empowered Living, the new convert is ready to begin…", c: ["leading a church", "the five P’s of EPHOD Defined", "Bible college", "the Verb seminars"], a: 1 }
      ],
      handout: { href: "handouts/seminar-13-mabuhay-handout.pdf", pages: 5 }
    }
  ]
};
