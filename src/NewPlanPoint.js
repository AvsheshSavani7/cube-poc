import React, { forwardRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const NewPlanPoint = ({
  planPoints,
  url,
  radius,
  transparent,
  position,
  onLoad,
  onClick
}) => {
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

  useEffect(() => {
    if (planPoints?.length === 0) {
      // debugger;
      // Remove all child objects from the scene
      const removeSpheres = scene.children.filter(
        (child) => child?.name !== "Sphere"
      );
      scene.children = removeSpheres;
    } else {
      const removeSpheres = scene.children.filter(
        (child) => child?.name !== "Sphere"
      );
      scene.children = removeSpheres;
      planPoints?.forEach((cordinate, i) => {
        console.log(cordinate[0][0]);
        const dotGeometry = new THREE.SphereGeometry(1);
        const dotMaterial = new THREE.MeshBasicMaterial({
          color: cordinate[1]
        });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.copy(
          new THREE.Vector3(cordinate[0][0], cordinate[0][1], 0)
        );
        dot.name = `Sphere`;
        scene.add(dot);
      });
    }
  }, [planPoints]);

  // Add Axis Helper
  const axisHelper = new THREE.AxesHelper(100); // Adjust the size as needed
  scene.add(axisHelper);

  console.log(planPoints);

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
};

export default NewPlanPoint;
