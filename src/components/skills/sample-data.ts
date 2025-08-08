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

export const demoProfiles: Profile[] = (() => {
  const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 3600 * 1000).toISOString();
  const inDays = (d: number) => new Date(Date.now() + d * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const p = (
    full_name: string,
    data: {
      job_title: string;
      business_unit: string;
      location_city: string;
      location_country: string;
      languages: string[];
      availability_percent: number;
      open_to_mission: boolean;
      last_updated_days_ago: number;
      earliest_start_in_days?: number;
      skills: string[];
    }
  ): Profile => ({
    id: id(full_name),
    full_name,
    email: `${id(full_name)}@example.com`,
    job_title: data.job_title,
    business_unit: data.business_unit,
    location_city: data.location_city,
    location_country: data.location_country,
    languages: data.languages,
    availability_percent: data.availability_percent,
    availability_earliest_start: inDays(data.earliest_start_in_days ?? 0),
    open_to_mission: data.open_to_mission,
    last_updated: daysAgo(data.last_updated_days_ago),
    skills: data.skills.map((n, i) => ({
      skill_id: id(n),
      proficiency_level: Math.min(5, 3 + (i % 3)),
      years_experience: 1 + (i % 6),
    })),
  });

  return [
    p("Alice Johnson", { job_title: "Senior Data Scientist", business_unit: "Analytics", location_city: "Berlin", location_country: "DE", languages: ["EN","DE"], availability_percent: 60, open_to_mission: true, last_updated_days_ago: 20, skills: ["Python","Pandas","scikit-learn","SQL","TensorFlow","Azure ML"] }),
    p("Bob Smith", { job_title: "Cloud Engineer", business_unit: "Platform", location_city: "Paris", location_country: "FR", languages: ["EN","FR"], availability_percent: 80, open_to_mission: false, last_updated_days_ago: 120, earliest_start_in_days: 14, skills: ["Azure Core","Terraform","Kubernetes","Docker","Monitoring (AppInsights)"] }),
    p("Carol Lee", { job_title: "Fullstack Developer", business_unit: "Web Apps", location_city: "London", location_country: "UK", languages: ["EN"], availability_percent: 40, open_to_mission: true, last_updated_days_ago: 5, skills: ["TypeScript","React","Node.js","PostgreSQL","REST APIs"] }),
    p("David Kim", { job_title: "Frontend Engineer", business_unit: "Web Apps", location_city: "Seoul", location_country: "KR", languages: ["EN","KO"], availability_percent: 70, open_to_mission: true, last_updated_days_ago: 14, skills: ["JavaScript","React","GraphQL","Cypress","Playwright"] }),
    p("Elena Garcia", { job_title: "Cybersecurity Analyst", business_unit: "Security", location_city: "Madrid", location_country: "ES", languages: ["ES","EN"], availability_percent: 50, open_to_mission: true, last_updated_days_ago: 30, skills: ["ISO 27001","SOC 2","IAM","Microsoft Sentinel","Incident Response"] }),
    p("Faisal Khan", { job_title: "ML Engineer", business_unit: "AI Lab", location_city: "Dubai", location_country: "AE", languages: ["EN","AR"], availability_percent: 90, open_to_mission: true, last_updated_days_ago: 10, skills: ["MLOps","MLflow","Databricks","Spark","Vector DBs"] }),
    p("Giulia Rossi", { job_title: "Backend Developer", business_unit: "Web Platform", location_city: "Rome", location_country: "IT", languages: ["IT","EN"], availability_percent: 30, open_to_mission: false, last_updated_days_ago: 45, skills: ["Java Spring","REST APIs","PostgreSQL","Redis","OAuth/OIDC"] }),
    p("Hugo Martin", { job_title: "DevOps Engineer", business_unit: "Platform", location_city: "Lyon", location_country: "FR", languages: ["FR","EN"], availability_percent: 100, open_to_mission: true, last_updated_days_ago: 2, skills: ["Azure DevOps","CI/CD","Docker","Kubernetes","Terraform"] }),
    p("Ines Lopez", { job_title: "Product Manager", business_unit: "Digital", location_city: "Lisbon", location_country: "PT", languages: ["PT","EN"], availability_percent: 20, open_to_mission: false, last_updated_days_ago: 90, skills: ["Agile Scrum","Roadmapping","Stakeholder Mgmt","Jira","Requirements"] }),
    p("Jonas Müller", { job_title: "QA Engineer", business_unit: "Quality", location_city: "Munich", location_country: "DE", languages: ["DE","EN"], availability_percent: 60, open_to_mission: true, last_updated_days_ago: 7, skills: ["Test Automation","Playwright","API Testing","ISTQB","Performance Testing"] }),
    p("Karin Svensson", { job_title: "UX-minded Frontend Dev", business_unit: "Web", location_city: "Stockholm", location_country: "SE", languages: ["SV","EN"], availability_percent: 50, open_to_mission: true, last_updated_days_ago: 21, skills: ["TypeScript","React","GraphQL","Cypress","REST APIs"] }),
    p("Liam O'Connor", { job_title: ".NET Developer", business_unit: "Web", location_city: "Dublin", location_country: "IE", languages: ["EN"], availability_percent: 40, open_to_mission: true, last_updated_days_ago: 60, skills: [".NET (ASP.NET Core)","REST APIs","Azure Functions","APIM","SQL"] }),
    p("Mia Nguyen", { job_title: "Data Engineer", business_unit: "Analytics", location_city: "Hanoi", location_country: "VN", languages: ["VI","EN"], availability_percent: 80, open_to_mission: true, last_updated_days_ago: 12, skills: ["Data Engineering","Spark","Python","SQL","Azure Core"] }),
    p("Noah Brown", { job_title: "Security Engineer", business_unit: "Security", location_city: "Austin", location_country: "US", languages: ["EN"], availability_percent: 70, open_to_mission: false, last_updated_days_ago: 28, skills: ["Threat Modeling","DevSecOps","Secure SDLC","Cloud Security (Azure)","PAM"] }),
    p("Olivia Perez", { job_title: "QA Lead", business_unit: "Quality", location_city: "Mexico City", location_country: "MX", languages: ["ES","EN"], availability_percent: 60, open_to_mission: true, last_updated_days_ago: 8, skills: ["Test Strategy","Selenium","Unit/Integration/E2E","API Testing","Cypress"] }),
    p("Pedro Silva", { job_title: "Cloud Architect", business_unit: "Platform", location_city: "Porto", location_country: "PT", languages: ["PT","EN"], availability_percent: 30, open_to_mission: true, last_updated_days_ago: 18, skills: ["Azure Core","Kubernetes","Networking","Windows Server","Linux Admin"] }),
    p("Qin Wang", { job_title: "AI Researcher", business_unit: "AI Lab", location_city: "Shanghai", location_country: "CN", languages: ["ZH","EN"], availability_percent: 50, open_to_mission: true, last_updated_days_ago: 3, skills: ["LLM Fine-tuning","Prompt Engineering","LangChain","Vector DBs","PyTorch"] }),
    p("Riya Patel", { job_title: "Business Analyst", business_unit: "Digital", location_city: "Mumbai", location_country: "IN", languages: ["HI","EN"], availability_percent: 40, open_to_mission: false, last_updated_days_ago: 75, skills: ["Requirements","Stakeholder Mgmt","Kanban","Confluence","Agile Scrum"] }),
    p("Sara Ahmed", { job_title: "Fullstack Engineer", business_unit: "Web", location_city: "Cairo", location_country: "EG", languages: ["AR","EN"], availability_percent: 90, open_to_mission: true, last_updated_days_ago: 1, skills: ["JavaScript","React","Node.js","PostgreSQL","Microservices"] }),
    p("Tom Becker", { job_title: "SRE", business_unit: "Platform", location_city: "Zurich", location_country: "CH", languages: ["DE","EN"], availability_percent: 70, open_to_mission: true, last_updated_days_ago: 34, skills: ["Monitoring (AppInsights)","CI/CD","Docker","Kubernetes","Terraform"] }),
    p("Ugo Dubois", { job_title: "Pentester", business_unit: "Security", location_city: "Brussels", location_country: "BE", languages: ["FR","EN"], availability_percent: 20, open_to_mission: false, last_updated_days_ago: 55, skills: ["Pen Testing","EDR","Incident Response","SOC 2","ISO 27001"] }),
  ];
})();
