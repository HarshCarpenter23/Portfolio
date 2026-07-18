export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harshcarpenter.vercel.app";

export const identity = {
  name: "Harsh Carpenter",
  role: "Full Stack Developer",
  thesis: "I ship production software — systems real businesses run on.",
  sub: "Software Development Engineer at Blockland India. B.Tech CSE (AI/ML) at VIT-AP University, CGPA 8.5, class of 2026.",
  email: "harshcarpenter06902@gmail.com",
  github: "https://github.com/HarshCarpenter23",
  linkedin: "https://www.linkedin.com/in/harsh-carpenter",
};

export const statusBoard = [
  {
    name: "CQ HIMS",
    what: "multi-tenant hospital SaaS",
    metric: "20+ modules live",
    domain: "cqhims.in",
    href: "https://cqhims.in",
  },
  {
    name: "AP CID EXAMS",
    what: "real-time recruitment exams",
    metric: "1,500+ concurrent",
    domain: "apcid.netlify.app",
    href: "https://apcid.netlify.app",
  },
  {
    name: "CLINICQUEUE",
    what: "clinic SaaS, self-funded",
    metric: "sold by me, to clinics",
    domain: "clinicqueuee.vercel.app",
    href: "https://clinicqueuee.vercel.app",
  },
  {
    name: "DIGITAL FORTRESS",
    what: "company site, rebuilt end to end",
    metric: "+40% engagement",
    domain: "digitalfortress.in",
    href: "https://digitalfortress.in",
  },
  {
    name: "CTCAP WIND",
    what: "client site, German consultancy",
    metric: "international client",
    domain: "ctcap-wind.de",
    href: "https://ctcap-wind.de",
  },
];

export type CaseEntry = {
  id: string;
  title: string;
  status: string;
  href: string;
  domain: string;
  summary: string;
  detail: string;
  metrics: { value: string; label: string }[];
  stack: string[];
};

export const caseEntries: CaseEntry[] = [
  {
    id: "cq-hims",
    title: "CQ HIMS",
    status: "In production",
    href: "https://cqhims.in",
    domain: "cqhims.in",
    summary: "Hospitals run their entire operation on it — admissions to payouts.",
    detail:
      "Multi-tenant hospital management SaaS covering 20+ clinical and financial modules. Its payroll engine computes doctor revenue-sharing and pushes automated RazorpayX payouts; WhatsApp automation keeps patients informed; role-based access control and audit trails keep every action accountable — the parts a hospital cannot operate without.",
    metrics: [
      { value: "20+", label: "clinical & financial modules" },
      { value: "Automated", label: "RazorpayX doctor payouts" },
      { value: "Full", label: "RBAC + audit trails" },
    ],
    stack: ["Django", "Next.js", "PostgreSQL", "RazorpayX", "WhatsApp API"],
  },
  {
    id: "ap-cid",
    title: "AP CID Examination Platform",
    status: "In production",
    href: "https://apcid.netlify.app",
    domain: "apcid.netlify.app",
    summary: "India's first real-time online exam platform for CID recruitment.",
    detail:
      "Built for the Andhra Pradesh Crime Investigation Department to move officer recruitment online. It held 1,500+ concurrent candidates on exam day and replaced manual grading with an automated pipeline — results that took hours now land in minutes at 99.9% accuracy, behind JWT auth and role-based access.",
    metrics: [
      { value: "1,500+", label: "concurrent candidates" },
      { value: "99.9%", label: "grading accuracy, hours → minutes" },
      { value: "99.5%", label: "uptime through exam windows" },
    ],
    stack: ["Next.js", "JWT", "RBAC"],
  },
  {
    id: "clinicqueue",
    title: "ClinicQueue",
    status: "In production",
    href: "https://clinicqueuee.vercel.app",
    domain: "clinicqueuee.vercel.app",
    summary: "Clinic management SaaS I build, sell, and support myself.",
    detail:
      "My own product, not client work: clinics get appointment bookings, WhatsApp notifications for patients, and subscription pricing. I handle the whole loop — building the software, selling it to clinics, and keeping paying customers running. It is the closest thing on this page to a founder's job description.",
    metrics: [
      { value: "Mine", label: "built, priced, and sold by me" },
      { value: "WhatsApp", label: "automated patient notifications" },
      { value: "MRR", label: "subscription pricing model" },
    ],
    stack: ["Next.js", "PostgreSQL", "WhatsApp API"],
  },
  {
    id: "digital-fortress",
    title: "Digital Fortress",
    status: "In production",
    href: "https://digitalfortress.in",
    domain: "digitalfortress.in",
    summary: "Company website rebuilt and relaunched end to end. Engagement rose 40%.",
    detail:
      "Took the company's public site from brief to launch alone: rebuilt on Next.js with SEO and performance as first-class requirements, not afterthoughts. Post-launch engagement rose 40% — the site went from a liability to the way clients find them.",
    metrics: [
      { value: "+40%", label: "engagement after relaunch" },
      { value: "Solo", label: "brief → build → launch" },
    ],
    stack: ["Next.js", "SEO", "Performance"],
  },
  {
    id: "ctcap-wind",
    title: "CTCAP Wind",
    status: "In production",
    href: "https://ctcap-wind.de",
    domain: "ctcap-wind.de",
    summary: "Client site for a German wind-energy consultancy — my first international client.",
    detail:
      "CTCAP, a wind-energy consultancy in Germany, handed me their public site and I delivered it end to end — working remotely across time zones, from brief to launch on their own domain. Proof I can be trusted with a client relationship, not just a ticket queue.",
    metrics: [
      { value: "Germany", label: "wind-energy consultancy client" },
      { value: "Remote", label: "delivered across time zones" },
      { value: "Solo", label: "brief → build → launch" },
    ],
    stack: ["Client delivery", "Remote", "ctcap-wind.de"],
  },
];

export const secondaryBuilds: {
  name: string;
  line: string;
  href?: string;
  domain?: string;
}[] = [
  {
    name: "MauthN",
    line: "Passwordless authentication with biometrics — no passwords to phish.",
  },
  {
    name: "DocQuery",
    line: "Document AI that turns PDFs into answerable questions.",
  },
  {
    name: "Site Analytics M3",
    line: "Data platform for civil-engineering site measurements.",
    href: "https://m-analytics-rust.vercel.app",
    domain: "m-analytics-rust.vercel.app",
  },
  {
    name: "Medicare AI",
    line: "AI-assisted medical appointment scheduling.",
  },
  {
    name: "Indominus Labs",
    line: "AI voice agents and a geo-fenced facial-attendance platform — attendance fraud cut 60%.",
    href: "https://indominuslabs.in",
    domain: "indominuslabs.in",
  },
];

export const experience = [
  {
    org: "Blockland India",
    role: "Software Development Engineer",
    period: "Oct 2025 — present",
    line: "Led 4 AI products across web and mobile; cut delivery time 30% by tightening the path from spec to ship.",
  },
  {
    org: "Indominus Labs",
    role: "Full Stack Intern",
    period: "Oct 2023 — Sept 2025",
    line: "Built AI voice agents and a geo-fenced facial-recognition attendance platform that cut attendance fraud 60%.",
  },
  {
    org: "Digital Fortress",
    role: "Intern",
    period: "Jan — Jun 2024",
    line: "Rebuilt the company site end to end (+40% engagement); shipped on AWS and Azure.",
  },
];

export const recognition = [
  {
    title: "Winner — 24hr National Hackathon",
    detail: "AIC ALEAP WE-HUB. Led the team; won a ₹1L startup grant.",
  },
  {
    title: "AWS Academy Graduate",
    detail: "Cloud foundations, credentialed by AWS Academy.",
  },
];

export const tools: { group: string; items: string[] }[] = [
  {
    group: "Ship with daily",
    items: ["TypeScript", "Next.js", "React", "Django", "Python", "Tailwind CSS"],
  },
  {
    group: "Data & auth",
    items: ["PostgreSQL", "JWT", "RBAC", "Audit trails"],
  },
  {
    group: "Infra & integrations",
    items: ["AWS", "Azure", "Vercel", "RazorpayX", "WhatsApp API"],
  },
];
