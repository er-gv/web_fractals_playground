import type { RGBColor } from '../types';

/**
 * Convert HSB color values to RGB
 * Used for creating light spectrum colors from hue values
 * @param h - Hue (0-360 degrees)
 * @param s - Saturation (0-100 percent)
 * @param b - Brightness (0-100 percent)
 * @returns Array of [r, g, b] values (0-255)
 */
export const hsbToRgb = (h: number, s: number, b: number): RGBColor => {
  s /= 100; // Convert percentage to decimal
  b /= 100; // Convert percentage to decimal
  
  const c = b * s; // Chroma
  const x = c * (1 - Math.abs((h / 60) % 2 - 1)); // Intermediate value
  const m = b - c; // Match value for lightness
  
  let r: number, g: number, bl: number; // Temporary RGB values
  
  // Determine RGB based on hue sector (60-degree segments)
  if (h >= 0 && h < 60) {
    r = c; g = x; bl = 0;      // Red to yellow
  } else if (h >= 60 && h < 120) {
    r = x; g = c; bl = 0;      // Yellow to green
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; bl = x;      // Green to cyan
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; bl = c;      // Cyan to blue
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; bl = c;      // Blue to magenta
  } else {
    r = c; g = 0; bl = x;      // Magenta to red
  }
  
  // Add match value and convert to 0-255 range
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((bl + m) * 255)
  ];
};