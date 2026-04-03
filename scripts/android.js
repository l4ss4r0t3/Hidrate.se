// =============================================================
// 📱 ANDROID.JS - BRIDGE ENTRE O APP ANDROID E O FIREBASE
// =============================================================
// Este arquivo controla:
// - Detecção do ambiente Android nativo
// - Recepção do token de autenticação vindo do app
// - Disparo de eventos para o firebase.js processar o login
// - Callbacks de erro e logout vindos do Android
// =============================================================


// =============================================================
// 🔍 DETECÇÃO DO AMBIENTE
// Verifica se o app está rodando dentro do WebView Android.
// AndroidAuth é um objeto injetado pelo app nativo via JavascriptInterface.
// =============================================================
window.isAndroidApp = function () {
  return typeof AndroidAuth !== 'undefined';
};


// =============================================================
// 📥 RECEPÇÃO DO TOKEN DE AUTENTICAÇÃO
// Chamado pelo app Android após login nativo bem-sucedido.
// Salva os dados na sessão e notifica o firebase.js via evento.
// =============================================================
window.receiveAuthFromAndroid = function (token, email, uid) {
  console.log('✅ Token recebido do Android:', { email, uid });

  // Persiste os dados do usuário na sessão atual
  // (perdidos ao fechar o app — comportamento intencional)
  sessionStorage.setItem('androidAuthToken', token);
  sessionStorage.setItem('androidAuthEmail', email);
  sessionStorage.setItem('androidAuthUid', uid);

  // Notifica o firebase.js para iniciar a escuta do Firestore
  window.dispatchEvent(new CustomEvent('androidAuthReady', {
    detail: { token, email, uid }
  }));

  console.log('📱 Evento androidAuthReady disparado');
};


// =============================================================
// ❌ CALLBACK DE ERRO DE LOGIN
// Chamado pelo Android quando o login nativo falha.
// =============================================================
window.onAndroidLoginFailed = function (message) {
  console.error('❌ Falha no login Android:', message);
  alert('Erro ao fazer login: ' + message);
};


// =============================================================
// 🚪 CALLBACK DE LOGOUT
// Chamado pelo Android quando o usuário desloga pelo app nativo.
// Limpa toda a sessão e recarrega a página no estado offline.
// =============================================================
window.onAndroidLogout = function () {
  console.log('🚪 Logout recebido do Android');

  sessionStorage.clear(); // Remove token e dados da sessão
  localStorage.clear();   // Remove dados offline (totalBebido, meta, histórico)

  location.reload();      // Recarrega no estado deslogado
};


// =============================================================
// 🟢 CONFIRMAÇÃO DE CARREGAMENTO
// =============================================================
console.log('📱 Android Bridge ativo. isAndroidApp:', window.isAndroidApp());