# PROJETO: AC/DC — HIGHWAY TO HELL
## Desenvolvimento de Website Interativo com Experiência Cinematográfica 3D

Você será responsável por desenvolver um website interativo inspirado na estética da banda de rock AC/DC, utilizando uma combinação de animações 3D, storytelling visual, scroll interativo e elementos cinematográficos.

Este projeto deve ser tratado como um desenvolvimento profissional, com código organizado, arquitetura escalável, animações fluidas e identidade visual consistente.

**IMPORTANTE: não quero apenas uma página tradicional com textos e imagens. Quero uma experiência visual imersiva, na qual o visitante percorre uma estrada a bordo de um carro clássico, descobrindo elementos inspirados no universo do AC/DC.**

---

# 1. CONCEITO PRINCIPAL

O nome do projeto será:

**AC/DC — HIGHWAY TO HELL**

A proposta é criar uma experiência digital na qual o usuário acompanha um carro percorrendo uma estrada temática, inspirada na música "Highway to Hell".

A navegação deve funcionar principalmente através da rolagem da página.

Conforme o usuário realiza o scroll:

- O carro avança pela estrada.
- Os cenários se transformam gradualmente.
- Elementos temáticos aparecem nas laterais.
- A câmera pode mudar suavemente de ângulo.
- A iluminação acompanha as mudanças do ambiente.
- Novas seções e experiências são reveladas.

A ideia central é que a estrada funcione como uma linha do tempo visual.

**No futuro, essa estrada contará a história e a biografia do AC/DC, desde sua formação até os dias atuais.**

Entretanto, nesta primeira fase, NÃO IMPLEMENTE a história da banda.

Primeiro precisamos construir e aperfeiçoar a experiência visual e a tecnologia.

Utilize capítulos fictícios ou identificadores provisórios apenas para testar a navegação.

---

# 2. REFERÊNCIA PRINCIPAL — PROMETHEUS FUELS

O principal website de referência é:

https://beta.prometheusfuels.com/chapter3

Analise esse website, caso o ambiente permita, prestando atenção especialmente aos seguintes aspectos:

- Movimentação do carro.
- Perspectiva cinematográfica.
- Interatividade associada ao scroll.
- Deslocamento ao longo do cenário.
- Movimentação de câmera.
- Profundidade dos ambientes.
- Iluminação e reflexos.
- Transições visuais.
- Qualidade da renderização 3D.
- Sensação de velocidade e continuidade.

Não quero uma reprodução literal do website.

Quero utilizar a experiência de navegação e a sensação cinematográfica como referência para criar uma identidade própria inspirada no AC/DC.

Caso não consiga acessar ou inspecionar o site, não invente detalhes sobre seu funcionamento. Utilize os princípios descritos neste documento.

---

# 3. CARRO PRINCIPAL — DODGE CHALLENGER R/T 1970

O carro será um dos elementos mais importantes de todo o projeto.

O modelo escolhido é o:

**Dodge Challenger R/T 1970.**

Eu fornecerei um arquivo contendo o modelo 3D do carro.

## REGRA OBRIGATÓRIA

Utilize o modelo 3D enviado por mim.

NÃO substitua o modelo fornecido por carros criados com cubos, cilindros ou geometrias básicas.

Nas versões anteriores do projeto, foram criados carros proceduralmente, mas o resultado visual ficou muito distante do desejado.

Quero que o novo projeto utilize o arquivo 3D real para garantir fidelidade visual.

## Integração do modelo

Ao receber o arquivo:

1. Identifique o formato e a estrutura.
2. Verifique geometria, materiais e texturas.
3. Preserve os detalhes do modelo original.
4. Corrija escala e orientação dos eixos, se necessário.
5. Posicione o carro corretamente sobre a estrada.
6. Configure materiais e iluminação.
7. Identifique se as rodas são objetos independentes e podem ser animadas.
8. Otimize o carregamento para a web.

Se o arquivo exigir conversão, informe a necessidade e utilize ferramentas compatíveis.

Não modifique irreversivelmente o arquivo original.

## Aparência desejada

O carro deverá apresentar:

- Materiais automotivos realistas.
- Pintura com reflexos visíveis.
- Vidros com aparência convincente.
- Lanternas traseiras iluminadas.
- Sombras adequadas.
- Reflexos da iluminação do ambiente.
- Boa definição de carroceria e detalhes.

A cor preferida é preto ou grafite escuro, desde que os detalhes permaneçam claramente visíveis.

## Posicionamento e câmera

A perspectiva principal deve ser traseira ou traseira em três quartos.

O visitante deve ter a sensação de acompanhar o carro ao longo da estrada.

Em determinados momentos, a câmera pode assumir posições laterais ou cinematográficas, retornando depois à perspectiva principal.

O movimento deve ser suave, evitando mudanças bruscas.

---

# 4. ESTRADA 3D E AMBIENTAÇÃO

A estrada é o segundo elemento mais importante do projeto.

Ela não pode ser somente um plano escuro com faixas se movendo.

Quero uma estrada com profundidade, personalidade e composição visual.

## Características

- Estrada asfaltada.
- Perspectiva tridimensional.
- Faixas centrais.
- Acostamento.
- Curvas suaves.
- Horizonte visível.
- Elementos de cenário distribuídos nas laterais.
- Transições ambientais.
- Sombras e iluminação.
- Sensação real de deslocamento.

O carro deve parecer conectado à estrada.

Ao rolar a página, os objetos do cenário devem se deslocar de maneira coerente, criando profundidade e parallax.

O scroll para cima deve permitir retornar pelo percurso.

## Iluminação — ponto crítico

As versões anteriores ficaram excessivamente escuras, principalmente na região do carro.

Não repita esse problema.

A estética deve ser sombria e cinematográfica, mas isso NÃO significa deixar o carro praticamente invisível.

Quero uma composição com:

- Céu em tons de vermelho, laranja e preto.
- Luzes quentes no horizonte.
- Iluminação ambiente suficiente.
- Reflexos na carroceria.
- Luz de preenchimento sobre o carro.
- Contraste entre o cenário e o veículo.
- Eventuais efeitos de fumaça e névoa.

A prioridade é garantir que o visitante consiga visualizar claramente o carro e o caminho.

---

# 5. REFERÊNCIAS AO AC/DC NAS LATERAIS DA ESTRADA

Este requisito é essencial.

A estrada precisa conter referências visuais à banda AC/DC, distribuídas ao longo do percurso.

Não quero apenas postes ou pequenas placas repetitivas.

Quero elementos grandes, reconhecíveis e cenograficamente interessantes.

## Exemplos de elementos

### Guitarras

- Guitarras elétricas clássicas.
- Guitarras inspiradas nos instrumentos de Angus Young e Malcolm Young.
- Esculturas de guitarras gigantes nas laterais.
- Guitarras apoiadas em estruturas ou elementos de palco.

### Integrantes da banda

- Representações visuais de cantores e guitarristas.
- Silhuetas ou figuras de palco.
- Referências à performance de Angus Young.
- Elementos inspirados em Bon Scott e Brian Johnson.

Caso sejam utilizadas fotografias ou modelos realistas de integrantes, utilize recursos licenciados ou autorizados.

### Elementos musicais

- Amplificadores.
- Caixas de som.
- Microfones.
- Estruturas de iluminação de shows.
- Palcos.
- Relâmpagos.
- Sinalizações de estrada com temática rock.
- Elementos visuais inspirados em álbuns clássicos.

Esses objetos devem estar posicionados no espaço tridimensional e participar do movimento da viagem.

Conforme o carro avança, eles devem surgir ao fundo, aproximar-se e passar pelas laterais.

Evite elementos genéricos, pequenos demais ou excessivamente repetidos.

O objetivo é transformar a estrada em uma galeria cinematográfica do universo AC/DC.

---

# 6. IDENTIDADE VISUAL E TIPOGRAFIA

A identidade deve ser fortemente inspirada na estética clássica do AC/DC.

## Paleta de cores

Utilize como referência:

- Preto: #101010
- Vermelho: #A40F17
- Vermelho intenso: #F0441B
- Amarelo elétrico: #F6B643
- Bege envelhecido: #D6C5A7

Essas cores não são obrigatórias em todas as situações; podem ser ajustadas para favorecer a direção de arte.

## Fonte e logotipo

Quero títulos com a identidade visual do AC/DC.

Priorize uma tipografia rock clássica, angular, pesada e agressiva.

Se houver um recurso original de marca autorizado para o projeto, ele poderá ser utilizado como elemento gráfico.

Não utilize simplesmente uma fonte genérica condensada como substituição definitiva da identidade visual.

Caso a fonte exata não esteja disponível ou não seja licenciada, utilize uma alternativa inspirada no estilo, deixando essa limitação clara.

Para textos de leitura, utilize uma fonte secundária legível.

## Estilo visual

A direção artística deve misturar:

- Rock clássico.
- Shows de estádio.
- Estrada americana.
- Muscle cars dos anos 1970.
- Fogo e relâmpagos.
- Iluminação de palco.
- Cinema.
- Elementos vintage.

Evite uma interface que pareça um dashboard ou painel administrativo.

Quero algo visualmente marcante, com personalidade e impacto.

---

# 7. ESTRUTURA DO WEBSITE — DUAS ABAS

O website deverá possuir apenas duas áreas principais.

## ABA 01 — THE HIGHWAY

Esta será a experiência principal.

Ela deve conter:

- Tela de abertura impactante.
- Título Highway to Hell.
- Identidade visual do AC/DC.
- Botão para iniciar a experiência.
- Carro 3D.
- Estrada cinematográfica.
- Movimentação controlada pelo scroll.
- Cenários temáticos.
- Marcos provisórios de navegação.
- Transições suaves.
- Indicador de progresso discreto.

Evite textos longos sobrepostos à estrada durante o desenvolvimento inicial.

O destaque deve ser o ambiente tridimensional.

A biografia será implementada futuramente.

## ABA 02 — THE MAKING OF

Esta aba deverá funcionar como um livro digital.

Seu objetivo é documentar o desenvolvimento completo do projeto.

A experiência deve lembrar um livro físico antigo.

### Aparência

- Capa escura.
- Textura de couro ou papel envelhecido.
- Detalhes vermelhos.
- Páginas em tom de pergaminho.
- Duas páginas abertas em telas grandes.
- Numeração de páginas.
- Sumário.
- Animação de virar páginas.

### Conteúdo

O livro deverá registrar:

- Origem da ideia.
- Referências visuais.
- Escolha das tecnologias.
- Prompts utilizados.
- Decisões de arquitetura.
- Evolução do modelo do carro.
- Problemas encontrados.
- Soluções implementadas.
- Melhorias visuais.
- Versões do projeto.

### Requisito importante

Cada novo registro deve se tornar uma nova página do livro.

Desenvolva a estrutura de forma que os registros possam ser adicionados a um arquivo de dados, sem necessidade de reescrever o componente visual.

O livro deve crescer ao longo do desenvolvimento.

Inicialmente, registre as decisões já descritas neste prompt.

---

# 8. TECNOLOGIAS

Utilize preferencialmente:

- React.
- Vite.
- JavaScript.
- Three.js.
- React Three Fiber.
- @react-three/drei.
- GSAP.
- GSAP ScrollTrigger.
- Tailwind CSS, se for conveniente.
- Biblioteca compatível para animação do livro.
- Git e GitHub para versionamento.

Outras bibliotecas podem ser incorporadas quando tecnicamente justificadas.

Priorize uma arquitetura organizada, modular e escalável.

Sugestão de organização:

```text
src/
  components/
    layout/
    highway/
    car/
    environment/
    roadside/
    book/
  scenes/
  hooks/
  data/
  styles/
  assets/
public/
  models/
  textures/
  images/
  audio/
```

A estrutura pode ser ajustada conforme a implementação.

Evite concentrar toda a lógica da experiência em um único componente.

---

# 9. ANIMAÇÕES E EXPERIÊNCIA DO USUÁRIO

A movimentação deve ser um dos diferenciais do projeto.

## Scroll

A posição do scroll deverá determinar o progresso do veículo ao longo da estrada.

Use interpolação para evitar movimentos bruscos.

## Câmera

A câmera deve acompanhar o veículo e permitir transições cinematográficas entre posições predefinidas.

## Rodas

Se o modelo disponibilizar rodas separadas, anime a rotação conforme o deslocamento.

## Cenário

Elementos laterais devem possuir posicionamento coerente em 3D, escala com profundidade e movimento relativo ao carro.

## Desempenho

Otimize o carregamento do modelo, texturas, efeitos de iluminação e renderização.

Controle o consumo de memória e ofereça alternativas para dispositivos menos potentes.

Inclua suporte responsivo e considere usuários com preferência por movimento reduzido.

---

# 10. ÁUDIO

A música "Highway to Hell" é a inspiração principal.

No futuro, quero estudar a possibilidade de sincronizar eventos visuais da estrada com momentos da música.

Por enquanto:

- Prepare a arquitetura para suporte a áudio.
- Não incorpore automaticamente gravações comerciais sem autorização.
- Não inicie áudio sem interação do usuário.
- Deixe preparado um controle de ativar/desativar som.

A integração musical completa será realizada em outra etapa.

---

# 11. FLUXO DE DESENVOLVIMENTO NO CODEX WEB

Este projeto será desenvolvido diretamente no Codex da OpenAI.

Não quero depender de baixar arquivos ZIP, abrir uma nova pasta no VS Code e reinstalar as dependências a cada alteração.

Trabalhe diretamente no repositório do projeto.

## Requisitos

1. Crie ou organize a estrutura React + Vite.
2. Configure as dependências.
3. Garanta a execução de `npm run dev`.
4. Configure `npm run build`.
5. Utilize o sistema de versionamento para preservar alterações.
6. Se o ambiente permitir, disponibilize uma pré-visualização do website.
7. Execute as verificações necessárias após mudanças importantes.
8. Informe qualquer limitação do ambiente que impeça testes visuais.

Sempre que possível, implemente e valide diretamente as alterações, em vez de apenas explicar como fazê-las.

Não afirme que determinada funcionalidade foi testada se não conseguiu executá-la.

---

# 12. PRIORIDADES DE DESENVOLVIMENTO

Siga esta ordem:

## FASE 1 — Fundação

- Configuração do projeto.
- Estrutura React.
- Navegação entre duas abas.
- Identidade visual inicial.
- Configuração da cena 3D.

## FASE 2 — Carro

- Importação do modelo 3D fornecido.
- Ajuste de escala.
- Posicionamento.
- Materiais.
- Iluminação.
- Câmera.
- Animação básica.

**Esta é uma das fases mais importantes.**

## FASE 3 — Estrada

- Estrada tridimensional.
- Perspectiva.
- Movimento com scroll.
- Curvas.
- Elementos laterais.
- Atmosfera cinematográfica.

## FASE 4 — Cenografia AC/DC

- Guitarras.
- Cantores e guitarristas.
- Equipamentos musicais.
- Referências visuais.
- Transições de cenário.

## FASE 5 — The Making Of

- Livro visual.
- Animação das páginas.
- Sistema de registros.
- Documentação das decisões.

## FASE 6 — Polimento

- Melhorias de iluminação.
- Refinamento das animações.
- Responsividade.
- Performance.
- Correção de problemas.
- Testes de navegação.

## FASE FUTURA — História da banda

Somente quando eu solicitar, implemente:

- Fundação do AC/DC.
- Angus e Malcolm Young.
- Bon Scott.
- Highway to Hell (1979).
- Back in Black (1980).
- Brian Johnson.
- Thunderstruck.
- Evolução da banda.
- Legado e atualidade.

Essa fase não faz parte da implementação inicial.

---

# 13. CRITÉRIOS DE QUALIDADE

Considere o desenvolvimento satisfatório quando:

1. O carro fornecido estiver corretamente importado e visualmente convincente.
2. O carro estiver claramente visível, sem iluminação excessivamente escura.
3. A estrada possuir profundidade tridimensional.
4. O scroll controlar o avanço de forma suave.
5. As referências musicais nas laterais forem reconhecíveis.
6. O website possuir identidade visual forte inspirada no AC/DC.
7. As duas abas funcionarem.
8. O livro permitir a inclusão de novos registros.
9. A aplicação executar corretamente e realizar o build.
10. O projeto estiver preparado para continuar recebendo melhorias.

Não sacrifique fidelidade visual por soluções simplificadas quando os recursos reais estiverem disponíveis.

---

# 14. INSTRUÇÃO FINAL — INÍCIO DO DESENVOLVIMENTO

Quero que você assuma a implementação técnica do projeto.

Primeiro, analise os requisitos e verifique os arquivos que eu disponibilizar, especialmente o modelo 3D do Dodge Challenger R/T 1970.

Em seguida:

1. Avalie os arquivos do modelo e sua compatibilidade.
2. Planeje a arquitetura inicial.
3. Crie o projeto funcional.
4. Implemente a tela principal.
5. Integre o carro real à cena 3D.
6. Desenvolva uma primeira estrada navegável por scroll.
7. Adicione referências visuais iniciais nas laterais.
8. Crie a estrutura da aba The Making Of.
9. Execute os testes e o build disponíveis.
10. Apresente o resultado e as próximas melhorias recomendadas.

**Não quero que você permaneça apenas na etapa de planejamento. Quero que desenvolva uma primeira versão funcional do website.**

Priorize qualidade visual, especialmente do carro e da estrada.

O resultado precisa transmitir a sensação de dirigir um muscle car clássico em uma estrada cinematográfica inspirada no universo do AC/DC.

**A história da banda será adicionada somente depois que essa experiência estiver visualmente satisfatória.**