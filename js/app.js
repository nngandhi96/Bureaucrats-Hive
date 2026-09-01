/**
 * Bureaucrats Hive - Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initStrategyCalculator();
  initSmoothScroll();
});

/* 1. Header scroll and mobile menu */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-drawer .nav-link, .mobile-drawer .btn');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.innerHTML = isOpen 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }
}

/* 2. FAQ Accordion */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerPanel = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answerPanel.style.maxHeight = null;
      }
    });
  });

  // Open first item by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    const firstAnswer = faqItems[0].querySelector('.faq-answer');
    if (firstAnswer) firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
  }
}

/* 3. Hero Quick Assessment / Strategy Calculator */
function initStrategyCalculator() {
  const examBtns = document.querySelectorAll('.exam-selector-btn');
  const stageBtns = document.querySelectorAll('.stage-selector-btn');
  
  let selectedExam = 'UPSC CSE';
  let selectedStage = 'Beginner';

  const roadmapDetails = {
    'UPSC CSE_Beginner': {
      duration: '12 Months (3-Phase Cycle)',
      mocks: '35 Prelims + 20 Mains Mocks',
      answers: '250+ Evaluated Questions',
      focus: 'NCERT Foundation + Core GS 1-4 + CSAT Foundation'
    },
    'UPSC CSE_Prelims Ready': {
      duration: '8 Months Intensive',
      mocks: '45 Prelims + 25 Mains Mocks',
      answers: '350+ Evaluated Questions',
      focus: 'PYQ Micro-Theme Drills + Mains Framework Structuring'
    },
    'UPSC CSE_Mains Focused': {
      duration: '6 Months Mastery',
      mocks: '30 Advanced Mains Tests + Essay',
      answers: '500+ Daily Answer Feedback',
      focus: 'Value Addition, Bihar/National Current Affairs & Case Studies'
    },
    'BPSC_Beginner': {
      duration: '10 Months Comprehensive',
      mocks: '25 Prelims + 16 Mains Mocks',
      answers: '200+ Bihar GS Questions',
      focus: 'Bihar Special History/Geo + GS 1-2 + Essay Paper'
    },
    'BPSC_Prelims Ready': {
      duration: '6 Months Fast-Track',
      mocks: '35 Sectional & Full Length Tests',
      answers: '280+ Evaluated Answers',
      focus: 'Current Affairs Patna/National + Mains GS 1 & GS 2 Data Drills'
    },
    'BPSC_Mains Focused': {
      duration: '4 Months Answer Intensive',
      mocks: '20 Strict Evaluated Mains Mocks',
      answers: '400+ High-Yield Questions',
      focus: 'Mains Model Synopsis + Time Management & Diagrammatic Notes'
    },
    'Both (UPSC & BPSC)_Beginner': {
      duration: '14 Months Dual Mastery',
      mocks: '50 Integrated Tests',
      answers: '450+ Daily Answers',
      focus: 'Combined GS Syllabus + Dedicated Bihar Special Modules'
    },
    'Both (UPSC & BPSC)_Prelims Ready': {
      duration: '9 Months Dual Track',
      mocks: '55 Prelims & Mains Tests',
      answers: '480+ Evaluated Answers',
      focus: 'Overlap Synergy Optimization + State Specific Deep-Dives'
    },
    'Both (UPSC & BPSC)_Mains Focused': {
      duration: '6 Months High-Gear',
      mocks: '40 Mains Simulations',
      answers: '600+ Model Answers',
      focus: 'Essay Drafting, Ethical Dimensions & Direct Mentor Calls'
    }
  };

  function updateRoadmapDisplay() {
    const key = `${selectedExam}_${selectedStage}`;
    const data = roadmapDetails[key] || roadmapDetails['UPSC CSE_Beginner'];

    const durationEl = document.getElementById('calcDuration');
    const mocksEl = document.getElementById('calcMocks');
    const answersEl = document.getElementById('calcAnswers');
    const focusEl = document.getElementById('calcFocus');

    if (durationEl) durationEl.textContent = data.duration;
    if (mocksEl) mocksEl.textContent = data.mocks;
    if (answersEl) answersEl.textContent = data.answers;
    if (focusEl) focusEl.textContent = data.focus;
  }

  examBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      examBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedExam = btn.getAttribute('data-exam');
      updateRoadmapDisplay();
    });
  });

  stageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stageBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedStage = btn.getAttribute('data-stage');
      updateRoadmapDisplay();
    });
  });

  updateRoadmapDisplay();
}

/* 4. Smooth Anchor Scrolling */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 85;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* 5. Global Toast Notification Helper */
window.showToast = function(message, type = 'gold') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  
  const iconSvg = type === 'success' 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C542" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};
