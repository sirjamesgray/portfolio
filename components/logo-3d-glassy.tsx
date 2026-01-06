"use client"

import { useRef, Suspense, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { MeshTransmissionMaterial, Float, RoundedBox } from "@react-three/drei"
import * as THREE from "three"
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { getLogoColors, type Logo3DThemeColors } from "@/lib/logo-colors"

interface Logo3DProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "qa" | "hero"
  static?: boolean
}

const containerSizes = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
  qa: "h-[400px] w-[400px]",
  hero: "h-[600px] w-[600px] md:h-[750px] md:w-[750px] lg:h-[900px] lg:w-[900px]",
}

// SVG path data for the logo
const SVG_DATA = `<svg width="174" height="174" viewBox="0 0 174 174" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5 132.5V99.2568C11.5 97.0477 13.2909 95.2568 15.5 95.2568C17.7091 95.2568 19.5 97.0477 19.5 99.2568V132.5C19.5 146.031 30.469 157 44 157C57.531 157 68.5 146.031 68.5 132.5V64.4727C68.4998 37.0694 47.1693 17 15.5 17C13.2909 17 11.5 15.2091 11.5 13C11.5 10.7909 13.2909 9 15.5 9H72.5C74.7091 9 76.5 10.7909 76.5 13V132.5C76.5 150.449 61.9492 165 44 165C26.0507 165 11.5 150.449 11.5 132.5Z" fill="white"/>
<path d="M105.5 132.5V41.5C105.5 27.969 116.469 17 130 17C143.531 17 154.5 27.969 154.5 41.5V55.4727C154.5 57.6818 156.291 59.4727 158.5 59.4727C160.709 59.4727 162.5 57.6818 162.5 55.4727V41.5C162.5 23.5507 147.949 9 130 9C112.051 9 97.5 23.5507 97.5 41.5V132.5C97.5 150.481 112.259 165 130.176 165C147.623 165 162.043 151.083 162.489 133.681L162.5 132.85V99.2568C162.5 97.0477 160.709 95.2568 158.5 95.2568H116.79C114.581 95.2569 112.79 97.0477 112.79 99.2568C112.79 101.466 114.581 103.257 116.79 103.257C128.271 103.257 137.758 106.164 144.275 111.21C150.683 116.17 154.5 123.393 154.5 132.85L154.492 133.472C154.157 146.492 143.337 157 130.176 157C116.613 157 105.5 145.999 105.5 132.5Z" fill="white"/>
</svg>`

/**
 * 3D Extruded Logo - Creates the JG letters by extruding the SVG paths
 * Supports opacity for fade effect during rotation
 */
function ExtrudedLogo({
  logoColor,
  emissive,
  emissiveIntensity,
  opacity = 1,
  flipped = false,
}: {
  logoColor: string
  emissive: string
  emissiveIntensity: number
  opacity?: number
  flipped?: boolean
}) {
  const [shapes, setShapes] = useState<THREE.Shape[]>([])

  useEffect(() => {
    const loader = new SVGLoader()
    const svgData = loader.parse(SVG_DATA)
    const allShapes: THREE.Shape[] = []

    svgData.paths.forEach((path) => {
      const pathShapes = SVGLoader.createShapes(path)
      allShapes.push(...pathShapes)
    })

    setShapes(allShapes)
  }, [])

  const extrudeSettings = useMemo(() => ({
    depth: 8,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 2,
    bevelOffset: 0,
    bevelSegments: 8,
  }), [])

  if (shapes.length === 0) return null

  // Scale and center the logo
  const scale = 1 / 100
  const offsetX = -87
  const offsetY = -87

  // When flipped, mirror on X axis
  const scaleX = flipped ? -scale : scale

  return (
    <group
      scale={[scaleX, -scale, scale]}
      position={[offsetX * scale * (flipped ? -1 : 1), -offsetY * scale, -0.04]}
    >
      {shapes.map((shape, i) => (
        <mesh key={i}>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial
            color={logoColor}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            metalness={0.2}
            roughness={0.3}
            transparent={opacity < 1}
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Glass cube that contains the logo (optionally rotating)
 * Implements fade-flip to always show JG correctly (never reversed)
 */
function GlassCube({ isStatic = false, colors, isDark }: { isStatic?: boolean; colors: Logo3DThemeColors; isDark: boolean }) {
  const cubeRef = useRef<THREE.Group>(null)
  const [logoOpacity, setLogoOpacity] = useState(1)
  const [isFlipped, setIsFlipped] = useState(false)
  const rotationRef = useRef(0)

  useFrame((_, delta) => {
    if (cubeRef.current && !isStatic) {
      // Update rotation
      rotationRef.current += delta * 0.3
      cubeRef.current.rotation.y = rotationRef.current

      // Normalize rotation to 0-2PI
      const normalizedRotation = rotationRef.current % (Math.PI * 2)

      // Calculate how close we are to 90° or 270° (where logo would be sideways/reversed)
      // At these angles, we fade out, flip, and fade back in
      const fadeZone = 0.3 // radians (~17°) - how wide the fade zone is

      // Check if we're near 90° (PI/2) or 270° (3*PI/2)
      const distTo90 = Math.abs(normalizedRotation - Math.PI / 2)
      const distTo270 = Math.abs(normalizedRotation - (3 * Math.PI / 2))

      const minDist = Math.min(distTo90, distTo270)

      if (minDist < fadeZone) {
        // We're in the fade zone - calculate opacity (0 at center, 1 at edges)
        const newOpacity = minDist / fadeZone
        setLogoOpacity(newOpacity)

        // At the very center of the fade zone, flip the logo
        if (minDist < 0.05) {
          // Determine if we should be flipped based on rotation
          // Front-facing: 0° to 90° and 270° to 360°
          // Back-facing (should flip): 90° to 270°
          const shouldBeFlipped = normalizedRotation > Math.PI / 2 && normalizedRotation < (3 * Math.PI / 2)
          if (shouldBeFlipped !== isFlipped) {
            setIsFlipped(shouldBeFlipped)
          }
        }
      } else {
        setLogoOpacity(1)
      }
    }
  })

  return (
    <Float speed={isStatic ? 0 : 1.5} rotationIntensity={0} floatIntensity={isStatic ? 0 : 0.2}>
      <group ref={cubeRef}>
        {/* Glass cube with rounded corners */}
        <RoundedBox args={[2, 2, 2]} radius={0.25} smoothness={8}>
          <MeshTransmissionMaterial
            thickness={isDark ? 0.2 : 0.3}
            roughness={isDark ? 0.05 : 0.1}
            transmission={isDark ? 0.98 : 0.95}
            ior={isDark ? 1.3 : 1.4}
            chromaticAberration={isDark ? 0.02 : 0.01}
            backside={true}
            backsideThickness={isDark ? 0.2 : 0.3}
            distortion={0.02}
            distortionScale={0.05}
            temporalDistortion={0.01}
            color={colors.cube}
            attenuationColor={colors.cubeAttenuation}
            attenuationDistance={isDark ? 3 : 2}
          />
        </RoundedBox>

        {/* 3D Extruded Logo inside - with fade-flip effect */}
        <ExtrudedLogo
          logoColor={colors.logo}
          emissive={colors.logoEmissive}
          emissiveIntensity={colors.logoEmissiveIntensity}
          opacity={logoOpacity}
          flipped={isFlipped}
        />
      </group>
    </Float>
  )
}

/**
 * Scene with simple lighting
 */
function Scene({ isStatic = false, colors, isDark }: { isStatic?: boolean; colors: Logo3DThemeColors; isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.4 : 0.8} />
      {/* Main key light from top-right */}
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 0.8 : 1.4} />
      {/* Fill light from left */}
      <directionalLight position={[-5, -5, 5]} intensity={isDark ? 0.3 : 0.5} />
      {/* Top-right highlight cluster for glass reflection */}
      <pointLight position={[3, 3, 3]} intensity={isDark ? 0.4 : 0.6} color="#ffffff" />
      <pointLight position={[2.5, 2, 4]} intensity={isDark ? 0.2 : 0.4} color="#a7f3d0" />
      <pointLight position={[4, 2.5, 2]} intensity={isDark ? 0.15 : 0.3} color="#34d399" />
      {/* Subtle rim light from bottom-left */}
      <pointLight position={[-3, -2, 3]} intensity={isDark ? 0.1 : 0.2} color="#a7f3d0" />
      <GlassCube isStatic={isStatic} colors={colors} isDark={isDark} />
    </>
  )
}

/**
 * Loading fallback
 */
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshBasicMaterial color="#10b981" wireframe opacity={0.5} transparent />
    </mesh>
  )
}

/**
 * Main 3D Glass Logo Component
 */
export function Logo3D({ className, size = "md", static: isStatic = false }: Logo3DProps) {
  const containerClass = containerSizes[size]
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get colors based on theme (default to light if not mounted)
  const isDark = mounted && resolvedTheme === "dark"
  const colors = getLogoColors(isDark)

  return (
    <div className={cn(containerClass, "relative cursor-pointer", className)}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
        frameloop={isStatic ? "demand" : "always"}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene isStatic={isStatic} colors={colors} isDark={isDark} />
        </Suspense>
      </Canvas>
    </div>
  )
}

/**
 * Lightweight CSS alternative
 */
export function Logo3DLite({ className, size = "md" }: Logo3DProps) {
  const containerClass = containerSizes[size]

  return (
    <div className={cn(containerClass, "relative", className)}>
      <div className="absolute inset-0 animate-spin-slow">
        <div
          className="h-full w-full rounded-lg"
          style={{
            background: "linear-gradient(135deg, #059669 0%, #22c55e 50%, #14b8a6 100%)",
            transform: "perspective(100px) rotateY(15deg) rotateX(5deg)",
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
          }}
        />
      </div>
    </div>
  )
}
