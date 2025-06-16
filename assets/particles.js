const ctaSection = document.querySelector('#cta');
const canvas = document.createElement('canvas');
ctaSection.style.position = 'relative';
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '0';
canvas.style.pointerEvents = 'none'; 
ctaSection.appendChild(canvas);

const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = ctaSection.offsetWidth;
canvas.height = ctaSection.offsetHeight;

const mouse = {
  x: null,
  y: null,
  radius: 80
};

ctaSection.addEventListener('mousemove', (event) => {
  const rect = ctaSection.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});

ctaSection.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.baseColor = 'rgb(255, 255, 255)';
    this.color = this.baseColor;
    this.velocityX = (Math.random() - 0.5) * 0.5; 
    this.velocityY = (Math.random() - 0.5) * 0.5;
  }

  draw() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
  }

  updateColor() {
    if (mouse.x === null || mouse.y === null) {
      this.color = this.baseColor;
      return;
    }

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.color = (distance < mouse.radius)
      ? 'rgba(5, 83, 107, 0.7)' 
      : this.baseColor;
  }

  move() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Rebotar en bordes
    if (this.x < 0 || this.x > canvas.width) this.velocityX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.velocityY *= -1;
  }
}

function initParticles() {
  particlesArray = [];
  const numParticles = 120;
  for (let i = 0; i < numParticles; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    particlesArray.push(new Particle(x, y, Math.random() * 3 + 1));
  }
}

function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a + 1; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 80 && mouse.x !== null) {
        const midX = (particlesArray[a].x + particlesArray[b].x) / 2;
        const midY = (particlesArray[a].y + particlesArray[b].y) / 2;

        if (
          Math.abs(midX - mouse.x) < mouse.radius &&
          Math.abs(midY - mouse.y) < mouse.radius
        ) {
          ctx.strokeStyle = 'rgba(120, 100, 200, 0.15)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((particle) => {
    particle.move();
    particle.updateColor();
    particle.draw();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  canvas.width = ctaSection.offsetWidth;
  canvas.height = ctaSection.offsetHeight;
  initParticles();
});

canvas.width = ctaSection.offsetWidth;
canvas.height = ctaSection.offsetHeight;

initParticles();
animateParticles();
