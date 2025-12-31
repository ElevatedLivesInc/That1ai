// Floating Particles
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for(let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2 + 1,
    alpha: Math.random() * 0.5 + 0.2
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    p.x += p.vx;
    p.y += p.vy;
    
    if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });
  
  requestAnimationFrame(animate);
}
animate();

// Responsive canvas
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
