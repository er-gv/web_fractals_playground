//import type { Vertex } from '../types';
import { hsbToRgb } from '../utils/colorUtils.ts';


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