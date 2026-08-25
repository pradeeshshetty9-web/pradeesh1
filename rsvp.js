/**
 * RSVP & Digital Blessings / Guestbook System
 * Formats WhatsApp messages for instant RSVP & handles the interactive blessings wall
 */

(function () {
  // Pre-seeded authentic Indian wedding blessings
  const defaultWishes = [
    {
      name: 'Ramesh & Anitha Hegde',
      relation: 'Family Well-wisher',
      time: 'Just now',
      message: 'Heartiest congratulations to Ektha and Prajwal! Wishing you both a lifetime of eternal love, happiness, prosperity, and togetherness. May Lord Ganesha bless this auspicious union!'
    },
    {
      name: 'Dr. Vikram & Sunita Rao',
      relation: 'Family Friends, Manipal',
      time: '2 hours ago',
      message: 'So thrilled to celebrate the sacred union of Ektha & Prajwal! Shruthi & Shanthosh uncle, congratulations! Looking forward to the grand reception in Udupi!'
    },
    {
      name: 'Suresh & Kavitha Nayak',
      relation: 'Rampur',
      time: '5 hours ago',
      message: 'Warmest blessings to Prajwal and Ektha from Rampur. Wishing you a blessed Saptapadi and vibrant married life ahead!'
    }
  ];

  // Load blessings from localStorage or fallback to defaults
  function loadWishes() {
    try {
      const stored = localStorage.getItem('wedding_blessings_ektha_prajwal');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading wishes', e);
    }
    return defaultWishes;
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem('wedding_blessings_ektha_prajwal', JSON.stringify(wishes));
    } catch (e) {
      console.error('Error saving wishes', e);
    }
  }

  function renderWishes() {
    const wishesContainer = document.getElementById('wishes-list');
    if (!wishesContainer) return;

    const wishes = loadWishes();
    wishesContainer.innerHTML = '';

    wishes.forEach((wish) => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(wish.name)}</span>
          <span class="wish-time">${wish.time || 'Recently'}</span>
        </div>
        <p class="wish-message">"${escapeHtml(wish.message)}"</p>
      `;
      wishesContainer.appendChild(card);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Trigger celebratory confetti burst using dynamic canvas particles or canvas-confetti
  function triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#e63946', '#ffd166', '#06d6a0', '#fff']
      });
    }
  }

  // Initialize RSVP Form Handler
  function initRSVP() {
    const rsvpForm = document.getElementById('wedding-rsvp-form');
    if (!rsvpForm) return;

    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const guestName = document.getElementById('guest-name').value.trim();
      const guestPhone = document.getElementById('guest-phone').value.trim();
      const guestCount = document.getElementById('guest-count').value;
      const guestMessage = document.getElementById('guest-blessing').value.trim();

      const attendingMehendi = document.getElementById('event-mehendi')?.checked;
      const attendingWedding = document.getElementById('event-wedding')?.checked;
      const attendingReception = document.getElementById('event-reception')?.checked;

      const eventsSelected = [];
      if (attendingMehendi) eventsSelected.push('Mehendi (Rampur)');
      if (attendingWedding) eventsSelected.push('Wedding Muhurtham (Mangalore)');
      if (attendingReception) eventsSelected.push('Grand Reception (Udupi)');

      if (eventsSelected.length === 0) {
        alert('Please select at least one event you will be attending.');
        return;
      }

      // Add to blessings board if guest wrote a message
      if (guestMessage) {
        const wishes = loadWishes();
        wishes.unshift({
          name: guestName,
          relation: 'Guest',
          time: 'Just now',
          message: guestMessage
        });
        saveWishes(wishes);
        renderWishes();
      }

      // Format WhatsApp message
      const text = `*Wedding RSVP for Ektha & Prajwal* 🌺💍
━━━━━━━━━━━━━━━━━━━━
👤 *Guest Name:* ${guestName}
📞 *Contact:* ${guestPhone || 'Not provided'}
👥 *Total Guests:* ${guestCount} Person(s)
📅 *Attending Events:*
${eventsSelected.map(ev => '  • ' + ev).join('\n')}
${guestMessage ? `\n💌 *Warm Wishes:* "${guestMessage}"` : ''}
━━━━━━━━━━━━━━━━━━━━
_Excited to celebrate with the families of Ektha (Shruthi & Shanthosh) and Prajwal (Sowmya & Rahul)!_`;

      const encodedText = encodeURIComponent(text);
      const hostWhatsAppNumber = '919876543210'; // Replaceable with actual family host WhatsApp number
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

      triggerConfetti();

      // Show confirmation dialog & redirect to WhatsApp
      const confirmModal = document.getElementById('rsvp-success-modal');
      if (confirmModal) {
        confirmModal.classList.add('active');
        const waLink = document.getElementById('modal-wa-link');
        if (waLink) {
          waLink.href = whatsappUrl;
        }
      } else {
        window.open(whatsappUrl, '_blank');
      }

      rsvpForm.reset();
    });
  }

  // Handle Quick Blessings Form
  function initQuickBlessing() {
    const quickForm = document.getElementById('quick-blessing-form');
    if (!quickForm) return;

    quickForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const authorName = document.getElementById('blessing-author').value.trim();
      const msg = document.getElementById('blessing-text').value.trim();

      if (!authorName || !msg) return;

      const wishes = loadWishes();
      wishes.unshift({
        name: authorName,
        relation: 'Well-wisher',
        time: 'Just now',
        message: msg
      });
      saveWishes(wishes);
      renderWishes();

      triggerConfetti();
      quickForm.reset();
      alert('Thank you for your heartfelt blessings!');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderWishes();
    initRSVP();
    initQuickBlessing();
  });
})();
