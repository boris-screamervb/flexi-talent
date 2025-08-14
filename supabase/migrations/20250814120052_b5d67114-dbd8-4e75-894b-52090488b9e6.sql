-- First, update RLS policies to allow public access since authentication is removed

-- Update profiles policies for public access
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

CREATE POLICY "Profiles are publicly viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles can be inserted" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Profiles can be updated" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Profiles can be deleted" ON profiles FOR DELETE USING (true);

-- Update skills policies for public access
DROP POLICY IF EXISTS "Skills are viewable by authenticated users" ON skills;
CREATE POLICY "Skills are publicly viewable" ON skills FOR SELECT USING (true);

-- Update profile_skills policies for public access
DROP POLICY IF EXISTS "Profile skills are viewable by authenticated users" ON profile_skills;
DROP POLICY IF EXISTS "Users can manage their own profile skills" ON profile_skills;

CREATE POLICY "Profile skills are publicly viewable" ON profile_skills FOR SELECT USING (true);
CREATE POLICY "Profile skills can be managed" ON profile_skills FOR ALL USING (true);

-- Insert 30 realistic profiles
INSERT INTO profiles (
  full_name, 
  email, 
  job_title, 
  business_unit, 
  location_city, 
  location_country, 
  languages, 
  availability_percent, 
  availability_earliest_start, 
  open_to_mission,
  notes
) VALUES 
('Sarah Chen', 'sarah.chen@company.com', 'Senior Data Scientist', 'Analytics', 'San Francisco', 'USA', ARRAY['English', 'Mandarin'], 85, '2024-09-01', true, 'Specialized in ML pipelines and cloud deployment'),
('Marcus Johnson', 'marcus.johnson@company.com', 'Cloud Solutions Architect', 'Infrastructure', 'Seattle', 'USA', ARRAY['English'], 70, '2024-10-15', true, 'Expert in Azure and multi-cloud strategies'),
('Elena Rodriguez', 'elena.rodriguez@company.com', 'Cybersecurity Analyst', 'Security', 'Austin', 'USA', ARRAY['English', 'Spanish'], 90, '2024-08-20', false, 'Incident response and threat hunting specialist'),
('David Kim', 'david.kim@company.com', 'Full Stack Developer', 'Engineering', 'New York', 'USA', ARRAY['English', 'Korean'], 60, '2024-11-01', true, 'React and Node.js expertise with microservices'),
('Priya Patel', 'priya.patel@company.com', 'Product Manager', 'Product', 'London', 'UK', ARRAY['English', 'Hindi', 'Gujarati'], 75, '2024-09-15', true, 'Agile product development and stakeholder management'),
('Ahmed Hassan', 'ahmed.hassan@company.com', 'DevOps Engineer', 'Infrastructure', 'Dubai', 'UAE', ARRAY['English', 'Arabic'], 80, '2024-08-30', true, 'Kubernetes and CI/CD pipeline automation'),
('Lisa Wang', 'lisa.wang@company.com', 'UX Designer', 'Design', 'Toronto', 'Canada', ARRAY['English', 'French'], 95, '2024-07-10', false, 'User research and design systems specialist'),
('João Silva', 'joao.silva@company.com', 'Business Analyst', 'Strategy', 'São Paulo', 'Brazil', ARRAY['Portuguese', 'English'], 65, '2024-10-01', true, 'Requirements gathering and process optimization'),
('Anna Kowalski', 'anna.kowalski@company.com', 'QA Engineer', 'Quality', 'Warsaw', 'Poland', ARRAY['Polish', 'English'], 88, '2024-09-05', true, 'Automated testing and performance validation'),
('Raj Sharma', 'raj.sharma@company.com', 'AI Research Engineer', 'R&D', 'Bangalore', 'India', ARRAY['English', 'Hindi'], 72, '2024-11-15', true, 'Deep learning and NLP research applications'),
('Marie Dubois', 'marie.dubois@company.com', 'Scrum Master', 'Agile Office', 'Paris', 'France', ARRAY['French', 'English'], 85, '2024-08-15', false, 'Scaled agile framework and team coaching'),
('Hans Mueller', 'hans.mueller@company.com', 'Embedded Systems Engineer', 'Hardware', 'Munich', 'Germany', ARRAY['German', 'English'], 90, '2024-09-20', true, 'Automotive embedded systems and AUTOSAR'),
('Yuki Tanaka', 'yuki.tanaka@company.com', 'Mobile Developer', 'Mobile', 'Tokyo', 'Japan', ARRAY['Japanese', 'English'], 78, '2024-10-05', true, 'iOS and Android native development'),
('Carlos Mendez', 'carlos.mendez@company.com', 'Data Engineer', 'Analytics', 'Mexico City', 'Mexico', ARRAY['Spanish', 'English'], 83, '2024-09-10', true, 'Big data processing and real-time analytics'),
('Fatima Al-Zahra', 'fatima.alzahra@company.com', 'Security Architect', 'Security', 'Riyadh', 'Saudi Arabia', ARRAY['Arabic', 'English'], 75, '2024-11-01', false, 'Zero-trust architecture and compliance frameworks'),
('Olaf Larsen', 'olaf.larsen@company.com', 'Backend Developer', 'Engineering', 'Stockholm', 'Sweden', ARRAY['Swedish', 'English'], 92, '2024-07-25', true, 'Microservices and distributed systems'),
('Isabella Romano', 'isabella.romano@company.com', 'Project Manager', 'PMO', 'Milan', 'Italy', ARRAY['Italian', 'English'], 68, '2024-10-20', true, 'Cross-functional project delivery and risk management'),
('Chen Wei', 'chen.wei@company.com', 'Machine Learning Engineer', 'AI', 'Singapore', 'Singapore', ARRAY['English', 'Mandarin'], 87, '2024-08-05', true, 'MLOps and model deployment at scale'),
('James O''Connor', 'james.oconnor@company.com', 'Site Reliability Engineer', 'Infrastructure', 'Dublin', 'Ireland', ARRAY['English', 'Irish'], 81, '2024-09-30', true, 'High availability systems and monitoring'),
('Sofia Petrov', 'sofia.petrov@company.com', 'Frontend Developer', 'Engineering', 'Sofia', 'Bulgaria', ARRAY['Bulgarian', 'English'], 79, '2024-10-10', false, 'React ecosystem and modern web technologies'),
('Kumar Gupta', 'kumar.gupta@company.com', 'Database Administrator', 'Data', 'Hyderabad', 'India', ARRAY['English', 'Telugu'], 94, '2024-08-12', true, 'PostgreSQL optimization and data architecture'),
('Natasha Volkov', 'natasha.volkov@company.com', 'Technical Writer', 'Documentation', 'Kiev', 'Ukraine', ARRAY['Ukrainian', 'Russian', 'English'], 76, '2024-09-25', true, 'API documentation and developer experience'),
('Roberto Gomez', 'roberto.gomez@company.com', 'Network Engineer', 'Infrastructure', 'Madrid', 'Spain', ARRAY['Spanish', 'English'], 89, '2024-07-30', false, 'SD-WAN and network security implementation'),
('Aisha Mohammed', 'aisha.mohammed@company.com', 'Performance Test Engineer', 'Quality', 'Lagos', 'Nigeria', ARRAY['English', 'Yoruba'], 82, '2024-10-08', true, 'Load testing and application performance optimization'),
('Lars Nielsen', 'lars.nielsen@company.com', 'Solutions Engineer', 'Sales Engineering', 'Copenhagen', 'Denmark', ARRAY['Danish', 'English'], 73, '2024-11-05', true, 'Technical pre-sales and proof-of-concept development'),
('Maya Singh', 'maya.singh@company.com', 'Blockchain Developer', 'Innovation', 'Vancouver', 'Canada', ARRAY['English', 'Punjabi'], 86, '2024-09-12', true, 'Smart contracts and DeFi protocol development'),
('Victor Petrov', 'victor.petrov@company.com', 'Infrastructure Engineer', 'Cloud', 'Bucharest', 'Romania', ARRAY['Romanian', 'English'], 91, '2024-08-18', false, 'Terraform automation and container orchestration'),
('Leila Nasiri', 'leila.nasiri@company.com', 'Data Analyst', 'Business Intelligence', 'Tehran', 'Iran', ARRAY['Persian', 'English'], 77, '2024-10-12', true, 'Business intelligence and data visualization'),
('Mikhail Volkov', 'mikhail.volkov@company.com', 'Game Developer', 'Entertainment', 'Moscow', 'Russia', ARRAY['Russian', 'English'], 84, '2024-09-08', true, 'Unity3D and game engine optimization'),
('Grace Liu', 'grace.liu@company.com', 'Research Scientist', 'R&D', 'Shenzhen', 'China', ARRAY['Mandarin', 'English'], 88, '2024-07-20', false, 'Computer vision and autonomous systems research');

-- Now populate profile_skills with realistic skill assignments
-- Get some skill IDs first, then assign them to profiles

-- Data Science skills for Sarah Chen, Raj Sharma, Chen Wei
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 5, '2024-07-15', true, 'Led ML pipeline implementation for customer segmentation'
FROM profiles p, skills s 
WHERE p.email = 'sarah.chen@company.com' AND s.name = 'Python';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 5, 6, '2024-07-20', true, 'Advanced statistical modeling and hypothesis testing'
FROM profiles p, skills s 
WHERE p.email = 'sarah.chen@company.com' AND s.name = 'scikit-learn';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 3, 3, '2024-06-10', false, 'Experience with real-time data processing'
FROM profiles p, skills s 
WHERE p.email = 'sarah.chen@company.com' AND s.name = 'Spark';

-- Cloud skills for Marcus Johnson, Ahmed Hassan
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 5, 8, '2024-07-25', true, 'Azure Solutions Architect Expert certified'
FROM profiles p, skills s 
WHERE p.email = 'marcus.johnson@company.com' AND s.name = 'Azure Core';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 6, '2024-07-20', true, 'Infrastructure as Code for multi-environment deployments'
FROM profiles p, skills s 
WHERE p.email = 'marcus.johnson@company.com' AND s.name = 'Terraform';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 5, '2024-07-22', false, 'Container orchestration at enterprise scale'
FROM profiles p, skills s 
WHERE p.email = 'marcus.johnson@company.com' AND s.name = 'Kubernetes';

-- Cybersecurity skills for Elena Rodriguez, Fatima Al-Zahra
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 4, '2024-07-18', true, 'CISSP certified, led incident response team'
FROM profiles p, skills s 
WHERE p.email = 'elena.rodriguez@company.com' AND s.name = 'Incident Response';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 5, 6, '2024-07-19', true, 'Microsoft Sentinel deployment and custom rules'
FROM profiles p, skills s 
WHERE p.email = 'elena.rodriguez@company.com' AND s.name = 'Microsoft Sentinel';

-- Web development skills for David Kim, Sofia Petrov
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 5, 7, '2024-07-23', false, 'Built multiple production React applications'
FROM profiles p, skills s 
WHERE p.email = 'david.kim@company.com' AND s.name = 'React';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 5, '2024-07-22', false, 'RESTful API design and GraphQL implementation'
FROM profiles p, skills s 
WHERE p.email = 'david.kim@company.com' AND s.name = 'Node.js';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 6, '2024-07-21', false, 'Modern TypeScript with advanced type patterns'
FROM profiles p, skills s 
WHERE p.email = 'david.kim@company.com' AND s.name = 'TypeScript';

-- Add more skills for various profiles
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 3, 4, '2024-07-10', true, 'Agile transformation for 5 development teams'
FROM profiles p, skills s 
WHERE p.email = 'priya.patel@company.com' AND s.name = 'Agile Scrum';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 5, '2024-07-15', false, 'Product roadmapping and feature prioritization'
FROM profiles p, skills s 
WHERE p.email = 'priya.patel@company.com' AND s.name = 'Roadmapping';

-- DevOps skills for Ahmed Hassan, James O'Connor
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 5, 6, '2024-07-24', true, 'CKA certified, managed 50+ node clusters'
FROM profiles p, skills s 
WHERE p.email = 'ahmed.hassan@company.com' AND s.name = 'Kubernetes';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 5, '2024-07-23', false, 'CI/CD pipeline optimization and deployment automation'
FROM profiles p, skills s 
WHERE p.email = 'ahmed.hassan@company.com' AND s.name = 'CI/CD';

-- QA skills for Anna Kowalski, Aisha Mohammed
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 4, '2024-07-17', false, 'Automated test suite for microservices architecture'
FROM profiles p, skills s 
WHERE p.email = 'anna.kowalski@company.com' AND s.name = 'Test Automation';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 3, 3, '2024-07-12', false, 'End-to-end testing framework implementation'
FROM profiles p, skills s 
WHERE p.email = 'anna.kowalski@company.com' AND s.name = 'Selenium';

-- AI/ML skills for Raj Sharma, Chen Wei
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 5, 7, '2024-07-20', true, 'Published research in NLP and transformer models'
FROM profiles p, skills s 
WHERE p.email = 'raj.sharma@company.com' AND s.name = 'TensorFlow';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 5, '2024-07-18', false, 'Production ML model deployment and monitoring'
FROM profiles p, skills s 
WHERE p.email = 'raj.sharma@company.com' AND s.name = 'MLOps';

-- Embedded systems for Hans Mueller
INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 5, 10, '2024-07-22', true, 'Automotive ECU development with ISO 26262'
FROM profiles p, skills s 
WHERE p.email = 'hans.mueller@company.com' AND s.name = 'C';

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_experience, last_used, certified, evidence_note)
SELECT p.id, s.id, 4, 8, '2024-07-20', true, 'AUTOSAR Classic and Adaptive Platform experience'
FROM profiles p, skills s 
WHERE p.email = 'hans.mueller@company.com' AND s.name = 'AUTOSAR';

-- Add a few HR emails for testing admin functionality
INSERT INTO hr_emails (email) VALUES 
('admin@company.com'),
('hr.manager@company.com'),
('elena.rodriguez@company.com');

-- Add some audit log entries
INSERT INTO audit_log (event, payload) VALUES 
('ProfileCreated', '{"profile_id": "123", "user": "sarah.chen@company.com"}'),
('SkillAdded', '{"profile_id": "123", "skill": "Python", "level": 4}'),
('ProfileUpdated', '{"profile_id": "456", "changes": ["availability_percent"]}');