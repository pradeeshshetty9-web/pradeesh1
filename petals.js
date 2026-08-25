/**
 * High Performance Canvas Floating Petals Particle Engine
 * Creates realistic fluttering red rose and golden marigold petals with shimmering gold dust
 */

(function () {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let petals = [];
  const TOTAL_PETALS = window.innerWidth < 768 ? 25 : 45;
  let isRunning = true;

  const petalColors = [
    { fill: 'rgba(214, 40, 57, 0.85)', shadow: 'rgba(150, 20, 30, 0.4)' },    // Rose Red
    { fill: 'rgba(235, 75, 90, 0.8)', shadow: 'rgba(180, 30, 45, 0.3)' },     // Pink Rose
    { fill: 'rgba(244, 162, 97, 0.85)', shadow: 'rgba(212, 110, 40, 0.4)' },   // Orange Marigold
    { fill: 'rgba(233, 196, 106, 0.9)', shadow: 'rgba(212, 175, 55, 0.4)' },   // Golden Yellow
    { fill: 'rgba(255, 215, 0, 0.85)', shadow: 'rgba(255, 180, 0, 0.5)' }      // Pure Gold Flake
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 12 + 8; // 8 to 20px
      this.speedY = Math.random() * 1.4 + 0.8;
      this.speedX = Math.random() * 1.2 - 0.6;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.oscillation = Math.random() * Math.PI * 2;
      this.oscillationSpeed = Math.random() * 0.03 + 0.01;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.opacity = Math.random() * 0.4 + 0.6;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.04 + 0.01;
    }

    update() {
      this.y += this.speedY;
      this.oscillation += this.oscillationSpeed;
      this.x += Math.sin(this.oscillation) * 1.2 + this.speedX;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      // Wrap around screen
      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.flip), 1);

      ctx.fillStyle = this.color.fill;
      ctx.shadowColor = this.color.shadow;
      ctx.shadowBlur = 6;
      ctx.globalAlpha = this.opacity;

      ctx.beginPath();
      // Draw organic petal shape using bezier curves
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.8, this.size * 0.9, this.size * 0.5, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.5, -this.size * 0.8, -this.size * 0.8, 0, -this.size);
      ctx.closePath();
      ctx.fill();

      // Subtle center vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.8);
      ctx.lineTo(0, this.size * 0.6);
      ctx.stroke();

      ctx.restore();
    }
  }

  function init() {
    petals = [];
    for (let i = 0; i < TOTAL_PETALS; i++) {
      petals.push(new Petal());
    }
  }

  function animate() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Toggle animation function exposed globally
  window.togglePetals = function (state) {
    if (state !== undefined) {
      isRunning = state;
    } else {
      isRunning = !isRunning;
    }
    if (isRunning) animate();
  };

  init();
  animate();
})();
