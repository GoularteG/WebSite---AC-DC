import { BufferGeometry, Float32BufferAttribute } from 'three';
import { roadX } from '../../data/journey.js';
import { basinSurfaceHeight } from '../../data/desert.js';

// The desert is a raised, triangulated basin, not a flat plane. Clearance also
// covers interpolation between its coarser vertices and the finer lava grid.
export const lavaSurfaceHeight = (offset, distance) => Math.max(-.025, basinSurfaceHeight(offset, distance)) + .3;
export function createLavaRiver(side) {
  const positions=[],uvs=[],indices=[];
  const columns=24, rows=155, start=570, end=880;
  for(let row=0;row<=rows;row++){
    const distance=start+(end-start)*row/rows;
    for(let column=0;column<=columns;column++){
      const offset=side*(10+48*column/columns);
      positions.push(roadX(distance)+offset,lavaSurfaceHeight(offset,distance),-distance);
      uvs.push(column/columns,distance/9);
      if(row<rows&&column<columns){
        const a=row*(columns+1)+column,b=a+1,c=a+columns+1,d=c+1;
        if(side>0)indices.push(a,b,c,b,d,c);else indices.push(a,c,b,b,c,d);
      }
    }
  }
  const geometry=new BufferGeometry();
  geometry.setAttribute('position',new Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new Float32BufferAttribute(uvs,2));
  geometry.setIndex(indices);geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();
  return geometry;
}
