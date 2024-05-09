import React, { forwardRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const SphereLoad = forwardRef(
  ({ url, radius, transparent, position, onLoad, onClick }, ref) => {
    const texture = useTexture(url, (tex) => {
      tex.mapping = THREE.EquirectangularRefractionMapping;
      onLoad?.({ texture: tex });
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // Function to handle the click event on the sphere
    const handleClick = (event) => {
      // Get the intersection point on the sphere
      const intersection = event.point;

      // Call the onClick callback with the intersection point
      onClick?.(intersection);
    };

    return (
      <mesh
        ref={ref}
        position={position}
        onClick={handleClick} // Attach onClick event handler
        userData={{ name: "Sphere" }}
        visible={true}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.BackSide}
          transparent={transparent}
          // wireframe
        />
      </mesh>
    );
  }
);

export default SphereLoad;
