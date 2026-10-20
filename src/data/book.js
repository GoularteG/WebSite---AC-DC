// The Making Of: an editorial account of the project's decisions, not a verbatim chat log.
// Quoted requests are excerpts of the original brief and later user prompts.
export const entries = [
  {
    id: 'the-road',
    label: '01 / A IDEIA',
    title: 'E se o site fosse uma viagem?',
    paragraphs: [
      'O projeto começou com uma recusa à página comum: “Não quero apenas uma página tradicional com textos e imagens. Quero uma experiência visual imersiva, na qual o visitante percorre uma estrada a bordo de um carro clássico.” Highway to Hell já trazia movimento, direção e destino no próprio nome.',
      'A estrada virou navegação e metáfora. O scroll faz o carro avançar; voltar pela página permite revisitar o caminho. Primeiro foram construídos câmera, cenário e ritmo, com marcos provisórios. A biografia veio depois, quando já havia um mundo capaz de recebê-la. Prometheus Fuels serviu como referência de continuidade cinematográfica, sem ser copiado.',
    ],
  },
  {
    id: 'the-car',
    label: '02 / CARRO E PAISAGEM',
    title: 'Um protagonista, um palco.',
    paragraphs: [
      'O conceito inicial citava um Dodge Challenger R/T 1970; o modelo enviado era um Dodge Charger R/T 1970 inspirado em Fast X. Foi esse arquivo 3D que entrou no projeto. Escala, orientação, materiais e câmera foram ajustados sem trocar sua geometria por um carro feito de formas básicas. As rodas não eram peças separadas, então não se simulou uma rotação que deformaria o modelo.',
      'A paisagem também precisava soar como AC/DC. Guitarras, amplificadores, microfones, sinos, raios e sinais de estrada foram distribuídos por trechos diferentes. Ao passar pelas laterais do carro, transformam a viagem em uma exposição de rock em movimento.',
    ],
  },
  {
    id: 'the-destination',
    label: '03 / O NONO MARCO',
    title: 'O inferno precisava existir.',
    paragraphs: [
      'O pedido foi explícito: “Não quero uma tela preta com a palavra HELL ou um fundo estático de fogo.” A estrada precisava chegar a um lugar. Por isso o horizonte esquenta progressivamente até revelar rochas vulcânicas, fumaça discreta e um portal monumental, sem substituir o carro original.',
      'O destino ficou como nono marco, depois dos oito capítulos da história da banda. A câmera valoriza a chegada, mas o caminho continua reversível: basta subir a estrada para reencontrar capítulos e cenários anteriores. O final não interrompe a viagem; dá a ela um ponto de conclusão visual.',
    ],
  },
  {
    id: 'the-backstage',
    label: '04 / THE BACKSTAGE',
    title: 'O processo coube no porta-malas.',
    paragraphs: [
      'The Making Of precisava pertencer à viagem. Surgiu então um porta-malas de roqueiro com livro, guitarra, CDs, pneu e lembranças de estrada. Como a tampa e o interior do carro não estavam separados para uma abertura segura, foi criada uma cena 3D própria. A animação de estacionar acabou removida; clicar na seção provoca apenas um zoom para a traseira.',
      'Referências visuais levaram ao acabamento preto e à desordem intencional. Os modelos enviados para guitarra e livro foram integrados à composição. O livro ficou no centro e tornou-se o único objeto clicável; os demais contam a história do ambiente sem competir pela atenção.',
    ],
  },
  {
    id: 'the-book',
    label: '05 / O LIVRO',
    title: 'Papel, gesto e memória.',
    paragraphs: [
      'O livro não deveria parecer um painel de texto. Papel envelhecido, capa com volume, letras de rock e animação de folhear deram a ele presença de objeto. Um teste mostrou que arrastar a página selecionava palavras, quebrando a ilusão; o gesto foi corrigido para privilegiar o folhear.',
      'Controles e avisos que poluíam a experiência foram reduzidos. O visitante pode abrir, ler e voltar ao porta-malas sem perder seu ponto na estrada. As páginas guardam o histórico das escolhas, inclusive os pedidos que mudaram a direção do projeto. Este relato é uma edição desse percurso, não uma transcrição integral da conversa.',
    ],
  },
  {
    id: 'the-history',
    label: '06 / OITO CAPÍTULOS',
    title: 'A banda entrou na estrada.',
    paragraphs: [
      'Depois da base visual, a história do AC/DC ganhou oito capítulos: da formação em Sydney à era Bon Scott, à virada de Highway to Hell, ao luto de 1980, ao retorno com Brian Johnson e ao legado recente. Texto, datas, fotos e fontes ficaram em dados separados da interface.',
      'As fotografias foram escolhidas com atenção ao período e às condições de uso. Para os dois primeiros capítulos, imagens posteriores foram aceitas e identificadas como retrospectivas. Assim, a paisagem pode contar fatos reais sem tratar uma foto icônica de outra época como registro do acontecimento narrado.',
    ],
  },
  {
    id: 'the-billboards',
    label: '07 / A VIRADA VISUAL',
    title: 'Os slides viraram outdoors.',
    paragraphs: [
      'Os slides sobre a cena disputavam espaço com o carro. Uma mudança de câmera foi testada e revertida. Então veio a pergunta decisiva: “em vez de slides serão outdoors em beira d estrada, o q acha?” Ano, título e fotografia passaram para placas dentro do mundo 3D; o texto completo abre quando o visitante escolhe um capítulo.',
      'O convite de leitura avança assim que o carro passa pela placa e retrocede com a estrada. O texto da interface foi enxugado para mostrar só período e título. Quando algumas imagens não carregaram, foram acrescentadas URLs alternativas. A história passou a fazer parte da paisagem, sem cobrir a viagem.',
    ],
  },
  {
    id: 'the-prompt',
    label: '08 / PROMPT-SÍNTESE',
    title: 'Se a viagem começasse hoje.',
    paragraphs: [
      'Síntese editorial dos pedidos, não um prompt literal: “Crie um site cinematográfico sobre AC/DC. O scroll conduz o Dodge Charger 3D original por uma estrada reversível, com cenografia de rock. Conte oito capítulos históricos em outdoors com fotos identificadas; faça do nono marco um portal infernal tridimensional.”',
      '“Acesse The Making Of por um porta-malas de roqueiro. No interior, o livro é o foco e o único objeto clicável. Permita folhear sem selecionar texto, preserve a leitura no celular e deixe a música pausada até o visitante tocar.” O projeto usa React e Three.js para sincronizar essa viagem. Gustavo Goularte, Gustavo Justo e Erik Carvalho aparecem nos créditos do site.',
    ],
  },
];
