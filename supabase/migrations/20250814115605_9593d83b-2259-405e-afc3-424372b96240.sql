-- Fix database schema to match Phase-0 specification exactly

-- Update profiles table to match specification
ALTER TABLE public.profiles 
RENAME COLUMN availability_pct TO availability_percent;

ALTER TABLE public.profiles 
RENAME COLUMN earliest_start TO availability_earliest_start;

ALTER TABLE public.profiles 
RENAME COLUMN city TO location_city;

ALTER TABLE public.profiles 
RENAME COLUMN country TO location_country;

ALTER TABLE public.profiles 
RENAME COLUMN updated_at TO last_updated;

-- Update profile_skills table to match specification  
ALTER TABLE public.profile_skills 
RENAME COLUMN years_of_experience TO years_experience;

ALTER TABLE public.profile_skills 
RENAME COLUMN proficiency TO proficiency_level;

ALTER TABLE public.profile_skills 
DROP COLUMN last_used_year;

ALTER TABLE public.profile_skills 
ADD COLUMN last_used date;

ALTER TABLE public.profile_skills 
ADD COLUMN evidence_note text;

-- Update skills seed data to match comprehensive taxonomy
DELETE FROM public.skills;

INSERT INTO public.skills (name, category) VALUES
-- Data/AI
('Python', 'Data/AI'),
('R', 'Data/AI'),
('SQL', 'Data/AI'),
('Spark', 'Data/AI'),
('Databricks', 'Data/AI'),
('Pandas', 'Data/AI'),
('scikit-learn', 'Data/AI'),
('TensorFlow', 'Data/AI'),
('PyTorch', 'Data/AI'),
('MLflow', 'Data/AI'),
('MLOps', 'Data/AI'),
('Data Engineering', 'Data/AI'),
('Power BI', 'Data/AI'),
('Azure ML', 'Data/AI'),
('Prompt Engineering', 'Data/AI'),
('LLM Fine-tuning', 'Data/AI'),
('LangChain', 'Data/AI'),
('Vector DBs', 'Data/AI'),

-- Cyber
('ISO 27001', 'Cyber'),
('NIST CSF', 'Cyber'),
('SOC 2', 'Cyber'),
('IAM', 'Cyber'),
('PAM', 'Cyber'),
('Microsoft Sentinel', 'Cyber'),
('EDR', 'Cyber'),
('Threat Modeling', 'Cyber'),
('DevSecOps', 'Cyber'),
('Secure SDLC', 'Cyber'),
('Cloud Security (Azure)', 'Cyber'),
('Pen Testing', 'Cyber'),
('Incident Response', 'Cyber'),

-- Cloud/Infra  
('Azure Core', 'Cloud/Infra'),
('Azure DevOps', 'Cloud/Infra'),
('Terraform', 'Cloud/Infra'),
('Bicep/ARM', 'Cloud/Infra'),
('Docker', 'Cloud/Infra'),
('Kubernetes', 'Cloud/Infra'),
('Linux Admin', 'Cloud/Infra'),
('Windows Server', 'Cloud/Infra'),
('Networking', 'Cloud/Infra'),
('VNets', 'Cloud/Infra'),
('Azure Functions', 'Cloud/Infra'),
('APIM', 'Cloud/Infra'),
('CI/CD', 'Cloud/Infra'),
('Monitoring (AppInsights)', 'Cloud/Infra'),

-- Web
('JavaScript', 'Web'),
('TypeScript', 'Web'),
('React', 'Web'),
('Angular', 'Web'),
('Node.js', 'Web'),
('.NET (ASP.NET Core)', 'Web'),
('Java Spring', 'Web'),
('REST APIs', 'Web'),
('GraphQL', 'Web'),
('SQL Server', 'Web'),
('PostgreSQL', 'Web'),
('Redis', 'Web'),
('Microservices', 'Web'),
('OAuth/OIDC', 'Web'),

-- Embedded
('C', 'Embedded'),
('C++', 'Embedded'),
('RTOS', 'Embedded'),
('Embedded Linux', 'Embedded'),
('CAN/LIN', 'Embedded'),
('AUTOSAR', 'Embedded'),
('Yocto', 'Embedded'),
('MCU Programming', 'Embedded'),
('BSP', 'Embedded'),
('Drivers', 'Embedded'),
('HW/SW Integration', 'Embedded'),
('ISO 26262', 'Embedded'),
('MISRA C', 'Embedded'),

-- PM/BA
('Agile Scrum', 'PM/BA'),
('Kanban', 'PM/BA'),
('Jira', 'PM/BA'),
('Confluence', 'PM/BA'),
('Requirements', 'PM/BA'),
('Stakeholder Mgmt', 'PM/BA'),
('Roadmapping', 'PM/BA'),
('Costing', 'PM/BA'),
('Risk Mgmt', 'PM/BA'),
('Vendor Mgmt', 'PM/BA'),

-- QA
('Test Strategy', 'QA'),
('Test Automation', 'QA'),
('Selenium', 'QA'),
('Cypress', 'QA'),
('Playwright', 'QA'),
('Unit/Integration/E2E', 'QA'),
('Performance Testing', 'QA'),
('API Testing', 'QA'),
('TestRail', 'QA'),
('ISTQB', 'QA');