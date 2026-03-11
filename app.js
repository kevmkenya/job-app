const els = {
  candidateName: document.getElementById('candidateName'),
  targetRole: document.getElementById('targetRole'),
  experienceYears: document.getElementById('experienceYears'),
  resumeInput: document.getElementById('resumeInput'),
  jobInput: document.getElementById('jobInput'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  generateBtn: document.getElementById('generateBtn'),
  scoreCircle: document.getElementById('scoreCircle'),
  scoreSummary: document.getElementById('scoreSummary'),
  missingKeywords: document.getElementById('missingKeywords'),
  matchedKeywords: document.getElementById('matchedKeywords'),
  tailoredBullets: document.getElementById('tailoredBullets'),
  coverLetter: document.getElementById('coverLetter'),
  interviewQuestions: document.getElementById('interviewQuestions'),
  copyBulletsBtn: document.getElementById('copyBulletsBtn'),
  copyCoverBtn: document.getElementById('copyCoverBtn'),
  copyInterviewBtn: document.getElementById('copyInterviewBtn'),
  companyName: document.getElementById('companyName'),
  applicationRole: document.getElementById('applicationRole'),
  applicationStatus: document.getElementById('applicationStatus'),
  addApplicationBtn: document.getElementById('addApplicationBtn'),
  applicationTableBody: document.getElementById('applicationTableBody'),
  exportBtn: document.getElementById('exportBtn'),
  loadSampleBtn: document.getElementById('loadSampleBtn')
};

const stopWords = new Set(['and', 'the', 'with', 'for', 'you', 'our', 'that', 'are', 'from', 'have', 'will', 'your', 'this', 'a', 'to', 'of', 'in', 'on', 'is']);
const state = { applications: [] };

function tokenize(text) {
  return [...new Set((text.toLowerCase().match(/[a-z][a-z+\-]{2,}/g) || []).filter((w) => !stopWords.has(w)))];
}

function scoreMatch(resume, job) {
  const resumeWords = tokenize(resume);
  const jobWords = tokenize(job);
  const matched = jobWords.filter((w) => resumeWords.includes(w));
  const missing = jobWords.filter((w) => !resumeWords.includes(w)).slice(0, 20);
  const score = jobWords.length ? Math.round((matched.length / jobWords.length) * 100) : 0;
  return { matched, missing, score, total: jobWords.length };
}

function renderKeywordList(container, items) {
  container.innerHTML = '';
  if (!items.length) {
    const li = document.createElement('li');
    li.textContent = 'None';
    container.appendChild(li);
    return;
  }
  items.slice(0, 20).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    container.appendChild(li);
  });
}

function scoreColor(score) {
  if (score >= 75) return ['#16a34a', '#10b981'];
  if (score >= 50) return ['#ca8a04', '#f59e0b'];
  return ['#b91c1c', '#ef4444'];
}

function buildBullets(role, years, missing) {
  const focus = missing.slice(0, 5);
  return [
    `• Delivered measurable outcomes as a ${role || 'professional'} across ${years || 0}+ years using data-driven planning and cross-functional execution.`,
    `• Improved team delivery velocity by introducing process automation, stakeholder alignment cadences, and KPI-based decision making.`,
    `• Built executive-ready reporting that translated complex analysis into action plans and reduced turnaround time for critical initiatives.`,
    `• Tailored achievements to role priorities including ${focus.join(', ') || 'leadership, strategy, and execution'}.`,
    `• Partnered with product, engineering, and operations teams to launch high-impact initiatives on time and within scope.`
  ].join('\n');
}

function buildCoverLetter(name, role, company = 'the company') {
  return `Dear Hiring Manager,\n\nI am excited to apply for the ${role || 'position'} role at ${company}. With a track record of driving measurable outcomes through execution discipline, collaboration, and customer focus, I believe I can add immediate value to your team.\n\nIn my recent work, I have led cross-functional initiatives, used data to prioritize opportunities, and delivered projects with strong business impact. I am particularly drawn to this role because it combines strategic thinking with hands-on delivery.\n\nI would welcome the chance to discuss how my background aligns with your goals. Thank you for your time and consideration.\n\nSincerely,\n${name || 'Your Name'}`;
}

function buildInterviewQuestions(role, missing) {
  const keywordQuestions = missing.slice(0, 4).map((word, i) => `${i + 1}. Describe a time you demonstrated ${word} in a high-pressure project.`);
  return [
    `Role: ${role || 'Target role'} interview prep`,
    'Core questions:',
    '1. Tell me about your most relevant achievement and its measurable impact.',
    '2. How do you prioritize when goals conflict across stakeholders?',
    '3. Share a time you handled ambiguity and delivered results.',
    '4. What would your 30-60-90 day plan look like in this role?',
    ...keywordQuestions
  ].join('\n');
}

function analyze() {
  const result = scoreMatch(els.resumeInput.value, els.jobInput.value);
  els.scoreCircle.textContent = `${result.score}%`;
  const [c1, c2] = scoreColor(result.score);
  els.scoreCircle.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  els.scoreSummary.textContent = `Matched ${result.matched.length} of ${result.total} meaningful job keywords.`;
  renderKeywordList(els.matchedKeywords, result.matched);
  renderKeywordList(els.missingKeywords, result.missing);
  return result;
}

function generateAssets() {
  const analysis = analyze();
  const role = els.targetRole.value;
  const years = els.experienceYears.value;
  els.tailoredBullets.value = buildBullets(role, years, analysis.missing);
  els.coverLetter.value = buildCoverLetter(els.candidateName.value, role);
  els.interviewQuestions.value = buildInterviewQuestions(role, analysis.missing);
}

function copyFrom(element) {
  navigator.clipboard.writeText(element.value || '').catch(() => {});
}

function addApplication() {
  const company = els.companyName.value.trim();
  const role = els.applicationRole.value.trim();
  if (!company || !role) return;
  state.applications.unshift({
    company,
    role,
    status: els.applicationStatus.value,
    date: new Date().toISOString().split('T')[0]
  });
  renderApplications();
  els.companyName.value = '';
  els.applicationRole.value = '';
}

function renderApplications() {
  els.applicationTableBody.innerHTML = '';
  state.applications.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.company}</td><td>${item.role}</td><td>${item.status}</td><td>${item.date}</td>`;
    els.applicationTableBody.appendChild(tr);
  });
}

function exportSession() {
  const payload = {
    profile: {
      name: els.candidateName.value,
      role: els.targetRole.value,
      experienceYears: els.experienceYears.value
    },
    resume: els.resumeInput.value,
    jobDescription: els.jobInput.value,
    outputs: {
      bullets: els.tailoredBullets.value,
      coverLetter: els.coverLetter.value,
      interviewQuestions: els.interviewQuestions.value
    },
    applications: state.applications
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'smartcv-session.json';
  a.click();
  URL.revokeObjectURL(url);
}

function loadSample() {
  els.candidateName.value = 'Alex Johnson';
  els.targetRole.value = 'Product Manager';
  els.experienceYears.value = 6;
  els.resumeInput.value = 'Product manager with experience in agile delivery, roadmap planning, stakeholder communication, analytics, A/B testing, and cross-functional leadership. Drove a 25% increase in user activation and reduced churn by 12%.';
  els.jobInput.value = 'We are hiring a product manager to lead roadmap execution, customer research, SQL analytics, experimentation, KPI tracking, backlog refinement, go-to-market coordination, and strategic communication with executives.';
  generateAssets();
}

els.analyzeBtn.addEventListener('click', analyze);
els.generateBtn.addEventListener('click', generateAssets);
els.copyBulletsBtn.addEventListener('click', () => copyFrom(els.tailoredBullets));
els.copyCoverBtn.addEventListener('click', () => copyFrom(els.coverLetter));
els.copyInterviewBtn.addEventListener('click', () => copyFrom(els.interviewQuestions));
els.addApplicationBtn.addEventListener('click', addApplication);
els.exportBtn.addEventListener('click', exportSession);
els.loadSampleBtn.addEventListener('click', loadSample);
