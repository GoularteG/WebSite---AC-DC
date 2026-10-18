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
