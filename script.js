const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle colors (matching your Figma likely has yellow + purple)
const colors = ['#FFD93D', '#6C63FF', '#FF6B6B', '#C9B1FF'];

let particles = [];
let mouseX = 0;
let mouseY = 0;

// Track mouse movement
document.addEventListener('mousemove', (e) => {
  mouseX = e.x;
  mouseY = e.y;
  
  // Add new particle on mouse move
  if (Math.random() > 0.85) { // Adjust density here
    particles.push(createParticle(mouseX, mouseY));
  }
});

// Click to burst particles
document.addEventListener('click', () => {
  for (let i = 0; i < 15; i++) {
    particles.push(createParticle(mouseX, mouseY, true));
  }
});

function createParticle(x, y, burst = false) {
  return {
    x: x,
    y: y,
    size: Math.random() * 6 + 2,
    speedX: burst ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5) * 2,
    speedY: burst ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5) * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1,
    decay: burst ? 0.02 : 0.005
  };
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((p, index) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.alpha -= p.decay;
    
    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
    ctx.fill();
    
    // Remove dead particles
    if (p.alpha <= 0) {
      particles.splice(index, 1);
    }
  });
  
  requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
