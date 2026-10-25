# ScreenCraft | Senior Technical Recruiter Resume Screener

**ScreenCraft** is a single-page, enterprise-grade AI Resume Screener web application built to simulate a **Senior Technical Recruiter with 15+ years of experience** screening candidates across tech startups, Fortune 500 enterprises, and specialized technical domains.

---

## Key Highlights & Features

### 1. File Upload & In-Browser Text Extraction
- **Drag-and-Drop & Browse Upload**: Accepts both **PDF** and **Word (.docx)** resumes.
- **Client-Side Extraction**:
  - Uses [PDF.js](https://mozilla.github.io/pdf.js/) to parse multi-page PDFs directly in the browser.
  - Uses [Mammoth.js](https://github.com/mwilliamson/mammoth.js) for `.docx` extraction.
  - Guarantees candidate data privacy (no resume files are uploaded to third-party file servers).
- **File Metadata & Status**: Displays file name, formatted size in KB/MB, and parsed word count.
- **Scanned Document Detection**: Automatically detects image-only or scanned PDFs with insufficient text layer and alerts the user with actionable next steps.
- **Inspect Extracted Text Drawer**: Allows recruiters to review the exact raw text extracted from the document.

### 2. Job Description Input
- Large, responsive text area labeled **“Paste Job Description”**.
- Real-time character and word counters.
- Supports pasting complete job listings including responsibilities, required qualifications, and nice-to-haves.

### 3. Senior Recruiter Evaluation Logic (15+ Years Experience Rubric)
Evaluates candidates against the role across standard recruiter criteria:
1. **Required vs. Preferred Skills**: Differentiates non-negotiable hard competencies from secondary nice-to-haves.
2. **Experience Depth & Seniority**: Benchmarks years of experience, technical scope (IC vs. Lead vs. Architect), and ownership.
3. **Industry & Domain Relevance**: Compares candidate's past vertical exposure (e.g., FinTech, SaaS, Distributed Systems, Healthcare) against JD requirements.
4. **Education & Certifications**: Weighs relevant technical degrees, cloud certifications (AWS, GCP, CKA), and equivalent practical track records.
5. **Career Progression & Tenure Stability**: Evaluates promotions, healthy tenure lengths, job-hopping tendencies, and flags unexplained gaps.
6. **Measurable Achievements & Quantified Impact**: Rewards candidates who quantify achievements (%, revenue, latency reduction, user scale) vs. passive duty lists.
7. **ATS Keyword Alignment**: Scores exact-match and semantic keyword density against target requirements.

### 4. Interactive Results Panel
- **Match Score Circular SVG Gauge**: Smoothly animates from 0% to the target percentage with dynamic color coding:
  - **80% - 100%**: Emerald Green (`#10b981`)
  - **60% - 79%**: Amber Orange (`#f59e0b`)
  - **Below 60%**: Crimson Rose (`#ef4444`)
- **Verdict Badge**: Color-coded badges for **Strong Fit**, **Moderate Fit**, and **Weak Fit**.
- **Shortlist Recommendation**: Clear hiring pipeline recommendation (**Yes** / **Maybe** / **No**) with confidence rating.
- **One-Line Rationale**: Concise executive summary of the score.
- **Sub-Score Breakdown**: 4 animated progress bars measuring:
  - Skills Alignment
  - Experience & Seniority Depth
  - Industry & Domain Fit
  - Education & Certifications
- **Recruiter Executive Summary**: 3–4 sentences synthesizing the holistic recruiter assessment, formatted for direct copy/paste into ATS candidate notes or Hiring Manager emails.
- **Areas of Match**: 3–5 bullets citing specific evidence and achievements from the resume.
- **Areas of Mismatch / Gaps**: 3–5 bullets flagging missing must-have requirements.
- **ATS Keyword Alignment**: Visual chips displaying matched keywords (green) vs. missing target keywords (red/rose).
- **Career Progression & Tenure**: Stability rating (High / Moderate / Concerning) with recruiter observations.
- **Red Flags & Risks**: Uncovers tenure gaps, missing scale metrics, or seniority discrepancies.
- **Targeted Recruiter Interview Probes**: 3–4 interview questions specifically designed to probe candidate weak points and verify uncorroborated claims.
- **Export & Sharing**:
  - One-click **Copy Recruiter Note**
  - **Print / PDF Export** (with dedicated print stylesheet removing inputs and navbars)
  - **Copy Full Report as Markdown**

### 5. Instant Demo & Sample Candidate Benchmarks
Includes 3 pre-loaded benchmark candidate profiles available via the top **Quick Demo** dropdown:
- **Senior Full-Stack Engineer**: Strong fit (92%) with 8+ years, microservices, AWS, and strong metrics.
- **DevOps & Cloud Engineer**: Moderate fit (74%) targeting a Principal SRE role (strong GCP/DevOps, but lacking multi-region AWS & FinTech compliance).
- **Junior Developer / Career Changer**: Weak fit (48%) targeting a Staff Distributed Systems Architect position (clear seniority and systems programming gaps).

### 6. Dual-Mode Architecture: Live Claude API + Built-in Recruiter Evaluator
- **Live Claude API Integration**:
  - Configurable in the top-right settings modal.
  - Supports `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`, and `claude-3-7-sonnet-20250219`.
  - Communicates directly with Anthropic's Messages API using client-side direct access (`anthropic-dangerous-direct-browser-access: true`).
  - Strict JSON schema enforcement with robust fallback parser.
- **Built-in Recruiter Evaluator (Zero-Config Demo Mode)**:
  - If no API key is entered, the app automatically runs an intelligent, built-in client-side recruiter evaluation algorithm.
  - Allows immediate testing with zero setup or external dependencies.

### 7. Fairness & Regulatory Guardrail
- The evaluation engine strictly ignores name, gender, age, photo, nationality, contact details, and all protected demographic attributes.
- Clear disclaimer prominently placed on UI and report exports:
  > *Decision Support Disclaimer: This assessment is an automated preliminary screening aid designed to assist human recruiters. It evaluates job-relevant qualifications and does not factor in protected attributes. Final hiring decisions should always be made by human interviewers and hiring managers.*

---

## Project Structure

```
resume-screener/
├── index.html        # Main single-page web app with two-column responsive layout
├── styles.css        # Corporate styling, animated SVG gauges, badges, print CSS
├── app.js            # Core application logic, text extraction, API & evaluator engine
├── sample-data.js    # Pre-loaded candidate resumes & job descriptions
├── server.js         # Lightweight zero-dependency HTTP server
└── README.md         # Documentation & recruiter evaluation criteria
```

---

## How to Run

### Method 1: Open Directly in Browser
You can open `index.html` directly in Google Chrome, Microsoft Edge, or Mozilla Firefox:
```powershell
Start-Process "C:\Users\dubey\.gemini\antigravity\scratch\resume-screener\index.html"
```

### Method 2: Run via Local HTTP Server
Run the included Node.js server:
```powershell
cd "C:\Users\dubey\.gemini\antigravity\scratch\resume-screener"
agy-node server.js
```
Then visit [http://localhost:3000](http://localhost:3000) in your browser.
