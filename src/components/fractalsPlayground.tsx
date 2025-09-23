import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { FocusPoint, FractalInfo, FractalType } from '../types';
import { drawJuliaSet, drawApollonianGasket, drawKochStar } from '../utils/fractalsRenderer';
import { generateJuliaThumbnail, generateApollonianThumbnail, generateKochThumbnail } from '../utils/thumbnailGenerators';

/**
 * Fractals Playground - Interactive fractal explorer built with React and HTML5 Canvas
 * Features Julia sets, Apollonian gaskets, and Koch snowflake variations
 * with real-time zoom and focus controls
 */
export const FractalsPlayground: React.FC = () => {
  // Canvas ref for direct HTML5 Canvas manipulation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Application state
  const [selectedFractal, setSelectedFractal] = useState<FractalType>('julia'); // Current fractal type
  const [zoomLevel, setZoomLevel] = useState<number>(0); // Index into zoomLevels array
  const [focusPoint, setFocusPoint] = useState<FocusPoint>({ x: 0, y: 0 }); // Center point for zoom operations
  const [showHelp, setShowHelp] = useState<boolean>(false); // Help panel visibility

  // Predefined zoom levels (radius around focus point)
  const zoomLevels: number[] = [2.0, 1.0, 0.5, 0.1, 0.01];
  
  // Fractal configuration with metadata
  const fractals: FractalInfo[] = [
    { id: 'julia', name: 'Julia Set', thumb: '/thumbnails/julia.png' },
    { id: 'apollonian', name: 'Apollonian Gasket', thumb: '/thumbnails/apollonian.png' },
    { id: 'koch', name: 'Koch Star', thumb: '/thumbnails/koch.png' }
  ];

  /**
   * Generate thumbnail images programmatically for the fractal selection UI
   * Creates small preview images with yellow gradient coloring that fades
   * from bright yellow to darker shades as distance increases
   */
  useEffect(() => {
    const generateThumbnails = (): void => {
      // Create thumbnail canvases for each fractal type
      fractals.forEach((fractal: FractalInfo) => {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        // Generate thumbnail based on fractal type
        switch(fractal.id) {
          case 'julia':
            generateJuliaThumbnail(ctx, canvas.width, canvas.height);
            break;
          case 'apollonian':
            generateApollonianThumbnail(ctx, canvas.width, canvas.height);
            break;
          case 'koch':
            generateKochThumbnail(ctx, canvas.width, canvas.height);
            break;
        }
        
        // Convert to data URL and store
        // In production, these would be saved as actual PNG files
        const dataUrl = canvas.toDataURL('image/png');
        console.log(`Generated thumbnail for ${fractal.name}`);
      });
    };
    
    generateThumbnails();
  }, []);

  /**
   * Main canvas drawing function - renders the selected fractal
   * Called whenever the fractal type, zoom level, or focus point changes
   */
  const drawFractal = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const radius = zoomLevels[zoomLevel];
    
    // Clear canvas with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render the selected fractal type
    switch(selectedFractal) {
      case 'julia':
        drawJuliaSet(ctx, focusPoint.x, focusPoint.y, radius);
        break;
      case 'apollonian':
        drawApollonianGasket(ctx, focusPoint.x, focusPoint.y, radius);
        break;
      case 'koch':
        drawKochStar(ctx, focusPoint.x, focusPoint.y, radius);
        break;
    }
  }, [selectedFractal, zoomLevel, focusPoint]);

  /**
   * Handle mouse clicks on canvas to set new focus point
   * Converts canvas pixel coordinates to mathematical coordinates [-2, 2]
   */
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert canvas coordinates to mathematical coordinates [-2, 2]
    const newX = ((x / canvas.width) - 0.5) * 4;
    const newY = ((y / canvas.height) - 0.5) * 4;
    
    setFocusPoint({ x: newX, y: newY });
  };

  /**
   * Handle zoom level change from slider input
   */
  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setZoomLevel(parseInt(event.target.value));
  };

  /**
   * Handle fractal type selection
   */
  const handleFractalSelect = (fractalId: FractalType): void => {
    setSelectedFractal(fractalId);
  };

  /**
   * Handle help panel toggle
   */
  const handleHelpToggle = (): void => {
    setShowHelp(!showHelp);
  };

  // Re-draw fractal when dependencies change
  useEffect(() => {
    drawFractal();
  }, [drawFractal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Top Navigation Banner */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-20 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            ✨ Fractals Playground
          </h1>
          <button 
            onClick={handleHelpToggle}
            className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-md rounded-lg hover:bg-opacity-30 transition-all"
          >
            Help
          </button>
        </div>
      </div>

      {/* Collapsible Help Panel */}
      {showHelp && (
        <div className="bg-black bg-opacity-50 backdrop-blur-md border-b border-white border-opacity-20 p-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">How to Use:</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Click anywhere on the fractal to focus on that point</li>
              <li>• Use the zoom slider to change detail levels</li>
              <li>• Select different fractals from the thumbnail panel</li>
              <li>• Main area maps to [-2,+2] coordinate space</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex max-w-7xl mx-auto p-6 gap-6">
        {/* Main Canvas Rendering Area */}
        <div className="flex-1">
          <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20">
            <div className="relative">
              {/* HTML5 Canvas for fractal rendering */}
              <canvas 
                ref={canvasRef}
                width={600}
                height={600}
                onClick={handleCanvasClick}
                className="rounded-lg overflow-hidden shadow-2xl cursor-crosshair"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              {/* Overlay with current focus and zoom information */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 backdrop-blur-md rounded-lg px-3 py-2 text-sm">
                Focus: ({focusPoint.x.toFixed(2)}, {focusPoint.y.toFixed(2)}) | 
                Radius: {zoomLevels[zoomLevel]}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Control Panel */}
        <div className="w-80 space-y-6"/>
      
        {/* Zoom Control Slider */}
        <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
          <h2 className="text-xl font-semibold mb-4 text-center">Zoom Level</h2>
        </div> 
      </div> 
      </div>
  );}