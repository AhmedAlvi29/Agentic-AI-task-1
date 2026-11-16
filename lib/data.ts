import type { IconType } from "react-icons";
import {
  SiCss,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiN8N,
  SiNextdotjs,
  SiNodedotjs,
  SiOllama,
  SiPhp,
  SiPostman,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import {
  Bot,
  Brain,
  Code2,
  Cpu,
  Lightbulb,
  Palette,
  Plug,
  Server,
  Sparkles,
  Workflow,
  Zap,
  LayoutTemplate,
  Webhook,
  TerminalSquare,
  type LucideIcon,
} from "lucide-react";

/* ============================================================
   EVERYTHING EDITABLE LIVES HERE.
   Anything marked TODO is a placeholder — replace before launch.
   ============================================================ */

export const site = {
  name: "Ahmed Raza",
  role: "Full Stack Developer & AI Engineer",
  // The headline is "Building Digital Experiences Beyond Imagination." split into display lines.
  headline: ["Building", "Digital", "Experiences", "Beyond", "Imagination."],
  subheadline:
    "I build scalable web applications, intelligent AI-powered solutions, and immersive digital experiences.",
  rotatingRoles: [
    "full-stack web apps",
    "AI agents that get work done",
    "automations that save hours",
    "interfaces people remember",
  ],
  // TODO: replace with your real details
  email: "hello@example.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Ahmed Raza is a Full Stack Developer and AI Engineer building scalable web apps, AI agents and immersive digital experiences with Next.js, Node.js and LLMs.",
};

export const socials = {
  // TODO: replace with your real profile URLs
  github: "https://github.com/your-username",
  linkedin: "https://www.linkedin.com/in/your-username",
  fiverr: "https://www.fiverr.com/your-username",
  x: "https://x.com/your-username",
  instagram: "https://www.instagram.com/your-username",
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Journey" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
] as const;

/* ---------------- About ---------------- */
export type Pillar = {
  title: string;
  text: string;
  icon: LucideIcon;
  color: string; // glow color
};

export const pillars: Pillar[] = [
  {
    title: "Full Stack Development",
    text: "Database to pixel: APIs, auth, dashboards and the interfaces on top of them.",
    icon: Server,
    color: "#22d3ee",
  },
  {
    title: "AI Engineering",
    text: "LLM integrations and agents that call tools, follow workflows and ship results.",
    icon: Brain,
    color: "#ff3d9a",
  },
  {
    title: "Modern Web Technologies",
    text: "Next.js, TypeScript and the current ecosystem, used where they actually help.",
    icon: Zap,
    color: "#8b5cf6",
  },
  {
    title: "Problem Solving",
    text: "Break it down, find the real constraint, fix that first.",
    icon: Lightbulb,
    color: "#ff8a3d",
  },
  {
    title: "Creative Development",
    text: "Motion, 3D and details that make a product feel alive.",
    icon: Palette,
    color: "#8dff5a",
  },
];

// TODO: set years to your real number. Counts for tech/projects/certs are computed below.
export const yearsExperience = 3;

/* ---------------- Skills ---------------- */
export type Skill = { name: string; icon: IconType | LucideIcon };
export type SkillGroup = {
  title: string;
  blurb: string;
  color: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    blurb: "Fast, accessible interfaces",
    color: "#22d3ee",
    skills: [
      { name: "HTML", icon: SiHtml5 },
      { name: "CSS", icon: SiCss },
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "React.js", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind CSS", icon: SiTailwindcss },
    ],
  },
  {
    title: "Backend",
    blurb: "APIs that hold up under load",
    color: "#8b5cf6",
    skills: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
      { name: "PHP", icon: SiPhp },
      { name: "REST APIs", icon: Webhook },
    ],
  },
  {
    title: "Database",
    blurb: "Data modelled to last",
    color: "#8dff5a",
    skills: [
      { name: "MongoDB", icon: SiMongodb },
      { name: "MySQL", icon: SiMysql },
      { name: "Firebase", icon: SiFirebase },
    ],
  },
  {
    title: "AI & Automation",
    blurb: "Agents, models, workflows",
    color: "#ff3d9a",
    skills: [
      { name: "Agentic AI", icon: Sparkles },
      { name: "AI Agents", icon: Bot },
      { name: "Ollama", icon: SiOllama },
      { name: "LLM Integration", icon: Cpu },
      { name: "n8n", icon: SiN8N },
    ],
  },
  {
    title: "Tools",
    blurb: "The daily toolkit",
    color: "#ff8a3d",
    skills: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "Docker", icon: SiDocker },
      { name: "VS Code", icon: TerminalSquare },
      { name: "Postman", icon: SiPostman },
    ],
  },
];

export const totalSkills = skillGroups.reduce((n, g) => n + g.skills.length, 0);

/* ---------------- Projects ---------------- */
export type Project = {
  title: string;
  tag: string;
  description: string;
  stack: string[];
  live: string;
  github: string;
  /** Optional real screenshot in /public, e.g. "/projects/nexus.png". Falls back to a generated preview. */
  image?: string;
  colors: [string, string];
  layout: "dashboard" | "social" | "health" | "table";
};

// TODO: confirm descriptions / stacks and replace the demo + GitHub URLs.
export const projects: Project[] = [
  {
    title: "Helplytics AI",
    tag: "AI platform",
    description:
      "An AI-powered platform that turns help and support requests into clear answers and insight.",
    stack: ["Next.js", "TypeScript", "Node.js", "LLM APIs", "MongoDB"],
    live: "https://example.com/helplytics-ai",
    github: "https://github.com/your-username/helplytics-ai",
    colors: ["#8b5cf6", "#22d3ee"],
    layout: "dashboard",
  },
  {
    title: "Nexus",
    tag: "Social network",
    description:
      "A modern social networking application with profiles, feeds and real-time interaction.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Firebase"],
    live: "https://example.com/nexus",
    github: "https://github.com/your-username/nexus",
    colors: ["#ff3d9a", "#ff8a3d"],
    layout: "social",
  },
  {
    title: "Medlink",
    tag: "Healthcare",
    description:
      "A healthcare-related digital platform that connects patients and providers in one place.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "MySQL"],
    live: "https://example.com/medlink",
    github: "https://github.com/your-username/medlink",
    colors: ["#22d3ee", "#8dff5a"],
    layout: "health",
  },
  {
    title: "HR Management System",
    tag: "Business software",
    description:
      "An employee management and HR platform covering records, attendance and day-to-day workflows.",
    stack: ["PHP", "MySQL", "JavaScript", "REST APIs"],
    live: "https://example.com/hr-system",
    github: "https://github.com/your-username/hr-system",
    colors: ["#3b82f6", "#8b5cf6"],
    layout: "table",
  },
];

/* ---------------- Experience ---------------- */
export type TimelineItem = {
  title: string;
  org?: string;
  kind: "Experience" | "Training" | "Certification" | "Learning";
  text: string;
  period?: string;
  color: string;
};

// TODO: add dates (period) once you want them shown.
export const timeline: TimelineItem[] = [
  {
    title: "Full Stack Development",
    kind: "Experience",
    text: "Building and shipping web applications end to end: front end, APIs, databases and deployment.",
    color: "#22d3ee",
  },
  {
    title: "Modern Web Application Development",
    kind: "Training",
    text: "Structured training in modern web application development and current front-end tooling.",
    color: "#8b5cf6",
  },
  {
    title: "Certified Web Developer",
    org: "FGRF",
    kind: "Certification",
    text: "Certification covering the fundamentals and practice of professional web development.",
    color: "#ff8a3d",
  },
  {
    title: "Certified Modern Application Developer",
    org: "SMIT",
    kind: "Certification",
    text: "Certification in modern application development with current frameworks and practices.",
    color: "#ff3d9a",
  },
  {
    title: "Agentic AI Learning Journey",
    kind: "Learning",
    text: "Ongoing work on AI agents, local models with Ollama, LLM integration and n8n automation.",
    period: "Ongoing",
    color: "#8dff5a",
  },
];

export const totalCertifications = timeline.filter(
  (t) => t.kind === "Certification",
).length;

/* ---------------- Services ---------------- */
export type Service = {
  title: string;
  text: string;
  icon: LucideIcon;
  anim: "icon-wiggle" | "icon-spin" | "icon-bob" | "icon-pulse";
  colors: [string, string];
  span: string;
};

export const services: Service[] = [
  {
    title: "Full Stack Web Development",
    text: "Complete products from first sketch to production: interface, API, database and deployment.",
    icon: Code2,
    anim: "icon-wiggle",
    colors: ["#8b5cf6", "#22d3ee"],
    span: "lg:col-span-4",
  },
  {
    title: "AI Solutions & AI Agents",
    text: "Assistants and agents wired into your data and tools, built on LLMs you can trust in production.",
    icon: Bot,
    anim: "icon-bob",
    colors: ["#ff3d9a", "#ff8a3d"],
    span: "lg:col-span-2",
  },
  {
    title: "Frontend Development",
    text: "Responsive, accessible interfaces with polished motion.",
    icon: LayoutTemplate,
    anim: "icon-pulse",
    colors: ["#22d3ee", "#3b82f6"],
    span: "lg:col-span-2",
  },
  {
    title: "Backend Development",
    text: "Secure, well-structured servers, auth and data layers.",
    icon: Server,
    anim: "icon-wiggle",
    colors: ["#8dff5a", "#22d3ee"],
    span: "lg:col-span-2",
  },
  {
    title: "API Development & Integration",
    text: "Clean REST APIs and reliable connections to the services you already use.",
    icon: Plug,
    anim: "icon-bob",
    colors: ["#ff8a3d", "#ff3d9a"],
    span: "lg:col-span-2",
  },
  {
    title: "Business Automation",
    text: "n8n and custom workflows that remove repetitive manual work from your week.",
    icon: Workflow,
    anim: "icon-spin",
    colors: ["#8b5cf6", "#ff3d9a"],
    span: "lg:col-span-6",
  },
];
