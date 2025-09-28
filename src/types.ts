/**
 * Type definitions for the Fractals Playground application
 */

export interface FocusPoint {
  x: number;
  y: number;
}

export interface FractalInfo {
  id: FractalType;
  name: string;
  thumb: string;
}

export interface Circle {
  x: number;
  y: number;
  r: number;
}

export interface Vertex {
  x: number;
  y: number;
}

export type FractalType = 'julia' | 'apollonian' | 'koch';

export type RGBColor = [number, number, number];