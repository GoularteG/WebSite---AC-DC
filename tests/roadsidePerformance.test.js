import test from 'node:test';
import assert from 'node:assert/strict';
import { Frustum, InstancedMesh, Matrix4, Object3D, PerspectiveCamera, MeshBasicMaterial, Sphere } from 'three';
import { partitionFormations } from '../src/components/environment/spatialGroups.js';
import { createSceneryResourcePool } from '../src/components/roadside/sceneryResourcePool.js';
import { desertRocks, desertPebbles, desertScrub, desertVergeScrub, desertYucca, desertCacti } from '../src/data/desert.js';
import { desertStoneGeometry, creosoteGeometry, rootedYuccaGeometry } from '../src/components/environment/desertGeometry.js';
import { cactusGeometry } from '../src/components/environment/cactusGeometry.js';
import { roadX } from '../src/data/journey.js';

test('spatial groups retain every original formation exactly once', () => {
  for (const formations of [desertRocks, desertPebbles, desertScrub, desertVergeScrub, desertYucca, desertCacti]) {
    const grouped = partitionFormations(formations).flatMap(([, items]) => items);
    assert.equal(grouped.length, formations.length);
    assert.equal(new Set(grouped).size, formations.length);
    formations.forEach(formation => assert.ok(grouped.includes(formation)));
  }
});

test('chunk bounds never reject a visible formation on forward, reverse or ghost views', () => {
  const camera = new PerspectiveCamera(55, 1.5, .1, 1000);
  const frustum = new Frustum(), matrix = new Matrix4(), dummy = new Object3D();
  const material = new MeshBasicMaterial();
  let rejectedChunks = 0;
  for (const [formations, geometry] of [[desertRocks, desertStoneGeometry()], [desertPebbles, desertStoneGeometry()], [desertScrub, creosoteGeometry()], [desertVergeScrub, creosoteGeometry()], [desertYucca, rootedYuccaGeometry()], [desertCacti, cactusGeometry()]]) {
    geometry.computeBoundingSphere();
    for (const [, items] of partitionFormations(formations)) {
      const mesh = new InstancedMesh(geometry, material, items.length);
      const spheres = items.map((item, index) => {
        dummy.position.set(...item.position);
        dummy.rotation.set(0, item.rotation, 0);
        dummy.scale.set(item.width, item.height, item.width * item.depth);
        dummy.updateMatrix(); mesh.setMatrixAt(index, dummy.matrix);
        return new Sphere().copy(geometry.boundingSphere).applyMatrix4(dummy.matrix);
      });
      mesh.computeBoundingSphere(); mesh.updateMatrixWorld(true);
      for (let distance = 0; distance <= 720; distance += 40) for (const reverse of [-1, 1]) for (const height of [3.3, 70]) {
        camera.position.set(roadX(distance) + 4.2, height, -distance + 8.5);
        camera.lookAt(roadX(distance + reverse * 25), 1.2, -distance - reverse * 25);
        camera.updateMatrixWorld();
        frustum.setFromProjectionMatrix(matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
        const visible = frustum.intersectsObject(mesh);
        if (!visible) rejectedChunks++;
        if (spheres.some(sphere => frustum.intersectsSphere(sphere))) assert.ok(visible, 'visible instance must keep its chunk');
      }
      mesh.dispose();
    }
    geometry.dispose();
  }
  assert.ok(rejectedChunks > 0, 'partitioning must allow actual off-camera rejection');
  material.dispose();
});

test('identical scenery pieces share resources without merging different finishes or shapes', () => {
  const pool = createSceneryResourcePool();
  assert.equal(pool.box(), pool.box());
  assert.equal(pool.cylinder([.43, .43, .08, 24]), pool.cylinder([.43, .43, .08, 24]));
  assert.notEqual(pool.cylinder([.43, .43, .08, 24]), pool.cylinder([.25, .25, .025, 24]));
  const material = pool.material('#171719', .35, .48);
  assert.equal(material, pool.material('#171719', .35, .48));
  assert.notEqual(material, pool.material('#171719', .1, .48));
  assert.equal(material.roughness, .48);
  let disposed = 0;
  material.addEventListener('dispose', () => disposed++);
  pool.dispose();
  assert.equal(disposed, 1);
});
