import { useFrame } from "@react-three/fiber";
import "./util";

const CurvedPlane = ({ curvature }) => {
  const meshRef = useRef();

  // Update shader uniform values on each frame
  useFrame(() => {
    meshRef.current.material.uniforms.curvature.value = curvature;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 5, 100, 100]} />
      <customShaderMaterial
        uniforms={{ curvature: { value: curvature } }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};
