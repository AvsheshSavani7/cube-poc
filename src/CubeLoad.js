import React, { forwardRef, useState } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const CubeLoad = forwardRef(
  ({ url, radius, transparent, position, onLoad, onClick }, ref) => {
    const [clickPosition, setClickPosition] = useState(null);
    const texture = useTexture("/pano_4.jpg", (tex) => {
      tex.mapping = THREE.EquirectangularRefractionMapping;
      onLoad?.({ texture: tex });
    });

    const { scene, camera } = useThree();

    // Function to handle the click event on the cube
    const handleClick = (event) => {
      // Get the intersection point on the cube
      const intersection = event.point;

      //   // Create a small dot (sphere geometry) at the intersection point
      //   const dotGeometry = new THREE.SphereGeometry(0.1);
      //   const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      //   const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      //   dot.position.copy(intersection);
      //   scene.add(dot);

      //   // Update click position state
      setClickPosition(intersection);

      // Call the onClick callback with the intersection point
      onClick?.(intersection);
    };
    const dotGeometry = new THREE.SphereGeometry(1);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.copy(new THREE.Vector3(135, 35.26, 0));
    scene.add(dot);

    // Add Axis Helper
    const axisHelper = new THREE.AxesHelper(100); // Adjust the size as needed
    scene.add(axisHelper);

    return (
      <group>
        <mesh
          position={[0, 0, 0]}
          onClick={handleClick}
          userData={{ name: "Cube" }}
        >
          <planeGeometry args={[360, 180, 20, 20]} />
          <meshBasicMaterial
            map={texture}
            side={THREE.FrontSide}
            // wireframe={true}
          />
        </mesh>
      </group>
    );
  }
);

export default CubeLoad;
