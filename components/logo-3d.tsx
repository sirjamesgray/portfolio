"use client"

import { useRef, Suspense, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface Logo3DProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "qa" | "hero"
}

const containerSizes = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
  qa: "h-[400px] w-[400px]",
  hero: "h-[90vw] w-[90vw] max-h-[800px] max-w-[800px] md:h-[850px] md:w-[850px] md:max-h-none md:max-w-none lg:h-[1000px] lg:w-[1000px]",
}

// Color configuration
const COLORS = {
  light: {
    cubeEdge: "rgba(4, 120, 87, 0.7)",       // emerald-700 at 70%
    cubeGrid: "rgba(16, 185, 129, 0.25)",    // emerald-500 at 25%
    logoEdge: "rgba(4, 120, 87, 1)",         // emerald-700 solid
    logoFill: "rgba(16, 185, 129, 0.4)",     // emerald-500 at 40%
    logoEmissive: "rgba(0, 0, 0, 0)",
    logoEmissiveIntensity: 0,
  },
  dark: {
    cubeEdge: "rgba(52, 211, 153, 0.9)",     // emerald-400 at 90%
    cubeGrid: "rgba(16, 185, 129, 0.35)",    // emerald-500 at 35%
    logoEdge: "rgba(110, 231, 183, 1)",      // emerald-300 solid
    logoFill: "rgba(52, 211, 153, 0.5)",     // emerald-400 at 50%
    logoEmissive: "rgba(52, 211, 153, 1)",   // emerald-400 glow
    logoEmissiveIntensity: 0.8,
  },
}

// NEW sharper SVG path data (from public/logo.svg)
const SVG_DATA = `<svg width="174" height="174" viewBox="0 0 174 174" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.501 132.5V95.2568H21.501V132.5C21.501 146.031 32.47 157 46.001 157C59.5317 157 70.501 146.031 70.501 132.5V64.4727C70.5008 37.3964 45.5465 17 13.499 17V9H78.501V132.5C78.501 150.449 63.95 165 46.001 165C28.0517 165 13.501 150.449 13.501 132.5Z" fill="white"/>
<path d="M107.501 132.5V41.5C107.501 27.969 118.47 17 132.001 17C145.532 17 156.501 27.969 156.501 41.5V59.4727H164.501V41.5C164.501 23.5507 149.95 9 132.001 9C114.052 9 99.501 23.5507 99.501 41.5V132.5C99.501 150.481 114.26 165 132.177 165C149.624 165 164.044 151.083 164.49 133.681L164.501 132.85V95.2568H118.791V103.257C130.272 103.257 139.759 106.164 146.276 111.21C152.684 116.17 156.501 123.393 156.501 132.85L156.493 133.472C156.158 146.492 145.338 157 132.177 157C118.614 157 107.501 145.999 107.501 132.5Z" fill="white"/>
</svg>`

/**
 * Creates grid lines for a single face of the cube
 */
function createFaceGridGeometry(
  gridCount: number,
  size: number,
  axis: "xy" | "xz" | "yz",
  offset: number
): THREE.BufferGeometry {
  const points: THREE.Vector3[] = []
  const half = size / 2
  const step = size / gridCount

  for (let i = 0; i <= gridCount; i++) {
    const pos = -half + i * step

    if (axis === "xy") {
      points.push(new THREE.Vector3(pos, -half, offset), new THREE.Vector3(pos, half, offset))
      points.push(new THREE.Vector3(-half, pos, offset), new THREE.Vector3(half, pos, offset))
    } else if (axis === "xz") {
      points.push(new THREE.Vector3(pos, offset, -half), new THREE.Vector3(pos, offset, half))
      points.push(new THREE.Vector3(-half, offset, pos), new THREE.Vector3(half, offset, pos))
    } else {
      points.push(new THREE.Vector3(offset, pos, -half), new THREE.Vector3(offset, pos, half))
      points.push(new THREE.Vector3(offset, -half, pos), new THREE.Vector3(offset, half, pos))
    }
  }

  return new THREE.BufferGeometry().setFromPoints(points)
}

/**
 * Grid cube with wireframe edges and grid lines on all faces
 */
function GridCube({ edgeColor, gridColor }: { edgeColor: string; gridColor: string }) {
  const gridCount = 8
  const size = 2

  const faceGrids = useMemo(() => [
    createFaceGridGeometry(gridCount, size, "xy", size / 2),
    createFaceGridGeometry(gridCount, size, "xy", -size / 2),
    createFaceGridGeometry(gridCount, size, "xz", size / 2),
    createFaceGridGeometry(gridCount, size, "xz", -size / 2),
    createFaceGridGeometry(gridCount, size, "yz", size / 2),
    createFaceGridGeometry(gridCount, size, "yz", -size / 2),
  ], [])

  return (
    <group>
      {faceGrids.map((geometry, i) => (
        <lineSegments key={i} geometry={geometry}>
          <lineBasicMaterial color={gridColor} transparent opacity={0.5} />
        </lineSegments>
      ))}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2, 2, 2)]} />
        <lineBasicMaterial color={edgeColor} linewidth={2} transparent opacity={0.9} />
      </lineSegments>
    </group>
  )
}

/**
 * 3D Extruded Logo with wireframe outline and subtle fill (for rotating version)
 */
function ExtrudedLogoWireframe({
  logoColor,
  fillColor,
  emissive,
  emissiveIntensity,
  opacity = 1,
  flipped = false,
}: {
  logoColor: string
  fillColor: string
  emissive: string
  emissiveIntensity: number
  opacity?: number
  flipped?: boolean
}) {
  const [geometries, setGeometries] = useState<THREE.ExtrudeGeometry[]>([])

  useEffect(() => {
    const loader = new SVGLoader()
    const svgData = loader.parse(SVG_DATA)
    const allShapes: THREE.Shape[] = []

    svgData.paths.forEach((path) => {
      const pathShapes = SVGLoader.createShapes(path)
      allShapes.push(...pathShapes)
    })

    const extrudeSettings = {
      depth: 8,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 2,
    }

    const geos = allShapes.map(shape => new THREE.ExtrudeGeometry(shape, extrudeSettings))
    setGeometries(geos)
  }, [])

  if (geometries.length === 0) return null

  const scale = 1 / 100
  const offsetX = -87
  const offsetY = -87
  const scaleX = flipped ? -scale : scale

  return (
    <group
      scale={[scaleX, -scale, scale]}
      position={[offsetX * scale * (flipped ? -1 : 1), -offsetY * scale, -0.04]}
    >
      {geometries.map((geometry, i) => (
        <group key={i}>
          <mesh geometry={geometry}>
            <meshStandardMaterial
              color={fillColor}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
              metalness={0.1}
              roughness={0.6}
              transparent
              opacity={opacity * 0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[geometry, 15]} />
            <lineBasicMaterial color={logoColor} transparent opacity={opacity} />
          </lineSegments>
        </group>
      ))}
    </group>
  )
}

interface ThemeColors {
  cubeEdge: string
  cubeGrid: string
  logoEdge: string
  logoFill: string
  logoEmissive: string
  logoEmissiveIntensity: number
}

/**
 * Rotating cube with logo - handles rotation and smooth crossfade between normal and flipped
 */
function RotatingLogoCube({ colors }: { colors: ThemeColors }) {
  const cubeRef = useRef<THREE.Group>(null)
  const [normalOpacity, setNormalOpacity] = useState(1)
  const [flippedOpacity, setFlippedOpacity] = useState(0)
  const rotationRef = useRef(0)

  useFrame((_, delta) => {
    if (cubeRef.current) {
      rotationRef.current += delta * 0.3
      cubeRef.current.rotation.y = rotationRef.current

      const normalizedRotation = rotationRef.current % (Math.PI * 2)
      const fadeZone = 0.5

      // Calculate distance to 90° and 270° transition points
      const distTo90 = Math.abs(normalizedRotation - Math.PI / 2)
      const distTo270 = Math.abs(normalizedRotation - (3 * Math.PI / 2))

      // Determine which logo should be dominant based on rotation
      const shouldShowFlipped = normalizedRotation > Math.PI / 2 && normalizedRotation < (3 * Math.PI / 2)

      // Near 90° or 270°, crossfade between the two logos
      const minDist = Math.min(distTo90, distTo270)

      if (minDist < fadeZone) {
        // t goes from 0 (at transition point) to 1 (outside fade zone)
        const t = minDist / fadeZone
        const eased = t * t * (3 - 2 * t) // smoothstep

        if (shouldShowFlipped) {
          // In flipped region: flipped is dominant, normal fades out
          setFlippedOpacity(1)
          setNormalOpacity(1 - eased < 0.01 ? 0 : 1 - eased)
        } else {
          // In normal region: normal is dominant, flipped fades out
          setNormalOpacity(1)
          setFlippedOpacity(1 - eased < 0.01 ? 0 : 1 - eased)
        }
      } else {
        // Outside fade zone: show only the appropriate logo
        if (shouldShowFlipped) {
          setFlippedOpacity(1)
          setNormalOpacity(0)
        } else {
          setNormalOpacity(1)
          setFlippedOpacity(0)
        }
      }
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
      <group ref={cubeRef}>
        <GridCube edgeColor={colors.cubeEdge} gridColor={colors.cubeGrid} />
        {/* Normal (non-flipped) logo */}
        {normalOpacity > 0 && (
          <ExtrudedLogoWireframe
            logoColor={colors.logoEdge}
            fillColor={colors.logoFill}
            emissive={colors.logoEmissive}
            emissiveIntensity={colors.logoEmissiveIntensity}
            opacity={normalOpacity}
            flipped={false}
          />
        )}
        {/* Flipped logo */}
        {flippedOpacity > 0 && (
          <ExtrudedLogoWireframe
            logoColor={colors.logoEdge}
            fillColor={colors.logoFill}
            emissive={colors.logoEmissive}
            emissiveIntensity={colors.logoEmissiveIntensity}
            opacity={flippedOpacity}
            flipped={true}
          />
        )}
      </group>
    </Float>
  )
}

/**
 * Scene for rotating version
 */
function RotatingScene({ colors, isDark }: { colors: ThemeColors; isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 0.9} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 0.7 : 1.2} />
      <directionalLight position={[-5, -5, 5]} intensity={isDark ? 0.3 : 0.4} />
      <pointLight position={[3, 3, 3]} intensity={isDark ? 0.3 : 0.5} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={isDark ? 0.1 : 0.2} color="#a7f3d0" />
      <RotatingLogoCube colors={colors} />
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
 * Static Logo Component - Flat square with SVG logo (no 3D)
 * Lightweight CSS/SVG version for headers
 */
export function Logo3DStatic({ className, size = "md" }: Logo3DProps) {
  const containerClass = containerSizes[size]
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <div className={cn(containerClass, "relative cursor-pointer", className)}>
      {/* Square border */}
      <div
        className={cn(
          "absolute inset-0 border-2",
          isDark ? "border-emerald-400/80" : "border-emerald-700/70"
        )}
      />
      {/* Flat SVG logo */}
      <svg
        viewBox="0 0 174 174"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full p-2"
      >
        <path
          d="M13.501 132.5V95.2568H21.501V132.5C21.501 146.031 32.47 157 46.001 157C59.5317 157 70.501 146.031 70.501 132.5V64.4727C70.5008 37.3964 45.5465 17 13.499 17V9H78.501V132.5C78.501 150.449 63.95 165 46.001 165C28.0517 165 13.501 150.449 13.501 132.5Z"
          className={isDark ? "fill-emerald-300" : "fill-emerald-700"}
        />
        <path
          d="M107.501 132.5V41.5C107.501 27.969 118.47 17 132.001 17C145.532 17 156.501 27.969 156.501 41.5V59.4727H164.501V41.5C164.501 23.5507 149.95 9 132.001 9C114.052 9 99.501 23.5507 99.501 41.5V132.5C99.501 150.481 114.26 165 132.177 165C149.624 165 164.044 151.083 164.49 133.681L164.501 132.85V95.2568H118.791V103.257C130.272 103.257 139.759 106.164 146.276 111.21C152.684 116.17 156.501 123.393 156.501 132.85L156.493 133.472C156.158 146.492 145.338 157 132.177 157C118.614 157 107.501 145.999 107.501 132.5Z"
          className={isDark ? "fill-emerald-300" : "fill-emerald-700"}
        />
      </svg>
    </div>
  )
}

/**
 * Rotating 3D Logo Component - Cube with wireframe grid and JG (for hero)
 */
export function Logo3DRotating({ className, size = "qa" }: Logo3DProps) {
  const containerClass = containerSizes[size]
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"
  const colors = isDark ? COLORS.dark : COLORS.light

  return (
    <div className={cn(containerClass, "relative cursor-pointer", className)}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
        frameloop="always"
      >
        <Suspense fallback={<LoadingFallback />}>
          <RotatingScene colors={colors} isDark={isDark} />
        </Suspense>
      </Canvas>
    </div>
  )
}

/**
 * Backwards-compatible Logo3D - redirects to appropriate component
 */
export function Logo3D({ className, size = "md", static: isStatic = false }: Logo3DProps & { static?: boolean }) {
  if (isStatic) {
    return <Logo3DStatic className={className} size={size} />
  }
  return <Logo3DRotating className={className} size={size} />
}
