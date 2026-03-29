# 💧 Hidrate.se — Sua Garrafa de Água Digital

> Controle sua hidratação de forma simples, visual e inteligente — direto no navegador.

🔗 **Acesse:** https://hidrate.se

---

## 🚀 Sobre o Projeto# 🌊 Hidrate.se - Sua Garrafa de Água Digital

![Hidrate.se](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-11.1.0-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Hidrate.se** é uma aplicação web interativa que ajuda você a acompanhar seu consumo diário de água de forma visual e gamificada. Transforme sua hidratação em uma experiência divertida com uma garrafa digital que esvazia conforme você atinge sua meta!

## ✨ Funcionalidades

- 🎯 **Meta Personalizável**: Defina sua meta diária de consumo de água (padrão: 2000ml)
- 💧 **Registro Visual**: Acompanhe seu progresso em tempo real com uma garrafa animada
- 🎉 **Feedback Positivo**: Celebração ao atingir sua meta diária
- 🔐 **Sincronização na Nuvem**: Faça login com Google para salvar seus dados
- 📱 **Modo Offline**: Funciona sem internet usando localStorage
- 🌓 **Tema Escuro**: Alterne entre tema claro e escuro
- 🖼️ **Plano de Fundo Customizável**: Personalize com sua imagem favorita
- 📊 **Migração Automática**: Dados offline são transferidos ao fazer login

## 🚀 Começando

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (opcional - app funciona offline)
- Conta Google (opcional - para sincronização na nuvem)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/l4ss4r0t3/Hidrate.se.git
   cd Hidrate.se
   ```

2. **Configurar Firebase** (se quiser sincronização)
   
   Edite o arquivo `index.html` e substitua as credenciais do Firebase pelas suas:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "SUA_API_KEY",
     authDomain: "SEU_AUTH_DOMAIN",
     projectId: "SEU_PROJECT_ID",
     storageBucket: "SEU_STORAGE_BUCKET",
     messagingSenderId: "SEU_MESSAGING_SENDER_ID",
     appId: "SEU_APP_ID"
   };
   ```

3. **Abrir o app**
   
   Basta abrir o arquivo `index.html` em seu navegador!
   
   Ou use um servidor local:
   ```bash
   # Com Python 3
   python -m http.server 8000
   
   # Com Node.js (npx)
   npx serve
   ```

## 📂 Estrutura do Projeto

```
hidrate.se/
│
├── index.html              # Página principal
│
├── scripts/                # JavaScript
│   ├── bottles.js         # Lógica da garrafa e persistência
│   ├── buttons.js         # Controle do menu e interações
│   ├── popups.js          # Modal de introdução
│   └── themes.js          # Temas e personalização
│
├── styles/                 # CSS
│   ├── body.css           # Estilos globais e tema
│   ├── bottles.css        # Estilos da garrafa SVG
│   ├── fonts.css          # Tipografia (Google Sans)
│   ├── menus.css          # Menu dropdown e submenus
│   └── popups.css         # Modal de introdução
│
├── images/                 # Recursos visuais
│   ├── svgs/
│   │   ├── bottles/       # SVG da garrafa
│   │   └── buttons/       # Ícones de botões
│   └── pngs/
│       ├── favicons/      # Ícones do app
│       └── ogs/           # Imagens Open Graph
│
├── policies/               # Páginas legais
│   ├── privacy.html       # Política de Privacidade
│   ├── service.html       # Termos de Serviço
│   └── deletion.html      # Exclusão de conta
│
└── README.md              # Este arquivo
```

## 🎮 Como Usar

### Primeira Vez

1. **Abra o app** - Um popup de introdução explicará o funcionamento
2. **Defina sua meta** - Clique no menu (☰) e ajuste "Sua Meta Diária"
3. **Registre consumo** - Digite a quantidade e clique em "Beber Água"
4. **Acompanhe visualmente** - A garrafa esvazia conforme você progride!

### Menu Principal (☰)

- **Sua Meta Diária**: Quantidade de água que você quer beber (ex: 2000ml)
- **Água a Beber**: Quantidade a registrar (ex: 250ml, 500ml)
- **Beber Água**: Adiciona o valor ao total do dia
- **Encher Garrafa**: Reseta o progresso (use no dia seguinte)
- **Login com Google**: Salva seus dados na nuvem
- **Introdução**: Reabre o tutorial
- **Temas**: Personalização visual
  - **Inverter Cores**: Modo claro ↔ escuro
  - **Plano de Fundo**: URL de imagem personalizada
- **Políticas**: Links legais e documentação

### Com Login (Recomendado)

1. Clique em **"Login com Google"**
2. Seus dados serão sincronizados automaticamente
3. Acesse de qualquer dispositivo!

### Sem Login (Modo Offline)

- Dados são salvos no **localStorage** do navegador
- Funcionam mesmo sem internet
- ⚠️ **Atenção**: Dados podem ser perdidos se limpar cache do navegador

## 🔥 Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização modular e responsiva
- **JavaScript (ES6+)**: Lógica da aplicação

### Backend (Opcional)
- **Firebase Authentication**: Login com Google
- **Cloud Firestore**: Banco de dados NoSQL em tempo real
- **Firebase Hosting**: Deploy do app

### Bibliotecas
- **Google Fonts**: Tipografia (Google Sans)
- **Firebase SDK 11.1.0**: Autenticação e banco de dados

## 📊 Fluxo de Dados

### Modo Online (com login)

```
Usuário → Ação (Beber/Encher) → Firebase Firestore
                                      ↓
                                onSnapshot()
                                      ↓
                         Atualização em Tempo Real
                                      ↓
                              Atualiza Interface
```

### Modo Offline (sem login)

```
Usuário → Ação (Beber/Encher) → localStorage
                                      ↓
                         Atualização Imediata
                                      ↓
                              Atualiza Interface
```

### Migração (offline → online)

```
Fazer Login → Verifica localStorage → Migra Dados → Firebase
                                                         ↓
                                                  Limpa localStorage
```

## 🛠️ Personalização

### Alterar Cores do Tema

Edite `styles/body.css`:

```css
body {
    background-color: white; /* Cor de fundo */
}

body.alt-theme {
    filter: invert(100%) hue-rotate(180deg); /* Tema escuro */
}
```

### Alterar Meta Padrão

Edite `scripts/bottles.js`:

```javascript
window.metaDiaria = 3000; // Altere de 2000 para o valor desejado
```

### Personalizar Popup de Introdução

Edite o conteúdo HTML do popup em `index.html`:

```html
<div id="meu-popup">
    <div class="conteudo">
        <h2>Seu Título</h2>
        <p>Seu conteúdo personalizado...</p>
    </div>
</div>
```

## 🐛 Troubleshooting

### Dados não estão sendo salvos

- **Com login**: Verifique sua conexão com internet e configuração do Firebase
- **Sem login**: Certifique-se de que seu navegador permite localStorage

### Menu não abre/fecha

- Verifique o console do navegador (F12) para erros JavaScript
- Tente limpar o cache do navegador (Ctrl+Shift+Delete)

### Garrafa não atualiza visualmente

- Certifique-se de que o arquivo `images/svgs/bottles/garrafa.svg` existe
- Verifique se os IDs dos elementos SVG estão corretos:
  - `agua-nivel` (retângulo da água)
  - `texto-ingerido` (texto superior)
  - `texto-meta` (texto inferior)
  - `linha-fracao` (linha divisória)

### Tema escuro não funciona

- Verifique se a classe `alt-theme` está sendo adicionada ao body
- Certifique-se de que `themes.js` está sendo carregado

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Ideias de Melhorias

- [ ] Histórico de consumo por dia/semana/mês
- [ ] Gráficos de progresso
- [ ] Notificações push para lembrar de beber água
- [ ] Integração com Apple Health / Google Fit
- [ ] Modo PWA (Progressive Web App)
- [ ] Suporte a múltiplos idiomas
- [ ] Compartilhamento de metas nas redes sociais
- [ ] Sistema de conquistas/badges

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**L4ss4r0t3**
- GitHub: [@l4ss4r0t3](https://github.com/l4ss4r0t3)
- Email: [seu-email@exemplo.com]

## 🙏 Agradecimentos

- Google Fonts pela tipografia Google Sans
- Firebase pela infraestrutura de backend
- Comunidade open-source pelas inspirações

## 📞 Suporte

- 📧 Email: [seu-email@exemplo.com]
- 🐛 Issues: [GitHub Issues](https://github.com/l4ss4r0t3/Hidrate.se/issues)
- 📖 Documentação: [GitHub Wiki](https://github.com/l4ss4r0t3/Hidrate.se/wiki)

---

**Feito com 💙 e muita água! 🌊**

*Mantenha-se hidratado! 💧*

O **Hidrate.se** é uma aplicação web que transforma o acompanhamento de água em uma experiência visual interativa.

Em vez de números frios, você vê uma **garrafa digital que esvazia conforme você bebe água** — simples, intuitivo e motivador.

---

## ✨ Funcionalidades

* 🍼 **Garrafa interativa (SVG)**
  Representação visual em tempo real do consumo

* 🎯 **Meta diária personalizável**
  Defina quantos ml deseja beber por dia

* 🔐 **Login com Google (Firebase)**
  Sincronização em tempo real dos dados

* 🌐 **Modo offline**
  Funciona sem login usando `localStorage`

* 🔄 **Sincronização inteligente**
  Migração automática entre offline ↔ online

* 🎨 **Tema claro/escuro**
  Alternância com persistência local

* 📱 **Responsivo**
  Compatível com mobile e desktop

---

## 🧠 Como Funciona

A lógica principal da hidratação:

```js
porcentagem = (metaDiaria - totalBebido) / metaDiaria
```

* Garrafa cheia → você ainda precisa beber água
* Garrafa vazia → 🎉 **Meta batida!**

Atualização do SVG:

```js
elementoAgua.setAttribute('height', novaAltura);
elementoAgua.setAttribute('y', novoY);
```

---

## 🔥 Tecnologias

* HTML5
* CSS3
* JavaScript (Vanilla)
* Firebase Authentication
* Firestore

---

## 📂 Estrutura do Projeto

```
hidrate.se/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── images/
│   ├── pngs/
│   │   ├── covers/
│   │   │   └── cover_1024_500.png
│   │   ├── favicons/
│   │   │   ├── favicon_32.png
│   │   │   ├── favicon_64.png
│   │   │   ├── favicon_180.png
│   │   │   └── favicon_192.png
│   │   ├── icons/
│   │   │   └── icon_512.png
│   │   └── ogs/
│   │       └── og_1200_630.png
│   └── svgs/
│       ├── bottles/
│       │   ├── one.svg
│       │   └── two.svg
│       └── buttons/
│           └── burguer.svg
├── policies/
│   ├── deletion.html
│   ├── privacy.html
│   └── service.html
├── scripts/
│   ├── bottles.js
│   ├── buttons.js
│   ├── config.js
│   └── themes.js
├── styles/
│   ├── body.css
│   ├── bottles.css
│   ├── fonts.css
│   └── menus.css
├── index.html
├── LICENSE.txt
└── README.md
```

---

## 📱 Diferenciais

* Manipulação direta de SVG
* Arquitetura offline-first
* Sincronização em tempo real
* Integração com Android (WebView + Bridge)
* Código altamente documentado

---

## 🤝 Contribuição

Pull requests são bem-vindos!
Abra uma issue ou envie melhorias.

---

## 📄 Licença

MIT

---

## 👨‍💻 Autor

**Caio Silva (l4ss4r0t3)**