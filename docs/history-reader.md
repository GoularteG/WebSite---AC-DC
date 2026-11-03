# Leitor dos outdoors

O clique no outdoor ou no botão histórico abre um diálogo editorial com fotografia
sem recorte, legenda, crédito, período e narrativa. Marcos históricos e curiosidade
ficam abaixo; fontes e licença podem ser expandidas. Dados em `history.json` não
foram reescritos.

A navegação interna usa apenas os oito capítulos históricos. Não move o carro nem
altera o scroll da estrada. O último capítulo oferece retorno à estrada; o portal
continua sendo o destino 09 no percurso. Fechar com o botão ou Escape restaura o
foco e o scroll. O diálogo nativo restringe o foco ao painel aberto.

O cabeçalho e o rodapé permanecem visíveis; apenas o artigo rola. Em telas menores,
a fotografia vem antes do texto e o rodapé usa anterior, contador e próximo. Ao
mudar de capítulo, o artigo volta ao início e o título recebe foco. Animações usam
somente opacidade e deslocamento breve e respeitam movimento reduzido.

Validação: build e testes do projeto; Chromium na aplicação com fallback WebGL
para isolar a interface; oito capítulos, anterior, seleção direta, fontes, Escape,
restauração de foco/scroll e larguras 1440, 390 e 320 px. Falha de fotografias
simulada por bloqueio das requisições externas para verificar os fallbacks.
