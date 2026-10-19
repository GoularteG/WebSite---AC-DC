import { useState } from 'react';
import { useCursor } from '@react-three/drei';

export const trunkObjects = [
  {id:'book',short:'Abrir o livro',title:'The Making Of',label:'Abrir o livro The Making Of'},
];
export function SelectableObject({ id, active, onSelect, children, position, rotation, scale, highlight=[.8,.83] }) {
  const [hover,setHover]=useState(false);
  useCursor(hover);
  return <group name={`trunk-object-${id}`} position={position} rotation={rotation} scale={scale}
    onPointerOver={e=>{e.stopPropagation();setHover(true);}}
    onPointerOut={()=>setHover(false)}
    onClick={e=>{e.stopPropagation();if(e.delta<10)onSelect(id);}}>
    {children}
    {(hover||active===id)&&<mesh position={[0,.015,0]} rotation={[-Math.PI/2,0,0]}>
      <ringGeometry args={[highlight[0],highlight[1],64]} /><meshBasicMaterial color="#f0a047" transparent opacity={.9} depthWrite={false} />
    </mesh>}
  </group>;
}
export function ObjectSelection({onSelect,onFocus}) {
  return <nav className="trunk-object-controls" aria-label="Objetos do porta-malas">
    {trunkObjects.map(item=><button key={item.id} data-object={item.id} aria-label={item.label}
      onFocus={()=>onFocus(item.id)} onBlur={()=>onFocus(null)} onClick={()=>onSelect(item.id)}>
      <span aria-hidden="true">↗</span><strong>{item.short}</strong><small>{item.title}</small>
    </button>)}
  </nav>;
}
