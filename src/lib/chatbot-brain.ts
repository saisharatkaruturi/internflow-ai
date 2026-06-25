// AI assistant brain — pure functions, no React. Easy to test and reason about.

export type Mode = "interview" | "support" | "advice";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: Mode;
  /** Marks structured payloads like mock interview questions so they can be rendered differently. */
  kind?: "text" | "interview-q" | "interview-feedback" | "resume-review" | "verification";
  /** Optional structured data for special message kinds. */
  meta?: Record<string, unknown>;
}

export const MODE_LABEL: Record<Mode, string> = {
  interview: "Mock Interview",
  support: "Support",
  advice: "Resume Tips",
};

const WELCOME: ChatMessage = {
  id: "welcome",
  text: "Hi! I'm InternGuard AI. I can run a full mock interview with feedback, review your resume bullet by bullet, or help you verify a suspicious listing. What would you like to do?",
  sender: "bot",
  timestamp: new Date(),
  type: "support",
};

// ---------- Mock interview flow ----------

export type InterviewRole =
  | "frontend"
  | "backend"
  | "data-science"
  | "product"
  | "design";

export interface InterviewQuestion {
  prompt: string;
  /** Words/phrases we look for in the candidate's answer. */
  keywords: string[];
  /** Friendly STAR-method hint shown alongside the prompt. */
  hint: string;
}

export const INTERVIEW_QUESTIONS: Record<InterviewRole, InterviewQuestion[]> = {
  frontend: [
    {
      prompt: "Walk me through a React component you built from scratch. What was the trickiest bug and how did you fix it?",
      keywords: ["component", "state", "props", "hook", "render", "bug", "fix", "debug"],
      hint: "Use STAR: Situation → Task → Action → Result.",
    },
    {
      prompt: "How would you optimise a React app that re-renders on every keystroke in a search input?",
      keywords: ["debounce", "throttle", "memo", "usememo", "usecallback", "state", "split", "selector"],
      hint: "Mention debouncing, memoisation, and state location.",
    },
    {
      prompt: "Explain the difference between controlled and uncontrolled inputs in React. When would you pick each?",
      keywords: ["value", "onchange", "ref", "dom", "state", "form", "validation"],
      hint: "Compare value/onChange vs defaultValue + ref. When validation matters.",
    },
    {
      prompt: "How do you ensure your CSS doesn't break across browsers?",
      keywords: ["reset", "normalize", "flexbox", "grid", "caniuse", "fallback", "prefix", "test"],
      hint: "Tooling, resets, vendor prefixes, cross-browser testing.",
    },
    {
      prompt: "Tell me about a time you had to learn a new library quickly for a deadline.",
      keywords: ["learn", "docs", "example", "mentor", "prototype", "deadline", "ship"],
      hint: "Show how you ramped up, what you shipped, and what you'd do differently.",
    },
  ],
  backend: [
    {
      prompt: "Design a URL shortener like bit.ly. Walk me through the API, the data model, and how you'd handle 10k writes/sec.",
      keywords: ["hash", "base62", "database", "cache", "redis", "shard", "rate"],
      hint: "Mention hashing, a SQL/NoSQL store, caching hot links, and sharding.",
    },
    {
      prompt: "How would you debug a sudden spike in p99 latency for one of our services?",
      keywords: ["metric", "trace", "log", "profil", "slow", "query", "db", "cache"],
      hint: "Tracing, slow query log, recent deploys, downstream health.",
    },
    {
      prompt: "Explain the difference between authentication and authorisation with an example.",
      keywords: ["auth", "permission", "role", "token", "session", "rbac"],
      hint: "Who you are vs what you can do.",
    },
    {
      prompt: "When would you pick SQL over NoSQL? Give a concrete example.",
      keywords: ["relational", "transaction", "join", "schema", "scale", "consistency"],
      hint: "Strong consistency, joins, schema stability vs flexible schema, horizontal scale.",
    },
    {
      prompt: "Tell me about a time you had to design for failure.",
      keywords: ["retry", "circuit", "fallback", "queue", "fail", "graceful", "redundan"],
      hint: "Retries, circuit breakers, queues, graceful degradation.",
    },
  ],
  "data-science": [
    {
      prompt: "How would you detect class imbalance in a dataset and what techniques would you use to address it?",
      keywords: ["smote", "undersample", "oversample", "class weight", "f1", "roc"],
      hint: "Mention SMOTE, class weights, F1 vs accuracy trade-off.",
    },
    {
      prompt: "Walk me through how you'd evaluate a churn-prediction model end-to-end.",
      keywords: ["train", "test", "validation", "metric", "auc", "lift", "calibrat"],
      hint: "Train/test split, AUC, precision-recall, business lift.",
    },
    {
      prompt: "Explain bias-variance tradeoff in plain English.",
      keywords: ["overfit", "underfit", "complex", "data", "regulariz", "generaliz"],
      hint: "Underfit vs overfit, regularisation, more data.",
    },
    {
      prompt: "How do you decide between a tree-based model and a linear model for a new problem?",
      keywords: ["linear", "tree", "feature", "interpret", "nonlinear", "scale"],
      hint: "Linearity assumption, feature interactions, interpretability.",
    },
    {
      prompt: "Describe a project where your model worked in the lab but failed in production.",
      keywords: ["drift", "shift", "data", "monitor", "retrain", "label", "pipeline"],
      hint: "Distribution shift, monitoring, retraining cadence.",
    },
  ],
  product: [
    {
      prompt: "How would you prioritise features for a 0-to-1 product with no users yet?",
      keywords: ["customer", "interview", "hypothesis", "mvp", "metric", "experiment"],
      hint: "User interviews, hypothesis, MVP, success metric.",
    },
    {
      prompt: "Tell me about a product you love and what you'd change about it.",
      keywords: ["user", "problem", "data", "metric", "ship", "experiment"],
      hint: "Pick something concrete; identify the user pain and your hypothesis.",
    },
    {
      prompt: "How do you decide whether a feature has succeeded?",
      keywords: ["metric", "kpi", "north star", "baseline", "goal", "experiment"],
      hint: "Define the metric and baseline first; A/B if possible.",
    },
    {
      prompt: "A key metric drops 15% week over week. Walk me through your investigation.",
      keywords: ["funnel", "segment", "cohort", "release", "experiment", "external"],
      hint: "Funnel decomposition, cohort, recent releases, external events.",
    },
    {
      prompt: "Describe a time you disagreed with an engineer about scope. What did you do?",
      keywords: ["data", "user", "compromise", "scope", "stakeholder", "align"],
      hint: "Show how you used data + user impact to align.",
    },
  ],
  design: [
    {
      prompt: "Walk me through your design process for a recent project.",
      keywords: ["research", "persona", "wireframe", "prototype", "test", "iter"],
      hint: "Research → IA → wireframes → prototypes → test.",
    },
    {
      prompt: "How do you balance user needs with business goals?",
      keywords: ["user", "business", "metric", "experiment", "tradeoff", "stakeholder"],
      hint: "User value × business value; success metric alignment.",
    },
    {
      prompt: "How would you redesign a checkout flow that drops 30% of users at the payment step?",
      keywords: ["research", "friction", "trust", "test", "simplif", "guest"],
      hint: "Identify friction; trust signals; reduce fields; A/B test.",
    },
    {
      prompt: "Tell me about a design decision you had to walk back. Why?",
      keywords: ["feedback", "data", "iter", "learn", "user", "research"],
      hint: "Show learning from feedback and iteration.",
    },
    {
      prompt: "How do you keep design systems consistent across teams?",
      keywords: ["tokens", "components", "documentation", "review", "guideline"],
      hint: "Design tokens, component library, docs, review process.",
    },
  ],
};

const ROLE_LABEL: Record<InterviewRole, string> = {
  frontend: "Frontend Engineer",
  backend: "Backend Engineer",
  "data-science": "Data Scientist",
  product: "Product Manager",
  design: "Product Designer",
};

export const ROLE_OPTIONS: { value: InterviewRole; label: string }[] = (
  Object.keys(INTERVIEW_QUESTIONS) as InterviewRole[]
).map((value) => ({ value, label: ROLE_LABEL[value] }));

/** Score a candidate's answer 0–5 against the keyword list. */
export function scoreAnswer(question: InterviewQuestion, answer: string): {
  score: number;
  matched: string[];
  feedback: string;
} {
  const lower = answer.toLowerCase();
  const matched = question.keywords.filter((kw) => lower.includes(kw));
  const score = Math.min(5, matched.length);
  const feedback = buildFeedback(score, matched, question);
  return { score, matched, feedback };
}

function buildFeedback(
  score: number,
  matched: string[],
  question: InterviewQuestion,
): string {
  if (score === 0) {
    return `0/5 — try to weave in terms like "${question.keywords.slice(0, 3).join(
      ", ",
    )}" so your answer lands the concepts the interviewer is listening for.`;
  }
  if (score <= 2) {
    return `${score}/5 — you touched on ${matched.join(", ")}. Add 1–2 concrete numbers or examples (e.g. "reduced render time by 40%") to make it memorable.`;
  }
  if (score === 3) {
    return `${score}/5 — solid answer. Stronger by adding a measurable result or trade-off you considered.`;
  }
  return `${score}/5 — excellent. You hit ${matched.length} of the key concepts. Finish with one line on what you'd do differently next time.`;
}

// ---------- Resume tips flow ----------

export interface ResumeReview {
  score: number;
  strengths: string[];
  improvements: string[];
  exampleRewrite: string;
}

export function reviewResumeBullet(bullet: string): ResumeReview {
  const text = bullet.trim();
  const lower = text.toLowerCase();
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Strong signals
  if (/\d/.test(text)) {
    strengths.push("Includes a number or percentage (great for measurable impact).");
  } else {
    improvements.push(
      "Add a number — e.g. ‘reduced load time by 35%’ instead of ‘made it faster’.",
    );
  }
  if (/(led|mentored|owned|designed|built|shipped|launched)/i.test(text)) {
    strengths.push("Uses a strong action verb at the start.");
  } else {
    improvements.push(
      "Start with a strong action verb (Built, Led, Owned, Shipped).",
    );
  }
  if (lower.length > 180) {
    improvements.push("Tighten the bullet — keep it under ~2 lines.");
  }
  if (!/[\w]/.test(text)) {
    improvements.push("Bullet is empty — paste one of your actual resume lines.");
  }
  if (!/[a-z]/i.test(text)) {
    improvements.push("Bullet doesn't look like English — paste the actual text.");
  }
  if (/responsible for|duties included|work(ed)? on/i.test(lower)) {
    improvements.push(
      'Replace "Responsible for…" with the impact you delivered.',
    );
  }
  if (/team of|collaborated with/i.test(lower)) {
    strengths.push("Calls out collaboration context.");
  }
  if (/(reduced|increased|grew|saved|generated)/i.test(lower)) {
    strengths.push("Frames the outcome in business terms (reduced/increased/saved).");
  } else if (strengths.length < 2) {
    improvements.push("State the outcome: reduced, increased, saved, grew — with a number.");
  }

  const score = Math.max(
    0,
    Math.min(5, strengths.length - improvements.length + 3),
  );

  const exampleRewrite = buildRewriteExample(text);

  return { score, strengths, improvements, exampleRewrite };
}

function buildRewriteExample(original: string): string {
  if (!original.trim()) {
    return "Paste a bullet like ‘Worked on the dashboard page’ and I'll rewrite it for you.";
  }
  // Heuristic rewrite — strips filler and prepends an action verb if missing.
  const trimmed = original.replace(/^(responsible for |duties included |worked on )/i, "");
  const verb = /^(built|led|owned|designed|shipped|launched|reduced|increased|saved|grew|mentored)/i.test(
    trimmed,
  )
    ? trimmed
    : `Built ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}`;
  return `${verb.trim()}${verb.endsWith(".") ? "" : "."} → Add a measurable result here, e.g. "cut response time by 40%" or "served 12k daily users".`;
}

// ---------- Verification checker ----------

export interface VerificationResult {
  score: number; // 0–100 trust score
  verdict: "verified" | "caution" | "unverified";
  flags: string[];
  positives: string[];
  summary: string;
}

const RED_FLAG_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bfee\b|\bpay\b|\bregistration charge\b/i, reason: "Mentions a fee or upfront payment" },
  { pattern: /\bgmail\.com|\byahoo\.com|\boutlook\.com/i, reason: "Recruiter uses a free email domain" },
  { pattern: /guaranteed (selection|interview|offer)/i, reason: "Promises guaranteed selection" },
  { pattern: /no (experience|skill) (required|needed)/i, reason: "Overpromises — no experience required for paid roles" },
  { pattern: /whatsapp only|telegram only/i, reason: "Only contactable on WhatsApp/Telegram" },
  { pattern: /\bwork from home\b.*\bearn\b.*\bday\b/i, reason: "Classic ‘earn per day’ work-from-home pattern" },
];

const POSITIVE_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bstipend\b|\bsalary\b|\bctc\b/i, reason: "Clear compensation mentioned" },
  { pattern: /duration\s*[:\-]?\s*\d+\s*(month|week)/i, reason: "Specifies a duration" },
  { pattern: /skills?\s*[:\-]/i, reason: "Lists required skills" },
  { pattern: /https?:\/\//i, reason: "Includes a real website link" },
  { pattern: /@[a-z0-9-]+\.(com|io|in|org|co|net)/i, reason: "Recruiter on a corporate email domain" },
];

export function checkVerification(text: string): VerificationResult {
  const flags: string[] = [];
  const positives: string[] = [];

  for (const { pattern, reason } of RED_FLAG_PATTERNS) {
    if (pattern.test(text)) flags.push(reason);
  }
  for (const { pattern, reason } of POSITIVE_PATTERNS) {
    if (pattern.test(text)) positives.push(reason);
  }

  // Length-based heuristic: very short blurbs have less to verify.
  const lengthBonus = text.length > 400 ? 5 : 0;

  const base = 70 + positives.length * 6 + lengthBonus;
  const penalty = flags.length * 18;
  const score = Math.max(5, Math.min(100, base - penalty));

  const verdict: VerificationResult["verdict"] =
    score >= 75 ? "verified" : score >= 50 ? "caution" : "unverified";

  const summary = (() => {
    if (verdict === "verified")
      return `Looks legitimate — trust score ${score}/100. ${
        positives.length
      } positive signal${positives.length === 1 ? "" : "s"} found.`;
    if (verdict === "caution")
      return `Proceed with caution — trust score ${score}/100. Verify the recruiter's identity by email before sharing personal details.`;
    return `High risk — trust score ${score}/100. Multiple red flags detected. We recommend skipping this listing.`;
  })();

  return { score, verdict, flags, positives, summary };
}

// ---------- Generic Q&A fallback ----------

/**
 * Top-level "intent" detected from a free-form question. Routes the user to
 * the right specialised response without them having to click a mode button.
 */
export type Intent =
  | "how-to-apply"           // "I want to apply for X, what should I do?"
  | "career-roadmap"         // "how do I become a X / get into Y"
  | "skill-gap"              // "what skills do I need for X"
  | "project-ideas"          // "what projects should I build"
  | "where-to-find"          // "where can I find X internships"
  | "timeline"               // "when should I start applying"
  | "eligibility"            // "am I eligible / can a fresher / 1st year apply"
  | "remote"                 // "remote internships"
  | "stipend-detail"         // "how much do X internships pay"
  | "no-experience"          // "I have no experience"
  | "college-vs-skills"      // "does college matter / tier"
  | "specific-company"       // mentions Google/Microsoft/etc.
  | "platform-help"          // "how do I use this site"
  | "compare-tracks"         // "ML vs data science vs web dev"
  | "resume-help"            // broad resume questions (not a bullet)
  | "interview-help"         // broad interview questions (not mock)
  | "fallback";              // we have no idea

export const INTENT_LABEL: Record<Intent, string> = {
  "how-to-apply": "How to apply for an internship",
  "career-roadmap": "Career roadmap",
  "skill-gap": "Skills you need",
  "project-ideas": "Project ideas",
  "where-to-find": "Where to find internships",
  "timeline": "Application timeline",
  "eligibility": "Eligibility",
  remote: "Remote internships",
  "stipend-detail": "Stipend details",
  "no-experience": "No experience",
  "college-vs-skills": "College vs skills",
  "specific-company": "Company-specific advice",
  "platform-help": "Platform help",
  "compare-tracks": "Compare tracks",
  "resume-help": "Resume help",
  "interview-help": "Interview help",
  fallback: "General help",
};

// A small library of natural-language triggers -> intent. Each entry is a list
// of words/phrases the user's message must contain (case-insensitive) to fire.
const INTENT_TRIGGERS: { intent: Intent; phrases: string[] }[] = [
  { intent: "how-to-apply", phrases: ["how to apply", "how do i apply", "how can i apply", "how should i apply", "apply for", "want to apply", "applying to", "application process"] },
  { intent: "career-roadmap", phrases: ["how do i become", "how to become", "how can i get into", "roadmap", "career path", "career in", "get into", "break into", "switch to", "transition into"] },
  { intent: "skill-gap", phrases: ["what skills", "skills needed", "skills required", "what should i learn", "what to learn", "technologies to learn", "tech stack", "prerequisites", "what do i need to know"] },
  { intent: "project-ideas", phrases: ["what projects", "project ideas", "projects to build", "build a project", "portfolio", "github project", "what to build"] },
  { intent: "where-to-find", phrases: ["where to find", "where can i find", "where to apply", "best platforms", "best sites", "websites for", "find internships"] },
  { intent: "timeline", phrases: ["when to apply", "when should i apply", "best time to apply", "what month", "how early", "deadline"] },
  { intent: "eligibility", phrases: ["am i eligible", "can i apply", "first year", "1st year", "second year", "2nd year", "third year", "3rd year", "final year", "fresher", "no cgpa", "low cgpa"] },
  { intent: "remote", phrases: ["remote internship", "work from home", "wfh", "online internship", "virtual internship"] },
  { intent: "stipend-detail", phrases: ["stipend", "salary", "how much pay", "how much do", "compensation", "ctc", "paid internship", "unpaid"] },
  { intent: "no-experience", phrases: ["no experience", "zero experience", "beginner", "i'm a beginner", "im a beginner", "just started", "no projects", "no internships"] },
  { intent: "college-vs-skills", phrases: ["does college matter", "tier", "tier-3", "tier-2", "non-iit", "non-nit", "without college", "no degree"] },
  { intent: "specific-company", phrases: ["google", "microsoft", "amazon", "meta", "facebook", "apple", "netflix", "uber", "flipkart", "razorpay", "cred", "swiggy", "zomato", "paytm", "phonepe", "infosys", "tcs", "wipro", "hcl"] },
  { intent: "platform-help", phrases: ["how do i use", "how does this work", "how to use this", "platform", "this site", "this app", "internguard"] },
  { intent: "compare-tracks", phrases: ["vs", "versus", "compare", "difference between", "which is better", "ml vs", "web dev vs", "frontend vs"] },
  { intent: "resume-help", phrases: ["how to write a resume", "resume help", "cv help", "resume tips", "improve resume", "build a resume", "first resume"] },
  { intent: "interview-help", phrases: ["how to prepare for interview", "interview prep", "interview preparation", "interview tips", "crack interview"] },
];

/** Detect the dominant intent from a free-form question. */
export function detectIntent(text: string): Intent {
  const lower = text.toLowerCase();
  let best: { intent: Intent; hits: number } = { intent: "fallback", hits: 0 };
  for (const { intent, phrases } of INTENT_TRIGGERS) {
    let hits = 0;
    for (const phrase of phrases) {
      if (lower.includes(phrase)) hits++;
    }
    if (hits > best.hits) best = { intent, hits };
  }
  // Also catch "I want to apply for X" style prompts via a fallback scan.
  if (best.hits === 0) {
    if (/\b(apply|applying)\b/.test(lower) && /\b(intern|internship|job|role)\b/.test(lower)) {
      best = { intent: "how-to-apply", hits: 1 };
    }
  }
  return best.intent;
}

// ---------- Domain detection ----------

/** Career domain the user is asking about. We use this to tailor answers. */
export type Domain =
  | "webdev"
  | "frontend"
  | "backend"
  | "fullstack"
  | "data-science"
  | "ml"
  | "mobile"
  | "android"
  | "ios"
  | "devops"
  | "cloud"
  | "cybersecurity"
  | "design"
  | "product"
  | "marketing"
  | "content"
  | "finance"
  | "consulting"
  | "research"
  | "general";

export const DOMAIN_LABEL: Record<Domain, string> = {
  webdev: "Web Development",
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full-Stack",
  "data-science": "Data Science",
  ml: "Machine Learning / AI",
  mobile: "Mobile Development",
  android: "Android",
  ios: "iOS",
  devops: "DevOps / SRE",
  cloud: "Cloud",
  cybersecurity: "Cybersecurity",
  design: "Design",
  product: "Product Management",
  marketing: "Marketing",
  content: "Content / Writing",
  finance: "Finance",
  consulting: "Consulting",
  research: "Research",
  general: "Software Engineering",
};

const DOMAIN_TRIGGERS: { domain: Domain; phrases: string[] }[] = [
  { domain: "webdev", phrases: ["web dev", "web development", "web developer", "website", "web app"] },
  { domain: "frontend", phrases: ["frontend", "front-end", "react", "vue", "angular", "svelte", "next.js", "nextjs"] },
  { domain: "backend", phrases: ["backend", "back-end", "node.js", "nodejs", "django", "flask", "spring boot", "go ", " rails"] },
  { domain: "fullstack", phrases: ["fullstack", "full-stack", "full stack", "mern", "mean"] },
  { domain: "data-science", phrases: ["data science", "data scientist", "data analyst", "analytics"] },
  { domain: "ml", phrases: ["machine learning", " ml ", "deep learning", "ai engineer", "nlp", "computer vision", "llm", "genai", "gen ai"] },
  { domain: "mobile", phrases: ["mobile", "app development", "app dev"] },
  { domain: "android", phrases: ["android", "kotlin"] },
  { domain: "ios", phrases: ["ios", "swift"] },
  { domain: "devops", phrases: ["devops", "sre", "site reliability", "kubernetes", "k8s", "ci/cd"] },
  { domain: "cloud", phrases: ["cloud", "aws", "azure", "gcp"] },
  { domain: "cybersecurity", phrases: ["cybersecurity", "security", "ethical hacking", "penetration"] },
  { domain: "design", phrases: ["design", "ui/ux", "ux designer", "graphic design", "figma"] },
  { domain: "product", phrases: ["product manager", "product management", " pm ", "apm"] },
  { domain: "marketing", phrases: ["marketing", "growth", "seo", "performance marketing"] },
  { domain: "content", phrases: ["content writer", "writing", "copywriting", "technical writing"] },
  { domain: "finance", phrases: ["finance", "investment banking", "equity research", "valuation"] },
  { domain: "consulting", phrases: ["consulting", "consultant"] },
  { domain: "research", phrases: ["research", "r&d", "phd"] },
];

export function detectDomain(text: string): Domain {
  const lower = text.toLowerCase();
  let best: { domain: Domain; hits: number } = { domain: "general", hits: 0 };
  for (const { domain, phrases } of DOMAIN_TRIGGERS) {
    let hits = 0;
    for (const phrase of phrases) {
      if (lower.includes(phrase)) hits++;
    }
    if (hits > best.hits) best = { domain, hits };
  }
  return best.domain;
}

// ---------- Domain knowledge base ----------

interface DomainGuide {
  oneLiner: string;
  learnInOrder: string[];
  projects: string[];
  resumeKeywords: string[];
  interviewFocus: string[];
  topRecruiters: string[];
  timeline: string;
  commonMistakes: string[];
}

const GUIDES: Record<Domain, DomainGuide> = {
  webdev: {
    oneLiner: "Web development is the fastest path to your first internship — build 2–3 polished projects, then apply aggressively.",
    learnInOrder: [
      "HTML, CSS, modern JavaScript (ES6+)",
      "React (component model, hooks, state)",
      "TypeScript (industry standard)",
      "Git + GitHub basics, then branching & PRs",
      "Either Next.js (full-stack, in demand) or Node/Express (backend)",
      "One database — PostgreSQL or MongoDB",
      "Deploy: Vercel, Netlify, or a $5 VPS",
    ],
    projects: [
      "A portfolio site with a blog (Next.js + MDX)",
      "A full-stack SaaS clone (Notion-lite, Trello-lite, URL shortener)",
      "A real-time app (chat, collaborative whiteboard) with WebSockets",
      "An open-source contribution to a popular repo (even docs count)",
    ],
    resumeKeywords: [
      "React, TypeScript, Next.js, Node.js, REST, PostgreSQL, Tailwind, Vercel",
      "Performance: Core Web Vitals, lazy loading, code-splitting",
      "Auth: NextAuth, JWT, OAuth",
    ],
    interviewFocus: [
      "DOM, event loop, closures, async/await",
      "React: reconciliation, keys, controlled vs uncontrolled",
      "Accessibility basics & semantic HTML",
      "System design lite: design a feed, design a chat app",
    ],
    topRecruiters: [
      "Razorpay, CRED, Swiggy, Zomato, Groww, Zerodha, PhonePe",
      "Microsoft, Google, Amazon (for top-tier)",
      "Startups on AngelList/Wellfound — apply in batches",
    ],
    timeline: "Most freshers land a paid web-dev internship between 2nd and 3rd year. Start building projects in 1st year, apply aggressively from month 4 of 2nd year.",
    commonMistakes: [
      "Tutorial hell — finish one course, build without copying",
      "Spreading across too many frameworks",
      "Skipping TypeScript (most Indian startups expect it)",
      "No deployed project — recruiters check links",
    ],
  },
  frontend: {
    oneLiner: "Frontend roles focus on React/TypeScript, performance, and design systems.",
    learnInOrder: [
      "JavaScript deep-dive (closures, prototypes, async)",
      "React + hooks + state management (Zustand or Redux Toolkit)",
      "TypeScript",
      "CSS: Flexbox, Grid, responsive, Tailwind",
      "Testing: Vitest + React Testing Library",
      "Storybook for component documentation",
    ],
    projects: [
      "Component library with Storybook + tests",
      "Dashboard with charts, filters, dark mode",
      "Animation-heavy marketing site (Framer Motion)",
    ],
    resumeKeywords: ["React, TypeScript, Next.js, Tailwind, Redux/Zustand, Vite, Jest, Playwright"],
    interviewFocus: ["React reconciliation", "performance optimization", "a11y", "CSS layout"],
    topRecruiters: ["Razorpay, CRED, Postman, BrowserStack, Flipkart"],
    timeline: "2nd-year summer is realistic if you have 2 strong React projects.",
    commonMistakes: ["Ignoring CSS fundamentals", "No testing on resume", "No a11y awareness"],
  },
  backend: {
    oneLiner: "Backend roles need solid system design, APIs, and one strong language.",
    learnInOrder: [
      "Pick one: Node.js (Express/Fastify) OR Python (FastAPI) OR Go OR Java (Spring Boot)",
      "SQL (PostgreSQL) — joins, indexes, transactions",
      "REST APIs, then GraphQL basics",
      "Auth: JWT, OAuth, sessions",
      "Caching: Redis",
      "Containers: Docker, then Kubernetes basics",
    ],
    projects: [
      "URL shortener with analytics",
      "Chat backend with WebSockets",
      "Auth service with OAuth + JWT",
      "API for a real dataset (movies, weather, finance)",
    ],
    resumeKeywords: ["Node.js, Express, PostgreSQL, Redis, Docker, AWS, REST, JWT"],
    interviewFocus: ["system design", "DB schema design", "concurrency", "debugging live"],
    topRecruiters: ["Razorpay, PhonePe, Cred, Flipkart, Amazon, Microsoft, Google"],
    timeline: "Backend interviews are harder — start prep 3–4 months out.",
    commonMistakes: ["Skipping SQL", "No system design practice", "Ignoring Linux basics"],
  },
  fullstack: {
    oneLiner: "Full-stack = comfortable across frontend + backend + one database.",
    learnInOrder: [
      "Pick a stack: Next.js + Prisma + Postgres (most hireable today)",
      "OR MERN (Mongo, Express, React, Node)",
      "Auth, payments (Razorpay test mode), file uploads",
      "Deployment: Vercel + a managed DB",
    ],
    projects: [
      "SaaS app with subscriptions (use Stripe/Razorpay test mode)",
      "Real-time collaborative tool",
      "Marketplace clone (Airbnb-lite, Fiverr-lite)",
    ],
    resumeKeywords: ["Next.js, TypeScript, Prisma, PostgreSQL, Tailwind, Vercel, AWS"],
    interviewFocus: ["end-to-end ownership", "system design", "DB choice rationale"],
    topRecruiters: ["Startups (highest demand), Razorpay, CRED, Swiggy"],
    timeline: "2–3 projects + 1 OSS contribution = interview-ready by 3rd year.",
    commonMistakes: ["Half-baked frontend, half-baked backend — go end-to-end on one project"],
  },
  "data-science": {
    oneLiner: "Data science roles need statistics, Python, SQL, and one strong case-study project.",
    learnInOrder: [
      "Python (NumPy, Pandas) — manipulate real datasets",
      "Statistics: distributions, hypothesis testing, A/B",
      "SQL — joins, window functions, CTEs",
      "Visualization: matplotlib, seaborn, or Plotly",
      "Modeling: scikit-learn, then a little XGBoost",
      "Storytelling: write a blog post per project",
    ],
    projects: [
      "EDA on a Kaggle dataset with a written narrative",
      "Churn/loan-default prediction with class-imbalance handling",
      "Dashboard in Streamlit or Tableau Public",
    ],
    resumeKeywords: ["Python, Pandas, scikit-learn, SQL, Tableau, A/B testing, statistics"],
    interviewFocus: ["case studies", "SQL on white-board", "statistics intuition", "business metrics"],
    topRecruiters: ["Flipkart, Myntra, Razorpay, Mu Sigma, Uber, Amazon"],
    timeline: "Data science internships are competitive — start applying by month 5 of 3rd year.",
    commonMistakes: ["All tutorials, no real datasets", "Skipping SQL", "No business storytelling"],
  },
  ml: {
    oneLiner: "ML/AI roles require strong fundamentals + one research-style project.",
    learnInOrder: [
      "Linear algebra + probability basics",
      "Python + NumPy + PyTorch (or TensorFlow)",
      "Classical ML: regression, trees, ensembles, evaluation",
      "Deep learning: CNNs, RNNs, Transformers",
      "HuggingFace + one LLM API project",
      "Read 2–3 recent papers, try to reproduce one",
    ],
    projects: [
      "Fine-tune a small transformer on a niche dataset",
      "RAG chatbot over your own PDFs",
      "Image classifier deployed on HuggingFace Spaces",
    ],
    resumeKeywords: ["PyTorch, HuggingFace, scikit-learn, NumPy, CUDA basics, RAG, LLMs"],
    interviewFocus: ["ML fundamentals", "transformer internals", "system design for ML"],
    topRecruiters: ["Google, Microsoft, Amazon, Sarvam AI, Krutrim, Observe.AI"],
    timeline: "Top ML roles want research — start a paper/repro in 2nd year.",
    commonMistakes: ["No math", "Only API-wrapping without understanding", "No paper reading"],
  },
  mobile: {
    oneLiner: "Mobile (Android/iOS/Flutter) is underrated — fewer applicants than web, similar pay.",
    learnInOrder: [
      "Pick one: React Native (easy), Flutter (cross-platform), or native (Kotlin/Swift)",
      "State management for that framework",
      "Native modules and platform channels",
      "App store deployment at least once",
    ],
    projects: [
      "Habit-tracker or expense-splitter app",
      "An app with offline-first sync",
      "Publish one to Play Store / App Store (even internal test track counts)",
    ],
    resumeKeywords: ["React Native, Flutter, Kotlin, Swift, Firebase, REST, GraphQL"],
    interviewFocus: ["lifecycle", "threading", "offline storage", "platform quirks"],
    topRecruiters: ["Flipkart, Swiggy, Zomato, PhonePe, Urban Company"],
    timeline: "One polished published app + 1 OSS PR is enough to land a 2nd-year internship.",
    commonMistakes: ["Never publishing to a store", "Ignoring platform-specific UX"],
  },
  android: {
    oneLiner: "Native Android with Kotlin is in demand at Indian product companies.",
    learnInOrder: ["Kotlin basics", "Jetpack Compose", "Coroutines + Flow", "Room + Retrofit", "Hilt DI"],
    projects: ["Compose-based news reader", "Offline notes app", "Publish on Play Store"],
    resumeKeywords: ["Kotlin, Jetpack Compose, Coroutines, Hilt, Room, Retrofit, MVVM"],
    interviewFocus: ["Activity/Fragment lifecycle", "coroutines", "Compose state", "DI"],
    topRecruiters: ["Flipkart, Swiggy, PhonePe, Razorpay"],
    timeline: "2nd-year summer is realistic with one polished Compose app.",
    commonMistakes: ["Sticking with XML views when Compose is the future", "No MVVM"],
  },
  ios: {
    oneLiner: "iOS roles are fewer but well-paid; Swift + SwiftUI is the modern path.",
    learnInOrder: ["Swift basics", "SwiftUI", "Combine / async-await", "CoreData or SwiftData", "TestFlight releases"],
    projects: ["SwiftUI habit tracker", "WidgetKit extension", "TestFlight release"],
    resumeKeywords: ["Swift, SwiftUI, Combine, CoreData, XCTest, MVVM"],
    interviewFocus: ["Swift memory model", "concurrency", "SwiftUI state", "architecture"],
    topRecruiters: ["Apple (rare), Flipkart, PhonePe, CRED, Razorpay"],
    timeline: "Fewer roles — start 6 months early, build 1 polished app.",
    commonMistakes: ["Only UIKit tutorials", "No published TestFlight app"],
  },
  devops: {
    oneLiner: "DevOps/SRE roles need Linux, Docker, CI/CD, and one cloud.",
    learnInOrder: ["Linux + shell scripting", "Networking basics", "Docker, then Kubernetes", "AWS (or GCP) — focus on EC2, S3, IAM, VPC", "Terraform basics", "Prometheus + Grafana for monitoring"],
    projects: ["Deploy a full-stack app via GitHub Actions", "Kubernetes cluster with Helm chart", "Cost-optimised AWS setup"],
    resumeKeywords: ["Docker, Kubernetes, AWS, Terraform, CI/CD, Prometheus, Linux"],
    interviewFocus: ["debugging live", "system design", "incident response"],
    topRecruiters: ["Razorpay, Cred, Flipkart, PhonePe, AWS, Google Cloud"],
    timeline: "DevOps interns are rare — being solid on Linux + Docker is enough to get shortlisted.",
    commonMistakes: ["Certifications without hands-on labs", "Skipping Linux fundamentals"],
  },
  cloud: {
    oneLiner: "Cloud engineering is booming — pick one provider and go deep.",
    learnInOrder: ["One cloud provider cert path (AWS SAA is the most recognised)", "Networking on that cloud", "IaC with Terraform", "Serverless: Lambda/API Gateway/DynamoDB"],
    projects: ["3-tier app on AWS with IaC", "Cost dashboard for your own AWS account", "Multi-region static site"],
    resumeKeywords: ["AWS, Terraform, Lambda, API Gateway, DynamoDB, CloudWatch"],
    interviewFocus: ["architecture trade-offs", "cost optimisation", "security"],
    topRecruiters: ["Amazon, Google, Microsoft, Razorpay, Flipkart"],
    timeline: "AWS SAA + 2 projects = interview-ready by end of 2nd year.",
    commonMistakes: ["Cert without labs", "Ignoring networking"],
  },
  cybersecurity: {
    oneLiner: "Cybersecurity is a long-game — CTFs, blogs, and one OSCP-style practice.",
    learnInOrder: ["Networking + Linux fundamentals", "OWASP Top 10", "TryHackMe / HackTheBox paths", "One scripting language (Python)", "Learn Burp Suite, Nmap, Wireshark"],
    projects: ["Write up 5 CTF challenges", "Build a vulnerable-by-design app and fix it", "Publish 1 security blog post"],
    resumeKeywords: ["OWASP, Burp Suite, Nmap, Wireshark, Python, CTF, Linux"],
    interviewFocus: ["threat modelling", "incident response", "system thinking"],
    topRecruiters: ["Microsoft, Google, Amazon, TCS (security practice), Quick Heal"],
    timeline: "Build a CTF profile (TryHackMe/HackTheBox rank) before applying.",
    commonMistakes: ["Only theoretical certs", "No public proof of skill"],
  },
  design: {
    oneLiner: "Design roles need a strong portfolio (3–5 case studies) over a degree.",
    learnInOrder: ["Figma mastery", "UX research basics", "Information architecture", "Interaction patterns", "Design systems"],
    projects: ["Redesign an existing app with case study", "Design system case study", "UX research writeup"],
    resumeKeywords: ["Figma, prototyping, user research, design system, usability testing"],
    interviewFocus: ["portfolio walkthrough", "design critique", "whiteboard challenge"],
    topRecruiters: ["CRED, Razorpay, Flipkart, Swiggy, Zomato, Freshworks"],
    timeline: "3 case studies with research depth = interview-ready.",
    commonMistakes: ["Dribbble shots without case studies", "No research"],
  },
  product: {
    oneLiner: "PM internships are competitive — combine tech + business + communication.",
    learnInOrder: ["Read 'Cracking the PM Interview' + 'Inspired'", "Pick a product you love, write a teardown", "Practice case questions", "Mock interviews with seniors", "Build 1 side project showing product thinking"],
    projects: ["Product teardown (2000 words) with metrics", "PRD for a feature of a real app", "A/B test simulation in spreadsheet"],
    resumeKeywords: ["product strategy, user research, A/B testing, SQL, analytics, roadmap"],
    interviewFocus: ["product design", "estimation", "strategy", "behavioral"],
    topRecruiters: ["Microsoft, Google, Flipkart, Razorpay, CRED, Atlassian"],
    timeline: "PM intern applications open early (Jul–Sep for next summer). Start 6 months ahead.",
    commonMistakes: ["No analytical depth", "Ignoring estimation cases"],
  },
  marketing: {
    oneLiner: "Marketing internships reward initiative and proof of campaigns you ran.",
    learnInOrder: ["Pick a track: performance, content, brand", "Google Analytics + Search Console", "Meta Ads / Google Ads (cert)", "SEO basics (Ahrefs/Semrush)", "Content writing practice"],
    projects: ["Run a ₹500 Instagram/Google ad for a real or test business", "Grow a blog/Instagram to 1k followers", "SEO audit of a real site"],
    resumeKeywords: ["SEO, Google Analytics, Meta Ads, content strategy, conversion rate optimisation"],
    interviewFocus: ["case questions on growth", "metrics fluency", "creative briefs"],
    topRecruiters: ["Flipkart, Zomato, Swiggy, CRED, small D2C brands"],
    timeline: "Easiest internships to land — strong with 1 campaign + portfolio.",
    commonMistakes: ["Only theoretical", "No live numbers"],
  },
  content: {
    oneLiner: "Content/writing internships reward published samples, not certificates.",
    learnInOrder: ["Pick a niche (tech, finance, lifestyle)", "Write 1 piece/week publicly", "Learn SEO basics", "Build an editing workflow in Notion"],
    projects: ["10 published articles in your niche", "Newsletter with 100+ subs", "Ghost-writing samples"],
    resumeKeywords: ["editorial, SEO writing, content strategy, CMS, journalism"],
    interviewFocus: ["writing test", "editing exercise", "voice & audience fit"],
    topRecruiters: ["YourStory, Inc42, Moneycontrol, Medium publications, brand teams"],
    timeline: "Published samples are enough — apply 2 months ahead.",
    commonMistakes: ["No public writing", "Generic portfolio"],
  },
  finance: {
    oneLiner: "Finance internships are technical — Excel, modelling, valuation.",
    learnInOrder: ["Excel mastery (pivot, vlookup, what-if)", "Financial accounting basics", "DCF and comps valuation", "Read WSJ + Moneycontrol daily"],
    projects: ["Build a DCF model for a listed company", "Pitch book for a sector", "Mock trading journal"],
    resumeKeywords: ["Excel, Bloomberg, DCF, valuation, financial modelling"],
    interviewFocus: ["technicals", "modelling test", "fit"],
    topRecruiters: ["Goldman Sachs, JP Morgan, Morgan Stanley, ICICI, Kotak"],
    timeline: "IB internships are extremely competitive — apply 1 year out.",
    commonMistakes: ["Ignoring Excel", "No modelling sample"],
  },
  consulting: {
    oneLiner: "Consulting case interviews need structured problem-solving drills.",
    learnInOrder: ["Case in Point + Victor Cheng's videos", "Frameworks: profitability, market entry, M&A", "Practice 20+ cases with peers", "Mental math drills"],
    projects: ["Write a case on a real Indian business", "Lead a college consulting club case"],
    resumeKeywords: ["problem solving, structured thinking, leadership, stakeholder management"],
    interviewFocus: ["case", "fit", "estimation"],
    topRecruiters: ["McKinsey, BCG, Bain, EY, Deloitte, Accenture Strategy"],
    timeline: "Apply 10–12 months ahead. Most big firms close by Aug–Sep.",
    commonMistakes: ["Memorising frameworks without practising", "Skipping fit prep"],
  },
  research: {
    oneLiner: "Research internships want a professor's recommendation + a project writeup.",
    learnInOrder: ["Read papers in your area (5/week)", "Reproduce one paper's results", "Write a survey or technical blog", "Email professors with a 1-page proposal"],
    projects: ["Reproduce a NeurIPS/ACL paper", "Publish a workshop paper or strong blog post"],
    resumeKeywords: ["PyTorch, JAX, LaTeX, research, publications"],
    interviewFocus: ["deep fundamentals", "research taste", "paper discussion"],
    topRecruiters: ["Microsoft Research, Google Research, IBM Research, IIT/IIIT labs"],
    timeline: "Apply 4–6 months out, email professors directly.",
    commonMistakes: ["No published or reproducible work", "Generic cold emails to professors"],
  },
  general: {
    oneLiner: "For software/engineering internships, the loop is the same: skills → projects → apply → interview.",
    learnInOrder: ["Pick a stack (web, mobile, ML, data) and go deep, not wide", "Build 2–3 deployed projects", "Contribute to 1 open-source repo", "Practice DSA (150 problems)"],
    projects: ["1 polished project per skill area", "1 OSS contribution", "1 hackathon win or top-3 finish"],
    resumeKeywords: ["problem solving, system design, communication, impact metrics"],
    interviewFocus: ["DSA", "system design", "behavioral"],
    topRecruiters: ["Razorpay, CRED, Flipkart, Swiggy, Microsoft, Google, Amazon"],
    timeline: "Start applying 3–4 months before target start date.",
    commonMistakes: ["Too many half-finished projects", "No deployed link on resume"],
  },
};

function buildRoadmap(domain: Domain): string {
  const g = GUIDES[domain];
  return [
    `**${DOMAIN_LABEL[domain]} — your roadmap**`,
    "",
    g.oneLiner,
    "",
    "**Learn in this order:**",
    g.learnInOrder.map((s, i) => `${i + 1}. ${s}`).join("\n"),
    "",
    "**Projects that get interviews:**",
    g.projects.map((p) => `• ${p}`).join("\n"),
    "",
    "**Resume keywords to include:**",
    g.resumeKeywords.map((k) => `• ${k}`).join("\n"),
    "",
    "**Interview focus:**",
    g.interviewFocus.map((k) => `• ${k}`).join("\n"),
    "",
    "**Where to apply:**",
    g.topRecruiters.map((k) => `• ${k}`).join("\n"),
    "",
    `**Timeline:** ${g.timeline}`,
    "",
    "**Common mistakes to avoid:**",
    g.commonMistakes.map((k) => `• ${k}`).join("\n"),
    "",
    "Want a deeper dive? Tell me which step you're stuck on and I'll help you unblock it.",
  ].join("\n");
}

function buildHowToApply(domain: Domain): string {
  const g = GUIDES[domain];
  return [
    `**Applying for ${DOMAIN_LABEL[domain]} internships — concrete steps:**`,
    "",
    "**1. Get the basics right (2–4 weeks)**",
    g.learnInOrder.slice(0, 3).map((s) => `• ${s}`).join("\n"),
    "",
    "**2. Build 2 visible projects (4–6 weeks)**",
    g.projects.slice(0, 2).map((p) => `• ${p}`).join("\n"),
    "",
    "**3. Resume (1 week)**",
    "• One-line summary tailored to the role\n• 3–4 bullets per project with measurable outcomes\n• Skills section ordered by relevance to the JD\n• GitHub + LinkedIn + live project links",
    "",
    "**4. Apply in batches (4–8 weeks)**",
    g.topRecruiters.map((r) => `• ${r}`).join("\n"),
    "",
    "**5. Interview prep (parallel with 4)**",
    g.interviewFocus.slice(0, 2).map((k) => `• ${k}`).join("\n"),
    "",
    "Want me to review one of your resume bullets? Switch to Resume Tips mode and paste it in.",
  ].join("\n");
}

function buildSkillsAnswer(domain: Domain): string {
  const g = GUIDES[domain];
  return [
    `**Skills you need for ${DOMAIN_LABEL[domain]}:**`,
    "",
    "**Must-have:**",
    g.learnInOrder.slice(0, 4).map((s) => `• ${s}`).join("\n"),
    "",
    "**Nice-to-have (sets you apart):**",
    g.learnInOrder.slice(4).map((s) => `• ${s}`).join("\n"),
    "",
    "**Resume keywords recruiters scan for:**",
    g.resumeKeywords.map((k) => `• ${k}`).join("\n"),
    "",
    "Pick 2–3 of these and go deep — breadth without depth doesn't get interviews.",
  ].join("\n");
}

function buildProjectIdeas(domain: Domain): string {
  const g = GUIDES[domain];
  return [
    `**Project ideas for ${DOMAIN_LABEL[domain]}:**`,
    "",
    g.projects.map((p, i) => `**${i + 1}. ${p}**\nWhat it shows: end-to-end execution + the skills listed in the JD.\n`).join("\n"),
    "Pick the one you'd actually use yourself — recruiters spot passion projects a mile away.",
  ].join("\n");
}

function buildSpecificCompanyAnswer(text: string): string {
  const lower = text.toLowerCase();
  const company = (["google", "microsoft", "amazon", "meta", "facebook", "apple",
    "netflix", "uber", "flipkart", "razorpay", "cred", "swiggy", "zomato",
    "paytm", "phonepe", "infosys", "tcs", "wipro", "hcl"]
    .find((c) => lower.includes(c))) ?? "the company";
  return [
    `**Applying to ${company[0].toUpperCase()}${company.slice(1)} from India — here's the realistic path:**`,
    "",
    `**For ${company}'s India SDE/PM intern roles:**`,
    "• Strong DSA (250+ problems on LeetCode, mediums + hards comfortable)",
    "• System design basics (even for interns at top-tier)",
    "• One impressive project with a deployed link + GitHub stars/contributors",
    "• Referral beats cold apply — reach out to 2nd-degree LinkedIn contacts",
    "• Apply via the official careers portal AND through your college placement cell if applicable",
    "",
    `**Common ${company} interview rounds:**`,
    "1. Online assessment (DSA, 1–2 problems, 60–90 min)",
    "2. Technical phone/video (1–2 problems, behaviour)",
    "3. Onsite loop (3–5 rounds: DSA, system design, behavioural)",
    "",
    "**Prep timeline:** 4–6 months for top-tier. Use the InternGuard mock interview to practise verbal answers after solving.",
  ].join("\n");
}

function buildPlatformAnswer(text: string): string {
  return [
    "**How to use InternGuard — quick tour:**",
    "",
    "**Find internships** — go to /internships, filter by Verified / Caution / Unverified. Click 'View details' on any card to see the full description, recruiter verification details, and skills required.",
    "",
    "**Apply** — open a listing, hit 'Apply now'. We send your profile + resume snapshot to the recruiter.",
    "",
    "**Track applications** — your /dashboard shows status (pending / reviewed / interview / accepted / rejected), recruiter views, and next-step deadlines.",
    "",
    "**Verify a listing** — paste any suspicious listing into this chat (Support mode). I'll score it 0–100 and list red flags.",
    "",
    "**Mock interview & resume tips** — switch modes in the top-right of this chat.",
    "",
    "**Profile** — keep your /profile up to date. A complete profile boosts your match score in recruiter searches.",
  ].join("\n");
}

function buildCompareAnswer(text: string): string {
  const lower = text.toLowerCase();
  if (/(ml|machine learning).*(data scien|data anal)/.test(lower) || /(data scien|data anal).*(ml|machine learning)/.test(lower)) {
    return [
      "**ML engineer vs Data Scientist — the real difference:**",
      "",
      "**ML Engineer:**",
      "• Builds and ships models in production (MLOps, scaling, monitoring)",
      "• Stronger on systems, Python, cloud, Docker",
      "• Day-to-day: deployment, pipelines, model performance",
      "",
      "**Data Scientist:**",
      "• Explores data, builds dashboards, runs experiments",
      "• Stronger on statistics, SQL, storytelling, business metrics",
      "• Day-to-day: A/B tests, ad-hoc analysis, stakeholder reports",
      "",
      "**Overlap:** both need Python, SQL, and statistics. The split is systems vs storytelling.",
      "",
      "**Pay:** roughly similar at fresher level; ML eng pulls ahead at senior IC roles.",
      "**Easier to break into:** Data Analyst → Data Scientist is the safer path in India right now.",
    ].join("\n");
  }
  if (/frontend.*backend|backend.*frontend|fullstack/.test(lower)) {
    return [
      "**Frontend vs Backend vs Full-Stack — pick by what you enjoy:**",
      "",
      "**Frontend:** visual feedback, design, UX. Daily tools: React, CSS, browser DevTools.",
      "**Backend:** systems, scale, data. Daily tools: databases, queues, infra.",
      "**Full-Stack:** both — startups love this. Slightly broader, slightly shallower on each side.",
      "",
      "**Rule of thumb:** if you lose hours tweaking a CSS animation, go frontend. If you lose hours profiling a slow query, go backend. If both, full-stack at a startup is the most leverage.",
    ].join("\n");
  }
  return [
    "**Compare tracks — what to think about:**",
    "",
    "• Day-to-day — do you want to ship UI, build systems, crunch data, talk to users, or analyse markets?",
    "• Pay — roughly equal at entry for software; finance/consulting pays more upfront but hours are longer",
    "• Barrier to entry — web/mobile < data < ML/AI; consulting/IB are the hardest to break into",
    "• Long-term — software scales globally, consulting scales to MBA exit ops, finance scales to PE/VC",
    "",
    "Tell me the two tracks you want compared and I'll go deeper.",
  ].join("\n");
}

function buildEligibilityAnswer(text: string): string {
  return [
    "**Eligibility — common Indian internship scenarios:**",
    "",
    "**First-year students:** Yes, you can apply — most startups don't gate on year. Tier-1 companies (Google, Microsoft) typically require 2nd year+.",
    "",
    "**Tier-2/3 colleges:** Apply off-campus through platforms (InternGuard, Internshala, AngelList). Referrals beat cold applications 10x.",
    "",
    "**Low CGPA (<7):** Compensate with strong projects, OSS contributions, hackathon wins, and a portfolio. Many startups don't ask CGPA.",
    "",
    "**No prior internship:** That's expected for your first one. Lead with 2–3 polished personal projects instead.",
    "",
    "**Branch mismatch:** Allowed for most tech internships. For finance/consulting, MBA-tier firms prefer commerce/engineering backgrounds.",
    "",
    "Tell me your year, branch, and CGPA — I can give a tailored plan.",
  ].join("\n");
}

function buildNoExperienceAnswer(text: string): string {
  return [
    "**Landing your first internship with no experience — the path:**",
    "",
    "**Week 1–4:** Pick one stack and finish a course (freeCodeCamp, The Odin Project, or a YouTube series).",
    "**Week 5–8:** Build a polished project that solves YOUR problem. Deploy it.",
    "**Week 9–10:** Write the project as 3 resume bullets (action verb + what + measurable result).",
    "**Week 11–12:** Apply to 20+ startups (smaller companies hire more first-timers).",
    "**Week 13–16:** Mock interview + iterate on weak areas.",
    "",
    "**Substitutes for experience on a resume:**",
    "• 2 polished deployed projects with measured impact",
    "• 1 open-source contribution (even docs fixes)",
    "• 1 hackathon participation or win",
    "• Active GitHub with consistent commits",
    "",
    "Switch to Resume Tips mode and paste your current resume (or a bullet). I'll show you exactly what to add.",
  ].join("\n");
}

function buildRemoteAnswer(text: string): string {
  return [
    "**Remote internships — the realistic picture:**",
    "",
    "**Where to find them:**",
    "• InternGuard (filter by Verified + Remote-friendly listings)",
    "• Wellfound / AngelList (lots of remote-first startups)",
    "• Internshala (India-focused)",
    "• LinkedIn (filter 'Remote' + 'Internship')",
    "• Company career pages directly (search ‘remote intern India’)",
    "",
    "**Pros:** flexibility, no relocation, can work for global companies.",
    "**Cons:** time-zone overlap, harder to convert to full-time, sometimes lower pay in INR terms.",
    "",
    "**What recruiters look for in remote applicants:**",
    "• Strong async communication (Slack, written updates)",
    "• Self-directed project history",
    "• Clear home setup / availability",
    "",
    "Switch to Support mode and paste a listing to verify it's legitimate before applying.",
  ].join("\n");
}

function buildStipendAnswer(text: string): string {
  return [
    "**Stipend ranges for Indian internships (2026):**",
    "",
    "**Software / Web / Mobile:**",
    "• Top-tier (Google, Microsoft, Amazon): ₹1L–₹2L/month",
    "• Top startups (Razorpay, CRED, Postman): ₹50k–₹1L/month",
    "• Mid startups: ₹20k–₹50k/month",
    "• Early-stage: ₹10k–₹25k/month or equity",
    "",
    "**Data Science / ML:**",
    "• Top-tier: ₹80k–₹1.5L/month",
    "• Mid: ₹30k–₹60k/month",
    "",
    "**Design / PM / Marketing:**",
    "• Top-tier: ₹60k–₹1L/month",
    "• Mid: ₹20k–₹45k/month",
    "",
    "**Unpaid but worth it:** IIT/IIIT research labs, top NGO programs (Teach for India, Ashoka), prestigious international fellowships (Mila, DAAD).",
    "",
    "Don't chase stipend alone — brand + learning compounds over the next 5 years.",
  ].join("\n");
}

function buildTimelineAnswer(text: string): string {
  return [
    "**Application timeline for Indian internships (most internships are summer-May to July):**",
    "",
    "**For summer internships:**",
    "• August–October (previous year): Google, Microsoft, Atlassian, top consulting firms",
    "• November–January: most product startups, finance internships",
    "• January–March: late applications, smaller startups, rolling-basis roles",
    "",
    "**For winter internships (Dec–Jan):** apply September–October.",
    "**For full-time (post-grad):** start July–August of your final year.",
    "",
    "**Rule of thumb: 6 months ahead for top-tier, 3 months for startups.**",
    "",
    "If you're reading this in June 2026, your best window for the August–October top-tier batch closes in 2–4 months. Start polishing your resume today.",
  ].join("\n");
}

function buildResumeGeneralAnswer(): string {
  return [
    "**Resume tips (general, not bullet-by-bullet):**",
    "",
    "**Structure that works:**",
    "• Header: name, email, phone, LinkedIn, GitHub, portfolio",
    "• One-line summary tailored to the role you're applying for",
    "• Education (with CGPA only if ≥7.5)",
    "• Skills section ordered by relevance to JD",
    "• 2–3 projects (each: 3–4 bullets, action verb + what + measurable result)",
    "• Experience (if any) — same bullet formula",
    "• Achievements (hackathons, scholarships, OSS)",
    "",
    "**What gets resumes shortlisted:**",
    "• 1 deployed project link in the first 3 lines",
    "• Quantified outcomes — every bullet should have a number where possible",
    "• Skills matching 70%+ of the JD keywords",
    "• Clean one-page format (PDF)",
    "",
    "Switch to Resume Tips mode and paste one of your bullets — I'll score it 0–5 and rewrite it.",
  ].join("\n");
}

function buildInterviewGeneralAnswer(): string {
  return [
    "**Interview preparation — a practical 8-week plan:**",
    "",
    "**DSA (4 weeks):**",
    "• Week 1: arrays, strings, hash maps (15 problems)",
    "• Week 2: linked lists, stacks, queues, trees (15 problems)",
    "• Week 3: graphs, BFS/DFS, DP basics (15 problems)",
    "• Week 4: medium-level mixed problems (15–20 problems)",
    "",
    "**Projects + system design (2 weeks):**",
    "• Be ready to deep-dive on any project on your resume",
    "• System design basics: URL shortener, chat app, rate limiter, feed ranking",
    "",
    "**Behavioural (1 week):**",
    "• STAR-format answers for: conflict, leadership, failure, ambiguity",
    "• 'Why this company?' specific to each role",
    "",
    "**Mock interviews (1 week):** practice with a peer or use InternGuard's mock interview mode.",
    "",
    "Want to drill one specific round? Switch to Mock Interview mode and I'll run you through it.",
  ].join("\n");
}

function buildCollegeVsSkillsAnswer(): string {
  return [
    "**Does college tier matter?**",
    "",
    "**Short answer:** It opens doors. It doesn't guarantee anything.",
    "",
    "**Where it matters a lot:**",
    "• Google, Microsoft, Goldman Sachs, McKinsey — campus recruiting is tier-gated at the screening stage",
    "• Off-campus referrals can compensate, but you need to network harder",
    "",
    "**Where it matters less:**",
    "• Startups (most don't ask)",
    "• OSS-based hiring (your GitHub speaks)",
    "• Hackathons, competitions, project-based hiring",
    "",
    "**How to compensate from a non-elite college:**",
    "• Strong projects (deployed, with metrics)",
    "• Active OSS contributions",
    "• 1–2 hackathon wins or top finishes",
    "• A network — attend meetups, contribute online, find a mentor",
    "• Apply through InternGuard, Wellfound, and direct referrals — not just cold LinkedIn",
    "",
    "Tier-2/3 students get placed at top companies every year. The differentiator is portfolio + communication, not the brand on the degree.",
  ].join("\n");
}

/** Generate a free-form, intent-driven answer (no mode click needed). */
export function generateFreeformAnswer(text: string): ChatMessage {
  const intent = detectIntent(text);
  const domain = detectDomain(text);
  const body = (() => {
    switch (intent) {
      case "how-to-apply":
        return buildHowToApply(domain);
      case "career-roadmap":
        return buildRoadmap(domain);
      case "skill-gap":
        return buildSkillsAnswer(domain);
      case "project-ideas":
        return buildProjectIdeas(domain);
      case "where-to-find":
        return buildPlatformAnswer(text);
      case "timeline":
        return buildTimelineAnswer(text);
      case "eligibility":
        return buildEligibilityAnswer(text);
      case "remote":
        return buildRemoteAnswer(text);
      case "stipend-detail":
        return buildStipendAnswer(text);
      case "no-experience":
        return buildNoExperienceAnswer(text);
      case "college-vs-skills":
        return buildCollegeVsSkillsAnswer();
      case "specific-company":
        return buildSpecificCompanyAnswer(text);
      case "platform-help":
        return buildPlatformAnswer(text);
      case "compare-tracks":
        return buildCompareAnswer(text);
      case "resume-help":
        return buildResumeGeneralAnswer();
      case "interview-help":
        return buildInterviewGeneralAnswer();
      case "fallback":
      default:
        return [
          "I can help with that. A few quick things I can answer in detail:",
          "",
          "• How to apply for [web dev / ML / data science / mobile / design / PM / ...]",
          "• Skills you need + projects that get interviews",
          "• Resume bullet rewrites (switch to Resume Tips mode and paste one)",
          "• Mock interview (switch to Mock Interview mode)",
          "• Stipend ranges, eligibility, remote internships, application timeline",
          "• Verifying a suspicious listing (paste the text in Support mode)",
          "",
          "Tell me which domain you're targeting and I'll give a concrete plan.",
        ].join("\n");
    }
  })();

  return {
    id: `freeform-${Date.now()}`,
    text: body,
    sender: "bot",
    timestamp: new Date(),
    type: intent === "interview-help" ? "interview" : intent === "resume-help" ? "advice" : intent === "specific-company" || intent === "platform-help" || intent === "where-to-find" || intent === "remote" || intent === "eligibility" || intent === "stipend-detail" || intent === "timeline" || intent === "compare-tracks" || intent === "college-vs-skills" || intent === "no-experience" ? "support" : "advice",
    kind: "text",
    meta: { intent, domain },
  };
}

const KEYWORD_ROUTES: { keywords: string[]; mode: Mode; reply: string }[] = [
  {
    keywords: ["fake", "scam", "fraud", "verify", "verification", "legit"],
    mode: "support",
    reply:
      "Each listing shows a verification badge (Verified / Caution / Unverified) with a trust score. We verify domain ownership, recruiter IDs, GST where applicable, and run AI text analysis. Paste the listing description into the chat and I'll run a live check.",
  },
  {
    keywords: ["resume", "cv"],
    mode: "advice",
    reply:
      "Paste one of your resume bullets below — I'll score it on a 5-point scale and rewrite it with measurable impact.",
  },
  {
    keywords: ["interview", "mock", "practice"],
    mode: "interview",
    reply:
      "I can run a 5-question mock interview with feedback after every answer. Pick a role to start (Frontend, Backend, Data Science, Product, Design).",
  },
  {
    keywords: ["red flag", "warning", "upfront", "suspicious"],
    mode: "support",
    reply:
      "Top red flags: requests for upfront payment, free email recruiters, 'guaranteed selection', vague responsibilities, and offers that sound too good to be true. Paste the listing and I'll score it.",
  },
  {
    keywords: ["stipend", "salary", "paid", "money"],
    mode: "advice",
    reply:
      "Paid internships in India typically range ₹8,000–₹40,000/month depending on company and city. Government & NGO programs are often unpaid but offer strong experience and certificates.",
  },
  {
    keywords: ["apply", "application"],
    mode: "support",
    reply:
      "Go to the Internships tab, find a listing, and click Apply Now. Your applications are tracked on the Dashboard — you'll see resume-view notifications, interview status, and offer updates in real time.",
  },
  {
    keywords: ["dashboard", "tracking"],
    mode: "support",
    reply:
      "The Dashboard shows your application status, profile strength, and recent activity. You'll also see when a recruiter views your resume.",
  },
  {
    keywords: ["sign in", "login", "account"],
    mode: "support",
    reply:
      "Click 'Sign in' in the top right or 'Get started' on the home page. New here? Use 'Create account' — it's free and takes 30 seconds.",
  },
];

export interface GreetingOptions {
  mode: Mode;
}

export function buildGreetingMessage(mode: Mode): ChatMessage {
  switch (mode) {
    case "interview":
      return {
        id: `greet-interview-${Date.now()}`,
        text: "Mock Interview mode — pick a role below to begin a 5-question practice with instant feedback.",
        sender: "bot",
        timestamp: new Date(),
        type: "interview",
        kind: "text",
      };
    case "advice":
      return {
        id: `greet-advice-${Date.now()}`,
        text: "Resume Tips mode — paste one bullet from your resume and I'll score it (out of 5) and rewrite it with measurable impact.",
        sender: "bot",
        timestamp: new Date(),
        type: "advice",
        kind: "text",
      };
    case "support":
    default:
      return {
        id: `greet-support-${Date.now()}`,
        text: "Support mode — ask anything about the platform, paste a suspicious listing to verify, or hit the Common Questions on the right.",
        sender: "bot",
        timestamp: new Date(),
        type: "support",
        kind: "text",
      };
  }
}

export function buildInterviewStartMessage(role: InterviewRole): ChatMessage {
  const questions = INTERVIEW_QUESTIONS[role];
  const first = questions[0];
  return {
    id: `interview-start-${Date.now()}`,
    text: `Great — we'll do a ${ROLE_LABEL[role]} mock interview. I'll ask 5 questions, one at a time, and give feedback after each answer.\n\nQuestion 1 of ${questions.length}:\n${first.prompt}\n\nTip: ${first.hint}`,
    sender: "bot",
    timestamp: new Date(),
    type: "interview",
    kind: "interview-q",
    meta: { role, index: 0 },
  };
}

export function buildInterviewFeedback(
  role: InterviewRole,
  index: number,
  answer: string,
): ChatMessage {
  const questions = INTERVIEW_QUESTIONS[role];
  const question = questions[index];
  const review = scoreAnswer(question, answer);
  const nextIndex = index + 1;

  let text = `**Question ${index + 1} feedback:** ${review.feedback}`;
  if (nextIndex < questions.length) {
    const next = questions[nextIndex];
    text += `\n\n**Question ${nextIndex + 1} of ${questions.length}:**\n${next.prompt}\n\nTip: ${next.hint}`;
  } else {
    const avg = nextIndex; // placeholder
    void avg;
    text += `\n\nThat's the last question! Type **restart** to begin again, or switch to Resume Tips to review your resume.`;
  }

  return {
    id: `interview-feedback-${Date.now()}`,
    text,
    sender: "bot",
    timestamp: new Date(),
    type: "interview",
    kind: "interview-feedback",
    meta: { role, index, score: review.score, matched: review.matched },
  };
}

export function buildResumeReviewMessage(bullet: string): ChatMessage {
  const review = reviewResumeBullet(bullet);
  const verdict =
    review.score >= 4
      ? "🟢 Strong bullet — ship it."
      : review.score === 3
        ? "🟡 Decent — a few tweaks will make it sharper."
        : "🔴 Weak — needs a measurable outcome and stronger verb.";

  const text = [
    `Score: **${review.score}/5** — ${verdict}`,
    "",
    review.strengths.length
      ? `**What's working:**\n${review.strengths.map((s) => `• ${s}`).join("\n")}`
      : "**What's working:** nothing stood out — try again with more detail.",
    "",
    review.improvements.length
      ? `**To improve:**\n${review.improvements.map((s) => `• ${s}`).join("\n")}`
      : "**To improve:** honestly, this is solid.",
    "",
    `**Suggested rewrite:**\n"${review.exampleRewrite}"`,
    "",
    "Paste another bullet to review, or switch to Mock Interview to practice delivering these wins.",
  ].join("\n");

  return {
    id: `resume-review-${Date.now()}`,
    text,
    sender: "bot",
    timestamp: new Date(),
    type: "advice",
    kind: "resume-review",
    meta: { score: review.score },
  };
}

export function buildVerificationMessage(text: string): ChatMessage {
  const result = checkVerification(text);
  const verdictEmoji =
    result.verdict === "verified"
      ? "✅"
      : result.verdict === "caution"
        ? "⚠️"
        : "❌";

  const lines = [
    `${verdictEmoji} ${result.summary}`,
    "",
    `**Trust score:** ${result.score}/100`,
  ];
  if (result.flags.length) {
    lines.push("", "**Red flags:**", ...result.flags.map((f) => `• ${f}`));
  }
  if (result.positives.length) {
    lines.push("", "**Positive signals:**", ...result.positives.map((p) => `• ${p}`));
  }
  lines.push(
    "",
    "Paste another listing to verify, or switch to Mock Interview when you're ready.",
  );

  return {
    id: `verify-${Date.now()}`,
    text: lines.join("\n"),
    sender: "bot",
    timestamp: new Date(),
    type: "support",
    kind: "verification",
    meta: { score: result.score, verdict: result.verdict },
  };
}

/**
 * The core "respond to freeform user input" function. Picks between the
 * structured interview/resume/verification flows and a keyword-routed fallback.
 */
export function generateReply(
  text: string,
  mode: Mode,
  context: ConversationContext,
): ChatMessage {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Global commands
  if (/^restart$|^reset$|^start over$/.test(lower)) {
    return buildGreetingMessage(mode);
  }
  if (/^help$|^menu$/.test(lower)) {
    return buildGreetingMessage(mode);
  }

  // ---------- Natural-language career questions ----------
  // We try the intent engine FIRST so users don't have to know which mode to
  // pick. The intent engine handles things like "I want to apply for web dev,
  // what should I do?" with a full roadmap. Only structured-flow follow-ups
  // (already mid-interview, mid-resume-review, or a long listing to verify)
  // take precedence below.
  const intent = detectIntent(trimmed);
  const inStructuredFlow =
    (mode === "interview" && context.interviewRole && typeof context.interviewIndex === "number") ||
    (mode === "advice" && trimmed.length >= 10) ||
    (mode === "support" && trimmed.length >= 60);
  if (intent !== "fallback" && !inStructuredFlow) {
    return generateFreeformAnswer(trimmed);
  }

  // Mode-specific structured flows
  if (mode === "interview") {
    const { interviewRole, interviewIndex } = context;
    if (interviewRole && typeof interviewIndex === "number") {
      const questions = INTERVIEW_QUESTIONS[interviewRole];
      if (interviewIndex < questions.length) {
        const feedbackMsg = buildInterviewFeedback(
          interviewRole,
          interviewIndex,
          trimmed,
        );
        // The next state is the next question (or end).
        context.setInterviewIndex(interviewIndex + 1);
        return feedbackMsg;
      }
      // Past the end — start over if they keep typing.
      return buildGreetingMessage("interview");
    }
    // No active interview — see if they named a role.
    const role = matchRole(lower);
    if (role) {
      context.setInterviewRole(role);
      context.setInterviewIndex(1);
      return buildInterviewStartMessage(role);
    }
    return {
      id: `ask-role-${Date.now()}`,
      text: "Pick a role below to begin, or just type it (Frontend, Backend, Data Science, Product, Design).",
      sender: "bot",
      timestamp: new Date(),
      type: "interview",
      kind: "text",
    };
  }

  if (mode === "advice") {
    if (trimmed.length >= 10) {
      return buildResumeReviewMessage(trimmed);
    }
    return {
      id: `ask-resume-${Date.now()}`,
      text: "Paste a single bullet from your resume (at least a few words) and I'll score and rewrite it.",
      sender: "bot",
      timestamp: new Date(),
      type: "advice",
      kind: "text",
    };
  }

  // Support / fraud-detection mode
  if (trimmed.length >= 60) {
    // Treat longer inputs as listings to verify.
    return buildVerificationMessage(trimmed);
  }

  for (const route of KEYWORD_ROUTES) {
    if (route.keywords.some((kw) => lower.includes(kw))) {
      return {
        id: `route-${Date.now()}`,
        text: route.reply,
        sender: "bot",
        timestamp: new Date(),
        type: route.mode,
        kind: "text",
      };
    }
  }

  return {
    id: `fallback-${Date.now()}`,
    text: "I can help with mock interviews, resume bullets, and verifying listings. Try the quick actions above, switch mode in the top-right, or paste a suspicious listing description for a trust score.",
    sender: "bot",
    timestamp: new Date(),
    type: "support",
    kind: "text",
  };
}

export function matchRole(text: string): InterviewRole | null {
  const t = text.toLowerCase();
  if (/(front\s*end|frontend|react)/.test(t)) return "frontend";
  if (/(back\s*end|backend|node|java|go|api)/.test(t)) return "backend";
  if (/(data\s*scien|machine learn|ml |ai\b|python.*data)/.test(t)) return "data-science";
  if (/(product|pm\b|product manager)/.test(t)) return "product";
  if (/(design|ux|ui\b)/.test(t)) return "design";
  return null;
}

export interface ConversationContext {
  interviewRole: InterviewRole | null;
  interviewIndex: number | null;
  setInterviewRole: (r: InterviewRole | null) => void;
  setInterviewIndex: (i: number | null) => void;
}

export const WELCOME_MESSAGE = WELCOME;

const FALLBACK_REPLIES: Record<Mode, string[]> = {
  interview: [
    "Tell me about a recent project — what was your specific contribution?",
    "Walk me through the toughest technical challenge you've solved.",
    "Why this internship? What do you want to learn here?",
  ],
  support: [
    "Could you tell me more about what you're trying to do?",
    "Which page of the app are you on right now?",
    "Are you signed in? Some features require an account.",
  ],
  advice: [
    "What role are you targeting? I can tailor the resume tips.",
    "Paste one bullet from your resume and I'll rewrite it.",
    "Tell me about a project you're proud of — I'll help you frame it.",
  ],
};