"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const fragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;

  float gaussian(float x, float sigma) {
    return exp(-(x * x) / (2.0 * sigma * sigma));
  }

  void main() {
    float glow = 0.3 / (abs(vUv.y - mod(time, 1.0)) * 3.0);
    vec3 finalColor = color * (glow + 0.5);
    
    // Enhanced scatter effect
    float scatter = gaussian(abs(vUv.y - mod(time, 1.0)), 0.15) * 1.0;
    finalColor += color * scatter;

    // Add pulsating effect
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    finalColor *= 0.8 + pulse * 0.4;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

interface ActivityColumnProps {
  position: [number, number, number]
  color: string
  height: number
  speed?: number
}

export function ActivityColumn({ position, color, height, speed = 1 }: ActivityColumnProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      color: { value: new THREE.Color(color) },
    }),
    [color],
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime() * speed
    }
  })

  const safeHeight = Math.max(0.1, height)

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.5, safeHeight]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

