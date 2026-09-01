/**
 * Bureaucrats Hive - Student Portal Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortalTabs();
  initTaskTracker();
  initMentorSlotBooking();
});

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

  function updateProgress() {
    const total = taskItems.length;
    const completed = document.querySelectorAll('.task-item.completed').length;
    const percent = Math.round((completed / total) * 100);

    if (progressBarFill) {
      progressBarFill.style.width = `${percent}%`;
    }
    if (progressPercentText) {
      progressPercentText.textContent = `${percent}% Completed`;
    }
    if (streakCounterText && percent === 100) {
      streakCounterText.textContent = '🔥 14 Days Streak (Goal Completed!)';
      window.showToast('🎉 All daily targets completed! Mentor notified.', 'success');
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
  let selectedSlot = null;

  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = btn.getAttribute('data-slot');
    });
  });

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      if (!selectedSlot) {
        window.showToast('Please select a time slot first.', 'gold');
        return;
      }
      window.showToast(`✅ Mentorship Call scheduled for ${selectedSlot}! Google Meet link sent.`, 'success');
    });
  }
}
