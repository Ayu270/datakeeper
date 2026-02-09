// Utility to generate simple icon textures on the fly using HTML Canvas
// This avoids external asset dependencies and ensures crisp vector-like quality.

export const createIconTexture = (type: string, color: string = '#000000'): string => {
  const canvas = document.createElement('canvas');
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#ffffff00'; // Transparent
  ctx.clearRect(0, 0, size, size);

  // Draw settings
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 15;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const cx = size / 2;
  const cy = size / 2;

  switch (type) {
    case 'wifi':
      ctx.beginPath();
      ctx.arc(cx, cy + 100, 30, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(cx, cy + 100, 80, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx, cy + 100, 140, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx, cy + 100, 200, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
      break;

    case 'link':
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 4);
      ctx.translate(-cx, -cy);
      
      // Link 1
      ctx.beginPath();
      ctx.roundRect(cx - 100, cy - 40, 120, 80, 40);
      ctx.stroke();
      
      // Link 2
      ctx.beginPath();
      ctx.roundRect(cx - 20, cy - 40, 120, 80, 40);
      ctx.stroke();
      break;

    case 'cloud':
      ctx.beginPath();
      ctx.arc(cx - 60, cy + 20, 50, 0, Math.PI * 2);
      ctx.arc(cx + 60, cy + 20, 50, 0, Math.PI * 2);
      ctx.arc(cx, cy - 40, 70, 0, Math.PI * 2);
      ctx.fill(); // Silhouette style for this one
      break;

    case 'shield':
      ctx.beginPath();
      ctx.moveTo(cx - 80, cy - 80);
      ctx.lineTo(cx + 80, cy - 80);
      ctx.lineTo(cx + 80, cy);
      ctx.quadraticCurveTo(cx, cy + 120, cx, cy + 120);
      ctx.quadraticCurveTo(cx - 80, cy, cx - 80, cy);
      ctx.closePath();
      ctx.stroke();
      
      // Inner check
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy + 10);
      ctx.lineTo(cx, cy + 40);
      ctx.lineTo(cx + 40, cy - 30);
      ctx.stroke();
      break;

    case 'dots':
      const dotSize = 25;
      const gap = 80;
      for(let i=-1; i<=1; i++) {
        for(let j=-1; j<=1; j++) {
            ctx.beginPath();
            ctx.arc(cx + i*gap, cy + j*gap, dotSize, 0, Math.PI*2);
            ctx.fill();
        }
      }
      break;

    case 'lines':
        ctx.lineWidth = 10;
        for(let i=-2; i<=2; i++) {
            ctx.beginPath();
            ctx.moveTo(cx - 100, cy + i*50);
            ctx.lineTo(cx + 100, cy + i*50);
            ctx.stroke();
        }
        break;
  }

  return canvas.toDataURL();
};
