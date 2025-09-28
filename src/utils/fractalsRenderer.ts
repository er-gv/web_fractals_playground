import type { Vertex } from '../types';
import { hsbToRgb } from './colorUtils';

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

/**
 * Recursive function to generate Apollonian gasket circles
 * Each recursion level creates smaller circles in the gaps between existing circles
 * @param ctx - Canvas 2D context
 * @param x - Center X coordinate of current circle
 * @param y - Center Y coordinate of current circle
 * @param r - Radius of current circle
 * @param depth - Remaining recursion depth
 */
const drawApollonianRecursive = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, depth: number): void => {
  // Stop recursion if depth exhausted or radius too small to see
  if (depth <= 0 || r < 1) return;
  
  // Color circles based on recursion depth for visual hierarchy
  const hue = (5 - depth) * 60; // Different colors for different depths
  const [red, green, blue] = hsbToRgb(hue, 80, 90);
  ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
  
  // Draw current circle
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  
  // Generate next level of circles if not at final depth
  if (depth > 1) {
    const newR = r * 0.6; // Shrink radius for next level
    const offset = r * 0.4; // Distance from center for new circles
    
    // Generate 4 smaller circles around the current circle
    // This is a simplified approximation of true Apollonian circle packing
    drawApollonianRecursive(ctx, x + offset, y, newR, depth - 1); // Right
    drawApollonianRecursive(ctx, x - offset, y, newR, depth - 1); // Left  
    drawApollonianRecursive(ctx, x, y + offset, newR, depth - 1); // Bottom
    drawApollonianRecursive(ctx, x, y - offset, newR, depth - 1); // Top
  }
};

/**
 * Render Apollonian Gasket using recursive circle packing
 * Starts with 4 mutually tangent circles and recursively generates smaller circles
 * @param ctx - Canvas 2D context
 * @param centerX - X coordinate of focus point
 * @param centerY - Y coordinate of focus point
 * @param radius - Zoom radius around focus point
 */
export const drawApollonianGasket = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number): void => {
  ctx.lineWidth = 1;
  
  // Scale and center the fractal based on zoom level
  const scale = 300 / radius; // Scale factor for zoom
  drawApollonianRecursive(ctx, centerX * scale + 300, centerY * scale + 300, 100 / radius, 5);
};

/**
 * Recursive function to draw Koch curve between two points
 * Subdivides line segments and adds triangular bumps to create fractal edges
 * @param ctx - Canvas 2D context
 * @param x1 - Start point X coordinate
 * @param y1 - Start point Y coordinate
 * @param x2 - End point X coordinate
 * @param y2 - End point Y coordinate
 * @param depth - Remaining recursion depth
 */
const drawKochLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, depth: number): void => {
  // Base case: draw straight line if no more recursion
  if (depth === 0) {
    ctx.lineTo(x2, y2);
    return;
  }
  
  const dx = x2 - x1; // X distance
  const dy = y2 - y1; // Y distance
  
  // Divide line into three equal segments
  const x3 = x1 + dx / 3;     // First division point
  const y3 = y1 + dy / 3;
  
  const x4 = x1 + 2 * dx / 3; // Second division point
  const y4 = y1 + 2 * dy / 3;
  
  // Calculate peak of equilateral triangle on middle segment
  // Rotate middle segment by 60° and scale by √3/3 to get triangle height
  const px = x3 + (x4 - x3) * 0.5 - (y4 - y3) * Math.sqrt(3) / 6;
  const py = y3 + (y4 - y3) * 0.5 + (x4 - x3) * Math.sqrt(3) / 6;
  
  // Recursively draw the four segments of the Koch curve
  drawKochLine(ctx, x1, y1, x3, y3, depth - 1); // First segment
  drawKochLine(ctx, x3, y3, px, py, depth - 1);  // Triangle left side
  drawKochLine(ctx, px, py, x4, y4, depth - 1);  // Triangle right side
  drawKochLine(ctx, x4, y4, x2, y2, depth - 1);  // Final segment
};

/**
 * Render Koch Star - 8-pointed star with Koch curve edges
 * Creates fractal boundaries using recursive line subdivision
 * @param ctx - Canvas 2D context
 * @param centerX - X coordinate of focus point
 * @param centerY - Y coordinate of focus point
 * @param radius - Zoom radius around focus point
 */
export const drawKochStar = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number): void => {
  const [red, green, blue] = hsbToRgb(60, 80, 90); // Yellow color
  ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
  ctx.lineWidth = 1;
  
  // Scale and center the fractal based on zoom level
  const scale = 150 / radius;
  const cx = centerX * scale + 300; // Canvas center X
  const cy = centerY * scale + 300; // Canvas center Y
  
  // Generate 8 vertices for the star shape (octagon)
  const vertices: Vertex[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4; // π/4 radians apart (45 degrees)
    vertices.push({
      x: cx + Math.cos(angle) * (100 / radius),
      y: cy + Math.sin(angle) * (100 / radius)
    });
  }
  
  // Draw Koch curves between consecutive vertices
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 0; i < 8; i++) {
    const start = vertices[i];
    const end = vertices[(i + 1) % 8]; // Wrap around to first vertex
    drawKochLine(ctx, start.x, start.y, end.x, end.y, 3); // 3 levels of recursion
  }
  ctx.stroke();
};