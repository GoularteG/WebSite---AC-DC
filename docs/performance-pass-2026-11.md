# Otimização sem redesign — novembro de 2026

## Escopo

Esta etapa preserva modelos, posições, quantidades, materiais visíveis, resolução,
refletores, céu musical, lava, portal, capítulos e porta-malas.

- `RoadLighting`: seis conjuntos estáticos de instâncias usam `frames={1}`;
  `memo` evita reiniciar esse trabalho a cada mudança do progresso. As três luzes
  próximas continuam sendo atualizadas durante o movimento.
- `DesertLandscape`: pequenas pedras, arbustos, yuccas e cactos são separados em
  blocos longitudinais de 200 m. Cada bloco tem uma esfera de limites calculada
  com as geometrias e transformações completas. O descarte usa o frustum real,
  inclusive em marcha a ré e no modo fantasma; não há remoção por distância,
  redução de densidade ou carregamento tardio. Mesas e terreno ficam intactos.
- `SceneryResources`: caixas e cilindros das estruturas cenográficas compartilham
  geometrias e materiais idênticos por cena. Recursos são liberados pelo provider
  ao desmontar; meshes individuais não destroem recursos compartilhados.
  Essa mudança reduz recursos duplicados, mas NÃO agrupa draw calls.

## Evidência

Referência: commit `c521174`. Chromium/WebGL2 com SwiftShader, viewport 1000×700,
movimento reduzido e música pausada, mesma câmera. Não é benchmark de FPS em GPU
integrada: software rendering e rede do ambiente tornam tempos pouco representativos.

Menu, antes/depois:

| Medida | Antes | Depois |
| --- | ---: | ---: |
| Geometrias reportadas pelo renderer | 277 | 216 |
| Materiais únicos na cena | 193 | 143 |
| Triângulos desenhados | 515109 | 515109 |
| Chamadas de desenho | 267 | 267 |

As capturas do menu e da entrada da estrada antes/depois tiveram diferença RGB média zero.
Na entrada da estrada, o renderer passou de 601637 para 588973 triângulos
e de 273 para 290 chamadas: o custo adicional de grupos é explícito.
Os seis grupos de postes mantiveram suas 7 instâncias e a versão dos buffers
inalterada durante oito quadros adicionais solicitados no navegador.

Teste geométrico com as mesmas câmeras da estrada, SOMENTE os seis conjuntos de
pedras/vegetação particionados (não representa todos os triângulos da cena):

| Distância | Triângulos antes | Depois | Draw calls antes/depois |
| --- | ---: | ---: | ---: |
| 0 m | 216613 | 205029 | 6 / 24 |
| 180 m | 216613 | 176493 | 6 / 21 |
| 360 m | 216613 | 136043 | 6 / 14 |
| 540 m | 216613 | 73189 | 6 / 10 |

Particionar troca chamadas de desenho adicionais por menos vértices processados.
Blocos de 100 m foram comparados e descartados: no início exigiam 42 chamadas
para esses grupos, contra 24 com 200 m. O ganho em FPS depende da GPU/CPU e deve
ser medido no computador fraco antes de prometer uma melhoria percentual.

## Validação

- `npm test`: inclui conservação de todas as instâncias, limites conservadores
  para câmeras de ida/volta/aéreas e compartilhamento/descarte dos recursos.
- `npm run build`: concluído; permanece o aviso preexistente de chunk Three.js grande.
- QA em WebGL real por software: menu e entrada na estrada a 1000×700;
  salto até 720 m e retorno a 0 m a 640×480, esperando a posição real do carro
  antes da captura; contexto WebGL ativo, lava visível e nenhum erro JavaScript.
  Capturas iniciais após saltos, sem aguardar o estado da câmera, ficaram pretas
  no renderer por software; a checagem sincronizada confirmou a cena correta.
- Fotografias remotas não carregaram neste ambiente de QA; a comparação usa o
  mesmo fallback editorial antes/depois. A lógica de fotografias não foi alterada.

## Próximas análises

Não incluídas nesta etapa: corrigir o amostrador de qualidade, agrupar meshes para
reduzir draw calls, cache de sombras do porta-malas e perfil de tempo da GPU no
hardware do usuário. Nenhuma redução adicional de qualidade foi introduzida.
