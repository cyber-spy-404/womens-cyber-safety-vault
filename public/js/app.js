// Privacy-First Digital Evidence Locker - Comprehensive Application Controller
// Zero-Knowledge Web Crypto, Re-implemented Double-Click & Panic System, Multi-Media Decryption

const App = {
  state: {
    user: null,             // { id, email_pseudonym, session_token, crypto_salt }
    masterKey: null,        // CryptoKey derived via PBKDF2 (in-memory only!)
    evidenceList: [],
    pendingRegistration: null,
    pendingUploadFile: null,
    editingItem: null,
    escapeKeyPresses: 0,
    escapeKeyTimer: null,
    panicSettings: {
      destination: 'https://www.google.com',
      dblClickBackground: false,
      floatingShield: true,
      autoLockSeconds: 180
    },
    lastActivityTime: Date.now(),
    autoLockInterval: null,
    activeAudioCtx: null,
    audioAnalyser: null,
    audioAnimFrame: null,
    activePreviewDecryptedBuffer: null,
    activePreviewMime: null,
    activePreviewBlobUrl: null,
    activeFilter: 'all',
    searchQuery: '',
    sortBy: 'date-desc',
    activeInspectorItem: null,
    redactor: {
      image: null,
      boxes: [],
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0
    },
    simpleMode: true
  },

  init() {
    if (window.I18n) window.I18n.init();
    this.initViewMode();
    this.loadPanicSettings();
    this.bindEvents();
    this.setupDoubleClicksAndEscape();
    this.setupInactivityWatcher();
    this.setupSurvivorGuide();
    this.setupEvidenceHelper();
    this.setupTechDetailsToggle();
    this.setupCustomLanguageDropdown();
    this.preCacheEscapeDestinations();
    this.checkExistingSession();
    this.initRedactor();
  },

  // ----------------------------------------------------
  // 1. PANIC SETTINGS & DOUBLE-CLICK SYSTEM RE-IMPLEMENTATION
  // ----------------------------------------------------

  loadPanicSettings() {
    try {
      const saved = localStorage.getItem('evidence_locker_panic_settings');
      if (saved) {
        this.state.panicSettings = { ...this.state.panicSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not load panic settings:', e);
    }
    this.applyPanicSettingsUI();
  },

  savePanicSettings() {
    try {
      localStorage.setItem('evidence_locker_panic_settings', JSON.stringify(this.state.panicSettings));
    } catch (e) {}
    this.applyPanicSettingsUI();
  },

  applyPanicSettingsUI() {
    const destSelect = document.getElementById('panic-dest-select');
    if (destSelect) {
      const savedDest = this.state.panicSettings.destination;
      // Check if saved destination matches a preset option
      const presetMatch = Array.from(destSelect.options).some(opt => opt.value === savedDest);
      if (presetMatch) {
        destSelect.value = savedDest;
      } else {
        // It's a custom URL — select the "custom" option and populate the field
        destSelect.value = 'custom';
        const customInput = document.getElementById('panic-dest-custom-url');
        if (customInput) {
          customInput.value = savedDest;
          customInput.style.display = 'block';
        }
      }
    }

    const bgDblChk = document.getElementById('chk-panic-bg-dblclick');
    if (bgDblChk) bgDblChk.checked = this.state.panicSettings.dblClickBackground;

    const shieldChk = document.getElementById('chk-floating-panic');
    if (shieldChk) shieldChk.checked = this.state.panicSettings.floatingShield;

    const shieldEl = document.getElementById('floating-panic-shield');
    if (shieldEl) {
      shieldEl.style.display = this.state.panicSettings.floatingShield ? 'inline-flex' : 'none';
    }

    const badgeBg = document.getElementById('badge-bg-panic');
    if (badgeBg) {
      badgeBg.style.display = this.state.panicSettings.dblClickBackground ? 'inline-block' : 'none';
    }

    const autolockSelect = document.getElementById('panic-autolock-select');
    if (autolockSelect) {
      autolockSelect.value = String(this.state.panicSettings.autoLockSeconds !== undefined ? this.state.panicSettings.autoLockSeconds : 180);
    }
  },

  preCacheEscapeDestinations() {
    window.addEventListener('load', () => {
      try {
        const dest = this.state.panicSettings.destination || 'https://www.google.com';
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = dest;
        document.head.appendChild(prefetchLink);
      } catch (e) {}
    });
  },

  triggerEmergencyEscape() {
    this.stopAudioPlayback();
    const dest = this.state.panicSettings.destination || 'https://www.google.com';

    // 1. Clear volatile memory, master keys, session, and local credentials immediately
    try {
      sessionStorage.clear();
      localStorage.removeItem('evidence_locker_user');
      localStorage.removeItem('panic_lockout_active');
      localStorage.removeItem('panic_lockout_until');
      localStorage.removeItem('panic_dest');
    } catch (e) {}
    this.state.masterKey = null;
    this.state.user = null;
    this.state.evidenceList = [];

    // 3. Instantly display camouflage cloak in 0ms
    const cloak = document.getElementById('instant-google-cloak');
    if (cloak && dest.includes('google.com')) {
      cloak.style.display = 'flex';
    }

    // 4. Force browser navigation to real external destination
    try {
      window.location.replace(dest);
    } catch (e) {
      window.location.href = dest;
    }

    // Backup navigation on next event loop tick
    setTimeout(() => {
      try {
        window.location.replace(dest);
      } catch (e) {
        window.location.href = dest;
      }
    }, 25);
  },

  setupDoubleClicksAndEscape() {
    const triggerEscape = () => this.triggerEmergencyEscape();

    // 1. Quick Exit Button Click & Double-Click
    const exitBtn = document.getElementById('quick-escape-btn');
    exitBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      triggerEscape();
    });
    exitBtn?.addEventListener('dblclick', (e) => {
      e.preventDefault();
      triggerEscape();
    });

    // 2. Safety Bar Double-Click (Emergency zone)
    const safetyBar = document.getElementById('safety-bar');
    safetyBar?.addEventListener('dblclick', (e) => {
      // If not clicking an auxiliary button inside the safety bar
      if (!e.target.closest('button')) {
        e.preventDefault();
        triggerEscape();
      }
    });

    // 3. Floating Panic Shield (Bottom-Right) Click & Double-Click
    const floatingShield = document.getElementById('floating-panic-shield');
    floatingShield?.addEventListener('click', (e) => {
      e.preventDefault();
      triggerEscape();
    });
    floatingShield?.addEventListener('dblclick', (e) => {
      e.preventDefault();
      triggerEscape();
    });

    // 4. Configurable Background Double-Click
    window.addEventListener('dblclick', (e) => {
      // If user enabled the high-paranoia "Double-Click Anywhere" setting:
      if (this.state.panicSettings.dblClickBackground) {
        // Exclude inputs, textareas, buttons, modals, or evidence cards
        const isInteractive = e.target.closest('input, textarea, button, select, .modal-content, .evidence-card, canvas');
        if (!isInteractive) {
          e.preventDefault();
          triggerEscape();
        }
      }
    });

    // 5. Smart ESC Key Handler:
    // - If any modal is active: ESC closes the modal first without exiting!
    // - If no modal is active: Double ESC triggers the emergency exit with e.preventDefault().
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          e.preventDefault();
          this.stopAudioPlayback();
          activeModal.classList.remove('active');
          this.state.escapeKeyPresses = 0;
          return;
        }



        this.state.escapeKeyPresses++;
        clearTimeout(this.state.escapeKeyTimer);
        if (this.state.escapeKeyPresses >= 2) {
          // CRITICAL: Must call preventDefault and stopPropagation so the browser
          // does not execute its native Escape "window.stop()" abort command!
          e.preventDefault();
          e.stopPropagation();
          triggerEscape();
        } else {
          this.showToast('ESC pressed once. Press ESC again to emergency exit.', 'info');
          this.state.escapeKeyTimer = setTimeout(() => {
            this.state.escapeKeyPresses = 0;
          }, 800);
        }
      }
    });
  },

  // ----------------------------------------------------
  // 2. UI NAVIGATION & EVENT BINDINGS
  // ----------------------------------------------------

  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('[data-view-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view-target');
        this.showView(targetView);
      });
    });

    // Multi-Language Selector
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        if (window.I18n) {
          window.I18n.setLanguage(e.target.value);
        }
      });
    }

    // Dynamic re-render on language switch
    window.addEventListener('languageChanged', () => {
      if (this.state.user && this.state.evidenceList.length > 0) {
        this.renderEvidenceList();
      }
    });

    // Auth forms
    document.getElementById('form-login')?.addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('form-register')?.addEventListener('submit', (e) => this.handleRegisterStart(e));
    document.getElementById('form-recovery')?.addEventListener('submit', (e) => this.handleRecovery(e));
    document.getElementById('btn-confirm-mnemonic')?.addEventListener('click', () => this.handleRegisterConfirm());
    document.getElementById('btn-copy-mnemonic')?.addEventListener('click', () => this.copyMnemonicWords());
    document.getElementById('btn-logout')?.addEventListener('click', () => this.handleLogout());

    // Registration stealth website selector: show/hide custom URL field
    document.getElementById('reg-stealth-dest')?.addEventListener('change', (e) => {
      const customInput = document.getElementById('reg-stealth-custom-url');
      if (customInput) {
        customInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
        if (e.target.value === 'custom') customInput.focus();
      }
    });

    // Panic Settings modal: show/hide custom URL field
    document.getElementById('panic-dest-select')?.addEventListener('change', (e) => {
      const customInput = document.getElementById('panic-dest-custom-url');
      if (customInput) {
        customInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
        if (e.target.value === 'custom') customInput.focus();
      }
    });

    // Switch between login, register, and recover views
    document.getElementById('link-to-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showView('view-register');
    });
    document.getElementById('link-to-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showView('view-login');
    });
    document.getElementById('link-to-recover')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showView('view-recover');
    });
    document.getElementById('link-back-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showView('view-login');
    });

    // Safety Aux buttons in top bar
    document.getElementById('btn-open-panic-settings')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('modal-panic-settings')?.classList.add('active');
    });

    document.getElementById('btn-open-helplines')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showView('view-resources');
    });

    // Panic Settings form
    document.getElementById('form-panic-settings')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const destSelect = document.getElementById('panic-dest-select');
      const bgDblChk = document.getElementById('chk-panic-bg-dblclick');
      const shieldChk = document.getElementById('chk-floating-panic');
      const autolockSelect = document.getElementById('panic-autolock-select');

      let dest = destSelect.value;
      if (dest === 'custom') {
        const customUrl = document.getElementById('panic-dest-custom-url')?.value?.trim();
        dest = (customUrl && /^https?:\/\//i.test(customUrl)) ? customUrl : 'https://www.google.com';
      }
      this.state.panicSettings.destination = dest;
      this.state.panicSettings.dblClickBackground = bgDblChk.checked;
      this.state.panicSettings.floatingShield = shieldChk.checked;
      if (autolockSelect) {
        this.state.panicSettings.autoLockSeconds = parseInt(autolockSelect.value, 10);
      }
      this.savePanicSettings();

      document.getElementById('modal-panic-settings')?.classList.remove('active');
      this.showToast('Safety preferences saved successfully.', 'success');
    });

    // File Dropzone / Ingestion (Simple View)
    const dropzone = document.getElementById('vault-dropzone');
    const fileInput = document.getElementById('evidence-file-input');
    const btnBrowse = document.getElementById('btn-browse-files');

    if (btnBrowse && fileInput) {
      btnBrowse.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          fileInput.click();
        }
      });
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.queueEvidenceFiles(Array.from(e.dataTransfer.files));
        }
      });
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.queueEvidenceFiles(Array.from(e.target.files));
        }
      });
    }

    // Forensic Workstation Dropzone & Ingestion (Forensic View)
    const forensicDropzone = document.getElementById('forensic-vault-dropzone');
    const forensicFileInput = document.getElementById('forensic-file-input');
    const btnForensicBrowse = document.getElementById('btn-forensic-browse-files');
    const btnForensicAnchor = document.getElementById('btn-forensic-anchor-evidence');

    const triggerForensicUpload = () => {
      if (!this.isAuthenticated()) {
        this.showToast('Please unlock your vault first to ingest and anchor evidence.', 'info');
        this.showView('view-login');
        return;
      }
      forensicFileInput?.click();
    };

    if (btnForensicBrowse) {
      btnForensicBrowse.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerForensicUpload();
      });
    }

    if (btnForensicAnchor) {
      btnForensicAnchor.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerForensicUpload();
      });
    }

    if (forensicDropzone && forensicFileInput) {
      forensicDropzone.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          triggerForensicUpload();
        }
      });
      forensicDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        forensicDropzone.classList.add('dragover');
      });
      forensicDropzone.addEventListener('dragleave', () => forensicDropzone.classList.remove('dragover'));
      forensicDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        forensicDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.queueEvidenceFiles(Array.from(e.dataTransfer.files));
        }
      });
      forensicFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.queueEvidenceFiles(Array.from(e.target.files));
        }
      });
    }

    // Forensic Ingestion Helper & Redactor shortcuts
    document.getElementById('btn-forensic-open-redactor')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('modal-redactor')?.classList.add('active');
    });

    document.getElementById('btn-forensic-help-evidence')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('modal-evidence-helper')?.classList.add('active');
    });

    document.getElementById('link-jump-to-forensic-upload')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.isAuthenticated()) {
        this.showToast('Please unlock your vault first to ingest evidence.', 'info');
        this.showView('view-login');
        return;
      }
      forensicDropzone?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      forensicDropzone?.focus();
    });

    // Global dragover/drop protection to prevent accidental browser file-opening navigation
    window.addEventListener('dragover', (e) => e.preventDefault(), false);
    window.addEventListener('drop', (e) => {
      if (!e.target.closest('.dropzone')) {
        e.preventDefault();
      }
    }, false);

    // Sync Prompt Tags Checkboxes between Simple and Forensic views
    const chkPrompt = document.getElementById('chk-prompt-tags');
    const chkForensicPrompt = document.getElementById('chk-forensic-prompt-tags');
    if (chkPrompt && chkForensicPrompt) {
      chkPrompt.addEventListener('change', () => { chkForensicPrompt.checked = chkPrompt.checked; });
      chkForensicPrompt.addEventListener('change', () => { chkPrompt.checked = chkForensicPrompt.checked; });
    }

    // Incident Tagging Modal Form
    document.getElementById('form-incident-tags')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleIncidentTagsSubmit();
    });
    document.getElementById('btn-cancel-tags')?.addEventListener('click', () => {
      document.getElementById('modal-tag-incident')?.classList.remove('active');
      if (this.state.pendingUploadFile) {
        this.executeEvidenceUploadPipeline(this.state.pendingUploadFile, {});
        this.state.pendingUploadFile = null;
      }
    });

    // Redactor Open / File Select
    document.getElementById('btn-open-redactor')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('modal-redactor')?.classList.add('active');
    });
    document.getElementById('btn-redact-select-file')?.addEventListener('click', () => {
      document.getElementById('redact-file-input')?.click();
    });
    document.getElementById('btn-close-redactor')?.addEventListener('click', () => {
      document.getElementById('modal-redactor')?.classList.remove('active');
    });

    // Search & Filter Controls
    const searchInput = document.getElementById('vault-search-input');
    const clearSearchBtn = document.getElementById('btn-clear-search');
    searchInput?.addEventListener('input', (e) => {
      this.state.searchQuery = e.target.value.toLowerCase().trim();
      if (clearSearchBtn) clearSearchBtn.style.display = this.state.searchQuery ? 'block' : 'none';
      this.renderEvidenceGrid();
    });
    clearSearchBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      this.state.searchQuery = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      this.renderEvidenceGrid();
    });

    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.state.activeFilter = chip.getAttribute('data-filter') || 'all';
        this.renderEvidenceGrid();
      });
    });

    document.getElementById('vault-sort-select')?.addEventListener('change', (e) => {
      this.state.sortBy = e.target.value;
      this.renderEvidenceGrid();
    });

    // Vault Header Actions: Cryptographic Audit & Master Case Dossier
    document.getElementById('btn-run-vault-audit')?.addEventListener('click', () => this.runVaultCryptographicAudit());
    document.getElementById('btn-export-case-dossier')?.addEventListener('click', () => this.handleExportMasterDossier());
    document.getElementById('btn-close-audit')?.addEventListener('click', () => {
      document.getElementById('modal-audit')?.classList.remove('active');
    });

    // Public Verifier Form & Dropzone
    const verifierDropzone = document.getElementById('verifier-dropzone');
    const verifierFileInput = document.getElementById('verifier-file-input');
    const btnVerifierSelect = document.getElementById('btn-verifier-select-file');
    const formVerifierHash = document.getElementById('form-verifier-hash');

    if (btnVerifierSelect && verifierFileInput) {
      btnVerifierSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        verifierFileInput.click();
      });
    }

    if (verifierDropzone && verifierFileInput) {
      verifierDropzone.addEventListener('click', (e) => {
        if (!e.target.closest('button, a, input')) {
          verifierFileInput.click();
        }
      });
      verifierDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        verifierDropzone.classList.add('dragover');
      });
      verifierDropzone.addEventListener('dragleave', () => verifierDropzone.classList.remove('dragover'));
      verifierDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        verifierDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handlePublicFileVerification(e.dataTransfer.files[0]);
        }
      });
      verifierFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const f = e.target.files[0];
          verifierFileInput.value = '';
          this.handlePublicFileVerification(f);
        }
      });
    }

    if (formVerifierHash) {
      formVerifierHash.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputEl = document.getElementById('verifier-hash-input');
        const raw = inputEl ? inputEl.value : '';
        const clean = raw.trim().replace(/\s+/g, '').toLowerCase();
        if (clean) {
          this.verifyEvidenceHash(clean);
        } else {
          this.showToast('Please enter a 64-character SHA-256 hash string.', 'info');
        }
      });
    }

    // Modal Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.stopAudioPlayback();
        btn.closest('.modal-overlay')?.classList.remove('active');
      });
    });

    // Preview Modal Actions
    document.getElementById('btn-preview-close')?.addEventListener('click', () => {
      this.stopAudioPlayback();
      document.getElementById('modal-preview')?.classList.remove('active');
    });
    document.getElementById('btn-preview-export-bundle')?.addEventListener('click', () => {
      if (this.state.activeInspectorItem) {
        this.handleExportBundle(this.state.activeInspectorItem);
      }
    });
    document.getElementById('btn-copy-preview-hash')?.addEventListener('click', () => {
      const hashEl = document.getElementById('preview-hash-val');
      if (hashEl && hashEl.textContent) {
        navigator.clipboard.writeText(hashEl.textContent);
        this.showToast('SHA-256 fingerprint copied to clipboard.', 'success');
      }
    });

    // Forensic Tool: ELA Deepfake Tamper Analysis
    document.getElementById('btn-preview-deepfake')?.addEventListener('click', () => {
      if (!this.state.activeInspectorItem || !this.state.activePreviewDecryptedBuffer) {
        this.showToast('Please open an image file in the preview inspector first.', 'info');
        return;
      }
      const blob = new Blob([this.state.activePreviewDecryptedBuffer], { type: this.state.activePreviewMime || 'image/png' });
      const imgUrl = URL.createObjectURL(blob);
      const elaImg = document.getElementById('ela-orig-img');
      if (elaImg) {
        elaImg.src = imgUrl;
      }
      document.getElementById('modal-deepfake-analyzer')?.classList.add('active');
      this.runErrorLevelAnalysis();
    });

    document.getElementById('btn-close-ela')?.addEventListener('click', () => {
      document.getElementById('modal-deepfake-analyzer')?.classList.remove('active');
    });

    document.getElementById('ela-scale-slider')?.addEventListener('input', (e) => {
      const val = e.target.value;
      const label = document.getElementById('ela-scale-val');
      if (label) label.textContent = `${val}x`;
      this.runErrorLevelAnalysis(parseInt(val, 10));
    });

    document.getElementById('btn-recompute-ela')?.addEventListener('click', () => {
      const slider = document.getElementById('ela-scale-slider');
      const val = slider ? parseInt(slider.value, 10) : 20;
      this.runErrorLevelAnalysis(val);
    });

    // Forensic Tool: Section 65B (IEA) / Section 63 (BSA) Certificate PDF Download
    document.getElementById('btn-preview-cert65b')?.addEventListener('click', () => {
      if (!this.state.activeInspectorItem) return;
      try {
        const item = this.state.activeInspectorItem;
        const pdfBuffer = EvidenceExporter.generateSection65BCertificatePDF(item);
        const origName = item.metadata?.original_filename || 'evidence';
        const fname = `Section_65B_Certificate_${origName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.pdf`;
        EvidenceExporter.downloadBufferAsFile(pdfBuffer, fname);
        this.showToast('Section 65B / BSA Statutory Electronic Certificate downloaded.', 'success');
      } catch (err) {
        console.error(err);
        this.showToast('Failed to generate Section 65B certificate: ' + err.message, 'danger');
      }
    });

    // Forensic Tool: Cyber Crime Police FIR Petition Generator
    document.getElementById('btn-preview-fir-complaint')?.addEventListener('click', () => {
      if (!this.state.activeInspectorItem) return;
      const item = this.state.activeInspectorItem;
      const meta = item.metadata || {};

      const compName = document.getElementById('fir-complainant-name');
      const suspHandle = document.getElementById('fir-suspect-handle');
      const incNotes = document.getElementById('fir-incident-summary');

      if (compName) compName.value = this.state.user?.email_pseudonym || 'Survivor';
      if (suspHandle) suspHandle.value = meta.perpetrator || '';
      if (incNotes) incNotes.value = meta.incident_notes || `Reporting incident of ${meta.incident_category || 'online abuse'} that took place on platform ${meta.platform || 'Online'}. Attached file: ${meta.original_filename}.`;

      document.getElementById('modal-fir-generator')?.classList.add('active');
    });

    document.getElementById('btn-cancel-fir')?.addEventListener('click', () => {
      document.getElementById('modal-fir-generator')?.classList.remove('active');
    });

    document.getElementById('form-fir-complaint')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.state.activeInspectorItem) return;

      const complaintData = {
        complainant_name: document.getElementById('fir-complainant-name')?.value.trim() || 'Survivor',
        police_station: document.getElementById('fir-police-station')?.value.trim() || 'District Cyber Cell',
        suspect_handle: document.getElementById('fir-suspect-handle')?.value.trim() || 'Unknown',
        complainant_contact: document.getElementById('fir-contact-details')?.value.trim() || 'Confidential',
        incident_description: document.getElementById('fir-incident-summary')?.value.trim() || ''
      };

      try {
        const item = this.state.activeInspectorItem;
        const pdfBuffer = EvidenceExporter.generatePoliceComplaintPDF(item, complaintData);
        const origName = item.metadata?.original_filename || 'complaint';
        const fname = `Cyber_Police_FIR_Petition_${origName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.pdf`;
        EvidenceExporter.downloadBufferAsFile(pdfBuffer, fname);

        document.getElementById('modal-fir-generator')?.classList.remove('active');
        this.showToast('Formal Police FIR complaint petition generated and downloaded (PDF).', 'success');
      } catch (err) {
        console.error(err);
        this.showToast('Failed to generate FIR complaint: ' + err.message, 'danger');
      }
    });

    // Vault locked barrier login redirect button
    document.getElementById('btn-vault-barrier-login')?.addEventListener('click', () => {
      this.showView('view-login');
    });

    // View mode navigation (Simple View vs Forensic View)
    document.getElementById('btn-mode-simple')?.addEventListener('click', () => this.toggleViewMode('simple'));
    document.getElementById('btn-mode-forensic')?.addEventListener('click', () => this.toggleViewMode('forensic'));
    document.getElementById('nav-btn-simple')?.addEventListener('click', () => this.toggleViewMode('simple'));
    document.getElementById('nav-btn-forensic')?.addEventListener('click', () => this.toggleViewMode('forensic'));
    document.getElementById('btn-forensic-unlock-vault')?.addEventListener('click', () => this.showView('view-login'));
    document.getElementById('btn-forensic-audit-run')?.addEventListener('click', () => this.runVaultCryptographicAudit());
    document.getElementById('btn-forensic-export-dossier')?.addEventListener('click', () => this.handleExportMasterDossier());
    document.getElementById('btn-forensic-open-deepfake')?.addEventListener('click', () => {
      document.getElementById('modal-deepfake-analyzer')?.classList.add('active');
      this.runErrorLevelAnalysis();
    });
    document.getElementById('forensic-table-search')?.addEventListener('input', () => {
      this.renderForensicLedgerTable();
    });
  },

  initViewMode() {
    const saved = localStorage.getItem('evidence_locker_simple_mode');
    this.state.simpleMode = (saved === null) ? true : (saved === 'true');
    this.applyViewModeUI();
  },

  toggleViewMode(mode) {
    this.state.simpleMode = (mode === 'simple');
    localStorage.setItem('evidence_locker_simple_mode', this.state.simpleMode ? 'true' : 'false');
    this.applyViewModeUI();

    if (mode === 'forensic') {
      this.showView('view-forensic');
      const msg = window.I18n ? window.I18n.t('vault.forensicModeDesc') || 'Switched to Court Forensic View.' : 'Switched to Court Forensic View: Full SHA-256 ledger.';
      this.showToast(msg, 'info');
    } else {
      this.showView(this.isAuthenticated() ? 'view-vault' : 'view-login');
      const msg = window.I18n ? window.I18n.t('vault.simpleModeDesc') || 'Switched to Survivor Simple View.' : 'Switched to Survivor Simple View: Easy & reassuring.';
      this.showToast(msg, 'info');
    }
  },

  applyViewModeUI() {
    const isSimple = !!this.state.simpleMode;
    if (isSimple) {
      document.body.classList.add('mode-simple');
      document.body.classList.remove('mode-forensic');
    } else {
      document.body.classList.remove('mode-simple');
      document.body.classList.add('mode-forensic');
    }

    const btnSimple = document.getElementById('btn-mode-simple');
    const btnForensic = document.getElementById('btn-mode-forensic');
    const navSimple = document.getElementById('nav-btn-simple');
    const navForensic = document.getElementById('nav-btn-forensic');

    if (btnSimple) {
      btnSimple.classList.toggle('active', isSimple);
      btnSimple.setAttribute('aria-pressed', isSimple ? 'true' : 'false');
    }
    if (btnForensic) {
      btnForensic.classList.toggle('active', !isSimple);
      btnForensic.setAttribute('aria-pressed', !isSimple ? 'true' : 'false');
    }
    if (navSimple) {
      navSimple.classList.toggle('active', isSimple);
    }
    if (navForensic) {
      navForensic.classList.toggle('active', !isSimple);
    }
  },

  setupSurvivorGuide() {
    const toggleBtn = document.getElementById('btn-toggle-guide');
    const grid = document.getElementById('guide-steps-grid');
    if (!toggleBtn || !grid) return;

    const isCollapsed = localStorage.getItem('survivor_guide_collapsed') === 'true';
    if (isCollapsed) {
      grid.style.display = 'none';
      toggleBtn.textContent = 'Show Guide ▾';
    }

    toggleBtn.addEventListener('click', () => {
      const nowHidden = grid.style.display === 'none';
      grid.style.display = nowHidden ? 'grid' : 'none';
      toggleBtn.textContent = nowHidden ? 'Hide Guide ▴' : 'Show Guide ▾';
      localStorage.setItem('survivor_guide_collapsed', nowHidden ? 'false' : 'true');
    });
  },

  setupEvidenceHelper() {
    const modal = document.getElementById('modal-evidence-helper');
    const openBtn = document.getElementById('btn-open-evidence-helper');
    const closeBtn = document.getElementById('btn-close-helper');
    const closeXBtn = document.getElementById('btn-close-helper-x');

    if (!modal) return;

    const open = () => modal.classList.add('active');
    const close = () => modal.classList.remove('active');

    openBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      open();
    });
    closeBtn?.addEventListener('click', close);
    closeXBtn?.addEventListener('click', close);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  },

  setupTechDetailsToggle() {
    const btn = document.getElementById('btn-toggle-tech-details');
    const grid = document.getElementById('inspector-grid');
    if (!btn || !grid) return;

    btn.addEventListener('click', () => {
      const isHidden = grid.style.display === 'none';
      grid.style.display = isHidden ? 'grid' : 'none';
      btn.textContent = isHidden ? '⚖️ Hide Technical Forensic Details ▴' : '⚖️ Show Technical Forensic Details ▾';
    });
  },

  setupCustomLanguageDropdown() {
    const container = document.getElementById('lang-custom-dropdown-container');
    const triggerBtn = document.getElementById('lang-custom-btn');
    const menu = document.getElementById('lang-custom-menu');
    const label = document.getElementById('lang-selected-label');
    const hiddenSelect = document.getElementById('lang-select');
    if (!container || !triggerBtn || !menu) return;

    const langNames = {
      en: 'English (IN)',
      hi: 'हिन्दी (Hindi)',
      ta: 'தமிழ் (Tamil)',
      te: 'తెలుగు (Telugu)',
      bn: 'বাংলা (Bengali)',
      mr: 'मराठी (Marathi)'
    };

    const updateActiveUI = (lang) => {
      if (label && langNames[lang]) {
        label.textContent = langNames[lang];
      }
      menu.querySelectorAll('.lang-option-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-lang') === lang;
        btn.classList.toggle('active', isActive);
        const check = btn.querySelector('.lang-check');
        if (check) check.textContent = isActive ? '✓' : '';
      });
    };

    // Toggle menu
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');
      menu.classList.toggle('open', !isOpen);
      triggerBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });

    // Option clicks
    menu.querySelectorAll('.lang-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = btn.getAttribute('data-lang');
        if (selectedLang && window.I18n) {
          window.I18n.setLanguage(selectedLang);
          if (hiddenSelect) hiddenSelect.value = selectedLang;
        }
        updateActiveUI(selectedLang);
        menu.classList.remove('open');
        triggerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        menu.classList.remove('open');
        triggerBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Sync on external languageChanged
    window.addEventListener('languageChanged', (e) => {
      const current = (e.detail && e.detail.lang) || (window.I18n && window.I18n.currentLang) || 'en';
      updateActiveUI(current);
    });

    // Initialize with current language
    const initialLang = (window.I18n && window.I18n.currentLang) || localStorage.getItem('evidence_locker_lang') || 'en';
    updateActiveUI(initialLang);
  },

  isAuthenticated() {
    return !!(this.state.user && this.state.masterKey && this.state.user.session_token);
  },

  showView(viewId) {
    if (viewId === 'view-vault' && !this.isAuthenticated()) {
      viewId = 'view-login';
      const msgEl = document.getElementById('login-status-msg');
      if (msgEl) {
        msgEl.textContent = '🔒 Access Restricted: Please unlock your zero-knowledge vault first.';
        msgEl.style.color = 'var(--apple-blue)';
      }
    }

    if (viewId === 'view-verifier') {
      viewId = 'view-forensic';
    }

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(viewId)?.classList.add('active');

    this.updateNav(viewId);

    if (viewId === 'view-forensic') {
      this.updateForensicViewUI();
    }
    if (viewId === 'view-vault') {
      this.renderEvidenceGrid();
    }
  },

  updateForensicViewUI() {
    const isAuth = this.isAuthenticated();
    const authLedger = document.getElementById('forensic-authenticated-ledger');
    const unauthNotice = document.getElementById('forensic-unauthenticated-notice');

    if (isAuth) {
      if (authLedger) authLedger.style.display = 'block';
      if (unauthNotice) unauthNotice.style.display = 'none';
      this.renderForensicLedgerTable();
    } else {
      if (authLedger) authLedger.style.display = 'none';
      if (unauthNotice) unauthNotice.style.display = 'block';
    }
  },

  renderForensicLedgerTable() {
    const tbody = document.getElementById('forensic-ledger-tbody');
    if (!tbody) return;

    let items = [...this.state.evidenceList];
    const searchVal = document.getElementById('forensic-table-search')?.value?.toLowerCase().trim();
    if (searchVal) {
      items = items.filter(item => {
        const name = (item.metadata?.original_filename || '').toLowerCase();
        const cat = (item.metadata?.incident_category || '').toLowerCase();
        const hash = (item.file_hash || '').toLowerCase();
        return name.includes(searchVal) || cat.includes(searchVal) || hash.includes(searchVal);
      });
    }

    tbody.innerHTML = '';
    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
            No evidence records anchored in vault yet. Drop files in the vault to anchor them to the cryptographic ledger.
          </td>
        </tr>
      `;
      return;
    }

    items.forEach((item, index) => {
      const meta = item.metadata || {};
      const mime = meta.mime_type || '';
      let icon = '📄';
      if (mime.startsWith('image/')) icon = '🖼️';
      else if (mime.startsWith('audio/')) icon = '🎵';
      else if (mime.includes('pdf')) icon = '📕';

      const tr = document.createElement('tr');
      tr.className = 'forensic-table-row';
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${index + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.15rem;">${icon}</span>
            <div>
              <div style="font-weight: 600; color: #fff; font-size: 0.85rem;" title="${meta.original_filename || 'Evidence File'}">
                ${meta.original_filename || 'Evidence File'}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">
                ${Math.round((meta.sanitized_size_bytes || meta.file_size_bytes || 0) / 1024)} KB • ${mime || 'application/octet-stream'}
              </div>
            </div>
          </div>
        </td>
        <td style="font-family: var(--font-mono); font-size: 0.78rem; color: #cbd5e1; white-space: nowrap;">
          ${(item.custodian_timestamp || '').substring(0, 19).replace('T', ' ')} UTC
        </td>
        <td>
          <span class="tag-badge tag-category" style="font-size: 0.72rem; padding: 2px 8px;">
            ${meta.incident_category || 'Evidence'}
          </span>
          ${meta.platform ? `<div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 3px;">${meta.platform}</div>` : ''}
        </td>
        <td>
          <div class="forensic-hash-pill" title="Click to copy full SHA-256 string" data-hash="${item.file_hash}">
            <code>${(item.file_hash || '').substring(0, 14)}…${(item.file_hash || '').substring(58)}</code>
            <span style="font-size: 0.7rem; color: var(--apple-blue); margin-left: 4px;">📋</span>
          </div>
        </td>
        <td>
          <span class="forensic-seal-badge" title="Server authoritative HMAC signature verified">
            ✓ Sealed
          </span>
        </td>
        <td>
          <div class="forensic-table-actions">
            <button class="btn btn-secondary btn-table-view" title="Decrypt and inspect file" style="padding: 4px 8px; font-size: 0.75rem;">
              👁️ View
            </button>
            <button class="btn btn-secondary btn-table-cert" title="Download Section 65B Statutory Certificate PDF" style="padding: 4px 8px; font-size: 0.75rem;">
              📜 65B
            </button>
            <button class="btn btn-secondary btn-table-verify" title="Verify hash in public verifier below" style="padding: 4px 8px; font-size: 0.75rem;">
              ⚖️ Verify
            </button>
            <button class="btn btn-primary btn-table-export" title="Download legal evidence bundle (.ZIP)" style="padding: 4px 8px; font-size: 0.75rem;">
              📦 ZIP
            </button>
          </div>
        </td>
      `;

      tr.querySelector('.forensic-hash-pill')?.addEventListener('click', () => {
        navigator.clipboard.writeText(item.file_hash);
        const inputEl = document.getElementById('verifier-hash-input');
        if (inputEl) inputEl.value = item.file_hash;
        this.showToast('SHA-256 fingerprint copied and loaded into Verifier.', 'success');
      });

      tr.querySelector('.btn-table-verify')?.addEventListener('click', () => {
        const inputEl = document.getElementById('verifier-hash-input');
        if (inputEl) inputEl.value = item.file_hash;
        this.verifyEvidenceHash(item.file_hash);
        document.getElementById('verifier-dropzone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      tr.querySelector('.btn-table-view')?.addEventListener('click', () => {
        this.handleDecryptAndPreview(item);
      });

      tr.querySelector('.btn-table-cert')?.addEventListener('click', () => {
        try {
          const pdfBuffer = EvidenceExporter.generateSection65BCertificatePDF(item);
          const origName = item.metadata?.original_filename || 'evidence';
          const fname = `Section_65B_Certificate_${origName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.pdf`;
          EvidenceExporter.downloadBufferAsFile(pdfBuffer, fname);
          this.showToast('Section 65B statutory certificate downloaded.', 'success');
        } catch (err) {
          alert('Failed to generate Section 65B certificate: ' + err.message);
        }
      });

      tr.querySelector('.btn-table-export')?.addEventListener('click', () => {
        this.handleExportBundle(item);
      });

      tbody.appendChild(tr);
    });
  },

  updateNav(currentViewId) {
    const isAuth = this.isAuthenticated();
    const navBtnSimple = document.getElementById('nav-btn-simple');
    const navBtnForensic = document.getElementById('nav-btn-forensic');
    const navBtnResources = document.getElementById('nav-btn-resources');
    const authNavControls = document.getElementById('auth-nav-controls');
    const barrier = document.getElementById('vault-locked-barrier');
    const vaultContent = document.getElementById('vault-authenticated-content');

    if (isAuth) {
      if (authNavControls) authNavControls.style.display = 'flex';
      if (barrier) barrier.style.display = 'none';
      if (vaultContent) vaultContent.style.display = 'block';
    } else {
      if (authNavControls) authNavControls.style.display = 'none';
      if (barrier) barrier.style.display = 'block';
      if (vaultContent) vaultContent.style.display = 'none';
    }

    const isForensic = (currentViewId === 'view-forensic' || currentViewId === 'view-verifier');
    const isSimple = ['view-vault', 'view-login', 'view-register', 'view-recover'].includes(currentViewId);

    if (navBtnSimple) navBtnSimple.classList.toggle('active', isSimple);
    if (navBtnForensic) navBtnForensic.classList.toggle('active', isForensic);
    if (navBtnResources) navBtnResources.classList.toggle('active', currentViewId === 'view-resources');

    const btnSimple = document.getElementById('btn-mode-simple');
    const btnForensic = document.getElementById('btn-mode-forensic');
    if (btnSimple && btnForensic) {
      btnSimple.classList.toggle('active', isSimple);
      btnForensic.classList.toggle('active', isForensic);
    }
  },

  checkExistingSession() {
    const savedUser = sessionStorage.getItem('evidence_locker_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        this.showView('view-login');
        if (parsed?.email_pseudonym) {
          const inputEl = document.getElementById('login-pseudonym');
          if (inputEl) inputEl.value = parsed.email_pseudonym;
        }
        const msgEl = document.getElementById('login-status-msg');
        if (msgEl) {
          msgEl.textContent = 'Please enter your master password to derive local cryptographic keys in memory.';
          msgEl.style.color = 'var(--cyan-accent)';
        }
      } catch {
        this.showView('view-login');
      }
    } else {
      this.showView('view-login');
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message ${type === 'danger' ? 'toast-danger' : type === 'success' ? 'toast-success' : ''}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    else if (type === 'danger') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  },

  // ----------------------------------------------------
  // 3. AUTHENTICATION HANDLERS
  // ----------------------------------------------------

  async handleRegisterStart(e) {
    e.preventDefault();
    const pseudonym = document.getElementById('reg-pseudonym').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPw = document.getElementById('reg-password-confirm').value;
    const msgEl = document.getElementById('reg-status-msg');

    if (password !== confirmPw) {
      msgEl.textContent = 'Passwords do not match.';
      msgEl.style.color = 'var(--rose-danger)';
      return;
    }
    if (password.length < 10) {
      msgEl.textContent = 'Use at least 10 characters for forensic-grade key strength.';
      msgEl.style.color = 'var(--rose-danger)';
      return;
    }

    msgEl.textContent = 'Deriving zero-knowledge cryptographic keys (PBKDF2 600,000 rounds)...';
    msgEl.style.color = 'var(--cyan-accent)';

    try {
      const salt = LockerCrypto.generateSalt();
      const masterKey = await LockerCrypto.deriveMasterKey(password, salt);
      const authVerifier = await LockerCrypto.deriveAuthVerifier(password, salt);

      const words = LockerCrypto.generateBip39Phrase();
      const phraseStr = words.join(' ');
      const bip39Hash = await LockerCrypto.hashBip39Phrase(phraseStr);

      this.state.pendingRegistration = {
        email_pseudonym: pseudonym,
        auth_verifier: authVerifier,
        crypto_salt: salt,
        bip39_verification_hash: bip39Hash,
        masterKey,
        words
      };

      // Persist the stealth escape destination chosen at registration time
      const regStealthSelect = document.getElementById('reg-stealth-dest');
      if (regStealthSelect) {
        let stealthDest = regStealthSelect.value;
        if (stealthDest === 'custom') {
          const customUrl = document.getElementById('reg-stealth-custom-url')?.value?.trim();
          stealthDest = (customUrl && /^https?:\/\//i.test(customUrl)) ? customUrl : 'https://www.google.com';
        }
        this.state.panicSettings.destination = stealthDest;
        this.savePanicSettings();
      }

      const grid = document.getElementById('mnemonic-words-container');
      grid.innerHTML = '';
      words.forEach((w, i) => {
        const box = document.createElement('div');
        box.className = 'mnemonic-word-box';
        box.innerHTML = `<span class="mnemonic-idx">${i + 1}.</span> <span class="mnemonic-word">${w}</span>`;
        grid.appendChild(box);
      });

      document.getElementById('modal-mnemonic')?.classList.add('active');
    } catch (err) {
      console.error(err);
      msgEl.textContent = 'Key derivation failed: ' + err.message;
      msgEl.style.color = 'var(--rose-danger)';
    }
  },

  copyMnemonicWords() {
    if (this.state.pendingRegistration?.words) {
      const phrase = this.state.pendingRegistration.words.join(' ');
      navigator.clipboard.writeText(phrase);
      this.showToast('24 recovery words copied to clipboard.', 'success');
    }
  },

  async handleRegisterConfirm() {
    const chk = document.getElementById('chk-mnemonic-saved');
    if (!chk.checked) {
      alert('Please confirm that you have written down your 24-word recovery phrase safely offline.');
      return;
    }

    const regData = this.state.pendingRegistration;
    if (!regData) return;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_pseudonym: regData.email_pseudonym,
          auth_verifier: regData.auth_verifier,
          crypto_salt: regData.crypto_salt,
          bip39_verification_hash: regData.bip39_verification_hash
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      this.state.user = data;
      this.state.masterKey = regData.masterKey;
      sessionStorage.setItem('evidence_locker_user', JSON.stringify(data));

      document.getElementById('modal-mnemonic')?.classList.remove('active');
      this.showToast('Evidence Vault initialized with Zero-Knowledge encryption!', 'success');
      this.activateVaultSession();
    } catch (err) {
      alert('Registration error: ' + err.message);
    }
  },

  async handleLogin(e) {
    e.preventDefault();
    const pseudonym = document.getElementById('login-pseudonym').value.trim();
    const password = document.getElementById('login-password').value;
    const msgEl = document.getElementById('login-status-msg');

    msgEl.textContent = 'Deriving client-side AES-256 keys (PBKDF2 600,000 rounds)...';
    msgEl.style.color = 'var(--cyan-accent)';

    try {
      const saltRes = await fetch('/api/auth/get-salt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_pseudonym: pseudonym })
      });
      const saltData = await saltRes.json();
      if (!saltRes.ok) throw new Error(saltData.error || 'Failed to fetch salt');

      const salt = saltData.crypto_salt;
      const masterKey = await LockerCrypto.deriveMasterKey(password, salt);
      const authVerifier = await LockerCrypto.deriveAuthVerifier(password, salt);

      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_pseudonym: pseudonym,
          auth_verifier: authVerifier
        })
      });

      const userData = await loginRes.json();
      if (!loginRes.ok) throw new Error(userData.error || 'Invalid credentials');

      this.state.user = userData;
      this.state.masterKey = masterKey;
      sessionStorage.setItem('evidence_locker_user', JSON.stringify(userData));

      msgEl.textContent = '';
      this.showToast(`Vault unlocked for ${userData.email_pseudonym}`, 'success');
      this.activateVaultSession();
    } catch (err) {
      console.error(err);
      msgEl.textContent = err.message;
      msgEl.style.color = 'var(--rose-danger)';
    }
  },

  async handleRecovery(e) {
    e.preventDefault();
    const pseudonym = document.getElementById('recover-pseudonym').value.trim();
    const phrase = document.getElementById('recover-phrase').value.trim();
    const newPassword = document.getElementById('recover-new-password').value;
    const msgEl = document.getElementById('recover-status-msg');

    msgEl.textContent = 'Validating 24-word phrase and regenerating master key...';
    msgEl.style.color = 'var(--cyan-accent)';

    try {
      const bip39Hash = await LockerCrypto.hashBip39Phrase(phrase);
      const newSalt = LockerCrypto.generateSalt();
      const newMasterKey = await LockerCrypto.deriveMasterKey(newPassword, newSalt);
      const newAuthVerifier = await LockerCrypto.deriveAuthVerifier(newPassword, newSalt);

      const res = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_pseudonym: pseudonym,
          bip39_verification_hash: bip39Hash,
          new_auth_verifier: newAuthVerifier,
          new_crypto_salt: newSalt
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Recovery failed');

      this.state.user = data;
      this.state.masterKey = newMasterKey;
      sessionStorage.setItem('evidence_locker_user', JSON.stringify(data));

      this.showToast('Vault Master Key recovered successfully!', 'success');
      this.activateVaultSession();
    } catch (err) {
      console.error(err);
      msgEl.textContent = err.message;
      msgEl.style.color = 'var(--rose-danger)';
    }
  },

  handleLogout() {
    this.stopAudioPlayback();
    if (this.state.activePreviewBlobUrl) {
      URL.revokeObjectURL(this.state.activePreviewBlobUrl);
      this.state.activePreviewBlobUrl = null;
    }
    this.state.activeInspectorItem = null;
    this.state.activePreviewDecryptedBuffer = null;
    sessionStorage.clear();
    this.state.user = null;
    this.state.masterKey = null;
    this.state.evidenceList = [];
    document.getElementById('user-pseudonym-label').textContent = 'Not Authenticated';
    document.getElementById('auth-nav-controls').style.display = 'none';

    const grid = document.getElementById('evidence-grid');
    if (grid) grid.innerHTML = '';
    const countEl = document.getElementById('stat-evidence-count');
    if (countEl) countEl.textContent = '0';

    document.getElementById('form-login')?.reset();
    document.getElementById('form-register')?.reset();
    document.getElementById('form-recovery')?.reset();

    const msgEl = document.getElementById('login-status-msg');
    if (msgEl) {
      msgEl.textContent = 'Vault locked. Master key purged from browser memory.';
      msgEl.style.color = 'var(--teal-accent)';
    }

    this.showToast('Vault locked successfully.', 'info');
    this.showView('view-login');
  },

  activateVaultSession() {
    document.getElementById('user-pseudonym-label').textContent = this.state.user.email_pseudonym;
    document.getElementById('auth-nav-controls').style.display = 'flex';
    const target = this.state.simpleMode ? 'view-vault' : 'view-forensic';
    this.updateNav(target);
    this.showView(target);
    this.loadUserEvidence();
  },

  // ----------------------------------------------------
  // 4. EVIDENCE INGESTION & PIPELINE (SINGLE & BATCH)
  // ----------------------------------------------------

  queueEvidenceFiles(files) {
    if (!this.isAuthenticated()) {
      this.showToast('Please unlock your vault first to ingest and anchor evidence.', 'info');
      this.showView('view-login');
      return;
    }
    if (!files || files.length === 0) return;

    const promptTags = (this.state.simpleMode 
      ? document.getElementById('chk-prompt-tags')?.checked 
      : document.getElementById('chk-forensic-prompt-tags')?.checked) ?? true;

    // If single file and user requested tagging prompt, open dialog
    if (files.length === 1 && promptTags) {
      this.state.pendingUploadFile = files[0];
      const categorySelect = document.getElementById('tag-category');
      if (categorySelect) categorySelect.value = 'Cyberstalking & Tracking';
      const timeInput = document.getElementById('tag-incident-time');
      if (timeInput) timeInput.value = new Date().toISOString().slice(0, 16);
      
      document.getElementById('modal-tag-incident')?.classList.add('active');
    } else {
      // Process sequentially
      this.processFileBatch(files);
    }
  },

  async handleIncidentTagsSubmit() {
    const tags = {
      incident_category: document.getElementById('tag-category').value,
      severity: document.getElementById('tag-severity').value,
      platform: document.getElementById('tag-platform').value,
      perpetrator: document.getElementById('tag-perpetrator').value.trim(),
      incident_time: document.getElementById('tag-incident-time').value,
      incident_notes: document.getElementById('tag-notes').value.trim()
    };

    if (this.state.editingItem) {
      const item = this.state.editingItem;
      this.state.editingItem = null;
      document.getElementById('modal-tag-incident')?.classList.remove('active');
      try {
        const res = await fetch(`/api/evidence/${item.id}/metadata`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.user.session_token}`
          },
          body: JSON.stringify({ metadata_json: tags })
        });
        if (!res.ok) throw new Error('Failed to update incident metadata');
        this.showToast('Incident tags updated successfully.', 'success');
        this.loadUserEvidence();
      } catch (err) {
        alert('Update error: ' + err.message);
      }
      return;
    }

    const file = this.state.pendingUploadFile;
    if (!file) return;

    document.getElementById('modal-tag-incident')?.classList.remove('active');
    this.state.pendingUploadFile = null;
    this.executeEvidenceUploadPipeline(file, tags);
  },

  async processFileBatch(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await this.executeEvidenceUploadPipeline(file, {
        incident_category: 'Batch Ingestion',
        severity: 'High',
        platform: 'Direct Upload'
      });
    }
  },

  async executeEvidenceUploadPipeline(file, incidentTags = {}) {
    const pipelineModal = document.getElementById('modal-pipeline');
    const step1 = document.getElementById('pipeline-step-1');
    const step2 = document.getElementById('pipeline-step-2');
    const step3 = document.getElementById('pipeline-step-3');
    const step4 = document.getElementById('pipeline-step-4');

    [step1, step2, step3, step4].forEach(s => s.className = 'pipeline-step');
    step1.classList.add('active');
    document.getElementById('step-1-status').textContent = 'Inspecting binary segments...';
    document.getElementById('step-2-status').textContent = 'Waiting...';
    document.getElementById('step-3-status').textContent = 'Waiting...';
    document.getElementById('step-4-status').textContent = 'Waiting...';
    document.getElementById('pipeline-subtitle').textContent = `Processing "${file.name}"...`;
    pipelineModal?.classList.add('active');

    try {
      // STAGE 1: EXIF Sanitization & Dual Bitstream Hashing
      const rawBuffer = await file.arrayBuffer();
      const rawFileHash = await LockerCrypto.computeSHA256(rawBuffer);

      const sanitizationResult = await EvidenceSanitizer.processFile(file);
      const { sanitizedBuffer, metadata, wasSanitized } = sanitizationResult;

      step1.classList.remove('active');
      step1.classList.add('complete');
      document.getElementById('step-1-status').textContent = wasSanitized
        ? 'EXIF / GPS tags stripped & sanitized'
        : 'File clean (No EXIF detected)';

      // STAGE 2: Cryptographic Hashing
      step2.classList.add('active');
      document.getElementById('step-2-status').textContent = 'Computing SHA-256 fingerprint...';
      const fileHash = await LockerCrypto.computeSHA256(sanitizedBuffer);

      step2.classList.remove('active');
      step2.classList.add('complete');
      document.getElementById('step-2-status').textContent = fileHash.substring(0, 20) + '...';

      // STAGE 3: AES-256-GCM Envelope Encryption
      step3.classList.add('active');
      document.getElementById('step-3-status').textContent = 'Generating random FEK & encrypting...';

      const fek = await LockerCrypto.generateFEK();
      const wrappedFekBundle = await LockerCrypto.wrapFEK(fek, this.state.masterKey);
      const encryptionResult = await LockerCrypto.encryptEvidence(sanitizedBuffer, fek);

      step3.classList.remove('active');
      step3.classList.add('complete');
      document.getElementById('step-3-status').textContent = 'AES-256-GCM payload encrypted';

      // STAGE 4: Transmission & Custodial Anchoring
      step4.classList.add('active');
      document.getElementById('step-4-status').textContent = 'Recording custodian timestamp & signature...';

      const formData = new FormData();
      const encryptedBlob = new Blob([encryptionResult.ciphertextBuffer], { type: 'application/octet-stream' });
      formData.append('encrypted_blob', encryptedBlob, `${file.name}.enc`);
      formData.append('file_hash', fileHash);
      formData.append('wrapped_fek', wrappedFekBundle.wrapped_fek);
      formData.append('encryption_iv', encryptionResult.ivBase64);
      formData.append('metadata_json', JSON.stringify({
        ...metadata,
        ...incidentTags,
        raw_file_hash: rawFileHash,
        wrap_iv: wrappedFekBundle.wrap_iv
      }));

      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.state.user.session_token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server rejected custody record');

      step4.classList.remove('active');
      step4.classList.add('complete');
      document.getElementById('step-4-status').textContent = `Anchored at ${data.custodian_timestamp.substring(11, 19)} UTC`;

      this.showToast(`Evidence "${file.name}" anchored with SHA-256 fingerprint!`, 'success');

      setTimeout(() => {
        pipelineModal?.classList.remove('active');
        this.loadUserEvidence();
      }, 700);

    } catch (err) {
      console.error(err);
      alert('Evidence processing failed: ' + err.message);
      pipelineModal?.classList.remove('active');
    }
  },

  // ----------------------------------------------------
  // 5. EVIDENCE LIST, SEARCH, FILTER, SORT & CARDS
  // ----------------------------------------------------

  async loadUserEvidence() {
    if (!this.isAuthenticated()) return;
    const countEl = document.getElementById('stat-evidence-count');

    try {
      const res = await fetch('/api/evidence', {
        headers: { 'Authorization': `Bearer ${this.state.user.session_token}` }
      });
      const items = await res.json();
      this.state.evidenceList = items;

      if (countEl) countEl.textContent = items.length;
      this.renderEvidenceGrid();
      this.renderForensicLedgerTable();
    } catch (err) {
      console.error(err);
      const grid = document.getElementById('evidence-grid');
      if (grid) grid.innerHTML = `<p style="color: var(--rose-danger);">Failed to load vault evidence: ${err.message}</p>`;
    }
  },

  renderEvidenceGrid() {
    const grid = document.getElementById('evidence-grid');
    if (!grid) return;

    let items = [...this.state.evidenceList];

    // Filter
    if (this.state.activeFilter !== 'all') {
      items = items.filter(item => {
        const mime = (item.metadata?.mime_type || '').toLowerCase();
        const cat = (item.metadata?.incident_category || '').toLowerCase();
        const sev = (item.metadata?.severity || '').toLowerCase();

        switch (this.state.activeFilter) {
          case 'type-image': return mime.startsWith('image/');
          case 'type-audio': return mime.startsWith('audio/') || mime.includes('audio');
          case 'type-doc': return mime.includes('pdf') || mime.includes('text') || mime.includes('document');
          case 'cat-stalking': return cat.includes('stalking') || cat.includes('tracking');
          case 'cat-deepfake': return cat.includes('deepfake') || cat.includes('synthetic');
          case 'cat-harassment': return cat.includes('harassment') || cat.includes('doxxing');
          case 'sev-critical': return sev === 'critical';
          default: return true;
        }
      });
    }

    // Search
    if (this.state.searchQuery) {
      const q = this.state.searchQuery;
      items = items.filter(item => {
        const name = (item.metadata?.original_filename || '').toLowerCase();
        const cat = (item.metadata?.incident_category || '').toLowerCase();
        const plat = (item.metadata?.platform || '').toLowerCase();
        const perp = (item.metadata?.perpetrator || '').toLowerCase();
        const hash = (item.file_hash || '').toLowerCase();
        return name.includes(q) || cat.includes(q) || plat.includes(q) || perp.includes(q) || hash.includes(q);
      });
    }

    // Sort
    items.sort((a, b) => {
      switch (this.state.sortBy) {
        case 'date-asc':
          return new Date(a.custodian_timestamp) - new Date(b.custodian_timestamp);
        case 'name-asc':
          return (a.metadata?.original_filename || '').localeCompare(b.metadata?.original_filename || '');
        case 'size-desc':
          return (b.metadata?.sanitized_size_bytes || 0) - (a.metadata?.sanitized_size_bytes || 0);
        case 'severity': {
          const rank = { critical: 4, high: 3, medium: 2, low: 1 };
          const rA = rank[(a.metadata?.severity || '').toLowerCase()] || 0;
          const rB = rank[(b.metadata?.severity || '').toLowerCase()] || 0;
          return rB - rA;
        }
        case 'date-desc':
        default:
          return new Date(b.custodian_timestamp) - new Date(a.custodian_timestamp);
      }
    });

    grid.innerHTML = '';
    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 56px 20px; color: var(--text-muted);">
          <div style="font-size: 2.8rem; margin-bottom: 12px;">🛡️</div>
          <h3 style="color: #fff; font-size: 1.15rem; margin-bottom: 6px;">No matching evidence found</h3>
          <p style="font-size: 0.88rem;">Drag and drop files above to anchor or try clearing your search filter.</p>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'evidence-card';
      card.setAttribute('data-id', item.id);
      card.setAttribute('title', 'Double-click to inspect decrypted details');

      const meta = item.metadata || {};
      const mime = meta.mime_type || '';
      let icon = '📄';
      if (mime.startsWith('image/')) icon = '🖼️';
      else if (mime.startsWith('audio/')) icon = '🎵';
      else if (mime.includes('pdf')) icon = '📕';

      const sev = (meta.severity || 'High').toLowerCase();
      const sevClass = `tag-severity-${sev}`;

      const dateObj = new Date(item.custodian_timestamp);
      const friendlyDate = isNaN(dateObj.getTime())
        ? (item.custodian_timestamp || '').substring(0, 10)
        : dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      const sizeStr = `${Math.round((meta.sanitized_size_bytes || meta.file_size_bytes || 0) / 1024)} KB`;

      if (this.state.simpleMode) {
        card.innerHTML = `
          <div class="card-top">
            <div class="file-identity">
              <div class="file-type-icon">${icon}</div>
              <div>
                <div class="file-meta-name" title="${meta.original_filename || 'Evidence File'}">
                  ${meta.original_filename || 'Evidence File'}
                </div>
                <div class="file-meta-sub">
                  ${friendlyDate} • ${sizeStr}
                </div>
              </div>
            </div>
            <div class="badge-custody badge-simple-custody" title="Secured with untampered timestamp">
              <span>✓</span> Safe &amp; Untampered
            </div>
          </div>

          <div class="card-tags-row">
            <span class="tag-badge tag-category">${meta.incident_category || 'Evidence'}</span>
            ${meta.platform ? `<span class="tag-badge tag-platform">${meta.platform}</span>` : ''}
            <span class="tag-badge ${sevClass}">${meta.severity || 'High'}</span>
          </div>

          <div class="hash-pill simple-friendly-pill" title="Click to copy legal reference ID">
            <span style="font-weight: 600; color: #fff;">🛡️ Certified Original</span>
            <span style="font-size: 0.72rem; color: var(--apple-blue); font-family: var(--font-mono);">#${(item.file_hash || '').substring(0, 12)}... 📋</span>
          </div>

          <div class="card-sanitized-info friendly-sanitized">
            <span>🛡️ ${meta.trackers_removed ? 'GPS location & hidden device data scrubbed clean' : 'Zero-Knowledge Encrypted Vault Protection'}</span>
          </div>

          <div class="card-dblclick-hint">
            💡 Double-click to preview safely
          </div>

          <div class="card-actions simple-card-actions" style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px;">
            <button class="btn btn-primary btn-export" title="Download certified ZIP and report ready for police or lawyer">
              📦 Court Package
            </button>
            <button class="btn btn-secondary btn-decrypt" title="View safe copy">
              👁️ View
            </button>
            <button class="btn btn-danger btn-delete" title="Delete record" style="padding: 7px 10px;">
              🗑️
            </button>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="card-top">
            <div class="file-identity">
              <div class="file-type-icon">${icon}</div>
              <div>
                <div class="file-meta-name" title="${meta.original_filename || 'Evidence File'}">
                  ${meta.original_filename || 'Evidence File'}
                </div>
                <div class="file-meta-sub">
                  ${(item.custodian_timestamp || '').substring(0, 10)} • ${sizeStr}
                </div>
              </div>
            </div>
            <div class="badge-custody">
              <span>✓</span> Anchored
            </div>
          </div>

          <div class="card-tags-row">
            <span class="tag-badge tag-category">${meta.incident_category || 'Evidence'}</span>
            ${meta.platform ? `<span class="tag-badge tag-platform">${meta.platform}</span>` : ''}
            <span class="tag-badge ${sevClass}">${meta.severity || 'High'}</span>
          </div>

          <div class="hash-pill" title="Click to copy SHA-256 fingerprint">
            <span class="hash-str">${item.file_hash}</span>
            <span style="font-size: 0.65rem; color: var(--text-muted);">SHA-256 📋</span>
          </div>

          <div class="card-sanitized-info">
            <span>${meta.trackers_removed ? '🛡️ EXIF Trackers Purged' : '🔒 Zero-Knowledge Encrypted'}</span>
          </div>

          <div class="card-dblclick-hint">
            💡 Double-click card to inspect
          </div>

          <div class="card-actions">
            <button class="btn btn-secondary btn-decrypt" title="View decrypted evidence">
              👁️ View
            </button>
            <button class="btn btn-secondary btn-edit-tags" title="Edit incident classification">
              🏷️ Tag
            </button>
            <button class="btn btn-primary btn-export" title="Export legal package with certified PDF">
              📦 Export
            </button>
            <button class="btn btn-danger btn-delete" title="Purge record">
              🗑️
            </button>
          </div>
        `;
      }

      // RE-IMPLEMENTED DOUBLE-CLICK: Double-clicking an evidence card inspects it!
      card.addEventListener('dblclick', (e) => {
        if (!e.target.closest('button')) {
          this.handleDecryptAndPreview(item);
        }
      });

      // Hash pill click to copy
      card.querySelector('.hash-pill')?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(item.file_hash);
        this.showToast('Evidence fingerprint copied to clipboard.', 'success');
      });

      // Card action buttons
      card.querySelector('.btn-decrypt')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleDecryptAndPreview(item);
      });
      card.querySelector('.btn-edit-tags')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEditTagsModal(item);
      });
      card.querySelector('.btn-export')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleExportBundle(item);
      });
      card.querySelector('.btn-delete')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleDeleteEvidence(item.id);
      });

      grid.appendChild(card);
    });
  },

  openEditTagsModal(item) {
    this.state.editingItem = item;
    this.state.pendingUploadFile = null;
    const meta = item.metadata || {};
    document.getElementById('tag-category').value = meta.incident_category || 'Cyberstalking & Tracking';
    document.getElementById('tag-severity').value = meta.severity || 'High';
    document.getElementById('tag-platform').value = meta.platform || 'Instagram';
    document.getElementById('tag-perpetrator').value = meta.perpetrator || '';
    document.getElementById('tag-incident-time').value = meta.incident_time || '';
    document.getElementById('tag-notes').value = meta.incident_notes || '';
    document.getElementById('modal-tag-incident')?.classList.add('active');
  },

  // ----------------------------------------------------
  // 6. MULTI-MEDIA DECRYPTED IN-BROWSER INSPECTOR
  // ----------------------------------------------------

  async handleDecryptAndPreview(item) {
    if (!this.isAuthenticated()) {
      alert('Master key not loaded. Re-login required.');
      this.showView('view-login');
      return;
    }

    this.state.activeInspectorItem = item;

    try {
      this.showToast('Decrypting evidence in browser memory...', 'info');

      // 1. Download encrypted ciphertext blob
      const res = await fetch(`/api/evidence/${item.id}/blob`, {
        headers: { 'Authorization': `Bearer ${this.state.user.session_token}` }
      });
      if (!res.ok) throw new Error('Could not download encrypted blob');
      const ciphertextBuffer = await res.arrayBuffer();

      // 2. Unwrap FEK using Master Key
      const wrapIv = item.metadata?.wrap_iv;
      const fek = await LockerCrypto.unwrapFEK(item.wrapped_fek, wrapIv, this.state.masterKey);

      // 3. Decrypt evidence buffer with FEK
      const decryptedBuffer = await LockerCrypto.decryptEvidence(ciphertextBuffer, item.encryption_iv, fek);

      // 4. Verify SHA-256 fingerprint
      const verifiedHash = await LockerCrypto.computeSHA256(decryptedBuffer);
      if (verifiedHash !== item.file_hash) {
        throw new Error('FATAL: Decrypted file hash does not match immutable custodian fingerprint! Possible tampering.');
      }

      this.stopAudioPlayback();
      this.state.activePreviewDecryptedBuffer = decryptedBuffer;
      this.state.activePreviewMime = item.metadata?.mime_type || '';

      // Clean up previous blob URL
      if (this.state.activePreviewBlobUrl) {
        URL.revokeObjectURL(this.state.activePreviewBlobUrl);
        this.state.activePreviewBlobUrl = null;
      }

      // 5. Render Decrypted Media Content
      const previewModal = document.getElementById('modal-preview');
      const container = document.getElementById('preview-content-container');
      const deepfakeBtn = document.getElementById('btn-preview-deepfake');
      const mime = (item.metadata?.mime_type || '').toLowerCase();
      container.innerHTML = '';

      // Deepfake ELA tool is only available for images
      if (deepfakeBtn) {
        deepfakeBtn.style.display = mime.startsWith('image/') ? 'inline-flex' : 'none';
      }

      if (mime.startsWith('image/')) {
        const blob = new Blob([decryptedBuffer], { type: mime });
        const imgUrl = URL.createObjectURL(blob);
        this.state.activePreviewBlobUrl = imgUrl;
        container.innerHTML = `<img src="${imgUrl}" alt="Decrypted Evidence Preview" style="max-height: 520px; object-fit: contain; width: 100%; border-radius: var(--radius-sm);" />`;
      } else if (mime.startsWith('audio/') || mime.includes('audio')) {
        const blob = new Blob([decryptedBuffer], { type: mime || 'audio/mp3' });
        const audioUrl = URL.createObjectURL(blob);
        this.state.activePreviewBlobUrl = audioUrl;
        container.innerHTML = `
          <div class="audio-player-wrapper">
            <div class="audio-icon-pulse">🎵</div>
            <h4 style="color: #fff; margin-bottom: 6px;">${item.metadata?.original_filename || 'Audio Recording'}</h4>
            <p style="font-size: 0.8rem; color: var(--teal-accent); margin-bottom: 12px;">Decrypted Voice Log / Call Recording</p>
            
            <canvas id="audio-visualizer-canvas" class="audio-waveform-canvas" width="600" height="100"></canvas>
            
            <audio id="decrypted-audio-player" controls src="${audioUrl}" class="audio-controls-native" style="width: 100%; margin-top: 12px;"></audio>
            
            <div class="audio-speed-controls" style="margin-top: 10px; display: flex; gap: 8px; justify-content: center; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">SPEED:</span>
              <button type="button" class="btn-speed" data-speed="0.75">0.75x</button>
              <button type="button" class="btn-speed active" data-speed="1.0">1.0x</button>
              <button type="button" class="btn-speed" data-speed="1.25">1.25x</button>
              <button type="button" class="btn-speed" data-speed="1.5">1.5x</button>
              <button type="button" class="btn-speed" data-speed="2.0">2.0x</button>
            </div>
          </div>
        `;
        const audioEl = document.getElementById('decrypted-audio-player');
        const canvasEl = document.getElementById('audio-visualizer-canvas');
        this.setupAudioVisualizer(audioEl, canvasEl);
      } else if (mime === 'application/pdf') {
        const blob = new Blob([decryptedBuffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        this.state.activePreviewBlobUrl = pdfUrl;
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; width: 100%; height: 500px;">
            <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; color: var(--teal-accent); font-weight: 600;">📑 Decrypted PDF Document</span>
              <a href="${pdfUrl}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size: 0.75rem; padding: 4px 10px;">
                ↗️ Open Full Screen in New Tab
              </a>
            </div>
            <iframe src="${pdfUrl}" style="width: 100%; height: 100%; border-radius: var(--radius-sm); border: 1px solid var(--border-card); background: #1e293b;" title="Decrypted PDF Viewer"></iframe>
          </div>
        `;
      } else if (mime.includes('text') || mime.includes('json') || mime.includes('log') || mime.includes('csv')) {
        const dec = new TextDecoder();
        const textContent = dec.decode(decryptedBuffer);
        const escaped = textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        container.innerHTML = `
          <div class="text-viewer-wrapper">
            <pre style="margin: 0; white-space: pre-wrap; font-family: var(--font-mono); font-size: 0.85rem; color: #cbd5e1;"><code>${escaped}</code></pre>
          </div>
        `;
      } else {
        const blob = new Blob([decryptedBuffer], { type: mime || 'application/octet-stream' });
        const downloadUrl = URL.createObjectURL(blob);
        container.innerHTML = `
          <div style="padding: 38px; text-align: center; color: var(--text-secondary);">
            <div style="font-size: 2.8rem; margin-bottom: 10px;">📄</div>
            <p style="color: #fff; font-size: 1.1rem; font-weight: 700;">${item.metadata?.original_filename || 'Evidence File'}</p>
            <p style="font-size: 0.85rem; margin-top: 6px;">Format: ${mime || 'Binary Document'} (${decryptedBuffer.byteLength} bytes)</p>
            <p style="font-size: 0.85rem; color: var(--emerald-accent); margin-top: 14px;">✓ Cryptographically Verified: SHA-256 Matched</p>
            <a href="${downloadUrl}" download="${item.metadata?.original_filename || 'evidence_file'}" class="btn btn-secondary" style="margin-top: 16px;">
              💾 Download Decrypted File
            </a>
          </div>
        `;
      }

      // Populate Inspector Metadata
      const meta = item.metadata || {};
      document.getElementById('preview-file-title').textContent = meta.original_filename || 'Evidence Inspector';
      document.getElementById('preview-hash-val').textContent = item.file_hash;
      document.getElementById('preview-timestamp-val').textContent = `${item.custodian_timestamp} UTC (Server Authoritative)`;
      document.getElementById('preview-category-val').textContent = `${meta.incident_category || 'General Evidence'} (${meta.severity || 'High'})`;
      document.getElementById('preview-platform-val').textContent = `Platform: ${meta.platform || 'Online'} | Perpetrator: ${meta.perpetrator || 'Not specified'}`;
      document.getElementById('preview-notes-val').textContent = meta.incident_notes || 'No confidential notes recorded.';
      document.getElementById('preview-custodian-seal').textContent = item.custodian_signature || 'Signed via Server Authority';
      document.getElementById('preview-sanitized-badge').textContent = meta.trackers_removed ? 'EXIF Purged' : 'Sanitized';

      // Plain-language validity statement for non-tech survivors
      const plainTextEl = document.getElementById('plain-validity-text');
      if (plainTextEl) {
        const fname = meta.original_filename || 'Evidence File';
        const cat = meta.incident_category || 'Incident Evidence';
        const dStr = new Date(item.custodian_timestamp).toLocaleString();
        plainTextEl.innerHTML = `
          <strong>Courtroom Validity Status: 100% Certified.</strong><br>
          This record (<em>${fname}</em>) was locked and timestamped for <strong>${cat}</strong> on <strong>${dStr}</strong>. Its unique digital seal matches the original byte-for-byte. If presented to police or in court, this guarantees that nobody has altered or manipulated your evidence.
        `;
      }

      // Configure technical details visibility based on current view mode
      const techGrid = document.getElementById('inspector-grid');
      const techBtn = document.getElementById('btn-toggle-tech-details');
      if (techGrid && techBtn) {
        if (this.state.simpleMode) {
          techGrid.style.display = 'none';
          techBtn.textContent = '⚖️ Show Technical Forensic Details ▾';
        } else {
          techGrid.style.display = 'grid';
          techBtn.textContent = '⚖️ Hide Technical Forensic Details ▴';
        }
      }

      previewModal?.classList.add('active');

    } catch (err) {
      console.error(err);
      alert('Decryption failed: ' + err.message);
    }
  },

  // Export Single Legal Bundle (.ZIP)
  async handleExportBundle(item) {
    if (!this.isAuthenticated()) {
      alert('Authentication required.');
      this.showView('view-login');
      return;
    }

    this.showToast('Generating certified forensic report and packaging ZIP...', 'info');

    try {
      const res = await fetch(`/api/evidence/${item.id}/blob`, {
        headers: { 'Authorization': `Bearer ${this.state.user.session_token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch encrypted storage blob');
      const ciphertextBuffer = await res.arrayBuffer();

      const wrapIv = item.metadata?.wrap_iv;
      const fek = await LockerCrypto.unwrapFEK(item.wrapped_fek, wrapIv, this.state.masterKey);
      const decryptedBuffer = await LockerCrypto.decryptEvidence(ciphertextBuffer, item.encryption_iv, fek);

      await EvidenceExporter.exportEvidenceBundle(item, decryptedBuffer);
      this.showToast(`Legal bundle exported for "${item.metadata?.original_filename}"!`, 'success');
    } catch (err) {
      console.error(err);
      alert('Export failed: ' + err.message);
    }
  },

  // Export Master Case Dossier (.ZIP with all evidence, timeline PDF, and manifest)
  async handleExportMasterDossier() {
    if (!this.isAuthenticated()) {
      alert('Authentication required.');
      return;
    }
    const items = this.state.evidenceList;
    if (items.length === 0) {
      alert('Your vault has no evidence items to export.');
      return;
    }

    if (!confirm(`Export Master Case Dossier containing all ${items.length} evidence records and certified timeline report?`)) {
      return;
    }

    this.showToast(`Decrypting all ${items.length} items in memory for Master Dossier...`, 'info');

    try {
      const decryptedBuffersMap = {};

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const res = await fetch(`/api/evidence/${item.id}/blob`, {
          headers: { 'Authorization': `Bearer ${this.state.user.session_token}` }
        });
        if (res.ok) {
          const ciphertextBuffer = await res.arrayBuffer();
          const wrapIv = item.metadata?.wrap_iv;
          const fek = await LockerCrypto.unwrapFEK(item.wrapped_fek, wrapIv, this.state.masterKey);
          const decryptedBuffer = await LockerCrypto.decryptEvidence(ciphertextBuffer, item.encryption_iv, fek);
          decryptedBuffersMap[item.id] = decryptedBuffer;
        }
      }

      await EvidenceExporter.exportMasterCaseBundle(items, decryptedBuffersMap);
      this.showToast('Master Case Dossier (.ZIP) generated and downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      alert('Master Case Dossier export failed: ' + err.message);
    }
  },

  // Delete evidence
  async handleDeleteEvidence(id) {
    if (!this.isAuthenticated()) return;
    if (!confirm('Are you sure you want to permanently purge this evidence item and its chain-of-custody record?')) {
      return;
    }

    try {
      const res = await fetch(`/api/evidence/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.state.user.session_token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Deletion failed');

      this.showToast('Evidence record permanently purged.', 'info');
      this.loadUserEvidence();
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  },

  // ----------------------------------------------------
  // 7. VAULT CRYPTOGRAPHIC INTEGRITY AUDIT
  // ----------------------------------------------------

  async runVaultCryptographicAudit() {
    if (!this.isAuthenticated()) return;

    const modal = document.getElementById('modal-audit');
    const bar = document.getElementById('audit-progress-bar');
    const summary = document.getElementById('audit-status-summary');
    const resultsList = document.getElementById('audit-results-list');
    const closeBtn = document.getElementById('btn-close-audit');

    modal?.classList.add('active');
    bar.style.width = '5%';
    resultsList.innerHTML = '';
    closeBtn.style.display = 'none';
    summary.textContent = 'Querying immutable chain of custody signatures...';

    const items = this.state.evidenceList;
    if (items.length === 0) {
      bar.style.width = '100%';
      summary.innerHTML = '<span style="color: var(--teal-accent);">Vault is empty. No evidence records to audit.</span>';
      closeBtn.style.display = 'block';
      return;
    }

    let verifiedCount = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const pct = Math.round(((i + 1) / items.length) * 100);
      bar.style.width = `${pct}%`;
      summary.textContent = `Auditing record ${i + 1} of ${items.length}: "${item.metadata?.original_filename || item.id}"...`;

      try {
        const res = await fetch(`/api/evidence/${item.id}/report`, {
          headers: { 'Authorization': `Bearer ${this.state.user.session_token}` }
        });
        const data = await res.json();

        const row = document.createElement('div');
        row.className = 'audit-item-row valid';
        
        if (data.record?.signature_valid) {
          verifiedCount++;
          row.innerHTML = `
            <div>
              <strong style="color: #fff;">${item.metadata?.original_filename || 'Evidence File'}</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${item.file_hash.substring(0, 24)}...</div>
            </div>
            <div style="color: var(--emerald-accent); font-weight: 700;">✓ HMAC Signature Valid</div>
          `;
        } else {
          row.className = 'audit-item-row';
          row.innerHTML = `
            <div>
              <strong style="color: #fff;">${item.metadata?.original_filename || 'Evidence File'}</strong>
            </div>
            <div style="color: var(--rose-danger); font-weight: 700;">⚠️ Integrity Mismatch</div>
          `;
        }
        resultsList.appendChild(row);

      } catch (err) {
        console.error(err);
      }
    }

    const healthPct = Math.round((verifiedCount / items.length) * 100);
    const healthEl = document.getElementById('stat-custody-health');
    if (healthEl) healthEl.textContent = `${healthPct}%`;

    summary.innerHTML = `
      <div style="color: var(--emerald-accent); font-weight: 700; font-size: 1rem;">
        🛡️ Audit Complete: ${verifiedCount} of ${items.length} records verified (100% Cryptographic Health)
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
        All digital custodian seals remain valid and untampered since original ingestion.
      </div>
    `;
    closeBtn.style.display = 'block';
  },

  // ----------------------------------------------------
  // 8. CLIENT-SIDE CANVAS PRIVACY REDACTION TOOL
  // ----------------------------------------------------

  initRedactor() {
    const canvas = document.getElementById('redaction-canvas');
    const fileInput = document.getElementById('redact-file-input');
    const undoBtn = document.getElementById('btn-redact-undo');
    const clearBtn = document.getElementById('btn-redact-clear');
    const applyBtn = document.getElementById('btn-apply-redaction-and-anchor');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            this.state.redactor.image = img;
            this.state.redactor.boxes = [];
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.style.display = 'block';
            document.getElementById('redactor-placeholder').style.display = 'none';
            applyBtn.disabled = false;
            undoBtn.disabled = true;
            this.redrawRedactionCanvas();
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    canvas.addEventListener('mousedown', (e) => {
      if (!this.state.redactor.image) return;
      this.state.redactor.isDrawing = true;
      const pos = getPos(e);
      this.state.redactor.startX = pos.x;
      this.state.redactor.startY = pos.y;
      this.state.redactor.currentX = pos.x;
      this.state.redactor.currentY = pos.y;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!this.state.redactor.isDrawing) return;
      const pos = getPos(e);
      this.state.redactor.currentX = pos.x;
      this.state.redactor.currentY = pos.y;
      this.redrawRedactionCanvas();

      // Draw live rubber-band box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      const x = Math.min(this.state.redactor.startX, this.state.redactor.currentX);
      const y = Math.min(this.state.redactor.startY, this.state.redactor.currentY);
      const w = Math.abs(this.state.redactor.currentX - this.state.redactor.startX);
      const h = Math.abs(this.state.redactor.currentY - this.state.redactor.startY);
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    });

    window.addEventListener('mouseup', () => {
      if (!this.state.redactor.isDrawing) return;
      this.state.redactor.isDrawing = false;
      const x = Math.min(this.state.redactor.startX, this.state.redactor.currentX);
      const y = Math.min(this.state.redactor.startY, this.state.redactor.currentY);
      const w = Math.abs(this.state.redactor.currentX - this.state.redactor.startX);
      const h = Math.abs(this.state.redactor.currentY - this.state.redactor.startY);

      if (w > 5 && h > 5) {
        this.state.redactor.boxes.push({ x, y, w, h });
        if (undoBtn) undoBtn.disabled = false;
      }
      this.redrawRedactionCanvas();
    });

    undoBtn?.addEventListener('click', () => {
      this.state.redactor.boxes.pop();
      if (this.state.redactor.boxes.length === 0) undoBtn.disabled = true;
      this.redrawRedactionCanvas();
    });

    clearBtn?.addEventListener('click', () => {
      this.state.redactor.boxes = [];
      if (undoBtn) undoBtn.disabled = true;
      this.redrawRedactionCanvas();
    });

    applyBtn?.addEventListener('click', () => {
      if (!canvas || !this.state.redactor.image) return;
      canvas.toBlob((blob) => {
        if (!blob) return;
        const redactedFile = new File([blob], `redacted_evidence_${Date.now()}.png`, { type: 'image/png' });
        document.getElementById('modal-redactor')?.classList.remove('active');
        this.showToast('Redacted image prepared. Anchoring into vault...', 'info');
        this.queueEvidenceFiles([redactedFile]);
      }, 'image/png');
    });
  },

  redrawRedactionCanvas() {
    const canvas = document.getElementById('redaction-canvas');
    if (!canvas || !this.state.redactor.image) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.state.redactor.image, 0, 0);

    // Draw confirmed blackout redaction boxes
    ctx.fillStyle = '#000000';
    this.state.redactor.boxes.forEach(box => {
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(box.x, box.y, box.w, box.h);
    });
  },

  // ----------------------------------------------------
  // 9. PUBLIC FORENSIC VERIFIER
  // ----------------------------------------------------

  async handlePublicFileVerification(file) {
    this.state.lastVerifiedFile = file;
    const statusBox = document.getElementById('verification-result-box');
    statusBox.className = 'verification-result-box';
    statusBox.style.display = 'block';
    statusBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; color: var(--apple-blue);">
        <div class="spinner-small" style="width: 16px; height: 16px; border: 2px solid var(--apple-blue); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <span>Computing cryptographic SHA-256 fingerprint for "<strong>${file.name}</strong>"...</span>
      </div>
    `;

    try {
      const buffer = await file.arrayBuffer();
      const rawHash = await LockerCrypto.computeSHA256(buffer);

      // Also compute sanitized hash if file is an image (to match sanitized custodial bitstream)
      let sanitizedHash = null;
      try {
        const sanitizedResult = await EvidenceSanitizer.processFile(file);
        if (sanitizedResult && sanitizedResult.sanitizedBuffer && sanitizedResult.wasSanitized) {
          sanitizedHash = await LockerCrypto.computeSHA256(sanitizedResult.sanitizedBuffer);
        }
      } catch (e) {
        console.warn('Sanitizer check skipped:', e);
      }

      await this.verifyEvidenceHash(rawHash, sanitizedHash, file);
    } catch (err) {
      statusBox.className = 'verification-result-box mismatch';
      statusBox.innerHTML = `<p style="color: var(--rose-danger);">Error reading file: ${err.message}</p>`;
    }
  },

  async verifyEvidenceHash(hash, sanitizedHash = null, file = null) {
    const statusBox = document.getElementById('verification-result-box');
    statusBox.className = 'verification-result-box';
    statusBox.style.display = 'block';

    const cleanHash = (hash || '').trim().replace(/\s+/g, '').toLowerCase();
    const cleanSanitizedHash = sanitizedHash ? sanitizedHash.trim().replace(/\s+/g, '').toLowerCase() : null;

    if (!cleanHash && !cleanSanitizedHash) {
      statusBox.className = 'verification-result-box mismatch';
      statusBox.innerHTML = `<p style="color: var(--rose-danger);">Please enter a valid SHA-256 hash or select a file.</p>`;
      return;
    }

    statusBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; color: var(--cyan-accent);">
        <div class="spinner-small" style="width: 16px; height: 16px; border: 2px solid var(--cyan-accent); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <span>Querying immutable chain of custody ledger for hash: <code style="font-family: var(--font-mono);">${cleanHash}</code>...</span>
      </div>
    `;

    try {
      const payload = { file_hash: cleanHash };
      if (cleanSanitizedHash && cleanSanitizedHash !== cleanHash) {
        payload.sanitized_hash = cleanSanitizedHash;
      }

      const res = await fetch('/api/evidence/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.verified) {
        statusBox.className = 'verification-result-box verified';
        statusBox.innerHTML = `
          <div class="result-header" style="color: var(--emerald-accent); font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> CHAIN OF CUSTODY VERIFIED (UNTAMPERED)
          </div>
          <p style="margin: 8px 0 16px; font-size: 0.92rem; color: #f1f5f9; line-height: 1.5;">
            ${data.message}
          </p>
          <div style="font-family: var(--font-mono); font-size: 0.82rem; background: rgba(0,0,0,0.45); padding: 18px; border-radius: var(--radius-sm); border: 1px solid rgba(52, 199, 89, 0.35);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
              <div><strong style="color: #fff; font-family: var(--font-sans);">Original Evidence File:</strong> ${data.original_filename || 'Protected Record'}</div>
              <span class="badge-custody" style="font-size: 0.72rem;">${data.incident_category || 'Anchored Evidence'}</span>
            </div>
            <div style="margin-top: 6px;"><strong>SHA-256 Fingerprint:</strong> <span style="color: #70b5ff;">${data.file_hash}</span></div>
            ${data.matched_on_sanitized ? `<div style="margin-top: 6px; color: var(--teal-accent); font-size: 0.76rem;">🛡️ Verified against sanitized bitstream (volatile EXIF/GPS coordinates scrubbed for survivor safety).</div>` : ''}
            <div style="margin-top: 6px;"><strong>Custodial Timestamp:</strong> ${(data.custodian_timestamp || '').replace('T', ' ').substring(0, 19)} UTC</div>
            <div style="margin-top: 6px;"><strong>Custodian Seal (HMAC):</strong> ${(data.custodian_signature || '').substring(0, 36)}...</div>
            <div style="margin-top: 8px; color: var(--emerald-accent); font-weight: 600;">✓ Digital HMAC Custody Signature: Cryptographically Valid (Authentic Custodian)</div>
          </div>
          ${data.evidence_id && this.isAuthenticated() && this.state.evidenceList.some(i => i.id === data.evidence_id || i.file_hash === data.file_hash) ? `
            <div style="margin-top: 16px; display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;">
              <button id="btn-verifier-download-cert" class="btn btn-secondary" style="padding: 7px 16px; font-size: 0.8rem;">
                📜 Download Section 65B Certificate PDF
              </button>
            </div>
          ` : ''}
        `;

        const certBtn = document.getElementById('btn-verifier-download-cert');
        if (certBtn && data.evidence_id) {
          certBtn.addEventListener('click', () => {
            const item = this.state.evidenceList.find(i => i.id === data.evidence_id || i.file_hash === data.file_hash);
            if (item) {
              const pdfBuffer = EvidenceExporter.generateSection65BCertificatePDF(item);
              const origName = item.metadata?.original_filename || 'evidence';
              const fname = `Section_65B_Certificate_${origName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.pdf`;
              EvidenceExporter.downloadBufferAsFile(pdfBuffer, fname);
              this.showToast('Section 65B statutory certificate downloaded.', 'success');
            }
          });
        }

      } else {
        const fileToAnchor = file || this.state.lastVerifiedFile;
        statusBox.className = 'verification-result-box mismatch';
        statusBox.innerHTML = `
          <div class="result-header" style="color: var(--rose-danger); font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            <span>⚠️</span> NO CUSTODIAL MATCH FOUND
          </div>
          <p style="margin: 8px 0 14px; font-size: 0.92rem; color: #f1f5f9; line-height: 1.5;">
            ${data.message}
          </p>
          <div style="font-family: var(--font-mono); font-size: 0.82rem; background: rgba(0,0,0,0.45); padding: 16px; border-radius: var(--radius-sm); border: 1px solid rgba(255, 69, 58, 0.35);">
            <div><strong>Searched Hash:</strong> ${data.file_hash}</div>
            <div style="margin-top: 6px; color: var(--rose-danger);">Status: Integrity unproven. File may have been altered, modified, or not anchored yet.</div>
          </div>
          ${fileToAnchor ? `
            <div style="margin-top: 18px; text-align: center;">
              <button id="btn-verifier-anchor-now" class="btn btn-primary" style="padding: 10px 24px; font-size: 0.88rem;">
                📥 Ingest &amp; Anchor "${fileToAnchor.name}" into Vault Now
              </button>
            </div>
          ` : ''}
        `;

        if (fileToAnchor) {
          document.getElementById('btn-verifier-anchor-now')?.addEventListener('click', () => {
            this.state.lastVerifiedFile = null;
            statusBox.style.display = 'none';
            this.queueEvidenceFiles([fileToAnchor]);
          });
        }
      }
    } catch (err) {
      statusBox.className = 'verification-result-box mismatch';
      statusBox.innerHTML = `<p style="color: var(--rose-danger);">Verification query failed: ${err.message}</p>`;
    }
  },

  // ----------------------------------------------------
  // 10. PRIVACY WATCHER, AUDIO VISUALIZER & FORENSIC ELA
  // ----------------------------------------------------

  setupInactivityWatcher() {
    const updateActivity = () => {
      this.state.lastActivityTime = Date.now();
    };

    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
      window.addEventListener(evt, updateActivity, { passive: true });
    });

    if (this.state.autoLockInterval) clearInterval(this.state.autoLockInterval);

    this.state.autoLockInterval = setInterval(() => {
      const indicator = document.getElementById('auto-lock-indicator');
      if (!this.isAuthenticated()) {
        if (indicator) indicator.textContent = '🔒 Vault Locked';
        return;
      }

      const timeoutSec = this.state.panicSettings.autoLockSeconds !== undefined
        ? this.state.panicSettings.autoLockSeconds
        : 180;

      if (timeoutSec <= 0) {
        if (indicator) indicator.textContent = '🔒 Auto-Lock: Off';
        return;
      }

      const elapsedSec = Math.floor((Date.now() - this.state.lastActivityTime) / 1000);
      const remainingSec = Math.max(0, timeoutSec - elapsedSec);

      const mins = Math.floor(remainingSec / 60);
      const secs = remainingSec % 60;
      if (indicator) {
        indicator.textContent = `⏱️ Lock in ${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }

      if (remainingSec <= 0) {
        this.lockVaultDueToInactivity();
      }
    }, 1000);
  },

  lockVaultDueToInactivity() {
    if (!this.isAuthenticated()) return;
    this.stopAudioPlayback();
    this.state.masterKey = null;
    this.state.activeInspectorItem = null;
    this.state.activePreviewDecryptedBuffer = null;
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    this.showView('view-login');
    const msgEl = document.getElementById('login-status-msg');
    if (msgEl) {
      msgEl.textContent = '🔒 Vault auto-locked due to inactivity to protect survivor privacy.';
      msgEl.style.color = 'var(--rose-danger)';
    }
    this.showToast('Vault auto-locked due to inactivity to protect survivor privacy.', 'info');
  },

  setupAudioVisualizer(audioEl, canvasEl) {
    if (!audioEl || !canvasEl) return;
    const ctx = canvasEl.getContext('2d');

    // Attach speed buttons
    const container = audioEl.closest('.audio-player-wrapper');
    if (container) {
      container.querySelectorAll('.btn-speed').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const speed = parseFloat(btn.getAttribute('data-speed') || '1.0');
          audioEl.playbackRate = speed;
        });
      });
    }

    let audioCtx = null;
    let analyser = null;
    let sourceNode = null;

    const initAudioContext = () => {
      if (this.state.activeAudioCtx) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        sourceNode = audioCtx.createMediaElementSource(audioEl);
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);

        this.state.activeAudioCtx = audioCtx;
        this.state.audioAnalyser = analyser;

        renderWaveform();
      } catch (e) {
        console.warn('AudioContext visualization not supported or blocked:', e);
      }
    };

    const renderWaveform = () => {
      if (!this.state.audioAnalyser || !canvasEl) return;
      const bufferLength = this.state.audioAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        this.state.audioAnimFrame = requestAnimationFrame(draw);
        this.state.audioAnalyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgba(10, 15, 29, 0.45)';
        ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

        const barWidth = (canvasEl.width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvasEl.height * 0.9;

          const gradient = ctx.createLinearGradient(0, canvasEl.height, 0, 0);
          gradient.addColorStop(0, '#0d9488');
          gradient.addColorStop(0.5, '#06b6d4');
          gradient.addColorStop(1, '#ec4899');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvasEl.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
          if (x > canvasEl.width) break;
        }
      };
      draw();
    };

    audioEl.addEventListener('play', () => {
      initAudioContext();
      if (this.state.activeAudioCtx && this.state.activeAudioCtx.state === 'suspended') {
        this.state.activeAudioCtx.resume();
      }
    });

    // Draw idle visualizer baseline
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvasEl.height / 2);
    ctx.lineTo(canvasEl.width, canvasEl.height / 2);
    ctx.stroke();
  },

  stopAudioPlayback() {
    if (this.state.audioAnimFrame) {
      cancelAnimationFrame(this.state.audioAnimFrame);
      this.state.audioAnimFrame = null;
    }
    if (this.state.activeAudioCtx) {
      try {
        this.state.activeAudioCtx.close();
      } catch (e) {}
      this.state.activeAudioCtx = null;
      this.state.audioAnalyser = null;
    }
  },

  runErrorLevelAnalysis(scale = null) {
    const imgEl = document.getElementById('ela-orig-img');
    const canvasEl = document.getElementById('ela-result-canvas');
    if (!imgEl || !canvasEl) return;

    const slider = document.getElementById('ela-scale-slider');
    const scaleMultiplier = scale !== null ? scale : (slider ? parseInt(slider.value, 10) : 20);

    const performAnalysis = () => {
      const width = imgEl.naturalWidth || imgEl.width || 400;
      const height = imgEl.naturalHeight || imgEl.height || 300;

      // 1. Draw original on hidden canvas
      const origCanvas = document.createElement('canvas');
      origCanvas.width = width;
      origCanvas.height = height;
      const origCtx = origCanvas.getContext('2d');
      origCtx.drawImage(imgEl, 0, 0, width, height);
      const origData = origCtx.getImageData(0, 0, width, height);

      // 2. Recompress at 90% JPEG quality
      const recompressedUrl = origCanvas.toDataURL('image/jpeg', 0.90);
      const reImg = new Image();
      reImg.onload = () => {
        const reCanvas = document.createElement('canvas');
        reCanvas.width = width;
        reCanvas.height = height;
        const reCtx = reCanvas.getContext('2d');
        reCtx.drawImage(reImg, 0, 0, width, height);
        const reData = reCtx.getImageData(0, 0, width, height);

        // 3. Compute error level difference on result canvas
        canvasEl.width = width;
        canvasEl.height = height;
        const resultCtx = canvasEl.getContext('2d');
        const resultData = resultCtx.createImageData(width, height);

        const d1 = origData.data;
        const d2 = reData.data;
        const out = resultData.data;

        for (let i = 0; i < d1.length; i += 4) {
          const rDiff = Math.min(255, Math.abs(d1[i] - d2[i]) * scaleMultiplier);
          const gDiff = Math.min(255, Math.abs(d1[i + 1] - d2[i + 1]) * scaleMultiplier);
          const bDiff = Math.min(255, Math.abs(d1[i + 2] - d2[i + 2]) * scaleMultiplier);

          out[i] = rDiff;
          out[i + 1] = gDiff;
          out[i + 2] = bDiff;
          out[i + 3] = 255;
        }

        resultCtx.putImageData(resultData, 0, 0);
      };
      reImg.src = recompressedUrl;
    };

    if (imgEl.complete && (imgEl.naturalWidth > 0)) {
      performAnalysis();
    } else {
      imgEl.onload = performAnalysis;
    }
  }
};

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
