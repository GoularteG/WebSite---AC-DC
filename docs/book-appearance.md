# Livro de bastidores

O leitor tem oito páginas, a partir de `src/data/book.js`. Os textos originais foram preservados. `src/data/bookArtwork.js` fornece diagramas vetoriais originais e notas editoriais sobre as decisões de cada página. O acabamento combina papel claro, títulos de rock, notas em vermelho, couro escuro e marcador de tecido.

## Paginação

No porta-malas, as opções de navegação antes estavam ocultas e o adaptador de gesto não executava nenhuma ação em um clique/toque. O leitor agora oferece setas, índice, toque nas bordas e arraste horizontal. As setas do teclado e Home/End também navegam; Escape fecha primeiro o índice, quando aberto, e depois o diálogo. Os controles ficam indisponíveis nos limites e durante uma virada.

O arraste identifica intenção horizontal, captura o ponteiro e fixa a direção antes de cruzar a lombada. Um gesto curto suficiente conclui a dobra; cancelamento retorna à página original. A rolagem vertical no celular permanece disponível. Movimento reduzido troca a página imediatamente, inclusive por gesto.

A biblioteca PageFlip 2.0.7 anima folhas curvas e sombras. A versão é fixa: `ManagedPageFlip` gerencia o loop de renderização e seu descarte; `bookDrag` usa o controlador dessa versão para concluir ou devolver a dobra. React não modifica o DOM interno controlado pelo motor.

A largura disponível define uma ou duas páginas. O conteúdo é medido em fluxo normal, com a largura real da folha e fontes carregadas, antes de iniciar o motor. Isso evita subestimar a altura de um elemento absolutamente posicionado. Mudanças de largura reconstroem o motor preservando o capítulo, e o desmonte libera ponteiros, listeners e animação.

## Verificação

- Testes de regressão de gestos em `tests/bookDrag.test.js`.
- Chromium: avanço/retorno de todos os pares, dobra durante a animação, limites, índice, teclado, resize e movimento reduzido.
- Toque via protocolo do Chromium: borda, swipe curto, cancelamento e rolagem vertical sem troca de página.
- Leitura de todas as oito páginas em 390 px e última página em 320 px sem corte de texto; fechar/reabrir sem erro.
- O leitor foi testado isoladamente e no fluxo integrado porta-malas → livro → retorno/reabertura, com foco inicial, teclado e Escape no índice. A cena 3D usou o fallback de WebGL nesse teste integrado.
