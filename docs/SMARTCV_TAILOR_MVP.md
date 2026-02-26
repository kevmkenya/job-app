# SmartCV Tailor — MVP Product & Technical Blueprint

## 1) Product Goal

**Positioning statement:**
> Win more interviews by matching your CV to exactly what recruiters and ATS systems scan.

### Success metrics
- Reduce CV tailoring time from ~60 minutes to <10 minutes per application
- Increase keyword match rate to >=80% for tailored CV versions
- Improve interview conversion rate (self-reported) after 30 days

---

## 2) Primary User Journey (Simple)

### Step 1: Create profile
Collect:
- Name
- Career level (entry/mid/senior)
- Industry
- Location
- Years of experience

### Step 2: Upload master CV
Accepted input:
- PDF
- DOCX
- Plain text

Extraction pipeline:
- Skills
- Experience
- Education
- Achievements
- Existing keywords

Stored as:
- **Base CV Profile** (normalized structured resume JSON)

### Step 3: Paste job description
Inputs:
- Job title
- Company
- Full job description

Extraction pipeline:
- Required skills
- Preferred skills
- Action verbs
- Domain keywords
- Tools & technologies
- Years of experience requirements

---

## 3) Core Feature Set

## A. ATS Compliance Checker
Scan CV output for:
- Multi-column layouts
- Tables
- Image-heavy content
- Graphics/icons
- Uncommon fonts
- Missing critical keywords

Output:
- ATS score (0–100)
- Actionable fixes (priority-ordered)

Example:
- “Add 3 missing keywords: Procurement analytics, SAP MM, vendor negotiation.”
- “Replace passive phrase in summary with strong action verb.”
- “Remove table from skills section for ATS safety.”

### Suggested ATS scoring rubric (MVP)
- Formatting safety: 35 points
- Section completeness: 15 points
- Keyword coverage: 30 points
- Readability clarity: 20 points

Total = 100

## B. Keyword Matching Engine
Compare:
- JD keyword set vs CV keyword set

Return:
- Match percentage
- Missing keywords
- Overused generic terms
- High-impact keywords to insert first

Example output:
- Match score: 64%
- Missing: Procurement analytics, SAP MM, vendor negotiation

## C. Auto-Customized CV Generator
Transforms CV by:
- Reordering skills by role relevance
- Updating profile summary for target role
- Prioritizing relevant experience bullets
- Rewriting bullets with action + metric + keyword format

Rewrite pattern:
- Before: “Managed suppliers.”
- After: “Led vendor negotiations and supplier performance management using SAP-based procurement tracking systems.”

## D. Cover Letter Generator
Inputs:
- Job title
- Company name
- Top job requirements

Outputs:
- 3 tones: Professional, Confident, Concise

Template structure:
1. Hook / opening relevance
2. Why candidate fits this specific role
3. Aligned achievements
4. Closing CTA

## E. Resume Score Dashboard
Display in one panel:
- ATS Score
- Keyword Match %
- Readability Score
- Action Verb Strength
- Industry Relevance Score

---

## 4) UX / UI Structure

## Global dashboard
- Create New Application
- My CV Versions
- Saved Jobs
- Match History

## Application workspace tabs
1. Job Description
2. ATS Analysis
3. Customized CV
4. Cover Letter
5. Export

UX principle:
- Keep every primary action <=2 clicks from the current screen.

---

## 5) Export Options
- PDF (ATS-safe single-column template)
- Word (.docx)
- Plain text

---

## 6) Monetization

## Free plan
- 2 CV customizations/month
- Basic ATS checker

## Premium plan
- Unlimited customizations
- Advanced rewrite engine
- Cover letter generation
- CV performance analytics
- Multi-format downloads

---

## 7) Future Enhancements (Post-MVP)
- LinkedIn profile optimizer
- Interview question predictor
- Salary estimator
- Industry keyword trend feed
- Career gap analysis
- Job fit probability scoring

---

## 8) MVP Technical Architecture

## Frontend
- React (recommended)
- Optional alternate client: Flutter

## Backend services
- Resume parser service
- JD parser + keyword extractor
- ATS scoring service
- Rewrite/generation orchestration service
- Export service

## Data layer
- User profiles
- Base CV profiles
- Job descriptions
- CV versions
- Match score history

### Suggested stack (MVP-friendly)
- Frontend: React + TypeScript + Vite
- API: FastAPI (Python) or Node.js (Nest/Express)
- NLP: spaCy / keyBERT + LLM rewrite layer
- DB: PostgreSQL
- Queue (optional for scale): Redis + worker
- Storage: S3-compatible blob store for original uploads

---

## 9) Suggested Data Model (Simplified)

## `users`
- id
- name
- career_level
- industry
- location
- years_experience
- plan_type

## `base_cv_profiles`
- id
- user_id
- raw_text
- parsed_json
- created_at

## `job_descriptions`
- id
- user_id
- job_title
- company
- raw_text
- extracted_json

## `cv_versions`
- id
- user_id
- base_cv_id
- job_description_id
- tailored_text
- ats_score
- keyword_match_score
- readability_score
- action_verb_score
- industry_relevance_score

## `cover_letters`
- id
- cv_version_id
- tone
- content

---

## 10) API Blueprint (MVP)

## Profile & CV
- `POST /profile`
- `POST /cv/upload`
- `GET /cv/:id/parsed`

## Job ingestion
- `POST /jobs`
- `GET /jobs/:id/analysis`

## Analysis & generation
- `POST /analyze/ats`
- `POST /analyze/match`
- `POST /generate/cv`
- `POST /generate/cover-letter`

## Export
- `POST /export/pdf`
- `POST /export/docx`
- `POST /export/txt`

---

## 11) Algorithmic Notes (Practical MVP)

## Keyword extraction
- Normalize text (lowercase, lemmatize, stopword filtering)
- Extract noun phrases + tool names + skills dictionary matches
- Rank by frequency * location weighting (requirements section > company intro)

## Match score (first-pass formula)
`match = 100 * (weighted_jd_keywords_present / total_weighted_jd_keywords)`

Weight suggestion:
- Required skills = 3x
- Preferred skills = 2x
- Action verbs/tools = 1x

## Bullet rewriting rule
Enforce format:
`[Strong Verb] + [Task/Scope] + [Tool/Method] + [Outcome/Metric]`

---

## 12) Delivery Plan

## Milestone 1 (Week 1–2)
- Project scaffolding (frontend + backend)
- Profile form and CV upload
- Basic CV text extraction

## Milestone 2 (Week 3–4)
- JD parsing + keyword extraction
- Match score + missing keyword output
- Simple ATS checks

## Milestone 3 (Week 5–6)
- Tailored CV generation
- Cover letter generation (3 tones)
- Score dashboard + export pipeline

## Milestone 4 (Week 7)
- Free vs premium limits
- Polishing, QA, and analytics events

---

## 13) Guardrails for Product Simplicity
- Never require users to edit raw prompts
- Show one recommended next action at each stage
- Keep outputs editable, not locked
- Prioritize actionable insights over long explanations

**Rule:** if a feature adds complexity without improving interview outcomes, postpone it.
