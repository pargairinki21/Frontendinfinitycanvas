// src/components/three/useCircularTexture.js
import { useMemo } from 'react'
import * as THREE from 'three'

export function useCircularTexture() {
  return useMemo(() => {
    const size = 65; // higher resolution for smooth edges
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)
    ctx.beginPath()
    ctx.arc(size / 2, size/2, size / 2, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = '#ffffff'
    ctx.shadowBlur = 2 // subtle blur for antialiasing
    ctx.fill()
    return new THREE.CanvasTexture(canvas)
  }, [])
} 