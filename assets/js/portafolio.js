document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("particles-portfolio");
  const ctx = canvas.getContext("2d");

  let fireworks = [];
  const colors = ['#ba80ff', '#6ad1c9', '#83c8ff', '#f8f9fa', '#ffffff', '#c0c0c0'];

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class StarParticle {
    constructor(x, y, angle, speed, color) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = speed;
      this.radius = Math.random() * 2 + 1;
      this.opacity = 1;
      this.color = color;
      this.gravity = 0.02;
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.opacity -= 0.015;
    }

    draw() {
      ctx.beginPath();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    isAlive() {
      return this.opacity > 0;
    }
  }

  function createFirework(x, y) {
    const particles = [];
    const numParticles = 50;
    const baseColor = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < numParticles; i++) {
      const angle = (Math.PI * 2 * i) / numParticles;
      const speed = Math.random() * 3 + 1;
      const color = baseColor;
      particles.push(new StarParticle(x, y, angle, speed, color));
    }
    fireworks.push(particles);
  }

  // Scroll-triggered explosions
  let lastScrollY = 0;
  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    if (Math.abs(currentY - lastScrollY) > 100) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.7;
      createFirework(x, y);
      lastScrollY = currentY;
    }
  });

  // Optional: click to trigger explosion
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    createFirework(e.clientX - rect.left, e.clientY - rect.top);
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    fireworks = fireworks.filter(group => {
      group.forEach(p => p.update());
      group.forEach(p => p.draw());
      return group.some(p => p.isAlive());
    });

    requestAnimationFrame(animate);
  }

  animate();
});
