# Cenografia lateral da estrada

As oito placas históricas continuam ligadas aos capítulos. A cenografia entre elas
foi reduzida de 12 conjuntos repetitivos para cinco marcos, alternando as duas
laterais. Posições e escalas ficam em `src/data/roadsideAssets.js`; o carregador
3D reutilizável fica em `src/components/roadside/RoadsideAsset.jsx`.

| Trecho da estrada | Marco | Origem |
| --- | --- | --- |
| 70, direita | Guitarra monumental vermelha | Modelo de Aroig, adaptação de material e escala |
| 230, esquerda | Estrutura de palco, amplificadores e microfone | Objetos já construídos neste projeto |
| 390, direita | Sino cênico de Hells Bells | Objeto já construído neste projeto, reposicionado |
| 475, esquerda | Parede de amplificadores | Objetos já construídos neste projeto |
| 585, direita | Guitarra de acabamento original | Segunda apresentação do mesmo modelo de Aroig |

## Modelo externo efetivamente usado

**Guitarra elèctrica**, por **Aroig**. [Página do modelo](https://sketchfab.com/3d-models/guitarra-electrica-cc6bc30cdb8645fa8eba878ad854f802),
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). O arquivo foi fornecido
pelo usuário e já fazia parte do porta-malas. Autoria, URL e licença estão nos
metadados `asset.extras` do GLB original e em [guitar-asset.md](guitar-asset.md).
O arquivo usado na estrada é `public/models/guitar-electric.glb`, SHA-256
`d4941c3a24b0e0a9d3adf74d2363e14caac1d387c06d5d8d9a444ce7779883d2`.
Os materiais foram convertidos para glTF PBR no arquivo existente; na primeira
aparição, o acabamento do corpo é vermelho cereja. A geometria e as texturas
originais permanecem preservadas. O crédito também aparece na seção Créditos do site.

Nenhum arquivo externo novo foi publicado nesta revisão. As duas guitarras são
instâncias do mesmo GLB, carregado uma vez pelo Three.js.

## Pesquisa e limites

- [BoomBox, Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/BoomBox):
  **CC0 1.0**, autoria indicada como Public/Microsoft no README individual.
  Rejeitado: aparência de rádio digital moderno com visor “PLAY” e GLB de
  aproximadamente 10,6 MB; não corresponde aos anos 1970–1980 nem à meta de desempenho.
- [Electric-Guitar-3D-Model, Vichack18](https://github.com/Vichack18/Electric-Guitar-3D-Model):
  STL encontrado, mas sem licença de uso identificada no repositório; não usado.
- Não foi identificado, nas fontes consultáveis, um GLB de sino, amplificador
  clássico, bateria ou microfone de qualidade compatível com **licença individual
  verificável**. Esses modelos ficam para uma futura substituição. As peças de
  palco, sino e amplificadores desta versão são as que já existiam no projeto;
  não são apresentadas como modelos externos licenciados.

Os conjuntos removidos da cena foram as guitarras e figuras simplificadas,
placas decorativas, discos cenográficos repetidos e várias duplicações de
amplificadores e microfones. O carro, a estrada, os capítulos, os outdoors
históricos e o destino final não foram alterados.
