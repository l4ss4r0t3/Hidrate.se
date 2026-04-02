# 💧 Hidrate.se — Sua Garrafa de Água Digital

> Controle sua hidratação de forma simples, visual e inteligente — direto no navegador.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-11.1.0-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

🔗 **Acesse agora:** [https://hidrate.se](https://hidrate.se)

---

## 🚀 Sobre o Projeto

**Hidrate.se** é uma aplicação web interativa que transforma o acompanhamento do consumo de água em uma experiência visual e gamificada. 

Em vez de números frios em uma planilha, você vê uma **garrafa digital animada que esvazia conforme você bebe água** — simples, intuitivo e motivador! 🎯

### 💡 Por que usar?

- 🎨 **Visual e Intuitivo**: Acompanhe seu progresso com uma garrafa que responde em tempo real
- 🎯 **Metas Personalizáveis**: Defina sua meta diária baseada no seu peso e rotina
- 🔐 **Sincronização em Nuvem**: Seus dados seguros e acessíveis de qualquer lugar
- 📱 **Funciona Offline**: Continue registrando mesmo sem internet (após o primeiro acesso)
- 🎉 **Celebração de Conquistas**: Feedback positivo ao atingir sua meta

---

## ✨ Funcionalidades

### 🎯 Controle Principal
- **Meta Diária Customizável**: Configure quantos ml você precisa beber (padrão: 2000ml)
- **Registro Rápido**: Digite a quantidade ingerida e clique em "Beber Água"
- **Reset Diário**: Botão "Encher Garrafa" para começar um novo dia
- **Feedback Visual**: Garrafa SVG animada que esvazia proporcionalmente

### 🔐 Autenticação e Sincronização
- **Login com Google**: Autenticação segura via Firebase
- **Sincronização em Tempo Real**: Dados atualizados instantaneamente
- **Modo Offline Inteligente**: Funciona sem login usando localStorage
- **Migração Automática**: Dados offline são transferidos ao fazer login
- **Multi-dispositivo**: Acesse de qualquer lugar com seus dados sincronizados

### 🎨 Personalização
- **Tema Claro/Escuro**: Alterne entre modos com o botão "Inverter Cores"
- **Plano de Fundo Customizável**: Adicione sua imagem favorita
- **Múltiplos Estilos de Garrafa**: Troque o design da garrafa
- **Persistência de Preferências**: Suas escolhas são salvas automaticamente

### 🛠️ Utilidades
- **Calculadora de Hidratação**: Descubra sua necessidade baseada no peso (35ml/kg)
- **Popup de Introdução**: Tutorial interativo para novos usuários
- **Avisos de Autenticação**: Lembretes para fazer login e salvar dados

---

## 🧠 Como Funciona

### Lógica da Hidratação

```javascript
// Cálculo da porcentagem consumida
porcentagem = (metaDiaria - totalBebido) / metaDiaria

// Garrafa começa cheia (100%) e esvazia conforme você bebe
// Quando totalBebido = metaDiaria → Garrafa vazia = Meta atingida! 🎉
```

### Atualização Visual (SVG)

```javascript
// A garrafa é um elemento <rect> do SVG que muda dinamicamente
elementoAgua.setAttribute('height', alturaCalculada);
elementoAgua.setAttribute('y', posicaoY);

// Gradiente aplicado para efeito de água realista
fill="url(#gradAgua)"
```

### Fluxo de Dados

#### 🌐 Modo Online (com login)
```
Usuário faz ação → Firebase Firestore (nuvem)
                          ↓
                    onSnapshot() escuta mudanças
                          ↓
              Atualização em tempo real da UI
```

#### 📱 Modo Offline (sem login)
```
Usuário faz ação → localStorage (navegador)
                          ↓
              Atualização imediata da UI
```

#### 🔄 Migração Automática
```
Usuário faz login → Detecta dados no localStorage
                          ↓
                  Migra para Firebase
                          ↓
                  Limpa localStorage
```

---

## 🔥 Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilização modular com variáveis CSS
- **JavaScript (ES6+)**: Lógica moderna e modular
- **SVG**: Gráficos vetoriais escaláveis e animados

### Backend & Cloud
- **Firebase Authentication 11.1.0**: Login seguro com Google
- **Cloud Firestore 11.1.0**: Banco NoSQL em tempo real
- **Firebase Hosting**: Hospedagem com SSL e CDN global

### Recursos Externos
- **Google Fonts**: Tipografia Google Sans
- **SVG Gradientes**: Efeitos visuais nativos

---

## 📂 Estrutura do Projeto

```
hidrate.se/
│
├── index.html                    # 🏠 Página principal (documento único)
│
├── scripts/                      # 📜 JavaScript modular
│   ├── bottles.js               # Lógica da garrafa e persistência
│   ├── buttons.js               # Controle de menu e interações
│   ├── popups.js                # Modais (introdução, calculadora)
│   └── themes.js                # Temas e personalização visual
│
├── styles/                       # 🎨 CSS modular
│   ├── body.css                 # Estilos globais e tema base
│   ├── bottles.css              # Estilos da garrafa SVG
│   ├── fonts.css                # Tipografia (Google Sans)
│   ├── menus.css                # Menu dropdown e submenus
│   └── popups.css               # Estilos dos modais
│
├── images/                       # 🖼️ Recursos visuais
│   ├── svgs/
│   │   ├── bottles/             # SVGs das garrafas (one.svg, two.svg)
│   │   └── buttons/             # Ícones de botões (burguer.svg)
│   └── pngs/
│       ├── favicons/            # Ícones do app (32, 64, 180, 192)
│       ├── ogs/                 # Open Graph (og_1200_630.png)
│       └── covers/              # Imagens de capa
│
├── policies/                     # 📄 Documentação legal
│   ├── privacy.html             # Política de Privacidade
│   ├── service.html             # Termos de Serviço
│   └── deletion.html            # Exclusão de Conta
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD automatizado
│
├── LICENSE.txt                   # Licença MIT
└── README.md                     # Este arquivo
```

---

## 🚀 Começando

### ✅ Pré-requisitos

- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Conexão com internet (opcional — app funciona offline após o primeiro acesso)
- Conta Google (opcional — para sincronização na nuvem)

### 📥 Instalação Local

1. **Clone o repositório**
   ```bash
   git clone https://github.com/l4ss4r0t3/Hidrate.se.git
   cd Hidrate.se
   ```

2. **Abra no navegador**
   
   Opção 1: Abra diretamente o `index.html`
   
   Opção 2: Use um servidor local
   ```bash
   # Com Python 3
   python -m http.server 8000
   
   # Com Node.js
   npx serve
   
   # Com PHP
   php -S localhost:8000
   ```

3. **Acesse no navegador**
   ```
   http://localhost:8000
   ```

### 🔧 Configuração do Firebase (Opcional)

Se quiser usar sua própria instância do Firebase:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)

2. Ative **Authentication** (provedor Google) e **Firestore**

3. Copie suas credenciais do projeto

4. Edite o `index.html` (linha ~318) e substitua:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

5. Configure as regras do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🎮 Como Usar

### 🌟 Primeira Vez

1. **Abra o app** → Um popup de introdução explicará o funcionamento
2. **Configure sua meta**:
   - Clique no menu (☰) no canto superior direito
   - Use a **Calculadora** para descobrir sua necessidade (peso × 35ml)
   - Ajuste o campo "Sua Meta Diária"
3. **Registre seu consumo**:
   - Digite a quantidade no campo "Água a Beber"
   - Clique em "Beber Água"
4. **Acompanhe visualmente** → A garrafa esvazia conforme você progride! 🎉

### 📱 Menu Principal (☰)

#### Controles de Hidratação
- **Sua Meta Diária**: Quantidade total do dia (ex: 2000ml, 2500ml, 3000ml)
- **Água a Beber**: Quantidade a registrar agora (ex: 250ml, 500ml)
- **Beber Água**: ➕ Adiciona o valor ao total do dia
- **Encher Garrafa**: 🔄 Reseta para começar um novo dia

#### Autenticação
- **Login com Google**: 🔐 Salva seus dados na nuvem
- **Sair (Google)**: 🚪 Faz logout (dados são salvos no localStorage)

#### Utilidades
- **Introdução**: 📖 Reabre o tutorial para novos usuários
- **Calculadora**: 🧮 Calcula sua necessidade de água baseada no peso

#### Temas
- **📸 Escolher Imagem de Fundo**: Adicione uma imagem personalizada
- **Remover Imagem de Fundo**: Remove a imagem aplicada
- **Trocar Garrafa**: 🍼 Alterna entre diferentes designs de garrafa
- **Inverter Cores**: 🌓 Alterna entre tema claro e escuro

#### Políticas
- **📖 Manual**: Link para documentação completa
- **📃 Termos de Uso**: Condições de utilização
- **🔒 Política de Privacidade**: Como seus dados são tratados
- **🗑️ Exclusão de Conta**: Instruções para remover seus dados

### 🔐 Modo Online (Recomendado)

1. Clique em **"Login com Google"**
2. Autorize o acesso à sua conta Google
3. Seus dados serão sincronizados automaticamente
4. ✅ Acesse de qualquer dispositivo com seus dados seguros!

### 📱 Modo Offline

- Funciona perfeitamente sem login
- Dados salvos no **localStorage** do navegador
- Funciona mesmo sem conexão com internet
- ⚠️ **Atenção**: Dados podem ser perdidos ao limpar cache do navegador

### 🔄 Migração Offline → Online

Quando você faz login pela primeira vez, o app detecta automaticamente se você tem dados no `localStorage` e os migra para o Firebase, garantindo que nada seja perdido! 🎯

---

## 🎨 Personalização

### 🌈 Alterar Cores do Tema

Edite `styles/body.css`:

```css
body {
    background-color: white;        /* Cor de fundo padrão */
    color: #333;                    /* Cor do texto */
}

body.alt-theme {
    filter: invert(100%) hue-rotate(180deg);  /* Tema escuro */
}
```

### 🎯 Alterar Meta Padrão

Edite `scripts/bottles.js`:

```javascript
// Altere o valor padrão de 2000ml para o que preferir
window.metaDiaria = 3000;  // Exemplo: 3 litros
```

### 🍼 Adicionar Nova Garrafa SVG

1. Crie um arquivo SVG em `images/svgs/bottles/` (ex: `three.svg`)
2. Certifique-se de que o SVG possui:
   - Um elemento `<rect>` com `id="agua"` para o nível de água
   - `viewBox` apropriado (ex: `viewBox="0 0 1300 2900"`)
3. Edite `scripts/bottles.js` para adicionar o novo caminho:

```javascript
const garrafas = [
    'images/svgs/bottles/one.svg',
    'images/svgs/bottles/two.svg',
    'images/svgs/bottles/three.svg'  // Nova garrafa
];
```

### 📝 Personalizar Popup de Introdução

Edite o HTML do popup em `index.html` (linha ~199):

```html
<div id="meu-popup" class="popup">
    <div class="popup-content">
        <span class="fechar" onclick="fecharPopup('meu-popup')">&times;</span>
        <h2>Seu Título Personalizado</h2>
        <p>Seu conteúdo personalizado aqui...</p>
    </div>
</div>
```

---

## 🐛 Troubleshooting (Solução de Problemas)

### ❌ Dados não estão sendo salvos

**Com login (Firebase):**
- ✅ Verifique sua conexão com internet
- ✅ Abra o console do navegador (F12) e procure por erros
- ✅ Confirme se as credenciais do Firebase estão corretas
- ✅ Verifique se Authentication e Firestore estão ativados no Firebase Console

**Sem login (localStorage):**
- ✅ Certifique-se de que o navegador permite localStorage
- ✅ Não está em modo anônimo/privado
- ✅ Navegador não está configurado para limpar dados ao fechar

### ❌ Menu não abre/fecha

- ✅ Abra o console do navegador (F12) e procure por erros JavaScript
- ✅ Verifique se `scripts/buttons.js` está carregando corretamente
- ✅ Limpe o cache do navegador (Ctrl+Shift+Delete)
- ✅ Tente em outro navegador para isolar o problema

### ❌ Garrafa não atualiza visualmente

- ✅ Verifique se o arquivo SVG existe em `images/svgs/bottles/`
- ✅ Abra o SVG diretamente no navegador para ver se está válido
- ✅ Confirme que o elemento `<rect id="agua">` existe no SVG
- ✅ Verifique no console se `atualizarVisual()` está sendo chamada

### ❌ Tema escuro não funciona

- ✅ Verifique se `scripts/themes.js` está carregando
- ✅ Abra o console e digite `document.body.classList` para ver as classes aplicadas
- ✅ Confirme que a classe `alt-theme` está definida em `styles/body.css`

### ❌ Login com Google falha

- ✅ Verifique se o domínio está autorizado no Firebase Console
- ✅ Confirme que o Authentication está ativado
- ✅ Desative bloqueadores de popup
- ✅ Tente em modo anônimo para descartar conflitos de extensões

### ❌ Imagem de fundo não aparece

- ✅ Use URLs públicas e acessíveis (ex: Imgur, Google Drive público)
- ✅ Verifique se a URL termina com extensão de imagem (.jpg, .png, .webp)
- ✅ Abra a URL diretamente no navegador para confirmar que está acessível
- ✅ Alguns sites bloqueiam hotlinking — tente hospedar a imagem em outro lugar

---

## 🤝 Contribuindo

Contribuições são **muito bem-vindas**! Este projeto é open-source e qualquer melhoria é apreciada. 🎉

### Como Contribuir

1. **Fork** o projeto
2. Crie uma **branch** para sua feature:
   ```bash
   git checkout -b feature/MinhaNovaFeature
   ```
3. **Commit** suas mudanças:
   ```bash
   git commit -m 'feat: Adiciona MinhaNovaFeature'
   ```
4. **Push** para a branch:
   ```bash
   git push origin feature/MinhaNovaFeature
   ```
5. Abra um **Pull Request** descrevendo suas mudanças

### 💡 Ideias de Melhorias

**Funcionalidades:**
- [ ] Histórico de consumo (gráficos diários/semanais/mensais)
- [ ] Lembretes/notificações push para beber água
- [ ] Sistema de conquistas/badges gamificados
- [ ] Estatísticas detalhadas (médias, recordes, streaks)
- [ ] Compartilhamento de progresso nas redes sociais
- [ ] Integração com Apple Health / Google Fit

**Técnicas:**
- [ ] Modo PWA (Progressive Web App) com cache offline
- [ ] Service Workers para performance
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] Testes automatizados (Jest/Cypress)
- [ ] TypeScript para type safety
- [ ] Dark mode automático (baseado no sistema)

**UX/UI:**
- [ ] Animações mais suaves (GSAP/Framer Motion)
- [ ] Sons de feedback ao atingir metas
- [ ] Mais temas/skins de garrafa
- [ ] Modo acessibilidade (high contrast)
- [ ] Tutorial interativo melhorado

---

## 📊 Arquitetura e Decisões Técnicas

### 🎯 Por que Vanilla JS?

- **Zero dependências**: App extremamente leve (~50KB total)
- **Performance máxima**: Sem overhead de frameworks
- **Compatibilidade**: Funciona em qualquer navegador moderno
- **Aprendizado**: Código didático e fácil de entender

### 🔥 Por que Firebase?

- **Setup rápido**: Backend em minutos
- **Escalabilidade automática**: Suporta milhões de usuários
- **Autenticação robusta**: Google OAuth pronto para uso
- **Tempo real**: Sincronização instantânea entre dispositivos
- **Gratuito para começar**: Plano Spark generoso

### 💾 Estratégia de Persistência

```
localStorage (offline) ← → Firestore (online)
         ↓                        ↓
    Imediato                 Tempo real
    Navegador               Multi-device
```

**Vantagens:**
- ✅ App funciona 100% offline
- ✅ Sincronização automática ao fazer login
- ✅ Sem perda de dados na transição offline→online
- ✅ Redundância (dados em 2 lugares quando logado)

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** — veja o arquivo [LICENSE.txt](LICENSE.txt) para detalhes.

Resumo: Você pode usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e/ou vender cópias do software livremente! 🎉

---

## 👨‍💻 Autor

**Caio Silva (l4ss4r0t3)**

- 🐙 GitHub: [@l4ss4r0t3](https://github.com/l4ss4r0t3)
- 🌐 Website: [hidrate.se](https://hidrate.se)
- 📧 Email: [seu-email@exemplo.com]

---

## 🙏 Agradecimentos

- **Google Fonts** pela tipografia Google Sans
- **Firebase** pela infraestrutura de backend gratuita
- **Comunidade open-source** pelas inspirações e feedback
- **Você** por usar e contribuir com o projeto! 💙

---

## 📞 Suporte e Contato

- 📧 **Email**: [seu-email@exemplo.com]
- 🐛 **Bugs/Issues**: [GitHub Issues](https://github.com/l4ss4r0t3/Hidrate.se/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/l4ss4r0t3/Hidrate.se/discussions)
- 📖 **Wiki**: [GitHub Wiki](https://github.com/l4ss4r0t3/Hidrate.se/wiki)

---

## 📈 Status do Projeto

![GitHub stars](https://img.shields.io/github/stars/l4ss4r0t3/Hidrate.se?style=social)
![GitHub forks](https://img.shields.io/github/forks/l4ss4r0t3/Hidrate.se?style=social)
![GitHub issues](https://img.shields.io/github/issues/l4ss4r0t3/Hidrate.se)
![GitHub pull requests](https://img.shields.io/github/issues-pr/l4ss4r0t3/Hidrate.se)

**Status**: ✅ Ativo e em desenvolvimento

**Última atualização**: Janeiro 2025

---

<div align="center">

### 💧 Feito com 💙 e muita água! 🌊

**Mantenha-se hidratado!**

[⬆ Voltar ao topo](#-hidratese--sua-garrafa-de-água-digital)

</div>