# AC/DC — Highway to Hell

Primeira versão experimental em React + Vite + Three.js / React Three Fiber / Drei. Sem biografia da banda e sem gravações comerciais. Implementação no repositório original.

## Executar

```sh
npm ci
npm run dev
npm run test
npm run build
npm run preview
```

Vite serve na porta 5173 por padrão. `dist/` contém o build estático. Não há backend nem segredos. Para hospedagem, configurar fallback de SPA para index.html.

## Experiência

Duas áreas: **The Highway** e **The Making Of**. Inicie a estrada e role nos dois sentidos, ou selecione um dos quatro marcos. Page Up/Down, Home e End usam a navegação nativa do navegador. A posição da câmera é derivada da mesma curva que constrói a estrada. O modo leve limita DPR a 1 e desliga sombras; o modo alto limita DPR a 1,5. Movimento reduzido troca a rolagem contínua por navegação pelos marcos, sem interpolação. Ao abrir o livro, a cena desmonta e libera os recursos declarativos do Canvas.

## Modelo do carro: pendente

**O usuário enviou apenas o briefing. O Challenger não está integrado nem visualmente validado.** A prévia mostra o cenário sem um veículo substituto. O carregador GLB já existe, com preservação de materiais, normalização de escala e suporte explícito a rodas independentes. Consulte `public/models/README.md`. Ajustes de eixos, pintura, vidros, lanternas, rodas, qualidade visual e otimização final dependem do arquivo original.

## Organização

- `src/scenes/HighwayScene.jsx`: Canvas, iluminação e câmera.
- `src/components/environment/`: geometria da estrada e atmosfera.
- `src/components/roadside/`: cenografia original de guitarras, amplificadores e palcos.
- `src/components/car/`: carregador do modelo original.
- `src/components/book/`: capa, páginas e sumário responsivos.
- `src/data/book.js`: cada objeto adiciona uma página ao livro.
- `src/data/assets.js`: configuração de modelo e áudio autorizado.
- `src/data/journey.js`: percurso e marcos provisórios.
- `docs/briefing-original.md`: pedido integral recebido.

## Escolhas e limites

A tipografia Metal Mania é hospedada localmente via @fontsource, sob SIL Open Font License. É uma alternativa inspirada no rock, não o logotipo nem a fonte oficial. A cenografia é original; não contém fotografias nem modelos de integrantes. A referência Prometheus não foi inspecionada, pois o domínio não está na lista liberada da rede. O scroll usa interpolação no ciclo de renderização R3F; GSAP não é necessário nesta fase. A animação do livro usa CSS, com duas páginas em desktop e uma em celular.

O controle de áudio permanece indisponível até configurar um arquivo autorizado. Depois disso, o hook só toca após interação explícita e trata falhas de reprodução. Não há autoplay.

O build e os testes de lógica não substituem avaliação visual. Conferir em navegador real: enquadramento do carro após integração, retorno de scroll, troca de abas, páginas pares/ímpares do livro, movimento reduzido, WebGL indisponível, touch e FPS. Não há sincronização musical nem biografia nesta fase.

## Validação desta versão

Resultados reais e limitações estão em `docs/validation.md`. Capturas desktop e mobile estão em `artifacts/`. Sem publicação remota nesta entrega.
