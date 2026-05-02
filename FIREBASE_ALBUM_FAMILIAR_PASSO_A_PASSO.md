# Atualização Firebase — Álbum Familiar v1.2.0

1. Abra o Firebase Console.
2. Vá em Firestore Database > Rules.
3. Substitua as regras atuais pelo conteúdo do arquivo:
   FIREBASE_RULES_ALBUM_FAMILIAR.txt
4. Clique em Publish/Publicar.

Coleções usadas:
- meu_album_copa_v1_users
- meu_album_copa_v1_family_albums

Fluxo:
- usuário logado cria um álbum familiar;
- o ID do documento é o próprio código de convite, exemplo FAM-8K2P;
- membros logados entram com código;
- todos os membros podem editar o mesmo álbum em tempo real.
