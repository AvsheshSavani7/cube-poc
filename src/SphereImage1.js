import React, { useEffect, useRef, useState } from "react";
import { Canvas, extend, useLoader, useThree } from "@react-three/fiber";
import { Image, useTexture } from "@react-three/drei";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// import SphereLoad from "./SphereLoad";
import * as THREE from "three";
import "./util";
import {
  INTERSECTED,
  MeshBVH,
  MeshBVHHelper,
  NOT_INTERSECTED
} from "three-mesh-bvh";
import SphereLoad1 from "./SphereLoad1";

// Extend Three.js with the custom shader material

const SphereImage1 = ({ imageUrl }) => {
  const [intersectionPoint, setIntersectionPoint] = useState([]);
  const [finalized, setFinalized] = useState(false);
  const params = {
    toolMode: "lasso",
    selectionMode: "intersection",
    liveUpdate: false,
    selectModel: false,
    wireframe: false,
    useBoundsTree: true,

    displayHelper: false,
    helperDepth: 10,
    rotate: true
  };
  const handleFinalize = () => {
    setFinalized(true);
  };

  // Callback function to handle the click event on the sphere
  const handleSphereClick = (point) => {
    if (!finalized) {
      let newPoint = [...intersectionPoint, point];
      setIntersectionPoint(newPoint);
    }
  };

  const handleCancle = () => {
    setIntersectionPoint([]);
    setFinalized(false);
  };

  const DrawShape = ({}) => {
    const texture = useLoader(THREE.TextureLoader, "/floor_img.jpeg");
    const { scene, raycaster } = useThree();

    // Create an array to hold references to the boundary meshes
    const boundaryMeshes = useRef([]);

    // Create an array to hold references to the line meshes
    const lineMeshes = useRef([]);

    // Function to create boundaries at each intersection point
    const createBoundaries = () => {
      // Clear previous boundary meshes and lines
      boundaryMeshes.current.forEach((mesh) => scene.remove(mesh));
      boundaryMeshes.current = [];
      lineMeshes.current.forEach((mesh) => scene.remove(mesh));
      lineMeshes.current = [];

      intersectionPoint?.forEach((intersectionPoint1, index) => {
        // Create a sphere to represent the boundary
        const geometry = new THREE.SphereGeometry(0.05, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(intersectionPoint1);
        scene.add(sphere);
        boundaryMeshes.current.push(sphere);
      });
    };

    useEffect(() => {
      createBoundaries();
    }, [finalized]);

    useEffect(() => {
      // Cleanup function to remove boundary meshes and lines when component unmounts
      return () => {
        boundaryMeshes.current.forEach((mesh) => {
          mesh.geometry.dispose();
          scene.remove(mesh);
        });
        lineMeshes.current.forEach((mesh) => {
          mesh.geometry.dispose();
          scene.remove(mesh);
        });
      };
    }, []);

    if (finalized) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1); // Adjust repeat to suit the appearance on your geometry
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      if (!intersectionPoint || intersectionPoint.length < 2) return null;

      let newPt = [...intersectionPoint, intersectionPoint[0]];

      let bufferPt = [];

      const sphereRadius = 2.76;

      // Create a sphere mesh
      let sphere = new THREE.Mesh(
        new THREE.SphereGeometry(sphereRadius, 128, 128).toNonIndexed(),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0.1,
          polygonOffset: true,
          polygonOffsetFactor: 1
        })
      );

      function setArcsOnSphere(
        intersectionPoint,
        smoothness,
        color,
        clockWise
      ) {
        // Sphere radius

        // Loop through each pair of consecutive points
        intersectionPoint.forEach((point, index) => {
          if (index < intersectionPoint.length - 1) {
            const pointStart = point.normalize().multiplyScalar(sphereRadius);
            const pointEnd = intersectionPoint[index + 1]
              .normalize()
              .multiplyScalar(sphereRadius);

            // Calculate the arc between the current pair of points
            const arc = createArc(
              pointStart,
              pointEnd,
              smoothness,
              color,
              clockWise
            );
            sphere.add(arc);
          }
        });
      }

      function createArc(pointStart, pointEnd, smoothness, color, clockWise) {
        // calculate a normal ( taken from Geometry().computeFaceNormals() )
        const cb = new THREE.Vector3().subVectors(
          new THREE.Vector3(),
          pointEnd
        );
        const ab = new THREE.Vector3().subVectors(pointStart, pointEnd);
        const normal = new THREE.Vector3().copy(cb).cross(ab).normalize();

        const angle = pointStart.angleTo(pointEnd);
        const angleDelta = angle / (smoothness - 1);

        const pts = [];
        for (let i = 0; i < smoothness; i++) {
          pts.push(pointStart.clone().applyAxisAngle(normal, angleDelta * i));
          bufferPt.push(
            pointStart.clone().applyAxisAngle(normal, angleDelta * i)
          );
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(pts);
        const arc = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: color
          })
        );
        return arc;
      }

      // Usage
      setArcsOnSphere(newPt, 50, "lime", false);

      // group for rotation

      return null;
    } else {
      return null;
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "85vh",
          width: "99vw"
        }}
      >
        <Canvas camera={{ position: [0, 0, 20] }}>
          {/* <OrbitControls
            enableDamping={true}
            dampingFactor={0.25}
            maxDistance={10}
            minDistance={0.5}
            rotateSpeed={-0.25}
            zoomSpeed={1}
            enablePan
            enableZoom
          /> */}

          <SphereLoad1
            url={imageUrl}
            radius={2.8}
            transparent={false}
            onClick={handleSphereClick}
          />
          {/* <SphereWithTexture url={imageUrl} /> */}

          <DrawShape />
        </Canvas>
      </div>
      <div>
        {!finalized && (
          <button
            onClick={handleFinalize}
            className="pr-3 bg-slate-500 text-white px-4 py-2 rounded-md m-2"
          >
            Done
          </button>
        )}
        {
          <button
            onClick={handleCancle}
            className="pr-3 bg-slate-500 text-white px-4 py-2 rounded-md m-2"
          >
            Cancle
          </button>
        }
      </div>
    </>
  );
};

export default SphereImage1;
