// Group whole instances, never their origins alone for visibility testing:
// InstancedMesh computes bounds including each scaled/rotated geometry.
export function partitionFormations(formations, length = 200) {
  const groups = new Map();
  for (const formation of formations) {
    const key = Math.floor(formation.position[2] / length);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(formation);
  }
  return [...groups.entries()];
}
