"use client"

import { useState, useEffect } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number
}

export function AnimatedNumber({ value, duration = 1000 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    let startTime: number
    let animationFrame: number
    const startValue = displayValue

    const updateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setDisplayValue(Math.floor(startValue + progress * (value - startValue)))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue)
      }
    }

    animationFrame = requestAnimationFrame(updateValue)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration, displayValue]) // Added displayValue to dependencies

  return <span>{displayValue.toLocaleString()}</span>
}

