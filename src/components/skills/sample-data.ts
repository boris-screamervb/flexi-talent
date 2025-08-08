export type SkillCategory =
  | "Data/AI"
  | "Cyber"
  | "Cloud/Infra"
  | "Web"
  | "Embedded"
  | "PM/BA"
  | "QA"
  | "Other";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  is_active: boolean;
}

export interface ProfileSkill {
  skill_id: string;
  proficiency_level: number; // 1-5
  years_experience?: number;
  last_used?: string; // ISO date
  certified?: boolean;
  evidence_note?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  job_title?: string;
  business_unit?: string;
  location_city?: string;
  location_country?: string;
  languages?: string[];
  availability_percent?: number; // 0-100
  availability_earliest_start?: string; // ISO date
  availability_notes?: string;
  open_to_mission?: boolean;
  last_updated?: string; // ISO date
  skills: ProfileSkill[];
}

// Helper to make ids deterministic for demo
const id = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const makeSkill = (name: string, category: SkillCategory): Skill => ({
  id: id(name),
  name,
  category,
  is_active: true,
});

export const skillsCatalog: Skill[] = [
  ...[
    "Python","R","SQL","Spark","Databricks","Pandas","scikit-learn","TensorFlow","PyTorch","MLflow","MLOps","Data Engineering","Power BI","Azure ML","Prompt Engineering","LLM Fine-tuning","LangChain","Vector DBs",
  ].map((name) => makeSkill(name, "Data/AI")),
  ...[
    "ISO 27001","NIST CSF","SOC 2","IAM","PAM","Microsoft Sentinel","EDR","Threat Modeling","DevSecOps","Secure SDLC","Cloud Security (Azure)","Pen Testing","Incident Response",
  ].map((name) => makeSkill(name, "Cyber")),
  ...[
    "Azure Core","Azure DevOps","Terraform","Docker","Kubernetes","Linux Admin","Windows Server","Networking","Azure Functions","APIM","CI/CD","Monitoring (AppInsights)",
  ].map((name) => makeSkill(name, "Cloud/Infra")),
  ...[
    "JavaScript","TypeScript","React","Angular","Node.js",".NET (ASP.NET Core)","Java Spring","REST APIs","GraphQL","PostgreSQL","Redis","Microservices","OAuth/OIDC",
  ].map((name) => makeSkill(name, "Web")),
  ...[
    "Agile Scrum","Kanban","Jira","Confluence","Requirements","Stakeholder Mgmt","Roadmapping","Risk Mgmt",
  ].map((name) => makeSkill(name, "PM/BA")),
  ...[
    "Test Strategy","Test Automation","Selenium","Cypress","Playwright","Unit/Integration/E2E","Performance Testing","API Testing","ISTQB",
  ].map((name) => makeSkill(name, "QA")),
];

export const demoProfiles: Profile[] = [
  {
    id: id("Alice Johnson"),
    full_name: "Alice Johnson",
    email: "alice@example.com",
    job_title: "Senior Data Scientist",
    business_unit: "Analytics",
    location_city: "Berlin",
    location_country: "DE",
    languages: ["EN", "DE"],
    availability_percent: 60,
    availability_earliest_start: new Date().toISOString().slice(0,10),
    open_to_mission: true,
    last_updated: new Date(Date.now() - 20*24*3600*1000).toISOString(),
    skills: [
      { skill_id: id("Python"), proficiency_level: 5, years_experience: 8, certified: true },
      { skill_id: id("Pandas"), proficiency_level: 5, years_experience: 7 },
      { skill_id: id("scikit-learn"), proficiency_level: 4, years_experience: 6 },
      { skill_id: id("SQL"), proficiency_level: 4, years_experience: 9 },
      { skill_id: id("TensorFlow"), proficiency_level: 3 },
      { skill_id: id("Azure ML"), proficiency_level: 3 },
    ],
  },
  {
    id: id("Bob Smith"),
    full_name: "Bob Smith",
    email: "bob@example.com",
    job_title: "Cloud Engineer",
    business_unit: "Platform",
    location_city: "Paris",
    location_country: "FR",
    languages: ["EN", "FR"],
    availability_percent: 80,
    availability_earliest_start: new Date(Date.now() + 14*24*3600*1000).toISOString().slice(0,10),
    open_to_mission: false,
    last_updated: new Date(Date.now() - 120*24*3600*1000).toISOString(),
    skills: [
      { skill_id: id("Azure Core"), proficiency_level: 4, years_experience: 5 },
      { skill_id: id("Terraform"), proficiency_level: 4, years_experience: 4 },
      { skill_id: id("Kubernetes"), proficiency_level: 3 },
      { skill_id: id("Docker"), proficiency_level: 5 },
      { skill_id: id("Monitoring (AppInsights)"), proficiency_level: 3 },
    ],
  },
  {
    id: id("Carol Lee"),
    full_name: "Carol Lee",
    email: "carol@example.com",
    job_title: "Fullstack Developer",
    business_unit: "Web Apps",
    location_city: "London",
    location_country: "UK",
    languages: ["EN"],
    availability_percent: 40,
    availability_earliest_start: new Date().toISOString().slice(0,10),
    open_to_mission: true,
    last_updated: new Date(Date.now() - 5*24*3600*1000).toISOString(),
    skills: [
      { skill_id: id("TypeScript"), proficiency_level: 4 },
      { skill_id: id("React"), proficiency_level: 4 },
      { skill_id: id("Node.js"), proficiency_level: 3 },
      { skill_id: id("PostgreSQL"), proficiency_level: 3 },
      { skill_id: id("REST APIs"), proficiency_level: 4 },
    ],
  },
];
