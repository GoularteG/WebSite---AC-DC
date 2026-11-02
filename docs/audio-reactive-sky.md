# Céu reativo ao áudio

O player envia o arquivo configurado em `src/data/assets.js` ao Web Audio `AnalyserNode`. A análise roda a 30 Hz, com FFT 2048 e bandas definidas em Hertz (40–200, 200–2400 e 2400–10000), calculadas a partir da taxa real do AudioContext. Não existem marcações de tempo ou BPM associados à faixa atual. Para outra faixa, altere `audioAsset.url`, `title` e `artist`; o detector é reutilizado. Arquivos locais ou fontes externas com CORS compatível são necessários ao Web Audio.

`audioAnalysis.js` combina energia, RMS e aumentos de energia em relação ao histórico recente. Graves geram pulsos; ataques de outras frequências também contribuem. O envelope tem ataque rápido e decaimento gradual. Uma nota sustentada não gera repetidamente eventos de batida. Silêncio não dispara batidas.

O céu da estrada recebe pulsos e relâmpagos nos ataques. Durante a reprodução, as trovoadas aleatórias ficam suspensas para não competir com o ritmo; quando pausado, a ambientação original retorna. O céu do hub tem a mesma resposta musical. Relâmpagos têm intervalo mínimo de 1,4 s e intensidade limitada; movimento reduzido suprime a reação.

Pausa, falha e buffering zeram o alvo visual; retomar o áudio restabelece a análise. Silenciar mantém o céu sem reação musical. Buscar outra posição reinicia o histórico. A renderização sob demanda acorda pelos sinais de áudio e apenas enquanto os efeitos estão decaindo.

Testes cobrem taxas 44,1/48/96 kHz, ataques de graves/médios, notas sustentadas e silêncio. O teste de navegador usa o áudio real do player para verificar pulsos, pausa, retomada e mute, independentemente da disponibilidade de WebGL.
