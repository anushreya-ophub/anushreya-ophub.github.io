/* All site content: every word, number, link and image slot.
   Source: "Anushreya – Resume (Business Analyst / Process Excellence)", Oct 2026.
   Every number here comes from the résumé — nothing invented. */
window.PORTFOLIO = {
  person: {
    name: 'Anushreya',
    headline: 'Business Analyst · Returns & Fraud Analytics · Process Automation',
    role: 'Assistant Manager, Project Management (Management Trainee)',
    company: 'AJIO, Reliance Retail Ltd.',
    location: 'Open to Bengaluru',
    email: 'ssanushreya@gmail.com',
    linkedin: 'https://www.linkedin.com/in/anushreya1306',
    linkedinLabel: 'linkedin.com/in/anushreya1306',
    resume: 'assets/resume/Anushreya-Resume.pdf',
    short: 'Business analyst at AJIO (Reliance Retail). Turns return and fraud data into driver-level root causes, quantified in percentage points — then automates the fix.',
    summary: 'Business analyst with 2+ years at AJIO (Reliance Retail), owning return KPI analytics (RTO/RVP) for a large fashion e-commerce platform. I turn operational data into driver-level root cause analysis, quantify impact in percentage points, and present the results in Monthly Business Reviews and to CXOs. I also use GenAI tools to automate manual workflows: my fraud order cancellation automation, built in Python with Claude Code, has cancelled ~₹3.5 Cr of high-risk orders in 4 months.'
  },

  /* Photos. null = not supplied yet: heroes and the series card fall back to the
     portrait; work photos fall back to the generated key art. */
  images: {
    portrait: 'assets/img/anushreya-portrait.jpg',
    heroWide: 'assets/img/hero-wide.jpg',
    heroCutout: false,
    heroMobile: 'assets/img/hero-mobile.jpg',
    poster: 'assets/img/hero-mobile.jpg',
    work: { presenting: null, whiteboard: null, laptop: null }
  },

  /* The "show" about her: Recruiter billboard, series card, trailer. */
  series: {
    key: 'series', title: 'Anushreya', type: 'Series', year: '2024 – Present', org: 'AJIO · Reliance Retail',
    metric: '2+ yrs', metricLabel: 'owning return KPI analytics (RTO/RVP) at AJIO',
    logline: 'Business analyst at AJIO (Reliance Retail). Turns return and fraud data into driver-level root causes, quantified in percentage points — then automates the fix.',
    points: [
      'Owns return KPI analytics (RTO/RVP) for a large fashion e-commerce platform at AJIO (Reliance Retail).',
      'Turns operational data into driver-level root cause analysis and quantifies impact in percentage points.',
      'Presents the results in Monthly Business Reviews (MBRs) and to CXOs.',
      'Built a fraud order cancellation automation in Python with Claude Code that has cancelled ~₹3.5 Cr of high-risk orders in 4 months.',
      'PGDM in Operations & Business Analytics — ranked 3rd in batch.'
    ],
    cast: ['SQL (Databricks)', 'Python', 'Claude Code', 'Tableau', 'Power BI', 'Excel'],
    genres: ['Returns Analytics', 'Fraud & Risk', 'Process Automation'],
    art: { motif: 'photo', photo: 'poster', font: 'display' }
  },

  titles: {
    'every-3-hours': {
      title: 'Every 3 Hours', type: 'Limited Series', year: '2026', org: 'AJIO', flag: 'New',
      genres: ['Fraud & Risk', 'Automation', 'Python'],
      metric: '₹3.5 Cr', metricLabel: 'high-risk orders cancelled in 4 months',
      logline: 'A fraud-cancellation bot that never sleeps. Rebuilt in Python with Claude Code, it has run every 3 hours since June 2026.',
      points: [
        'Extended and rebuilt the downstream Python automation (pandas, APIs, scheduler) for cancelling high-velocity fraud orders, using Claude Code (GenAI-assisted development).',
        'Running every 3 hours since Jun 2026: 2,500+ orders and 14,000+ line items processed across 200+ runs.',
        'Cancelled ~₹3.5 Cr of high-risk orders in 4 months.'
      ],
      cast: ['Python', 'pandas', 'APIs', 'Scheduler', 'Claude Code'],
      art: { motif: 'clock', c1: '#b20710', c2: '#140203', font: 'mono', photo: 'work.laptop' }
    },
    'fourteen-day-lag': {
      title: 'The 14-Day Lag', type: 'Docuseries', org: 'AJIO',
      genres: ['Returns Analytics', 'RCA'],
      metric: 'Weekly', metricLabel: 'RTO + RVP KPI review',
      logline: 'Returns tell their story two weeks late. A maturity-lagged driver framework that reads it on time, every week.',
      points: [
        'Owns the weekly return KPI review (RTO + RVP).',
        'Built a 14-day maturity-lagged driver framework in Databricks SQL and Python.',
        'Breaks down return movement by business unit, brand, pincode, COD/non-COD and return reason for MBR and CXO reviews.'
      ],
      cast: ['Databricks SQL', 'Python', 'MBR decks'],
      art: { motif: 'lag', c1: '#0b4a5e', c2: '#04131a', font: 'display' }
    },
    'mind-the-gap': {
      title: 'Mind the Gap', type: 'Mystery', org: 'AJIO',
      genres: ['Returns Analytics', 'RCA'],
      metric: '31.4% vs 26.17%', metricLabel: 'June returns vs plan target',
      logline: 'June returns landed at 31.4% against a 26.17% plan. The job: split the gap into controllable operational drivers, in percentage points.',
      points: [
        'Broke down the gap between June returns (31.4%) and the plan target (26.17%) into controllable operational drivers.',
        'Quantified each driver in percentage points: virtual RTO +0.44 pp, ageing pendency +0.18 pp, whitelist effects +0.10 pp.'
      ],
      cast: ['Databricks SQL', 'Python', 'Driver analysis'],
      art: { motif: 'gap', c1: '#9a4a14', c2: '#1c0b03', font: 'display', photo: 'work.presenting' }
    },
    'the-spike': {
      title: 'The Spike', type: 'Crime Thriller', org: 'AJIO',
      genres: ['RCA', 'COD Risk'],
      metric: '19% → 38%', metricLabel: 'brand RTO in one month',
      logline: 'A brand’s RTO doubled in a single month. Thirteen points of it led back to just four product options.',
      points: [
        'Diagnosed a brand RTO spike from 19% to 38% in one month.',
        'Traced +13 pp of it to 4 product options with surging COD orders.',
        'Those options were blocked.'
      ],
      cast: ['SQL', 'Option-level cuts', 'COD analysis'],
      art: { motif: 'spike', c1: '#8f0f1a', c2: '#190305', font: 'display' }
    },
    'pincode-zero': {
      title: 'Pincode Zero', type: 'Thriller', org: 'AJIO',
      genres: ['Fraud & Risk', 'Geo Analytics'],
      metric: '+2.0 of +2.4 pp', metricLabel: 'monthly platform RTO rise explained',
      logline: 'Platform RTO jumped 2.4 points in a month. Most of it traced back to newly emerging pincodes that ordered almost only on COD — and returned almost everything.',
      points: [
        'Identified newly emerging high-fraud pincodes — about 100% COD and 99% RTO.',
        'They were behind +2.0 pp of a +2.4 pp monthly rise in platform RTO.',
        'Recommended targeted COD blocks sized by revenue share and expected pp impact.'
      ],
      cast: ['SQL', 'Pincode analysis', 'COD rules'],
      art: { motif: 'pins', c1: '#3d1a70', c2: '#0b0517', font: 'display' }
    },
    'the-rulebook': {
      title: 'The Rulebook', type: 'Docuseries', org: 'AJIO',
      genres: ['Fraud & Risk', 'Data Quality'],
      metric: 'Kafka', metricLabel: 'sourced fraud-log data mart',
      logline: 'Which fraud rule fired, for which customer, at the moment of the order? A data mart that remembers — and protects genuine customers.',
      points: [
        'Co-designed a fraud-log data mart (Kafka source) that shows which Fraud Engine rule applied to a customer at the time of each order.',
        'Flagged upstream data-quality gaps that could wrongly block genuine customers.'
      ],
      cast: ['Kafka', 'Data mart design', 'Data quality'],
      art: { motif: 'log', c1: '#1d3d75', c2: '#060c1a', font: 'mono' }
    },
    'control-room': {
      title: 'Control Room', type: 'Series', org: 'AJIO',
      genres: ['Dashboards', 'Automation'],
      metric: '20+ KPIs', metricLabel: 'on the monitoring dashboard',
      logline: 'Approval rate, MTTA, P95 turnaround — one screen to watch the automation, and weekly reports that now run themselves.',
      points: [
        'Built a monitoring dashboard with 20+ KPIs (approval rate, MTTA, P95 turnaround).',
        'Migrated return dashboards to Databricks and automated recurring weekly reporting.'
      ],
      cast: ['Databricks', 'Dashboards', 'Python'],
      art: { motif: 'dash', c1: '#0f5636', c2: '#03130b', font: 'mono' }
    },
    'fit-paradox': {
      title: 'The Fit Paradox', type: 'Documentary', org: 'AJIO',
      genres: ['Customer Research', 'Catalog'],
      metric: '45%', metricLabel: 'got a different fit — though 90% checked the size chart',
      logline: '90% of customers checked the size chart. 45% still got a different fit. A documentary about why — and what changed.',
      points: [
        'Led a customer research project on returns: a Qualtrics survey with 309 responses, plus focus groups.',
        'Found that 45% of customers received a different fit despite 90% checking the size chart.',
        'Led to a PDP measuring guide, inward sizing & fit QC and a brand-ratings datamart.'
      ],
      cast: ['Qualtrics', 'Focus groups', 'Catalog QC'],
      art: { motif: 'fit', c1: '#8a2656', c2: '#1a0510', font: 'serif' }
    },
    'cutting-room': {
      title: 'The Cutting Room', type: 'Series', org: 'AJIO',
      genres: ['Catalog', 'Forecasting'],
      metric: '>60% RVP', metricLabel: 'options delisted every month',
      logline: 'Some options come back more often than they stay. Every month, they get cut.',
      points: [
        'Runs the monthly delisting of high-return options (over 60% RVP).',
        'Owns monthly return forecasts and the returns MBR decks.',
        'Works across Product, Tech, Catalog, Customer Care and Fraud teams.'
      ],
      cast: ['Forecasting', 'MBR storytelling', 'Stakeholder management'],
      art: { motif: 'cut', c1: '#7d5f0e', c2: '#171102', font: 'display' }
    },
    'one-click': {
      title: '8 Steps to One Click', type: 'Pilot', year: '2023', org: 'Writer Safeguard',
      genres: ['Process Mapping', 'Automation'],
      metric: '8 steps', metricLabel: 'manual, error-prone steps mapped and designed out',
      logline: 'A bank-client reporting process with eight manual, error-prone steps — redesigned around one click.',
      points: [
        'Summer Intern, Service Assurance (Report Operations) — Writer Business Services (Writer Safeguard), Mumbai · May – Jul 2023.',
        'Mapped the as-is discrepancy resolution and daily client reporting process for bank clients of a cash logistics company; found 8 manual, error-prone steps (repeated file downloads, manual checks, hand-drafted emails).',
        'Designed the to-be process: automated discrepancy checks, auto-alerts and escalation emails, a one-click report generation portal and a monitoring dashboard.',
        'Presented to senior management. Nominated for the Best Summer Internship Award; received a Letter of Recommendation.'
      ],
      cast: ['Process mapping', 'To-be design', 'Dashboards'],
      art: { motif: 'steps', c1: '#0e5a8a', c2: '#04121c', font: 'display', photo: 'work.whiteboard' }
    },
    'last-mile': {
      title: 'The Last Mile', type: 'Special', year: '2023', org: 'Rajasthan Patrika',
      genres: ['Logistics', 'Industry Project'],
      metric: 'LoR', metricLabel: 'Letter of Recommendation',
      logline: 'Getting the paper out on time: a third-party logistics pilot and a dynamic weekly delivery schedule.',
      points: [
        'Industry project with Rajasthan Patrika, Feb 2023.',
        'Proposed a third-party logistics pilot and a dynamic weekly delivery schedule to improve delivery timelines and reduce driver absenteeism.',
        'Received a Letter of Recommendation.'
      ],
      cast: ['3PL', 'Scheduling'],
      art: { motif: 'road', c1: '#7a3a0e', c2: '#160902', font: 'display' }
    },
    'rank-three': {
      title: 'Rank 3', type: 'Prequel', year: '2022–24', org: 'Universal Business School',
      genres: ['PGDM', 'Operations', 'Analytics'],
      metric: '3rd', metricLabel: 'in batch (academics)',
      logline: 'PGDM in Operations & Supply Chain with a Business Analytics minor — finished third in the batch.',
      points: [
        'Universal Business School, Mumbai — PGDM, Operations & Supply Chain (Major), Business Analytics (Minor), 2022 – 2024.',
        'Ranked 3rd in batch (academics) · CGPA 6.7/9.',
        'SMART Project Head (Societal Causes Management and Responsibility Training).',
        'Runner-up, table tennis, UBS Sports Club Olympics.'
      ],
      cast: ['Operations', 'Supply chain', 'Business analytics'],
      art: { motif: 'cap', c1: '#4a2a7a', c2: '#100820', font: 'serif' }
    },
    'origins': {
      title: 'Origins', type: 'Prequel', year: '2017–21', org: 'Amity University',
      genres: ['B.Tech', 'Biotechnology'],
      metric: '81.8%', metricLabel: 'B.Tech, Biotechnology',
      logline: 'Before the dashboards: a B.Tech in Biotechnology.',
      points: ['Amity University, Noida — B.Tech, Biotechnology, 2017 – 2021 · 81.8%.'],
      cast: ['Biotechnology'],
      art: { motif: 'dna', c1: '#0f5e4e', c2: '#03130f', font: 'serif' }
    },
    'green-belt': {
      title: 'Green Belt', type: 'Coming Soon', year: '2026', org: 'Lean Six Sigma',
      genres: ['Process Excellence', 'Certification'],
      metric: 'In progress', metricLabel: 'Lean Six Sigma Green Belt',
      logline: 'Lean Six Sigma Green Belt certification — in progress, 2026.',
      points: ['Lean Six Sigma Green Belt certification, in progress (2026).'],
      cast: ['Lean', 'Six Sigma', 'Process excellence'],
      art: { motif: 'bell', c1: '#2f6a14', c2: '#091503', font: 'display' }
    }
  },

  top10: [
    { value: '₹3.5 Cr', label: 'high-risk orders cancelled in 4 months', ref: 'every-3-hours' },
    { value: '+13 pp', label: 'of a brand RTO spike traced to 4 options', ref: 'the-spike' },
    { value: '+2.0 pp', label: 'of a +2.4 pp RTO rise traced to fraud pincodes', ref: 'pincode-zero' },
    { value: '2,500+', label: 'orders processed by the automation', ref: 'every-3-hours' },
    { value: '14,000+', label: 'line items across 200+ runs', ref: 'every-3-hours' },
    { value: '45%', label: 'got a different fit despite 90% checking the size chart', ref: 'fit-paradox' },
    { value: '309', label: 'survey responses, plus focus groups', ref: 'fit-paradox' },
    { value: '20+', label: 'KPIs on the monitoring dashboard', ref: 'control-room' },
    { value: '14-day', label: 'maturity-lagged driver framework', ref: 'fourteen-day-lag' },
    { value: '3rd', label: 'rank in PGDM batch', ref: 'rank-three' }
  ],

  /* The order journey strip: tagged steps open the title that covers them */
  journey: [
    { step: 'Order placed' },
    { step: 'Fraud check', tag: 'Fraud rules · Automation', ref: 'every-3-hours' },
    { step: 'Shipped' },
    { step: 'Delivered' },
    { step: 'Return / RTO', tag: 'RTO / RVP analytics', ref: 'fourteen-day-lag' },
    { step: 'Root cause', tag: 'RCA · MBRs', ref: 'mind-the-gap' },
    { step: 'Fix', tag: 'COD blocks · Delisting · Fit guide', ref: 'cutting-room' }
  ],

  skills: [
    { name: 'SQL', note: 'Databricks', group: 'Analytics & tools' },
    { name: 'Python', note: 'pandas · requests · scheduling', group: 'Analytics & tools' },
    { name: 'Claude Code', note: 'GenAI-assisted automation', group: 'Analytics & tools' },
    { name: 'AI-assisted SQL', note: 'GenAI tools', group: 'Analytics & tools' },
    { name: 'Tableau', note: 'Dashboards', group: 'Analytics & tools' },
    { name: 'Power BI', note: 'Dashboards', group: 'Analytics & tools' },
    { name: 'Excel', note: '& Google Sheets', group: 'Analytics & tools' },
    { name: 'Root cause analysis', note: 'Driver-level, in pp', group: 'Business' },
    { name: 'KPI design', note: 'Returns / RTO', group: 'Business' },
    { name: 'Fraud & COD risk rules', note: 'Risk', group: 'Business' },
    { name: 'Process mapping', note: 'Draw.io · Lucidchart', group: 'Business' },
    { name: 'MBR / CXO storytelling', note: 'Monthly reviews', group: 'Business' },
    { name: 'Qualtrics', note: 'Surveys', group: 'Research & workflow' },
    { name: 'Asana · Zoho', note: 'Workflow', group: 'Research & workflow' }
  ],

  /* Who's viewing: billboard title and row order per profile */
  profiles: [
    { id: 'recruiter', name: 'Recruiter', color: '#e50914', icon: 'briefcase', hero: 'series', rows: ['top10', 'returns', 'fraud', 'continue', 'earlier', 'skills'] },
    { id: 'manager', name: 'Hiring Manager', color: '#2b6fd6', icon: 'chart', hero: 'every-3-hours', rows: ['fraud', 'returns', 'top10', 'continue', 'skills', 'earlier'] },
    { id: 'analyst', name: 'Data Folks', color: '#d99a00', icon: 'code', hero: 'fourteen-day-lag', rows: ['returns', 'skills', 'fraud', 'top10', 'earlier', 'continue'] },
    { id: 'guest', name: 'Just Browsing', color: '#1f9d55', icon: 'popcorn', hero: 'fit-paradox', rows: ['top10', 'returns', 'fraud', 'earlier', 'continue', 'skills'] }
  ],
  rows: {
    top10: { title: 'Top 10 Results That Moved the Needle' },
    returns: { title: 'Case Files: Returns & RCA', items: ['fourteen-day-lag', 'mind-the-gap', 'the-spike', 'fit-paradox', 'cutting-room'] },
    fraud: { title: 'Fraud & Risk Thrillers', items: ['pincode-zero', 'every-3-hours', 'the-rulebook', 'control-room'] },
    continue: {
      title: 'Continue Watching for Anushreya',
      items: ['green-belt', 'series', 'every-3-hours'],
      notes: {
        'green-belt': 'Lean Six Sigma · in progress · 2026',
        series: 'Season 2 · AJIO · Jul 2024 – Present',
        'every-3-hours': 'Running every 3 hours since Jun 2026'
      },
      status: { 'green-belt': 'In transit', series: 'Active', 'every-3-hours': 'Live' }
    },
    earlier: { title: 'Earlier Seasons', items: ['one-click', 'last-mile', 'rank-three', 'origins'] },
    skills: { title: 'Cast & Crew: Tools and Skills' }
  },

  trailer: [
    { k: 'AJIO · Reliance Retail', t: 'Two years inside the returns data of a large fashion e-commerce platform.' },
    { k: 'The Spike', t: 'A brand’s RTO doubled in one month. 19% → 38%.' },
    { k: 'The Spike', t: '+13 pp of it came from just 4 product options.' },
    { k: 'Pincode Zero', t: 'New pincodes. ~100% COD. 99% RTO.' },
    { k: 'Every 3 Hours', t: 'A fraud bot, rebuilt with Claude Code. Running every 3 hours.' },
    { k: 'Every 3 Hours', t: '~₹3.5 Cr of high-risk orders. Cancelled in 4 months.' },
    { k: 'Anushreya', t: 'Business Analyst · Returns, Fraud & Automation', big: true }
  ],

  /* FAQ */
  faq: [
    { q: 'What do you do?', a: 'I’m a business analyst at AJIO (Reliance Retail). I own return KPI analytics (RTO/RVP), break return movement down into driver-level root causes quantified in percentage points, and present the results in Monthly Business Reviews and to CXOs.' },
    { q: 'What roles are you open to?', a: 'Business Analyst and Process Excellence roles across e-commerce operations, returns & fraud analytics and process automation — open to Bengaluru.' },
    { q: 'What’s your biggest win so far?', a: 'A fraud order cancellation automation, rebuilt in Python with Claude Code. Running every 3 hours since June 2026, it has processed 2,500+ orders and 14,000+ line items across 200+ runs, and cancelled ~₹3.5 Cr of high-risk orders.' },
    { q: 'Which tools do you use?', a: 'SQL (Databricks), Python (pandas, requests, scheduling), Claude Code and AI-assisted SQL, Tableau, Power BI, Excel and Google Sheets — plus Qualtrics, Draw.io, Lucidchart, Asana and Zoho.' },
    { q: 'Where did you study?', a: 'PGDM in Operations & Supply Chain with a Business Analytics minor from Universal Business School, Mumbai (ranked 3rd in batch), and a B.Tech in Biotechnology from Amity University, Noida.' },
    { q: 'How do I get in touch?', a: 'Email ssanushreya@gmail.com or connect on LinkedIn at linkedin.com/in/anushreya1306.' }
  ]
};
