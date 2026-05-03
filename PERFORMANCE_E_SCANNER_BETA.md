# Notas de performance — v1.5.2

Scanner:
- A câmera abre automaticamente ao entrar em Adicionar.
- A leitura automática começa assim que a permissão da câmera é liberada.
- O OCR continua sob demanda: a biblioteca Tesseract.js só é carregada quando o scanner é usado.
- Cada leitura usa recorte central, ampliação e múltiplos tratamentos de imagem para aumentar a chance de acerto.
- A confirmação manual continua obrigatória para evitar marcações erradas.

Como ler melhor:
1. Use a câmera traseira.
2. Coloque o código dentro da moldura.
3. Mantenha o celular firme por 1 a 2 segundos.
4. Use boa luz, sem reflexo forte.
5. Evite aproximar demais a ponto de desfocar.
6. Se a leitura falhar, toque em Ler agora ou limpe a leitura e tente novamente.

Estratégia de leveza:
1. Não salvar imagens no Firebase.
2. Não carregar OCR na abertura do app.
3. Renderizar telas pesadas sob demanda.
4. Gerar exportações/listas apenas quando o usuário pedir.
5. Manter assets otimizados e cacheados.
