import type { Vertex } from '../types';
import { hsbToRgb } from '../utils/colorUtils';

/**
 * Render Julia Set using pixel-level computation
 * Uses escape-time algorithm with light spectrum coloring (UV to IR)
 * @param ctx - Canvas 2D context
 * @param centerX - X coordinate of focus point
 * @param centerY - Y coordinate of focus point 
 * @param radius - Zoom radius around focus point
 */
export const drawJuliaSet = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number): void => {
  const canvas = ctx.canvas;
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;
  
  // Iterate through every pixel in the 600x600 canvas
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      // Map pixel coordinates to complex plane with zoom and focus
      const zx = centerX + ((x / canvas.width) - 0.5) * 4 * radius;
      const zy = centerY + ((y / canvas.height) - 0.5) * 4 * radius;
      
      // Julia set iteration with c = -0.8 + 0.156i
      let iterations = 0;
      let zx2 = zx, zy2 = zy;
      const maxIter = 100; // Higher iterations for main display
      
      // Escape-time algorithm: z = z² + c
      while (zx2 * zx2 + zy2 * zy2 < 4 && iterations < maxIter) {
        const xtemp = zx2 * zx2 - zy2 * zy2 - 0.8; // Real part of z² + c
        zy2 = 2 * zx2 * zy2 + 0.156; // Imaginary part of z² + c
        zx2 = xtemp;
        iterations++;
      }
      
      // Set pixel color based on escape time
      const idx = (y * canvas.width + x) * 4;
      if (iterations === maxIter) {
        // Point is in the set - render as black
        data[idx] = 0;     // Red
        data[idx + 1] = 0; // Green
        data[idx + 2] = 0; // Blue
      } else {
        // Point escaped - color based on light spectrum (UV to IR)
        const hue = (iterations / maxIter) * 300; // 0-300 degrees (violet to red)
        const [r, g, b] = hsbToRgb(hue, 80, 90);
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
      }
      data[idx + 3] = 255; // Alpha (fully opaque)
    }
  }
  
  ctx.putImageData(imageData, 0, 0); // Apply pixel changes to canvas
};
