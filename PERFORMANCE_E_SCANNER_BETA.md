# Notas de performance — v1.5.0

Para manter o app leve mesmo com mais dados:

1. O scanner OCR só carrega a biblioteca Tesseract.js quando o usuário usa o scanner.
2. O álbum deve seguir com carregamento leve: seleções fechadas não devem renderizar todas as figurinhas.
3. Evitar salvar imagens/base64 no Firestore; manter apenas números, status e metadados curtos.
4. Exportações e comparações devem ser calculadas sob demanda, não salvas como listas duplicadas.
5. Em futuras expansões, dividir dados pesados em arquivos separados e carregar apenas quando necessário.
6. Para imagens/bandeiras, usar assets otimizados e cacheados pelo service worker.

Scanner Beta:
- é experimental;
- exige boa luz;
- pode errar códigos pequenos;
- sempre pede confirmação antes de lançar.
