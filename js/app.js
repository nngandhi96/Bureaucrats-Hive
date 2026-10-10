/**
 * Bureaucrats Hive - Core Application Logic
 */

/* ==========================================================================
   SMRITI SHAH STYLE CART & CATALOG LOGIC (IMMEDIATE GLOBAL AVAILABILITY)
   ========================================================================== */

let cartItems = [];

window.openCart = function() {
  const overlay = document.getElementById('cartOverlay');
  if (overlay) {
    overlay.classList.add('open');
    renderCart();
  }
};

window.closeCart = function() {
  const overlay = document.getElementById('cartOverlay');
  if (overlay) {
    overlay.classList.remove('open');
  }
};

window.addToCart = function(id, title, price, subtitle) {
  const existing = cartItems.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({
      id: id,
      title: title,
      price: price,
      subtitle: subtitle || 'Bureaucrats Hive',
      qty: 1
    });
  }
  updateCartBadge();
  window.openCart();
  if (typeof window.showToast === 'function') {
    window.showToast(`${title} added to cart!`, 'success');
  }
};

window.changeQty = function(id, delta) {
  const item = cartItems.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cartItems = cartItems.filter(i => i.id !== id);
    }
  }
  updateCartBadge();
  renderCart();
};

function updateCartBadge() {
  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalCount;
  });
}

function renderCart() {
  const container = document.getElementById('cartDrawerBody');
  const subtotalEl = document.getElementById('cartSubtotal');
  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon">🛒</div>
        <h4>Your cart is empty</h4>
        <p style="font-size:13px; margin-top:6px;">Explore our UPSC &amp; BPSC mentorship courses and modules to add items.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '₹0';
    return;
  }

  let subtotal = 0;
  container.innerHTML = cartItems.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    return `
      <div class="cart-drawer-item">
        <div class="cart-item-thumb">📖</div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
          <div class="cart-qty-row">
            <button class="cart-qty-btn" onclick="changeQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button class="cart-qty-btn" onclick="changeQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div style="font-weight:700; color:var(--ink); font-size:14px; margin-left:auto;">
          ₹${itemTotal.toLocaleString('en-IN')}
        </div>
      </div>
    `;
  }).join('');

  if (subtotalEl) {
    subtotalEl.textContent = '₹' + subtotal.toLocaleString('en-IN');
  }
}

window.checkoutFromCart = function() {
  if (cartItems.length === 0) {
    if (typeof window.showToast === 'function') {
      window.showToast('Your cart is empty! Please add a course or module.', 'gold');
    }
    return;
  }
  window.closeCart();
  const firstCourse = cartItems[0];
  if (typeof window.openCheckoutModal === 'function') {
    window.openCheckoutModal(firstCourse.id);
  } else {
    window.location.hash = '#pricing';
    if (typeof window.showToast === 'function') {
      window.showToast('Proceeding to fee structure & checkout...', 'success');
    }
  }
};

/* Instant Search Filter for Courses & Notes */
window.filterItems = function(query) {
  const q = (query || '').toLowerCase().trim();
  const allCards = document.querySelectorAll('.item-card');
  let matchedCount = 0;

  allCards.forEach(card => {
    const title = (card.querySelector('.item-title')?.textContent || '').toLowerCase();
    const faculty = (card.querySelector('.item-faculty')?.textContent || '').toLowerCase();
    const desc = (card.querySelector('.item-features-list')?.textContent || '').toLowerCase();
    
    if (!q || title.includes(q) || faculty.includes(q) || desc.includes(q)) {
      card.style.display = 'flex';
      matchedCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const countBadge = document.getElementById('searchCountResult');
  if (countBadge) {
    countBadge.textContent = q ? `(${matchedCount} matching)` : '';
  }
};

/* Sample Preview Trigger */
window.openSampleModal = function(title) {
  if (typeof window.showToast === 'function') {
    window.showToast(`Opening sample syllabus & preview for: ${title}`, 'success');
  }
  const modal = document.getElementById('leadCaptureModal');
  if (modal) {
    const titleEl = modal.querySelector('.modal-title');
    if (titleEl) titleEl.textContent = `Download Sample: ${title}`;
    modal.classList.add('open');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initStrategyCalculator();
  initSmoothScroll();
});

/* 1. Header scroll and mobile menu */
function initNavbar() {
  const header = document.querySelector('.site-header') || document.querySelector('.navbar-edtech');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-drawer .nav-link, .mobile-drawer .btn');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (!header) return;
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

/* 6. Student LMS Authentication Modal & Session Engine */
window.openAuthModal = function() {
  // If already logged in, redirect directly to portal or offer portal
  const isLoggedIn = localStorage.getItem('bh_student_logged_in') === 'true';
  if (isLoggedIn) {
    if (typeof window.showToast === 'function') {
      window.showToast('Redirecting to your active Student Portal session...', 'success');
    }
    setTimeout(() => {
      window.location.href = 'portal.html';
    }, 600);
    return;
  }

  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const emailInput = document.getElementById('authStudentId');
    if (emailInput) {
      setTimeout(() => emailInput.focus(), 150);
    }
  } else {
    // If modal element is not present on current page, redirect to login.html
    window.location.href = 'login.html';
  }
};

window.closeAuthModal = function() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.switchAuthTab = function(mode) {
  const pwdTab = document.getElementById('authTabPwd');
  const otpTab = document.getElementById('authTabOtp');
  const pwdForm = document.getElementById('authFormPwd');
  const otpForm = document.getElementById('authFormOtp');

  if (mode === 'pwd') {
    if (pwdTab) pwdTab.classList.add('active');
    if (otpTab) otpTab.classList.remove('active');
    if (pwdForm) pwdForm.style.display = 'block';
    if (otpForm) otpForm.style.display = 'none';
  } else {
    if (otpTab) otpTab.classList.add('active');
    if (pwdTab) pwdTab.classList.remove('active');
    if (otpForm) otpForm.style.display = 'block';
    if (pwdForm) pwdForm.style.display = 'none';
  }
};

window.toggleAuthPassword = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
};

window.handleAuthPasswordSubmit = function(e) {
  if (e) e.preventDefault();
  const idInput = document.getElementById('authStudentId');
  const pwdInput = document.getElementById('authPassword');
  const valId = idInput ? idInput.value.trim() : '';
  const valPwd = pwdInput ? pwdInput.value : '';

  if (!valId) {
    window.showToast('Please enter your Student ID or Registered Email.', 'gold');
    if (idInput) idInput.focus();
    return false;
  }
  if (!valPwd) {
    window.showToast('Please enter your portal password.', 'gold');
    if (pwdInput) pwdInput.focus();
    return false;
  }

  // Create or persist mock student profile
  const studentData = {
    name: valId.includes('@') ? valId.split('@')[0].replace(/[._]/g, ' ') : valId,
    id: valId.toUpperCase().startsWith('BH-') ? valId.toUpperCase() : 'BH-2026-0842',
    email: valId.includes('@') ? valId : 'student@bureaucratshive.com',
    batch: 'UPSC CSE 2026 Comprehensive Mentorship',
    mentor: 'Er. Aftab & Er. Nandan',
    streak: 14,
    avatar: 'BH'
  };

  // Capitalize name
  studentData.name = studentData.name.charAt(0).toUpperCase() + studentData.name.slice(1);

  localStorage.setItem('bh_student_logged_in', 'true');
  localStorage.setItem('bh_student_data', JSON.stringify(studentData));

  const btn = document.getElementById('authSubmitBtn');
  if (btn) {
    btn.innerHTML = `<span>Signing In...</span> <svg class="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>`;
    btn.disabled = true;
  }

  window.showToast(`Welcome back, ${studentData.name}! Opening Student Portal...`, 'success');

  setTimeout(() => {
    window.location.href = 'portal.html';
  }, 750);

  return false;
};

window.sendAuthOtp = function() {
  const phoneInput = document.getElementById('authOtpPhone');
  const phone = phoneInput ? phoneInput.value.trim() : '';
  if (!phone || phone.length < 10) {
    window.showToast('Please enter a valid 10-digit mobile number.', 'gold');
    if (phoneInput) phoneInput.focus();
    return;
  }

  const otpGroup = document.getElementById('authOtpCodeGroup');
  if (otpGroup) {
    otpGroup.style.display = 'block';
  }
  const otpInput = document.getElementById('authOtpCode');
  if (otpInput) {
    otpInput.value = '7429'; // Simulated OTP for testing
    setTimeout(() => otpInput.focus(), 100);
  }

  window.showToast(`OTP 7429 sent to +91 ${phone} via WhatsApp & SMS.`, 'success');
};

window.handleAuthOtpSubmit = function(e) {
  if (e) e.preventDefault();
  const phoneInput = document.getElementById('authOtpPhone');
  const otpInput = document.getElementById('authOtpCode');
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const otp = otpInput ? otpInput.value.trim() : '';

  if (!phone || phone.length < 10) {
    window.showToast('Please enter your 10-digit mobile number.', 'gold');
    return false;
  }
  if (!otp || otp.length < 4) {
    window.showToast('Please enter the 4-digit OTP sent to your phone.', 'gold');
    return false;
  }

  const studentData = {
    name: 'Aspirant ' + phone.slice(-4),
    id: 'BH-2026-OTP' + phone.slice(-4),
    email: phone + '@bureaucratshive.com',
    batch: '71st BPSC Super-30 Integrated Cohort',
    mentor: 'Er. Aftab & Er. Nandan',
    streak: 12,
    avatar: 'BH'
  };

  localStorage.setItem('bh_student_logged_in', 'true');
  localStorage.setItem('bh_student_data', JSON.stringify(studentData));

  window.showToast('Mobile verified successfully! Opening Student Portal...', 'success');

  setTimeout(() => {
    window.location.href = 'portal.html';
  }, 700);

  return false;
};

window.quickDemoLogin = function() {
  const demoStudent = {
    name: 'Priya Sharma',
    id: 'BH-2026-0842',
    email: 'priya.sharma@bureaucratshive.com',
    batch: 'UPSC CSE 2026 Comprehensive Mentorship',
    mentor: 'Er. Aftab & Er. Nandan',
    streak: 14,
    avatar: 'PS'
  };

  localStorage.setItem('bh_student_logged_in', 'true');
  localStorage.setItem('bh_student_data', JSON.stringify(demoStudent));

  if (typeof window.showToast === 'function') {
    window.showToast('Logged in as Demo Student (Priya Sharma). Loading dashboard...', 'success');
  }

  setTimeout(() => {
    window.location.href = 'portal.html';
  }, 600);
};

// Global escape key listener for auth modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeAuthModal();
  }
});
