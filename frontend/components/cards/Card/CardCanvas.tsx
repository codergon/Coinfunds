"use client";

import { useRef } from "react";
import * as THREE from "three";
import { randomInteger } from "@/utils/math";
import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";

import noise from "./shaders/noise";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";

const elWidth = 342;
const elHeight = 205;
const distortionHeight = 0.8;
const camera = new THREE.PerspectiveCamera(75, elWidth / elHeight, 0.1, 1000);

interface CardCanvasProps {
  hovered: boolean;
  colorsIndex: number;
}

const colors = [
  { low: new THREE.Color(0, 114, 255), high: new THREE.Color(48, 0, 255) },
  { low: new THREE.Color(236, 166, 15), high: new THREE.Color(233, 104, 0) },
  { low: new THREE.Color(175, 49, 49), high: new THREE.Color(123, 16, 16) },
  { low: new THREE.Color(43, 75, 235), high: new THREE.Color(213, 51, 248) },
];

function getColor(currentNumber: number) {
  const nextIndex = currentNumber % colors?.length;
  const nextItemIndex = nextIndex <= colors?.length ? nextIndex : 0;
  return colors[nextItemIndex];
}

const CustomShaderMaterial = shaderMaterial(
  {
    time: 0,
    height: distortionHeight,
    lowcolor: new THREE.Color(0, 114, 255),
    highcolor: new THREE.Color(48, 0, 255),
    randnum: new THREE.Vector2(randomInteger(2, 10), randomInteger(8, 10)),
  },
  noise + vertexShader,
  noise + fragmentShader
);

extend({ CustomShaderMaterial });

const WavePlane = ({ hovered = false, colorsIndex }: CardCanvasProps) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // @ts-ignore
    mesh.current.material.uniforms.time.value += delta / 1.5;
    if (hovered) {
      // @ts-ignore
      if (mesh.current.material.uniforms.height.value >= 0.5) {
        // @ts-ignore
        mesh.current.material.uniforms.height.value -= 0.05;
      }
    } else {
      // @ts-ignore
      if (mesh.current.material.uniforms.height.value <= distortionHeight) {
        // @ts-ignore
        mesh.current.material.uniforms.height.value += 0.05;
      }
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, -300]}>
      <planeGeometry args={[950, 950, 100, 100]} />
      {/* @ts-ignore */}
      <customShaderMaterial
        lowcolor={getColor(colorsIndex)?.low}
        highcolor={getColor(colorsIndex)?.high}
      />
    </mesh>
  );
};

const CardCanvas = ({ hovered = false, colorsIndex }: CardCanvasProps) => {
  return (
    <>
      <Canvas dpr={[1, 2]} camera={camera} className="card-canvas">
        <WavePlane hovered={hovered} colorsIndex={colorsIndex} />
      </Canvas>
    </>
  );
};

export default CardCanvas;
