// Internationalization (i18n) Engine for Digital Evidence Locker
// Supported Indian Languages: English (India), Hindi, Tamil, Telugu, Bengali, Marathi

const I18n = {
  currentLang: 'en',
  
  translations: {
    en: {
      // Safety Bar
      'safety.active': 'Survivor Safety Active:',
      'safety.doubleBar': 'Double-Click Bar',
      'safety.doubleEsc': 'Double ESC',
      'safety.doubleAnywhere': 'Double-Click Anywhere',
      'safety.panicSettings': '⚙️ Panic Settings',
      'safety.helplines': '🆘 1930 Helplines',
      'safety.quickExit': '⚠️ Quick Exit',
      
      // Navigation
      'nav.brandTitle': 'Evidence Locker',
      'nav.brandBadge': 'Zero-Knowledge',
      'nav.brandSub': 'Forensic Chain of Custody & Cyber Safety Platform',
      'nav.unlockVault': '🔑 Unlock Vault',
      'nav.evidenceVault': '🔒 Evidence Vault',
      'nav.forensicVerifier': '⚖️ Forensic Verifier',
      'nav.helplinesLegal': '🤝 Helplines & Legal',
      'nav.lockVault': 'Lock Vault',
      'nav.language': 'Language',

      // Login View
      'login.title': 'Unlock Evidence Vault',
      'login.subtitle': 'Zero-knowledge AES-256 decryption occurs entirely in local browser memory.',
      'login.userLabel': 'Email or Pseudonym',
      'login.userPlaceholder': 'e.g. survivor_492 or email',
      'login.passLabel': 'Master Password',
      'login.passPlaceholder': '••••••••••••',
      'login.passHelp': 'Your password derives the local AES-256 key via PBKDF2 (600,000 rounds). It is never sent to the server.',
      'login.btnSubmit': 'Unlock Vault Securely',
      'login.createVault': 'Create New Vault',
      'login.useRecovery': 'Use 24-Word Recovery Phrase',

      // Register View
      'reg.title': 'Create Private Evidence Vault',
      'reg.subtitle': 'Client-side zero-knowledge architecture. The server never sees your unencrypted evidence, keys, or passwords.',
      'reg.userLabel': 'Choose a Pseudonym or Email',
      'reg.userPlaceholder': 'e.g. anonymous_ally or secure email',
      'reg.passLabel': 'Master Password',
      'reg.passPlaceholder': 'Minimum 10 characters',
      'reg.confirmLabel': 'Confirm Master Password',
      'reg.confirmPlaceholder': 'Re-enter password',
      'reg.passHelp': 'Keys are derived using PBKDF2 with 600,000 iterations to resist hardware brute-force attacks.',
      'reg.btnSubmit': 'Generate Vault & Recovery Phrase',
      'reg.haveVault': 'Already have a vault? Log In',
      'reg.stealthLabel': 'Stealth Escape Website (optional)',
      'reg.stealthHelp': 'If someone walks in, the vault instantly vanishes and this innocent website loads. You can change this later in Panic Settings.',
      'reg.stealthCustomPlaceholder': 'https://example.com',

      // Recovery View
      'recover.title': 'Recover Vault Access',
      'recover.subtitle': 'Enter your 24-word BIP-39 recovery phrase to reset your master credentials.',
      'recover.userLabel': 'Account Pseudonym',
      'recover.phraseLabel': '24-Word Recovery Phrase',
      'recover.phrasePlaceholder': 'Enter all 24 words separated by spaces...',
      'recover.newPassLabel': 'New Master Password',
      'recover.newPassPlaceholder': 'Minimum 10 characters',
      'recover.btnSubmit': 'Restore Vault & Reset Key',
      'recover.backLogin': 'Back to Login',

      // Vault Dashboard
      'vault.title': 'Digital Evidence Vault',
      'vault.subtitle': 'Encrypted with AES-256-GCM envelope encryption. Anchored with immutable SHA-256 chain-of-custody timestamps.',
      'vault.btnAudit': '🛡️ Cryptographic Health Audit',
      'vault.btnExport': '📑 Export Full Case Dossier (.ZIP)',
      'vault.statAnchored': 'Anchored Proof',
      'vault.statAnchoredSub': 'Legally Timestamped',
      'vault.statZk': 'Zero-Knowledge',
      'vault.statZkSub': 'AES-256-GCM Envelope',
      'vault.statSanitizer': 'Metadata Sanitizer',
      'vault.statSanitizerSub': 'EXIF & GPS Stripped',
      'vault.statChain': 'Chain Health',
      'vault.statChainSub': 'Tamper-Proof Verified',
      'vault.dropzoneText': 'Drop screenshots, harassment audio, deepfake files, or documents here',
      'vault.dropzoneHint': 'Supports single or batch upload. Files are automatically sanitized of hidden EXIF/GPS trackers, hashed via SHA-256, and AES-256 encrypted before leaving your browser.',
      'vault.browseFiles': '📁 Browse Files to Anchor',
      'vault.redactBtn': '🖌️ Redact Sensitive Info Before Upload',
      'vault.promptTags': 'Prompt for incident tags & confidential notes before anchoring',
      'vault.interactionTip': '💡 Tip: Double-click any anchored card below to inspect decrypted details.',
      'vault.searchPlaceholder': 'Search by incident tag, platform, notes, or SHA-256 hash...',
      'vault.filterAll': 'All Evidence',
      'vault.filterImages': 'Images & Stalking Screenshots',
      'vault.filterAudio': 'Audio & Voice Notes',
      'vault.filterVideos': 'Video & Deepfakes',
      'vault.filterDocs': 'Legal & Chat Exports',

      // Verifier View
      'verifier.badge': 'PUBLIC INDEPENDENT AUDIT',
      'verifier.title': 'Forensic Chain of Custody Verifier',
      'verifier.subtitle': 'Verify whether any digital screenshot, video, or audio file has been altered or tampered with. Compares digital fingerprints against our cryptographic ledger.',
      'verifier.dropText': 'Drag & drop evidence file to verify cryptographic authenticity',
      'verifier.dropHint': 'Computes SHA-256 fingerprint in client memory and validates server HMAC custody seal.',
      'verifier.selectBtn': 'Select File to Verify',
      'verifier.orQuery': '— OR QUERY BY SHA-256 HASH STRING DIRECTLY —',
      'verifier.hashLabel': 'SHA-256 Hash String (64 hexadecimal characters)',
      'verifier.hashPlaceholder': 'e.g. 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      'verifier.btnQuery': 'Query Chain of Custody Ledger',

      // Resources View
      'res.badge': 'EMERGENCY SUPPORT & LEGAL RESOURCES',
      'res.title': "Women's Cyber Safety & Emergency Helplines",
      'res.subtitle': 'Verified national helplines, legal aid organizations, and forensic preservation guidelines for survivors of digital violence and cyber harassment.',
      'res.call1930': 'Dial 1930 (Toll-Free 24x7)',
      'res.visitPortal': 'Visit cybercrime.gov.in',
      'res.ncwHotline': '7827170170 / Dial 1091',
      'res.visitNcw': 'Visit NCW Portal',
      'res.stopNciiDesc': 'Creates client-side perceptual hashes of intimate images so major platforms (Meta, TikTok, Reddit) can block them before they spread without you uploading the actual image.',
      'res.visitStopNcii': 'Visit StopNCII.org',
      'res.rulesTitle': 'Forensic Evidence Rules for Court Admissibility',
      'res.rule1Title': 'Preserve Original Unaltered Files:',
      'res.rule1Desc': 'Never edit original photos or video files directly. Anchor them here first to establish the authoritative cryptographic SHA-256 timestamp.',
      'res.rule2Title': 'Capture Full Context:',
      'res.rule2Desc': 'Capture screenshots showing URL address bars, sender account handles, phone numbers, and full date/time stamps.',
      'res.rule3Title': 'Section 65B Compliance (Indian Evidence Act / BSA):',
      'res.rule3Desc': 'Export the certified PDF Chain of Custody Report bundled with the original file when presenting evidence to law enforcement or legal counsel.',

      // Apple Design & Non-Tech Friendly Keys
      'nav.modeSimple': '🕊️ Simple View',
      'nav.modeForensic': '⚖️ Forensic View',
      'forensic.btnAnchor': '📥 Ingest & Anchor Evidence',
      'forensic.dropText': 'Drop Evidence Files to Ingest & Anchor in Forensic Custody',
      'forensic.dropHint': 'Automatic client-side EXIF/GPS scrubbing, SHA-256 bitstream fingerprinting, and zero-knowledge AES-256-GCM envelope encryption before custodial anchoring.',
      'forensic.browseFiles': '📁 Browse Files to Anchor',
      'forensic.redactBtn': '🖌️ Redact Before Ingesting',
      'forensic.guideBtn': '💡 Evidence Guide',
      'guide.title': 'Survivor Safe Start: 3 Simple Steps',
      'guide.subtitle': 'How to turn threatening messages or photos into court-ready proof without technical knowledge.',
      'guide.step1Title': '1. Drop Evidence Below',
      'guide.step1Desc': 'Upload screenshots, voice notes, or photos. We automatically erase your home address & GPS markers so you stay safe.',
      'guide.step2Title': '2. Add What Happened',
      'guide.step2Desc': 'Select the platform (WhatsApp, Instagram, etc.) and harasser details. Everything is locked with your password.',
      'guide.step3Title': '3. Download Court Package',
      'guide.step3Desc': 'Tap "Export Court Package" to get an official signed PDF certificate ready for Cyber Cell (1930) or your lawyer.',
      'vault.helpWhatToSave': '💡 What Evidence Should I Collect?',
      'vault.safeLocationScrubbed': 'Location wiped for your safety',
      'vault.zkEncrypted': '100% Private (Only You Have the Key)',
      'vault.tamperProofVerified': 'Verified Untampered Original',
      'vault.downloadCourtPackage': '📦 Export Court Package (.ZIP + PDF)',
      'helper.modalTitle': '💡 Evidence Helper: What to Collect',
      'helper.modalSubtitle': 'Easy, non-technical steps to gather bulletproof proof of online harassment, cyberstalking, or deepfakes.',
      'helper.reassurance': 'Everything stays on your computer. Nothing is uploaded in public.',
      'helper.catChat': '💬 WhatsApp / Telegram / Chat Messages',
      'helper.catChatTips': '• Capture the sender phone number or profile, not just the name.\n• Include full date and timestamps.\n• Do not delete original conversations.',
      'helper.catSocial': '📸 Instagram / Facebook / X',
      'helper.catSocialTips': '• Screenshot the harasser’s full profile page with account handle & URL.\n• Capture comments in context with post URL.',
      'helper.catDeepfake': '🤖 Deepfakes / Morphing / AI',
      'helper.catDeepfakeTips': '• Preserve the original uncompressed image or video immediately.\n• Copy direct URLs of websites or channels where it was shared.\n• Use StopNCII.org to prevent viral distribution.',
      'helper.catCalls': '📞 Threatening Phone Calls & Voicemails',
      'helper.catCallsTips': '• Screenshot incoming call history showing exact date and call duration.\n• Upload voice recording or voicemail files without editing.'
    },

    hi: {
      // Safety Bar
      'safety.active': 'पीड़िता सुरक्षा सक्रिय:',
      'safety.doubleBar': 'बार पर दो बार क्लिक करें',
      'safety.doubleEsc': 'दो बार ESC दबाएं',
      'safety.doubleAnywhere': 'कहीं भी डबल क्लिक करें',
      'safety.panicSettings': '⚙️ पैनिक सेटिंग्स',
      'safety.helplines': '🆘 1930 हेल्पलाइन',
      'safety.quickExit': '⚠️ त्वरित निकास',

      // Navigation
      'nav.brandTitle': 'एविडेंस लॉकर',
      'nav.brandBadge': 'जीरो-नॉलेज',
      'nav.brandSub': 'फोरेंसिक कस्टडी और साइबर सुरक्षा प्लेटफॉर्म',
      'nav.unlockVault': '🔑 वॉल्ट खोलें',
      'nav.evidenceVault': '🔒 साक्ष्य वॉल्ट',
      'nav.forensicVerifier': '⚖️ फोरेंसिक सत्यापन',
      'nav.helplinesLegal': '🤝 हेल्पलाइन व कानूनी सहायता',
      'nav.lockVault': 'वॉल्ट लॉक करें',
      'nav.language': 'भाषा',

      // Login View
      'login.title': 'साक्ष्य वॉल्ट अनलॉक करें',
      'login.subtitle': 'जीरो-नॉलेज AES-256 डिक्रिप्शन पूरी तरह से आपके ब्राउज़र की मेमोरी में होता है।',
      'login.userLabel': 'ईमेल या उपनाम (Pseudonym)',
      'login.userPlaceholder': 'उदा. survivor_492 या ईमेल',
      'login.passLabel': 'मास्टर पासवर्ड',
      'login.passPlaceholder': '••••••••••••',
      'login.passHelp': 'आपका पासवर्ड PBKDF2 (6,00,000 राउंड्स) द्वारा लोकल AES-256 कुंजी बनाता है। यह कभी सर्वर पर नहीं भेजा जाता।',
      'login.btnSubmit': 'सुरक्षित रूप से वॉल्ट खोलें',
      'login.createVault': 'नया वॉल्ट बनाएं',
      'login.useRecovery': '24-शब्द रिकवरी वाक्यांश का उपयोग करें',

      // Register View
      'reg.title': 'निजी साक्ष्य वॉल्ट बनाएं',
      'reg.subtitle': 'क्लाइंट-साइड जीरो-नॉलेज आर्किटेक्चर। सर्वर आपके बिना एन्क्रिप्ट किए साक्ष्य, चाबी या पासवर्ड कभी नहीं देख सकता।',
      'reg.userLabel': 'उपनाम या ईमेल चुनें',
      'reg.userPlaceholder': 'उदा. anonymous_ally या सुरक्षित ईमेल',
      'reg.passLabel': 'मास्टर पासवर्ड',
      'reg.passPlaceholder': 'कम से कम 10 अक्षर',
      'reg.confirmLabel': 'मास्टर पासवर्ड की पुष्टि करें',
      'reg.confirmPlaceholder': 'पासवर्ड पुनः दर्ज करें',
      'reg.passHelp': 'हार्डवेयर हमलों को रोकने के लिए चाबियां PBKDF2 (600,000 पुनरावृत्तियों) के साथ बनाई जाती हैं।',
      'reg.btnSubmit': 'वॉल्ट और रिकवरी वाक्यांश बनाएं',
      'reg.haveVault': 'क्या आपके पास पहले से वॉल्ट है? लॉगिन करें',
      'reg.stealthLabel': 'स्टेल्थ एस्केप वेबसाइट (वैकल्पिक)',
      'reg.stealthHelp': 'अगर कोई आ जाए, तो वॉल्ट तुरंत गायब हो जाती है और यह सामान्य वेबसाइट खुल जाती है। आप इसे बाद में पैनिक सेटिंग्स में बदल सकती हैं।',
      'reg.stealthCustomPlaceholder': 'https://example.com',

      // Recovery View
      'recover.title': 'वॉल्ट एक्सेस पुनर्प्राप्त करें',
      'recover.subtitle': 'अपने क्रेडेंशियल रीसेट करने के लिए अपना 24-शब्दों का BIP-39 रिकवरी वाक्यांश दर्ज करें।',
      'recover.userLabel': 'खाता उपनाम',
      'recover.phraseLabel': '24-शब्द रिकवरी वाक्यांश',
      'recover.phrasePlaceholder': 'सभी 24 शब्दों को स्पेस देकर दर्ज करें...',
      'recover.newPassLabel': 'नया मास्टर पासवर्ड',
      'recover.newPassPlaceholder': 'कम से कम 10 अक्षर',
      'recover.btnSubmit': 'वॉल्ट पुनर्स्थापित करें व कुंजी रीसेट करें',
      'recover.backLogin': 'लॉगिन पर वापस जाएं',

      // Vault Dashboard
      'vault.title': 'डिजिटल साक्ष्य वॉल्ट',
      'vault.subtitle': 'AES-256-GCM एन्क्रिप्शन से सुरक्षित। अपरिवर्तनीय SHA-256 टाइमस्टैम्प के साथ कानूनी रूप से प्रमाणित।',
      'vault.btnAudit': '🛡️ क्रिप्टोग्राफिक हेल्थ ऑडिट',
      'vault.btnExport': '📑 पूर्ण केस डोजियर निर्यात करें (.ZIP)',
      'vault.statAnchored': 'सुरक्षित साक्ष्य',
      'vault.statAnchoredSub': 'कानूनी रूप से टाइमस्टैम्प',
      'vault.statZk': 'जीरो-नॉलेज',
      'vault.statZkSub': 'AES-256-GCM एनवेलप',
      'vault.statSanitizer': 'मेटाडेटा सैनिटाइज़र',
      'vault.statSanitizerSub': 'EXIF व GPS हटाया गया',
      'vault.statChain': 'कस्टडी स्थिति',
      'vault.statChainSub': 'छेड़छाड़-मुक्त सत्यापित',
      'vault.dropzoneText': 'स्क्रीनशॉट, उत्पीड़न ऑडियो, डीपफेक या दस्तावेज़ यहां छोड़ें',
      'vault.dropzoneHint': 'एकल या समूह अपलोड समर्थित। फ़ाइलें ब्राउज़र छोड़ने से पहले EXIF/GPS साफ़ होती हैं, SHA-256 हैश होती हैं और AES-256 एन्क्रिप्ट होती हैं।',
      'vault.browseFiles': '📁 फ़ाइलें चुनें',
      'vault.redactBtn': '🖌️ अपलोड से पहले संवेदनशील जानकारी छुपाएं',
      'vault.promptTags': 'अपलोड से पहले घटना टैग और गोपनीय नोट्स पूछें',
      'vault.interactionTip': '💡 सुझाव: डिक्रिप्ट विवरण देखने के लिए नीचे किसी भी कार्ड पर डबल-क्लिक करें।',
      'vault.searchPlaceholder': 'टैग, प्लेटफॉर्म, नोट्स या SHA-256 हैश द्वारा खोजें...',
      'vault.filterAll': 'सभी साक्ष्य',
      'vault.filterImages': 'छवियां व स्क्रीनशॉट',
      'vault.filterAudio': 'ऑडियो व वॉइस नोट्स',
      'vault.filterVideos': 'वीडियो व डीपफेक',
      'vault.filterDocs': 'कानूनी व चैट निर्यात',

      // Verifier View
      'verifier.badge': 'सार्वजनिक स्वतंत्र फोरेंसिक जांच',
      'verifier.title': 'फोरेंसिक कस्टडी सत्यापनकर्ता',
      'verifier.subtitle': 'सत्यापित करें कि किसी डिजिटल फ़ाइल से छेड़छाड़ हुई है या नहीं। हमारे क्रिप्टोग्राफिक लेजर के साथ डिजिटल फ़िंगरप्रिंट की तुलना करें।',
      'verifier.dropText': 'सत्यापन के लिए साक्ष्य फ़ाइल यहां खींचें और छोड़ें',
      'verifier.dropHint': 'ब्राउज़र मेमोरी में SHA-256 फ़िंगरप्रिंट की गणना करता है और सर्वर HMAC सील की पुष्टि करता है।',
      'verifier.selectBtn': 'सत्यापित करने के लिए फ़ाइल चुनें',
      'verifier.orQuery': '— या सीधे SHA-256 हैश स्ट्रिंग द्वारा खोजें —',
      'verifier.hashLabel': 'SHA-256 हैश स्ट्रिंग (64 हेक्साडेसिमल अक्षर)',
      'verifier.hashPlaceholder': 'उदा. 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      'verifier.btnQuery': 'कस्टडी लेजर से जांचें',

      // Resources View
      'res.badge': 'आपातकालीन सहायता व कानूनी संसाधन',
      'res.title': 'महिला साइबर सुरक्षा व आपातकालीन हेल्पलाइन',
      'res.subtitle': 'डिजिटल हिंसा और साइबर उत्पीड़न की शिकार महिलाओं के लिए प्रमाणित राष्ट्रीय हेल्पलाइन और कानूनी दिशा-निर्देश।',
      'res.call1930': 'डायल करें 1930 (टोल-फ्री 24x7)',
      'res.visitPortal': 'cybercrime.gov.in पर जाएं',
      'res.ncwHotline': '7827170170 / डायल करें 1091',
      'res.visitNcw': 'NCW पोर्टल पर जाएं',
      'res.stopNciiDesc': 'निजी तस्वीरों के क्लाइंट-साइड हैश बनाता है ताकि प्रमुख प्लेटफॉर्म (Meta, TikTok, Reddit) बिना मूल फोटो देखे उन्हें फैलने से रोक सकें।',
      'res.visitStopNcii': 'StopNCII.org पर जाएं',
      'res.rulesTitle': 'अदालत में साक्ष्य की स्वीकार्यता के नियम',
      'res.rule1Title': 'मूल फ़ाइलों को कभी न बदलें:',
      'res.rule1Desc': 'मूल फ़ोटो या वीडियो को सीधे संपादित न करें। SHA-256 टाइमस्टैम्प स्थापित करने के लिए पहले उन्हें यहाँ सुरक्षित करें।',
      'res.rule2Title': 'पूरा संदर्भ रिकॉर्ड करें:',
      'res.rule2Desc': 'ऐसे स्क्रीनशॉट लें जिनमें URL एड्रेस बार, प्रेषक का हैंडल, फ़ोन नंबर और पूर्ण दिनांक/समय दिखाई दे।',
      'res.rule3Title': 'धारा 65B अनुपालन (भारतीय साक्ष्य अधिनियम / BSA):',
      'res.rule3Desc': 'पुलिस या वकील को साक्ष्य प्रस्तुत करते समय मूल फ़ाइल के साथ प्रमाणित PDF चेन-ऑफ-कस्टडी रिपोर्ट बंडल डाउनलोड करें।',

      // Apple Design & Non-Tech Friendly Keys (Hindi)
      'nav.modeSimple': '🕊️ सरल दृश्य',
      'nav.modeForensic': '⚖️ फोरेंसिक दृश्य',
      'guide.title': 'पीड़िता सुरक्षित शुरुआत: 3 आसान कदम',
      'guide.subtitle': 'बिना किसी तकनीकी ज्ञान के धमकी भरे संदेशों या तस्वीरों को अदालत-योग्य सबूत में कैसे बदलें।',
      'guide.step1Title': '1. साक्ष्य यहाँ डालें',
      'guide.step1Desc': 'स्क्रीनशॉट, वॉइस नोट्स या फोटो अपलोड करें। आपकी सुरक्षा के लिए हम घर का पता व GPS लोकेशन हटा देते हैं।',
      'guide.step2Title': '2. घटना का विवरण जोड़ें',
      'guide.step2Desc': 'प्लेटफ़ॉर्म (WhatsApp, Instagram आदि) और उत्पीड़न करने वाले का विवरण चुनें। सब कुछ आपके पासवर्ड से लॉक रहता है।',
      'guide.step3Title': '3. कोर्ट पैकेज डाउनलोड करें',
      'guide.step3Desc': 'साइबर सेल (1930) या वकील के लिए तैयार प्रमाणित PDF प्रमाणपत्र पाने के लिए "कोर्ट पैकेज निर्यात करें" पर टैप करें।',
      'vault.helpWhatToSave': '💡 मुझे क्या साक्ष्य एकत्र करना चाहिए?',
      'vault.safeLocationScrubbed': 'आपकी सुरक्षा के लिए स्थान हटा दिया गया',
      'vault.zkEncrypted': '100% निजी (केवल आपके पास चाबी है)',
      'vault.tamperProofVerified': 'सत्यापित छेड़छाड़-मुक्त मूल',
      'vault.downloadCourtPackage': '📦 कोर्ट पैकेज निर्यात करें (.ZIP + PDF)',
      'helper.modalTitle': '💡 साक्ष्य मार्गदर्शिका: क्या एकत्र करें',
      'helper.modalSubtitle': 'ऑनलाइन उत्पीड़न, साइबर स्टॉकिंग या डीपफेक के अकाट्य सबूत जुटाने के आसान कदम।',
      'helper.reassurance': 'सब कुछ आपके कंप्यूटर पर सुरक्षित रहता है। सार्वजनिक रूप से कुछ भी अपलोड नहीं होता।',
      'helper.catChat': '💬 WhatsApp / Telegram / संदेश',
      'helper.catChatTips': '• केवल नाम ही नहीं, प्रेषक का फ़ोन नंबर या प्रोफ़ाइल भी कैप्चर करें।\n• पूरा दिनांक और समय शामिल करें।\n• स्क्रीनशॉट लेने तक चैट न हटाएं।',
      'helper.catSocial': '📸 Instagram / Facebook / X',
      'helper.catSocialTips': '• हैंडल (@username) और URL दिखाते हुए उत्पीड़नकर्ता का प्रोफ़ाइल पेज कैप्चर करें।\n• पोस्ट URL के साथ टिप्पणियों का स्क्रीनशॉट लें।',
      'helper.catDeepfake': '🤖 डीपफेक / मॉर्फिंग / AI',
      'helper.catDeepfakeTips': '• मूल फ़ाइल को बिना कंप्रेस किए तुरंत सुरक्षित करें।\n• जहां इसे साझा किया गया था, उन लिंक्स को कॉपी करें।\n• वायरल होने से रोकने के लिए StopNCII.org का उपयोग करें।',
      'helper.catCalls': '📞 धमकी भरे फ़ोन कॉल व वॉइसमेल',
      'helper.catCallsTips': '• इनकमिंग कॉल इतिहास का स्क्रीनशॉट लें जिसमें तारीख व कॉल अवधि दिखे।\n• वॉइस रिकॉर्डिंग बिना एडिट किए वॉल्ट में अपलोड करें।'
    },

    ta: {
      // Safety Bar
      'safety.active': 'பாதிக்கப்பட்டோர் பாதுகாப்பு செயலில் உள்ளது:',
      'safety.doubleBar': 'பார் மீது இரட்டை கிளிக் செய்க',
      'safety.doubleEsc': 'ESC இருமுறை அழுத்தவும்',
      'safety.doubleAnywhere': 'எங்கு வேண்டுமானாலும் இரட்டை கிளிக் செய்க',
      'safety.panicSettings': '⚙️ அவசர அமைப்புகள்',
      'safety.helplines': '🆘 1930 உதவி எண்',
      'safety.quickExit': '⚠️ உடனடி வெளியேறு',

      // Navigation
      'nav.brandTitle': 'ஆதார பெட்டகம்',
      'nav.brandBadge': 'ஜீரோ-நாலெட்ஜ்',
      'nav.brandSub': 'தடயவியல் பாதுகாப்பு மற்றும் இணைய பாதுகாப்பு தளம்',
      'nav.unlockVault': '🔑 பெட்டகத்தை திற',
      'nav.evidenceVault': '🔒 ஆதார பெட்டகம்',
      'nav.forensicVerifier': '⚖️ தடயவியல் சரிபார்ப்பாளர்',
      'nav.helplinesLegal': '🤝 உதவி எண்கள் & சட்டம்',
      'nav.lockVault': 'பெட்டகத்தை பூட்டு',
      'nav.language': 'மொழி',

      // Login View
      'login.title': 'ஆதார பெட்டகத்தை திறக்கவும்',
      'login.subtitle': 'ஜீரோ-நாலெட்ஜ் AES-256 குறிவிலக்கம் முற்றிலும் உங்கள் உலாவியில் மட்டுமே நிகழ்கிறது.',
      'login.userLabel': 'மின்னஞ்சல் அல்லது புனைப்பெயர்',
      'login.userPlaceholder': 'எ.கா. survivor_492 அல்லது மின்னஞ்சல்',
      'login.passLabel': 'முதன்மை கடவுச்சொல்',
      'login.passPlaceholder': '••••••••••••',
      'login.passHelp': 'உங்கள் கடவுச்சொல் PBKDF2 (6,00,000 சுற்றுகள்) வழியாக உள்ளூர் AES-256 சாவியை உருவாக்குகிறது. இது சேவையகத்திற்கு அனுப்பப்படாது.',
      'login.btnSubmit': 'பெட்டகத்தை பாதுகாப்பாக திறக்கவும்',
      'login.createVault': 'புதிய பெட்டகத்தை உருவாக்கவும்',
      'login.useRecovery': '24-வார்த்தை மீட்பு சொற்றொடரைப் பயன்படுத்தவும்',

      // Register View
      'reg.title': 'தனியார் ஆதார பெட்டகத்தை உருவாக்கவும்',
      'reg.subtitle': 'ஜீரோ-நாலெட்ஜ் கட்டமைப்பு. சேவையகம் உங்கள் குறியாக்கம் செய்யப்படாத ஆதாரங்களை ஒருபோதும் பார்க்க முடியாது.',
      'reg.userLabel': 'புனைப்பெயர் அல்லது மின்னஞ்சலைத் தேர்ந்தெடுக்கவும்',
      'reg.userPlaceholder': 'எ.கா. anonymous_ally அல்லது மின்னஞ்சல்',
      'reg.passLabel': 'முதன்மை கடவுச்சொல்',
      'reg.passPlaceholder': 'குறைந்தது 10 எழுத்துக்கள்',
      'reg.confirmLabel': 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
      'reg.confirmPlaceholder': 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்',
      'reg.passHelp': 'வன்முறை தாக்குதல்களை எதிர்க்க சாவிகள் PBKDF2 (600,000 சுழற்சிகள்) மூலம் பெறப்படுகின்றன.',
      'reg.btnSubmit': 'பெட்டகம் மற்றும் மீட்பு சொற்றொடரை உருவாக்கவும்',
      'reg.haveVault': 'ஏற்கனவே பெட்டகம் உள்ளதா? உள்நுழைக',
      'reg.stealthLabel': 'மறைவு தப்பிக்கும் வலைத்தளம் (விருப்பத்தேர்வு)',
      'reg.stealthHelp': 'யாரேனும் வந்தால், பெட்டகம் உடனடியாக மறைந்து இந்த பாதுகாப்பான வலைத்தளம் திறக்கும். இதை பின்னர் பேனிக் அமைப்புகளில் மாற்றலாம்.',
      'reg.stealthCustomPlaceholder': 'https://example.com',

      // Recovery View
      'recover.title': 'பெட்டக அணுகலை மீட்டெடுக்கவும்',
      'recover.subtitle': 'உங்கள் சான்றுகளை மீட்டமைக்க 24-வார்த்தை BIP-39 மீட்பு சொற்றொடரை உள்ளிடவும்.',
      'recover.userLabel': 'கணக்கு புனைப்பெயர்',
      'recover.phraseLabel': '24-வார்த்தை மீட்பு சொற்றொடர்',
      'recover.phrasePlaceholder': '24 சொற்களையும் இடைவெளியுடன் உள்ளிடவும்...',
      'recover.newPassLabel': 'புதிய முதன்மை கடவுச்சொல்',
      'recover.newPassPlaceholder': 'குறைந்தது 10 எழுத்துக்கள்',
      'recover.btnSubmit': 'பெட்டகத்தை மீட்டெடுத்து சாவியை மாற்றவும்',
      'recover.backLogin': 'உள்நுழைவுக்குத் திரும்பு',

      // Vault Dashboard
      'vault.title': 'டிஜிட்டல் ஆதார பெட்டகம்',
      'vault.subtitle': 'AES-256-GCM குறியாக்கம். மாற்ற முடியாத SHA-256 தடயவியல் நேர முத்திரையுடன் சட்டப்பூர்வமாக பதிவு செய்யப்பட்டது.',
      'vault.btnAudit': '🛡️ கிரிப்டோகிராஃபிக் தணிக்கை',
      'vault.btnExport': '📑 முழு வழக்கு ஆவணத்தை பதிவிறக்கு (.ZIP)',
      'vault.statAnchored': 'பதிவு செய்யப்பட்ட சான்றுகள்',
      'vault.statAnchoredSub': 'சட்டப்படி நேரமுத்திரையிடப்பட்டது',
      'vault.statZk': 'ஜீரோ-நாலெட்ஜ்',
      'vault.statZkSub': 'AES-256-GCM உறை',
      'vault.statSanitizer': 'மெட்டாடேட்டா நீக்கி',
      'vault.statSanitizerSub': 'EXIF & GPS நீக்கப்பட்டது',
      'vault.statChain': 'பாதுகாப்பு நிலை',
      'vault.statChainSub': 'மாற்றமின்மை சரிபார்க்கப்பட்டது',
      'vault.dropzoneText': 'ஸ்கிரீன்ஷாட்கள், துன்புறுத்தல் ஆடியோ, டீப்ஃபேக் அல்லது ஆவணங்களை இங்கே இழுத்து விடவும்',
      'vault.dropzoneHint': 'கோப்புகள் தானாகவே EXIF/GPS நீக்கப்பட்டு, SHA-256 ஹாஷ் செய்யப்பட்டு, உலாவி விட்டு வெளியேறும் முன் AES-256 குறியாக்கம் செய்யப்படுகின்றன.',
      'vault.browseFiles': '📁 கோப்புகளைத் தேர்ந்தெடுக்கவும்',
      'vault.redactBtn': '🖌️ பதிவேற்றுவதற்கு முன் தகவல்களை மறைக்கவும்',
      'vault.promptTags': 'பதிவேற்ற முன் குறிப்புகள் மற்றும் தகவல்களை கேட்கவும்',
      'vault.interactionTip': '💡 குறிப்பு: குறிவிலக்கப்பட்ட விவரங்களைப் பார்க்க கீழே உள்ள எந்த அட்டை மீதும் இரட்டை கிளிக் செய்யவும்.',
      'vault.searchPlaceholder': 'குறிச்சொல், தளம், குறிப்புகள் அல்லது SHA-256 மூலம் தேடவும்...',
      'vault.filterAll': 'அனைத்து ஆதாரங்கள்',
      'vault.filterImages': 'படங்கள் & ஸ்கிரீன்ஷாட்கள்',
      'vault.filterAudio': 'ஆடியோ & குரல் குறிப்புகள்',
      'vault.filterVideos': 'வீடியோ & டீப்ஃபேக்குகள்',
      'vault.filterDocs': 'சட்ட & அரட்டை கோப்புகள்',

      // Verifier View
      'verifier.badge': 'பொது சுயாதீன தணிக்கை',
      'verifier.title': 'தடயவியல் பாதுகாப்பு சரிபார்ப்பாளர்',
      'verifier.subtitle': 'எந்தவொரு டிஜிட்டல் கோப்பும் மாற்றப்பட்டதா என்பதை சரிபார்க்கவும். எங்கள் கிரிப்டோகிராஃபிக் லெட்ஜருடன் டிஜிட்டல் கைரேகைகளை ஒப்பிடுகிறது.',
      'verifier.dropText': 'சரிபார்க்க ஆதாரக் கோப்பை இங்கே இழுத்து விடவும்',
      'verifier.dropHint': 'உலாவியில் SHA-256 கைரேகையை கணக்கிட்டு சேவையக HMAC முத்திரையை சரிபார்க்கிறது.',
      'verifier.selectBtn': 'சரிபார்க்க கோப்பைத் தேர்ந்தெடுக்கவும்',
      'verifier.orQuery': '— அல்லது நேரடியாக SHA-256 ஹாஷ் மூலம் தேடவும் —',
      'verifier.hashLabel': 'SHA-256 ஹாஷ் சரம் (64 ஹெக்ஸாடெசிமல் எழுத்துக்கள்)',
      'verifier.hashPlaceholder': 'எ.கா. 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      'verifier.btnQuery': 'லெட்ஜரில் சரிபார்க்கவும்',

      // Resources View
      'res.badge': 'அவசர உதவி & சட்ட ஆதாரங்கள்',
      'res.title': 'பெண்கள் இணைய பாதுகாப்பு & அவசர உதவி எண்கள்',
      'res.subtitle': 'டிஜிட்டல் வன்முறை மற்றும் இணைய துன்புறுத்தலால் பாதிக்கப்பட்ட பெண்களுக்கான சரிபார்க்கப்பட்ட தேசிய உதவி எண்கள் மற்றும் வழிகாட்டுதல்கள்.',
      'res.call1930': '1930 ஐ அழைக்கவும் (இலவசம் 24x7)',
      'res.visitPortal': 'cybercrime.gov.in ஐப் பார்வையிடவும்',
      'res.ncwHotline': '7827170170 / 1091 ஐ அழைக்கவும்',
      'res.visitNcw': 'NCW தளத்திற்கு செல்லவும்',
      'res.stopNciiDesc': 'தனியார் படங்களின் டிஜிட்டல் ஹாஷ்களை உருவாக்குகிறது, இதன் மூலம் முக்கிய தளங்கள் உண்மையான புகைப்படத்தை பார்க்காமலேயே அவற்றை தடுக்க முடியும்.',
      'res.visitStopNcii': 'StopNCII.org ஐப் பார்வையிடவும்',
      'res.rulesTitle': 'நீதிமன்றத்தில் ஆதாரங்களை ஏற்பதற்கான விதிகள்',
      'res.rule1Title': 'அசல் கோப்புகளை மாற்றாமல் வைத்திருங்கள்:',
      'res.rule1Desc': 'அசல் புகைப்படங்கள் அல்லது வீடியோக்களை ஒருபோதும் நேரடியாக திருத்த வேண்டாம். நம்பகமான SHA-256 நேரமுத்திரையைப் பெற முதலில் இங்கே பதிவு செய்யுங்கள்.',
      'res.rule2Title': 'முழு விவரங்களையும் பதிவு செய்யுங்கள்:',
      'res.rule2Desc': 'URL முகவரி, அனுப்புநரின் கணக்கு பெயர், தொலைபேசி எண்கள் மற்றும் முழு தேதி/நேரத்தைக் காட்டும் ஸ்கிரீன்ஷாட்களை எடுக்கவும்.',
      'res.rule3Title': 'பிரிவு 65B இணக்கம் (இந்திய சாட்சிய சட்டம் / BSA):',
      'res.rule3Desc': 'காவல்துறை அல்லது வழக்கறிஞரிடம் ஆதாரங்களை சமர்ப்பிக்கும் போது அசல் கோப்புடன் சான்றளிக்கப்பட்ட PDF அறிக்கையை பதிவிறக்கி இணைக்கவும்.',

      // Apple Design & Non-Tech Friendly Keys (Tamil)
      'nav.modeSimple': '🕊️ எளிய பார்வை',
      'nav.modeForensic': '⚖️ தடயவியல் பார்வை',
      'guide.title': 'பாதிக்கப்பட்டோர் எளிய வழிகாட்டி: 3 படிகள்',
      'guide.subtitle': 'தொழில்நுட்ப அறிவு தேவையின்றி அச்சுறுத்தும் செய்திகளை நீதிமன்ற சான்றாக மாற்றுவது எப்படி.',
      'guide.step1Title': '1. ஆதாரத்தை பதிவேற்றவும்',
      'guide.step1Desc': 'ஸ்கிரீன்ஷாட்கள், ஆடியோ அல்லது புகைப்படங்களை பதிவேற்றவும். உங்கள் பாதுகாப்பிற்காக இருப்பிட ஜிபிஎஸ் நீக்கப்படுகிறது.',
      'guide.step2Title': '2. என்ன நடந்தது என குறிப்பிடவும்',
      'guide.step2Desc': 'வாட்ஸ்அப், இன்ஸ்டாகிராம் போன்ற தளம் மற்றும் விவரங்களை தேர்ந்தெடுக்கவும்.',
      'guide.step3Title': '3. நீதிமன்ற தொகுப்பை பதிவிறக்கவும்',
      'guide.step3Desc': '1930 அல்லது வழக்கறிஞரிடம் சமர்ப்பிக்க சான்றளிக்கப்பட்ட PDF அறிக்கையை பெறவும்.',
      'vault.helpWhatToSave': '💡 என்னென்ன ஆதாரங்களை சேகரிக்க வேண்டும்?',
      'vault.safeLocationScrubbed': 'பாதுகாப்பிற்காக இருப்பிடம் நீக்கப்பட்டது',
      'vault.zkEncrypted': '100% ரகசியம் (உங்களிடம் மட்டுமே சாவி உள்ளது)',
      'vault.tamperProofVerified': 'அசல் மாறாத சான்று',
      'vault.downloadCourtPackage': '📦 நீதிமன்ற தொகுப்பு (.ZIP + PDF)',
      'helper.modalTitle': '💡 ஆதார வழிகாட்டி: என்ன சேகரிக்க வேண்டும்',
      'helper.modalSubtitle': 'சைபர் துன்புறுத்தல் அல்லது டீப்ஃபேக்கிற்கு எதிரான மறுக்க முடியாத ஆதாரங்களை சேகரிக்கும் எளிய வழிமுறைகள்.',
      'helper.reassurance': 'அனைத்தும் உங்கள் கணினியிலேயே பாதுகாப்பாக இருக்கும்.',
      'helper.catChat': '💬 WhatsApp / Telegram / செய்திகள்',
      'helper.catChatTips': '• அனுப்புநரின் தொலைபேசி எண் மற்றும் சுயவிவரத்தை பதிவு செய்யவும்.\n• முழு தேதி மற்றும் நேரத்தை உள்ளடக்கவும்.\n• அசல் உரையாடல்களை நீக்க வேண்டாம்.',
      'helper.catSocial': '📸 Instagram / Facebook / X',
      'helper.catSocialTips': '• குற்றவாளியின் கணக்கு ஐடி (@username) மற்றும் வலைப்பக்கத்தை ஸ்கிரீன்ஷாட் எடுக்கவும்.',
      'helper.catDeepfake': '🤖 டீப்ஃபேக் / உருமாற்றம் / AI',
      'helper.catDeepfakeTips': '• அசல் புகைப்படத்தை உடனடியாக பாதுகாக்கவும்.\n• பரவுவதை தடுக்க StopNCII.org பயன்படுத்தவும்.',
      'helper.catCalls': '📞 மிரட்டல் அழைப்புகள்',
      'helper.catCallsTips': '• அழைப்பு வரலாறு மற்றும் நேரத்தை ஸ்கிரீன்ஷாட் எடுக்கவும்.\n• ஆடியோவை மாற்றமின்றி பதிவேற்றவும்.'
    },

    te: {
      // Safety Bar
      'safety.active': 'బాధిత మహిళల భద్రత సక్రియంగా ఉంది:',
      'safety.doubleBar': 'బార్‌పై డబుల్ క్లిక్ చేయండి',
      'safety.doubleEsc': 'రెండుసార్లు ESC నొక్కండి',
      'safety.doubleAnywhere': 'ఎక్కడైనా డబుల్ క్లిక్ చేయండి',
      'safety.panicSettings': '⚙️ అత్యవసర సెట్టింగ్‌లు',
      'safety.helplines': '🆘 1930 హెల్ప్‌లైన్లు',
      'safety.quickExit': '⚠️ తక్షణ నిష్క్రమణ',

      // Navigation
      'nav.brandTitle': 'సాక్ష్యాల లాకర్',
      'nav.brandBadge': 'జీరో-నాలెడ్జ్',
      'nav.brandSub': 'ఫోరెన్సిక్ చైన్ ఆఫ్ కస్టడీ & సైబర్ భద్రతా వేదిక',
      'nav.unlockVault': '🔑 వాల్ట్‌ను అన్‌లాక్ చేయండి',
      'nav.evidenceVault': '🔒 సాక్ష్యాల వాల్ట్',
      'nav.forensicVerifier': '⚖️ ఫోరెన్సిక్ ధృవీకరణ',
      'nav.helplinesLegal': '🤝 హెల్ప్‌లైన్లు & న్యాయ సహాయం',
      'nav.lockVault': 'లాక్ వాల్ట్',
      'nav.language': 'భాష',

      // Login View
      'login.title': 'సాక్ష్యాల వాల్ట్ అన్‌లాక్ చేయండి',
      'login.subtitle': 'జీరో-నాలెడ్జ్ AES-256 డిక్రిప్షన్ పూర్తిగా మీ బ్రౌజర్ మెమరీలోనే జరుగుతుంది.',
      'login.userLabel': 'ఇమెయిల్ లేదా మారుపేరు (Pseudonym)',
      'login.userPlaceholder': 'ఉదా. survivor_492 లేదా ఇమెయిల్',
      'login.passLabel': 'మాస్టర్ పాస్‌వర్డ్',
      'login.passPlaceholder': '••••••••••••',
      'login.passHelp': 'మీ పాస్‌వర్డ్ స్థానిక AES-256 కీని PBKDF2 (600,000 రౌండ్లు) ద్వారా పొందుతుంది. ఇది సర్వర్‌కు పంపబడదు.',
      'login.btnSubmit': 'వాల్ట్‌ను సురక్షితంగా తెరవండి',
      'login.createVault': 'కొత్త వాల్ట్‌ను సృష్టించండి',
      'login.useRecovery': '24-పదాల రికవరీ పదబంధాన్ని వాడండి',

      // Register View
      'reg.title': 'ప్రైవేట్ సాక్ష్యాల వాల్ట్ సృష్టించండి',
      'reg.subtitle': 'క్లయింట్ వైపు జీరో-నాలెడ్జ్ ఆర్కిటెక్చర్. సర్వర్ మీ సాక్ష్యాలు, కీలు లేదా పాస్‌వర్డ్‌లను ఎప్పటికీ చూడలేదు.',
      'reg.userLabel': 'మారుపేరు లేదా ఇమెయిల్ ఎంచుకోండి',
      'reg.userPlaceholder': 'ఉదా. anonymous_ally లేదా ఇమెయిల్',
      'reg.passLabel': 'మాస్టర్ పాస్‌వర్డ్',
      'reg.passPlaceholder': 'కనీసం 10 అక్షరాలు',
      'reg.confirmLabel': 'పాస్‌వర్డ్‌ను నిర్ధారించండి',
      'reg.confirmPlaceholder': 'పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి',
      'reg.passHelp': 'హార్డ్‌వేర్ దాడులను అడ్డుకోవడానికి PBKDF2 (600,000 పునరావృత్తులు) ఉపయోగించబడుతుంది.',
      'reg.btnSubmit': 'వాల్ట్ & రికవరీ పదబంధాన్ని సృష్టించండి',
      'reg.haveVault': 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి',
      'reg.stealthLabel': 'స్టెల్త్ ఎస్కేప్ వెబ్‌సైట్ (ఐచ్ఛికం)',
      'reg.stealthHelp': 'ఎవరైనా వస్తే, ఖాతా వెంటనే మాయమై ఈ సాధారణ వెబ్‌సైట్ తెరుచుకుంటుంది. దీన్ని తర్వాత పానిక్ సెట్టింగ్‌లలో మార్చవచ్చు.',
      'reg.stealthCustomPlaceholder': 'https://example.com',

      // Recovery View
      'recover.title': 'వాల్ట్ యాక్సెస్‌ను పునరుద్ధరించండి',
      'recover.subtitle': 'మీ ఆధారాలను రీసెట్ చేయడానికి మీ 24-పదాల BIP-39 రికవరీ పదబంధాన్ని నమోదు చేయండి.',
      'recover.userLabel': 'ఖాతా మారుపేరు',
      'recover.phraseLabel': '24-పదాల రికవరీ పదబంధం',
      'recover.phrasePlaceholder': 'స్పేస్‌లతో అన్ని 24 పదాలను నమోదు చేయండి...',
      'recover.newPassLabel': 'కొత్త మాస్టర్ పాస్‌వర్డ్',
      'recover.newPassPlaceholder': 'కనీసం 10 అక్షరాలు',
      'recover.btnSubmit': 'వాల్ట్‌ను పునరుద్ధరించండి',
      'recover.backLogin': 'లాగిన్‌కు తిరిగి వెళ్ళండి',

      // Vault Dashboard
      'vault.title': 'డిజిటల్ సాక్ష్యాల వాల్ట్',
      'vault.subtitle': 'AES-256-GCM ఎన్‌క్రిప్షన్‌తో రక్షించబడింది. మార్చలేని SHA-256 టైమ్‌స్టాంప్‌లతో సురక్షితం.',
      'vault.btnAudit': '🛡️ క్రిప్టోగ్రాఫిక్ హెల్త్ ఆడిట్',
      'vault.btnExport': '📑 పూర్తి కేస్ ఫైల్ డౌన్‌లోడ్ (.ZIP)',
      'vault.statAnchored': 'భద్రపరిచిన సాక్ష్యం',
      'vault.statAnchoredSub': 'చట్టపరంగా టైమ్‌స్టాంప్డ్',
      'vault.statZk': 'జీరో-నాలెడ్జ్',
      'vault.statZkSub': 'AES-256-GCM ఎన్వలప్',
      'vault.statSanitizer': 'మెటాడేటా శానిటైజర్',
      'vault.statSanitizerSub': 'EXIF & GPS తొలగించబడింది',
      'vault.statChain': 'కస్టడీ ఆరోగ్యం',
      'vault.statChainSub': 'తారుమారు లేనిదని ధృవీకరించబడింది',
      'vault.dropzoneText': 'స్క్రీన్‌షాట్లు, వేధింపుల ఆడియో, డీప్‌ఫేక్ ఫైళ్లు లేదా పత్రాలను ఇక్కడ వేయండి',
      'vault.dropzoneHint': 'బ్రౌజర్ నుండి బయటకు వెళ్లేముందు ఫైల్స్ EXIF/GPS శుభ్రం చేయబడి, SHA-256 హాష్ చేయబడి, AES-256 ఎన్‌క్రిప్ట్ చేయబడతాయి.',
      'vault.browseFiles': '📁 ఫైల్‌లను ఎంచుకోండి',
      'vault.redactBtn': '🖌️ అప్‌లోడ్‌కు ముందు సున్నితమైన వివరాలు దాచండి',
      'vault.promptTags': 'సంఘటన ట్యాగ్‌లు & రహస్య నోట్స్ నమోదు చేయండి',
      'vault.interactionTip': '💡 చిట్కా: డీక్రిప్ట్ చేసిన వివరాలను చూడటానికి క్రింది కార్డుపై డబుల్ క్లిక్ చేయండి.',
      'vault.searchPlaceholder': 'ట్యాగ్, ప్లాట్‌ఫారమ్ లేదా SHA-256 హాష్ ద్వారా శోధించండి...',
      'vault.filterAll': 'అన్ని సాక్ష్యాలు',
      'vault.filterImages': 'చిత్రాలు & స్క్రీన్‌షాట్లు',
      'vault.filterAudio': 'ఆడియో & వాయిస్ నోట్స్',
      'vault.filterVideos': 'వీడియో & డీప్‌ఫేక్‌లు',
      'vault.filterDocs': 'చట్టపరమైన పత్రాలు & చాట్లు',

      // Verifier View
      'verifier.badge': 'ప్రజా స్వతంత్ర ఫోరెన్సిక్ తనిఖీ',
      'verifier.title': 'ఫోరెన్సిక్ చైన్ ఆఫ్ కస్టడీ వెరిఫైయర్',
      'verifier.subtitle': 'డిజిటల్ ఫైల్ ఏదైనా మార్చబడిందా అని తనిఖీ చేయండి. క్రిప్టోగ్రాఫిక్ లెడ్జర్‌తో డిజిటల్ వేలిముద్రలను పోలుస్తుంది.',
      'verifier.dropText': 'ధృవీకరణ కోసం సాక్ష్యపు ఫైల్‌ను ఇక్కడ లాగి వదలండి',
      'verifier.dropHint': 'క్లయింట్ మెమరీలో SHA-256 వేలిముద్రను లెక్కిస్తుంది మరియు సర్వర్ HMAC ముద్రను ధృవీకరిస్తుంది.',
      'verifier.selectBtn': 'ధృవీకరించడానికి ఫైల్‌ను ఎంచుకోండి',
      'verifier.orQuery': '— లేదా నేరుగా SHA-256 హాష్ స్ట్రింగ్ ద్వారా శోధించండి —',
      'verifier.hashLabel': 'SHA-256 హాష్ స్ట్రింగ్ (64 హెక్సాడెసిమల్ అక్షరాలు)',
      'verifier.hashPlaceholder': 'ఉదా. 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      'verifier.btnQuery': 'కస్టడీ లెడ్జర్‌లో తనిఖీ చేయండి',

      // Resources View
      'res.badge': 'అత్యవసర మద్దతు & చట్టపరమైన వనరులు',
      'res.title': 'మహిళల సైబర్ భద్రత & అత్యవసర హెల్ప్‌లైన్లు',
      'res.subtitle': 'సైబర్ హింసకు గురైన మహిళల కోసం ధృవీకరించబడిన జాతీయ హెల్ప్‌లైన్లు మరియు న్యాయ మార్గదర్శకాలు.',
      'res.call1930': '1930 కి డయల్ చేయండి (టోల్-ఫ్రీ 24x7)',
      'res.visitPortal': 'cybercrime.gov.in ని సందర్శించండి',
      'res.ncwHotline': '7827170170 / 1091 కి కాల్ చేయండి',
      'res.visitNcw': 'NCW పోర్టల్‌ను సందర్శించండి',
      'res.stopNciiDesc': 'అంతరంగిక చిత్రాల క్లయింట్-సైడ్ హాష్‌లను సృష్టిస్తుంది, తద్వారా ప్రముఖ ప్లాట్‌ఫారమ్‌లు అసలు ఫోటో చూడకుండానే వాటి వ్యాప్తిని నిరోధించగలవు.',
      'res.visitStopNcii': 'StopNCII.org ని సందర్శించండి',
      'res.rulesTitle': 'కోర్టులో సాక్ష్యాల ఆమోదయోగ్యత నియమాలు',
      'res.rule1Title': 'అసలు ఫైళ్లను మార్చకుండా భద్రపరచండి:',
      'res.rule1Desc': 'అసలు ఫోటోలు లేదా వీడియోలను నేరుగా సవరించవద్దు. SHA-256 టైమ్‌స్టాంప్‌ను నమోదు చేయడానికి మొదట ఇక్కడ నిల్వ చేయండి.',
      'res.rule2Title': 'పూర్తి వివరాలను రికార్డ్ చేయండి:',
      'res.rule2Desc': 'URL అడ్రస్ బార్, పంపినవారి హ్యాండిల్, ఫోన్ నంబర్లు మరియు పూర్తి తేదీ/సమయాన్ని చూపే స్క్రీన్‌షాట్‌లను తీయండి.',
      'res.rule3Title': 'సెక్షన్ 65B సమ్మతి (ఇండియన్ ఎవిడెన్స్ యాక్ట్ / BSA):',
      'res.rule3Desc': 'పోలీసులు లేదా న్యాయవాదులకు సాక్ష్యాలను సమర్పించేటప్పుడు అసలు ఫైల్‌తో పాటు ధృవీకరించబడిన PDF నివేదికను జత చేయండి.',

      // Apple Design & Non-Tech Friendly Keys (Telugu)
      'nav.modeSimple': '🕊️ సరళ వీక్షణ',
      'nav.modeForensic': '⚖️ ఫోరెన్సిక్ వీక్షణ',
      'guide.title': 'బాధిత మహిళల సురక్షిత గైడ్: 3 సులభమైన దశలు',
      'guide.subtitle': 'సాంకేతిక పరిజ్ఞానం లేకుండా బెదిరింపు సందేశాలు లేదా ఫోటోలను కోర్టు సాక్ష్యాలుగా ఎలా మార్చాలి.',
      'guide.step1Title': '1. సాక్ష్యాన్ని ఇక్కడ అప్‌లోడ్ చేయండి',
      'guide.step1Desc': 'స్క్రీన్‌షాట్‌లు, వాయిస్ నోట్స్ లేదా ఫోటోలను అప్‌లోడ్ చేయండి. మీ రక్షణ కోసం జీపీఎస్ లొకేషన్ తొలగించబడుతుంది.',
      'guide.step2Title': '2. ఏమి జరిగిందో నమోదు చేయండి',
      'guide.step2Desc': 'ప్లాట్‌ఫారమ్ (WhatsApp, Instagram మొదలైనవి) వివరాలను ఎంచుకోండి.',
      'guide.step3Title': '3. కోర్టు ప్యాకేజీ డౌన్‌లోడ్ చేసుకోండి',
      'guide.step3Desc': '1930 లేదా లాయర్ కోసం అధికారిక సర్టిఫైడ్ PDF పత్రాన్ని డౌన్‌లోడ్ చేసుకోండి.',
      'vault.helpWhatToSave': '💡 నేను ఏ సాక్ష్యాలను సేకరించాలి?',
      'vault.safeLocationScrubbed': 'భద్రత కోసం లొకేషన్ తొలగించబడింది',
      'vault.zkEncrypted': '100% గోప్యమైనది',
      'vault.tamperProofVerified': 'ధృవీకరించబడిన అసలైన సాక్ష్యం',
      'vault.downloadCourtPackage': '📦 కోర్టు ప్యాకేజీ డౌన్‌లోడ్ (.ZIP + PDF)',
      'helper.modalTitle': '💡 సాక్ష్యాల సహాయకారి: ఏమి సేకరించాలి',
      'helper.modalSubtitle': 'సైబర్ వేధింపులు లేదా డీప్‌ఫేక్‌లకు వ్యతిరేకంగా తిరుగులేని సాక్ష్యాలను సేకరించడానికి మార్గదర్శకాలు.',
      'helper.reassurance': 'ప్రతిదీ మీ కంప్యూటర్‌లోనే భద్రంగా ఉంటుంది.',
      'helper.catChat': '💬 WhatsApp / Telegram సందేశాలు',
      'helper.catChatTips': '• పంపినవారి ఫోన్ నంబర్ లేదా ప్రొఫైల్‌ను క్యాప్చర్ చేయండి.\n• పూర్తి తేదీ మరియు సమయాన్ని ఉంచండి.\n• సందేశాలను తొలగించవద్దు.',
      'helper.catSocial': '📸 Instagram / Facebook / X',
      'helper.catSocialTips': '• వేధించేవారి ఖాతా హ్యాండిల్ (@username) మరియు ప్రొఫైల్ పేజీని స్క్రీన్‌షాట్ తీయండి.',
      'helper.catDeepfake': '🤖 డీప్‌ఫేక్స్ / AI మార్ఫింగ్',
      'helper.catDeepfakeTips': '• అసలు ఫోటోను వెంటనే భద్రపరచండి.\n• వ్యాప్తిని అరికట్టడానికి StopNCII.org వాడండి.',
      'helper.catCalls': '📞 బెదిరింపు ఫోన్ కాల్స్',
      'helper.catCallsTips': '• ఇన్‌కమింగ్ కాల్ చరిత్రను స్క్రీన్‌షాట్ తీయండి.\n• ఆడియో రికార్డింగ్‌ను యథాతథంగా అప్‌లోడ్ చేయండి.'
    },

    bn: {
      // Safety Bar
      'safety.active': 'ভুক্তভোগীর সুরক্ষা সক্রিয়:',
      'safety.doubleBar': 'বারে ডাবল-ক্লিক করুন',
      'safety.doubleEsc': 'দুইবার ESC চাপুন',
      'safety.doubleAnywhere': 'যে কোনো জায়গায় ডাবল-ক্লিক করুন',
      'safety.panicSettings': '⚙️ জরুরি সেটিংস',
      'safety.helplines': '🆘 ১৯৩০ হেল্পলাইন',
      'safety.quickExit': '⚠️ দ্রুত প্রস্থান',

      // Navigation
      'nav.brandTitle': 'এভিডেন্স লকার',
      'nav.brandBadge': 'জিরো-নলেজ',
      'nav.brandSub': 'ফরেনসিক হেফাজত ও সাইবার নিরাপত্তা প্ল্যাটফর্ম',
      'nav.unlockVault': '🔑 ভল্ট খুলুন',
      'nav.evidenceVault': '🔒 প্রমাণ ভল্ট',
      'nav.forensicVerifier': '⚖️ ফরেনসিক যাচাইকারী',
      'nav.helplinesLegal': '🤝 হেল্পলাইন ও আইনি সহায়তা',
      'nav.lockVault': 'ভল্ট লক করুন',
      'nav.language': 'ভাষা',

      // Login View
      'login.title': 'প্রমাণ ভল্ট আনলক করুন',
      'login.subtitle': 'জিরো-নলেজ AES-256 ডিক্রিপশন সম্পূর্ণভাবে আপনার ব্রাউজারের মেমরিতে ঘটে।',
      'login.userLabel': 'ইমেল বা ছদ্মনাম (Pseudonym)',
      'login.userPlaceholder': 'যেমন survivor_492 বা ইমেল',
      'login.passLabel': 'মাস্টার পাসওয়ার্ড',
      'login.passPlaceholder': '••••••••••••',
      'login.passHelp': 'আপনার পাসওয়ার্ড PBKDF2 (৬,০০,০০০ রাউন্ড) এর মাধ্যমে স্থানীয় AES-256 চাবি তৈরি করে। এটি সার্ভারে পাঠানো হয় না।',
      'login.btnSubmit': 'নিরাপদে ভল্ট খুলুন',
      'login.createVault': 'নতুন ভল্ট তৈরি করুন',
      'login.useRecovery': '২৪-শব্দের পুনরুদ্ধার বাক্যাংশ ব্যবহার করুন',

      // Register View
      'reg.title': 'ব্যক্তিগত প্রমাণ ভল্ট তৈরি করুন',
      'reg.subtitle': 'ক্লায়েন্ট-সাইড জিরো-নলেজ আর্কিটেকচার। সার্ভার কখনোই আপনার এনক্রিপ্ট না করা প্রমাণ বা পাসওয়ার্ড দেখতে পারে না।',
      'reg.userLabel': 'ছদ্মনাম বা ইমেল নির্বাচন করুন',
      'reg.userPlaceholder': 'যেমন anonymous_ally বা ইমেল',
      'reg.passLabel': 'মাস্টার পাসওয়ার্ড',
      'reg.passPlaceholder': 'কমপক্ষে ১০টি অক্ষর',
      'reg.confirmLabel': 'পাসওয়ার্ড নিশ্চিত করুন',
      'reg.confirmPlaceholder': 'পাসওয়ার্ড পুনরায় লিখুন',
      'reg.passHelp': 'হার্ডওয়্যার আক্রমণ প্রতিহত করতে PBKDF2 (৬,০০,০০০ পুনরাবৃত্তি) ব্যবহৃত হয়।',
      'reg.btnSubmit': 'ভল্ট ও পুনরুদ্ধার বাক্যাংশ তৈরি করুন',
      'reg.haveVault': 'আগে থেকেই ভল্ট আছে? লগইন করুন',
      'reg.stealthLabel': 'স্টেলথ পালানোর ওয়েবসাইট (ঐচ্ছিক)',
      'reg.stealthHelp': 'কেউ এলে, ভল্ট তাৎক্ষণিকভাবে অদৃশ্য হয়ে যায় এবং এই নিরাপদ ওয়েবসাইটটি খুলবে। আপনি পরে প্যানিক সেটিংসে এটি পরিবর্তন করতে পারেন।',
      'reg.stealthCustomPlaceholder': 'https://example.com',

      // Recovery View
      'recover.title': 'ভল্ট অ্যাক্সেস পুনরুদ্ধার করুন',
      'recover.subtitle': 'আপনার মাস্টার কী রিসেট করতে ২৪-শব্দের BIP-39 রিকভারি বাক্যাংশ লিখুন।',
      'recover.userLabel': 'অ্যাকাউন্ট ছদ্মনাম',
      'recover.phraseLabel': '২৪-শব্দের পুনরুদ্ধার বাক্যাংশ',
      'recover.phrasePlaceholder': 'স্পেস দিয়ে ২৪টি শব্দ লিখুন...',
      'recover.newPassLabel': 'নতুন মাস্টার পাসওয়ার্ড',
      'recover.newPassPlaceholder': 'কমপক্ষে ১০টি অক্ষর',
      'recover.btnSubmit': 'ভল্ট পুনরুদ্ধার করুন ও কী রিসেট করুন',
      'recover.backLogin': 'লগইনে ফিরে যান',

      // Vault Dashboard
      'vault.title': 'ডিজিটাল প্রমাণ ভল্ট',
      'vault.subtitle': 'AES-256-GCM এনক্রিপশনে সুরক্ষিত। অপরিবর্তনীয় SHA-256 টাইমস্ট্যাম্প সহ আনুষ্ঠানিকভাবে সংরক্ষিত।',
      'vault.btnAudit': '🛡️ ক্রিপ্টোগ্রাফিক হেলথ অডিট',
      'vault.btnExport': '📑 সম্পূর্ণ কেস ফাইল ডাউনলোড (.ZIP)',
      'vault.statAnchored': 'সংরক্ষিত প্রমাণ',
      'vault.statAnchoredSub': 'আইনসম্মতভাবে টাইমস্ট্যাম্পযুক্ত',
      'vault.statZk': 'জিরো-নলেজ',
      'vault.statZkSub': 'AES-256-GCM খাম',
      'vault.statSanitizer': 'মেটাডেটা স্যানিটাইজার',
      'vault.statSanitizerSub': 'EXIF ও GPS অপসারিত',
      'vault.statChain': 'হেফাজত অবস্থা',
      'vault.statChainSub': 'বিকৃতিমুক্ত যাচাইকৃত',
      'vault.dropzoneText': 'স্ক্রিনশট, হয়রানির অডিও, ডিপফেক বা নথি এখানে ফেলুন',
      'vault.dropzoneHint': 'ব্রাউজার ছাড়ার আগেই ফাইলগুলি EXIF/GPS মুক্ত হয়, SHA-256 হ্যাশ হয় এবং AES-256 এনক্রিপ্ট করা হয়।',
      'vault.browseFiles': '📁 ফাইল বেছে নিন',
      'vault.redactBtn': '🖌️ আপলোডের আগে সংবেদনশীল অংশ ঢাকুন',
      'vault.promptTags': 'ঘটনার ট্যাগ ও গোপনীয় নোট যোগ করুন',
      'vault.interactionTip': '💡 টিপ: ডিক্রিপ্ট করা বিস্তারিত দেখতে নিচের যে কোনো কার্ডে ডাবল-ক্লিক করুন।',
      'vault.searchPlaceholder': 'ট্যাগ, প্ল্যাটফর্ম বা SHA-256 হ্যাশ দিয়ে অনুসন্ধান করুন...',
      'vault.filterAll': 'সমস্ত প্রমাণ',
      'vault.filterImages': 'ছবি ও স্ক্রিনশট',
      'vault.filterAudio': 'অডিও ও ভয়েস নোট',
      'vault.filterVideos': 'ভিডিও ও ডিপফেক',
      'vault.filterDocs': 'আইনি ও চ্যাট ফাইল',

      // Verifier View
      'verifier.badge': 'পাবলিক স্বাধীন ফরেনসিক যাচাই',
      'verifier.title': 'ফরেনসিক চেইন অফ কাস্টডি যাচাইকারী',
      'verifier.subtitle': 'কোনো ডিজিটাল ফাইলে হেরফের হয়েছে কিনা যাচাই করুন। ক্রিপ্টোগ্রাফিক লেজারের সাথে ডিজিটাল ফিঙ্গারপ্রিন্ট তুলনা করে।',
      'verifier.dropText': 'যাচাই করার জন্য প্রমাণের ফাইলটি এখানে টানুন',
      'verifier.dropHint': 'ব্রাউজারে SHA-256 ফিঙ্গারপ্রিন্ট গণনা করে এবং সার্ভার HMAC সীলমোহর যাচাই করে।',
      'verifier.selectBtn': 'যাচাই করার ফাইল নির্বাচন করুন',
      'verifier.orQuery': '— অথবা সরাসরি SHA-256 হ্যাশ দিয়ে অনুসন্ধান করুন —',
      'verifier.hashLabel': 'SHA-256 হ্যাশ স্ট্রিং (৬৪ হেক্সাডেসিমেল অক্ষর)',
      'verifier.hashPlaceholder': 'যেমন 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      'verifier.btnQuery': 'লেজার থেকে যাচাই করুন',

      // Resources View
      'res.badge': 'জরুরি সহায়তা ও আইনি সংস্থান',
      'res.title': 'নারী সাইবার নিরাপত্তা ও জরুরি হেল্পলাইন',
      'res.subtitle': 'ডিজিটাল সহিংসতা ও হয়রানির শিকার নারীদের জন্য যাচাইকৃত জাতীয় হেল্পলাইন এবং আইনি নির্দেশিকা।',
      'res.call1930': 'কল করুন ১৯৩০ (টোল-ফ্রি ২৪x৭)',
      'res.visitPortal': 'cybercrime.gov.in এ যান',
      'res.ncwHotline': '৭৮২৭১৭০১৭০ / কল করুন ১০৯১',
      'res.visitNcw': 'NCW পোর্টালে যান',
      'res.stopNciiDesc': 'অন্তরঙ্গ ছবির ক্লায়েন্ট-সাইড হ্যাশ তৈরি করে যাতে মূল ছবি না দেখেই প্রধান প্ল্যাটফর্মগুলি তাদের ছড়ানো রুখতে পারে।',
      'res.visitStopNcii': 'StopNCII.org এ যান',
      'res.rulesTitle': 'আদালতে প্রমাণ গ্রহণযোগ্যতার নিয়মাবলী',
      'res.rule1Title': 'মূল ফাইল অপরিবর্তিত রাখুন:',
      'res.rule1Desc': 'কখনোই মূল ছবি বা ভিডিও সরাসরি সম্পাদনা করবেন না। বিশ্বস্ত SHA-256 টাইমস্ট্যাম্পের জন্য প্রথমে এখানে সুরক্ষিত করুন।',
      'res.rule2Title': 'সম্পূর্ণ বিবরণ ধারণ করুন:',
      'res.rule2Desc': 'স্ক্রিনশটে URL অ্যাড্রেস বার, প্রেরকের হ্যান্ডেল, ফোন নম্বর এবং পূর্ণ তারিখ/সময় দৃশ্যমান রাখুন।',
      'res.rule3Title': 'ধারা ৬৫B সম্মতি (ভারতীয় সাক্ষ্য আইন / BSA):',
      'res.rule3Desc': 'পুলিশ বা আইনজীবীকে প্রমাণ জমা দেওয়ার সময় মূল ফাইলের সাথে প্রত্যয়িত PDF রিপোর্ট ডাউনলোড করে যুক্ত করুন।',

      // Apple Design & Non-Tech Friendly Keys (Bengali)
      'nav.modeSimple': '🕊️ সহজ ভিউ',
      'nav.modeForensic': '⚖️ ফরেনসিক ভিউ',
      'guide.title': 'সহজ নির্দেশিকা: ৩টি সহজ ধাপ',
      'guide.subtitle': 'প্রযুক্তিগত জ্ঞান ছাড়াই হুমকিমূলক বার্তা বা ছবিকে আদালতের প্রমাণে রূপান্তর করুন।',
      'guide.step1Title': '১. প্রমাণ আপলোড করুন',
      'guide.step1Desc': 'স্ক্রিনশট বা ভয়েস নোট আপলোড করুন। আপনার নিরাপত্তার জন্য জিপিএস লোকেশন মুছে ফেলা হয়।',
      'guide.step2Title': '২. কি ঘটেছে তা লিখুন',
      'guide.step2Desc': 'প্ল্যাটফর্ম (WhatsApp, Instagram ইত্যাদি) এবং অপরাধীর বিবরণ দিন।',
      'guide.step3Title': '৩. কোর্ট প্যাকেজ ডাউনলোড করুন',
      'guide.step3Desc': '১৯৩০ বা আইনজীবীর জন্য প্রত্যয়িত PDF শংসাপত্র ডাউনলোড করুন।',
      'vault.helpWhatToSave': '💡 কী প্রমাণ সংগ্রহ করা উচিত?',
      'vault.safeLocationScrubbed': 'নিরাপত্তার জন্য লোকেশন সরানো হয়েছে',
      'vault.zkEncrypted': '১০০% গোপনীয়',
      'vault.tamperProofVerified': 'অপরিবর্তিত মূল প্রমাণ',
      'vault.downloadCourtPackage': '📦 কোর্ট প্যাকেজ ডাউনলোড (.ZIP + PDF)',
      'helper.modalTitle': '💡 প্রমাণ সহায়িকা: কী সংগ্রহ করবেন',
      'helper.modalSubtitle': 'সাইবার হেনস্থা বা ডিপফেকের বিরুদ্ধে প্রমাণ সংগ্রহের সহজ নির্দেশিকা।',
      'helper.reassurance': 'সবকিছু আপনার কম্পিউটারে সম্পূর্ণ সুরক্ষিত থাকে।',
      'helper.catChat': '💬 WhatsApp / Telegram বার্তা',
      'helper.catChatTips': '• প্রেরকের ফোন নম্বর বা প্রোফাইল ক্যাপচার করুন।\n• তারিখ এবং সময় অন্তর্ভুক্ত করুন।\n• চ্যাট মুছবেন না।',
      'helper.catSocial': '📸 Instagram / Facebook / X',
      'helper.catSocialTips': '• অপরাধীর প্রোফাইল পেজ এবং ইউজারনেম (@username) স্ক্রিনশট নিন।',
      'helper.catDeepfake': '🤖 ডিপফেক / AI বিকৃতি',
      'helper.catDeepfakeTips': '• মূল ফাইলটি তাৎক্ষণিকভাবে সংরক্ষণ করুন।\n• ছড়ানো রোধ করতে StopNCII.org ব্যবহার করুন।',
      'helper.catCalls': '📞 হুমকিমূলক ফোন কল',
      'helper.catCallsTips': '• ইনকামিং কল হিস্ট্রির স্ক্রিনশট নিন।\n• ভয়েস রেকর্ডিং সরাসরি আপলোড করুন।'
    },

    mr: {
      // Safety Bar
      'safety.active': 'पीड़िता सुरक्षा सक्रिय:',
      'safety.doubleBar': 'पट्टीवर डबल-क्लिक करा',
      'safety.doubleEsc': 'दोनदा ESC दाबा',
      'safety.doubleAnywhere': 'कुठेही डबल-क्लिक करा',
      'safety.panicSettings': '⚙️ आपत्कालीन सेटिंग्ज',
      'safety.helplines': '🆘 १९३० हेल्पलाइन',
      'safety.quickExit': '⚠️ झटपट बाहेर पडा',

      // Navigation
      'nav.brandTitle': 'एव्हिडन्स लॉकर',
      'nav.brandBadge': 'झिरो-नॉलेज',
      'nav.brandSub': 'फॉरेन्सिक कस्टडी आणि सायबर सुरक्षा मंच',
      'nav.unlockVault': '🔑 व्हॉल्ट उघडा',
      'nav.evidenceVault': '🔒 पुरावा व्हॉल्ट',
      'nav.forensicVerifier': '⚖️ फॉरेन्सिक पडताळणी',
      'nav.helplinesLegal': '🤝 हेल्पलाइन व कायदेशीर मदत',
      'nav.lockVault': 'व्हॉल्ट लॉक करा',
      'nav.language': 'भाषा',

      // Login View
      'login.title': 'पुरावा व्हॉल्ट अनलॉक करा',
      'login.subtitle': 'झिरो-नॉलेज AES-256 डिक्रिप्शन संपूर्णपणे तुमच्या ब्राउझरच्या मेमरीमध्येच होते.',
      'login.userLabel': 'ईमेल किंवा टोपणनाव (Pseudonym)',
      'login.userPlaceholder': 'उदा. survivor_492 किंवा ईमेल',
      'login.passLabel': 'मास्टर पासवर्ड',
      'login.passPlaceholder': '••••••••••••',
      'login.passHelp': 'तुमचा पासवर्ड PBKDF2 (६,००,००० राउंड्स) द्वारे स्थानिक AES-256 की तयार करतो. हा कधीही सर्व्हरवर पाठवला जात नाही.',
      'login.btnSubmit': 'व्हॉल्ट सुरक्षितपणे उघडा',
      'login.createVault': 'नवीन व्हॉल्ट तयार करा',
      'login.useRecovery': '२४-शब्दांचा रिकव्हरी वाक्प्रचार वापरा',

      // Register View
      'reg.title': 'खाजगी पुरावा व्हॉल्ट तयार करा',
      'reg.subtitle': 'क्लायंट-साइड झिरो-नॉलेज तंत्रज्ञान. सर्व्हर तुमचे पुरावे, की किंवा पासवर्ड कधीही पाहू शकत नाही.',
      'reg.userLabel': 'टोपणनाव किंवा ईमेल निवडा',
      'reg.userPlaceholder': 'उदा. anonymous_ally किंवा सुरक्षित ईमेल',
      'reg.passLabel': 'मास्टर पासवर्ड',
      'reg.passPlaceholder': 'किमान १० अक्षरे',
      'reg.confirmLabel': 'मास्टर पासवर्डची पुष्टी करा',
      'reg.confirmPlaceholder': 'पासवर्ड पुन्हा टाका',
      'reg.passHelp': 'हार्डवेअर हल्ल्यांपासून बचाव करण्यासाठी कळा PBKDF2 (६००,००० आवर्तने) सह तयार केल्या जातात.',
      'reg.btnSubmit': 'व्हॉल्ट आणि रिकव्हरी वाक्प्रचार तयार करा',
      'reg.haveVault': 'आधीच व्हॉल्ट आहे? लॉगिन करा',
      'reg.stealthLabel': 'स्टेल्थ एस्केप वेबसाइट (ऐच्छिक)',
      'reg.stealthHelp': 'कुणी आल्यास, व्हॉल्ट लगेच अदृश्य होते आणि ही सामान्य वेबसाइट उघडते. तुम्ही हे नंतर पॅनिक सेटिंग्जमध्ये बदलू शकता.',
      'reg.stealthCustomPlaceholder': 'https://example.com',

      // Recovery View
      'recover.title': 'व्हॉल्ट ॲक्सेस पुनर्प्राप्त करा',
      'recover.subtitle': 'तुमची क्रेडेंशियल्स रीसेट करण्यासाठी तुमचा २४-शब्दांचा BIP-39 रिकव्हरी वाक्प्रचार प्रविष्ट करा.',
      'recover.userLabel': 'खाते टोपणनाव',
      'recover.phraseLabel': '२४-शब्दांचा रिकव्हरी वाक्प्रचार',
      'recover.phrasePlaceholder': 'सर्व २४ शब्द स्पेस देऊन टाका...',
      'recover.newPassLabel': 'नवीन मास्टर पासवर्ड',
      'recover.newPassPlaceholder': 'किमान १० अक्षरे',
      'recover.btnSubmit': 'व्हॉल्ट पूर्ववत करा व की रीसेट करा',
      'recover.backLogin': 'लॉगिनवर परत जा',

      // Vault Dashboard
      'vault.title': 'डिजिटल पुरावा व्हॉल्ट',
      'vault.subtitle': 'AES-256-GCM एन्क्रिप्शनने सुरक्षित. अपरिवर्तनीय SHA-256 टाइमस्टॅम्पसह कायदेशीररित्या प्रमाणित.',
      'vault.btnAudit': '🛡️ क्रिप्टोग्राफिक हेल्थ ऑडिट',
      'vault.btnExport': '📑 संपूर्ण केस फाइल डाउनलोड (.ZIP)',
      'vault.statAnchored': 'सुरक्षित पुरावे',
      'vault.statAnchoredSub': 'कायदेशीररित्या टाइमस्टॅम्प केलेले',
      'vault.statZk': 'झिरो-नॉलेज',
      'vault.statZkSub': 'AES-256-GCM लिफाफा',
      'vault.statSanitizer': 'मेटाडेटा सॅनिटायझर',
      'vault.statSanitizerSub': 'EXIF आणि GPS काढले',
      'vault.statChain': 'कस्टडी स्थिती',
      'vault.statChainSub': 'अपरिवर्तनीय तपासणी पूर्ण',
      'vault.dropzoneText': 'स्क्रीनशॉट, छळाचे ऑडिओ, डीपफेक किंवा कागदपत्रे येथे टाका',
      'vault.dropzoneHint': 'ब्राउझर सोडण्यापूर्वी फाइल्समधील EXIF/GPS साफ केले जाते, SHA-256 हॅश केले जाते आणि AES-256 एन्क्रिप्ट केले जाते.',
      'vault.browseFiles': '📁 फाइल्स निवडा',
      'vault.redactBtn': '🖌️ संवेदनशील माहिती लपवा',
      'vault.promptTags': 'अपलोडपूर्वी टॅग्ज आणि गोपनीय नोट्स विचारा',
      'vault.interactionTip': '💡 टीप: डिक्रिप्ट केलेले तपशील पाहण्यासाठी खालील कार्डवर डबल-क्लिक करा.',
      'vault.searchPlaceholder': 'टॅग, प्लॅटफॉर्म किंवा SHA-256 हॅशने शोधा...',
      'vault.filterAll': 'सर्व पुरावे',
      'vault.filterImages': 'चित्रे आणि स्क्रीनशॉट्स',
      'vault.filterAudio': 'ऑडिओ आणि व्हॉइस नोट्स',
      'vault.filterVideos': 'व्हिडिओ आणि डीपफेक्स',
      'vault.filterDocs': 'कायदेशीर आणि चॅट फाइल्स',

      // Verifier View
      'verifier.badge': 'सार्वजनिक स्वतंत्र फॉरेन्सिक तपासणी',
      'verifier.title': 'फॉरेन्सिक कस्टडी पडताळणी',
      'verifier.subtitle': 'कोणत्याही डिजिटल फाइलमध्ये छेडछाड झाली आहे का ते तपासा. क्रिप्टोग्राफिक लेजरसह डिजिटल फिंगरप्रिंटची तुलना करते.',
      'verifier.dropText': 'तपासणीसाठी पुरावा फाइल येथे ड्रॅग आणि ड्रॉप करा',
      'verifier.dropHint': 'ब्राउझरमध्ये SHA-256 फिंगरप्रिंट मोजते आणि सर्व्हर HMAC शिक्का तपासते.',
      'verifier.selectBtn': 'तपासण्यासाठी फाइल निवडा',
      'verifier.orQuery': '— किंवा थेट SHA-256 हॅशने शोधा —',
      'verifier.hashLabel': 'SHA-256 हॅश स्ट्रिंग (६४ हेक्साडेसिमल अक्षरे)',
      'verifier.hashPlaceholder': 'उदा. 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      'verifier.btnQuery': 'कस्टडी लेजरमधून शोधा',

      // Resources View
      'res.badge': 'आपत्कालीन मदत आणि कायदेशीर संसाधने',
      'res.title': 'महिला सायबर सुरक्षा व आपत्कालीन हेल्पलाइन',
      'res.subtitle': 'डिजिटल हिंसाचार आणि ऑनलाइन छळाला सामोरे जाणाऱ्या महिलांसाठी अधिकृत राष्ट्रीय हेल्पलाइन आणि कायदेशीर मार्गदर्शन.',
      'res.call1930': 'डायल करा १९३० (टोल-फ्री २४x७)',
      'res.visitPortal': 'cybercrime.gov.in ला भेट द्या',
      'res.ncwHotline': '७८२७१७०१७० / डायल करा १०९१',
      'res.visitNcw': 'NCW पोर्टलला भेट द्या',
      'res.stopNciiDesc': 'खाजगी फोटोंचे हॅश तयार करते ज्यामुळे प्रमुख प्लॅटफॉर्म मूळ फोटो न पाहताच त्यांचा प्रसार रोखू शकतात.',
      'res.visitStopNcii': 'StopNCII.org ला भेट द्या',
      'res.rulesTitle': 'न्यायालयात पुरावे स्वीकारण्याचे नियम',
      'res.rule1Title': 'मूळ फाइल्स कधीही बदलू नका:',
      'res.rule1Desc': 'मूळ फोटो किंवा व्हिडिओ थेट संपादित करू नका. विश्वसनीय SHA-256 टाइमस्टॅम्पसाठी ते प्रथम येथे सुरक्षित करा.',
      'res.rule2Title': 'पूर्ण संदर्भ नोंदवा:',
      'res.rule2Desc': 'स्क्रीनशॉटमध्ये URL ॲड्रेस बार, पाठवणाऱ्याचे हँडल, फोन नंबर आणि पूर्ण तारीख/वेळ दिसेल याची खात्री करा.',
      'res.rule3Title': 'कलम ६५B चे पालन (भारतीय साक्ष कायदा / BSA):',
      'res.rule3Desc': 'पोलीस किंवा वकिलांना पुरावे देताना मूळ फाइलसोबत प्रमाणित PDF अहवाल डाउनलोड करून जोडा.',

      // Apple Design & Non-Tech Friendly Keys (Marathi)
      'nav.modeSimple': '🕊️ साधे दृश्य',
      'nav.modeForensic': '⚖️ फॉरेन्सिक दृश्य',
      'guide.title': 'सुरक्षित सुरुवात: ३ सोप्या पायऱ्या',
      'guide.subtitle': 'तांत्रिक माहिती नसतानाही धमकीचे मेसेज किंवा फोटो न्यायालयासाठी पुरावा कसे बनवावेत.',
      'guide.step1Title': '१. पुरावा येथे टाका',
      'guide.step1Desc': 'स्क्रीनशॉट, व्हॉईस नोट्स किंवा फोटो टाका. सुरक्षेसाठी घरातील पत्ता व GPS काढून टाकले जाते.',
      'guide.step2Title': '२. काय घडले ते सांगा',
      'guide.step2Desc': 'प्लॅटफॉर्म आणि त्रास देणाऱ्या व्यक्तीचा तपशील निवडा. सर्वकाही पासवर्डने सुरक्षित राहते.',
      'guide.step3Title': '३. कोर्ट पॅकेज डाउनलोड करा',
      'guide.step3Desc': 'सायबर सेल (१९३०) किंवा वकिलासाठी प्रमाणित PDF प्रमाणपत्र मिळवा.',
      'vault.helpWhatToSave': '💡 मी काय पुरावे गोळा करावेत?',
      'vault.safeLocationScrubbed': 'सुरक्षेसाठी स्थान माहिती काढली',
      'vault.zkEncrypted': '१००% खाजगी (फक्त तुमच्याकडे चावी)',
      'vault.tamperProofVerified': 'मूळ न बदललेला पुरावा',
      'vault.downloadCourtPackage': '📦 कोर्ट पॅकेज डाउनलोड (.ZIP + PDF)',
      'helper.modalTitle': '💡 पुरावा मार्गदर्शक: काय गोळा करावे',
      'helper.modalSubtitle': 'ऑनलाइन त्रास, सायबर स्टॉकिंग किंवा डीपफेकविरोधात पुरावे गोळा करण्याचे सोपे नियम.',
      'helper.reassurance': 'सर्वकाही तुमच्या संगणकावर सुरक्षित राहते.',
      'helper.catChat': '💬 WhatsApp / Telegram मेसेज',
      'helper.catChatTips': '• पाठवणाऱ्याचा फोन नंबर किंवा प्रोफाईल सेव्ह करा.\n• पूर्ण तारीख व वेळ दिसेल याची खात्री करा.\n• मेसेज डिलीट करू नका.',
      'helper.catSocial': '📸 Instagram / Facebook / X',
      'helper.catSocialTips': '• खात्याचे नाव (@username) आणि लिंकसह प्रोफाईलचा स्क्रीनशॉट घ्या.',
      'helper.catDeepfake': '🤖 डीपफेक / मॉर्फिंग / AI',
      'helper.catDeepfakeTips': '• मूळ फाइल त्वरित सेव्ह करा.\n• प्रसार रोखण्यासाठी StopNCII.org वापरा.',
      'helper.catCalls': '📞 धमकीचे फोन कॉल्स',
      'helper.catCallsTips': '• कॉल हिस्ट्रीचा स्क्रीनशॉट घ्या.\n• ऑडिओ रेकॉर्डिंग थेट अपलोड करा.'
    }
  },

  init() {
    try {
      const saved = localStorage.getItem('evidence_locker_lang');
      if (saved && this.translations[saved]) {
        this.currentLang = saved;
      }
    } catch (e) {
      console.warn('Could not read preferred language from storage:', e);
    }

    this.applyTranslations();
    this.updateDropdown();
  },

  t(key, fallback = '') {
    const langDict = this.translations[this.currentLang] || this.translations['en'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (this.translations['en'] && this.translations['en'][key]) {
      return this.translations['en'][key];
    }
    return fallback || key;
  },

  setLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language ${lang} is not supported.`);
      return;
    }

    this.currentLang = lang;
    try {
      localStorage.setItem('evidence_locker_lang', lang);
    } catch (e) {}

    document.documentElement.lang = lang;
    this.applyTranslations();
    this.updateDropdown();

    // Broadcast event for custom components (like modals, reports, dynamic tables)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  },

  applyTranslations() {
    // 1. Text Content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // 2. Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation) {
        el.setAttribute('placeholder', translation);
      }
    });

    // 3. Titles / Tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const translation = this.t(key);
      if (translation) {
        el.setAttribute('title', translation);
      }
    });
  },

  updateDropdown() {
    const select = document.getElementById('lang-select');
    if (select && select.value !== this.currentLang) {
      select.value = this.currentLang;
    }
  }
};

window.I18n = I18n;
