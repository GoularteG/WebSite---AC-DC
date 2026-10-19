import {ObjectDialog} from './trunk/ObjectPanel';
export default function Credits({onClose}) {
  return <ObjectDialog title="Créditos e licenças" onClose={onClose} closeLabel="Fechar créditos">
    <article className="trunk-description"><span className="eyebrow">HIGHWAY TO HELL</span><h2>CRÉDITOS</h2>
      <p>Carro: <a href="https://sketchfab.com/3d-models/dominic-torettos-1970-dodge-charger-rt-fast-x-0e2c80e2928d4b76b49914db5bbb47ca" target="_blank" rel="noreferrer">Dodge Charger R/T 1970, por Emmanual Robinson, Jr.</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Geometria original; escala e materiais de apresentação ajustados.</p>
      <p>Foto: <a href="https://commons.wikimedia.org/wiki/File:ACDC_In_Tacoma_2009.jpg" target="_blank" rel="noreferrer">AC/DC em Tacoma (2009), por Imhavingfun42</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>. Arquivo original, sem cortes ou alterações, exibido no painel antes do portal.</p>
      <p>Guitarra: <a href="https://sketchfab.com/3d-models/guitarra-electrica-cc6bc30cdb8645fa8eba878ad854f802" target="_blank" rel="noreferrer">Guitarra elèctrica, por Aroig</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Materiais adaptados; geometria preservada.</p>
    </article>
  </ObjectDialog>;
}
