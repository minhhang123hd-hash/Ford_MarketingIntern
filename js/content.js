/* =========================================================================
   CONTENT.JS — All the words on this page live here.
   Edit freely: nothing here touches layout or animation code.
   Anything wrapped in [ ] is a placeholder you should replace.
   ========================================================================= */

const CANDIDATE = {
  name: "[Họ và tên của bạn]",
  role: "Business / Marketing Intern Candidate",
  program: "Ford Internship Program",
  location: "Hanoi, Vietnam",
  phone: "[Số điện thoại]",
  email: "[Địa chỉ email]",
  linkedin: "[Link LinkedIn / Portfolio]",
  // Put a real photo at assets/profile.jpg (square, min 600x600) and set this to true.
  useProfilePhoto: false,
};

/* Each wheel "click" = one stop of the steering wheel.
   Sequence carries real meaning here — it's the literal order the wheel
   rotates through — so numbering the stops is justified. */
const PANELS = [
  {
    id: "profile",
    stop: "01",
    gauge: "PROFILE",
    title: "Who's behind the wheel",
    body: `Final-year International Business student at Foreign Trade University
      (GPA 3.8/4.0) with hands-on experience across IMC planning, content
      creation, and cross-functional campaign execution for consumer and
      B2B brands. Proven track record of driving measurable growth
      through data-informed, insight-led communication — up to
      <strong>+225% audience growth</strong> and
      <strong>68K+ campaign views</strong>.`,
    stats: [
      { value: "3.8", label: "GPA / 4.0" },
      { value: "B2", label: "English" },
      { value: "HSK4", label: "Chinese" },
    ],
  },
  {
    id: "education",
    stop: "02",
    gauge: "EDUCATION",
    title: "Where the training happened",
    body: `Bachelor of International Business — Foreign Trade University (FTU),
      Sep 2023 – Sep 2027 (Expected). GPA 3.8/4.0, exceeding Ford's
      Business/HR track requirement of 3.0/4.0. Relevant coursework at
      4.0/4.0: Principles of Marketing, International Marketing, Branding
      in International Business, Communication in International Business,
      Business Data Analytics, Programming for Data Analytics &amp;
      Scientific Computing.`,
    stats: [
      { value: "3.8/4.0", label: "GPA" },
      { value: "2027", label: "Expected grad." },
      { value: "6", label: "Core courses at 4.0" },
    ],
  },
  {
    id: "experience",
    stop: "03",
    gauge: "EXPERIENCE",
    title: "Miles already on the odometer",
    body: `<strong>Marketing Intern, Sky Pacific Vietnam</strong> (Feb–Jun 2026) —
      led a team of 10 through a 6-month IMC plan; managed TikTok &amp;
      Facebook content execution; generated 68,920 content views and 46
      qualified leads.<br/><br/>
      <strong>Multimedia Lead, TEDxFTUHanoi 2025</strong> (Jun–Oct 2025) —
      scaled TikTok followers +225% (982 → 3,192), produced a 153.9K-view
      viral video, contributed to a sold-out 230-ticket event.<br/><br/>
      <strong>Vice Head of Communications, FTU Student Association</strong>
      (Aug 2024–Sep 2025) — coordinated media resources, reviewed brand
      standards, mentored successors, co-led university-wide recruitment.`,
    stats: [
      { value: "68.9K", label: "Content views" },
      { value: "+225%", label: "Audience growth" },
      { value: "46", label: "Qualified leads" },
    ],
  },
  {
    id: "skills",
    stop: "04",
    gauge: "SKILLS",
    title: "What's under the hood",
    body: `<strong>Marketing &amp; Growth</strong> — content creation &amp;
      campaign execution, market &amp; user research, creative briefing,
      IMC &amp; SMART objective planning.<br/><br/>
      <strong>Design &amp; Video</strong> — Canva, Photoshop, Illustrator,
      CapCut.<br/><br/>
      <strong>Tools &amp; Tech</strong> — Microsoft Office, Google
      Workspace, basic HTML / CSS / JavaScript, GitHub.<br/><br/>
      <strong>Soft skills</strong> — communication, leadership, teamwork,
      proactiveness, adaptability.`,
    stats: [
      { value: "IMC", label: "Planning" },
      { value: "4+", label: "Design tools" },
      { value: "HTML/CSS/JS", label: "Basic dev" },
    ],
  },
  {
    id: "achievements",
    stop: "05",
    gauge: "ACHIEVEMENTS",
    title: "The trophy shelf",
    body: `City-level "Student of 5 Merits" (2024–2025) · Top 32, IC Master:
      Master Communicator Contest (2026) · Top 5, CE Hackathon 2024
      (Circular Economy) · Runner-Up, Freshman Reportage Contest (2023) ·
      Co-author of 3 scientific research papers · SCG Scholarship
      (2024–2026) &amp; LOTTE Scholarship (2023–2024).<br/><br/>
      <strong>Volunteer Coordinator, FTU Blood Donation Day</strong> —
      directed a team of 20 volunteers, helping attract 200+ blood
      donors.`,
    stats: [
      { value: "6", label: "Awards & titles" },
      { value: "3", label: "Research papers" },
      { value: "20", label: "Volunteers led" },
    ],
  },
];

const END_SCREEN = {
  eyebrow: "END OF THE ROAD — FOR NOW",
  headline: "Let's put this on the road together.",
  body: `I'm not looking for a 12-month placeholder — I'm committing to twelve
    months of showing up, learning fast, and moving Ford's marketing
    forward the same way I moved every team I've led. If that's the kind
    of intern you're looking for, let's talk.`,
  cta: "Get in touch",
  commitment: "Committed to a full 12-month internship, starting whenever Ford needs me.",
};
