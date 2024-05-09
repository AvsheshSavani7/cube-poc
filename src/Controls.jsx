import React, { forwardRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
// import ArrowKeyControls from "./ArrowKeyControls";

const Controls = forwardRef((props, ref) => {
  const { gl, scene, camera } = useThree();

  const render = () => {
    requestAnimationFrame(render);

    const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
    ref.current?.target.copy(camera.position.clone().add(cameraDirection));

    gl.render(scene, camera);
  };

  useEffect(() => {
    render();
  }, []);

  return (
    <>
      <OrbitControls
        ref={ref}
        target={new THREE.Vector3(-6, 1, 0)}
        enableDamping={true}
        dampingFactor={0.25}
        maxDistance={25}
        minDistance={0}
        rotateSpeed={-0.25}
        zoomSpeed={1}
        enablePan
        enableZoom
        {...props}
      />
      {/* <ArrowKeyControls ref={ref} /> */}
    </>
  );
});

export { Controls };
