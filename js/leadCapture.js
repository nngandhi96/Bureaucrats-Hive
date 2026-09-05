/**
 * Bureaucrats Hive - Lead Capture & Free Strategy Session Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initLeadForm();
});

function initLeadForm() {
  const leadForm = document.getElementById('strategySessionForm');
  if (!leadForm) return;

  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('leadName')?.value.trim();
    const phone = document.getElementById('leadPhone')?.value.trim();
    const email = document.getElementById('leadEmail')?.value.trim();
    const targetExam = document.getElementById('leadExam')?.value;
    const targetYear = document.getElementById('leadYear')?.value;
    const notes = document.getElementById('leadNotes')?.value.trim() || 'Need strategic guidance for preparation roadmap.';

    if (!name || !phone || !targetExam || !targetYear) {
      window.showToast('Please fill in all required fields.', 'gold');
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      window.showToast('Please enter a valid 10-digit phone number.', 'gold');
      return;
    }

    const leadData = {
      name,
      phone: cleanPhone,
      email: email || 'Not provided',
      targetExam,
      targetYear,
      notes,
      timestamp: new Date().toISOString()
    };

    // 1. Save to Local CRM Store
    saveLeadToCRM(leadData);

    // 2. Show Success Confirmation
    window.showToast(`✨ Strategy Session Booked for ${name}! Our senior mentor will call you.`, 'success');

    // 3. Optional direct WhatsApp Connect
    const whatsappMsg = encodeURIComponent(
      `Hello Bureaucrats Hive Mentorship Team! My name is ${name}. I am preparing for ${targetExam} (${targetYear}). I would like to schedule my Free 1-on-1 Strategy Session with a senior mentor.`
    );
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=919754761682&text=${whatsappMsg}`;

    // Reset Form
    leadForm.reset();

    // Show Confirmation Modal
    showBookingConfirmationModal(leadData, whatsappUrl);
  });
}

function saveLeadToCRM(lead) {
  try {
    const existing = JSON.parse(localStorage.getItem('bureaucrats_hive_leads') || '[]');
    existing.push(lead);
    localStorage.setItem('bureaucrats_hive_leads', JSON.stringify(existing));
  } catch (err) {
    console.error('CRM Save error:', err);
  }
}

function showBookingConfirmationModal(lead, whatsappUrl) {
  let modal = document.getElementById('leadSuccessModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'leadSuccessModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="text-align: center;">
      <button class="modal-close-btn" onclick="document.getElementById('leadSuccessModal').classList.remove('open')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid #10B981; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; color: #10B981;">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>

      <h3 style="margin-bottom: 0.5rem; font-size: 1.6rem;" class="gold-text">Session Confirmed!</h3>
      <p style="color: var(--text-slate); margin-bottom: 1.5rem; font-size: 0.95rem;">
        Congratulations <strong>${lead.name}</strong>! Your diagnostic 1-on-1 strategy call for <strong>${lead.targetExam} (${lead.targetYear})</strong> has been registered with our Academic Council.
      </p>

      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--gold-border); border-radius: var(--radius-sm); padding: 1.25rem; text-align: left; margin-bottom: 1.75rem; font-size: 0.88rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
          <span style="color: var(--text-slate);">Registered Phone:</span>
          <span style="color: var(--text-white); font-weight: 700;">+91 ${lead.phone}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
          <span style="color: var(--text-slate);">Assigned Mentor:</span>
          <span style="color: var(--gold-light); font-weight: 700;">Senior CSE / BPSC Evaluator</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-slate);">Expected Call Window:</span>
          <span style="color: var(--color-success); font-weight: 700;">Within 2-4 Hours</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <a href="${whatsappUrl}" target="_blank" class="btn btn-gold" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          Connect on WhatsApp Instantly
        </a>
        <button class="btn btn-secondary" style="width: 100%;" onclick="document.getElementById('leadSuccessModal').classList.remove('open')">
          Close &amp; Explore Portal
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
}
