# Notas de performance — v1.5.4

Scanner removido nesta versão para manter o app leve e estável.

Estratégia atual:
1. Priorizar busca manual por código, entrada em lote e modo pacotinho.
2. Manter o álbum com carregamento leve, sem renderizar tudo de uma vez.
3. Não salvar imagens ou arquivos pesados no Firebase.
4. Calcular listas/exportações somente quando o usuário pedir.
5. Evitar bibliotecas grandes no carregamento inicial.
6. Usar assets otimizados e cacheados.

Possível scanner futuro:
- Para leitura rápida de códigos pequenos, o ideal pode ser OCR/IA em nuvem ou modelo treinado.
- O app pode enviar apenas um recorte do verso para uma função externa, retornar o código provável e exigir confirmação.
- Essa abordagem tende a ser mais rápida e precisa que OCR local em PWA no iPhone.
