import { Component, lazy, Suspense, useState, useEffect, useRef } from 'react';
import { ObjectSelection } from './ObjectSelection';
import TrunkBook from './TrunkBook';
const TrunkScene=lazy(()=>import('./TrunkScene'));
class TrunkSceneBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<p className="trunk-webgl-fallback">Explore a coleção pelos botões abaixo.</p>:this.props.children;}
}
export default function TrunkExperience({reduced,onReturn}) {
  const returnButton=useRef(null);
  useEffect(()=>{returnButton.current?.focus({preventScroll:true});},[]);
  const [selected,setSelected]=useState(null),[active,setActive]=useState(null);
  const select=id=>{document.querySelector(`[data-object="${id}"]`)?.focus({preventScroll:true});setSelected(id);};
  return <section className="trunk-experience" id="main-content" role="main" aria-label="Porta-malas interativo">
    <div className="trunk-heading"><span className="eyebrow">UMA PAUSA NA ESTRADA</span><h1>THE BACKSTAGE<span>.</span></h1><p>Memorabilia de estrada. O livro guarda a história.</p></div>
    <button ref={returnButton} className="trunk-return" onClick={onReturn}>↶ VOLTAR À ESTRADA</button>
    <div className="trunk-canvas"><TrunkSceneBoundary><Suspense fallback={<p className="trunk-webgl-fallback">ABRINDO O PORTA-MALAS…</p>}><TrunkScene paused={!!selected} reduced={reduced} onSelect={select} active={active}/></Suspense></TrunkSceneBoundary></div>
    <ObjectSelection onSelect={select} onFocus={setActive}/>
    <p className="trunk-hint">Toque no livro para abrir · Sua posição na estrada está guardada.</p>
    {selected==='book'&&<TrunkBook reduced={reduced} onClose={()=>setSelected(null)}/>}
  </section>;
}
