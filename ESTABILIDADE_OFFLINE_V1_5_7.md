# Estabilidade e uso real — v1.5.7

## O que foi reforçado
- Service worker mais robusto para abrir o app offline.
- Badge Online/Offline no topo.
- Alterações offline seguem salvas localmente.
- Falhas de Firebase/rede não devem travar o app.
- Bandeiras agora têm fallback visual para a sigla/código se a imagem falhar.
- Compartilhamento usa fallback de cópia manual.
- Listas de faltantes também podem sair agrupadas por seleção.

## Regra de segurança
Mesmo offline, o app deve continuar utilizável. Quando voltar a conexão, a sincronização pode ser acionada pelo botão ou automaticamente ao evento online.

## Bandeiras
Se SVG/imagem falhar, o app exibe o código da seleção no lugar. Isso evita layout quebrado.
