# AC/DC — Highway to Hell

Experiência interativa de estudo, criada por **Erik Carvalho, Gustavo Goularte e Gustavo Justo**. Uma estrada 3D conduz um Dodge Charger R/T 1970 por oito capítulos da história do AC/DC até um nono destino inspirado em *Highway to Hell*.

**[Abrir o site](https://acdc-highway-goularte.purpleowlet34.chatgpt.site/)**

Este é um projeto de fãs e não é um site oficial ou afiliado ao AC/DC.

## Experiência

- **The Highway:** avance e retorne pela estrada com o scroll. O carro, os cenários e os outdoors históricos acompanham o percurso. A linha do tempo permite ir diretamente a um dos oito capítulos ou ao portal final.
- **The Making Of:** um porta-malas 3D apresenta o livro do processo criativo, a guitarra, CDs e objetos de estrada. O livro é o único objeto clicável; suas oito páginas podem ser folheadas com mouse, toque ou teclado. Ao voltar, a posição na estrada é preservada.
- **Áudio:** a gravação enviada ao projeto começa pausada e só toca após o visitante selecionar o controle.
- **Acessibilidade:** há navegação por teclado, alternativas textuais para os controles e adaptação para movimento reduzido. A experiência 3D requer WebGL.

## Rodar localmente

Requer Node.js 20.19+ ou 22.12+ e npm.

```bash
npm ci
npm run dev
```

O Vite informa o endereço local, normalmente `http://localhost:5173`. Para validar e gerar a versão estática:

```bash
npm test
npm run build
npm run preview
```

O build fica em `dist/`. O projeto é uma aplicação estática React/Vite, sem backend. Em uma hospedagem própria, encaminhe rotas desconhecidas para `index.html` caso use navegação direta por URL.

## Organização

| Caminho | Responsabilidade |
| --- | --- |
| `src/App.jsx` | Navegação entre estrada, porta-malas, capítulos e controles globais. |
| `src/scenes/HighwayScene.jsx` | Cena principal em React Three Fiber. |
| `src/components/environment/` e `src/components/roadside/` | Estrada, destino final e cenografia. |
| `src/components/trunk/` e `src/components/book/` | Porta-malas interativo e livro. |
| `src/data/history.json` | Conteúdo dos oito capítulos e referências das fotografias. |
| `src/data/book.js` | Texto do The Making Of. |
| `public/models/` | Modelos GLB carregados pela experiência. |

## Recursos e direitos

Os modelos 3D permanecem creditados aos seus autores. As licenças declaradas nos arquivos enviados são **CC BY 4.0**: [Dodge Charger R/T 1970 — Emmanual Robinson, Jr.](https://sketchfab.com/3d-models/dominic-torettos-1970-dodge-charger-rt-fast-x-0e2c80e2928d4b76b49914db5bbb47ca), [Guitarra elèctrica — Aroig](https://sketchfab.com/3d-models/guitarra-electrica-cc6bc30cdb8645fa8eba878ad854f802), [Book — Encyclopedia — Maxence Rouillet](https://sketchfab.com/3d-models/book-encyclopedia-0487cb088c244d02a736cb337e65778c) e [Ball — Rocket League — Jako](https://sketchfab.com/3d-models/ball-rocket-league-2c8911aa1dcd4c53bad842f2d354dfe2). A descrição do [modelo do carro](docs/model-inspection.md) e da [guitarra](docs/guitar-asset.md) registra as adaptações realizadas. As fontes [Metal Mania](docs/metal-mania-license.txt) e [New Rocker](public/licenses/new-rocker-OFL.txt) são distribuídas sob a SIL Open Font License 1.1. New Rocker é usada nos títulos como alternativa aberta inspirada na referência visual enviada; não é uma fonte oficial do AC/DC.

As fotografias históricas são carregadas de fontes externas, com autoria e licença indicadas nos capítulos e na seção **Créditos** do site. As artes dos estojos de CD são interpretações gráficas do projeto, não capas oficiais.

`public/audio/highway-to-hell-user.mp3` é a gravação fornecida para este projeto. O arquivo está acessível publicamente no repositório e no site. A origem de uma gravação ao vivo, por si só, não comprova autorização para distribuir a composição, a apresentação ou o fonograma; confirme esses direitos antes de reutilizar ou republicar o áudio.

O [briefing original](docs/briefing-original.md), que documenta o início do processo criativo, também está público no repositório.

O nome AC/DC, os títulos, os personagens e demais marcas pertencem a seus respectivos titulares. Este repositório **não possui uma licença geral** que autorize reutilizar todo o código, mídia e recursos em conjunto. Não inclua segredos ou dados pessoais nos arquivos versionados: o repositório e seus históricos de commits são públicos.
