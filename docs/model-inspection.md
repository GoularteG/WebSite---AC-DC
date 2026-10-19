# Modelo recebido — versão 0.2

Arquivo enviado: `dominic_torettos_1970_dodge_charger_rt_fast_x.glb`.
Cópia de execução: `public/models/charger-1970-original.glb`.
Tamanho: 11.271.840 bytes (aproximadamente 10,75 MiB).
SHA-256 de ambos: `6c6da4443bd30e3979b5a4dd8c8f4c918666a4bd651ef15381ff852421c1f51e`.

## Autoria e licença

Título nos metadados: **Dominic Toretto's 1970 Dodge Charger R/T FAST X**.
Autor: **Emmanual Robinson, Jr.** ([perfil Sketchfab](https://sketchfab.com/3001105)).
[Modelo de origem](https://sketchfab.com/3d-models/dominic-torettos-1970-dodge-charger-rt-fast-x-0e2c80e2928d4b76b49914db5bbb47ca).
Licença declarada no GLB: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
A fonte externa não foi consultada; estas informações foram lidas nos metadados do arquivo fornecido.

O briefing especificava Challenger. O arquivo efetivamente enviado identifica um Charger e foi integrado como tal.

## Inspeção

- GLB 2.0, gerador Sketchfab-15.18.0, sem extensões obrigatórias.
- 73 malhas/primitivas, incluindo superfícies trianguladas e linhas técnicas, 70 materiais e cinco imagens JPEG incorporadas.
- Nenhuma conversão necessária; o modelo funciona com GLTFLoader/Drei.
- Hierarquia Sketchfab inclui transformação do eixo vertical. Não remover essa transformação interna.
- Comprimento no eixo Y da geometria-fonte; frente no extremo de Y menor (região do motor/supercharger). Após a transformação embutida, a frente aponta para +Z. A rotação externa em Y de PI a alinha ao avanço -Z da estrada.
- Geometrias agrupadas por material abrangem múltiplas regiões do veículo. Não existem quatro rodas independentes identificáveis na hierarquia; nenhuma rotação foi aplicada a esses grupos.

## Adaptações de apresentação

Executadas em cópia da cena, nunca nos bytes do arquivo:

- Comprimento de referência de 5,28 m; centralização horizontal e contato vertical calibrado pela base das rodas (a caixa total inclui escapamentos abaixo das rodas).
- Materiais Charcoal e Color_008_1 ajustados para grafite com reflexos legíveis.
- Material translúcido de vidro ajustado em cor, rugosidade e opacidade.
- Material vermelho Color_A06 com emissão suave. Esse material também pode aparecer em detalhes vermelhos além das lanternas; a malha não separa cada peça.
- Linhas técnicas LineSegments ocultas para retirar o aspecto de desenho CAD; continuam no arquivo original.
- Texturas e superfícies preservadas. Materiais alterados são clonados e liberados ao desmontar o componente; geometrias e texturas são mantidas pelo cache do carregador.
- Câmera aproximada em perspectiva traseira; preenchimento acompanha o veículo.

## Próximas otimizações

Separar rodas, seus pivôs e materiais das lanternas em uma cópia de trabalho. Avaliar compressão Meshopt/Draco, texturas KTX2 e LOD após comparação visual. Nesta versão priorizamos preservar o original; o download do GLB ainda tem 11,27 MB e pode ser lento em conexões móveis.


## Interactive trunk inspection
The original charger-1970-original.glb remains unchanged (SHA-256:
6c6da4443bd30e3979b5a4dd8c8f4c918666a4bd651ef15381ff852421c1f51e).
Its 78 nodes contain 73 meshes, no animations and no skins. Material-named
body meshes span almost the entire vehicle; there is no identifiable independent
lid, hinge and interior assembly suitable for safe animation. The small rear
Color_A16 mesh is an emblem-sized part, not a lid.

The interaction therefore preserves all original geometry. TrunkCamera approaches the rear while the complete vehicle stays at its
original road position. TrunkScene then
presents a separate interior with orange pressed-metal panels, carpet, spare
wheel, book, discs and the existing procedural SG-inspired guitar. It does not
rebuild the car. All new textures are generated locally; no third-party assets
were downloaded. The existing MakingOf component supplies the same page content
and navigation through TrunkBook. Native modal dialogs handle Escape/focus;
HTML object buttons provide keyboard and WebGL-fallback access.
