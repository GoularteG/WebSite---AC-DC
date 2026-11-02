import test from 'node:test';
import { DoubleSide, Mesh, MeshBasicMaterial, Raycaster, Vector3 } from 'three';
import { basinTerrainGeometry } from '../src/components/environment/desertGeometry.js';
import assert from 'node:assert/strict';
import { createLavaRiver, lavaSurfaceHeight } from '../src/components/environment/lavaGeometry.js';
import { basinSurfaceHeight } from '../src/data/desert.js';
import { roadX } from '../src/data/journey.js';
import { FINAL_GATE_DISTANCE } from '../src/data/finale.js';

test('both complete lava banks clear the raised desert and leave the road free',()=>{
  for(const side of [-1,1]){
    const geometry=createLavaRiver(side),p=geometry.attributes.position,n=geometry.attributes.normal;
    assert.ok(-geometry.boundingBox.min.z>FINAL_GATE_DISTANCE+100);
    assert.equal(-geometry.boundingBox.max.z,570);
    for(let i=0;i<p.count;i++){
      const distance=-p.getZ(i),offset=p.getX(i)-roadX(distance);
      assert.ok(Number.isFinite(p.getY(i)));
      assert.ok(Math.abs(offset)>=9.999,'lava must remain outside the asphalt');
      assert.ok(p.getY(i)>basinSurfaceHeight(offset,distance)+.28,'terrain must not bury lava');
      assert.ok(n.getY(i)>0,'both river surfaces face the approaching camera');
    }
    geometry.dispose();
  }
});

test('the formerly buried approach now has a continuous visible lava surface',()=>{
  for(let distance=608;distance<=720;distance++)for(const offset of [-58,-34,-18,18,34,58]){
    assert.ok(lavaSurfaceHeight(offset,distance)>basinSurfaceHeight(offset,distance));
  }
});

// Raycast the actual triangulated desert, not only its analytic height function.
test('lava clears the rendered basin triangles through the approach',()=>{
  const terrain=basinTerrainGeometry(), material=new MeshBasicMaterial({side:DoubleSide});
  const mesh=new Mesh(terrain,material);mesh.updateMatrixWorld(true);
  const ray=new Raycaster();
  for(const distance of [610,625,640,655,670])for(const offset of [-54,-34,-20,20,34,54]){
    ray.set(new Vector3(roadX(distance)+offset,100,-distance),new Vector3(0,-1,0));
    const [hit]=ray.intersectObject(mesh);
    assert.ok(hit,'sample must hit the rendered desert');
    assert.ok(lavaSurfaceHeight(offset,distance)>hit.point.y+.08,'lava must sit above actual terrain triangles');
  }
  terrain.dispose();material.dispose();
});
