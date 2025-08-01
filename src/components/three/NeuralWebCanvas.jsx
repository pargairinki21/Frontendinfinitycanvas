// src/components/three/NeuralWebCanvas.jsx
import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { Points } from '@react-three/drei'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { useCircularTexture } from './useCircularTexture'

// Point Shader
const PointShaderMaterial = shaderMaterial(
  {
    // uColor removed, now using per-vertex color
    uTexture: null,
    uTime: 0,
  },
  `
    uniform float uTime;
    varying vec2 vUv;
    attribute vec3 color;
    varying vec3 vColor;
    void main() {
      vUv = uv;
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float pulse = sin(uTime * 2.0 + position.x * 5.0) * 0.5 + 1.0;
      gl_PointSize = pulse * 44.0 / -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  `
    uniform sampler2D uTexture;
    varying vec2 vUv;
    varying vec3 vColor;
    void main() {
      vec4 tex = texture2D(uTexture, gl_PointCoord);
      if (tex.a < 0.1) discard;
      gl_FragColor = vec4(vColor, tex.a);
    }
  `
)
extend({ PointShaderMaterial })

// Line Shader
const LineShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#ffffff'),
  },
  `
    uniform float uTime;
    varying float vAlpha;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float shimmer = sin(uTime * 2.0 + position.x * 5.0 + position.y * 3.0) * 0.3 + 0.7;
      vAlpha = shimmer;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  `
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      gl_FragColor = vec4(uColor, vAlpha);
    }
  `
)
extend({ LineShaderMaterial })

const CONFIG = {
  count: 60,
  connectionDistance: 0.6,
  nodeSize: 0.3,
  nodeColor: '#E6DDFC',    // White nodes
  lineColor: '#91C8E4',    // Blue lines
  background: '#33048E',   // Deep purple background
  motionRange: 2.0,        // Increased from 0.7 to 2.0 for bigger motion
}

// PREVIOUS CONFIG - COMMENTED OUT
/*
const CONFIG = {
  count: 60,
  connectionDistance: 0.6,
  nodeSize: 0.3,
  nodeColor: '#E6DDFC',    // White nodes
  lineColor: '#91C8E4',    // Blue lines
  background: '#33048E',   // Deep purple background
  motionRange: 0.7,        // Original motion range
}
*/

const NeuralWeb = () => {
  const { camera } = useThree()
  const nodesRef = useRef()
  const lineRef = useRef()
  const shaderRef = useRef()
  const lineShaderRef = useRef()
  const positions = useRef(new Float32Array(CONFIG.count * 3))
  const velocities = useRef(new Float32Array(CONFIG.count * 3))
  const circularTexture = useCircularTexture()
  const mouse = useRef(new THREE.Vector3())
  const colors = useRef(new Float32Array(CONFIG.count * 3))

  useEffect(() => {
    // All nodes use the same color #D9DDDC
    for (let i = 0; i < CONFIG.count; i++) {
      const idx = i * 3
      positions.current[idx] = (Math.random() - 0.5) * 4      // Increased from 2 to 4 for wider horizontal spread
      positions.current[idx + 1] = (Math.random() - 0.5) * 4   // Increased from 2 to 4 for wider vertical spread
      positions.current[idx + 2] = (Math.random() - 0.5) * 2   // Keep depth the same

      velocities.current[idx] = (Math.random() - 0.5) * 0.015      // Increased from 0.005 to 0.015
      velocities.current[idx + 1] = (Math.random() - 0.5) * 0.015   // Increased from 0.005 to 0.015
      velocities.current[idx + 2] = (Math.random() - 0.5) * 0.015   // Increased from 0.005 to 0.015

      const color = new THREE.Color(CONFIG.nodeColor)
      colors.current[idx] = color.r
      colors.current[idx + 1] = color.g
      colors.current[idx + 2] = color.b
    }
  }, [])

  // PREVIOUS POSITION AND VELOCITY INITIALIZATION - COMMENTED OUT
  /*
  useEffect(() => {
    // All nodes use the same color #D9DDDC
    for (let i = 0; i < CONFIG.count; i++) {
      const idx = i * 3
      positions.current[idx] = (Math.random() - 0.5) * 2      // Original horizontal spread
      positions.current[idx + 1] = (Math.random() - 0.5) * 2   // Original vertical spread
      positions.current[idx + 2] = (Math.random() - 0.5) * 2   // Original depth

      velocities.current[idx] = (Math.random() - 0.5) * 0.005      // Original velocity
      velocities.current[idx + 1] = (Math.random() - 0.5) * 0.005   // Original velocity
      velocities.current[idx + 2] = (Math.random() - 0.5) * 0.005   // Original velocity

      const color = new THREE.Color(CONFIG.nodeColor)
      colors.current[idx] = color.r
      colors.current[idx + 1] = color.g
      colors.current[idx + 2] = color.b
    }
  }, [])
  */

  useEffect(() => {
    if (lineRef.current) {
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(), 3))
      lineRef.current.geometry = geometry
    }
    if (nodesRef.current?.geometry) {
      nodesRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors.current, 3))
    }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const vector = new THREE.Vector3().copy(mouse.current).unproject(camera)

    for (let i = 0; i < CONFIG.count; i++) {
      const idx = i * 3
      positions.current[idx] += Math.sin(t + i) * CONFIG.motionRange * velocities.current[idx]
      positions.current[idx + 1] += Math.cos(t + i * 0.5) * CONFIG.motionRange * velocities.current[idx + 1]
      positions.current[idx + 2] += Math.sin(t + i * 0.3) * CONFIG.motionRange * velocities.current[idx + 2]

      const px = positions.current[idx]
      const py = positions.current[idx + 1]
      const pz = positions.current[idx + 2]

      const dx = px - vector.x
      const dy = py - vector.y
      const dz = pz - vector.z
      const distSq = dx * dx + dy * dy + dz * dz
      const force = Math.exp(-distSq * 5) * 0.02
      positions.current[idx] += dx * force
      positions.current[idx + 1] += dy * force
      positions.current[idx + 2] += dz * force
    }

    if (nodesRef.current?.geometry) {
      nodesRef.current.geometry.attributes.position.array = positions.current
      nodesRef.current.geometry.attributes.position.needsUpdate = true
      nodesRef.current.geometry.attributes.color.array = colors.current
      nodesRef.current.geometry.attributes.color.needsUpdate = true
    }

    const linePositions = []
    for (let i = 0; i < CONFIG.count; i++) {
      const aIdx = i * 3
      for (let j = i + 1; j < CONFIG.count; j++) {
        const bIdx = j * 3
        const dx = positions.current[aIdx] - positions.current[bIdx]
        const dy = positions.current[aIdx + 1] - positions.current[bIdx + 1]
        const dz = positions.current[aIdx + 2] - positions.current[bIdx + 2]
        const distSq = dx * dx + dy * dy + dz * dz
        if (distSq < CONFIG.connectionDistance * CONFIG.connectionDistance) {
          linePositions.push(
            positions.current[aIdx], positions.current[aIdx + 1], positions.current[aIdx + 2],
            positions.current[bIdx], positions.current[bIdx + 1], positions.current[bIdx + 2]
          )
        }
      }
    }

    if (lineRef.current?.geometry) {
      const array = new Float32Array(linePositions)
      lineRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(array, 3))
      lineRef.current.geometry.computeBoundingSphere()
    }

    if (shaderRef.current) shaderRef.current.uniforms.uTime.value = t
    if (lineShaderRef.current) lineShaderRef.current.uniforms.uTime.value = t
  })

  return (
    <>
      <Points ref={nodesRef} positions={positions.current} stride={3} frustumCulled={false}>
        <pointShaderMaterial
          ref={shaderRef}
          uTexture={circularTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineShaderMaterial
          ref={lineShaderRef}
          uColor={new THREE.Color(CONFIG.lineColor)}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  )
}

const NeuralWebCanvas = () => {
  const mouse = useRef(new THREE.Vector3())
  const handlePointerMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    mouse.current.set(x, y, 0.5)
  }

  return (
    <Canvas
      onPointerMove={handlePointerMove}
      camera={{ position: [0, 0, 3], fov: 60 }}
      gl={{ alpha: true }}
      style={{ background: CONFIG.background }}
    >
      <ambientLight intensity={0.6} />
      <NeuralWeb />
    </Canvas>
  )
}

export default NeuralWebCanvas 