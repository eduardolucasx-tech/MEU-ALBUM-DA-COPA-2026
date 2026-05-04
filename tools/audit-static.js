const fs = require('fs');
const path = require('path');

function read(file){ return fs.readFileSync(path.join(__dirname, '..', file), 'utf8'); }
const app = read('app.js');
const rules = read('FIREBASE_RULES.txt');
const vercel = read('vercel.json');
const sw = read('service-worker.js');

const checks = [
  ['JS principal tem versão 1.7.21', /VERSION_LABEL\s*=\s*'v1\.7\.21'/.test(app)],
  ['Regras protegem coleção pessoal real', /meu_album_copa_v1_users/.test(rules) && /request\.auth\.uid\s*==\s*userId/.test(rules)],
  ['Regras protegem coleção familiar real', /meu_album_copa_v1_family_albums/.test(rules) && /allow list:\s*if false/.test(rules)],
  ['Código antigo checklist_mundial não ficou nas regras principais', !/checklist_mundial/.test(rules)],
  ['Vercel tem headers mínimos de segurança', /X-Content-Type-Options/.test(vercel) && /X-Frame-Options/.test(vercel) && /Permissions-Policy/.test(vercel)],
  ['Service worker recebeu novo cache', /v1-7-21-seguranca-cache-performance/.test(sw)],
  ['Busca do Álbum usa debounce', /albumSearch'\)\.addEventListener\('input', syncSearch\)/.test(app)],
  ['Busca do Rápido usa debounce', /quickSearch'\)\?\.addEventListener\('input', syncSearch\)/.test(app)],
  ['Entrada no familiar não faz leitura aberta antes de virar membro', /await doc\.update\(payload\)/.test(app) && !/const snap = await doc\.get\(\);\n\s*if\(!snap\.exists\) return toast\('Código não encontrado\.'\);\n\s*await doc\.set/.test(app)]
];

let fail = 0;
for(const [name, ok] of checks){
  console.log(`${ok ? '✅' : '❌'} ${name}`);
  if(!ok) fail++;
}
if(fail){
  console.error(`\n${fail} verificação(ões) falharam.`);
  process.exit(1);
}
console.log('\nAuditoria estática OK.');
