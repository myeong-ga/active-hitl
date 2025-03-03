"use client"

import { useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { useRef } from "react"

interface Activity {
  type: string
  count: number
  color: string
  timestamp: number
}

export function Scene({ activities }: { activities: Activity[] }) {
  const composerRef = useRef<any>(null)

  useFrame((_, delta) => {
    composerRef.current?.render(delta)
  })

  return (
    <>
      
      <EffectComposer ref={composerRef}>
        <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} />
        <ChromaticAberration offset={[0.002, 0.002]} blendFunction={BlendFunction.NORMAL} />
        <Noise opacity={0.05} />
      </EffectComposer>
    </>
  )
}

