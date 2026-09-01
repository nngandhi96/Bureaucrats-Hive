/**
 * Bureaucrats Hive - Checkout & Enrollment Engine (Razorpay / Stripe Simulator)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPricingSwitch();
  initCheckoutFlow();
});

const COURSE_PLANS = {
  'upsc-comprehensive': {
    name: 'UPSC Comprehensive Mentorship',
    target: 'Prelims + Mains + 1-on-1 Mentorship + GS 1-4 & Essay',
    oneTimePrice: 24999,
    originalPrice: 34999,
    installmentPrice: 13500,
    validity: 'Till UPSC CSE Mains 2026',
    features: [
      'Dedicated 1-on-1 Officer/Ranker Mentor',
      'Daily 2 Questions Answer Writing & 48h SLA Review',
      '40 Prelims + 24 Mains Evaluated Mock Tests',
      'Weekly 1-on-1 Zoom Strategy Review Calls',
      'Ethics & Essay Value Addition Frameworks'
    ]
  },
  'bpsc-integrated': {
    name: 'BPSC Integrated Mentorship',
    target: '71st / 72nd BPSC CCE Prelims + Mains Intensive',
    oneTimePrice: 18499,
    originalPrice: 26999,
    installmentPrice: 9999,
    validity: 'Till BPSC Mains Exam Cycle',
    features: [
      'Bihar Special GS (History, Economy, Geography) Modules',
      'Daily Mains Answer Evaluation with Model Synopsis',
      '30 Prelims Sectional/Full Tests + 18 Mains Tests',
      'Direct WhatsApp Mentor Access for Doubt Clearing',
      'Bihar Economic Survey & Budget Micro-Notes'
    ]
  },
  'test-series-only': {
    name: 'Integrated Test Series + Evaluation Only',
    target: 'UPSC CSE & BPSC Mocks with Rubric Feedback',
    oneTimePrice: 9999,
    originalPrice: 14999,
    installmentPrice: 5500,
    validity: '12 Months Access',
    features: [
      '35 Prelims Tests with All-India Percentile Rank',
      '16 Mains Tests with Detailed Model Answers',
      'Question-by-Question Evaluation & Rubric Scores',
      'Performance Radar & Weak Area Heatmap'
    ]
  }
};

let currentBillingMode = 'onetime'; // 'onetime' | 'installment'

function initPricingSwitch() {
  const switchBtns = document.querySelectorAll('.pricing-switch-btn');
  const upscPrice = document.getElementById('priceUpsc');
  const bpscPrice = document.getElementById('priceBpsc');
  const testPrice = document.getElementById('priceTest');

  const upscNote = document.getElementById('noteUpsc');
  const bpscNote = document.getElementById('noteBpsc');
  const testNote = document.getElementById('noteTest');

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBillingMode = btn.getAttribute('data-billing');

      if (currentBillingMode === 'installment') {
        if (upscPrice) upscPrice.textContent = '13,500';
        if (bpscPrice) bpscPrice.textContent = '9,999';
        if (testPrice) testPrice.textContent = '5,500';

        if (upscNote) upscNote.textContent = 'Pay in 2 easy installments (₹13,500 x 2)';
        if (bpscNote) bpscNote.textContent = 'Pay in 2 easy installments (₹9,999 x 2)';
        if (testNote) testNote.textContent = 'Pay in 2 easy installments (₹5,500 x 2)';
      } else {
        if (upscPrice) upscPrice.textContent = '24,999';
        if (bpscPrice) bpscPrice.textContent = '18,499';
        if (testPrice) testPrice.textContent = '9,999';

        if (upscNote) upscNote.textContent = 'One-time investment • Save ₹10,000 today';
        if (bpscNote) bpscNote.textContent = 'One-time investment • Save ₹8,500 today';
        if (testNote) testNote.textContent = 'One-time investment • Full access package';
      }
    });
  });
}

function initCheckoutFlow() {
  const enrollBtns = document.querySelectorAll('.enroll-trigger-btn');
  enrollBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planId = btn.getAttribute('data-plan');
      openCheckoutModal(planId);
    });
  });
}

window.openCheckoutModal = function(planId = 'upsc-comprehensive') {
  const plan = COURSE_PLANS[planId] || COURSE_PLANS['upsc-comprehensive'];
  const price = currentBillingMode === 'installment' ? plan.installmentPrice : plan.oneTimePrice;
  const billingLabel = currentBillingMode === 'installment' ? 'Installment 1 of 2' : 'One-Time Full Access';

  let modal = document.getElementById('checkoutModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 560px;">
      <button class="modal-close-btn" onclick="document.getElementById('checkoutModal').classList.remove('open')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.5rem;">
        <img src="assets/emblem.svg" alt="Emblem" style="width: 44px; height: 44px;" />
        <div>
          <h3 style="font-size: 1.35rem; font-weight: 800;" class="gold-text">Secure Enrollment</h3>
          <p style="font-size: 0.8rem; color: var(--text-slate);">Bureaucrats Hive • Unit of Make My Vash</p>
        </div>
      </div>

      <!-- Plan Summary Card -->
      <div style="background: var(--bg-surface-elevated); border: 1.5px solid var(--gold-border); border-radius: var(--radius-sm); padding: 1.25rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <h4 style="color: var(--text-white); font-size: 1.05rem;">${plan.name}</h4>
            <p style="font-size: 0.8rem; color: var(--gold-light);">${plan.target}</p>
          </div>
          <span style="font-size: 0.75rem; background: var(--gold-muted); color: var(--gold-light); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); font-weight: 700;">
            ${billingLabel}
          </span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 0.85rem;">
          <span style="color: var(--text-slate); font-size: 0.9rem;">Total Payable Amount:</span>
          <span style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 900; color: var(--gold-light);">₹${price.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <!-- Aspirant Registration Info -->
      <form id="checkoutEnrollForm">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" id="chkName" class="form-control" placeholder="e.g., Ananya Sharma" required />
        </div>
        <div class="form-group">
          <label class="form-label">WhatsApp Number (For Batch Group &amp; Mentor Access)</label>
          <input type="tel" id="chkPhone" class="form-control" placeholder="10-digit mobile number" required />
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" id="chkEmail" class="form-control" placeholder="aspirant@gmail.com" required />
        </div>

        <!-- Payment Gateway Method Selector -->
        <div style="margin-bottom: 1.5rem;">
          <label class="form-label">Select Payment Gateway</label>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem;">
            <label style="background: var(--bg-surface-elevated); border: 1px solid var(--gold-primary); border-radius: var(--radius-sm); padding: 0.65rem 0.5rem; text-align: center; cursor: pointer; font-size: 0.85rem; font-weight: 700; color: var(--gold-light); display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
              <input type="radio" name="payMethod" value="razorpay" checked style="accent-color: var(--gold-primary);" />
              Razorpay
            </label>
            <label style="background: var(--bg-surface-elevated); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-sm); padding: 0.65rem 0.5rem; text-align: center; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: var(--text-slate); display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
              <input type="radio" name="payMethod" value="upi" style="accent-color: var(--gold-primary);" />
              UPI Instant
            </label>
            <label style="background: var(--bg-surface-elevated); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-sm); padding: 0.65rem 0.5rem; text-align: center; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: var(--text-slate); display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
              <input type="radio" name="payMethod" value="stripe" style="accent-color: var(--gold-primary);" />
              Cards/EMI
            </label>
          </div>
        </div>

        <button type="submit" class="btn btn-gold btn-lg" style="width: 100%;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          Pay ₹${price.toLocaleString('en-IN')} &amp; Activate Mentorship
        </button>
      </form>
    </div>
  `;

  modal.classList.add('open');

  const form = document.getElementById('checkoutEnrollForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('chkName').value;
    const phone = document.getElementById('chkPhone').value;
    const email = document.getElementById('chkEmail').value;

    modal.classList.remove('open');
    showReceiptModal(name, plan.name, price, email, phone);
  });
};

function showReceiptModal(name, planName, amount, email, phone) {
  let modal = document.getElementById('receiptModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'receiptModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const txId = 'BH-' + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 520px; text-align: center;">
      <button class="modal-close-btn" onclick="document.getElementById('receiptModal').classList.remove('open')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div style="width: 65px; height: 65px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid #10B981; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto; color: #10B981;">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>

      <h3 class="gold-text" style="font-size: 1.5rem; margin-bottom: 0.35rem;">Payment Successful!</h3>
      <p style="color: var(--text-slate); font-size: 0.9rem; margin-bottom: 1.5rem;">Welcome to the Bureaucrats Hive Mentorship Family.</p>

      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--gold-border); border-radius: var(--radius-sm); padding: 1.25rem; text-align: left; font-size: 0.88rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-slate);">Receipt #</span>
          <span style="color: var(--gold-light); font-weight: 700;">${txId}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-slate);">Aspirant Name:</span>
          <span style="color: var(--text-white); font-weight: 600;">${name}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-slate);">Enrolled Program:</span>
          <span style="color: var(--text-white); font-weight: 600;">${planName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-slate);">Amount Paid:</span>
          <span style="color: var(--gold-light); font-weight: 800;">₹${amount.toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-slate);">Date:</span>
          <span style="color: var(--text-slate);">${dateStr}</span>
        </div>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-slate); margin-bottom: 1.5rem;">
        Your Student Portal login credentials and personal mentor allocation details have been sent to <strong>${email}</strong> and WhatsApp.
      </p>

      <button class="btn btn-gold" style="width: 100%;" onclick="document.getElementById('receiptModal').classList.remove('open'); window.location.href='#student-portal';">
        Enter Student Portal Now
      </button>
    </div>
  `;

  modal.classList.add('open');
  window.showToast(`🎉 Enrollment Confirmed for ${name}!`, 'success');
}
