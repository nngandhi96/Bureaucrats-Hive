/**
 * Bureaucrats Hive - Student Portal Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initStudentProfile();
  initPortalTabs();
  initTaskTracker();
  initMentorSlotBooking();
  initAnswerUpload();
});

/* 0. Student Profile Initialization from Session */
function initStudentProfile() {
  const rawData = localStorage.getItem('bh_student_data');
  let student = {
    name: 'Priya Sharma',
    id: 'BH-2026-0842',
    batch: 'Target UPSC CSE 2026 Comprehensive Mentorship',
    mentor: 'Er. Aftab & Er. Nandan',
    streak: 14,
    avatar: 'PS'
  };

  if (rawData) {
    try {
      student = { ...student, ...JSON.parse(rawData) };
    } catch (e) {
      console.error('Error parsing student session data', e);
    }
  }

  // Populate dynamic student profile DOM nodes
  const nameEls = document.querySelectorAll('.dynamic-student-name');
  nameEls.forEach(el => el.textContent = student.name);

  const idEls = document.querySelectorAll('.dynamic-student-id');
  idEls.forEach(el => el.textContent = student.id);

  const batchEls = document.querySelectorAll('.dynamic-student-batch');
  batchEls.forEach(el => el.textContent = student.batch);

  const avatarEls = document.querySelectorAll('.dynamic-student-avatar');
  avatarEls.forEach(el => el.textContent = student.avatar || student.name.substring(0, 2).toUpperCase());
}

/* Global Student Logout */
window.logoutStudent = function() {
  if (confirm('Are you sure you want to log out of your Student LMS session?')) {
    localStorage.removeItem('bh_student_logged_in');
    localStorage.removeItem('bh_student_data');
    if (typeof window.showToast === 'function') {
      window.showToast('You have logged out successfully. Returning to Login...', 'success');
    }
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 600);
  }
};

/* 1. Student Portal Tab Navigation */
function initPortalTabs() {
  const tabBtns = document.querySelectorAll('.portal-tab-btn');
  const panels = document.querySelectorAll('.portal-tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPanelId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* 2. Daily Task Tracker Interactive Logic */
function initTaskTracker() {
  const taskItems = document.querySelectorAll('.task-item');
  const progressBarFill = document.querySelector('.progress-bar-fill');
  const progressPercentText = document.getElementById('portalProgressPercent');
  const streakCounterText = document.getElementById('portalStreakCount');
  const kpiDailyCount = document.getElementById('kpiDailyTasksDone');

  function updateProgress() {
    const total = taskItems.length;
    const completed = document.querySelectorAll('.task-item.completed').length;
    const percent = Math.round((completed / total) * 100);

    if (progressBarFill) {
      progressBarFill.style.width = `${percent}%`;
    }
    if (progressPercentText) {
      progressPercentText.textContent = `${percent}% Completed (${completed}/${total} Tasks)`;
    }
    if (kpiDailyCount) {
      kpiDailyCount.textContent = `${completed} / ${total}`;
    }
    if (streakCounterText && percent === 100) {
      streakCounterText.textContent = '🔥 15 Days Streak (Goal Achieved!)';
      if (typeof window.showToast === 'function') {
        window.showToast('🎉 All daily targets completed! Log updated & mentor notified.', 'success');
      }
    }
  }

  taskItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('completed');
      
      const checkbox = item.querySelector('.custom-checkbox');
      if (item.classList.contains('completed')) {
        checkbox.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      } else {
        checkbox.innerHTML = '';
      }

      updateProgress();
    });
  });

  updateProgress();
}

/* 3. 1-on-1 Mentor Slot Booking */
function initMentorSlotBooking() {
  const slotBtns = document.querySelectorAll('.slot-btn');
  const bookBtn = document.getElementById('confirmSlotBookingBtn');
  const nextCallKpi = document.getElementById('kpiNextCall');
  let selectedSlot = 'Tomorrow • 6:30 PM';

  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = btn.getAttribute('data-slot') || btn.textContent.trim();
    });
  });

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      if (!selectedSlot) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please select an available mentor slot first.', 'gold');
        }
        return;
      }
      
      const meetCode = 'meet.google.com/bh-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
      
      const bookingAlert = document.getElementById('slotBookedAlert');
      if (bookingAlert) {
        bookingAlert.style.display = 'block';
        bookingAlert.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.1); border: 1.5px solid #10B981; border-radius: 8px; padding: 1rem 1.25rem; margin-top: 1rem;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: #065F46; font-size: 0.95rem;">
              <span>✅</span> <span>Mentorship Session Confirmed for ${selectedSlot}!</span>
            </div>
            <p style="font-size: 0.85rem; color: #047857; margin-top: 6px;">
              Google Meet Link: <a href="https://${meetCode}" target="_blank" style="color: #047857; font-weight: 700; text-decoration: underline;">https://${meetCode}</a> (Invitation sent to your WhatsApp &amp; Calendar).
            </p>
          </div>
        `;
      }

      if (nextCallKpi) {
        nextCallKpi.textContent = selectedSlot.replace('•', 'at');
      }

      if (typeof window.showToast === 'function') {
        window.showToast(`✅ Mentorship call booked for ${selectedSlot}! Meet link generated.`, 'success');
      }
    });
  }
}

/* 4. Answer Writing Upload Simulator */
function initAnswerUpload() {
  const uploadForm = document.getElementById('answerUploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('answerCopyFile');
      const paperSelect = document.getElementById('answerCopyPaper');
      
      const paperName = paperSelect ? paperSelect.value : 'GS Paper 2';
      
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please select your PDF answer copy file.', 'gold');
        }
        return;
      }

      const fileName = fileInput.files[0].name;
      const submitBtn = uploadForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = `<span>Uploading Answer Copy...</span> <svg class="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>`;
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = `<span>Submit Answer Copy (Guaranteed 24-Hour Evaluation)</span>`;
          submitBtn.disabled = false;
        }
        uploadForm.reset();

        const uploadSuccess = document.getElementById('answerUploadSuccess');
        if (uploadSuccess) {
          uploadSuccess.style.display = 'block';
          uploadSuccess.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10B981; border-radius: 8px; padding: 0.85rem 1rem; margin-top: 1rem; font-size: 0.85rem; color: #065F46;">
              🚀 <strong>Copy Received: "${fileName}" (${paperName})</strong>. Assigned to Er. Aftab. Evaluated copy with rubric scorecard will be delivered in &le; 24 hours.
            </div>
          `;
        }

        if (typeof window.showToast === 'function') {
          window.showToast(`Copy "${fileName}" uploaded successfully! Sent to mentor for evaluation.`, 'success');
        }
      }, 1200);
    });
  }
}

/* 5. Study Material Download Helper */
window.downloadStudyResource = function(title) {
  if (typeof window.showToast === 'function') {
    window.showToast(`Downloading: "${title}" (Bureaucrats Hive Curated PDF)...`, 'success');
  }
};
