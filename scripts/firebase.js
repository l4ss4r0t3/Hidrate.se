// =============================================================
// 🔥 FIREBASE.JS - AUTENTICAÇÃO E FIRESTORE
// =============================================================
// Este arquivo controla:
// - Inicialização do Firebase (Auth + Firestore)
// - Login e logout com Google (web e Android)
// - Escuta em tempo real dos dados do usuário (onSnapshot)
// - Migração de dados do localStorage para o Firebase
// - Exposição das funções e instâncias no objeto window
// =============================================================


// =============================================================
// 📦 IMPORTS — FIREBASE AUTH
// =============================================================
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// =============================================================
// 📦 IMPORTS — FIRESTORE
// =============================================================
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  onSnapshot,
  increment
} from 'firebase/firestore';

// =============================================================
// 📦 IMPORT — CONFIGURAÇÃO DO PROJETO
// =============================================================
import { firebaseConfig } from '../scripts/config.js';


// =============================================================
// 🚀 INICIALIZAÇÃO DO FIREBASE
// Cria a instância do app, auth e Firestore com cache persistente
// Cache persistente permite funcionamento offline automaticamente
// =============================================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager() // Suporte a múltiplas abas
  })
});

const provider = new GoogleAuthProvider();


// =============================================================
// 🔐 LOGIN COM GOOGLE
// Suporta dois fluxos: popup web e bridge nativa do Android
// =============================================================
window.fazerLogin = async function () {

  // Fluxo Android: delega o login para o app nativo
  if (window.isAndroidApp && window.isAndroidApp()) {
    console.log('📱 Solicitando login via Android...');
    AndroidAuth.requestLogin();
    return;
  }

  // Fluxo web: abre popup do Google
  try {
    const resultado = await signInWithPopup(auth, provider);
    const user = resultado.user;
    console.log('✅ Login realizado:', user.email);
  } catch (erro) {
    console.error('❌ Erro no login:', erro);
    alert('Erro ao fazer login. Tente novamente.');
  }
};


// =============================================================
// 🚪 LOGOUT
// Suporta dois fluxos: web e bridge nativa do Android
// =============================================================
window.fazerLogout = async function () {

  // Fluxo Android: notifica o app nativo
  if (window.isAndroidApp && window.isAndroidApp()) {
    AndroidAuth.requestLogout();
    return;
  }

  // Fluxo web: desloga via Firebase Auth
  try {
    await signOut(auth);
    console.log('👋 Logout realizado');
  } catch (erro) {
    console.error('❌ Erro no logout:', erro);
  }
};


// =============================================================
// 📱 BRIDGE ANDROID — RECEPÇÃO DE AUTH
// Disparado pelo android.js quando o token nativo chega.
// Simula o fluxo de login sem passar pelo popup do Google.
// =============================================================
window.addEventListener('androidAuthReady', async (event) => {
  const { token, email, uid } = event.detail;
  console.log('📱 Auth Android recebida:', { email, uid });

  // Aguarda o firebase.js terminar de carregar antes de escutar
  setTimeout(() => {
    if (window.escutarUsuario) {
      const userMock = { uid, email };
      window.escutarUsuario(userMock);

      // Atualiza o botão de auth para refletir estado logado
      const btnAuth = document.getElementById('btn-auth');
      if (btnAuth) {
        btnAuth.textContent = 'Sair (Google)';
        btnAuth.onclick = window.fazerLogout;
      }

      // Oculta aviso de autenticação
      const authWarning = document.getElementById('auth-warning');
      if (authWarning) authWarning.style.display = 'none';

      console.log('✅ Escutando Firestore do usuário Android');
    }
  }, 500);
});


// =============================================================
// 👁️ OBSERVER DE AUTENTICAÇÃO
// Executado automaticamente sempre que o estado de login muda.
// Controla o que acontece ao logar, deslogar ou recarregar.
// =============================================================
let unsubscribe = null; // Referência para cancelar o onSnapshot anterior

onAuthStateChanged(auth, (user) => {
  const btnAuth     = document.getElementById('btn-auth');
  const authWarning = document.getElementById('auth-warning');

  // Cancela escuta anterior para evitar listeners duplicados
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  if (user) {
    // ✅ USUÁRIO LOGADO

    // Atualiza foto e nome no popup de perfil
    const fotoPerfil = document.getElementById('foto-perfil');
    const nomePerfil = document.getElementById('nome-perfil');
    if (fotoPerfil) fotoPerfil.src = (user.photoURL || '').replace('s96-c', 's400-c');
    if (nomePerfil) nomePerfil.textContent = user.displayName;

    // Atualiza botão de auth
    if (btnAuth) {
      btnAuth.textContent = 'Sair (Google)';
      btnAuth.onclick = window.fazerLogout;
    }

    // Oculta aviso de autenticação
    if (authWarning) authWarning.style.display = 'none';

    // Inicia escuta em tempo real dos dados do usuário no Firestore
    escutarUsuario(user);

  } else {
    // ❌ USUÁRIO DESLOGADO

    // Atualiza botão de auth
    if (btnAuth) {
      btnAuth.textContent = 'Login com Google';
      btnAuth.onclick = window.fazerLogin;
    }

    // Exibe aviso de autenticação
    if (authWarning) authWarning.style.display = 'block';

    // Salva dados atuais no localStorage antes de limpar o estado
    if (window.totalBebido > 0 || window.metaDiaria !== 2000) {
      if (typeof window.salvarNoLocalStorage === 'function') {
        window.salvarNoLocalStorage();
        console.log('💾 Dados salvos no localStorage ao deslogar');
      }
    }

    // Recarrega dados do localStorage para manter estado visual
    if (typeof window.carregarDoLocalStorage === 'function') {
      window.carregarDoLocalStorage();
    }

    // Atualiza a UI com os dados do localStorage
    resetarEstado();
  }
});


// =============================================================
// 👂 ESCUTAR USUÁRIO NO FIRESTORE (TEMPO REAL)
// onSnapshot mantém a UI sincronizada com o banco em tempo real.
// Na primeira vez que o usuário loga, migra dados do localStorage.
// =============================================================
function escutarUsuario(user) {
  const userRef = doc(db, 'usuarios', user.uid);

  unsubscribe = onSnapshot(userRef, (docSnap) => {

    if (docSnap.exists()) {
      // Documento existe: carrega dados do Firestore
      const dados = docSnap.data();
      window.totalBebido = dados.totalBebido || 0;
      window.metaDiaria  = dados.metaDiaria  || 2000;
      atualizarUI();

    } else {
      // Documento não existe: primeiro login — migra localStorage
      const dadosLocal = localStorage.getItem('hidratese_dados');
      let dadosIniciais = { totalBebido: 0, metaDiaria: 2000 };

      if (dadosLocal) {
        try {
          const dadosParsed = JSON.parse(dadosLocal);
          dadosIniciais = {
            totalBebido: dadosParsed.totalBebido || 0,
            metaDiaria:  dadosParsed.metaDiaria  || 2000
          };
          console.log('📤 Migrando localStorage para Firebase:', dadosIniciais);
        } catch (e) {
          console.error('❌ Erro ao migrar localStorage:', e);
        }
      }

      // Cria o documento do usuário no Firestore com os dados migrados
      setDoc(userRef, dadosIniciais);

      // Limpa o localStorage — Firebase assume o controle
      if (typeof window.limparLocalStorage === 'function') {
        window.limparLocalStorage();
      }
    }
  });
}


// =============================================================
// 🎨 ATUALIZAR UI
// Sincroniza os elementos visuais com o estado atual dos dados
// =============================================================
function atualizarUI() {
  if (typeof window.atualizarVisual === 'function') {
    window.atualizarVisual();
  }

  const inputMeta = document.getElementById('meta-input');
  if (inputMeta) inputMeta.value = window.metaDiaria;
}


// =============================================================
// 🔄 RESETAR ESTADO (ao deslogar)
// Atualiza a UI com os valores do localStorage após logout
// =============================================================
function resetarEstado() {
  if (typeof window.atualizarVisual === 'function') {
    window.atualizarVisual();
  }

  const inputMeta = document.getElementById('meta-input');
  if (inputMeta) inputMeta.value = window.metaDiaria;
}


// =============================================================
// 🌍 EXPORTAÇÃO GLOBAL
// Expõe instâncias e funções do Firebase para os outros scripts
// =============================================================
window.auth       = auth;
window.db         = db;
window.doc        = doc;
window.setDoc     = setDoc;
window.updateDoc  = updateDoc;
window.getDoc     = getDoc;
window.getDocs    = getDocs;
window.collection = collection;
window.deleteDoc = deleteDoc;
window.increment  = increment;
window.escutarUsuario = escutarUsuario;