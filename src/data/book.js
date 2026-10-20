// The Making Of: an editorial account of the project's decisions, not a verbatim chat log.
// Quoted requests below are excerpts of the original project brief and later user prompts.
export const entries = [
  {
    id: 'the-question',
    label: '01 / O PONTO DE PARTIDA',
    title: 'E se o site fosse uma viagem?',
    paragraphs: [
      'A primeira decisão foi abandonar a página comum de seções empilhadas. O pedido que abriu o projeto dizia: “Não quero apenas uma página tradicional com textos e imagens. Quero uma experiência visual imersiva, na qual o visitante percorre uma estrada a bordo de um carro clássico.”',
      'A estrada nasceu como forma de navegação e como metáfora. “Highway to Hell” já traz movimento, direção e destino no próprio nome. Ao rolar a página, o visitante avança; ao voltar, revisita a viagem. Assim, a história do AC/DC pode ser descoberta como percurso, não como uma lista de datas.',
    ],
  },
  {
    id: 'first-route',
    label: '02 / PRIMEIRO MAPA',
    title: 'Primeiro a estrada. Depois a história.',
    paragraphs: [
      'O briefing original separou o trabalho em duas fases: construir a experiência visual e só depois contar a biografia. Os primeiros marcos eram provisórios. Essa escolha permitiu acertar câmera, ritmo, cenário e leitura antes de preencher o caminho com acontecimentos históricos.',
      'O scroll controla um progresso contínuo. Estrada, carro, iluminação e objetos laterais respondem ao mesmo percurso. Prometheus Fuels foi citado como referência de câmera e continuidade, sem pedir uma cópia visual. A viagem é reversível: ninguém precisa recomeçar para rever um trecho ou abrir um capítulo anterior.',
      'Prompt-chave: “Conforme o usuário realiza o scroll, o carro avança pela estrada. Os cenários se transformam gradualmente.”',
    ],
  },
  {
    id: 'the-car',
    label: '03 / O PROTAGONISTA',
    title: 'Um carro de verdade no centro.',
    paragraphs: [
      'O carro precisava ter presença de cena, não parecer um brinquedo feito de formas básicas. O conceito inicial mencionava um Dodge Challenger R/T 1970; o arquivo 3D que chegou ao projeto era um Dodge Charger R/T 1970 inspirado em Fast X. A implementação passou a usar o modelo efetivamente fornecido.',
      'Escala, orientação, materiais e enquadramento foram ajustados em torno desse arquivo. A geometria original foi preservada. Quando se verificou que as rodas não estavam separadas como peças animáveis, o projeto evitou simular uma rotação que deformaria o veículo.',
      'Diretriz recorrente nos pedidos: preservar o modelo original e nunca trocá-lo por um carro de cubos e cilindros.',
    ],
  },
  {
    id: 'roadside-stage',
    label: '04 / CENOGRAFIA',
    title: 'A beira da estrada virou palco.',
    paragraphs: [
      'O mundo precisava falar de AC/DC mesmo entre um capítulo e outro. Vieram guitarras, amplificadores, microfones, sinos associados a Hells Bells, relâmpagos e sinais de estrada inspirados nas décadas de 1970 e 1980.',
      'A regra de composição foi distribuir as referências em trechos diferentes, com escala e espaçamento que deixassem os objetos se aproximar e passar pelas laterais conforme o carro avança. O pedido também foi claro sobre qualidade: não substituir peças detalhadas por formas grosseiras nem baixar modelos sem conferir suas condições de uso.',
    ],
  },
  {
    id: 'hell-gate',
    label: '05 / O DESTINO',
    title: 'O inferno precisava existir.',
    paragraphs: [
      'A estrada não poderia terminar num corte para uma tela preta. O pedido foi explícito: “Não quero uma tela preta com a palavra HELL ou um fundo estático de fogo.” O destino deveria ser um lugar tridimensional ao qual o carro realmente chegasse.',
      'A solução construiu uma aproximação gradual: o horizonte esquenta, surgem rochas vulcânicas, fumaça discreta e um portal monumental. A câmera valoriza a chegada sem trocar o carro. O nono marco ficou reservado ao portão do inferno, depois dos oito capítulos históricos. O scroll reverso mantém aberto o caminho de volta.',
    ],
  },
  {
    id: 'trunk',
    label: '06 / THE BACKSTAGE',
    title: 'O bastidor estava no porta-malas.',
    paragraphs: [
      'The Making Of precisava parecer parte da viagem. Surgiu a ideia de se aproximar da traseira do carro e encontrar um porta-malas de roqueiro: livro, guitarra, discos e lembranças de estrada. O acesso deixou de ser apenas uma troca de página.',
      'O modelo do carro não oferecia tampa e interior separados para uma abertura confiável. Em vez de forçar a geometria, foi criada uma cena 3D própria para o interior. Depois, a animação de estacionar foi retirada a pedido do projeto; clicar em The Making Of passou a provocar somente um zoom cinematográfico.',
    ],
  },
  {
    id: 'trunk-composition',
    label: '07 / OBJETOS E FOCO',
    title: 'Desarrumado, mas com direção.',
    paragraphs: [
      'A primeira composição do porta-malas parecia rígida e desalinhada. Referências visuais levaram a carroceria preta, carpete escuro, pneu sobressalente, guitarra em destaque e CDs de Back in Black, Highway to Hell e The Razors Edge. Vieram também palhetas, papéis e pequenos vestígios de turnê.',
      'Os modelos 3D enviados para a guitarra e o livro foram integrados à cena. O livro foi movido para o centro e ganhou protagonismo. Houve um ajuste decisivo de interação: somente ele abre conteúdo. Guitarra, CDs e objetos menores continuam no cenário, mas não competem pelo clique. A desordem passou a ser intencional, como a bagagem de uma viagem longa.',
    ],
  },
  {
    id: 'book-feel',
    label: '08 / O OBJETO LIVRO',
    title: 'Páginas que dão vontade de tocar.',
    paragraphs: [
      'O livro não deveria ser só um painel de texto. A referência trazia papel envelhecido, bordas gastas e sensação de volume. A interface ganhou páginas com animação de folhear, tipografia de rock, capa física e adaptação para telas menores.',
      'O teste real revelou um problema importante: arrastar uma página selecionava o texto. O gesto foi ajustado para preservar a leitura e fazer o papel responder como objeto. Controles redundantes e avisos que atrapalhavam a cena foram removidos. O objetivo era simples: abrir, folhear e voltar ao porta-malas sem perder a posição na estrada.',
    ],
  },
  {
    id: 'history-research',
    label: '09 / PESQUISA HISTÓRICA',
    title: 'Oito capítulos antes do portal.',
    paragraphs: [
      'Quando a estrada já tinha linguagem própria, chegou a biografia: da formação em Sydney, em 1973, à fase Bon Scott, à consagração de Highway to Hell, à perda de 1980, à era Brian Johnson e ao legado recente. O conteúdo foi organizado em exatamente oito capítulos; o nono destino continua sendo o inferno.',
      'Textos, datas, fotos, legendas e fontes ficaram separados da interface. Imagens históricas foram escolhidas com atenção ao período e às condições de uso. Nos dois primeiros capítulos, fotografias posteriores foram aceitas e identificadas como retrospectivas, sem fingir que registram a estreia da banda.',
    ],
  },
  {
    id: 'cards-to-billboards',
    label: '10 / MUDANÇA DE ROTA',
    title: 'Os slides saíram da frente.',
    paragraphs: [
      'Os primeiros capítulos apareceram como slides sobre a cena. Eles contavam a história, mas disputavam espaço com o carro e pareciam pertencer a outra interface. Uma tentativa de deslocar a câmera para proteger o veículo foi revertida porque a composição anterior funcionava melhor.',
      'Então veio o prompt que mudou a apresentação: “em vez de slides serão outdoors em beira d estrada, o q acha?” A história passou a ocupar o próprio mundo 3D. Ano, título e fotografia aparecem nas placas; um convite discreto abre o capítulo completo. O carro continua visível e a viagem não precisa parar.',
    ],
  },
  {
    id: 'billboard-refinement',
    label: '11 / RITMO DA LEITURA',
    title: 'Uma placa leva à seguinte.',
    paragraphs: [
      'Os outdoors precisavam funcionar como uma sequência, não como oito atalhos desconectados. A opção de leitura agora muda quando o carro passa fisicamente por uma placa, apontando para o capítulo seguinte. Voltar pela estrada também faz a sequência retroceder.',
      'As fotografias foram colocadas na face dos outdoors, além do capítulo aberto. Um problema de carregamento mostrou que os capítulos 4 a 8 não tinham URLs diretas de imagem; miniaturas e arquivos alternativos foram adicionados. No convite da interface, sobraram apenas o período e o título, para deixar a paisagem respirar.',
    ],
  },
  {
    id: 'sound-and-credits',
    label: '12 / SOM E AUTORIA',
    title: 'Volume sob escolha do visitante.',
    paragraphs: [
      'A música entrou depois que a experiência visual já estava montada. Primeiro houve um player incorporado; depois foi substituído pelo arquivo de áudio enviado para o projeto. A faixa começa pausada e só toca quando o visitante aperta o controle. O som acompanha a estrada sem ser imposto a quem chega.',
      'O cabeçalho também passou a registrar Gustavo Goularte, Gustavo Justo e Erik Carvalho. A navegação foi ajustada para continuar próxima desses créditos nas larguras intermediárias, sem perder legibilidade no celular.',
    ],
  },
  {
    id: 'how-built',
    label: '13 / POR BAIXO DO CAPÔ',
    title: 'Uma ideia, um mesmo percurso.',
    paragraphs: [
      'React organiza as áreas do site e o conteúdo do livro. Three.js e React Three Fiber desenham a estrada, o carro, a cenografia e o destino final. Um valor de progresso vindo do scroll sincroniza deslocamento, câmera e capítulos, mantendo a viagem reversível.',
      'Conteúdo histórico e páginas deste livro vivem em arquivos de dados, separados dos componentes visuais. Isso permite revisar uma narrativa sem reconstruir o 3D. As mudanças são verificadas com testes e build antes de serem enviadas ao repositório e publicadas.',
    ],
  },
  {
    id: 'creative-rule',
    label: '14 / A REGRA QUE FICOU',
    title: 'O caminho conta a história.',
    paragraphs: [
      'Cada rodada de feedback ajustou a mesma pergunta: como fazer a pessoa sentir que está viajando com a banda? O carro deixou de ser decoração. A estrada virou linha do tempo. Os outdoors deixaram a biografia morar na paisagem. O porta-malas guardou o processo de criação dentro da própria ficção do site.',
      'Este livro registra escolhas, correções e trechos dos pedidos que guiaram o resultado. Ele não é uma transcrição completa dos prompts, nem finge que tudo nasceu pronto. A melhor ideia do projeto apareceu no caminho: deixar a experiência mudar quando a estrada mostrou que precisava de outra direção.',
    ],
  },
  {
    id: 'prompt-trail',
    label: '15 / TRILHA DE PROMPTS',
    title: 'Pedidos que mudaram a direção.',
    paragraphs: [
      'Os comandos decisivos vieram em momentos diferentes. Para o destino: “Não quero uma tela preta com a palavra HELL ou um fundo estático de fogo.” Para o conteúdo extra: “O porta-malas deverá ser o ambiente que apresenta os objetos interativos.” Para a história: “A estrada deve funcionar como uma linha do tempo cinematográfica do AC/DC.”',
      'A virada da interface veio em uma frase curta: “em vez de slides serão outdoors em beira d estrada”. Mais tarde, o ritmo foi refinado: “sempre que passar por um ja deve aparecer a opção de abrir outro”. Cada trecho acima é um excerto dos pedidos; as soluções descritas neste livro nasceram da implementação e das revisões que vieram depois.',
    ],
  },
  {
    id: 'prompt-synthesis',
    label: '16 / PROMPT-SÍNTESE',
    title: 'Se a viagem começasse hoje.',
    paragraphs: [
      'Síntese editorial dos pedidos, não um prompt literal da conversa: “Crie um site cinematográfico sobre AC/DC no qual o scroll conduz um Dodge Charger 3D original por uma estrada reversível. Conte oito capítulos históricos em outdoors com fotografias identificadas; faça do nono marco um portal infernal tridimensional. Preserve o carro e a leitura em todos os tamanhos de tela.”',
      '“Transforme The Making Of em um livro folheável acessado por um porta-malas de roqueiro. O livro é o foco e o único objeto clicável dessa cena. Use cenografia temática com moderação, mantenha o áudio pausado até o visitante tocar e registre fontes, créditos, limitações e decisões.” O resultado continua aberto a novas curvas.',
    ],
  },
];
