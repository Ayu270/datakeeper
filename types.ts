import { Vector3, Euler } from 'three';

export interface CubeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color: string;
  type?: 'solid' | 'wire' | 'icon';
  iconType?: 'wifi' | 'link' | 'cloud' | 'shield' | 'dots' | 'lines';
  floatIntensity?: number;
  floatSpeed?: number;
}

export type IconType = 'wifi' | 'link' | 'cloud' | 'shield' | 'dots' | 'lines';
