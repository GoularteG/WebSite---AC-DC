# Carregamento completo das cenas 3D

O menu, a estrada e o porta-malas só informam conclusão a partir do Canvas correspondente. A prontidão não depende mais apenas do carro nem de dois frames iniciais.

## Recursos e GPU

`SceneLoading` cria um registro por Canvas. `ScenePending` acompanha os modelos carregados em boundaries de Suspense internos; os pôsteres próximos da estrada registram suas fontes, imagens e atualização da textura. Concluir um recurso não libera outro que ainda esteja pendente. Recursos que falham concluem apenas após o fallback existente ficar definido.

`SceneReady` aguarda o registro ficar vazio e deixa os primeiros frames prepararem instâncias e mapas de ambiente. Depois compila materiais com `compileAsync`, envia as texturas com `initTexture`, solicita um frame completo e confirma a conclusão dos comandos com uma fence WebGL2. No caminho sem fence, usa `finish` uma única vez. O loader não se encerra por prazo fixo. Desmontagem ou novos recursos cancelam a preparação anterior e liberam a fence.

O Canvas da estrada usa uma boundary de cena: o carro não libera a tela antes dos outros elementos. O estado da estrada e do menu é invalidado quando trocar de aba desmonta o Canvas. O porta-malas volta a aguardar sua própria preparação ao ser aberto novamente.

## Correção da saída antecipada

O conteúdo de compatibilidade passado ao atributo `fallback` do React Three Fiber permanece dentro de `<canvas>` no DOM, mesmo com WebGL funcionando. O observador antigo encontrava esse aviso e tratava a cena como indisponível, retirando o loader enquanto os modelos ainda baixavam. `hasVisibleSceneFailure` ignora os descendentes de Canvas e só reconhece uma falha renderizada fora dele, dentro da cena ativa. Um aviso da estrada escondida atrás do porta-malas também não encerra o carregamento do porta-malas.

## Validação

- Testes do registro: múltiplas tarefas, tarefas descobertas depois, escopos separados, cleanup idempotente e snapshots estáveis.
- Regressão do aviso de compatibilidade dentro de Canvas e de falhas sem caixa renderizada.
- Chromium WebGL2/SwiftShader: menu com GLB do carro retido; estrada com fotos retidas; porta-malas com GLB do livro retido. Em todos, o loader permaneceu aberto.
- GPU: `clientWaitSync` mantido em `TIMEOUT_EXPIRED` no teste. Nenhuma das três cenas foi liberada até devolver a conclusão real da fence.
- Erro de outra cena: aviso injetado na estrada não encerrou a espera do porta-malas.
- Chromium com WebGL desabilitado: falhas reais do menu e do porta-malas liberaram o fallback acessível, sem espera infinita.
