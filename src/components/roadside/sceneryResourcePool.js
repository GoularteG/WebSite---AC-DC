import { BoxGeometry, CylinderGeometry, MeshStandardMaterial } from 'three';

// Owned by one scene, not a global cache. Preserve every original mesh and its
// transform while sharing identical immutable geometry/material descriptors.
export function createSceneryResourcePool() {
  const geometries = new Map(), materials = new Map();
  const get = (cache, key, create) => {
    if (!cache.has(key)) cache.set(key, create());
    return cache.get(key);
  };
  return {
    box: () => get(geometries, 'box', () => new BoxGeometry()),
    cylinder: args => get(geometries, JSON.stringify(args), () => new CylinderGeometry(...args)),
    material: (color, metalness, roughness) => get(materials,
      JSON.stringify([color, metalness, roughness]),
      () => new MeshStandardMaterial({ color, metalness, roughness })),
    dispose() {
      // Keep descriptors reusable across React StrictMode's effect replay.
      // Three.js recreates GPU resources if these objects are used again.
      geometries.forEach(resource => resource.dispose());
      materials.forEach(resource => resource.dispose());
    },
  };
}
