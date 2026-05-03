# v1.7.3 — Correção navegação + Colinha

## Corrigido
- Logo/nome agora usam navegação segura para Início.
- Foto do Google usa navegação segura para Perfil.
- Colinha Escolar cria o modal automaticamente se ele não existir na página.
- Corrigido erro de null/classList ao abrir a Colinha.

## Motivo
A v1.7.2 chamava `switchView` diretamente, mas nessa base a navegação poderia estar fora do escopo global.
