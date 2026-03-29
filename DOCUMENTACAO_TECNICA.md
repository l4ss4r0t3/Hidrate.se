# 📘 Documentação Técnica - Hidrate.se

## 🏗️ Arquitetura da Aplicação

### Visão Geral

O Hidrate.se é uma **Single Page Application (SPA)** que utiliza:
- **Frontend puro** (HTML, CSS, JavaScript vanilla)
- **Firebase** como backend serverless
- **localStorage** como fallback offline

### Fluxo de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIO                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    INTERFACE (HTML)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Menu    │  │ Garrafa  │  │  Inputs  │  │  Popup   │   │
│  │ Dropdown │  │   SVG    │  │ Numéricos│  │ Intro    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   SCRIPTS (JavaScript)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │bottles.js│  │buttons.js│  │ popups.js│  │themes.js │   │
│  │          │  │          │  │          │  │          │   │
│  │ Estado   │  │ Menu     │  │ Modal    │  │ Temas    │   │
│  │ Global   │  │ Controle │  │ Intro    │  │ Visual   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────┬──────────────────────┬───────────────────────┘
               │                      │
               ▼                      ▼
┌──────────────────────┐   ┌──────────────────────┐
│   FIREBASE           │   │   localStorage       │
│   (Online)           │   │   (Offline)          │
│                      │   │                      │
│ • Authentication     │   │ • hidratese_dados    │
│ • Firestore          │   │ • ml-input           │
│ • Real-time Sync     │   │ • bg-url             │
│                      │   │ • temaEscuro         │
└──────────────────────┘   └──────────────────────┘
```

## 📦 Módulos e Responsabilidades

### 1. index.html
**Responsabilidade**: Estrutura e configuração inicial

- Define a estrutura HTML da aplicação
- Carrega todos os recursos (CSS, JS, SVG)
- Configura o Firebase (credenciais e inicialização)
- Gerencia estados de autenticação (onAuthStateChanged)
- Coordena migração de dados (offline → online)

**Principais elementos**:
- Menu dropdown com inputs e botões
- Container da garrafa SVG
- Popup de introdução
- Script de configuração Firebase

### 2. bottles.js
**Responsabilidade**: Lógica da garrafa e persistência de dados

**Estado Global**:
```javascript
window.totalBebido  // ml consumidos no dia
window.metaDiaria   // meta diária em ml
```

**Funções principais**:
- `carregarDoLocalStorage()`: Carrega dados salvos
- `salvarNoLocalStorage()`: Persiste estado atual
- `limparLocalStorage()`: Remove dados após migração
- `atualizarVisual()`: Atualiza SVG da garrafa

**Eventos gerenciados**:
- Clique em "Beber Água" → Incrementa totalBebido
- Mudança na meta → Atualiza metaDiaria
- Clique em "Encher Garrafa" → Reseta totalBebido

### 3. buttons.js
**Responsabilidade**: Controle de interações do menu

**Funcionalidades**:
- Abertura/fechamento do menu principal
- Gerenciamento de submenus (Temas, Políticas)
- Persistência do campo "Água a Beber"
- Fechamento ao clicar fora
- Cálculo dinâmico de posição dos submenus

**Funções principais**:
- `fecharMenuCelular()`: Fecha menu e teclado mobile
- `setupMlInput()`: Configura persistência do input

### 4. popups.js
**Responsabilidade**: Modal de introdução

**Funcionalidades**:
- Exibição automática na primeira visita
- Persistência de "já visto" no localStorage
- Controle de abertura/fechamento
- Prevenção de fechamento ao clicar dentro

**Funções principais**:
- `abrir()`: Mostra o popup
- `fechar()`: Oculta o popup

### 5. themes.js
**Responsabilidade**: Personalização visual

**Funcionalidades**:
- Restauração do tema ao carregar página
- Aplicação de imagem de fundo personalizada
- Persistência de preferências visuais

**localStorage usado**:
- `temaEscuro`: "true" ou ausente
- `bg-url`: URL da imagem de fundo

## 🎨 Sistema de Estilos (CSS)

### Arquitetura CSS

```
styles/
├── body.css      → Reset, tema, estilos globais
├── bottles.css   → Posicionamento da garrafa
├── fonts.css     → Importação de fontes
├── menus.css     → Menu dropdown e submenus
└── popups.css    → Modal de introdução
```

### Metodologia

- **Separação por funcionalidade**: Cada arquivo cuida de um aspecto
- **Mobile-first**: Responsivo por padrão
- **CSS puro**: Sem frameworks (Bootstrap, Tailwind, etc)
- **Variáveis nativas**: Usa CSS custom properties onde necessário

### Sistema de Tema

**Modo Claro (padrão)**:
```css
body {
    background-color: white;
    color: black;
}
```

**Modo Escuro (classe `.alt-theme`)**:
```css
body.alt-theme {
    filter: invert(100%) hue-rotate(180deg);
}
```

**Correção do menu** (evita inversão dupla):
```css
body.alt-theme .dropdown-content {
    filter: invert(100%) hue-rotate(180deg);
}
```

## 🔥 Integração com Firebase

### Serviços Utilizados

1. **Firebase Authentication**
   - Provider: Google
   - Método: Popup
   - Gerenciamento: `onAuthStateChanged`

2. **Cloud Firestore**
   - Coleção: `usuarios`
   - Documento: `{uid}` (ID do usuário)
   - Campos: `totalBebido`, `metaDiaria`

### Estrutura do Documento

```javascript
{
  "usuarios": {
    "{uid}": {
      "totalBebido": 1500,     // número (ml)
      "metaDiaria": 2000       // número (ml)
    }
  }
}
```

### Operações Firestore

**Leitura em tempo real**:
```javascript
onSnapshot(userRef, (docSnap) => {
  const dados = docSnap.data();
  window.totalBebido = dados.totalBebido;
  window.metaDiaria = dados.metaDiaria;
});
```

**Escrita**:
```javascript
// Criar documento
setDoc(userRef, { totalBebido: 0, metaDiaria: 2000 });

// Atualizar campo
updateDoc(userRef, { metaDiaria: 3000 });

// Incremento atômico
updateDoc(userRef, { totalBebido: increment(250) });
```

### Regras de Segurança Recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      // Permite ler/escrever apenas o próprio documento
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
  }
}
```

## 💾 Sistema de Persistência Dual

### localStorage (Modo Offline)

**Chave**: `hidratese_dados`

**Estrutura**:
```javascript
{
  "totalBebido": 1500,
  "metaDiaria": 2000,
  "ultimaAtualizacao": "2024-01-15T10:30:00.000Z"
}
```

**Outras chaves**:
- `ml-input`: Valor do campo "Água a Beber"
- `bg-url`: URL da imagem de fundo
- `temaEscuro`: "true" se tema escuro ativo
- `intro-vista`: "true" se popup já foi visto

### Firestore (Modo Online)

**Vantagens**:
- Sincronização em tempo real
- Acesso de múltiplos dispositivos
- Backup automático na nuvem
- Não depende do cache do navegador

### Migração Automática

**Fluxo ao fazer login**:

1. Firebase detecta login (`onAuthStateChanged`)
2. Busca documento do usuário no Firestore
3. **SE documento não existe** (primeira vez):
   - Carrega dados do localStorage
   - Cria documento com esses dados
   - Limpa localStorage
4. **SE documento existe** (já tinha conta):
   - Carrega dados do Firestore
   - Sobrescreve estado local

**Código relevante**:
```javascript
if (docSnap.exists()) {
  // Usuário já tinha conta - usa dados do Firebase
  const dados = docSnap.data();
  window.totalBebido = dados.totalBebido;
  window.metaDiaria = dados.metaDiaria;
} else {
  // Primeira vez - migra localStorage
  const dadosLocal = localStorage.getItem('hidratese_dados');
  if (dadosLocal) {
    const dados = JSON.parse(dadosLocal);
    setDoc(userRef, {
      totalBebido: dados.totalBebido || 0,
      metaDiaria: dados.metaDiaria || 2000
    });
    limparLocalStorage();
  }
}
```

## 🎯 Manipulação do SVG

### Estrutura Esperada do SVG

```xml
<svg>
  <!-- Retângulo da água (muda altura) -->
  <rect id="agua-nivel" height="24" y="7" />
  
  <!-- Textos do rótulo -->
  <text id="texto-ingerido">500ml</text>
  <line id="linha-fracao" />
  <text id="texto-meta">2000ml</text>
</svg>
```

### Cálculo da Animação

**Constantes**:
```javascript
const ALTURA_MAX_SVG = 24;   // Altura quando garrafa cheia
const POSICAO_BASE_Y = 31;   // Posição Y da base
```

**Lógica**:
```javascript
// Quanto falta para atingir a meta?
const restante = metaDiaria - totalBebido;

// Porcentagem de água restante (1 = cheia, 0 = vazia)
const porcentagem = restante / metaDiaria;

// Altura do retângulo
const novaAltura = porcentagem * ALTURA_MAX_SVG;

// Posição Y (sobe conforme esvazia)
const novoY = POSICAO_BASE_Y - novaAltura;
```

### Estados da Garrafa

**Em progresso** (porcentagem > 0):
```
┌─────────┐
│ 500ml   │ ← restante
│─────────│
│ 2000ml  │ ← meta
└─────────┘
```

**Meta atingida** (porcentagem ≤ 0):
```
┌─────────┐
│  Meta   │
│ Batida! │
│   🎉    │
└─────────┘
```

## 🔍 Debugging e Logs

### Console Logs Implementados

**bottles.js**:
```
📦 Dados carregados do localStorage
💾 Dados salvos no localStorage
🧹 localStorage limpo (dados migrados para Firebase)
```

**index.html (Firebase)**:
```
✅ Login realizado com sucesso
👋 Logout realizado
📤 Migrando dados do localStorage para Firebase
💾 Dados salvos no localStorage ao deslogar
```

### Ferramentas de Debug

**Chrome DevTools**:
1. **Console** (F12): Ver logs e erros
2. **Application → Local Storage**: Inspecionar dados salvos
3. **Network**: Verificar chamadas ao Firebase
4. **Elements**: Inspecionar SVG e estilos

**Firebase Console**:
1. **Authentication**: Ver usuários logados
2. **Firestore**: Inspecionar documentos
3. **Usage**: Monitorar quotas

## ⚡ Performance

### Otimizações Implementadas

1. **Carregamento Assíncrono**: Scripts externos após Firebase
2. **CSS Modular**: Apenas estilos necessários por página
3. **SVG Inline vs Object**: Object permite manipulação via JS
4. **localStorage**: Cache local para modo offline
5. **Incremento Atômico**: `increment()` evita race conditions

### Métricas

- **FCP** (First Contentful Paint): < 1s
- **TTI** (Time to Interactive): < 2s
- **Bundle Size**: ~50KB (sem imagens)

## 🔒 Segurança

### Implementações

1. **Autenticação**: Apenas via Google (OAuth 2.0)
2. **Firestore Rules**: Usuário só acessa seus próprios dados
3. **HTTPS**: Obrigatório para Firebase
4. **XSS Protection**: Sanitização de inputs

### Boas Práticas

- ✅ Credenciais do Firebase no frontend são públicas (isso é normal)
- ✅ Segurança real está nas Firestore Rules
- ✅ Nunca expor API keys de admin SDK no frontend
- ✅ Validar dados antes de salvar no Firestore

## 📱 Responsividade

### Breakpoints

```css
/* Mobile (padrão) */
max-width: 100%

/* Submenus dinâmicos */
Detecta espaço disponível via JavaScript
```

### Testes Recomendados

- iPhone SE (375px)
- iPhone 12 Pro (390px)
- Samsung Galaxy S20 (360px)
- iPad (768px)
- Desktop (1920px)

## 🧪 Testes

### Checklist Manual

- [ ] Login/Logout funciona
- [ ] Dados persistem após logout
- [ ] Migração localStorage → Firebase funciona
- [ ] Garrafa atualiza visualmente
- [ ] Meta pode ser alterada
- [ ] Popup aparece na primeira visita
- [ ] Tema escuro funciona
- [ ] Plano de fundo personalizado funciona
- [ ] Menu abre/fecha corretamente
- [ ] Submenus posicionam corretamente
- [ ] Funciona offline (modo localStorage)

### Cenários de Teste

1. **Novo usuário sem login**:
   - Usar app → Fazer login → Dados migram

2. **Usuário com conta existente**:
   - Fazer login → Dados do Firebase carregam

3. **Perda de conexão**:
   - Desconectar internet → App continua funcionando

## 🚀 Deploy

### Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Outros Serviços

- **Netlify**: Drag & drop
- **Vercel**: Integração com Git
- **GitHub Pages**: Gratuito para repositórios públicos

## 📊 Monitoramento

### Métricas Importantes

- **DAU** (Daily Active Users)
- **Sessões por usuário**
- **Taxa de conversão** (login)
- **Dados migrados** (localStorage → Firebase)

### Firebase Analytics

```javascript
// Adicionar ao index.html
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);

// Eventos personalizados
logEvent(analytics, 'beber_agua', { quantidade: 250 });
logEvent(analytics, 'meta_atingida');
```

---

**Documentação criada em**: 2024-01-15  
**Versão do projeto**: 1.0.0  
**Última atualização**: 2024-01-15
