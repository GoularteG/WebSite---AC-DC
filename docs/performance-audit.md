# Auditoria de desempenho — 29/10/2026

## Medição inicial

Ambiente: build de produção Vite, Chromium headless 1280×720 com SwiftShader, cache vazio, preview local. O processo não disponibilizou WebGL funcional; por isso as métricas de carregamento e heap abaixo descrevem a página, não FPS nem draw calls da cena. Resultados de uma execução, sujeitos a variação.

| Métrica | Antes | Depois |
| --- | ---: | ---: |
| Chunk principal JS (bruto / gzip) | 103,62 / 31,32 KB | 41,53 / 14,39 KB |
| Recursos transferidos 3,5 s após DOM pronto | 1,67 MB | 0,51 MB |
| Heap JS nesse instante | 30,37 MB | 28,15 MB |
| Recursos após iniciar a estrada | 12,94 MB | 12,92 MB |
| Heap JS após iniciar a estrada | 58,55 MB | 52,68 MB |
| Tempo até `.opening` nesta execução | 3,03 s | 0,90 s |
| FPS / draw calls | indisponível | indisponível |

O tempo de abertura é um único ensaio e não demonstra sozinho ganho estável. O total após iniciar a estrada continua dominado pelo GLB original do Dodge (11,27 MB) e pelo GLB de guitarra (1,14 MB). Os arquivos dos modelos foram preservados. O chunk de Three/R3F continua com 1,26 MB bruto (356 KB gzip), pois a estrada precisa do renderizador desde a abertura.

## Inventário dos modelos

Os valores de triângulos abaixo vêm dos acessores indexados do GLB; draw calls reais dependem de materiais, frustum e estado do renderer.

| Modelo | Tamanho | Malhas | Materiais | Texturas | Triângulos aproximados |
| --- | ---: | ---: | ---: | ---: | ---: |
| Dodge Charger R/T 1970 | 11,27 MB | 73 | 70 | 5 | 372.985 |
| Guitarra elétrica | 1,14 MB | 77 | 7 | 15 | 14.142 |
| Livro | 2,03 MB | 1 | 1 | 3 | 96 |
| Bola fantasma | 0,99 MB | 2 | 2 | 1 | 4.416 |

## Alterações

- A experiência do porta-malas e a cena do inferno foram separadas em chunks carregados quando necessários. O inferno é preparado antes de entrar no trecho final e permanece montado para evitar recarga em scroll reverso.
- Os marcos laterais e outdoors são montados em uma janela ao redor do carro, com margem à frente. A foto de um outdoor só começa a carregar depois de se aproximar. Texturas de outdoors e materiais clonados dos modelos são descartados ao sair da janela.
- A guitarra deixa de ser carregada pela tela de abertura. O carro continua prioritário.
- O cálculo das três luminárias ativas deixou de ordenar e copiar a lista de postes em cada frame.
- Atualizações React do progresso são limitadas a mudanças visíveis, mantendo o progresso exato em uma referência mutável para a animação 3D.
- Há opções Automático, Alto, Equilibrado e Desempenho. O modo Automático usa amostras de frames e exige leituras consecutivas antes de mudar a resolução; sombras adicionais e partículas variam por nível. A geometria do carro não é reduzida.
- O estado de carregamento indica o preparo real do modelo principal, sem porcentagem estimada.

## Limites e próximos passos de medição

Não há números confiáveis de FPS, draw calls, GPU ou vazamento de VRAM neste executor, porque WebGL falhou no Chromium de teste. O teste visual em hardware real ainda deve percorrer os oito capítulos, o porta-malas, o modo fantasma e o inferno, observando FPS e memória no painel Performance/Memory do navegador. Compressão de geometria do Dodge exigiria uma conversão de GLB separada, comparação visual e suporte de decoder; não foi aplicada sem essa validação.
