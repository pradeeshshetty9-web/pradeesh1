/**
 * Main Application Logic for Ektha & Prajwal's Royal Wedding Invitation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Royal Envelope Opening
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const waxSealBtn = document.getElementById('wax-seal-btn');

  function openInvitation() {
    if (!envelopeOverlay) return;
    envelopeOverlay.classList.add('opened');

    // Trigger auspicious sound/music
    if (window.RoyalAudio) {
      window.RoyalAudio.playChime();
      setTimeout(() => {
        window.RoyalAudio.play();
      }, 500);
    }

    // Trigger celebratory confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#d4af37', '#e63946', '#fae188', '#fff']
      });
    }

    // Store in session that invite was opened
    sessionStorage.setItem('invite_opened', 'true');
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', openInvitation);
  }

  // Also allow clicking envelope card
  const envelopeCard = document.querySelector('.royal-envelope-card');
  if (envelopeCard) {
    envelopeCard.addEventListener('click', openInvitation);
  }

  // 2. Countdown Timer
  // Target Wedding Date (e.g. November 28, 2026 10:30 AM IST)
  const targetWeddingDate = new Date('2026-11-28T10:30:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetWeddingDate - now;

    const daysElem = document.getElementById('count-days');
    const hoursElem = document.getElementById('count-hours');
    const minutesElem = document.getElementById('count-minutes');
    const secondsElem = document.getElementById('count-seconds');

    if (!daysElem) return;

    if (distance < 0) {
      daysElem.textContent = '00';
      hoursElem.textContent = '00';
      minutesElem.textContent = '00';
      secondsElem.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysElem.textContent = String(days).padStart(2, '0');
    hoursElem.textContent = String(hours).padStart(2, '0');
    minutesElem.textContent = String(minutes).padStart(2, '0');
    secondsElem.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 3. Add to Calendar (Google Calendar & iCal Generator)
  const calendarData = {
    mehendi: {
      title: 'Mehendi & Sangeet - Ektha & Prajwal',
      details: 'Mehendi and Sangeet celebrations of Ektha & Prajwal at Rampur.',
      location: 'Rampur (https://maps.app.goo.gl/3ighUCHFA5Gw2ifL6)',
      start: '20261126T170000',
      end: '20261126T223000'
    },
    wedding: {
      title: 'Wedding Muhurtham - Ektha Weds Prajwal',
      details: 'Sacred wedding ceremony and Muhurtham of Ektha and Prajwal at Mangalore.',
      location: 'Mangalore (https://maps.app.goo.gl/JrE6Uj9qXWiEqPSy9)',
      start: '20261128T093000',
      end: '20261128T140000'
    },
    reception: {
      title: 'Grand Wedding Reception - Ektha & Prajwal',
      details: 'Grand wedding reception dinner and musical evening of Ektha & Prajwal at Udupi.',
      location: 'Udupi (https://maps.app.goo.gl/2uLcTuJK8bCG4qsSA)',
      start: '20261129T183000',
      end: '20261129T230000'
    }
  };

  // Google Calendar URL Generator
  window.addToGoogleCalendar = function (eventType) {
    const ev = calendarData[eventType];
    if (!ev) return;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${ev.start}/${ev.end}&details=${encodeURIComponent(ev.details)}&location=${encodeURIComponent(ev.location)}`;
    window.open(url, '_blank');
  };

  // iCal .ics Download Generator
  window.downloadICal = function (eventType) {
    const ev = calendarData[eventType];
    if (!ev) return;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ektha & Prajwal Wedding//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:${ev.details}`,
      `LOCATION:${ev.location}`,
      `DTSTART:${ev.start}`,
      `DTEND:${ev.end}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${eventType}-ektha-prajwal.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. Photo Gallery Lightbox
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-card').forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 5. Share Invitation (Web Share API / WhatsApp)
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const shareData = {
        title: 'Ektha Weds Prajwal - Wedding Invitation',
        text: 'You are cordially invited to celebrate the auspicious wedding of Ektha & Prajwal! 🌺 Mehendi at Rampur | Wedding at Mangalore | Reception at Udupi.',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch((err) => console.log('Share error', err));
      } else {
        const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + '\n' + shareData.url)}`;
        window.open(waShareUrl, '_blank');
      }
    });
  }

  // 6. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal-fade');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));

  // Modal Close buttons
  document.querySelectorAll('.modal-close-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.lightbox-modal') || document.getElementById('rsvp-success-modal');
      if (modal) modal.classList.remove('active');
    });
  });
});
