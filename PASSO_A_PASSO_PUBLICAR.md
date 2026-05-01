# Passo a passo — Vercel + Firebase

## 1) Subir o app na Vercel

### Opção A: pelo GitHub

1. Crie um repositório no GitHub.
2. Envie os arquivos desta pasta para o repositório.
3. Abra: https://vercel.com/new
4. Clique em **Import** no repositório.
5. Em configurações:
   - Framework Preset: **Other**
   - Build Command: vazio
   - Output Directory: vazio ou `.`
6. Clique em **Deploy**.
7. Copie a URL gerada pela Vercel.

### Opção B: pelo terminal

Na pasta do projeto:

```bash
npm install
npx vercel login
npx vercel --prod
```

No fim, a Vercel mostra a URL pública.

---

## 2) Criar Firebase

1. Abra: https://console.firebase.google.com/
2. Clique em **Add project** / **Adicionar projeto**.
3. Crie um projeto.
4. No projeto, vá em **Authentication**.
5. Clique em **Get started**.
6. Em **Sign-in method**, ative **Google**.
7. Em **Settings > Authorized domains**, adicione:
   - o domínio da Vercel, ex.: `seu-projeto.vercel.app`
   - seu domínio próprio, se tiver

---

## 3) Criar Firestore

1. No Firebase, vá em **Firestore Database**.
2. Clique em **Create database**.
3. Comece em modo produção.
4. Escolha uma região.
5. Depois vá em **Rules** e cole as regras abaixo:

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

6. Clique em **Publish**.

---

## 4) Colar a config do Firebase no app

1. No Firebase, vá em **Project settings**.
2. Em **Your apps**, crie um app Web.
3. Copie o bloco `firebaseConfig`.
4. Abra `firebase-config.js`.
5. Substitua os campos vazios.

Exemplo:

```js
window.FIREBASE_CONFIG = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. Publique novamente na Vercel.

---

## 5) Como cada pessoa usa

1. A pessoa entra no link da Vercel.
2. Clica em **Backup & Nuvem**.
3. Clica em **Entrar com Google**.
4. Marca as figurinhas.
5. Os dados ficam salvos no documento dela, separado pelo UID da conta Google.

---

## 6) Manutenção

Mesmo com nuvem, mantenha o botão de backup JSON. Ele serve como cópia de segurança manual.
