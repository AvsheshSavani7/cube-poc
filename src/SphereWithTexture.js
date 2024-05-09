import React from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import glsl from "glslify";

// Vertex Shader (common)
const vertexShader = glsl`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
  }
`;

// Fragment Shader for CustomMaterial (Inner Sphere)
const fragmentShaderInner = glsl`
  uniform sampler2D map;
  varying vec2 vUv;
  void main() {
    gl_FragColor = texture2D(map, vUv);
  }
`;

// Fragment Shader for FrameMaterial (Outer Sphere)
const fragmentShaderOuter = glsl`
  uniform sampler2D roomTexture;
  uniform sampler2D frameTexture;
  uniform vec2 frameUV; // Center UV of the frame
  uniform float frameSize; // Size of the frame (0.1 for 10% of total texture size)

  varying vec2 vUv;

  void main() {
    float distance = length(vUv - frameUV);
    if (distance < frameSize) {
      vec2 framedUV = (vUv - (frameUV - vec2(frameSize))) / (2.0 * vec2(frameSize));
      gl_FragColor = texture2D(frameTexture, framedUV);
    } else {
      gl_FragColor = texture2D(roomTexture, vUv);
    }
  }
`;

// Extend shaderMaterial to use in JSX
const CustomMaterial = shaderMaterial(
  { map: null },
  vertexShader,
  fragmentShaderInner
);

const FrameMaterial = shaderMaterial(
  {
    roomTexture: null,
    frameTexture: null,
    frameUV: new THREE.Vector2(),
    frameSize: 0.1
  },
  vertexShader,
  fragmentShaderOuter
);

extend({ CustomMaterial, FrameMaterial });

// Sphere Component
const SphereWithTexture = ({ url }) => {
  const roomTexture = useTexture(url, (tex) => {
    tex.mapping = THREE.EquirectangularRefractionMapping;
  });

  const floorTexture = useTexture("/floor_img.jpeg", (tex) => {
    tex.mapping = THREE.EquirectangularRefractionMapping;
  });

  const calculateUV = (position) => {
    const radius = position.length(); // Assuming position is a THREE.Vector3
    const normalized = position.clone().normalize();

    const u = 0.5 + Math.atan2(normalized.z, normalized.x) / (2 * Math.PI);
    const v = 0.5 - Math.asin(normalized.y / radius) / Math.PI;

    return new THREE.Vector2(u, v);
  };

  const floorTexturePosition = new THREE.Vector3(
    0.4059333211441032,
    0.27680606374314504,
    1.246186425373486
  );

  const floorTextureUV = calculateUV(floorTexturePosition);

  return (
    <>
      {/* <mesh position={[-2, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <customMaterial map={floorTexture} />
      </mesh> */}
      <mesh>
        <sphereGeometry args={[2.7, 32, 32]} />
        <frameMaterial
          roomTexture={roomTexture}
          frameTexture={floorTexture}
          frameUV={floorTextureUV}
          frameSize={0.05}
          // frameMin={[0.2, 0.3]}
          // frameMax={[0.4, 0.5]}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

export default SphereWithTexture;
