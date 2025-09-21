
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