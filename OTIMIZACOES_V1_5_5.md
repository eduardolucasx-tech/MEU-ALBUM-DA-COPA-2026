# Otimizações revisadas — v1.5.5

Revisão feita após remoção do scanner.

## Ajustes aplicados
- Remoção/limpeza de possíveis resíduos do scanner.
- Botão/label de Importar JSON alinhado visualmente com os demais botões.
- Texto de apoio no Perfil explicando Exportar/Importar JSON.
- Limite de caracteres no campo de entrada em lote para evitar colagens acidentais gigantes.
- Campos de busca configurados para evitar autocorreção e comportamento estranho no mobile.
- Pequena proteção para evitar renderização desnecessária ao tocar na aba já aberta.

## O que manter para o app continuar leve
- Não reintroduzir OCR local pesado no carregamento inicial.
- Manter listas/exportações calculadas sob demanda.
- Não salvar imagens/base64 no Firebase.
- Continuar com carregamento leve nas gavetas do Álbum.
- Usar JSON apenas para backup/restauração, não como fluxo principal de uso familiar.
