const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1920, H = 1080, FRAMES = 60;
const outDir = path.join(__dirname, '../public/frames');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < FRAMES; i++) {
  const canvas = createCanvas(W, H);
  const c = canvas.getContext('2d');
  const t = i / (FRAMES - 1);

  c.fillStyle = `hsl(${220 + t * 40}, 28%, ${5 + t * 4}%)`;
  c.fillRect(0, 0, W, H);

  const gridAlpha = Math.max(0.03, 0.06 * (1 - t));
  c.strokeStyle = `rgba(0,229,255,${gridAlpha})`;
  c.lineWidth = 0.8;
  for (let x = 0; x < W; x += 80) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
  for (let y = 0; y < H; y += 80) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }

  const cx = W / 2, cy = H / 2;
  for (let r = 0; r < 8; r++) {
    const rad = 60 + r * 80 + t * 40;
    const alpha = Math.max(0, (0.15 - r * 0.015) * (0.5 + 0.5 * Math.sin(t * Math.PI * 2 + r)));
    c.beginPath();
    c.arc(cx, cy, rad, 0, Math.PI * 2);
    c.strokeStyle = `hsla(${190 + t * 60 + r * 15}, 85%, 60%, ${alpha})`;
    c.lineWidth = 1;
    c.stroke();
  }

  for (let f = 0; f < 24; f++) {
    const angle = (f / 24) * Math.PI * 2 + t * Math.PI * 0.5;
    const len = 180 + t * 80 + Math.sin(t * Math.PI * 3 + f) * 40;
    const x1 = cx + Math.cos(angle) * 55;
    const y1 = cy + Math.sin(angle) * 55;
    const x2 = cx + Math.cos(angle) * len;
    const y2 = cy + Math.sin(angle) * len;
    const g = c.createLinearGradient(x1, y1, x2, y2);
    const fh = (190 + t * 80 + f * 15) % 360;
    g.addColorStop(0, `hsla(${fh},90%,65%,0.6)`);
    g.addColorStop(1, `hsla(${(fh+40)%360},70%,50%,0)`);
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2);
    c.strokeStyle = g; c.lineWidth = 1.5; c.stroke();
  }

  const numDots = 300;
  for (let d = 0; d < numDots; d++) {
    const seed = d * 137.508 + i * 0.7;
    const dx = ((seed * 13.7) % W + W) % W;
    const dy = ((seed * 7.3 + i * 3.1) % H + H) % H;
    const dr = 0.8 + (d % 4) * 0.5;
    const da = 0.15 + (Math.sin(d * 0.5 + t * Math.PI * 4) * 0.5 + 0.5) * 0.4;
    const dh = (200 + t * 80 + d * 1.8) % 360;
    c.beginPath(); c.arc(dx, dy, dr, 0, Math.PI * 2);
    c.fillStyle = `hsla(${dh},70%,65%,${da})`; c.fill();
  }

  const cg = c.createRadialGradient(cx, cy, 0, cx, cy, 28 + t * 10);
  cg.addColorStop(0, `rgba(255,255,255,${0.95 - t * 0.3})`);
  cg.addColorStop(0.4, `hsla(${185 + t * 50},100%,75%,0.6)`);
  cg.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = cg;
  c.beginPath(); c.arc(cx, cy, 28 + t * 10, 0, Math.PI * 2); c.fill();

  const scanY = (t * H * 2) % (H + 40) - 20;
  const sg = c.createLinearGradient(0, scanY - 8, 0, scanY + 8);
  sg.addColorStop(0, 'rgba(0,229,255,0)');
  sg.addColorStop(0.5, `rgba(0,229,255,${0.04 + t * 0.02})`);
  sg.addColorStop(1, 'rgba(0,229,255,0)');
  c.fillStyle = sg; c.fillRect(0, scanY - 8, W, 16);

  const num = String(i + 1).padStart(4, '0');
  const buf = canvas.toBuffer('image/jpeg', { quality: 0.88 });
  const file = path.join(outDir, `frame_${num}.jpg`);
  fs.writeFileSync(file, buf);
  process.stdout.write(`\r[${i + 1}/${FRAMES}] frame_${num}.jpg`);
}
console.log('\nDone. ' + FRAMES + ' frames in public/frames/');
