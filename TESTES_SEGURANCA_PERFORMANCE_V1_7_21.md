# Testes de segurança e performance — v1.7.21

## O que foi verificado

- Home preservada a partir da v1.7.20.
- Filtros de status no Álbum e no Rápido mantidos.
- Regras do Firebase alinhadas às coleções reais usadas no app:
  - `meu_album_copa_v1_users`
  - `meu_album_copa_v1_family_albums`
- Remoção, nas regras principais, dos nomes antigos `checklist_mundial_*`, que não protegiam as coleções atuais.
- Vercel com headers mínimos de segurança.
- Service Worker com novo nome de cache para forçar atualização.
- Busca do Álbum e do Rápido com debounce de 120 ms.

## Comandos locais

```bash
node --check app.js
npm run security:audit
npm run build
```

## Pontos de segurança cobertos

### Login

O login continua via Google/Firebase Auth. A chave pública do Firebase no frontend não é segredo; a proteção real fica nas regras do Firestore.

### Dados de outros usuários

O álbum pessoal agora tem regra explícita para permitir leitura/escrita somente quando o `uid` logado for igual ao ID do documento.

### Álbum familiar

A listagem de álbuns familiares fica bloqueada com `allow list: if false`. Membros conseguem ler/editar apenas o documento familiar do qual já fazem parte.

## Limite do teste

Este pacote faz auditoria estática local. O teste real de carga simultânea precisa ser feito no ambiente publicado, com usuários/logins reais ou emulador Firebase.
