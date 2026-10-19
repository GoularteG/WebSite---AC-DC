import { useState } from 'react';
import { useCursor } from '@react-three/drei';

export const trunkObjects = [
  {id:'book',short:'Livro',title:'The Making Of',label:'Abrir o livro The Making Of'},
  {id:'records',short:'Discos',title:'Discos de estrada',label:'Explorar os discos clássicos'},
  {id:'guitar',short:'Guitarra',title:'Girar e aproximar',label:'Inspecionar guitarra em 3D'},
];
export function SelectableObject({ id, active, onSelect, children, position, rotation, scale }) {
  const [hover,setHover]=useState(false);
  useCursor(hover);
  return <group name={`trunk-object-${id}`} position={position} rotation={rotation} scale={scale}
    onPointerOver={e=>{e.stopPropagation();setHover(true);}}
    onPointerOut={()=>setHover(false)}
    onClick={e=>{e.stopPropagation();if(e.delta<10)onSelect(id);}}>
    {children}
    {(hover||active===id)&&<mesh position={[0,-.015,0]} rotation={[-Math.PI/2,0,0]}>
      <ringGeometry args={[.8,.83,48]} /><meshBasicMaterial color="#f6b643" depthWrite={false} />
    </mesh>}
  </group>;
}
export function ObjectSelection({onSelect,onFocus}) {
  return <nav className="trunk-object-controls" aria-label="Objetos do porta-malas">
    {trunkObjects.map((item,i)=><button key={item.id} data-object={item.id} aria-label={item.label}
      onFocus={()=>onFocus(item.id)} onBlur={()=>onFocus(null)} onClick={()=>onSelect(item.id)}>
      <span>0{i+1}</span><strong>{item.short}</strong><small>{item.title}</small>
    </button>)}
  </nav>;
}
