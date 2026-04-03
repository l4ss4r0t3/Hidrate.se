// Detecta se está rodando no app Android
  window.isAndroidApp = function() {
    return typeof AndroidAuth !== 'undefined';
  };

  // Recebe autenticação do Android após login nativo
  window.receiveAuthFromAndroid = function(token, email, uid) {
    console.log('✅ Token recebido do Android:', { email, uid });
    
    // Salva token e dados do usuário
    sessionStorage.setItem('androidAuthToken', token);
    sessionStorage.setItem('androidAuthEmail', email);
    sessionStorage.setItem('androidAuthUid', uid);
    
    // Dispara evento para o módulo Firebase processar
    window.dispatchEvent(new CustomEvent('androidAuthReady', {
      detail: { token, email, uid }
    }));
    
    console.log('📱 Evento androidAuthReady disparado');
  };

  // Callback de erro do Android
  window.onAndroidLoginFailed = function(message) {
    console.error('❌ Falha no login Android:', message);
    alert('Erro ao fazer login: ' + message);
  };

  // Callback de logout do Android
  window.onAndroidLogout = function() {
    console.log('🚪 Logout recebido do Android');
    sessionStorage.clear();
    localStorage.clear();
    location.reload(); // Recarrega página no estado offline
  };

  console.log('📱 Android Bridge ativo. isAndroidApp:', window.isAndroidApp());