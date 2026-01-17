// @ts-nocheck
'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Product3DRenderProps {
  productName: string;
  category?: string;
  color?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

// Generate a deterministic shape based on product name
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function Product3DRender({
  productName,
  category = '',
  color,
  className,
  size = 'md',
  animate = false,
}: Product3DRenderProps) {
  const { shape, baseColor, accentColor, rotation } = useMemo(() => {
    const hash = hashString(productName);

    // Pick shape based on category/hash
    const shapes = ['cube', 'cylinder', 'prism', 'bracket', 'hook', 'tray'] as const;
    const shapeIndex = hash % shapes.length;

    // Color palette for 3D printed items
    const colors = [
      { base: '#27272a', accent: '#3f3f46' }, // Black
      { base: '#fafafa', accent: '#e4e4e7' }, // White
      { base: '#a1a1aa', accent: '#d4d4d8' }, // Gray
      { base: '#3b82f6', accent: '#60a5fa' }, // Blue
      { base: '#22c55e', accent: '#4ade80' }, // Green
      { base: '#f97316', accent: '#fb923c' }, // Orange
    ];
    const colorIndex = hash % colors.length;

    return {
      shape: shapes[shapeIndex],
      baseColor: color || colors[colorIndex].base,
      accentColor: colors[colorIndex].accent,
      rotation: (hash % 4) * 15, // 0, 15, 30, or 45 degrees
    };
  }, [productName, color]);

  const sizeMap = { sm: 48, md: 64, lg: 96 };
  const s = sizeMap[size];

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        animate && 'animate-spin-slow',
        className
      )}
      style={{ width: s, height: s }}
    >
      {/* Render different shapes based on hash */}
      {shape === 'cube' && <IsometricCube size={s} baseColor={baseColor} accentColor={accentColor} />}
      {shape === 'cylinder' && <IsometricCylinder size={s} baseColor={baseColor} accentColor={accentColor} />}
      {shape === 'prism' && <IsometricPrism size={s} baseColor={baseColor} accentColor={accentColor} />}
      {shape === 'bracket' && <IsometricBracket size={s} baseColor={baseColor} accentColor={accentColor} />}
      {shape === 'hook' && <IsometricHook size={s} baseColor={baseColor} accentColor={accentColor} />}
      {shape === 'tray' && <IsometricTray size={s} baseColor={baseColor} accentColor={accentColor} />}
    </div>
  );
}

// Isometric cube
function IsometricCube({ size, baseColor, accentColor }: { size: number; baseColor: string; accentColor: string }) {
  const s = size * 0.4;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Top face */}
      <polygon
        points="50,20 80,35 50,50 20,35"
        fill={accentColor}
        className="drop-shadow-sm"
      />
      {/* Left face */}
      <polygon
        points="20,35 50,50 50,80 20,65"
        fill={baseColor}
        style={{ filter: 'brightness(0.8)' }}
      />
      {/* Right face */}
      <polygon
        points="50,50 80,35 80,65 50,80"
        fill={baseColor}
        style={{ filter: 'brightness(0.6)' }}
      />
      {/* Layer lines (3D print effect) */}
      {[0, 1, 2, 3, 4].map(i => (
        <line
          key={i}
          x1="20"
          y1={35 + i * 6}
          x2="50"
          y2={50 + i * 6}
          stroke={accentColor}
          strokeWidth="0.3"
          opacity="0.3"
        />
      ))}
    </svg>
  );
}

// Isometric cylinder (like a spool or cup)
function IsometricCylinder({ size, baseColor, accentColor }: { size: number; baseColor: string; accentColor: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Bottom ellipse (hidden, for depth) */}
      <ellipse
        cx="50"
        cy="70"
        rx="25"
        ry="10"
        fill={baseColor}
        style={{ filter: 'brightness(0.5)' }}
      />
      {/* Body */}
      <rect
        x="25"
        y="30"
        width="50"
        height="40"
        fill={baseColor}
        style={{ filter: 'brightness(0.7)' }}
      />
      {/* Top ellipse */}
      <ellipse
        cx="50"
        cy="30"
        rx="25"
        ry="10"
        fill={accentColor}
      />
      {/* Layer rings */}
      {[0, 1, 2, 3].map(i => (
        <ellipse
          key={i}
          cx="50"
          cy={38 + i * 8}
          rx="25"
          ry="4"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.5"
          opacity="0.4"
        />
      ))}
    </svg>
  );
}

// Isometric triangular prism
function IsometricPrism({ size, baseColor, accentColor }: { size: number; baseColor: string; accentColor: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Top face */}
      <polygon
        points="50,15 80,45 50,55 20,45"
        fill={accentColor}
      />
      {/* Left face */}
      <polygon
        points="20,45 50,55 50,85 20,75"
        fill={baseColor}
        style={{ filter: 'brightness(0.75)' }}
      />
      {/* Right face */}
      <polygon
        points="50,55 80,45 80,75 50,85"
        fill={baseColor}
        style={{ filter: 'brightness(0.55)' }}
      />
    </svg>
  );
}

// L-bracket shape
function IsometricBracket({ size, baseColor, accentColor }: { size: number; baseColor: string; accentColor: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Vertical part - top */}
      <polygon
        points="25,20 45,30 45,40 25,30"
        fill={accentColor}
      />
      {/* Vertical part - front */}
      <polygon
        points="25,30 45,40 45,60 25,50"
        fill={baseColor}
        style={{ filter: 'brightness(0.7)' }}
      />
      {/* Horizontal part - top */}
      <polygon
        points="25,50 75,75 75,65 45,48"
        fill={accentColor}
      />
      {/* Horizontal part - front */}
      <polygon
        points="25,50 25,60 75,85 75,75"
        fill={baseColor}
        style={{ filter: 'brightness(0.8)' }}
      />
      {/* Horizontal part - side */}
      <polygon
        points="75,65 75,85 65,80 65,60"
        fill={baseColor}
        style={{ filter: 'brightness(0.5)' }}
      />
    </svg>
  );
}

// Hook shape
function IsometricHook({ size, baseColor, accentColor }: { size: number; baseColor: string; accentColor: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Back plate */}
      <rect x="25" y="20" width="8" height="50" fill={baseColor} style={{ filter: 'brightness(0.6)' }} />
      <rect x="25" y="20" width="20" height="8" fill={accentColor} />
      {/* Hook curve */}
      <path
        d="M 45 28 Q 70 28, 70 50 Q 70 65, 55 65"
        fill="none"
        stroke={baseColor}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 45 20 Q 78 20, 78 50 Q 78 72, 55 72"
        fill="none"
        stroke={accentColor}
        strokeWidth="2"
      />
    </svg>
  );
}

// Tray/container shape
function IsometricTray({ size, baseColor, accentColor }: { size: number; baseColor: string; accentColor: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Bottom */}
      <polygon
        points="50,50 80,65 50,80 20,65"
        fill={baseColor}
        style={{ filter: 'brightness(0.5)' }}
      />
      {/* Left wall outer */}
      <polygon
        points="20,40 50,25 50,50 20,65"
        fill={baseColor}
        style={{ filter: 'brightness(0.7)' }}
      />
      {/* Right wall outer */}
      <polygon
        points="50,25 80,40 80,65 50,50"
        fill={baseColor}
        style={{ filter: 'brightness(0.55)' }}
      />
      {/* Top rim */}
      <polygon
        points="50,25 80,40 50,55 20,40"
        fill={accentColor}
        style={{ filter: 'brightness(1.1)' }}
      />
      {/* Inner cavity hint */}
      <polygon
        points="50,35 70,45 50,55 30,45"
        fill={baseColor}
        style={{ filter: 'brightness(0.4)' }}
      />
    </svg>
  );
}

// Grid of products for showcase
interface ProductGridProps {
  products: Array<{ name: string; category?: string }>;
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)}>
      {products.slice(0, 8).map((product, i) => (
        <div key={i} className="flex flex-col items-center">
          <Product3DRender
            productName={product.name}
            category={product.category}
            size="sm"
          />
          <span className="text-[10px] text-zinc-500 truncate max-w-full mt-1">
            {product.name.split(' ').slice(-2).join(' ')}
          </span>
        </div>
      ))}
    </div>
  );
}
