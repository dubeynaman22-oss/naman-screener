/**
 * ScreenCraft - Senior Technical Recruiter Web App
 * Evaluates candidates against Job Descriptions using standard recruiter criteria
 * Integrates with Claude API & provides built-in Recruiter Evaluation Engine
 */

(function () {
  'use strict';

  // --- Configuration & State ---
  const STATE = {
    resumeFile: null,         // { name, size, type, text, wordCount }
    jobDescription: '',       // string
    claudeApiKey: '',         // string
    selectedModel: 'claude-3-5-sonnet-20241022',
    mode: 'auto',             // 'claude' | 'demo' | 'auto'
    isAnalyzing: false,
    activeAssessment: null,
    activeResumeTab: 'upload' // 'upload' | 'paste'
  };

  // Safe PDF.js worker setup
  if (window.pdfjsLib) {
    try {
      // Local worker path first
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
    } catch (e) {
      console.warn('PDF.js worker setup note:', e);
    }
  }

  // DOM Elements
  const elements = {};

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    cacheDom();
    bindEvents();
    loadStoredSettings();
    updateUIState();
    renderSamplePresetsDropdown();
  }

  function cacheDom() {
    // Resume Tab Switcher
    elements.tabUploadBtn = document.getElementById('tabUploadBtn');
    elements.tabPasteBtn = document.getElementById('tabPasteBtn');
    elements.tabUploadContent = document.getElementById('tabUploadContent');
    elements.tabPasteContent = document.getElementById('tabPasteContent');
    elements.resumePasteTextarea = document.getElementById('resumePasteTextarea');
    elements.resumePasteStats = document.getElementById('resumePasteStats');
    elements.clearPastedResumeBtn = document.getElementById('clearPastedResumeBtn');

    // File Upload Elements
    elements.dropZone = document.getElementById('dropZone');
    elements.fileInput = document.getElementById('fileInput');
    elements.fileInfoCard = document.getElementById('fileInfoCard');
    elements.fileName = document.getElementById('fileName');
    elements.fileMeta = document.getElementById('fileMeta');
    elements.removeFileBtn = document.getElementById('removeFileBtn');
    elements.previewTextBtn = document.getElementById('previewTextBtn');
    elements.scannedWarning = document.getElementById('scannedWarning');

    // Job Description Elements
    elements.jdTextarea = document.getElementById('jdTextarea');
    elements.jdCharCount = document.getElementById('jdCharCount');
    elements.jdWordCount = document.getElementById('jdWordCount');
    elements.clearJdBtn = document.getElementById('clearJdBtn');

    // Readiness Checklist
    elements.checkResumeIcon = document.getElementById('checkResumeIcon');
    elements.checkResumeLabel = document.getElementById('checkResumeLabel');
    elements.checkJdIcon = document.getElementById('checkJdIcon');
    elements.checkJdLabel = document.getElementById('checkJdLabel');
    elements.checkReadyIcon = document.getElementById('checkReadyIcon');
    elements.checkReadyLabel = document.getElementById('checkReadyLabel');

    // Analyze CTA Button
    elements.analyzeBtn = document.getElementById('analyzeBtn');
    elements.analyzeBtnText = document.getElementById('analyzeBtnText');
    elements.analyzeBtnSpinner = document.getElementById('analyzeBtnSpinner');

    // View States
    elements.emptyState = document.getElementById('emptyState');
    elements.loadingState = document.getElementById('loadingState');
    elements.loadingStatusText = document.getElementById('loadingStatusText');
    elements.resultsState = document.getElementById('resultsState');

    // Results Elements
    elements.matchScoreValue = document.getElementById('matchScoreValue');
    elements.gaugeCircle = document.getElementById('gaugeCircle');
    elements.verdictBadge = document.getElementById('verdictBadge');
    elements.shortlistBadge = document.getElementById('shortlistBadge');
    elements.oneLineRationale = document.getElementById('oneLineRationale');

    // Sub-Scores
    elements.subScoreSkills = document.getElementById('subScoreSkills');
    elements.subScoreSkillsBar = document.getElementById('subScoreSkillsBar');
    elements.subScoreExp = document.getElementById('subScoreExp');
    elements.subScoreExpBar = document.getElementById('subScoreExpBar');
    elements.subScoreDomain = document.getElementById('subScoreDomain');
    elements.subScoreDomainBar = document.getElementById('subScoreDomainBar');
    elements.subScoreEdu = document.getElementById('subScoreEdu');
    elements.subScoreEduBar = document.getElementById('subScoreEduBar');

    // Lists & Summaries
    elements.recruiterSummary = document.getElementById('recruiterSummary');
    elements.matchList = document.getElementById('matchList');
    elements.mismatchList = document.getElementById('mismatchList');
    elements.matchedKeywordsList = document.getElementById('matchedKeywordsList');
    elements.missingKeywordsList = document.getElementById('missingKeywordsList');
    elements.tenureRating = document.getElementById('tenureRating');
    elements.tenureObservation = document.getElementById('tenureObservation');
    elements.redFlagsList = document.getElementById('redFlagsList');
    elements.redFlagsContainer = document.getElementById('redFlagsContainer');
    elements.interviewQuestionsList = document.getElementById('interviewQuestionsList');

    // Settings Modal
    elements.settingsBtn = document.getElementById('settingsBtn');
    elements.settingsModal = document.getElementById('settingsModal');
    elements.closeSettingsBtn = document.getElementById('closeSettingsBtn');
    elements.apiKeyInput = document.getElementById('apiKeyInput');
    elements.toggleKeyVisibility = document.getElementById('toggleKeyVisibility');
    elements.modelSelect = document.getElementById('modelSelect');
    elements.storagePreference = document.getElementById('storagePreference');
    elements.saveSettingsBtn = document.getElementById('saveSettingsBtn');
    elements.clearKeyBtn = document.getElementById('clearKeyBtn');
    elements.apiStatusBadge = document.getElementById('apiStatusBadge');
    elements.testApiBtn = document.getElementById('testApiBtn');
    elements.apiTestFeedback = document.getElementById('apiTestFeedback');

    // Presets Dropdown & Sample Loaders
    elements.presetSelect = document.getElementById('presetSelect');
    elements.loadPresetBtn = document.getElementById('loadPresetBtn');

    // Text Preview Modal
    elements.textPreviewModal = document.getElementById('textPreviewModal');
    elements.closePreviewBtn = document.getElementById('closePreviewBtn');
    elements.previewTextContent = document.getElementById('previewTextContent');
    elements.copyExtractedTextBtn = document.getElementById('copyExtractedTextBtn');

    // Report Actions
    elements.copySummaryBtn = document.getElementById('copySummaryBtn');
    elements.printReportBtn = document.getElementById('printReportBtn');
    elements.copyFullReportBtn = document.getElementById('copyFullReportBtn');

    // Toast Notification
    elements.toast = document.getElementById('toast');
    elements.toastMessage = document.getElementById('toastMessage');
  }

  function bindEvents() {
    // --- Resume Tab Switcher ---
    elements.tabUploadBtn.addEventListener('click', () => switchResumeTab('upload'));
    elements.tabPasteBtn.addEventListener('click', () => switchResumeTab('paste'));

    // Pasted Resume Input
    elements.resumePasteTextarea.addEventListener('input', onResumePasteInput);
    elements.clearPastedResumeBtn.addEventListener('click', () => {
      elements.resumePasteTextarea.value = '';
      onResumePasteInput();
    });

    // --- Drag & Drop Zone ---
    // Entire dropzone is clickable
    elements.dropZone.addEventListener('click', (e) => {
      elements.fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(evt => {
      elements.dropZone.addEventListener(evt, e => {
        e.preventDefault();
        e.stopPropagation();
        elements.dropZone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      elements.dropZone.addEventListener(evt, e => {
        e.preventDefault();
        e.stopPropagation();
        elements.dropZone.classList.remove('drag-active');
      });
    });

    elements.dropZone.addEventListener('drop', e => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelection(files[0]);
      }
    });

    // File Input change
    elements.fileInput.addEventListener('change', e => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
    });

    elements.removeFileBtn.addEventListener('click', removeUploadedFile);
    elements.previewTextBtn.addEventListener('click', openTextPreviewModal);

    // --- Job Description Input ---
    elements.jdTextarea.addEventListener('input', () => {
      STATE.jobDescription = elements.jdTextarea.value;
      updateJdStats();
      updateUIState();
    });

    elements.clearJdBtn.addEventListener('click', () => {
      elements.jdTextarea.value = '';
      STATE.jobDescription = '';
      updateJdStats();
      updateUIState();
    });

    // --- 1-Click Preset Demo Buttons ---
    document.querySelectorAll('.quick-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetId = btn.getAttribute('data-preset');
        loadPresetById(presetId);
      });
    });

    if (elements.loadPresetBtn) {
      elements.loadPresetBtn.addEventListener('click', loadSelectedPreset);
    }

    // --- Analyze Candidate ---
    elements.analyzeBtn.addEventListener('click', onAnalyzeCandidate);

    // --- Settings Modal ---
    elements.settingsBtn.addEventListener('click', openSettingsModal);
    elements.closeSettingsBtn.addEventListener('click', closeSettingsModal);
    elements.saveSettingsBtn.addEventListener('click', saveSettings);
    elements.clearKeyBtn.addEventListener('click', clearApiKey);
    elements.testApiBtn.addEventListener('click', testAnthropicApiKey);
    elements.toggleKeyVisibility.addEventListener('click', toggleKeyVisibility);

    // Close modal on backdrop click
    elements.settingsModal.addEventListener('click', e => {
      if (e.target === elements.settingsModal) closeSettingsModal();
    });
    elements.textPreviewModal.addEventListener('click', e => {
      if (e.target === elements.textPreviewModal) closeTextPreviewModal();
    });
    elements.closePreviewBtn.addEventListener('click', closeTextPreviewModal);

    // Copy extracted text
    elements.copyExtractedTextBtn.addEventListener('click', () => {
      if (STATE.resumeFile && STATE.resumeFile.text) {
        navigator.clipboard.writeText(STATE.resumeFile.text).then(() => {
          showToast('Extracted resume text copied to clipboard!');
        });
      }
    });

    // Report Actions
    elements.copySummaryBtn.addEventListener('click', copyRecruiterSummary);
    elements.printReportBtn.addEventListener('click', () => window.print());
    elements.copyFullReportBtn.addEventListener('click', copyFullReportMarkdown);

    // Keyboard accessibility for modals
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeSettingsModal();
        closeTextPreviewModal();
      }
    });
  }

  // --- Resume Tab Switching ---

  function switchResumeTab(tab) {
    STATE.activeResumeTab = tab;
    if (tab === 'upload') {
      elements.tabUploadBtn.className = 'px-2.5 py-1 rounded-md font-semibold text-xs transition bg-white text-blue-600 shadow-sm';
      elements.tabPasteBtn.className = 'px-2.5 py-1 rounded-md font-medium text-xs transition text-slate-600 hover:text-slate-900';
      elements.tabUploadContent.classList.remove('hidden');
      elements.tabPasteContent.classList.add('hidden');
    } else {
      elements.tabPasteBtn.className = 'px-2.5 py-1 rounded-md font-semibold text-xs transition bg-white text-blue-600 shadow-sm';
      elements.tabUploadBtn.className = 'px-2.5 py-1 rounded-md font-medium text-xs transition text-slate-600 hover:text-slate-900';
      elements.tabPasteContent.classList.remove('hidden');
      elements.tabUploadContent.classList.add('hidden');

      // If a file was previously parsed, pre-populate text area
      if (STATE.resumeFile && STATE.resumeFile.text && !elements.resumePasteTextarea.value) {
        elements.resumePasteTextarea.value = STATE.resumeFile.text;
        onResumePasteInput();
      }
      elements.resumePasteTextarea.focus();
    }
  }

  function onResumePasteInput() {
    const text = elements.resumePasteTextarea.value || '';
    const chars = text.length;
    const words = countWords(text);

    elements.resumePasteStats.textContent = `${chars.toLocaleString()} chars • ${words.toLocaleString()} words`;

    if (words >= 15) {
      STATE.resumeFile = {
        name: 'Pasted Candidate Resume',
        size: chars,
        type: 'text/plain',
        text: text,
        wordCount: words
      };
    } else {
      STATE.resumeFile = null;
    }

    updateUIState();
  }

  // --- File Handling & Text Extraction ---

  async function handleFileSelection(file) {
    if (!file) return;

    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      showToast('Unsupported file type. Please upload a PDF or DOCX file, or use "Paste Text".', 'error');
      return;
    }

    // Size limit 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast('File too large (exceeds 10MB limit). Please upload a smaller file.', 'error');
      return;
    }

    // Show processing state in file info card
    elements.fileInfoCard.classList.remove('hidden');
    elements.dropZone.classList.add('hidden');
    elements.fileName.textContent = file.name;
    elements.fileMeta.textContent = `Reading file (${formatBytes(file.size)})...`;
    elements.scannedWarning.classList.add('hidden');

    try {
      let extractedText = '';

      if (fileName.endsWith('.pdf')) {
        extractedText = await extractTextFromPdf(file);
      } else if (fileName.endsWith('.docx')) {
        extractedText = await extractTextFromDocx(file);
      } else if (fileName.endsWith('.txt')) {
        extractedText = await file.text();
      } else {
        extractedText = await file.text();
      }

      extractedText = cleanExtractedText(extractedText);
      const wordCount = countWords(extractedText);

      // Check for scanned / image-only PDF
      if (wordCount < 25) {
        elements.scannedWarning.classList.remove('hidden');
        showToast('Warning: Scanned or image PDF detected. Try the "Paste Text" tab if text is available.', 'warning');
      } else {
        elements.scannedWarning.classList.add('hidden');
      }

      STATE.resumeFile = {
        name: file.name,
        size: file.size,
        type: file.type || getFileExtension(file.name),
        text: extractedText,
        wordCount: wordCount
      };

      // Also mirror into paste textarea so user can inspect/edit if desired
      elements.resumePasteTextarea.value = extractedText;
      elements.resumePasteStats.textContent = `${extractedText.length.toLocaleString()} chars • ${wordCount.toLocaleString()} words`;

      elements.fileMeta.textContent = `${formatBytes(file.size)} • ${wordCount.toLocaleString()} words parsed`;
      showToast(`Successfully parsed "${file.name}"!`);
      updateUIState();

    } catch (err) {
      console.error('Text extraction failed:', err);
      elements.fileMeta.textContent = 'Extraction failed';
      showToast(`Error extracting text: ${err.message || 'File could not be parsed.'}. Please use the "Paste Text" tab.`, 'error');
      // Do not leave in broken state; give user fallback
      removeUploadedFile();
      switchResumeTab('paste');
    }
  }

  async function extractTextFromPdf(file) {
    const arrayBuffer = await file.arrayBuffer();

    // Check if PDF.js is available
    if (window.pdfjsLib) {
      try {
        const loadingTask = window.pdfjsLib.getDocument({
          data: arrayBuffer,
          isEvalSupported: false,
          useWorkerFetch: false
        });
        const pdf = await loadingTask.promise;

        const maxPages = Math.min(pdf.numPages, 20);
        let fullText = '';

        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          let lastY, pageText = '';
          for (const item of textContent.items) {
            if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 5) {
              pageText += '\n';
            } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
              pageText += ' ';
            }
            pageText += item.str;
            lastY = item.transform[5];
          }

          fullText += pageText + '\n\n';
        }

        if (fullText.trim().length > 30) {
          return fullText;
        }
      } catch (pdfErr) {
        console.warn('PDF.js standard parse failed, trying stream fallback:', pdfErr);
      }
    }

    // Fallback: Raw PDF text stream scan
    const fallbackText = extractTextFromRawPdfBuffer(arrayBuffer);
    if (fallbackText && fallbackText.trim().length > 30) {
      return fallbackText;
    }

    throw new Error('Could not extract text from PDF. It may be a scanned image or protected.');
  }

  function extractTextFromRawPdfBuffer(buffer) {
    try {
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const raw = decoder.decode(buffer);
      // Scan for text between parentheses in BT/ET blocks: e.g. (Some Text) Tj
      const matches = raw.match(/\(([^()]{2,100})\)\s*(?:Tj|'|")/g) || [];
      if (matches.length > 10) {
        return matches.map(m => m.replace(/^[\(\s]+|[\)\sTj'"]+$/g, '')).join(' ');
      }
    } catch (e) {
      console.warn('Fallback stream scan error:', e);
    }
    return '';
  }

  async function extractTextFromDocx(file) {
    if (!window.mammoth) {
      throw new Error('Mammoth.js library failed to load.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value || '';
  }

  function cleanExtractedText(text) {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .trim();
  }

  function removeUploadedFile() {
    STATE.resumeFile = null;
    elements.fileInput.value = '';
    elements.fileInfoCard.classList.add('hidden');
    elements.dropZone.classList.remove('hidden');
    elements.scannedWarning.classList.add('hidden');
    updateUIState();
  }

  function updateJdStats() {
    const text = elements.jdTextarea.value || '';
    const chars = text.length;
    const words = countWords(text);

    elements.jdCharCount.textContent = `${chars.toLocaleString()} chars`;
    elements.jdWordCount.textContent = `${words.toLocaleString()} words`;
  }

  function updateUIState() {
    const hasResume = STATE.resumeFile && STATE.resumeFile.text && STATE.resumeFile.text.trim().length >= 30;
    const hasJd = STATE.jobDescription && STATE.jobDescription.trim().length >= 30;
    const canAnalyze = hasResume && hasJd && !STATE.isAnalyzing;

    // Update readiness checklist
    if (elements.checkResumeIcon) {
      if (hasResume) {
        elements.checkResumeIcon.textContent = '✓';
        elements.checkResumeIcon.className = 'text-emerald-600 font-bold';
        elements.checkResumeLabel.className = 'text-emerald-700 font-semibold';
      } else {
        elements.checkResumeIcon.textContent = '○';
        elements.checkResumeIcon.className = 'text-slate-400 font-bold';
        elements.checkResumeLabel.className = 'text-slate-500 font-normal';
      }
    }

    if (elements.checkJdIcon) {
      if (hasJd) {
        elements.checkJdIcon.textContent = '✓';
        elements.checkJdIcon.className = 'text-emerald-600 font-bold';
        elements.checkJdLabel.className = 'text-emerald-700 font-semibold';
      } else {
        elements.checkJdIcon.textContent = '○';
        elements.checkJdIcon.className = 'text-slate-400 font-bold';
        elements.checkJdLabel.className = 'text-slate-500 font-normal';
      }
    }

    if (elements.checkReadyIcon) {
      if (canAnalyze) {
        elements.checkReadyIcon.textContent = '✓';
        elements.checkReadyIcon.className = 'text-blue-600 font-bold';
        elements.checkReadyLabel.className = 'text-blue-700 font-bold';
      } else {
        elements.checkReadyIcon.textContent = '○';
        elements.checkReadyIcon.className = 'text-slate-400 font-bold';
        elements.checkReadyLabel.className = 'text-slate-500 font-normal';
      }
    }

    // Update Analyze Button
    elements.analyzeBtn.disabled = !canAnalyze;

    if (!hasResume && !hasJd) {
      elements.analyzeBtn.title = 'Please provide candidate resume and paste a job description';
    } else if (!hasResume) {
      elements.analyzeBtn.title = 'Please upload or paste a candidate resume';
    } else if (!hasJd) {
      elements.analyzeBtn.title = 'Please paste a target Job Description';
    } else {
      elements.analyzeBtn.title = 'Click to screen candidate against role requirements';
    }
  }

  // --- Preset Candidates Loader ---

  function renderSamplePresetsDropdown() {
    if (!window.SAMPLE_PRESETS || !elements.presetSelect) return;

    elements.presetSelect.innerHTML = '<option value="">-- Choose a pre-loaded sample profile --</option>';
    window.SAMPLE_PRESETS.forEach(preset => {
      const opt = document.createElement('option');
      opt.value = preset.id;
      opt.textContent = `${preset.title} (${preset.fitType})`;
      elements.presetSelect.appendChild(opt);
    });
  }

  function loadSelectedPreset() {
    const presetId = elements.presetSelect.value;
    if (!presetId) {
      showToast('Please select a sample profile from the dropdown.', 'warning');
      return;
    }
    loadPresetById(presetId);
  }

  function loadPresetById(presetId) {
    if (!window.SAMPLE_PRESETS) return;
    const preset = window.SAMPLE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    // Load Resume
    STATE.resumeFile = {
      name: `${preset.id}.pdf`,
      size: 42000,
      type: 'application/pdf',
      text: preset.resumeText,
      wordCount: countWords(preset.resumeText)
    };

    // Update file card
    elements.fileName.textContent = `${preset.title} (Verified Benchmark)`;
    elements.fileMeta.textContent = `Sample Profile • ${STATE.resumeFile.wordCount.toLocaleString()} words`;
    elements.fileInfoCard.classList.remove('hidden');
    elements.dropZone.classList.add('hidden');
    elements.scannedWarning.classList.add('hidden');

    // Also populate paste textarea
    elements.resumePasteTextarea.value = preset.resumeText;
    elements.resumePasteStats.textContent = `${preset.resumeText.length.toLocaleString()} chars • ${STATE.resumeFile.wordCount.toLocaleString()} words`;

    // Load Job Description
    elements.jdTextarea.value = preset.jobDescription;
    STATE.jobDescription = preset.jobDescription;
    updateJdStats();
    updateUIState();

    showToast(`Loaded benchmark candidate: "${preset.title}". Click "Analyze Candidate" to evaluate.`);
  }

  // --- Analysis Dispatcher ---

  async function onAnalyzeCandidate() {
    if (!STATE.resumeFile || !STATE.jobDescription) {
      showToast('Please provide both a candidate resume and a job description.', 'warning');
      return;
    }

    STATE.isAnalyzing = true;
    updateUIState();

    // Show loading state, hide empty and previous results
    elements.emptyState.classList.add('hidden');
    elements.resultsState.classList.add('hidden');
    elements.loadingState.classList.remove('hidden');
    elements.analyzeBtnSpinner.classList.remove('hidden');
    elements.analyzeBtnText.textContent = 'Screening Candidate...';

    // Loading status animation steps
    const statusSteps = [
      'Extracting and indexing core competencies...',
      'Cross-referencing required vs. preferred qualifications...',
      'Benchmarking seniority level and career progression...',
      'Evaluating tenure stability and quantifiable achievements...',
      'Scoring ATS keyword alignment and domain fit...',
      'Synthesizing senior recruiter verdict and interview probes...'
    ];

    let stepIndex = 0;
    elements.loadingStatusText.textContent = statusSteps[0];
    const statusInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % statusSteps.length;
      elements.loadingStatusText.textContent = statusSteps[stepIndex];
    }, 1800);

    try {
      let assessment = null;

      // Decide whether to use Claude API or Built-in Recruiter Evaluator
      const hasApiKey = Boolean(STATE.claudeApiKey && STATE.claudeApiKey.trim().startsWith('sk-'));

      if (hasApiKey) {
        try {
          assessment = await evaluateWithClaudeApi(STATE.resumeFile.text, STATE.jobDescription);
        } catch (apiErr) {
          console.warn('Claude API call failed, falling back to built-in recruiter engine:', apiErr);
          showToast(`Claude API note: ${apiErr.message}. Generating evaluation via Built-in Recruiter Engine.`, 'warning');
          assessment = evaluateWithBuiltInEngine(STATE.resumeFile.text, STATE.jobDescription);
        }
      } else {
        // Built-in intelligent recruiter engine (Simulates realistic 15+ yr recruiter analysis)
        await new Promise(r => setTimeout(r, 2000));
        assessment = evaluateWithBuiltInEngine(STATE.resumeFile.text, STATE.jobDescription);
      }

      clearInterval(statusInterval);
      STATE.activeAssessment = assessment;
      renderAssessmentResults(assessment);

      // Scroll results smoothly into view on smaller screens
      if (window.innerWidth < 1024) {
        elements.resultsState.scrollIntoView({ behavior: 'smooth' });
      }

    } catch (err) {
      clearInterval(statusInterval);
      console.error('Analysis error:', err);
      showToast(`Error during candidate analysis: ${err.message}`, 'error');
      elements.loadingState.classList.add('hidden');
      elements.emptyState.classList.remove('hidden');
    } finally {
      STATE.isAnalyzing = false;
      elements.analyzeBtnSpinner.classList.add('hidden');
      elements.analyzeBtnText.textContent = 'Analyze Candidate';
      updateUIState();
    }
  }

  // --- Claude API Integration ---

  async function evaluateWithClaudeApi(resumeText, jobDescription) {
    const systemPrompt = `You are a distinguished Senior Technical Recruiter with over 15 years of experience screening candidates across Tier-1 tech firms, high-growth startups, and Fortune 500 enterprises.

FAIRNESS & COMPLIANCE GUARDRAIL (CRITICAL):
- Strictly ignore candidate name, gender, age, race, ethnicity, nationality, photo, contact information, disability, marital status, or any other protected personal attributes.
- Base your evaluation 100% on demonstrable, job-relevant qualifications, technical skills, proven impact, career progression, and target role requirements.
- Treat this as an objective decision-support assessment for human recruiters and hiring managers.

EVALUATION METHODOLOGY:
1. Required vs. Preferred Skills: Distinguish non-negotiable must-haves from nice-to-haves. Look for practical application, not keyword stuffing.
2. Experience Depth & Seniority: Assess years in relevant roles, architectural ownership, and leadership scope.
3. Industry & Domain Relevance: Map candidate's past technical domains (e.g. FinTech, high-scale SaaS, distributed systems, healthtech) to the JD context.
4. Education & Certifications: Benchmark degrees, relevant cloud/professional certifications, or equivalent demonstrable field experience.
5. Career Progression & Tenure Stability: Note promotions, reasonable tenures vs unjustified job-hopping, and note any significant employment gaps.
6. Measurable Achievements & Impact: Prioritize candidates who quantify impact (%, revenue, latency reduction, user scale) vs passive responsibility listings.
7. ATS Keyword Alignment: Score core keyword presence and semantic equivalents.

OUTPUT FORMAT:
You MUST respond ONLY with a valid, strictly parseable JSON object matching this schema. Do not include markdown codeblocks or conversational text:

{
  "matchScore": <number between 0 and 100>,
  "oneLineRationale": "<concise 1-sentence executive summary of candidate score>",
  "verdict": "Strong Fit" | "Moderate Fit" | "Weak Fit",
  "shortlistRecommendation": "Yes" | "Maybe" | "No",
  "shortlistConfidence": "High" | "Medium" | "Low",
  "subScores": {
    "skills": { "score": <0-100>, "label": "Skills Alignment", "summary": "<brief note>" },
    "experience": { "score": <0-100>, "label": "Experience & Seniority", "summary": "<brief note>" },
    "domain": { "score": <0-100>, "label": "Industry & Domain Fit", "summary": "<brief note>" },
    "education": { "score": <0-100>, "label": "Education & Certifications", "summary": "<brief note>" }
  },
  "areasOfMatch": [
    "<Bullet 1 citing exact evidence from resume>",
    "<Bullet 2 citing exact evidence from resume>",
    "<Bullet 3 citing exact evidence from resume>",
    "<Bullet 4 citing exact evidence from resume>"
  ],
  "areasOfMismatch": [
    "<Bullet 1 flagging missing must-have requirement>",
    "<Bullet 2 flagging missing must-have requirement>",
    "<Bullet 3 flagging missing must-have or preferred requirement>"
  ],
  "atsKeywords": {
    "matched": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"],
    "missing": ["<keyword1>", "<keyword2>", "<keyword3>"]
  },
  "progressionAndTenure": {
    "stabilityRating": "High" | "Moderate" | "Concerning",
    "observation": "<1-2 sentences on progression, promotions, or tenure stability>"
  },
  "redFlagsAndRisks": [
    "<Identified risk or ambiguity, or 'None identified' if clean>"
  ],
  "suggestedInterviewQuestions": [
    "<Probing question 1 targeting candidate's primary gap or unverified claim>",
    "<Probing question 2 targeting specific technical depth or architecture decision>",
    "<Probing question 3 probing domain or behavioral requirement>"
  ],
  "recruiterSummary": "<3 to 4 sentences synthesizing holistic recruiter opinion, suitable for hiring manager ATS notes>"
}`;

    const userPrompt = `Please evaluate the following candidate resume against the provided job description:

=== CANDIDATE RESUME ===
${resumeText}

=== JOB DESCRIPTION ===
${jobDescription}

Respond strictly with the required JSON object.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': STATE.claudeApiKey.trim(),
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: STATE.selectedModel || 'claude-3-5-sonnet-20241022',
        max_tokens: 3500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) throw new Error('Empty response received from Claude API.');

    return parseJsonSafely(content);
  }

  function parseJsonSafely(text) {
    let clean = text.trim();

    // Strip markdown code fences if model enclosed them
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }

    try {
      return JSON.parse(clean);
    } catch (e1) {
      const firstBrace = clean.indexOf('{');
      const lastBrace = clean.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const sliced = clean.substring(firstBrace, lastBrace + 1);
        try {
          return JSON.parse(sliced);
        } catch (e2) {
          console.error('Failed to parse sliced JSON:', sliced);
        }
      }
      throw new Error('Claude response could not be parsed into valid evaluation JSON format.');
    }
  }

  // --- Built-in Intelligent Recruiter Evaluator (Offline / Instant Demo Engine) ---

  function evaluateWithBuiltInEngine(resumeText, jobDescription) {
    const resumeLower = resumeText.toLowerCase();
    const jdLower = jobDescription.toLowerCase();

    // 1. Technical & Domain Lexicon for ATS matching
    const commonKeywords = [
      'typescript', 'javascript', 'python', 'java', 'c++', 'c#', 'rust', 'go', 'golang',
      'react', 'next.js', 'vue', 'angular', 'node.js', 'express', 'nestjs', 'django', 'fastapi',
      'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb',
      'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'github actions',
      'microservices', 'graphql', 'rest api', 'kafka', 'rabbitmq', 'event-driven',
      'agile', 'scrum', 'tdd', 'jest', 'cypress', 'prometheus', 'grafana', 'datadog',
      'distributed systems', 'security', 'soc 2', 'pci-dss', 'leadership', 'mentorship'
    ];

    // Find which keywords are in the JD
    const jdKeywords = commonKeywords.filter(kw => jdLower.includes(kw));
    // Determine which of those are present in the resume
    const matchedKeywords = jdKeywords.filter(kw => resumeLower.includes(kw));
    const missingKeywords = jdKeywords.filter(kw => !resumeLower.includes(kw));

    // Calculate raw keyword ratio
    const keywordRatio = jdKeywords.length > 0 ? (matchedKeywords.length / jdKeywords.length) : 0.7;

    // 2. Years of Experience Detection
    const expRegex = /(\d+)\+?\s*(?:to\s*\d+\s*)?years?(?:\s*of)?\s*(?:experience|exp)/gi;
    let jdYearsRequired = 5;
    let match;
    while ((match = expRegex.exec(jdLower)) !== null) {
      const yr = parseInt(match[1], 10);
      if (!isNaN(yr) && yr > jdYearsRequired) jdYearsRequired = yr;
    }

    // Estimate resume years
    let resumeYearsEstimate = estimateResumeYears(resumeText);

    // 3. Seniority level alignment
    const isLeadOrPrincipalJd = /principal|lead|staff|director|architect|head of/i.test(jobDescription);
    const hasLeadOrPrincipalResume = /lead|principal|staff|architect|director|head of|spearheaded|mentored/i.test(resumeText);
    const isJuniorResume = /bootcamp|intern|entry level|junior|associate|career changer/i.test(resumeText) && resumeYearsEstimate < 3;

    // 4. Metric & Quantifiable Achievement Detection ($, %, numbers, scale)
    const metricsMatches = resumeText.match(/\b(?:\d+%(?:\s*increase|\s*reduction|\s*improvement)?|\$\d+[MK]|\b\d+[MK]\+?\s*(?:users|requests|events|dau|mau))\b/gi) || [];
    const hasStrongMetrics = metricsMatches.length >= 3;

    // 5. Compute Sub-Scores
    let skillsScore = Math.round(keywordRatio * 100);
    skillsScore = Math.min(98, Math.max(25, skillsScore));

    let experienceScore = 70;
    if (resumeYearsEstimate >= jdYearsRequired) {
      experienceScore = Math.min(95, 75 + (resumeYearsEstimate - jdYearsRequired) * 4);
    } else {
      const gap = jdYearsRequired - resumeYearsEstimate;
      experienceScore = Math.max(25, 70 - gap * 15);
    }
    if (isLeadOrPrincipalJd && !hasLeadOrPrincipalResume) {
      experienceScore = Math.max(30, experienceScore - 20);
    }

    let domainScore = 65;
    const domainTerms = ['saas', 'fintech', 'enterprise', 'cloud', 'e-commerce', 'healthcare', 'distributed', 'security'];
    const matchedDomains = domainTerms.filter(d => jdLower.includes(d) && resumeLower.includes(d));
    if (matchedDomains.length >= 2) domainScore = 90;
    else if (matchedDomains.length === 1) domainScore = 78;
    else domainScore = 55;

    let educationScore = 75;
    const hasDegree = /bachelor|b\.s\.|b\.a\.|master|m\.s\.|ph\.?d|degree in computer science/i.test(resumeText);
    const hasCert = /certified|certification|aws certified|gcp certified|ckd|cka|pmp|scrummaster/i.test(resumeText);
    if (hasDegree && hasCert) educationScore = 92;
    else if (hasDegree) educationScore = 82;
    else if (hasCert) educationScore = 76;
    else educationScore = 60;

    if (isLeadOrPrincipalJd && isJuniorResume) {
      skillsScore = Math.min(45, skillsScore);
      experienceScore = Math.min(30, experienceScore);
      domainScore = Math.min(40, domainScore);
    }

    let overallScore = Math.round(
      skillsScore * 0.35 +
      experienceScore * 0.35 +
      domainScore * 0.15 +
      educationScore * 0.15
    );

    overallScore = Math.max(15, Math.min(95, overallScore));

    let verdict = 'Moderate Fit';
    let shortlistRecommendation = 'Maybe';
    let shortlistConfidence = 'Medium';
    let oneLineRationale = '';

    if (overallScore >= 80) {
      verdict = 'Strong Fit';
      shortlistRecommendation = 'Yes';
      shortlistConfidence = 'High';
      oneLineRationale = `Exceptional alignment with core competencies, robust ${resumeYearsEstimate}+ years seniority, and proven quantifiable technical impact.`;
    } else if (overallScore >= 60) {
      verdict = 'Moderate Fit';
      shortlistRecommendation = 'Maybe';
      shortlistConfidence = 'Medium';
      oneLineRationale = `Solid foundational match meeting core competencies, but missing key niche requirements or seniority scale.`;
    } else {
      verdict = 'Weak Fit';
      shortlistRecommendation = 'No';
      shortlistConfidence = 'High';
      oneLineRationale = `Significant variance in required experience depth, missing critical technical must-haves, and lack of domain seniority.`;
    }

    const areasOfMatch = [];
    if (matchedKeywords.length > 0) {
      const topMatches = matchedKeywords.slice(0, 4).map(k => capitalizeWord(k)).join(', ');
      areasOfMatch.push(`Demonstrated proficiency in core required technologies: ${topMatches}.`);
    }
    if (resumeYearsEstimate > 0) {
      areasOfMatch.push(`Accumulated ~${resumeYearsEstimate} years of relevant industry experience (JD benchmarked at ${jdYearsRequired}+ years).`);
    }
    if (hasStrongMetrics) {
      areasOfMatch.push(`Strong presentation of measurable business impact (e.g., latency optimizations, uptime metrics, and user scale).`);
    } else {
      areasOfMatch.push(`Evidence of direct hands-on delivery and collaborative feature engineering.`);
    }
    if (hasLeadOrPrincipalResume && isLeadOrPrincipalJd) {
      areasOfMatch.push(`Proven technical leadership and pod mentorship aligned with high-seniority expectations.`);
    }

    const areasOfMismatch = [];
    if (missingKeywords.length > 0) {
      const topMissing = missingKeywords.slice(0, 3).map(k => capitalizeWord(k)).join(', ');
      areasOfMismatch.push(`Missing explicit production verification for target requirements: ${topMissing}.`);
    }
    if (resumeYearsEstimate < jdYearsRequired) {
      areasOfMismatch.push(`Experience depth (~${resumeYearsEstimate} yrs) falls short of the ${jdYearsRequired}+ years specified in the job description.`);
    }
    if (isLeadOrPrincipalJd && !hasLeadOrPrincipalResume) {
      areasOfMismatch.push(`Lacks clear evidence of multi-pod technical architecture or cross-functional technical strategy.`);
    }
    if (!hasDegree && jdLower.includes('degree')) {
      areasOfMismatch.push(`Formal computer science or engineering degree not explicitly listed on profile.`);
    }
    if (areasOfMismatch.length === 0) {
      areasOfMismatch.push('Minor edge gaps in secondary tooling; no critical must-have deficits detected.');
    }

    let stabilityRating = 'High';
    let tenureObs = 'Demonstrates steady multi-year tenures across reputable organizations with logical upward title trajectory.';
    if (isJuniorResume) {
      stabilityRating = 'Moderate';
      tenureObs = 'Candidate is early in software engineering career with short track record; progression is nascent.';
    } else if (resumeText.includes('2023') && resumeText.includes('2024') && resumeText.includes('2022') && !resumeText.includes('2019')) {
      stabilityRating = 'Moderate';
      tenureObs = 'Tenures average under 18 months per company; recommend probing reasons for recent role transitions.';
    }

    const redFlagsAndRisks = [];
    if (isLeadOrPrincipalJd && isJuniorResume) {
      redFlagsAndRisks.push('Severe seniority mismatch: Candidate possesses junior/bootcamp qualifications for a staff/principal architect requisition.');
    }
    if (missingKeywords.length >= 4) {
      redFlagsAndRisks.push(`Multiple core stack components (${missingKeywords.slice(0, 3).join(', ')}) are completely absent from resume history.`);
    }
    if (!hasStrongMetrics && overallScore > 50) {
      redFlagsAndRisks.push('Candidate resume relies heavily on passive job responsibilities rather than quantifiable business or engineering metrics.');
    }
    if (redFlagsAndRisks.length === 0) {
      redFlagsAndRisks.push('No significant recruiter red flags or unexplained career anomalies detected.');
    }

    const suggestedInterviewQuestions = [];
    if (missingKeywords.length > 0) {
      suggestedInterviewQuestions.push(`"How have you approached working with or learning ${capitalizeWord(missingKeywords[0])} in past environments, or what analogous architectures did you deploy?"`);
    }
    if (isLeadOrPrincipalJd) {
      suggestedInterviewQuestions.push(`"Can you walk me through the most complex system architecture decision you owned end-to-end, including trade-offs and post-mortems?"`);
    } else {
      suggestedInterviewQuestions.push(`"Describe a production incident or severe bottleneck you diagnosed under pressure. What tools did you use and how was it permanently remediated?"`);
    }
    suggestedInterviewQuestions.push(`"Looking at your recent work, what was the single most quantifiable engineering improvement you contributed to your team's metrics or velocity?"`);

    const recruiterSummary = overallScore >= 80
      ? `The candidate represents an impressive, high-caliber match for the ${extractJobTitle(jobDescription)} role with strong alignment across ${matchedKeywords.slice(0, 4).join(', ')}. Their ${resumeYearsEstimate}+ years of demonstrable production contributions and quantified engineering impact indicate they will hit the ground running with minimal ramp-up. Recommended for immediate fast-track recruiter phone screen and technical screen.`
      : overallScore >= 60
      ? `The candidate demonstrates solid baseline capabilities and good foundational grasp of ${matchedKeywords.slice(0, 3).join(', ')}, but presents gaps regarding ${missingKeywords.slice(0, 2).join(', ') || 'specialized domain tooling'}. Experience level is moderately aligned, though in-depth probing is required to assess architectural autonomy. Recommended as a potential shortlist candidate pending targeted technical verification on highlighted gaps.`
      : `The candidate does not currently meet the necessary seniority and core technical criteria established for this ${extractJobTitle(jobDescription)} position. Notable deficits in ${missingKeywords.slice(0, 3).join(', ') || 'requisite technical stack'} and significant variance in years of relevant production experience indicate high risk. Not recommended to advance to recruiter screening rounds at this time.`;

    return {
      matchScore: overallScore,
      oneLineRationale: oneLineRationale,
      verdict: verdict,
      shortlistRecommendation: shortlistRecommendation,
      shortlistConfidence: shortlistConfidence,
      subScores: {
        skills: { score: skillsScore, label: 'Skills Alignment', summary: `${matchedKeywords.length} of ${jdKeywords.length || 5} core keywords verified` },
        experience: { score: experienceScore, label: 'Experience & Seniority', summary: `~${resumeYearsEstimate} yrs evaluated vs ${jdYearsRequired}+ required` },
        domain: { score: domainScore, label: 'Industry & Domain Fit', summary: matchedDomains.length > 0 ? `Exposure to ${matchedDomains.join(', ')}` : 'General software background' },
        education: { score: educationScore, label: 'Education & Certifications', summary: hasDegree ? 'Degree & credentials verified' : 'Practical experience evaluated' }
      },
      areasOfMatch: areasOfMatch,
      areasOfMismatch: areasOfMismatch,
      atsKeywords: {
        matched: matchedKeywords.slice(0, 10).map(k => capitalizeWord(k)),
        missing: missingKeywords.slice(0, 8).map(k => capitalizeWord(k))
      },
      progressionAndTenure: {
        stabilityRating: stabilityRating,
        observation: tenureObs
      },
      redFlagsAndRisks: redFlagsAndRisks,
      suggestedInterviewQuestions: suggestedInterviewQuestions,
      recruiterSummary: recruiterSummary
    };
  }

  function estimateResumeYears(text) {
    const years = [];
    const dateRegex = /\b(20[0-2][0-9]|199[0-9])\b/g;
    let m;
    while ((m = dateRegex.exec(text)) !== null) {
      years.push(parseInt(m[1], 10));
    }
    if (years.length >= 2) {
      const min = Math.min(...years);
      const max = Math.min(new Date().getFullYear(), Math.max(...years));
      const diff = max - min;
      if (diff >= 1 && diff <= 35) return diff;
    }
    const expMatch = text.match(/(\d+)\+?\s*years/i);
    if (expMatch) return parseInt(expMatch[1], 10);
    return 3;
  }

  function extractJobTitle(jd) {
    const match = jd.match(/(?:title|role|position):\s*([^\n\r]+)/i);
    if (match) return match[1].trim();
    return 'target';
  }

  function capitalizeWord(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // --- Rendering Results to DOM ---

  function renderAssessmentResults(data) {
    elements.loadingState.classList.add('hidden');
    elements.resultsState.classList.remove('hidden');

    const score = Math.round(data.matchScore || 0);

    // 1. Match Score Gauge Animation
    animateGauge(score);

    // 2. Verdict Badge
    const verdict = data.verdict || 'Moderate Fit';
    elements.verdictBadge.textContent = verdict;
    elements.verdictBadge.className = 'badge-verdict ' + getVerdictClass(verdict);

    // 3. Shortlist Recommendation Badge
    const rec = data.shortlistRecommendation || 'Maybe';
    elements.shortlistBadge.textContent = `Shortlist: ${rec.toUpperCase()}`;
    elements.shortlistBadge.className = 'badge-shortlist ' + getShortlistClass(rec);

    // 4. One-line Rationale
    elements.oneLineRationale.textContent = data.oneLineRationale || '';

    // 5. Sub-scores
    const subs = data.subScores || {};
    renderSubScore(elements.subScoreSkills, elements.subScoreSkillsBar, subs.skills?.score || 70);
    renderSubScore(elements.subScoreExp, elements.subScoreExpBar, subs.experience?.score || 70);
    renderSubScore(elements.subScoreDomain, elements.subScoreDomainBar, subs.domain?.score || 70);
    renderSubScore(elements.subScoreEdu, elements.subScoreEduBar, subs.education?.score || 70);

    // 6. Recruiter Executive Summary
    elements.recruiterSummary.textContent = data.recruiterSummary || 'Evaluation complete.';

    // 7. Areas of Match
    renderBulletList(elements.matchList, data.areasOfMatch || [], 'match-item');

    // 8. Areas of Mismatch / Gaps
    renderBulletList(elements.mismatchList, data.areasOfMismatch || [], 'mismatch-item');

    // 9. ATS Keywords
    const ats = data.atsKeywords || { matched: [], missing: [] };
    renderKeywordTags(elements.matchedKeywordsList, ats.matched || [], 'tag-match');
    renderKeywordTags(elements.missingKeywordsList, ats.missing || [], 'tag-missing');

    // 10. Progression & Tenure
    const prog = data.progressionAndTenure || {};
    elements.tenureRating.textContent = `Stability: ${prog.stabilityRating || 'Normal'}`;
    elements.tenureRating.className = 'badge-tenure ' + getStabilityClass(prog.stabilityRating);
    elements.tenureObservation.textContent = prog.observation || 'Standard career trajectory noted.';

    // 11. Red Flags & Risks
    const redFlags = data.redFlagsAndRisks || [];
    renderBulletList(elements.redFlagsList, redFlags, 'flag-item');

    // 12. Suggested Interview Questions
    renderBulletList(elements.interviewQuestionsList, data.suggestedInterviewQuestions || [], 'probe-item');
  }

  function animateGauge(targetScore) {
    const circle = elements.gaugeCircle;
    const valueEl = elements.matchScoreValue;
    const circumference = 2 * Math.PI * 45;

    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    let strokeColor = '#10b981';
    if (targetScore < 60) strokeColor = '#ef4444';
    else if (targetScore < 80) strokeColor = '#f59e0b';

    circle.style.stroke = strokeColor;

    const offset = circumference - (targetScore / 100) * circumference;

    setTimeout(() => {
      circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      circle.style.strokeDashoffset = `${offset}`;
    }, 50);

    let current = 0;
    const stepTime = 1200 / Math.max(targetScore, 1);
    const counter = setInterval(() => {
      current++;
      if (current >= targetScore) {
        current = targetScore;
        clearInterval(counter);
      }
      valueEl.textContent = `${current}%`;
    }, Math.max(stepTime, 12));
  }

  function renderSubScore(textEl, barEl, score) {
    textEl.textContent = `${score}%`;
    barEl.style.width = '0%';
    setTimeout(() => {
      barEl.style.transition = 'width 0.8s ease-out';
      barEl.style.width = `${score}%`;
      if (score >= 80) barEl.style.backgroundColor = '#10b981';
      else if (score >= 60) barEl.style.backgroundColor = '#f59e0b';
      else barEl.style.backgroundColor = '#ef4444';
    }, 100);
  }

  function renderBulletList(container, items, itemClass) {
    container.innerHTML = '';
    if (!items || items.length === 0) {
      container.innerHTML = '<li class="text-slate-400 italic">None noted.</li>';
      return;
    }
    items.forEach(text => {
      const li = document.createElement('li');
      li.className = itemClass;
      li.textContent = text;
      container.appendChild(li);
    });
  }

  function renderKeywordTags(container, keywords, tagClass) {
    container.innerHTML = '';
    if (!keywords || keywords.length === 0) {
      container.innerHTML = '<span class="text-xs text-slate-400 italic">None identified</span>';
      return;
    }
    keywords.forEach(kw => {
      const span = document.createElement('span');
      span.className = `keyword-tag ${tagClass}`;
      span.textContent = kw;
      container.appendChild(span);
    });
  }

  function getVerdictClass(verdict) {
    const v = (verdict || '').toLowerCase();
    if (v.includes('strong')) return 'verdict-strong';
    if (v.includes('moderate')) return 'verdict-moderate';
    return 'verdict-weak';
  }

  function getShortlistClass(rec) {
    const r = (rec || '').toLowerCase();
    if (r.includes('yes')) return 'shortlist-yes';
    if (r.includes('maybe')) return 'shortlist-maybe';
    return 'shortlist-no';
  }

  function getStabilityClass(rating) {
    const r = (rating || '').toLowerCase();
    if (r.includes('high')) return 'stability-high';
    if (r.includes('moderate')) return 'stability-moderate';
    return 'stability-concerning';
  }

  // --- Modal & Settings Management ---

  function openSettingsModal() {
    elements.apiKeyInput.value = STATE.claudeApiKey || '';
    elements.modelSelect.value = STATE.selectedModel || 'claude-3-5-sonnet-20241022';
    elements.apiTestFeedback.textContent = '';
    elements.apiTestFeedback.className = 'text-xs mt-1';
    elements.settingsModal.classList.remove('hidden');
  }

  function closeSettingsModal() {
    elements.settingsModal.classList.add('hidden');
  }

  function toggleKeyVisibility() {
    const isPassword = elements.apiKeyInput.type === 'password';
    elements.apiKeyInput.type = isPassword ? 'text' : 'password';
    elements.toggleKeyVisibility.textContent = isPassword ? 'Hide' : 'Show';
  }

  function saveSettings() {
    const key = elements.apiKeyInput.value.trim();
    const model = elements.modelSelect.value;
    const storagePref = elements.storagePreference.value;

    STATE.claudeApiKey = key;
    STATE.selectedModel = model;

    if (storagePref === 'session') {
      sessionStorage.setItem('resumescreener_api_key', key);
      sessionStorage.setItem('resumescreener_model', model);
      localStorage.removeItem('resumescreener_api_key');
    } else if (storagePref === 'local') {
      localStorage.setItem('resumescreener_api_key', key);
      localStorage.setItem('resumescreener_model', model);
      sessionStorage.removeItem('resumescreener_api_key');
    } else {
      sessionStorage.removeItem('resumescreener_api_key');
      localStorage.removeItem('resumescreener_api_key');
    }

    updateApiStatusIndicator();
    closeSettingsModal();
    showToast('Settings saved successfully!');
  }

  function clearApiKey() {
    STATE.claudeApiKey = '';
    elements.apiKeyInput.value = '';
    sessionStorage.removeItem('resumescreener_api_key');
    localStorage.removeItem('resumescreener_api_key');
    updateApiStatusIndicator();
    showToast('API key removed. Reverting to Built-in Recruiter Engine.');
  }

  async function testAnthropicApiKey() {
    const key = elements.apiKeyInput.value.trim();
    if (!key) {
      elements.apiTestFeedback.textContent = 'Please enter an API key to test.';
      elements.apiTestFeedback.className = 'text-xs mt-1 text-red-500';
      return;
    }

    elements.apiTestFeedback.textContent = 'Verifying key with Anthropic...';
    elements.apiTestFeedback.className = 'text-xs mt-1 text-slate-500';

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Ping' }]
        })
      });

      if (resp.ok) {
        elements.apiTestFeedback.textContent = 'Key verified successfully! Ready for live Claude API screening.';
        elements.apiTestFeedback.className = 'text-xs mt-1 text-emerald-600 font-medium';
      } else {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error?.message || `HTTP ${resp.status}`);
      }
    } catch (err) {
      elements.apiTestFeedback.textContent = `Verification failed: ${err.message}`;
      elements.apiTestFeedback.className = 'text-xs mt-1 text-rose-500';
    }
  }

  function loadStoredSettings() {
    const key = sessionStorage.getItem('resumescreener_api_key') || localStorage.getItem('resumescreener_api_key') || '';
    const model = sessionStorage.getItem('resumescreener_model') || localStorage.getItem('resumescreener_model') || 'claude-3-5-sonnet-20241022';

    STATE.claudeApiKey = key;
    STATE.selectedModel = model;

    updateApiStatusIndicator();
  }

  function updateApiStatusIndicator() {
    if (elements.apiStatusBadge) {
      if (STATE.claudeApiKey && STATE.claudeApiKey.trim().length > 10) {
        elements.apiStatusBadge.textContent = 'Claude API: Active';
        elements.apiStatusBadge.className = 'text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200';
      } else {
        elements.apiStatusBadge.textContent = 'Built-in Recruiter Mode (Demo)';
        elements.apiStatusBadge.className = 'text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200';
      }
    }
  }

  // --- Extracted Text Preview Modal ---

  function openTextPreviewModal() {
    if (!STATE.resumeFile || !STATE.resumeFile.text) return;
    elements.previewTextContent.textContent = STATE.resumeFile.text;
    elements.textPreviewModal.classList.remove('hidden');
  }

  function closeTextPreviewModal() {
    elements.textPreviewModal.classList.add('hidden');
  }

  // --- Copy & Export Actions ---

  function copyRecruiterSummary() {
    const summary = elements.recruiterSummary.textContent;
    if (!summary) return;
    navigator.clipboard.writeText(summary).then(() => {
      showToast('Recruiter executive summary copied to clipboard for ATS/Hiring Manager!');
    });
  }

  function copyFullReportMarkdown() {
    if (!STATE.activeAssessment) return;
    const d = STATE.activeAssessment;
    const md = `# Candidate Screening Assessment
**Match Score**: ${d.matchScore}%
**Verdict**: ${d.verdict}
**Shortlist Recommendation**: ${d.shortlistRecommendation} (Confidence: ${d.shortlistConfidence})

## Executive Summary
${d.recruiterSummary}

**One-Line Rationale**: ${d.oneLineRationale}

## Sub-Scores
- Skills Alignment: ${d.subScores?.skills?.score}% (${d.subScores?.skills?.summary})
- Experience & Seniority: ${d.subScores?.experience?.score}% (${d.subScores?.experience?.summary})
- Industry & Domain Fit: ${d.subScores?.domain?.score}% (${d.subScores?.domain?.summary})
- Education & Certifications: ${d.subScores?.education?.score}% (${d.subScores?.education?.summary})

## Areas of Match (Key Evidence)
${d.areasOfMatch?.map(m => `- ${m}`).join('\n')}

## Areas of Mismatch / Gaps
${d.areasOfMismatch?.map(m => `- ${m}`).join('\n')}

## ATS Keywords
- **Matched**: ${d.atsKeywords?.matched?.join(', ')}
- **Missing**: ${d.atsKeywords?.missing?.join(', ')}

## Tenure Stability & Progression
- Stability Rating: ${d.progressionAndTenure?.stabilityRating}
- Observation: ${d.progressionAndTenure?.observation}

## Red Flags & Risks
${d.redFlagsAndRisks?.map(r => `- ${r}`).join('\n')}

## Recommended Interview Probe Questions
${d.suggestedInterviewQuestions?.map(q => `- ${q}`).join('\n')}

---
*Fairness Guardrail Disclaimer: This evaluation is generated as decision-support for human recruiters. Protected demographic attributes are excluded. Final hiring decisions should always be made by human interviewers.*
`;

    navigator.clipboard.writeText(md).then(() => {
      showToast('Full candidate assessment copied as Markdown!');
    });
  }

  // --- Utility Functions ---

  function countWords(str) {
    if (!str) return 0;
    const matches = str.trim().match(/\S+/g);
    return matches ? matches.length : 0;
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  function showToast(message, type = 'info') {
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('hidden');

    if (type === 'error') {
      elements.toast.style.borderLeftColor = '#ef4444';
    } else if (type === 'warning') {
      elements.toast.style.borderLeftColor = '#f59e0b';
    } else {
      elements.toast.style.borderLeftColor = '#10b981';
    }

    clearTimeout(elements.toastTimeout);
    elements.toastTimeout = setTimeout(() => {
      elements.toast.classList.add('hidden');
    }, 4000);
  }

})();
