import React, { CSSProperties, ReactNode } from 'react';

export interface FluidGlassProps {
  text?: string;
  src?: string;
  fit?: 'cover' | 'contain';
  background?: string;
  textColor?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: number;
  shape?: 'torus' | 'lens' | 'blob' | 'pill' | 'cube' | 'prism' | 'diamond' | 'bar';
  shapes?: string[];
  morphOnClick?: boolean;
  size?: number;
  interaction?: 'follow' | 'drag' | 'static';
  position?: [number, number];
  refraction?: number;
  dispersion?: number;
  frost?: number;
  color?: string;
  tint?: number;
  reflection?: number;
  shadow?: number;
  elevation?: number;
  smoothness?: number;
  wobble?: number;
  spin?: number;
  idle?: boolean;
  intro?: boolean;
  maxDevicePixelRatio?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onShapeChange?: (shape: string) => void;
}

declare const FluidGlass: React.FC<FluidGlassProps>;
export default FluidGlass;
