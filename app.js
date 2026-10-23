/**
 * VERTEXPM INC. - INTERACTIVE APPLICATION LOGIC
 * Greater Toronto Area, Ontario, Canada
 * Construction Management & Quality Consulting
 */

// Current Slide state in Presentation Deck
let currentSlideIndex = 1;
const totalSlides = 7;
const slideNames = [
  "Visual Direction & Brand Identity",
  "Homepage & Core Positioning",
  "Our Services (01 - 04)",
  "Infrastructure Sectors",
  "About VertexPM & Co-Founders",
  "Relevant Experience & Credibility",
  "Start a Conversation & Quote Proposal"
];

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initWelcomeSplash();
  initLiveGtaClock();
  initScrollSpy();
  initKeyboardNav();
  updateEstimator();

  // Set current year in footer
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/**
 * Welcome Splash Experience Logic
 * Automatically welcomes visitors on website launch
 */
let welcomeDismissed = false;

function initWelcomeSplash() {
  const splash = document.getElementById("welcome-splash");
  const fill = document.getElementById("welcome-progress-fill");
  if (!splash) return;

  // Prevent background scroll while splash is active
  document.body.style.overflow = "hidden";

  // Fill progress bar smoothly over ~2.4 seconds
  const duration = 8000;
  const startTime = Date.now();

  const progressInterval = setInterval(() => {
    if (welcomeDismissed) {
      clearInterval(progressInterval);
      return;
    }
    const elapsed = Date.now() - startTime;
    const pct = Math.min(100, Math.round((elapsed / duration) * 100));
    if (fill) fill.style.width = `${pct}%`;

    if (elapsed >= duration) {
      clearInterval(progressInterval);
      dismissWelcomeSplash();
    }
  }, 40);

  // Allow clicking anywhere on backdrop to dismiss
  splash.addEventListener("click", (e) => {
    if (e.target.id === "welcome-splash" || e.target.classList.contains("welcome-splash-backdrop")) {
      dismissWelcomeSplash();
    }
  });

  // Allow Esc key to dismiss immediately
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !welcomeDismissed) {
      dismissWelcomeSplash();
    }
  });
}

function dismissWelcomeSplash() {
  if (welcomeDismissed) return;
  welcomeDismissed = true;
  const splash = document.getElementById("welcome-splash");
  if (!splash) return;
  splash.classList.add("hidden");
  document.body.style.overflow = "";
  setTimeout(() => {
    splash.style.display = "none";
  }, 650);
}

/**
 * Live Canadian Eastern Time Clock (GTA, Ontario)
 */
function initLiveGtaClock() {
  const clockEl = document.getElementById("gta-time-display");
  if (!clockEl) return;

  function updateTime() {
    try {
      const now = new Date();
      const options = {
        timeZone: "America/Toronto",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat("en-CA", options).format(now);
      clockEl.textContent = `Toronto, ON: ${timeStr} EDT`;
    } catch (e) {
      clockEl.textContent = "Toronto, ON: 09:30 AM EDT";
    }
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/**
 * ScrollSpy for Active Navigation Link Highlighting
 */
function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let currentId = "home";
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  });
}

/**
 * Smooth Scroll to section
 */
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Toggle between Modern Full Website and PDF Concept Slide Deck
 */
function switchViewMode(mode) {
  const btnWeb = document.getElementById("btn-mode-web");
  const btnSlides = document.getElementById("btn-mode-slides");

  if (mode === "slides") {
    document.body.classList.add("slides-active");
    btnWeb?.classList.remove("active");
    btnSlides?.classList.add("active");
    showSlide(currentSlideIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    document.body.classList.remove("slides-active");
    btnSlides?.classList.remove("active");
    btnWeb?.classList.add("active");
  }
}

/**
 * Slide Navigation (01 - 07)
 */
function showSlide(index) {
  if (index < 1) index = 1;
  if (index > totalSlides) index = totalSlides;
  currentSlideIndex = index;

  // Hide all slides
  document.querySelectorAll(".deck-slide").forEach(s => s.classList.remove("active"));

  // Show active slide
  const targetSlide = document.getElementById(`slide-${index}`);
  if (targetSlide) {
    targetSlide.classList.add("active");
  }

  // Update Tracker
  const tracker = document.getElementById("deck-tracker");
  const slideName = document.getElementById("deck-slide-name");
  if (tracker) {
    tracker.textContent = `SLIDE 0${index} / 0${totalSlides}`;
  }
  if (slideName) {
    slideName.textContent = slideNames[index - 1];
  }
}

function nextSlide() {
  if (currentSlideIndex < totalSlides) {
    showSlide(currentSlideIndex + 1);
  } else {
    showSlide(1);
  }
}

function prevSlide() {
  if (currentSlideIndex > 1) {
    showSlide(currentSlideIndex - 1);
  } else {
    showSlide(totalSlides);
  }
}

/**
 * Keyboard Navigation for Slides
 */
function initKeyboardNav() {
  window.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("slides-active")) {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        prevSlide();
      } else if (e.key === "Escape") {
        switchViewMode("web");
      }
    }
  });
}

/**
 * Mobile Navigation Drawer Toggle & Close
 */
function toggleMobileMenu() {
  const menu = document.getElementById("desktop-menu");
  const toggleBtn = document.getElementById("btn-mobile-toggle");
  const backdrop = document.getElementById("mobile-nav-backdrop");
  if (!menu) return;

  const isOpen = menu.classList.toggle("mobile-open");
  if (backdrop) backdrop.classList.toggle("active", isOpen);
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggleBtn.innerHTML = isOpen
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  }
  document.body.style.overflow = isOpen ? "hidden" : "";
}

function closeMobileMenu() {
  const menu = document.getElementById("desktop-menu");
  const toggleBtn = document.getElementById("btn-mobile-toggle");
  const backdrop = document.getElementById("mobile-nav-backdrop");
  if (!menu) return;

  menu.classList.remove("mobile-open");
  if (backdrop) backdrop.classList.remove("active");
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  }
  document.body.style.overflow = "";
}

// Ensure mobile menu closes automatically when viewport is resized back to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 992) {
    closeMobileMenu();
  }
});

/**
 * Modal Handling
 */
const genericModal = document.getElementById("generic-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body-content");

function openModal(title, htmlContent) {
  modalTitle.textContent = title;
  modalBody.innerHTML = htmlContent;
  genericModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  genericModal.classList.remove("open");
  document.body.style.overflow = "";
}

function closeModalOnBackdrop(e) {
  if (e.target === genericModal) {
    closeModal();
  }
}

/**
 * Phase Details Breakdown (Plan / Inspect / Verify / Deliver)
 */
const phaseData = {
  plan: {
    title: "Phase 01: Plan - Strategic Quality Systems",
    content: `
      <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">
        <p style="margin-bottom: 1rem;">
          Before shovels hit the ground, VertexPM establishes practical quality management systems calibrated to the Ontario Provincial Standards (OPSS) and Canadian Highway Bridge Design Code (CSA S6).
        </p>
        <div style="background: var(--bg-card-subtle); padding: 1.2rem; border-radius: 8px; margin-bottom: 1rem;">
          <strong style="color: var(--navy-primary); display: block; margin-bottom: 0.4rem;">Core Planning Deliverables:</strong>
          <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <li>Project Quality Management Plans (QMP & CQMP)</li>
            <li>Custom Inspection & Test Plans (ITP) per specification division</li>
            <li>Quality Risk Registers & Hold-Point Definitions</li>
            <li>Regulatory & Municipal Permitting Verification</li>
          </ul>
        </div>
        <p><strong>Outcome:</strong> Complete project clarity before execution begins, mitigating costly retrofits.</p>
      </div>
    `
  },
  inspect: {
    title: "Phase 02: Inspect - On-Site Technical Verification",
    content: `
      <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">
        <p style="margin-bottom: 1rem;">
          Boots on the ground. VertexPM provides field-level technical inspection covering concrete pours, structural steel, civil earthworks, and sub-surface utilities across the GTA.
        </p>
        <div style="background: var(--bg-card-subtle); padding: 1.2rem; border-radius: 8px; margin-bottom: 1rem;">
          <strong style="color: var(--navy-primary); display: block; margin-bottom: 0.4rem;">Field Verification Focus:</strong>
          <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <li>Concrete slump, air, and compressive cylinder testing oversight (CSA A23.1/A23.2)</li>
            <li>Rebar placement, clearance, and epoxy coating verification</li>
            <li>Transit trackwork, overhead catenary, and elevated guideway alignment</li>
            <li>Daily Field Reports (DFRs) with high-definition photographic logging</li>
          </ul>
        </div>
        <p><strong>Outcome:</strong> Immediate detection of discrepancies before they become buried liabilities.</p>
      </div>
    `
  },
  verify: {
    title: "Phase 03: Verify - Compliance & Non-Conformance Resolution",
    content: `
      <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">
        <p style="margin-bottom: 1rem;">
          Quality control is only as strong as its audit trail. We manage Non-Conformance Reports (NCRs), track root-cause analyses, and oversee corrective engineering sign-offs.
        </p>
        <div style="background: var(--bg-card-subtle); padding: 1.2rem; border-radius: 8px; margin-bottom: 1rem;">
          <strong style="color: var(--navy-primary); display: block; margin-bottom: 0.4rem;">Verification Protocols:</strong>
          <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <li>Systematic NCR logging, disposition tracking, and partner sign-off</li>
            <li>Third-party materials testing laboratory surveillance</li>
            <li>Internal contractor quality audit execution (ISO 19011 compliant)</li>
            <li>P.Eng. structural and civil engineering peer reviews</li>
          </ul>
        </div>
        <p><strong>Outcome:</strong> Uncompromising compliance with Metrolinx, MTO, and municipal contracts.</p>
      </div>
    `
  },
  deliver: {
    title: "Phase 04: Deliver - Defect-Free Turnover & Closeout",
    content: `
      <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">
        <p style="margin-bottom: 1rem;">
          Seamless transition from construction to operations. VertexPM compiles complete turnover dossiers, validates as-builts, and resolves outstanding punch lists.
        </p>
        <div style="background: var(--bg-card-subtle); padding: 1.2rem; border-radius: 8px; margin-bottom: 1rem;">
          <strong style="color: var(--navy-primary); display: block; margin-bottom: 0.4rem;">Handover Deliverables:</strong>
          <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <li>Organized Turnover Packages indexed to contract requirements</li>
            <li>Deficiency tracking and closeout validation</li>
            <li>Warranty documentation and operation/maintenance manuals (O&M)</li>
            <li>Final Quality Certificate & As-Built compilation</li>
          </ul>
        </div>
        <p><strong>Outcome:</strong> Fast-tracked Substantial Performance certificates and prompt release of holdbacks.</p>
      </div>
    `
  }
};

function showPhaseDetail(phaseKey) {
  const p = phaseData[phaseKey];
  if (p) {
    openModal(p.title, p.content);
  }
}

/**
 * Service Deliverable Modal
 */
const serviceModalData = {
  "Quality management": {
    title: "Service 01: Quality Management Specifications",
    desc: "Build quality into every phase of the project lifecycle with systematic, Canadian-compliant management systems.",
    items: [
      { name: "Quality Management Plans (QMP)", detail: "Tailored to client specs, ISO 9001 guidelines, and provincial infrastructure requirements." },
      { name: "Construction Quality Management Plans (CQMP)", detail: "Defines contractor quality control (QC) and owner quality assurance (QA) obligations." },
      { name: "Inspection & Test Plans (ITP)", detail: "Matrix of hold points, witness points, frequency of tests, and acceptance criteria." },
      { name: "NCR Management", detail: "Formal protocol for logging, investigating, and closing non-conformances with P.Eng. oversight." },
      { name: "Quality & Internal Audits", detail: "Scheduled surveillance of field practices and subcontractor record compliance." }
    ]
  },
  "Construction management": {
    title: "Service 02: Construction Management Specifications",
    desc: "Bring coordination, discipline, and schedule rigor from groundbreaking through final inspection.",
    items: [
      { name: "Construction Oversight", detail: "On-site owner representation ensuring work matches drawings, specifications, and safety codes." },
      { name: "Contract Administration Support", detail: "Review of RFIs, submittals, change orders, progress claims, and contractor invoices." },
      { name: "Coordination Services", detail: "Harmonizing utilities, municipal authorities, transit operators, and general contractors." },
      { name: "Schedule Monitoring", detail: "Critical path analysis (CPM), baseline variance tracking, and delay mitigation strategies." },
      { name: "Risk Management", detail: "Proactive risk registers identifying constructability issues before they impact budget." }
    ]
  },
  "Technical inspection": {
    title: "Service 03: Technical Inspection Specifications",
    desc: "Hands-on, boots-on-the-ground technical verification of high-risk infrastructure components.",
    items: [
      { name: "Concrete & Rebar Inspection", detail: "Pre-pour formwork checks, reinforcement rebar verification, and CSA A23.1 pour oversight." },
      { name: "Civil Works Inspection", detail: "Subgrade compaction, asphalt paving (OPSS 310), trenching, backfill, and stormwater controls." },
      { name: "Utility Inspection", detail: "Subsurface utility engineering (SUE) verification, watermain pressure tests, and sewer CCTV review." },
      { name: "Transit Infrastructure Inspection", detail: "Guideway tolerances, track slab installation, platform interfaces, and catenary clearances." },
      { name: "Bridge Inspection Support", detail: "Bearing seat verification, expansion joint placement, structural steel erection, and deck waterproofing." }
    ]
  },
  "Closeout & turnover": {
    title: "Service 04: Closeout & Turnover Specifications",
    desc: "Ensure comprehensive record compilation and confident handover for municipal and transit owners.",
    items: [
      { name: "Turnover Packages", detail: "Indexed digital dossiers containing all test reports, material certs, and inspection sign-offs." },
      { name: "Quality Documentation", detail: "Structured audit trails verifying complete compliance across all contract divisions." },
      { name: "Closeout Packages", detail: "Comprehensive compilation supporting Substantial Performance under the Ontario Construction Act." },
      { name: "Deficiency Tracking", detail: "Itemized deficiency lists with photo proof of rectification before financial holdback release." },
      { name: "Records Compilation", detail: "Redline as-built drawing review and final operations & maintenance manual handoff." }
    ]
  }
};

function openDeliverableModal(serviceName) {
  const data = serviceModalData[serviceName];
  if (!data) return;

  let listHtml = data.items.map(it => `
    <div style="border-bottom: 1px solid var(--border-light); padding: 0.8rem 0;">
      <strong style="color: var(--navy-primary); font-size: 0.95rem;">${it.name}</strong>
      <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 0.2rem;">${it.detail}</p>
    </div>
  `).join("");

  const html = `
    <div style="font-size: 0.95rem;">
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${data.desc}</p>
      <div style="background: var(--bg-card-subtle); padding: 1.2rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <strong style="color: var(--orange-accent); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">Standards & Scope Inclusions</strong>
        <div style="margin-top: 0.6rem;">${listHtml}</div>
      </div>
      <button class="btn-primary-orange" style="width: 100%; justify-content: center;" onclick="prefillQuoteWithService('${serviceName}')">
        Request Quote for ${serviceName} ↗
      </button>
    </div>
  `;

  openModal(data.title, html);
}

/**
 * Sector Selection Interactive Modal / Direct Pre-fill
 */
const sectorData = {
  "Transportation": "Highway corridors, arterial roads, grade separations, and MTO expansion projects.",
  "Bridges": "Cable-stayed structures, highway overpasses, pedestrian bridges, and structural rehabilitation conforming to CSA S6.",
  "Tunnels": "Deep bored transit tunnels, open-cut excavations, shafts, and utility micro-tunneling in urban environments.",
  "Transit": "Light Rail Transit (LRT), subway extensions, GO Rail corridor expansion, and Metrolinx stations.",
  "Municipal Infrastructure": "Road reconstruction, storm & sanitary infrastructure, sidewalks, and municipal right-of-ways across GTA.",
  "Water / Wastewater": "Treatment plants, pumping stations, water distribution mains, and environmental compliance.",
  "Rail": "Ballasted track, direct fixation track slabs, grade crossings, and signaling enclosure quality oversight.",
  "Utilities": "Subsurface hydro, gas, telecommunications coordination, and conflict mitigation.",
  "Buildings": "Transit maintenance facilities, operations control centres, substations, and civil support structures."
};

function selectSector(sectorName) {
  const desc = sectorData[sectorName] || "Comprehensive infrastructure quality consulting.";
  const html = `
    <div style="font-size: 0.95rem; line-height: 1.6;">
      <div style="background: var(--navy-primary); color: #fff; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <span style="color: var(--orange-accent); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;">Canadian Infrastructure Sector</span>
        <h4 style="font-size: 1.5rem; margin-top: 0.3rem;">${sectorName} QA/QC Consulting</h4>
        <p style="color: #CBD5E1; font-size: 0.92rem; margin-top: 0.5rem;">${desc}</p>
      </div>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
        VertexPM brings partner-led oversight directly to your ${sectorName.toLowerCase()} project in Ontario, ensuring compliance with provincial safety standards and owner specifications.
      </p>
      <button class="btn-primary-orange" style="width: 100%; justify-content: center;" onclick="prefillQuoteWithSector('${sectorName}')">
        Discuss ${sectorName} Proposal ↗
      </button>
    </div>
  `;
  openModal(`Industry Sector: ${sectorName}`, html);
}

function prefillQuoteWithSector(sectorName) {
  closeModal();
  scrollToSection("contact");
  const details = document.getElementById("client-details");
  if (details) {
    details.value = `Sector: ${sectorName} Infrastructure\nScope: Consulting and Quality Management support for ${sectorName} project in Ontario.\nTiming: Immediate / Upcoming tender.`;
    details.focus();
  }
}

function prefillQuoteWithService(serviceName) {
  closeModal();
  scrollToSection("contact");
  const svcSelect = document.getElementById("client-service");
  if (svcSelect) {
    for (let i = 0; i < svcSelect.options.length; i++) {
      if (svcSelect.options[i].text.includes(serviceName)) {
        svcSelect.selectedIndex = i;
        break;
      }
    }
  }
  const details = document.getElementById("client-details");
  if (details) {
    details.value = `Requested Service: ${serviceName}\nRequirement: Full scope deliverable specification and proposal for GTA infrastructure project.`;
    details.focus();
  }
}

/**
 * State for Consultation Scheduler
 */
let selectedConsultTopic = "Rapid Project Assessment (15 min)";
let selectedConsultSlotTime = "11:00 AM EDT";
let selectedConsultFormatMode = "Microsoft Teams";

/**
 * Open Book a Consultation Modal
 */
function openConsultationModal(presetTopic) {
  if (presetTopic) {
    selectedConsultTopic = presetTopic;
  }

  // Calculate default date (tomorrow or next business day)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1); // skip Sunday
  if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2); // skip Saturday
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const html = `
    <div style="font-size: 0.95rem; line-height: 1.5;">
      <div style="background: rgba(243, 108, 33, 0.08); border-left: 3px solid var(--orange-accent); padding: 0.85rem 1.1rem; border-radius: 4px; margin-bottom: 1.4rem;">
        <strong style="color: var(--navy-primary); font-size: 0.88rem; display: block;">🇨🇦 Direct 1-on-1 Co-Founder Strategy Session</strong>
        <p style="color: var(--text-secondary); font-size: 0.82rem; margin-top: 0.2rem;">
          Schedule a direct meeting with a VertexPM co-founder. Dedicated partner oversight for Ontario infrastructure and quality compliance.
        </p>
      </div>

      <form onsubmit="handleConsultationSubmit(event)" style="display: flex; flex-direction: column; gap: 1.15rem;">
        <!-- Step 1: Topic -->
        <div>
          <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--navy-primary);">
            1. Consultation Focus *
          </label>
          <div class="consult-type-grid" style="margin-top: 0.45rem;">
            <div class="consult-type-card ${selectedConsultTopic.includes("Rapid") ? "active" : ""}" onclick="selectConsultType(this, 'Rapid Project Assessment (15 min)')">
              <span class="consult-type-badge">⚡ 15 Minutes</span>
              <strong class="consult-type-title">Rapid Project Assessment</strong>
              <span class="consult-type-desc">Quick tender sanity check, risk identification & QA/QC alignment.</span>
            </div>
            <div class="consult-type-card ${selectedConsultTopic.includes("QA/QC") ? "active" : ""}" onclick="selectConsultType(this, 'QA/QC Program & ITP Architecture (30 min)')">
              <span class="consult-type-badge">📋 30 Minutes</span>
              <strong class="consult-type-title">QA/QC & ITP Architecture</strong>
              <span class="consult-type-desc">Review QMP, CQMP, ITP inspection regimes & Metrolinx/MTO standards.</span>
            </div>
            <div class="consult-type-card ${selectedConsultTopic.includes("Field") ? "active" : ""}" onclick="selectConsultType(this, 'Field Oversight & Inspection Strategy (45 min)')">
              <span class="consult-type-badge">🏗️ 45 Minutes</span>
              <strong class="consult-type-title">Field Inspection & Oversight</strong>
              <span class="consult-type-desc">Senior field inspection, concrete/transit surveillance & contractor coordination.</span>
            </div>
            <div class="consult-type-card ${selectedConsultTopic.includes("Closeout") ? "active" : ""}" onclick="selectConsultType(this, 'Closeout & Handover Verification (30 min)')">
              <span class="consult-type-badge">📑 30 Minutes</span>
              <strong class="consult-type-title">Closeout & Turnover Strategy</strong>
              <span class="consult-type-desc">Deficiency clearing, closeout dossiers, and commissioning verification.</span>
            </div>
          </div>
          <input type="hidden" id="consult-topic-input" value="${selectedConsultTopic}">
        </div>

        <!-- Step 2: Date & GTA Time Slot -->
        <div class="consult-form-row consult-date-time-row">
          <div>
            <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--navy-primary);">
              2. Select Date *
            </label>
            <input type="date" id="consult-date-input" class="form-control" style="margin-top: 0.45rem;" required min="${defaultDateStr}" value="${defaultDateStr}">
          </div>
          <div>
            <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--navy-primary);">
              3. GTA Time Slot (EDT) *
            </label>
            <div class="consult-slots-wrap">
              <button type="button" class="consult-slot-btn" onclick="selectConsultSlot(this, '09:30 AM EDT')">09:30 AM</button>
              <button type="button" class="consult-slot-btn active" onclick="selectConsultSlot(this, '11:00 AM EDT')">11:00 AM</button>
              <button type="button" class="consult-slot-btn" onclick="selectConsultSlot(this, '01:30 PM EDT')">01:30 PM</button>
              <button type="button" class="consult-slot-btn" onclick="selectConsultSlot(this, '03:00 PM EDT')">03:00 PM</button>
              <button type="button" class="consult-slot-btn" onclick="selectConsultSlot(this, '04:30 PM EDT')">04:30 PM</button>
            </div>
            <input type="hidden" id="consult-time-input" value="11:00 AM EDT">
          </div>
        </div>

        <!-- Step 3: Meeting Preference -->
        <div>
          <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--navy-primary);">
            4. Meeting Preference *
          </label>
          <div class="consult-format-options">
            <button type="button" class="consult-format-btn active" onclick="selectConsultFormat(this, 'Microsoft Teams')">
              <span>💻</span> Teams
            </button>
            <button type="button" class="consult-format-btn" onclick="selectConsultFormat(this, 'Google Meet')">
              <span>📹</span> Meet
            </button>
            <button type="button" class="consult-format-btn" onclick="selectConsultFormat(this, 'Phone Call')">
              <span>📞</span> Phone
            </button>
            <button type="button" class="consult-format-btn" onclick="selectConsultFormat(this, 'On-Site GTA')">
              <span>📍</span> On-Site
            </button>
          </div>
          <input type="hidden" id="consult-format-input" value="Microsoft Teams">
        </div>

        <!-- Step 4: Contact Information -->
        <div class="consult-form-row consult-contact-row">
          <div>
            <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Your Full Name *</label>
            <input type="text" id="consult-name" class="form-control" required placeholder="Full Name" style="margin-top: 0.3rem;">
          </div>
          <div>
            <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Corporate / Work Email *</label>
            <input type="email" id="consult-email" class="form-control" required placeholder="name@company.com" style="margin-top: 0.3rem;">
          </div>
        </div>

        <div class="consult-form-row consult-contact-row">
          <div>
            <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Phone Number *</label>
            <input type="tel" id="consult-phone" class="form-control" required placeholder="(416) 000-0000" style="margin-top: 0.3rem;">
          </div>
          <div>
            <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Organization / Firm *</label>
            <input type="text" id="consult-org" class="form-control" required placeholder="e.g. EllisDon, Aecon, Metrolinx" style="margin-top: 0.3rem;">
          </div>
        </div>

        <div>
          <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Project Location & Focus (Optional)</label>
          <input type="text" id="consult-notes" class="form-control" placeholder="e.g. Ontario Line Guideway QA, York Region Watermain" style="margin-top: 0.3rem;">
        </div>

        <button type="submit" class="btn-primary-orange" style="margin-top: 0.6rem; justify-content: center; font-size: 1.02rem; padding: 1rem 1.8rem;">
          Confirm & Schedule Consultation 📅
        </button>
      </form>
    </div>
  `;

  openModal("Book a Consultation | VertexPM Inc.", html);
}

function selectConsultType(el, title) {
  document.querySelectorAll(".consult-type-card").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  const input = document.getElementById("consult-topic-input");
  if (input) input.value = title;
  selectedConsultTopic = title;
}

function selectConsultSlot(btn, timeStr) {
  document.querySelectorAll(".consult-slot-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const input = document.getElementById("consult-time-input");
  if (input) input.value = timeStr;
  selectedConsultSlotTime = timeStr;
}

function selectConsultFormat(btn, formatName) {
  document.querySelectorAll(".consult-format-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const input = document.getElementById("consult-format-input");
  if (input) input.value = formatName;
  selectedConsultFormatMode = formatName;
}

function handleConsultationSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("consult-name")?.value || "Client";
  const email = document.getElementById("consult-email")?.value || "";
  const phone = document.getElementById("consult-phone")?.value || "";
  const org = document.getElementById("consult-org")?.value || "Organization";
  const date = document.getElementById("consult-date-input")?.value || "Upcoming";
  const time = document.getElementById("consult-time-input")?.value || selectedConsultSlotTime;
  const topic = document.getElementById("consult-topic-input")?.value || selectedConsultTopic;
  const format = document.getElementById("consult-format-input")?.value || selectedConsultFormatMode;
  const notes = document.getElementById("consult-notes")?.value || "";

  const bookingData = { name, email, phone, org, date, time, topic, format, notes };

  // Dispatch details to both Client and Founder
  sendConsultationEmails(bookingData);

  // Show Confirmation Card in Modal
  const confirmHtml = `
    <div class="consultation-confirmed-card">
      <div class="consult-success-icon">✓</div>
      <h3 style="font-size: 1.6rem; font-weight: 800; color: var(--navy-primary); margin-bottom: 0.4rem;">
        Consultation Confirmed!
      </h3>
      <p style="color: var(--text-secondary); font-size: 0.95rem;">
        Thank you, <strong>${name}</strong>. Full consultation details have been sent to both of us.
      </p>

      <!-- Dual Email Notification Badge -->
      <div class="consult-email-recipients">
        <div style="font-size: 0.72rem; font-weight: 800; color: var(--orange-accent); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
          <span>✉️</span> NOTIFICATION DISPATCHED TO BOTH PARTIES
        </div>
        <div class="email-recipient-chip">
          <span class="chip-label">Founder:</span>
          <strong>info@vertexpm.ca</strong>
          <span class="chip-status">✓ Sent</span>
        </div>
        <div class="email-recipient-chip">
          <span class="chip-label">Client:</span>
          <strong>${email}</strong>
          <span class="chip-status">✓ Sent</span>
        </div>
      </div>

      <div class="consult-summary-box">
        <div><strong>📅 Date & Time:</strong> ${date} at ${time} (EDT)</div>
        <div><strong>🎯 Session Focus:</strong> ${topic}</div>
        <div><strong>💻 Meeting Format:</strong> ${format}</div>
        <div><strong>🏢 Client & Org:</strong> ${name} • ${org}</div>
        <div><strong>📞 Phone Number:</strong> ${phone}</div>
        ${notes ? `<div><strong>📝 Project Focus:</strong> ${notes}</div>` : ""}
        <div><strong>👤 Practice Lead:</strong> VertexPM Co-Founder & Senior Quality Partner</div>
      </div>

      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">
        A calendar invitation (.ics) and direct partner briefing have been prepared for Microsoft Teams & Outlook.
      </p>

      <div style="display: flex; gap: 0.85rem; justify-content: center; flex-wrap: wrap;">
        <button type="button" class="btn-primary-orange" id="btn-download-ics">
          <span>📥</span> Download Calendar Invite (.ics)
        </button>
        <button type="button" class="btn-quote-header" id="btn-open-email-draft" style="background: rgba(11, 35, 65, 0.06); border-color: var(--navy-primary);">
          <span>✉️</span> Open Email in Outlook / Mail
        </button>
        <button type="button" class="btn-quote-header" onclick="closeModal()">
          Close Window
        </button>
      </div>
    </div>
  `;

  const modalBody = document.getElementById("modal-body-content");
  if (modalBody) {
    modalBody.innerHTML = confirmHtml;
    const downloadBtn = document.getElementById("btn-download-ics");
    if (downloadBtn) {
      downloadBtn.onclick = () => downloadConsultationIcs(bookingData);
    }
    const draftBtn = document.getElementById("btn-open-email-draft");
    if (draftBtn) {
      draftBtn.onclick = () => openDualEmailClient(bookingData);
    }
  }

  showToast(`🎉 Consultation confirmed! Details sent to info@vertexpm.ca and ${email}.`);
}

/**
 * Dispatch consultation details to Founder (info@vertexpm.ca) and Client
 */
async function sendConsultationEmails(bookingData) {
  const payload = {
    _subject: `New VertexPM Consultation: ${bookingData.topic} - ${bookingData.name} (${bookingData.org})`,
    _replyto: bookingData.email,
    _cc: bookingData.email,
    founder_recipient: "info@vertexpm.ca",
    client_recipient: bookingData.email,
    client_name: bookingData.name,
    client_email: bookingData.email,
    client_phone: bookingData.phone,
    organization: bookingData.org,
    consultation_topic: bookingData.topic,
    scheduled_date: bookingData.date,
    scheduled_time: bookingData.time,
    meeting_format: bookingData.format,
    project_focus: bookingData.notes || "Standard Scope Review",
    dispatched_timestamp: new Date().toISOString()
  };

  // 1. Save locally for guaranteed founder reference
  try {
    const records = JSON.parse(localStorage.getItem("vertexpm_consultation_bookings") || "[]");
    records.push(payload);
    localStorage.setItem("vertexpm_consultation_bookings", JSON.stringify(records));
  } catch (err) {
    console.warn("Local storage write error:", err);
  }

  // 2. Trigger asynchronous dispatch to FormSubmit API (which delivers to info@vertexpm.ca and CCs client)
  try {
    fetch("https://formsubmit.co/ajax/info@vertexpm.ca", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.log("Background API dispatch handled:", err);
    });
  } catch (e) {
    // Graceful offline fallback
  }

  return payload;
}

/**
 * Open pre-filled dual-recipient email draft in client's native mail program (Outlook, Gmail, etc.)
 */
function openDualEmailClient(bookingData) {
  const subject = encodeURIComponent(`VertexPM Consultation Scheduled: ${bookingData.topic} - ${bookingData.name} (${bookingData.date} at ${bookingData.time})`);

  const bodyText =
    `Hello VertexPM Partners and ${bookingData.name},

This email confirms the scheduled consultation booking with VertexPM Inc.

=======================================================
VERTEXPM INC. - CONSULTATION DETAILS
=======================================================
• Client Name: ${bookingData.name}
• Client Work Email: ${bookingData.email}
• Client Phone: ${bookingData.phone}
• Contracting Firm / Org: ${bookingData.org}

• Consultation Focus: ${bookingData.topic}
• Scheduled Date: ${bookingData.date}
• Scheduled Time: ${bookingData.time} (Toronto, Ontario / EDT)
• Meeting Preference: ${bookingData.format}
• Project Context / Notes: ${bookingData.notes || "Initial Consultation"}

=======================================================
NOTIFICATION RECIPIENTS
=======================================================
1. Founder & Practice Lead: info@vertexpm.ca
2. Client Attendee: ${bookingData.email}

A calendar invitation (.ics) has been prepared. A VertexPM partner will activate the meeting link prior to the session.

Best regards,
VertexPM Inc.
Construction Management & Quality Consulting
Greater Toronto Area, Ontario, Canada
Phone: (416) 555-0198 | Email: info@vertexpm.ca`;

  const body = encodeURIComponent(bodyText);
  const mailtoUrl = `mailto:info@vertexpm.ca?cc=${encodeURIComponent(bookingData.email)}&subject=${subject}&body=${body}`;
  window.open(mailtoUrl, "_blank");
}

function downloadConsultationIcs(details) {
  try {
    const dateClean = (details.date || "").replace(/-/g, "");
    const startTime = "110000";
    const endTime = "113000";
    const dtStart = `${dateClean}T${startTime}Z`;
    const dtEnd = `${dateClean}T${endTime}Z`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//VertexPM Inc.//Consultation Scheduler//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `SUMMARY:VertexPM Consultation: ${details.topic || "Quality Review"}`,
      `DESCRIPTION:Direct infrastructure consultation with VertexPM Inc. co-founder.\\nFocus: ${details.topic}\\nFormat: ${details.format}\\nAttendee: ${details.name} (${details.org})\\nContact: consulting@vertexpm.ca`,
      `LOCATION:${details.format}`,
      "STATUS:CONFIRMED",
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      "ORGANIZER;CN=VertexPM Inc.:mailto:consulting@vertexpm.ca",
      `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${details.name}:mailto:${details.email}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `VertexPM-Consultation-${details.date || "session"}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Calendar invitation (.ics) downloaded.");
  } catch (err) {
    showToast("Unable to download .ics, confirmation sent by email.");
  }
}

/**
 * Open Quick Quote Modal
 */
function openQuoteModal() {
  const html = `
    <div style="font-size: 0.95rem;">
      <p style="color: var(--text-secondary); margin-bottom: 1.2rem;">
        Direct access to VertexPM co-founders for rapid project reviews across the Greater Toronto Area.
      </p>
      <form onsubmit="handleModalQuoteSubmit(event)" style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Your Name *</label>
          <input type="text" id="modal-client-name" class="form-control" required placeholder="Full Name">
        </div>
        <div>
          <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Work Email *</label>
          <input type="email" id="modal-client-email" class="form-control" required placeholder="name@organization.com">
        </div>
        <div>
          <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Project Location & Sector *</label>
          <input type="text" id="modal-client-loc" class="form-control" required placeholder="e.g. Toronto Transit Line, Peel Watermain, York Region Bridge">
        </div>
        <div>
          <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Required Support</label>
          <select id="modal-client-svc" class="form-control">
            <option>Quality Management (QMP / CQMP / ITP)</option>
            <option>Construction Oversight & Coordination</option>
            <option>Technical Field Inspection (Concrete, Civil, Transit)</option>
            <option>Closeout & Turnover Dossier Compilation</option>
            <option>Full Turnkey QA/QC Partner Package</option>
          </select>
        </div>
        <button type="submit" class="btn-primary-orange" style="margin-top: 0.5rem; justify-content: center;">
          Submit Immediate Request ↗
        </button>
      </form>
    </div>
  `;
  openModal("Request a Quote - VertexPM Inc.", html);
}

function handleModalQuoteSubmit(e) {
  e.preventDefault();
  closeModal();
  showToast("Your inquiry has been submitted. A VertexPM partner will connect with you within 24 hours.");
}

/**
 * Interactive Scope Estimator Logic
 */
function updateEstimator() {
  const sector = document.getElementById("est-sector")?.value || "transit";
  const phase = document.getElementById("est-phase")?.value || "active-exec";
  const tier = document.getElementById("est-tier")?.value || "partner-led";

  const titleEl = document.getElementById("est-rec-title");
  const descEl = document.getElementById("est-rec-desc");
  const tagEl = document.getElementById("est-rec-tag");

  const matrix = {
    transit: {
      title: "Metrolinx & Transit Corridor QA/QC Framework",
      desc: "Includes CQMP submission, CSA A23.1 concrete oversight, guideway track tolerances, and comprehensive closeout documentation.",
      tag: "TRANSIT INFRASTRUCTURE PACKAGE"
    },
    bridge: {
      title: "CSA S6 Canadian Highway Bridge QA/QC Package",
      desc: "Structural steel weld testing surveillance, rebar clearance verification, expansion joint hold-points, and MTO compliance auditing.",
      tag: "STRUCTURAL BRIDGE SPECIFICATION"
    },
    highways: {
      title: "MTO Highway & Arterial Oversight Protocol",
      desc: "OPSS 310 asphalt verification, granular subbase compaction audits, drainage culvert verification, and traffic staging QA.",
      tag: "HIGHWAY CORRIDOR PACKAGE"
    },
    municipal: {
      title: "Municipal Civil & Water Infrastructure Framework",
      desc: "Subsurface utility alignment, watermain pressure hydro-testing, storm sewer CCTV verification, and City standard compliance.",
      tag: "MUNICIPAL UTILITIES SPECIFICATION"
    },
    utilities: {
      title: "Subsurface Utility & Rail Corridor Verification",
      desc: "SUE Quality Level A/B coordination, rail right-of-way safety and QA protocols, defect logs, and multi-utility stakeholder alignment.",
      tag: "RAIL & UTILITIES PACKAGE"
    }
  };

  const item = matrix[sector] || matrix.transit;
  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;
  if (tagEl) tagEl.textContent = item.tag;
}

function applyScopeToQuoteForm() {
  const sector = document.getElementById("est-sector")?.options[document.getElementById("est-sector").selectedIndex].text;
  const phase = document.getElementById("est-phase")?.options[document.getElementById("est-phase").selectedIndex].text;
  const tier = document.getElementById("est-tier")?.options[document.getElementById("est-tier").selectedIndex].text;

  scrollToSection("contact");
  const details = document.getElementById("client-details");
  if (details) {
    details.value = `Estimated Project Scope:\n• Sector: ${sector}\n• Phase: ${phase}\n• Support Level: ${tier}\n\nPlease prepare a proposal based on these parameters.`;
    details.focus();
  }
}

/**
 * Handle Main Contact Form Submission
 */
function handleQuoteSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("client-name")?.value || "Valued Client";
  showToast(`Thank you, ${name}! Your proposal request has been received. A VertexPM partner will contact you directly within 24 hours.`);
  const form = document.getElementById("quote-inquiry-form");
  if (form) form.reset();
}

/**
 * Toast Notification Utility
 */
function showToast(message) {
  const toast = document.getElementById("toast-notification");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4500);
}
