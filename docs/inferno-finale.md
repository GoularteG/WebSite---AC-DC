# Destino final — Highway to Hell

`InfernoFinale.jsx` cria uma paisagem tridimensional original: arco monumental de basalto, borda incandescente, penhascos vulcânicos, canais de lava fora do asfalto, seis planos suaves de fumaça e 28/64 partículas em qualidade leve/alta. Não usa arquivos externos, pós-processamento nem luzes adicionais. As 52 rochas compartilham uma geometria instanciada.

`data/finale.js` fornece transições contínuas pela distância real do carro. Entre 74% e 98% do trajeto, atmosfera, neblina, materiais da pista e iluminação existente mudam gradualmente. A câmera abre o enquadramento nos últimos 9%. O modelo e o percurso original do veículo são preservados: termina em 720 m, diante do portal em 755 m.

A mensagem aparece quando o veículo chega efetivamente ao destino; o scroll reverso recompõe todos os estados e o botão retorna ao início do trecho final. Movimento reduzido elimina a interpolação da viagem, mantendo scroll e botões. Fumaça e partículas se deslocam conforme a distância, sem manter um ciclo de renderização contínuo em repouso.
