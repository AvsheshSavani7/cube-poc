import React, { useEffect, useRef, useState } from "react";
import { Canvas, extend, useLoader, useThree } from "@react-three/fiber";
import { Image, OrbitControls, useTexture } from "@react-three/drei";

import SphereLoad from "./SphereLoad";
import { Controls } from "./Controls";
import * as THREE from "three";
import "./util";

// Extend Three.js with the custom shader material

const SphereImage = ({ imageUrl }) => {
  const [intersectionPoint, setIntersectionPoint] = useState([]);
  const [finalized, setFinalized] = useState(false);

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
    const texture = useLoader(THREE.TextureLoader, "/floor_4.jpg");
    const { scene, raycaster } = useThree();
    console.log(scene, "scene");

    // sphere =

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

        // Create a line to connect this point with the previous one
        // if (index > 0) {
        //   const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        //     intersectionPoint[index - 1],
        //     intersectionPoint[index] // Corrected index here
        //   ]);
        //   const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        //   const line = new THREE.Line(lineGeometry, lineMaterial);
        //   scene.add(line);
        //   lineMeshes.current.push(line);
        // }
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
      texture.repeat.set(0.5, 1); // Adjust repeat to suit the appearance on your geometry
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      if (!intersectionPoint || intersectionPoint.length < 2) return null;
      const startAngle = Math.PI / 2; // Adjust as needed
      const endAngle = (Math.PI * 3) / 2; // Adjust as needed
      let newPt = [...intersectionPoint, intersectionPoint[0]];

      const vertices = intersectionPoint.flatMap(({ x, y, z }) => [x, y, z]);

      let bufferPt = [];

      function setArcsOnSphere(
        intersectionPoint,
        smoothness,
        color,
        clockWise
      ) {
        // Sphere radius
        const sphereRadius = 2.76;

        // Create a sphere mesh
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(sphereRadius, 32, 16),
          new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.1
          })
        );
        scene.add(sphere);

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
      setArcsOnSphere(newPt, 5000, "lime", false);

      const bffVertices = bufferPt.flatMap(({ x, y, z }) => [x, y, z]);
      console.log(bffVertices, "bffVertices", bufferPt);
      // Create geometry
      const geometry1 = new THREE.BufferGeometry();
      geometry1.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(bffVertices, 3)
      );
      // Triangulate the geometry1 dynamically based on the number of points
      const faces = [];
      for (let i = 1; i < bufferPt.length - 1; i++) {
        faces.push(0, i, i + 1);
      }
      geometry1.setIndex(faces);

      // const updateFaceVertices = (geometry) => {
      //   const position = geometry.attributes.position;
      //   const vertices = [];

      //   // Loop through each vertex
      //   for (let i = 0; i < position.count; i++) {
      //     // Get vertex position
      //     const vertex = new THREE.Vector3();
      //     vertex.fromBufferAttribute(position, i);

      //     // Normalize the vertex position to get the point on the sphere surface
      //     const normalizedVertex = vertex.clone().normalize();

      //     // Store the new vertex position
      //     vertices.push(
      //       normalizedVertex.x,
      //       normalizedVertex.y,
      //       normalizedVertex.z
      //     );
      //   }

      //   // Update the geometry's vertex positions
      //   geometry.setAttribute(
      //     "position",
      //     new THREE.Float32BufferAttribute(vertices, 3)
      //   );
      // };

      // Call the function to update face vertices for your geometry
      // updateFaceVertices(geometry1);

      // Define UV coordinates for the vertices
      // const uvs = [];
      // for (let i = 0; i < bufferPt.length; i++) {
      //   uvs.push(i / (bufferPt.length - 1), 0);
      // }

      const bffVerticesUv = bufferPt.flatMap(({ x, y }) => [x, y]);
      console.log(bffVerticesUv, "bffVerticesUv");
      // const uvs = [
      //   0,
      //   0, // UV for first vertex
      //   1,
      //   0, // UV for second vertex
      //   1,
      //   1, // UV for third vertex
      //   0,
      //   1 // UV for fourth vertex
      // ];
      geometry1.setAttribute(
        "uv",
        new THREE.Float32BufferAttribute(bffVerticesUv, 2)
      );

      console.log("Vertices:", bffVertices, newPt);
      return (
        <mesh geometry={geometry1}>
          <meshBasicMaterial
            attach="material"
            map={texture}
            side={THREE.DoubleSide}
          />
        </mesh>
      );
    } else {
      return null;
    }
  };

  console.log(intersectionPoint, "intersectionPoint-");
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
        <Canvas camera={{ position: [0, 0, -5] }}>
          <OrbitControls
            enableDamping={true}
            dampingFactor={0.25}
            maxDistance={300}
            minDistance={0.5}
            rotateSpeed={-0.25}
            zoomSpeed={2}
            enablePan
            enableZoom
          />

          <SphereLoad
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

export default SphereImage;
