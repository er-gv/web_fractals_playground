import type { Circle } from '../types';

/**
 * Generate Julia Set thumbnail with yellow gradient coloring
 * Uses the escape-time algorithm to determine point membership
 * @param ctx - Canvas 2D context
 * @param w - Width of thumbnail
 * @param h - Height of thumbnail
 */
export const generateJuliaThumbnail = (ctx: CanvasRenderingContext2D, w: number, h: number): void => {
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;
  
  // Iterate through each pixel in the thumbnail
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      // Map pixel coordinates to complex plane [-2, 2] x [-2, 2]
      const zx = (x / w - 0.5) * 4;
      const zy = (y / h - 0.5) * 4;
      
      // Julia set iteration with c = -0.8 + 0.156i
      let iterations = 0;
      let zx2 = zx, zy2 = zy;
      const maxIter = 50;
      
      // Escape-time algorithm: iterate z = z² + c until |z| > 2 or max iterations
      while (zx2 * zx2 + zy2 * zy2 < 4 && iterations < maxIter) {
        const xtemp = zx2 * zx2 - zy2 * zy2 - 0.8; // Real part of z² + c
        zy2 = 2 * zx2 * zy2 + 0.156; // Imaginary part of z² + c
        zx2 = xtemp;
        iterations++;
      }
      
      // Convert iterations to yellow gradient coloring
      const idx = (y * w + x) * 4;
      const intensity = iterations / maxIter;
      // Yellow shades diminishing with distance (higher iterations = further from set)
      data[idx] = Math.floor(255 * (1 - intensity * 0.5));     // Red component
      data[idx + 1] = Math.floor(255 * (1 - intensity * 0.3)); // Green component
      data[idx + 2] = Math.floor(100 * (1 - intensity));       // Blue component (low for yellow)
      data[idx + 3] = 255; // Alpha (fully opaque)
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Generate Apollonian Gasket thumbnail with yellow circle outlines
 * Creates 4 mutually tangent circles as the base configuration
 * @param ctx - Canvas 2D context
 * @param w - Width of thumbnail
 * @param h - Height of thumbnail
 */
export const generateApollonianThumbnail = (ctx: CanvasRenderingContext2D, w: number, h: number): void => {
  // Dark background for contrast
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, w, h);
  
  const centerX = w / 2;
  const centerY = h / 2;
  const baseRadius = Math.min(w, h) / 6;
  
  // Define 4 mutually tangent circles in tetrahedral arrangement
  const circles: Circle[] = [
    { x: centerX, y: centerY - baseRadius, r: baseRadius * 0.8 }, // Top circle
    { x: centerX - baseRadius, y: centerY + baseRadius * 0.5, r: baseRadius * 0.8 }, // Bottom left
    { x: centerX + baseRadius, y: centerY + baseRadius * 0.5, r: baseRadius * 0.8 }, // Bottom right
    { x: centerX, y: centerY + baseRadius * 0.3, r: baseRadius * 0.4 } // Inner circle
  ];
  
  // Draw each circle with yellow gradient intensity based on position
  circles.forEach((circle: Circle, i: number) => {
    const intensity = (4 - i) / 4; // Fade intensity for depth effect
    ctx.strokeStyle = `rgb(${Math.floor(255 * intensity)}, ${Math.floor(255 * intensity)}, ${Math.floor(100 * intensity)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
    ctx.stroke();
  });
};

/**
 * Generate Koch Star thumbnail showing 8-pointed star outline
 * Creates the base shape for the Koch snowflake variation
 * @param ctx - Canvas 2D context
 * @param w - Width of thumbnail
 * @param h - Height of thumbnail
 */
export const generateKochThumbnail = (ctx: CanvasRenderingContext2D, w: number, h: number): void => {
  // Dark background for contrast
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, w, h);
  
  const centerX = w / 2;
  const centerY = h / 2;
  const radius = Math.min(w, h) / 3;
  
  // Draw 8-pointed star outline in yellow
  ctx.strokeStyle = '#ffdd44';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  
  // Generate 8 vertices around circle (π/4 radians apart)
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y); // Start path at first vertex
    } else {
      ctx.lineTo(x, y); // Draw line to next vertex
    }
  }
  ctx.closePath(); // Complete the star shape
  ctx.stroke();
};