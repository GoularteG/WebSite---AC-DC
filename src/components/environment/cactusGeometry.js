import { BufferGeometry, CatmullRomCurve3, Color, Float32BufferAttribute, Vector3 } from 'three';

// Ribbed saguaro stems with curved elbows and closed, rounded growing tips.
export function cactusGeometry() {
  const positions=[], colors=[], indices=[];
  const stems=[
    {points:[[0,0,0],[0,1,0],[.03,2.4,0],[0,3.55,0]],radius:.23},
    {points:[[0,1.3,0],[-.5,1.35,.02],[-.78,1.6,.02],[-.8,2.55,.02]],radius:.17},
    {points:[[.02,1.9,0],[.5,1.95,-.04],[.7,2.2,-.04],[.7,3.05,-.04]],radius:.15},
  ];
  for(const {points,radius} of stems){
    const curve=new CatmullRomCurve3(points.map(p=>new Vector3(...p)));
    const rings=22, sides=36, frames=curve.computeFrenetFrames(rings,false), base=positions.length/3;
    for(let i=0;i<=rings;i++){
      const t=i/rings, center=curve.getPointAt(t);
      const tip=t>.90?Math.sqrt(Math.max(.0005,1-Math.pow((t-.90)/.10,2))):1;
      for(let j=0;j<=sides;j++){
        const angle=j/sides*Math.PI*2;
        const rib=.91+.09*Math.cos(angle*9);
        const r=radius*rib*tip*(1-.12*t);
        const vertex=center.clone().addScaledVector(frames.normals[i],Math.cos(angle)*r).addScaledVector(frames.binormals[i],Math.sin(angle)*r);
        positions.push(vertex.x,vertex.y,vertex.z);
        const shade=.72+.28*Math.pow(Math.max(0,Math.cos(angle*9)),2);
        const tint=new Color('#67754a').multiplyScalar(shade);
        colors.push(tint.r,tint.g,tint.b);
        if(i<rings&&j<sides){const a=base+i*(sides+1)+j,b=a+sides+1;indices.push(a,a+1,b,b,a+1,b+1);}
      }
    }
  }
  const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('color',new Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();geometry.computeBoundingSphere();return geometry;
}
