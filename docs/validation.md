# Validação — versão 0.1

Data: 18 de outubro de 2026.

## Executado

- `npm install`: dependências instaladas e package-lock.json gerado.
- `npm run dev`: Vite iniciou na porta 5173.
- `npm run build`: build de produção aprovado.
- `npm run preview`: build servido na porta 4173.
- `npm test` e execução direta de `tests/journey.test.js`: três verificações de lógica aprovadas (limites dos marcos, continuidade da estrada e estrutura dos registros).
- `git diff --check`: sem erros de whitespace.
- Chromium headless com SwiftShader, via Chrome DevTools Protocol, sobre o build de produção:
  - Desktop 1440 × 900: Canvas e abertura renderizados, sem overflow horizontal.
  - Botão de início e salto ao marco REDLINE: progresso em 65%.
  - Livro aberto em duas páginas; Próxima chegou à página de tecnologia.
  - Retorno à estrada preservou 65% de progresso.
  - Mobile emulado 390 × 844: Canvas renderizado, sem overflow horizontal.
  - Movimento reduzido emulado: percurso sem página longa, seleção do marco final em 100%.
  - Livro mobile: Próxima avançou uma página, para direção de arte.
  - Nenhuma exceção JavaScript capturada nas duas verificações finais.
- Capturas em `artifacts/` inspecionadas visualmente.

## Limites observados

A renderização por software foi lenta no desktop. Foram reduzidas chamadas de desenho dos marcadores laterais por instancing, a luz com sombra foi trocada de point para spot e a cena passou a renderizar sob demanda. Não há medição de FPS em GPU real nem teste em celular físico.

O Vite emite aviso de chunk grande: bundle 3D de aproximadamente 1,17 MB minificado / 330 KB gzip. O carregador da cena usa importação dinâmica, mas a estratégia de chunks pode ser refinada junto à otimização do modelo real.

O Challenger não foi recebido; carregamento, escala, orientação, materiais, reflexos, iluminação e rodas do modelo ainda não foram exercitados. Falha de GLB, perda de contexto WebGL e reprodução de áudio autorizado também não foram testadas. Não foi publicado um endereço remoto. As capturas são prévias locais do cenário, sem carro substituto.

# Atualização — versão 0.2: Charger integrado

- GLB fornecido pelo usuário carregou no Chromium; a interface confirmou o modelo pronto.
- Hash SHA-256 da cópia no projeto igual ao do anexo original.
- `npm run build` aprovado; três testes de lógica aprovados.
- Build de produção inspecionado em Chromium/SwiftShader: abertura e enquadramento traseiro em 1280 × 800; modelo legível após ajuste dos reflexos e do contato vertical.
- Navegação pelos marcos em movimento reduzido: avanço até 65% e retorno a 0% confirmados com o modelo carregado.
- Viewport mobile emulado de 390 × 844: modelo carregado, sem overflow horizontal; captura `artifacts/charger-mobile.png`.
- Nenhuma exceção JavaScript capturada na verificação final.
- Novas capturas: `charger-opening.png`, `charger-rear.png`, `charger-mobile.png`.

Limites: as rodas não giram, pois as peças vêm agrupadas por material. Não foi testado desempenho em celular físico nem medido FPS em GPU real. O GLB original tem 11,27 MB; o bundle 3D passou a aproximadamente 351 KB gzip com GLTFLoader. Os ajustes de material vermelho são compartilhados por detalhes do modelo, não exclusivamente pelas lanternas. A compressão e a separação das rodas devem ser feitas em uma cópia de trabalho. Não houve publicação remota.

A inspeção da primeira captura mobile revelou corte lateral do veículo após redimensionar. Corrigido com enquadramento centralizado abaixo de 761 px, invalidação da cena ao mudar largura e configuração inicial estável da câmera. Novo build aprovado e nova captura mobile inspecionada: carro inteiro no quadro, sem exceções JavaScript. A captura `charger-mobile.png` foi substituída pela versão corrigida.

# Atualização visual do livro — 19 de outubro de 2026

- `npm run build` aprovado; os três testes de lógica existentes passaram.
- `git diff --exit-code HEAD -- src/data/book.js src/scenes/HighwayScene.jsx`: textos do livro e cena da estrada sem alterações nesta atualização.
- Chromium: estado de animação confirmado durante a virada; avanço de 1–2 para 3–4 e retorno validados.
- Todas as dez páginas verificadas nas larguras de 320, 390, 900 e 1440 px: conteúdo dentro da altura das folhas e sem overflow horizontal.
- Sumário, navegação com movimento reduzido, fechamento/reabertura e troca de abas passaram; nenhuma exceção JavaScript na verificação final.
- O teste final do livro foi isolado com WebGL desativado no navegador de teste. O ambiente com renderização 3D por software causava atrasos de composição e timeouts; isso não altera a configuração da aplicação publicada.
- Captura final `artifacts/book-aged-desktop.png` inspecionada. Desempenho e gestos em dispositivos físicos não foram medidos.
