# Aparência do livro

Atualização visual inspirada no print fornecido: capa de couro, detalhes metálicos, papel envelhecido com bordas irregulares, espessura de folhas, lombada sombreada e marcador de tecido. O arquivo `src/data/book.js` foi preservado integralmente; nenhuma entrada, título ou parágrafo foi alterado.

A biblioteca PageFlip 2.0.7 dobra as folhas com sombras durante o avanço e o retorno. Suporta controles, sumário e gestos. Movimento reduzido usa troca imediata. Em telas estreitas, uma página é mostrada por vez. A altura é calculada pelo maior conteúdo na largura real, evitando cortar registros longos.

`ManagedPageFlip` adapta o ciclo de renderização da biblioteca: cancela o requestAnimationFrame e os listeners ao desmontar e evita redesenhar texturas durante repouso. A versão da dependência está fixada porque o adaptador usa os módulos-fonte e o ciclo de renderização dessa versão.

A textura SVG de papel foi criada para o projeto. A referência foi usada para materiais e volume, sem copiar personagens, ilustrações ou textos.
