/* ============================================================
   EPHOD Church Strengthening Seminars — course content.
   ------------------------------------------------------------
   This is the only file to edit to change the course:
   titles, descriptions, Scriptures, reflection questions,
   quiz questions and downloadable materials.

   Each seminar:
     n          seminar number (order matters — the course is taken in order)
     group      "defined" | "noun" | "verb"
     title      one word, as on the DVDs
     vimeo      Vimeo video id
     minutes    running time, whole minutes (0 = unknown yet)
     summary    one or two sentences for the course page card
     body       paragraphs for the lesson page (plain text, one per array item)
     scriptures key passages
     reflect    reflection / small-group questions
     quiz       multiple-choice questions; "a" is the index of the right answer
                (0-based). A seminar with an empty quiz can be completed without one.
     materials  downloads: { label, href } — leave empty until the notes arrive
     review     true = Claude drafted this from the video description only;
                Herb, Karen or KJ should read it before the course goes public.
   ============================================================ */
window.EPHOD_SEMINARS = {
  intro: { vimeo: "795072887", title: "Course introduction", minutes: 1 },
  passMark: 0.75, // share of quiz questions that must be right to pass
  groups: [
    { id: "defined", title: "EPHOD Defined", kicker: "Seminars 1–5", blurb: "What EPHOD is, where it comes from in Scripture, and how the whole course fits together." },
    { id: "noun",    title: "EPHOD the Noun — being a disciple", kicker: "Seminars 6–9", blurb: "A disciple is something you are. Four seminars on the life that makes a strong disciple: Magnify, Membership, Maturity and Ministry." },
    { id: "verb",    title: "EPHOD the Verb — making disciples", kicker: "Seminars 10–13", blurb: "To disciple is something you do. Four seminars on being released, guided and multiplied as a disciple maker: Monitor, Management, Mission and Mabuhay." }
  ],
  seminars: [
    {
      n: 1, group: "defined", title: "Purpose", vimeo: "794997783", minutes: 18,
      summary: "Why EPHOD exists: every person, household and oikos discipled, and the command of Jesus that drives it.",
      body: [
        "EPHOD stands for Every Person, Household, Oikos, Discipled. This opening seminar explains the purpose behind the name and behind the whole course.",
        "It begins in 1 Samuel 30, where David, facing the loss of everything at Ziklag, seeks the Lord's presence through the ephod and recovers all that had been taken. Jesus warned that the thief comes only to steal, kill and destroy; the purpose of EPHOD is recovery — people, families and whole networks of relationships brought back to God.",
        "The seminar closes with the command of Matthew 28:19, to go and make disciples of all nations, and asks what that command means for an ordinary believer and an ordinary church."
      ],
      scriptures: ["1 Samuel 30:7–8", "John 10:10", "Matthew 28:19–20"],
      reflect: [
        "David \"inquired of the Lord\" before he acted. When was the last time you sought God's direction before a decision, and what happened?",
        "What has the thief stolen in your community — in families, in young people, in the church? What would \"recovering all\" look like there?",
        "Who is in your oikos — the people naturally connected to you by family, work, school and neighbourhood? Write down ten names.",
        "Matthew 28:19 is a command, not a suggestion. What has kept you from treating it that way?"
      ],
      quiz: [
        { q: "What does EPHOD stand for?", c: ["Every Pastor Helping Other Disciples", "Every Person, Household, Oikos, Discipled", "Evangelism, Prayer, Holiness, Obedience, Devotion", "Equipping People for Holy Outreach Daily"], a: 1 },
        { q: "In 1 Samuel 30, what did David do before pursuing the raiders who had taken everything from Ziklag?", c: ["He gathered more soldiers", "He inquired of the Lord through the ephod", "He waited for the Philistines to help", "He sent spies ahead"], a: 1 },
        { q: "According to John 10:10, what does the thief come to do?", c: ["Test and refine", "Steal, kill and destroy", "Divide and conquer", "Deceive and delay"], a: 1 },
        { q: "Which command of Jesus is the foundation of the EPHOD purpose?", c: ["Love your neighbour as yourself", "Go and make disciples of all nations", "Feed my sheep", "Pray without ceasing"], a: 1 }
      ],
      materials: []
    },
    {
      n: 2, group: "defined", title: "Pattern", vimeo: "794998645", minutes: 16,
      summary: "The model, design and detailed instructions for making a disciple — \"according to the pattern shown you on the mountain.\"",
      body: [
        "When God told Moses to build the tabernacle he gave him a pattern and said, \"See to it that you make everything according to the pattern shown you on the mountain\" (Hebrews 8:5). The Pattern seminar takes that command and applies it to making disciples.",
        "The New Testament says that believers are now the temple of the Holy Spirit. God is still building according to a pattern, and the pattern is His Son: we are always in the process of being conformed to the image of Jesus (Romans 8:29).",
        "This seminar lays out the model, design and detailed instructions that the rest of the course follows, so that disciple making is done God's way rather than by trial and error."
      ],
      scriptures: ["Hebrews 8:5", "Exodus 25:9, 40", "1 Corinthians 6:19", "Romans 8:29"],
      reflect: [
        "Why do you think God insisted on an exact pattern for the tabernacle? What does that say about how He wants His church built?",
        "If believers are the temple of the Holy Spirit, what is being built in you right now, and what still needs work?",
        "Romans 8:29 says we are being conformed to the image of Jesus. Name one area where you have seen that happen in the past year.",
        "Where has your church's discipleship been \"trial and error\" rather than following a pattern?"
      ],
      quiz: [
        { q: "Hebrews 8:5 repeats a command God first gave to whom?", c: ["David, for the temple", "Moses, for the tabernacle", "Noah, for the ark", "Solomon, for the palace"], a: 1 },
        { q: "According to the New Testament, who or what is the temple of the Holy Spirit today?", c: ["The church building", "The city of Jerusalem", "Believers themselves", "The priests only"], a: 2 },
        { q: "Romans 8:29 says believers are being conformed to what?", c: ["The pattern of this world", "The law of Moses", "The image of God's Son", "The traditions of the elders"], a: 2 },
        { q: "What does the Pattern seminar provide for the rest of the course?", c: ["A list of church programmes to run", "The model, design and detailed instructions for making a disciple", "A fundraising plan", "A history of the Assemblies of God"], a: 1 }
      ],
      materials: []
    },
    {
      n: 3, group: "defined", title: "Plan", vimeo: "794999431", minutes: 18,
      summary: "A first look at the EPHOD 10 Point Plan — a daily lifestyle that reflects the life of Jesus and finds God's will for yours.",
      body: [
        "The Plan seminar introduces the EPHOD 10 Point Plan, which is taught in full in the Maturity seminar. The plan is a set of ten daily and weekly habits that together build a lifestyle reflecting the life of Jesus (John 8:31).",
        "The plan has two aims: to help you continue in the Word so that your life looks more and more like His, and to help you find God's specific, personal will for your life — with daily guidance for carrying it out.",
        "At the heart of the plan is daily Bible reading. The reading guide EPHOD uses comes from the Full Life Study Bible and is used by permission of Life Publishers International; it is the same plan you will find on this website and in the EPHOD apps."
      ],
      scriptures: ["John 8:31–32", "Psalm 1:1–3", "Romans 12:1–2", "Joshua 1:8"],
      reflect: [
        "Jesus said, \"If you hold to my teaching, you are really my disciples.\" What does \"holding to\" His teaching look like on an ordinary Tuesday?",
        "Which of the ten points do you already practise? Which one would make the biggest difference if you started this week?",
        "How do you currently try to discern God's will for your life? How might a daily plan change that?",
        "Who could you invite to follow the reading plan with you, starting tomorrow?"
      ],
      quiz: [
        { q: "How many points are in the EPHOD plan?", c: ["Five", "Seven", "Ten", "Twelve"], a: 2 },
        { q: "Which verse does the 10 Point Plan build on — \"If you hold to my teaching, you are really my disciples\"?", c: ["John 3:16", "John 8:31", "Matthew 5:16", "Acts 2:42"], a: 1 },
        { q: "Where does the EPHOD daily reading guide come from?", c: ["The Full Life Study Bible (Life Publishers International)", "The Book of Common Prayer", "A plan written by the Johnsons from scratch", "The YouVersion app"], a: 0 },
        { q: "Besides building a Christlike lifestyle, what is the plan's second aim?", c: ["To raise money for missions", "To help you find and carry out God's personal will for your life", "To prepare you for ordination", "To memorise the whole New Testament"], a: 1 }
      ],
      materials: []
    },
    {
      n: 4, group: "defined", title: "Process", vimeo: "795000283", minutes: 28,
      summary: "A preview of the four Noun and four Verb seminars, and how they connect — explained with a baseball diamond.",
      body: [
        "The Process seminar previews the eight teaching seminars that follow: the four Noun seminars on being a disciple (Magnify, Membership, Maturity, Ministry) and the four Verb seminars on making disciples (Monitor, Management, Mission, Mabuhay).",
        "It uses the picture of a baseball diamond to show how the seminars connect. A player has to touch every base, in order, to score; a disciple moves through each stage in order to become a well-rounded team player who can bring others home.",
        "By the end of this seminar you will know the shape of the whole EPHOD process and where each later seminar fits."
      ],
      scriptures: ["Ephesians 4:11–16", "2 Timothy 2:2", "Colossians 1:28–29"],
      reflect: [
        "Why does order matter in a process like this? What happens to a church that tries to send people out (the Verb) before they are grounded (the Noun)?",
        "Which base are you on right now? Be honest about it with your group.",
        "Paul told Timothy to entrust the teaching to reliable people who would teach others. How many generations deep has discipleship gone in your church?",
        "What would it take for your church to become a \"team\" in the sense this seminar describes?"
      ],
      quiz: [
        { q: "How many Noun seminars and how many Verb seminars are there?", c: ["Two and two", "Three and three", "Four and four", "Five and five"], a: 2 },
        { q: "What picture does the Process seminar use to show how the seminars connect?", c: ["A ladder", "A baseball diamond", "A tree", "A road map"], a: 1 },
        { q: "The Noun seminars are about…", c: ["being a disciple", "church finance", "making disciples", "world missions"], a: 0 },
        { q: "The Verb seminars are about…", c: ["being a disciple", "making disciples", "Bible translation", "church history"], a: 1 }
      ],
      materials: []
    },
    {
      n: 5, group: "defined", title: "Power", vimeo: "850700923", minutes: 36, review: true,
      summary: "The power behind the process: the Holy Spirit, without whom no plan or pattern can make a disciple.",
      body: [
        "A pattern and a plan are not enough on their own. The Power seminar turns to the One who makes discipleship possible — the Holy Spirit, promised by Jesus to His followers before He sent them out.",
        "\"You will receive power when the Holy Spirit comes on you; and you will be my witnesses\" (Acts 1:8). The power to live the EPHOD lifestyle, and the power to bring others into it, is the same power that filled the first disciples.",
        "This seminar completes the EPHOD Defined section and prepares you for the four Noun seminars that follow."
      ],
      scriptures: ["Acts 1:8", "Zechariah 4:6", "Luke 24:49", "Ephesians 5:18"],
      reflect: [
        "Jesus told the disciples to wait for power before they went. Where are you tempted to go without waiting?",
        "\"Not by might nor by power, but by my Spirit.\" Where have you been relying on your own strength in ministry or in your walk with God?",
        "Describe a time you knew the Holy Spirit was at work through you. What was different about it?",
        "How does your small group make room for the Holy Spirit when it meets?"
      ],
      quiz: [
        { q: "According to Acts 1:8, what happens when the Holy Spirit comes on believers?", c: ["They receive power and become witnesses", "They are excused from witnessing", "They become church leaders", "They receive wealth"], a: 0 },
        { q: "Zechariah 4:6 says the work is done \"not by might nor by power, but by…\"", c: ["my prophets", "my Spirit", "my law", "my angels"], a: 1 },
        { q: "Where does the Power seminar sit in the course?", c: ["It is the first seminar", "It is the last of the EPHOD Defined seminars", "It is the first Verb seminar", "It is the last seminar in the course"], a: 1 }
      ],
      materials: []
    },
    {
      n: 6, group: "noun", title: "Magnify", vimeo: "850739922", minutes: 49, review: true,
      summary: "The first mark of a disciple: a life that magnifies the Lord in worship, prayer and daily devotion.",
      body: [
        "The Noun seminars describe what a disciple is. The first and foundational mark is worship: \"Glorify the Lord with me; let us exalt his name together\" (Psalm 34:3). A disciple is someone whose life makes God look as great as He is.",
        "Magnify covers the personal and corporate worship of a disciple — daily prayer and worship time, giving thanks, and gathering with God's people to exalt His name — the habits from the 10 Point Plan that keep God at the centre.",
        "Everything else in the EPHOD process flows out of this: people who magnify the Lord become people who want to belong, to grow and to serve."
      ],
      scriptures: ["Psalm 34:1–3", "Luke 1:46–47", "John 4:23–24", "Psalm 100"],
      reflect: [
        "What does it mean, practically, to \"magnify\" the Lord? How is that different from simply singing about Him?",
        "When is your daily prayer and worship time, and what gets in the way of it?",
        "Mary said, \"My soul magnifies the Lord.\" What in your life right now causes you to magnify Him? What causes you to shrink Him?",
        "How could your household begin to worship together this week?"
      ],
      quiz: [
        { q: "Magnify is the first of which group of seminars?", c: ["EPHOD Defined", "The Noun seminars (being a disciple)", "The Verb seminars (making disciples)", "The leadership seminars"], a: 1 },
        { q: "Psalm 34:3 says, \"Glorify the Lord with me; let us…\"", c: ["build his house", "exalt his name together", "keep his commandments", "go into all the world"], a: 1 },
        { q: "Which points of the 10 Point Plan belong most closely to Magnify?", c: ["Tithes and offerings", "Daily prayer and worship time; Sunday worship", "Taking notes in services", "Sharing and witnessing"], a: 1 }
      ],
      materials: []
    },
    {
      n: 7, group: "noun", title: "Membership", vimeo: "850891875", minutes: 45, review: true,
      summary: "A disciple belongs: committed membership in a local church body and in a weekly small group.",
      body: [
        "A disciple is not a lone believer. The second Noun seminar, Membership, teaches that every follower of Jesus is placed by God into a body — the local church — and is meant to belong to it in a real, committed way (1 Corinthians 12:27).",
        "Membership covers the believer's place in Sunday worship, Sunday school and especially the weekly care cell or small group, where discipleship actually happens (Mark 6:39). It also addresses commitment, faithfulness and the mutual care that marks members of one body.",
        "The seminar connects directly to the 10 Point Plan habits of Sunday school and worship attendance and weekly small-group membership."
      ],
      scriptures: ["1 Corinthians 12:12–27", "Hebrews 10:24–25", "Acts 2:42–47", "Mark 6:39–40"],
      reflect: [
        "Paul says, \"Now you are the body of Christ, and each one of you is a part of it.\" What part are you, and does your church know it?",
        "Why did Jesus seat the crowd in groups of hundreds and fifties before He fed them? What does that teach about small groups?",
        "Hebrews 10:25 warns against giving up meeting together. What has pulled people in your church away from meeting?",
        "Who in your small group needs to be cared for this week, and what will you do about it?"
      ],
      quiz: [
        { q: "According to 1 Corinthians 12:27, believers together are…", c: ["an audience", "the body of Christ", "a club", "a committee"], a: 1 },
        { q: "Where does EPHOD say discipleship most effectively happens?", c: ["In large crusades", "In weekly small groups or care cells", "On television", "In seminary"], a: 1 },
        { q: "Hebrews 10:24–25 tells believers not to give up…", c: ["fasting", "tithing", "meeting together", "travelling"], a: 2 }
      ],
      materials: []
    },
    {
      n: 8, group: "noun", title: "Maturity", vimeo: "795008748", minutes: 54,
      summary: "The full EPHOD 10 Point Plan — ten spiritual lifestyles that together build a strong, faithful Christian.",
      body: [
        "Maturity is the heart of the course. It presents the EPHOD 10 Point Plan in full: ten spiritual habits that, practised together, build a strong and faithful Christian. Each point develops a specific lifestyle that strengthens the individual disciple, the local church and the wider community.",
        "The ten points: daily Bible reading (morning and evening); weekly Scripture memorisation; Sunday school and worship; a weekly care cell or small group; a devotional journal; praying and fasting one meal a week; sharing and witnessing; tithes and offerings; a daily prayer and worship time; and taking notes in services.",
        "Everything on this website — the Morning and Evening Passages, the weekly memory verse, the Gold Nugget and the devotions — exists to help you keep this plan every day."
      ],
      scriptures: ["John 8:31–32", "Ephesians 4:13–15", "Hebrews 5:12–14", "2 Peter 3:18"],
      reflect: [
        "Go through the ten points one by one. Give yourself an honest mark out of ten for each. Which two will you work on first?",
        "Why do you think these ten were chosen? Is there one you don't yet understand the purpose of?",
        "Ephesians 4:13 speaks of \"attaining to the whole measure of the fullness of Christ.\" How is maturity different from simply knowing a lot?",
        "Which point would you find hardest to keep for a whole year? Who could hold you accountable for it?"
      ],
      quiz: [
        { q: "How often does the plan call for Scripture memorisation?", c: ["Daily", "Weekly", "Monthly", "Only at seminars"], a: 1 },
        { q: "The plan asks you to pray and fast…", c: ["for a week each year", "one meal a week", "every Friday all day", "only during Lent"], a: 1 },
        { q: "Which of these is NOT one of the ten points?", c: ["Keeping a devotional journal", "Taking notes in services", "Running a church website", "Tithes and offerings"], a: 2 },
        { q: "What does daily Bible reading in the plan look like?", c: ["One verse a day", "A morning passage and an evening passage, through the whole Bible in a year", "The Gospels only", "Whatever you choose each day"], a: 1 },
        { q: "The 10 Point Plan strengthens…", c: ["only the pastor", "only the individual", "the individual, the church and the wider community", "only new believers"], a: 2 }
      ],
      materials: []
    },
    {
      n: 9, group: "noun", title: "Ministry", vimeo: "795011499", minutes: 46,
      summary: "Every disciple is a minister: discovering your God-given gifts and being released by church leaders into works of service.",
      body: [
        "Ministry is using the gifts God has given you to serve others. Ephesians 4:11–12 says the gifts Christ gave to the church exist to prepare God's people for works of service — every person, not only the pastor.",
        "The seminar offers five evaluation tools to help a disciple discern God's will and recognise where they are gifted and called. It then shows how church leaders can take what they learn and deploy each person into service.",
        "Ministry completes the four Noun seminars: a disciple who magnifies the Lord, belongs to the body and is maturing in the Word is ready to be released to serve."
      ],
      scriptures: ["Ephesians 4:11–12", "1 Peter 4:10–11", "Romans 12:4–8", "1 Corinthians 12:4–7"],
      reflect: [
        "Ephesians 4:12 says leaders exist \"to prepare God's people for works of service.\" In your church, who does the ministry — the few or the many?",
        "What has God gifted you to do? How do you know? What do others say about you?",
        "Peter says each of us should use whatever gift we have received to serve others. Where are you serving now, and where might God be moving you?",
        "What stops churches from releasing people into ministry? What would help your leaders do it?"
      ],
      quiz: [
        { q: "According to Ephesians 4:11–12, why did Christ give apostles, prophets, evangelists, pastors and teachers to the church?", c: ["To run the church for everyone else", "To prepare God's people for works of service", "To collect offerings", "To judge disputes"], a: 1 },
        { q: "How many evaluation tools does the Ministry seminar give for discerning God's will?", c: ["Two", "Three", "Five", "Ten"], a: 2 },
        { q: "Who does EPHOD say is called to ministry?", c: ["Ordained pastors only", "Every disciple", "Missionaries only", "People with a theology degree"], a: 1 },
        { q: "After a disciple's gifts are recognised, what do church leaders do?", c: ["Wait for them to volunteer", "Deploy them into service", "Send them to Bible college", "Nothing further"], a: 1 }
      ],
      materials: []
    },
    {
      n: 10, group: "verb", title: "Monitor", vimeo: "795014039", minutes: 68,
      summary: "Finishing strong: the guidance system for a believer released into ministry — accountability and four integrity principles.",
      body: [
        "Monitor is the first Verb seminar. Once a believer has been released into ministry, what keeps them on course? This seminar is about finishing strong — a guidance system for the disciple who is now preparing to become a disciple maker.",
        "It covers accountability and four integrity principles that protect the unity of the Body of Christ: integrity of vision, integrity of doctrine, integrity of finance and integrity of morals.",
        "Monitor is the longest seminar in the course, and for good reason: more ministries are lost to a lack of monitoring than to a lack of gifting."
      ],
      scriptures: ["2 Timothy 4:7", "Ephesians 4:3", "Proverbs 27:17", "1 Timothy 4:16", "Hebrews 13:17"],
      reflect: [
        "Paul could say, \"I have finished the race, I have kept the faith.\" What would make it hard for you to say that at the end?",
        "Take the four integrity principles one at a time — vision, doctrine, finance, morals. Which one is the weakest point in ministries you have seen fall?",
        "Who are you accountable to right now? Could they ask you anything?",
        "What would a healthy monitoring relationship between a pastor and a small-group leader look like in your church?"
      ],
      quiz: [
        { q: "Monitor is the first seminar in which group?", c: ["EPHOD Defined", "The Noun seminars", "The Verb seminars", "The appendix"], a: 2 },
        { q: "Which of these is NOT one of the four integrity principles?", c: ["Vision", "Doctrine", "Popularity", "Finance"], a: 2 },
        { q: "What is the purpose of the guidance system described in Monitor?", c: ["To keep people from ministering", "To help a released believer finish strong and become a disciple maker", "To track attendance", "To choose a new pastor"], a: 1 },
        { q: "The four integrity principles protect what?", c: ["The church budget", "The unity of the Body of Christ", "The pastor's reputation", "The building"], a: 1 }
      ],
      materials: []
    },
    {
      n: 11, group: "verb", title: "Management", vimeo: "795017609", minutes: 0,
      summary: "Making disciples is shared work: developing Spirit-filled leaders who multiply, around a four-part Leadership Base.",
      body: [
        "Management means committing yourself to the guidance of the Holy Spirit and of the pastoral team. \"I planted the seed, Apollos watered it, but God has been making it grow\" (1 Corinthians 3:6). No one makes a disciple alone.",
        "The seminar shows how to develop Spirit-filled leaders who can multiply, built around a four-part Leadership Base: Vision, Role, Reproduction and Progression. Leaders keep cycling through these bases, bringing a new group with them each time round.",
        "The seminars can be completed online individually and then discussed together in a small group — which is exactly how this course is designed to be used."
      ],
      scriptures: ["1 Corinthians 3:5–9", "2 Timothy 2:2", "Exodus 18:17–23", "Acts 6:1–7"],
      reflect: [
        "\"I planted, Apollos watered, but God gave the increase.\" Whose planting and watering made you who you are? Have you thanked them?",
        "Vision, Role, Reproduction, Progression: which base is your church strongest on, and which is missing?",
        "Jethro told Moses, \"What you are doing is not good… you cannot handle it alone.\" Where is a leader you know carrying too much alone?",
        "Who are you bringing with you round the bases? If the answer is no one, what is the first step?"
      ],
      quiz: [
        { q: "1 Corinthians 3:6 says: \"I planted, Apollos watered, but…\"", c: ["the church prayed", "God gave the increase", "the elders decided", "the people gave"], a: 1 },
        { q: "What are the four parts of the Leadership Base?", c: ["Prayer, Praise, Preaching, Prophecy", "Vision, Role, Reproduction, Progression", "Plan, Pattern, Process, Power", "Teach, Train, Test, Trust"], a: 1 },
        { q: "What does a leader bring with them each time they cycle through the bases?", c: ["A larger offering", "A new group of disciples", "A new building project", "A written report"], a: 1 },
        { q: "How does EPHOD suggest the seminars be used?", c: ["Watched alone and never discussed", "Completed online individually, then discussed in a small group", "Only taught by Herb and Karen in person", "Read as a book"], a: 1 }
      ],
      materials: []
    },
    {
      n: 12, group: "verb", title: "Mission", vimeo: "795018843", minutes: 32,
      summary: "Committing to disciple every person, household and oikos — organising small groups that follow Jesus' own mission pattern, and taking part in world missions.",
      body: [
        "Mission is the commitment to disciple every person, their household and their oikos — the wider circle of relationships God has placed around them. The seminar starts with Jesus' own mission pattern and shows how to organise discipleship small groups that follow it.",
        "It walks through how new leaders are matched with their target groups, how those groups go through the discipleship process and choose an apprentice, and how they prepare to multiply.",
        "The final section shows how people of every age can take part in world missions through prayer and giving, with the Annual World Mission Convention and Faith Promise as key tools."
      ],
      scriptures: ["Matthew 28:18–20", "Acts 1:8", "Acts 16:31–34", "Luke 10:1–9", "Romans 10:13–15"],
      reflect: [
        "The jailer in Acts 16 believed \"he and his whole household.\" Which households in your oikos could come to Christ together?",
        "Describe the mission pattern of Jesus as you understand it from the Gospels. How closely does your small group follow it?",
        "Does your group have an apprentice — someone being prepared to lead the next group? If not, who could it be?",
        "What is your part in world missions? How could Faith Promise giving become part of your household's lifestyle?"
      ],
      quiz: [
        { q: "In EPHOD, \"oikos\" refers to…", c: ["a church building", "a person's wider circle of relationships", "a Greek island", "a type of offering"], a: 1 },
        { q: "What does each discipleship small group select as it goes through the process?", c: ["A treasurer", "An apprentice who will lead the next group", "A building", "A choir"], a: 1 },
        { q: "Which two tools does the Mission seminar name for involving everyone in world missions?", c: ["Bake sales and raffles", "The Annual World Mission Convention and Faith Promise", "Radio and television", "Crusades and camps"], a: 1 },
        { q: "What is the end goal of a discipleship small group in the Mission seminar?", c: ["To grow as large as possible", "To multiply into new groups", "To replace the Sunday service", "To close after one year"], a: 1 }
      ],
      materials: []
    },
    {
      n: 13, group: "verb", title: "Mabuhay", vimeo: "795020173", minutes: 37,
      summary: "Welcome, and life: building relationships, nurturing new believers and starting the next person on the EPHOD journey.",
      body: [
        "Mabuhay is a Filipino word that means both \"welcome\" and \"life.\" The final seminar is about building the relationships through which disciple making begins — welcoming people in the church, in the small group and in the ordinary meetings in between.",
        "It covers nurturing new converts from their first days and preparing them, in turn, to take others through the EPHOD process. The course ends where it began: with every person, household and oikos discipled — and now you are the one doing the discipling.",
        "When you have completed this seminar, your certificate of completion is ready to print from the course page."
      ],
      scriptures: ["Romans 15:7", "John 13:34–35", "1 Thessalonians 2:7–8", "Luke 19:5–10"],
      reflect: [
        "\"Accept one another, then, just as Christ accepted you.\" How were you welcomed when you first came to Christ or to your church? What did it do for you?",
        "Jesus invited Himself to Zacchaeus's house. Who could you welcome into your home this month?",
        "Paul shared \"not only the gospel but our lives as well.\" What would sharing your life, not just your words, look like with a new believer?",
        "You have finished the thirteen seminars. Who will you take through them next, and when will you start?"
      ],
      quiz: [
        { q: "What does \"Mabuhay\" mean?", c: ["Goodbye", "Welcome, and life", "Thank you", "Peace"], a: 1 },
        { q: "Where does the Mabuhay seminar say welcoming happens?", c: ["Only at the church door", "In the church, in small groups and in meetings in between", "Only in the home", "Only at special events"], a: 1 },
        { q: "What is a new convert being prepared for, according to Mabuhay?", c: ["Church membership class only", "To take others through the EPHOD process", "Water baptism only", "A leadership title"], a: 1 },
        { q: "With which seminar does the EPHOD course end?", c: ["Mission", "Monitor", "Mabuhay", "Maturity"], a: 2 }
      ],
      materials: []
    }
  ]
};
