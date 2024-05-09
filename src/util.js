import * as THREE from "three";
import { extend } from "@react-three/fiber";

// Paul West @prisoner849 https://discourse.threejs.org/u/prisoner849
// https://discourse.threejs.org/t/simple-curved-plane/26647/10
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(radius, widthSegments, heightSegments) {
    super();

    const numVerticesX = widthSegments + 1;
    const numVerticesY = heightSegments + 1;
    const vertices = [];
    const uvs = [];

    for (let iy = 0; iy < numVerticesY; iy++) {
      for (let ix = 0; ix < numVerticesX; ix++) {
        const u = ix / widthSegments;
        const v = 1 - iy / heightSegments;
        const x = radius * Math.cos(u * Math.PI * 2);
        const y = radius * Math.sin(v * Math.PI);
        const z = radius * Math.sin(u * Math.PI * 2);
        vertices.push(x, y, z);
        uvs.push(u, v);
      }
    }

    this.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    this.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  }
}

class MeshSineMaterial extends THREE.MeshBasicMaterial {
  constructor(parameters = {}) {
    super(parameters);
    this.setValues(parameters);
    this.time = { value: 0 };
  }
  onBeforeCompile(shader) {
    shader.uniforms.time = this.time;
    shader.vertexShader = `
      uniform float time;
      ${shader.vertexShader}
    `;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 4.0, position.z);`
    );
  }
}

extend({ MeshSineMaterial, BentPlaneGeometry });
