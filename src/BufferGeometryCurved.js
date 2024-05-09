// import { BufferAttribute, BufferGeometry } from "three";

// export default class BufferGeometryCurved extends BufferGeometry {
//   constructor(radius, widthSegments, heightSegments) {
//     super();

//     const positions = [];
//     const indices = [];

//     // Generate vertices
//     for (let i = 0; i <= heightSegments; i++) {
//       const v = i / heightSegments;
//       for (let j = 0; j <= widthSegments; j++) {
//         const u = j / widthSegments;
//         const x = -widthSegments / 2 + u * widthSegments;
//         const y = (v - 0.5) * 2;
//         const z = 0;

//         // Calculate distance from the center
//         const distance = Math.sqrt(x * x + y * y);

//         // Calculate curvature factor based on distance
//         const curvature = Math.max(0, 1 - distance / radius);

//         // Apply curvature to vertex position
//         const curvedX = x * curvature;
//         const curvedY = y * curvature;

//         positions.push(curvedX, curvedY, z);
//       }
//     }

//     // Generate indices
//     for (let i = 0; i < heightSegments; i++) {
//       for (let j = 0; j < widthSegments; j++) {
//         const a = i * (widthSegments + 1) + (j + 1);
//         const b = i * (widthSegments + 1) + j;
//         const c = (i + 1) * (widthSegments + 1) + j;
//         const d = (i + 1) * (widthSegments + 1) + (j + 1);

//         indices.push(a, b, d);
//         indices.push(b, c, d);
//       }
//     }

//     // Set attributes
//     this.setAttribute(
//       "position",
//       new BufferAttribute(new Float32Array(positions), 3)
//     );
//     this.setIndex(indices);

//     // Set draw range
//     this.setDrawRange(0, indices.length);
//   }
// }

import { BufferAttribute, BufferGeometry, PlaneGeometry, Vector3 } from "three";

export default class CurvedPlaneGeometry extends PlaneGeometry {
  constructor(radius, widthSegments, heightSegments, cornerPositions) {
    super(radius * 2, radius * 2, widthSegments, heightSegments);

    // Get vertices from PlaneGeometry
    const vertices = this.attributes.position.array;

    // Check if the number of corner positions matches 4
    if (cornerPositions.length !== 4) {
      console.error("You must provide exactly 4 corner positions.");
      return;
    }

    // Modify vertices to create curvature towards the center
    for (let i = 0; i < cornerPositions.length; i++) {
      const cornerPosition = cornerPositions[i];
      const cornerIndex = i * 3;

      if (cornerIndex >= vertices.length) {
        console.error("Corner position index out of bounds.");
        return;
      }

      vertices[cornerIndex] = cornerPosition.x;
      vertices[cornerIndex + 1] = cornerPosition.y;
      vertices[cornerIndex + 2] = cornerPosition.z;
    }

    // Update attributes
    this.setAttribute("position", new BufferAttribute(vertices, 3));
  }
}
