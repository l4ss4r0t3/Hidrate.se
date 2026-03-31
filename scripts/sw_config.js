if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Porteiro (SW) ativo no escopo:', registration.scope);
      })
      .catch(error => {
        console.log('Erro ao contratar o porteiro:', error);
      });
  });
}