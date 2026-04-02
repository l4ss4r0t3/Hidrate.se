if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    
    navigator.serviceWorker.register('./sw.js', { 
      updateViaCache: 'none' 
    })
    .then(registration => {
      console.log('Porteiro (SW) ativo no escopo:', registration.scope);
      
      // Isso força uma verificação de atualização toda vez que o app abre
      registration.update();
    })
    .catch(error => {
      console.log('Erro ao contratar o porteiro:', error);
    });
  });
}

let refreshing = false;
// Detecta quando o Service Worker novo assume o controle (claim)
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (!refreshing) {
    window.location.reload(); // Recarrega a página automaticamente com o código novo
    refreshing = true;
  }
});