document.addEventListener("DOMContentLoaded", function () {


  const canvas = document.getElementById("star-canvas");
  const ctx = canvas.getContext("2d");
  const testimonialsSection = document.querySelector(".testimonials");

  function resizeCanvas() {
    canvas.width = testimonialsSection.offsetWidth;
    canvas.height = testimonialsSection.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const colors = ["#83c8ff", "#ba80ff", "#6ad1c9"];
  let stars = [];

  testimonialsSection.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = 0; i < 4; i++) {
      stars.push({
        x: mouseX,
        y: mouseY,
        radius: Math.random() * 2 + 1,
        alpha: 1,
        decay: 0.01 + Math.random() * 0.015,
        dx: (Math.random() - 0.5) * 1.2,
        dy: (Math.random() - 0.5) * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star, index) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRgb(star.color)}, ${star.alpha})`;
      ctx.shadowColor = star.color;
      ctx.shadowBlur = 8;
      ctx.fill();

      star.x += star.dx;
      star.y += star.dy;
      star.alpha -= star.decay;

      if (star.alpha <= 0) {
        stars.splice(index, 1);
      }
    });

    requestAnimationFrame(animate);
  }

  function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  }

  animate();
});
