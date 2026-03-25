# 💧 Hidrate.se — Sua Garrafa de Água Digital

Acompanhe sua meta de hidratação diária com uma **garrafa de água interativa e pixel art**, direto no navegador. Sem instalação, sem complicação.

🔗 **[hidrate.se](https://hidrate.se)**

---

## ✨ Funcionalidades

- **Garrafa visual em SVG** — o nível da água desce conforme você registra o consumo e sobe ao encher a garrafa
- **Meta diária personalizável** — defina quantos ml quer beber por dia (padrão: 2000ml)
- **Login com Google** — salva e sincroniza seus dados em tempo real via Firebase
- **Modo offline** — funciona sem login, usando estado local na memória
- **Tema claro/escuro** — inversão de cores com `filter: invert` + `hue-rotate`, preferência salva no `localStorage`
- **Responsivo** — se adapta ao modo retrato e paisagem; no landscape, a garrafa rotaciona automaticamente
- **Menu hambúrguer** — todos os controles ficam em um dropdown no canto superior direito, com scroll se necessário

---

## 🗂️ Estrutura do Projeto

```
hidrate.se/
├── index.html        # App principal: estrutura HTML, SVG da garrafa e Firebase
├── script.js         # Lógica do app: eventos, visual, menu e tema
├── style.css         # Estilos: layout, temas, responsividade
├── config.js         # Configurações do Firebase (não versionado)
├── privacidade.html  # Política de Privacidade
├── termos.html       # Termos de Serviço
└── images/
    ├── favicon_32.png
    ├── favicon_64.png
    ├── favicon_180.png
    ├── favicon_192.png
    └── og_1200x630.png
```

---

## ⚙️ Como Funciona

### Garrafa SVG

O SVG da garrafa usa um sistema de **3 camadas** dentro de um `viewBox` de 16×32 unidades:

| Camada | Elemento | Função |
|--------|----------|--------|
| 1 | `<rect id="agua-nivel">` | Nível da água — `height` e `y` controlados pelo JS |
| 2 | `<g id="pixels-garrafa">` | Arte pixel a pixel: contorno e brilho da garrafa |
| 3 | `<text>` / `<line>` | Rótulo interno: fração `restante / meta` |

O `clipPath` garante que a água nunca ultrapasse o interior da garrafa, independente do valor calculado.

**Constantes usadas no `script.js`:**
```js
const ALTURA_MAX_SVG = 24; // Altura interna da garrafa (y=7 até y=31)
const POSICAO_BASE_Y = 31; // Base interna da garrafa
```

### Lógica de Hidratação

A garrafa começa **cheia** e **esvazia** conforme o consumo é registrado. "Encher Garrafa" reseta o total bebido para zero.

```
porcentagem = (metaDiaria - totalBebido) / metaDiaria
novaAltura  = porcentagem × ALTURA_MAX_SVG
novoY       = POSICAO_BASE_Y - novaAltura
```

Quando `totalBebido >= metaDiaria`, o rótulo exibe **"Meta / Batida! 🎉"** e a linha da fração é ocultada.

### Firebase (Modo Online)

O app usa **Firebase Authentication** (Google) e **Firestore** para persistência.

- Cada usuário tem um documento em `usuarios/{uid}` com os campos `totalBebido` e `metaDiaria`
- O `onSnapshot` mantém a interface sincronizada em tempo real com qualquer mudança no Firestore
- O incremento de consumo usa `increment(valor)` — operação atômica que evita conflitos em atualizações simultâneas
- No primeiro acesso, o documento é criado automaticamente via `setDoc` com os valores padrão

```js
// Estrutura do documento no Firestore
{
  totalBebido: 0,    // ml consumidos no dia atual
  metaDiaria: 2000   // meta diária em ml
}
```

### Modo Offline

Sem login, o app funciona normalmente usando as variáveis globais `window.totalBebido` e `window.metaDiaria`. Os dados **não persistem** ao fechar o navegador.

---

## 🎨 Tema Claro / Escuro

O tema escuro é aplicado via `filter: invert(100%) hue-rotate(180deg)` no `body`. O `hue-rotate(180deg)` garante que o azul da água não vire laranja após a inversão.

O menu dropdown recebe uma **inversão dupla** para cancelar a herança e manter suas cores originais:

```css
body.alt-theme .dropdown-content {
    filter: invert(100%) hue-rotate(180deg);
}
```

A preferência é salva no `localStorage` e restaurada automaticamente no próximo acesso.

---

## 📱 Responsividade

No modo **landscape**, o SVG da garrafa é rotacionado `-90deg` para aproveitar melhor a tela horizontal. `height` e `width` são trocados para manter as proporções:

```css
@media (orientation: landscape) {
    .garrafa svg {
        transform: rotate(-90deg);
        height: 90vw;
        width: 80vh;
    }
}
```

O menu tem `max-height: 60vh` com `overflow-y: auto` para funcionar corretamente em telas pequenas.

---

## 🔧 Configuração e Deploy

### 1. Clone o repositório

```bash
git clone https://github.com/l4ss4r0t3/Hidrate.se.git
cd Hidrate.se
```

### 2. Configure o Firebase

Crie um arquivo `config.js` na raiz do projeto com as suas credenciais do Firebase:

```js
// config.js
export const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

> ⚠️ **Nunca versione o `config.js`** — adicione-o ao `.gitignore`.

### 3. Configure o Firestore

No console do Firebase, crie o banco de dados Firestore e defina as regras de segurança:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Ative a autenticação Google

No console do Firebase, vá em **Authentication → Sign-in method** e ative o provedor **Google**.

### 5. Deploy

O projeto é estático — basta hospedar os arquivos em qualquer servidor. Opções recomendadas: **Firebase Hosting**, **Vercel** ou **Netlify**.

---

## 🛡️ Privacidade e Termos

- Os dados coletados se limitam a nome, e-mail e foto de perfil (via Google Auth), além do consumo de água registrado pelo próprio usuário.
- Nenhum dado é compartilhado ou vendido a terceiros.
- O usuário pode solicitar a exclusão completa dos seus dados a qualquer momento.

Leia a [Política de Privacidade](privacidade.html) e os [Termos de Serviço](termos.html) completos.

---

## 🤝 Contribuindo

Sugestões, bugs e PRs são bem-vindos! Abra uma [issue](https://github.com/l4ss4r0t3/Hidrate.se/issues) ou envie um pull request.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.