/**
 * Royal Background Celebration Music Controller
 * Features smooth audio fade-in/fade-out, traditional audio track stream & Web Audio API fallback
 */

(function () {
  let isPlaying = false;
  let audioContext = null;
  let synthInterval = null;

  const audioElem = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicTooltip = document.getElementById('music-tooltip');

  // Traditional Indian Raag Bhairavi auspicious swara frequencies (C, D#, F, G, G#, A#, C')
  const ragaNotes = [
    261.63, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25, 622.25, 783.99
  ];

  function playAuspiciousChime() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Play soft continuous tanpura drone + intermittent flute/shehnai harmonic notes
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      const note = ragaNotes[Math.floor(Math.random() * ragaNotes.length)];
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, audioContext.currentTime);

      gain.gain.setValueAtTime(0.01, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 2.6);
    } catch (e) {
      console.log('Web Audio chime status:', e);
    }
  }

  function startSynthMelody() {
    if (synthInterval) clearInterval(synthInterval);
    playAuspiciousChime();
    synthInterval = setInterval(() => {
      if (isPlaying && (!audioElem || audioElem.paused)) {
        playAuspiciousChime();
      }
    }, 1800);
  }

  function stopSynthMelody() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function playMusic() {
    isPlaying = true;
    if (audioElem) {
      audioElem.volume = 0.5;
      const playPromise = audioElem.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            updateUI(true);
          })
          .catch((err) => {
            console.log('Autoplay restriction or offline audio source. Fallback to Web Audio.', err);
            startSynthMelody();
            updateUI(true);
          });
      }
    } else {
      startSynthMelody();
      updateUI(true);
    }
  }

  function pauseMusic() {
    isPlaying = false;
    if (audioElem) {
      audioElem.pause();
    }
    stopSynthMelody();
    updateUI(false);
  }

  function toggleMusic() {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  function updateUI(playing) {
    if (!musicToggleBtn) return;
    if (playing) {
      musicToggleBtn.classList.remove('music-paused');
      if (musicTooltip) musicTooltip.textContent = 'Mute Music';
    } else {
      musicToggleBtn.classList.add('music-paused');
      if (musicTooltip) musicTooltip.textContent = 'Play Royal Music';
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMusic();
    });
  }

  // Export functions to window
  window.RoyalAudio = {
    play: playMusic,
    pause: pauseMusic,
    toggle: toggleMusic,
    playChime: playAuspiciousChime
  };
})();
