# Modelo original pendente
O briefing foi o único arquivo recebido. Não há veículo substituto.

Após receber o modelo:
1. Preservar o original; conferir licença, formato, meshes e texturas.
2. Se necessário, converter uma cópia para GLB com texturas incorporadas.
3. Salvar a cópia web aqui e definir `carAsset.url` em `src/data/assets.js`.
4. Validar `rotationY`, escala (comprimento 4,86 m), contato com asfalto e materiais.
5. Identificar rodas independentes e preencher `wheelNames` e `wheelAxis`.
6. Verificar lanternas emissivas, transparência dos vidros, reflexos e sombras.
7. Só então avaliar compressão/LOD; não alterar o arquivo original.

O carregador não sobrescreve materiais, não inventa meshes de rodas e não altera o arquivo-fonte. Escala/orientação ocorrem em uma cópia da cena. GLTF externo exige preservar a estrutura de recursos; GLB é preferido. FBX/OBJ exigem conversão ou um carregador específico.
