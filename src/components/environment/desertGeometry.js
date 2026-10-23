import { BufferGeometry, Color, Float32BufferAttribute, Vector3 } from 'three';
import { basinSurfaceHeight } from '../../data/desert.js';
import { roadX } from '../../data/journey.js';

// Geometry builders are independent of React so their complete execution can be
// validated in Node, including the world-space basin and all plant surfaces.
function surfaceBuilder() {
  const positions = [], colors = [];
  const triangle = (a, b, c, tint) => {
    const color = tint instanceof Color ? tint : new Color(tint);
    for (const point of [a, b, c]) {
      positions.push(...point);
      colors.push(color.r, color.g, color.b);
    }
  };
  const finish = () => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
  };
  return { triangle, finish };
}

export function erodedFormationGeometry(shape = 0) {
  const { triangle, finish } = surfaceBuilder();
  // Talus apron, recessed soft strata and a resistant, broken cap. Three
  // profiles prevent the same silhouette from repeating down the highway.
  const profiles = [
    [[0,1],[.055,.91],[.15,.74],[.25,.64],[.3,.61],[.46,.57],[.51,.59],[.67,.54],[.76,.52],[.8,.56],[.94,.5],[1,.43]],
    [[0,1],[.08,.84],[.2,.68],[.32,.58],[.37,.51],[.55,.43],[.61,.45],[.76,.37],[.85,.33],[.91,.35],[1,.22]],
    [[0,1],[.08,.89],[.2,.77],[.32,.65],[.45,.56],[.5,.58],[.63,.48],[.74,.42],[.84,.31],[.92,.26],[1,.13]],
  ];
  const rings = profiles[shape];
  const segments = 42;
  const palette = ['#81654f','#8b6c51','#957457','#8b674d','#9c7b59','#8c6b51','#9d7956','#927053','#a3815e','#a88864','#aa8962'];
  const point = (ring, segment) => {
    const angle = segment / segments * Math.PI * 2;
    const h = rings[ring][0];
    const broad = .85 + .08 * Math.sin(angle * 3 + shape * 1.8) + .055 * Math.cos(angle * 5 - .6);
    const channel = (Math.sin(angle * 11 + shape) * .035 + Math.sin(angle * 17 + .8) * .021) * Math.sin(h * Math.PI * .8);
    const radius = rings[ring][1] * broad + channel;
    const rim = h * (.96 + .035 * Math.sin(angle * 3 + .8) + .022 * Math.cos(angle * 7));
    return [Math.cos(angle) * radius + h * h * .085 * (shape - 1), rim, Math.sin(angle) * radius];
  };
  for (let ring = 0; ring < rings.length - 1; ring++) {
    for (let segment = 0; segment < segments; segment++) {
      const a = point(ring, segment), b = point(ring, segment + 1);
      const c = point(ring + 1, segment), d = point(ring + 1, segment + 1);
      const tint = new Color(palette[ring % palette.length]);
      tint.multiplyScalar(.95 + .055 * Math.sin(segment * 2.4 + shape) + .035 * Math.cos(segment * .9));
      triangle(a, c, b, tint);
      triangle(b, c, d, tint);
    }
  }
  for (let segment = 0; segment < segments; segment++) {
    triangle([.05 * (shape - 1), .965, 0], point(rings.length - 1, segment + 1), point(rings.length - 1, segment), '#ab8a65');
  }
  return finish();
}

export function basinTerrainGeometry() {
  const positions = [], colors = [], indices = [];
  const columns = 77, rows = 205;
  const near = new Color('#8d7158'), far = new Color('#806b5c');
  for (const side of [-1, 1]) {
    const base = positions.length / 3;
    for (let row = 0; row <= rows; row++) {
      const distance = -145 + row * 825 / rows;
      for (let col = 0; col <= columns; col++) {
        const offset = side * (18 + col * 352 / columns);
        const height = basinSurfaceHeight(offset, distance);
        positions.push(roadX(distance) + offset, height, -distance);
        const tint = near.clone().lerp(far, Math.min(1, Math.max(0, (Math.abs(offset) - 105) / 170)));
        // Broad variations follow drainage, with subtle granular mineral color.
        const variation = .97 + .045 * Math.sin(distance * .13 + offset * .19)
          + .025 * Math.sin(distance * .49 - offset * .31);
        tint.multiplyScalar(variation);
        colors.push(tint.r, tint.g, tint.b);
        if (row < rows && col < columns) {
          const a = base + row * (columns + 1) + col;
          const b = a + 1, c = a + columns + 1, d = c + 1;
          if (side > 0) indices.push(a,b,c,b,d,c);
          else indices.push(a,c,b,b,c,d);
        }
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

export function desertStoneGeometry() {
  const { triangle, finish } = surfaceBuilder();
  const count = 9;
  const ring = (level, index) => {
    const angle = index * Math.PI * 2 / count;
    const radius = (level === 0 ? .76 : level === 1 ? 1 : .51)
      * (.83 + .12 * Math.sin(index * 2.1));
    return [Math.cos(angle) * radius + level * .035, level === 0 ? 0 : level === 1 ? .36 : .83 + .13 * Math.sin(index * 1.7), Math.sin(angle) * radius];
  };
  for (let i = 0; i < count; i++) {
    for (let level = 0; level < 2; level++) {
      const a=ring(level,i), b=ring(level,i+1), c=ring(level+1,i), d=ring(level+1,i+1);
      triangle(a,c,b,'#bca083'); triangle(b,c,d,'#bca083');
    }
    triangle([.04,.91,0],ring(2,i+1),ring(2,i),'#c6ab8c');
  }
  return finish();
}

export function creosoteGeometry() {
  const { triangle, finish } = surfaceBuilder();
  const up = new Vector3(0,1,0);
  const branch = (start, end, radius) => {
    const direction = new Vector3(...end).sub(new Vector3(...start)).normalize();
    const tangent = new Vector3().crossVectors(direction, up).normalize();
    const bitangent = new Vector3().crossVectors(direction, tangent).normalize();
    const at = (center, angle, width) => new Vector3(...center)
      .addScaledVector(tangent, Math.cos(angle) * width).addScaledVector(bitangent, Math.sin(angle) * width).toArray();
    for (let i = 0; i < 4; i++) {
      const a=at(start,i*Math.PI/2,radius), b=at(start,(i+1)*Math.PI/2,radius);
      const c=at(end,i*Math.PI/2,radius*.35), d=at(end,(i+1)*Math.PI/2,radius*.35);
      triangle(a,c,b,'#77634a'); triangle(b,c,d,'#77634a');
    }
  };
  for (let stem = 0; stem < 7; stem++) {
    const angle = stem * 2.39996;
    const reach = .38 + .23 * (1 + Math.sin(stem * 1.8)) / 2;
    const elbow = [Math.cos(angle)*reach*.42, .32 + (stem%3)*.045, Math.sin(angle)*reach*.42];
    const tip = [Math.cos(angle)*reach, .57 + .34 * (1 + Math.cos(stem*1.3))/2, Math.sin(angle)*reach];
    branch([0,0,0], elbow, .018); branch(elbow,tip,.011);
    for (let twig=0;twig<2;twig++) {
      const t=.43+twig*.32;
      const start=elbow.map((v,i)=>v+(tip[i]-v)*t);
      const a=angle+(twig%2 ? -.8 : .9);
      const end=[start[0]+Math.cos(a)*.22,start[1]+.12,start[2]+Math.sin(a)*.22];
      branch(start,end,.006);
      // Paired small leaves leave real negative space through each shrub.
      for (let leaf=0;leaf<3;leaf++) {
        const s=.3+leaf*.27;
        const p=start.map((v,i)=>v+(end[i]-v)*s);
        const side=leaf%2 ? 1:-1;
        const dx=Math.cos(a+side*.9), dz=Math.sin(a+side*.9);
        const q=[p[0]+dx*.105,p[1]+.055,p[2]+dz*.105];
        const l=[p[0]+dx*.05-dz*.03,p[1]+.04,p[2]+dz*.05+dx*.03];
        const r=[p[0]+dx*.05+dz*.03,p[1]+.035,p[2]+dz*.05-dx*.03];
        const tone=leaf%3 ? '#a09b72':'#b6aa7d';
        triangle(p,l,q,tone); triangle(p,q,r,tone);
      }
    }
  }
  return finish();
}

export function rootedYuccaGeometry() {
  const { triangle, finish } = surfaceBuilder();
  for (let layer=0;layer<4;layer++) {
    const count=layer===3 ? 7:14;
    for (let index=0;index<count;index++) {
      const angle=index*Math.PI*2/count+layer*.39;
      const dx=Math.cos(angle),dz=Math.sin(angle);
      const length=1-.16*layer+.06*Math.sin(index*2.1);
      const width=.052-(layer*.006);
      const base=[dx*.07,.04,dz*.07];
      const middle=[dx*length*.46,.15+layer*.17,dz*length*.46];
      const tip=[dx*length,layer===0 ? .08:.27+layer*.2,dz*length];
      const left=[middle[0]-dz*width,middle[1]-.018,middle[2]+dx*width];
      const right=[middle[0]+dz*width,middle[1]-.018,middle[2]-dx*width];
      const keel=[middle[0],middle[1]+.025,middle[2]];
      const tone=layer===0 ? '#a1936d':index%3 ? '#9baf8b':'#c3c29b';
      triangle(base,left,keel,tone); triangle(base,keel,right,tone);
      triangle(left,tip,keel,tone); triangle(keel,tip,right,tone);
    }
  }
  return finish();
}
