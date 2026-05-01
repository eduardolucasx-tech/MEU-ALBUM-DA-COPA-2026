# Checklist Mundial — publicar online e ativar nuvem

## Fase 1 — colocar online

### Opção rápida: Netlify
1. Entre no Netlify.
2. Vá em **Add new site > Deploy manually**.
3. Arraste a pasta `checklist_mundial_app_online_cloud`.
4. Abra o link gerado no celular e toque em **Instalar app**.

### Opção com GitHub + Vercel
1. Crie um repositório no GitHub.
2. Envie todos os arquivos da pasta.
3. No Vercel, importe o repositório.
4. Framework: **Other** / saída estática.
5. Deploy.

## Fase 2 — backup no Google Drive

Dentro do app:
1. Abra **Backup & Nuvem**.
2. Clique em **Baixar backup JSON**.
3. Salve esse arquivo no Google Drive.
4. Em outro aparelho, abra o app e importe o JSON.

Também há exportação de CSV, faltantes TXT e repetidas TXT.

## Fase 3 — login Google e sincronização automática

### 1. Criar projeto Firebase
1. Acesse o Firebase Console.
2. Crie um projeto.
3. Adicione um app Web.
4. Copie as chaves de configuração.

### 2. Ativar Authentication
1. Vá em **Authentication > Sign-in method**.
2. Ative **Google**.
3. Adicione o domínio onde o app está hospedado nos domínios autorizados.

### 3. Ativar Firestore
1. Vá em **Firestore Database**.
2. Crie o banco em modo produção.
3. Use estas regras iniciais:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /checklist_mundial_users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Preencher firebase-config.js
Substitua o conteúdo do arquivo `firebase-config.js` por algo assim:

```js
window.FIREBASE_CONFIG = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

Depois publique novamente.

## Observação de segurança
O app não usa marcas registradas, não usa logos oficiais e não envia dados para terceiros por conta própria. Com Firebase ativado, seus dados de checklist ficam no projeto Firebase configurado por você.
