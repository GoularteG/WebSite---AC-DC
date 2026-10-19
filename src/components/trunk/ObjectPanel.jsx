import { useEffect, useRef } from 'react';

const descriptions = {
  records:{title:'DISCOS DE ESTRADA',eyebrow:'AC/DC / CLÁSSICOS',paragraphs:[
    'Highway to Hell (1979), Back in Black (1980) e The Razors Edge (1990) acompanham esta viagem como referências visuais ao universo do AC/DC.',
    'Os estojos e discos são interpretações gráficas originais. Preto, vermelho, metal e contraste ajudam a conectar esta coleção à identidade do projeto.',
    'Esta coleção é visual: os discos não reproduzem gravações comerciais.'
  ]},

};
export function ObjectDialog({title,onClose,children,book=false}) {
  const dialog=useRef(null);
  useEffect(()=>{
    const previous=document.activeElement, node=dialog.current;
    node.showModal();
    return ()=>{node.close();if(previous?.isConnected)previous.focus({preventScroll:true});};
  },[]);
  return <dialog ref={dialog} aria-label={title} className={`trunk-dialog ${book?'trunk-book-dialog':''}`}
    onCancel={e=>{e.preventDefault();onClose();}}>
    <button className="trunk-panel-close" autoFocus onClick={onClose} aria-label="Fechar e voltar ao porta-malas">← VOLTAR AO PORTA-MALAS <span aria-hidden="true">×</span></button>
    {children}
  </dialog>;
}
export default function ObjectPanel({object,onClose}) {
  const item=descriptions[object];
  return <ObjectDialog title={item.title} onClose={onClose}>
    <article className="trunk-description"><span className="eyebrow">{item.eyebrow}</span><h2>{item.title}</h2>
      {item.paragraphs.map(p=><p key={p}>{p}</p>)}
    </article>
  </ObjectDialog>;
}
