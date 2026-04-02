if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    
    navigator.serviceWorker.register('./sw.js', { 
      updateViaCache: 'none' 
    })
    .then(registration => {
      console.log('Porteiro (SW) ativo no escopo:', registration.scope);
      
      // Dica: Isso força uma verificação de atualização toda vez que o app abre
      registration.update();
    })
    .catch(error => {
      console.log('Erro ao contratar o porteiro:', error);
    });
  });
}