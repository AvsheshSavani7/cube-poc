import React from "react";
import { Sphere, useTexture } from "@react-three/drei/core";

const SphereImg = ({ imageUrl }) => {
  const texture = useTexture(imageUrl);

  return (
    <Sphere args={[2.8, 32, 32]}>
      <meshBasicMaterial attach="material" map={texture} side={2} />
    </Sphere>
  );
};

export default SphereImg;
