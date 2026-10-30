import { Component, lazy, Suspense, useState, useEffect, useRef } from 'react';
import { ObjectSelection } from './ObjectSelection';
import TrunkBook from './TrunkBook';
const TrunkScene=lazy(()=>import('./TrunkScene'));
class TrunkSceneBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<p className="trunk-webgl-fallback">Explore a coleção pelos botões abaixo.</p>:this.props.children;}
}
export default function TrunkExperience({reduced,onReturn,onCredits}) {
  const returnButton=useRef(null);
  useEffect(()=>{returnButton.current?.focus({preventScroll:true});},[]);
  const [selected,setSelected]=useState(null),[active,setActive]=useState(null),[opening,setOpening]=useState(false);
  useEffect(()=>{
    if(!opening)return;
    const timer=window.setTimeout(()=>{setOpening(false);setSelected('book');},1100);
    return ()=>window.clearTimeout(timer);
  },[opening]);
  const select=id=>{
    if(id!=='book'||opening||selected)return;
    document.querySelector(`[data-object="${id}"]`)?.focus({preventScroll:true});
    if(reduced)setSelected('book');else setOpening(true);
  };
  return <section className="trunk-experience" id="main-content" role="main" aria-label="Porta-malas interativo">
    <div className="trunk-heading"><span className="eyebrow">UMA PAUSA NA ESTRADA</span><h1>THE BACKSTAGE<span>.</span></h1><p>Memorabilia de estrada. O livro guarda a história.</p></div>
    <button ref={returnButton} className="trunk-return" onClick={onReturn}>↶ VOLTAR À ESTRADA</button>
    <div className="trunk-canvas"><TrunkSceneBoundary><Suspense fallback={<p className="trunk-webgl-fallback">ABRINDO O PORTA-MALAS…</p>}><TrunkScene paused={!!selected||opening} reduced={reduced} onSelect={select} active={active}/></Suspense></TrunkSceneBoundary></div>
    {opening&&<div className="trunk-book-opening" aria-hidden="true">
      <div className="trunk-book-opening__volume">
        <div className="trunk-book-opening__pages"><span>ϟ</span><strong>THE MAKING OF</strong><small>BASTIDORES DE UMA VIAGEM</small></div>
        <div className="trunk-book-opening__cover"><span>AC/DC</span><strong>THE<br/>MAKING<br/>OF</strong><small>HIGHWAY TO HELL</small></div>
      </div>
    </div>}
    <button className="trunk-credits" onClick={onCredits}>CRÉDITOS DO PROJETO ↗</button>
    <ObjectSelection onSelect={select} onFocus={setActive}/>
    <p className="trunk-hint">Toque no livro para abrir · Sua posição na estrada está guardada.</p>
    {selected==='book'&&<TrunkBook reduced={reduced} onClose={()=>setSelected(null)}/>}
  </section>;
}
