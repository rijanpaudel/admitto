-- ============================================
-- STEP 1: Update schema to allow 'university' category
-- ============================================
ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_category_check;

ALTER TABLE resources ADD CONSTRAINT resources_category_check 
  CHECK (category IN ('scholarship', 'visa', 'job', 'accommodation', 'general', 'university'));


-- ============================================
-- STEP 2: Insert all resources
-- ============================================
BEGIN;

-- INSERT SCHOLARSHIPS (10 rows)
INSERT INTO resources (
  title,
  description,
  url,
  category,
  institution,
  amount,
  deadline,
  eligibility,
  tags,
  country,
  metadata,
  last_updated
) VALUES
(
  'Vanier Canada Graduate Scholarships (Vanier CGS)',
  'Prestigious doctoral scholarship recognizing academic excellence, research potential, and leadership. Covers all expenses for PhD studies at Canadian universities.',
  'https://vanier.gc.ca/en/home-accueil.html',
  'scholarship',
  'Government of Canada',
  '$50,000 CAD per year',
  '2025-10-30',
  'Canadian citizens, permanent residents, and international students pursuing first doctoral degree. Must be nominated by Canadian institution.',
  ARRAY['doctoral', 'fully-funded', 'government', 'prestigious', 'research'],
  'Canada',
  '{"duration": "3 years", "total_awards": "166 annually", "application_process": "Nomination through Canadian university, not direct application", "source": "official", "level": "Doctoral (PhD)", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Lester B. Pearson International Scholarship',
  'Full-ride undergraduate scholarship at University of Toronto for exceptional international students demonstrating leadership and academic achievement.',
  'https://future.utoronto.ca/pearson/',
  'scholarship',
  'University of Toronto',
  'Full tuition + books + residence + incidental fees',
  '2026-01-15',
  'International students entering first year from secondary school. Must be nominated by school. GPA 95%+',
  ARRAY['undergraduate', 'fully-funded', 'leadership', 'competitive'],
  'Canada',
  '{"duration": "4 years", "total_awards": "37 scholarships annually", "source": "official", "level": "Undergraduate", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'UBC International Scholars Program (IMES)',
  'Merit-based entrance scholarships for outstanding international students entering UBC from secondary school.',
  'https://you.ubc.ca/financial-planning/scholarships-awards-international-students/',
  'scholarship',
  'University of British Columbia',
  '$10,000 - $20,000 CAD per year',
  '2026-01-15',
  'International students on study permit, entering from secondary school, exceptional academics and extracurriculars',
  ARRAY['undergraduate', 'merit-based', 'renewable'],
  'Canada',
  '{"duration": "Renewable annually based on performance", "source": "official", "level": "Undergraduate", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'University of Calgary International Entrance Scholarship',
  'Automatic consideration for international students admitted to undergraduate programs with strong academic records.',
  'https://www.ucalgary.ca/future-students/undergraduate/awards',
  'scholarship',
  'University of Calgary',
  '$15,000 renewable or $5,000-$10,000 non-renewable',
  '2025-12-01',
  'International students entering first year in Fall term, minimum 95% average',
  ARRAY['undergraduate', 'automatic-consideration', 'entrance'],
  'Canada',
  '{"duration": "1-4 years depending on award", "source": "official", "level": "Undergraduate", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Université de Montréal Exemption Scholarships',
  'Tuition fee exemption allowing international students to pay Quebec resident rates instead of international fees.',
  'https://admission.umontreal.ca/en/awards-and-aid/scholarships-and-financial-aid/exemptions/',
  'scholarship',
  'Université de Montréal',
  'Up to $27,300 CAD per year (tuition difference)',
  '2026-02-01',
  'International students demonstrating academic excellence, French proficiency required for some programs',
  ARRAY['tuition-exemption', 'multilevel', 'francophone'],
  'Canada',
  '{"duration": "Program duration", "source": "official", "level": "Undergraduate/Masters/PhD", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Canadian Francophonie Scholarship Program (CFSP)',
  'Government-funded scholarships for francophone students from developing countries pursuing graduate studies at Canadian universities.',
  'https://www.scholarships-bourses.gc.ca/scholarships-bourses/can/csfp-pcbf.aspx',
  'scholarship',
  'Government of Canada',
  'Full tuition + living allowance + travel',
  NULL,
  'Citizens of francophone developing countries (Nepal qualifies), French proficiency, academic excellence',
  ARRAY['graduate', 'francophone', 'developing-countries', 'fully-funded'],
  'Canada',
  '{"duration": "2-3 years", "deadline_note": "Varies by institution (typically November-January)", "source": "official", "level": "Masters/PhD", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Ontario Graduate Scholarship (OGS)',
  'Merit-based scholarship for graduate students in Ontario universities, open to domestic and international students.',
  'https://osap.gov.on.ca/OSAPPortal/en/A-ZListofAid/PRDR019245.html',
  'scholarship',
  'Ontario Universities',
  '$15,000 CAD per year',
  NULL,
  'Enrolled or applying to Ontario graduate program, minimum A- average, study permit holders eligible',
  ARRAY['graduate', 'provincial', 'merit-based'],
  'Canada',
  '{"duration": "2-3 terms", "deadline_note": "University-specific (typically January-March)", "source": "official", "level": "Masters/PhD", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'University of Waterloo International Master''s/Doctoral Awards',
  'Entrance scholarships for exceptional international graduate students admitted to research-based programs.',
  'https://uwaterloo.ca/graduate-studies-postdoctoral-affairs/awards',
  'scholarship',
  'University of Waterloo',
  '$2,500-$10,000 per term',
  NULL,
  'International students with exceptional academic records entering research-based graduate programs',
  ARRAY['graduate', 'research-based', 'tech-focus'],
  'Canada',
  '{"duration": "Multiple terms", "deadline_note": "Varies by program (typically December-February)", "source": "official", "level": "Masters/PhD", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'University of Winnipeg President''s Scholarship for World Leaders',
  'Leadership-based scholarship for international students demonstrating academic excellence and community engagement.',
  'https://www.uwinnipeg.ca/future-student/paying-for-university/awards.html',
  'scholarship',
  'University of Winnipeg',
  '$5,000 CAD',
  '2026-02-01',
  'International students with leadership experience, minimum 80% average, community service',
  ARRAY['undergraduate', 'leadership', 'one-time'],
  'Canada',
  '{"duration": "1 year", "source": "official", "level": "Undergraduate", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Douglas College International Student Scholarships',
  'Entrance scholarships for international students beginning studies at Douglas College in undergraduate programs.',
  'https://www.douglascollege.ca/programs-and-courses/fees-and-finances/scholarships-and-awards',
  'scholarship',
  'Douglas College',
  'Up to $7,000 CAD',
  '2026-03-31',
  'International students on study permit, minimum 80% average, 5 recipients selected annually',
  ARRAY['undergraduate', 'college', 'limited-spots'],
  'Canada',
  '{"duration": "1 year", "source": "official", "level": "Undergraduate", "last_verified": "2025-11-16"}',
  NOW()
);


-- INSERT UNIVERSITIES (6 rows)
INSERT INTO resources (
  title,
  description,
  url,
  category,
  institution,
  tags,
  country,
  metadata,
  last_updated
) VALUES
(
  'University of Toronto - International Student Programs',
  'Canada''s #1 ranked university offering 700+ undergraduate and 200+ graduate programs. Comprehensive support through Centre for International Experience.',
  'https://www.utoronto.ca/',
  'university',
  'University of Toronto',
  ARRAY['top-ranked', 'research-intensive', 'diverse-programs'],
  'Canada',
  '{"ranking": "1st in Canada, Top 25 globally", "international_students": "25,000+", "popular_programs": ["Computer Science", "Engineering", "Business", "Life Sciences"], "location": "Toronto, Ontario", "tuition_range": "$45,000-$58,000 CAD per year", "application_deadline": "2026-01-15", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'University of British Columbia (UBC) - International Programs',
  'World-renowned research university on Canada''s west coast. Strong co-op programs and international student support services.',
  'https://www.ubc.ca/',
  'university',
  'University of British Columbia',
  ARRAY['research-university', 'beautiful-campus', 'co-op'],
  'Canada',
  '{"ranking": "2nd in Canada", "international_students": "18,000+", "popular_programs": ["Engineering", "Commerce", "Computer Science", "Environmental Science"], "location": "Vancouver, BC", "tuition_range": "$40,000-$56,000 CAD per year", "application_deadline": "2026-01-15", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'McGill University - International Admissions',
  'Premier bilingual university in Montreal with high international student population. Strong reputation for medicine and sciences.',
  'https://www.mcgill.ca/',
  'university',
  'McGill University',
  ARRAY['bilingual', 'historic', 'international-friendly'],
  'Canada',
  '{"ranking": "3rd in Canada", "international_students": "12,000+ (31% of student body)", "popular_programs": ["Medicine", "Law", "Engineering", "Arts"], "location": "Montreal, Quebec", "tuition_range": "$20,000-$50,000 CAD per year", "application_deadline": "2026-01-15", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'University of Waterloo - Co-op Programs',
  'Known for world''s largest co-op program integrating work experience with studies. Tech and engineering powerhouse.',
  'https://uwaterloo.ca/',
  'university',
  'University of Waterloo',
  ARRAY['co-op-leader', 'tech-hub', 'innovation'],
  'Canada',
  '{"ranking": "5th in Canada", "international_students": "8,000+", "popular_programs": ["Computer Science", "Software Engineering", "Mechatronics", "Business"], "location": "Waterloo, Ontario", "tuition_range": "$48,000-$63,000 CAD per year", "application_deadline": "2026-02-01", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'University of Alberta - International Student Services',
  'Top research university with affordable tuition and strong STEM programs. Active international student community.',
  'https://www.ualberta.ca/',
  'university',
  'University of Alberta',
  ARRAY['affordable', 'research-intensive', 'STEM-focused'],
  'Canada',
  '{"ranking": "4th in Canada", "international_students": "7,000+", "popular_programs": ["Engineering", "Business", "Sciences", "Agriculture"], "location": "Edmonton, Alberta", "tuition_range": "$28,000-$35,000 CAD per year", "application_deadline": "2026-03-01", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'McMaster University - International Admissions',
  'Innovative research university known for problem-based learning and health sciences. Strong international exchange programs.',
  'https://www.mcmaster.ca/',
  'university',
  'McMaster University',
  ARRAY['health-sciences', 'research', 'innovative-learning'],
  'Canada',
  '{"ranking": "6th in Canada", "international_students": "5,000+", "popular_programs": ["Health Sciences", "Engineering", "Business", "Sciences"], "location": "Hamilton, Ontario", "tuition_range": "$38,000-$50,000 CAD per year", "application_deadline": "2026-01-16", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
);


-- INSERT VISA RESOURCES (5 rows)
INSERT INTO resources (
  title,
  description,
  url,
  category,
  tags,
  country,
  metadata,
  last_updated
) VALUES
(
  'IRCC - Study Permits Official Guide',
  'Official Government of Canada guide for applying to study permits, including required documents, processing times, and biometrics.',
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html',
  'visa',
  ARRAY['study-permit', 'official', 'government', 'essential'],
  'Canada',
  '{"resource_type": "official-guide", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'EduCanada - Study Permits and Visas',
  'Comprehensive resource explaining study permit requirements, PAL/TAL attestation letters, and visa application process.',
  'https://www.educanada.ca/study-etudes/permits-visas-permis.aspx',
  'visa',
  ARRAY['PAL', 'attestation-letter', 'requirements'],
  'Canada',
  '{"resource_type": "information", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Study Permit Application Portal (IRCC Account)',
  'Online portal where you actually apply for your study permit. Create account and submit application with documents.',
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html',
  'visa',
  ARRAY['application', 'online-portal', 'essential'],
  'Canada',
  '{"resource_type": "application-portal", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Designated Learning Institutions (DLI) List',
  'Official list of Canadian schools approved to host international students. You must be accepted to a DLI to get study permit.',
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html',
  'visa',
  ARRAY['DLI', 'approved-schools', 'verification'],
  'Canada',
  '{"resource_type": "reference-list", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Processing Times for Study Permits',
  'Real-time processing times for study permit applications from Nepal and other countries. Updated weekly.',
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html',
  'visa',
  ARRAY['processing-times', 'tracking', 'timeline'],
  'Canada',
  '{"resource_type": "tool", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
);


-- INSERT JOB RESOURCES (9 rows)
INSERT INTO resources (
  title,
  description,
  url,
  category,
  tags,
  country,
  metadata,
  last_updated
) VALUES
(
  'Job Bank Canada - International Students',
  'Official Government of Canada job board listing opportunities open to international students and work permit holders.',
  'https://www.jobbank.gc.ca/',
  'job',
  ARRAY['official', 'government', 'verified-employers'],
  'Canada',
  '{"job_type": "full-time, part-time, co-op", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Indeed Canada - International Student Jobs',
  'Popular job board with 800+ listings for international students. Filter by student-friendly, part-time, and on-campus positions.',
  'https://ca.indeed.com/International-Student-jobs',
  'job',
  ARRAY['job-board', 'high-volume', 'flexible'],
  'Canada',
  '{"job_type": "part-time, full-time", "source": "verified", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'LinkedIn Canada - Student & Graduate Jobs',
  'Professional networking platform with job listings, internships, and co-op opportunities. Build profile and network with Canadian employers.',
  'https://www.linkedin.com/jobs/',
  'job',
  ARRAY['networking', 'professional', 'career-building'],
  'Canada',
  '{"job_type": "internships, co-op, entry-level", "source": "verified", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'University Career Services - On-Campus Jobs',
  'Every Canadian university has dedicated career services offering on-campus job boards, resume help, and employer connections.',
  'https://www.universitystudy.ca/plan-for-university/student-life-on-campus/on-campus-jobs/',
  'job',
  ARRAY['on-campus', 'student-jobs', 'university'],
  'Canada',
  '{"job_type": "on-campus, work-study", "source": "verified", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Ultimate Recruitment - International Student Specialists',
  'Recruitment agency specializing in helping international students transition from study to work in Canada with immigration support.',
  'https://ultimaterecruitment.ca/',
  'job',
  ARRAY['recruitment-agency', 'specialized', 'immigration-aware'],
  'Canada',
  '{"job_type": "permanent, contract", "source": "verified", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Work Permit Rules for International Students',
  'Official IRCC guide on work eligibility - 20 hours/week during classes, full-time during breaks, no permit needed.',
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work.html',
  'job',
  ARRAY['regulations', 'work-permit', 'official', 'essential'],
  'Canada',
  '{"resource_type": "guide", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Co-op and Internship Programs',
  'Guide to finding co-op placements and internships through university programs, providing paid work experience during studies.',
  'https://www.canada.ca/en/employment-social-development/services/funding/youth-employment-skills.html',
  'job',
  ARRAY['co-op', 'internship', 'work-experience'],
  'Canada',
  '{"job_type": "co-op, internship", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Post-Graduation Work Permit (PGWP) Information',
  'Essential information about getting work permit after graduation - up to 3 years, pathway to permanent residence.',
  'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html',
  'job',
  ARRAY['PGWP', 'post-graduation', 'permanent-residence-pathway'],
  'Canada',
  '{"resource_type": "guide", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
),
(
  'Canadian Resume and Interview Guide',
  'How to format resumes for Canadian employers, cover letter writing, and interview preparation specific to Canada.',
  'https://www.jobbank.gc.ca/findajob/resources',
  'job',
  ARRAY['resume', 'interview-prep', 'canadian-standards'],
  'Canada',
  '{"resource_type": "career-guide", "source": "official", "last_verified": "2025-11-16"}',
  NOW()
);

COMMIT;