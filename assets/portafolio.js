// particles-portfolio.js
document.addEventListener("DOMContentLoaded", function () {
const canvas = document.getElementById('particles-portfolio');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 50;
const colors = ['#ba80ff', '#83c8ff', '#6ad1c9'];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 50;
    this.radius = Math.random() * 2 + 1;
    this.speedY = Math.random() * 0.5 + 0.3;
    this.opacity = Math.random() * 0.3 + 0.2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.fade = Math.random() * 0.005 + 0.001;
  }

  update() {
    this.y -= this.speedY;
    this.opacity -= this.fade;

    if (this.opacity <= 0 || this.y + this.radius < 0) {
      this.reset();
    }
  }

  draw() {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
    gradient.addColorStop(0, `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    p.update();
    p.draw();
  }
  requestAnimationFrame(animate);
}

initParticles();
animate();

});
