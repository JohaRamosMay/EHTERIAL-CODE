document.addEventListener("DOMContentLoaded", function () {

const canvas = document.getElementById('ethereal-canvas');
const ctx = canvas.getContext('2d');
let orbs = [];
let mouse = { x: null, y: null };
const colors = ['#83c8ff', '#ba80ff', '#c0c0c0', '#6ad1c9'];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createOrbs(count) {
  orbs = [];
  for (let i = 0; i < count; i++) {
    orbs.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 10 + Math.random() * 20,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      baseColor: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function drawOrbs() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let orb of orbs) {
    const dist = Math.hypot(mouse.x - orb.x, mouse.y - orb.y);
    const glow = dist < 120 ? 0.4 : 0.1;

    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = orb.baseColor + Math.floor(glow * 255).toString(16).padStart(2, '0');
    ctx.shadowBlur = 15 * glow;
    ctx.shadowColor = orb.baseColor;
    ctx.fill();
    ctx.closePath();

    // Movimiento suave
    orb.x += orb.dx;
    orb.y += orb.dy;

    // Rebote
    if (orb.x < 0 || orb.x > canvas.width) orb.dx *= -1;
    if (orb.y < 0 || orb.y > canvas.height) orb.dy *= -1;
  }
}

function animate() {
  drawOrbs();
  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

createOrbs(35);
animate();


});
