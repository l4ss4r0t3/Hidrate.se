// =============================================================
// ⚙️ SW_CONFIG.JS - CONFIGURAÇÃO DO SERVICE WORKER (PWA)
// =============================================================
// Este arquivo controla:
// - Registro do Service Worker (sw.js)
// - Verificação de atualizações a cada abertura do app
// - Recarga automática quando uma nova versão assume o controle
// =============================================================


// =============================================================
// 📋 REGISTRO DO SERVICE WORKER
// Só executa se o browser suportar Service Workers.
// O registro acontece após o carregamento completo da página
// para não competir com recursos críticos de inicialização.
// =============================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {

        navigator.serviceWorker
            .register('./sw.js', {
                updateViaCache: 'none' // Sempre busca sw.js atualizado na rede
            })
            .then(registration => {
                console.log('✅ Service Worker registrado. Escopo:', registration.scope);

                // Força verificação de nova versão a cada abertura do app.
                // Sem isso, o browser só verifica após 24h por padrão.
                registration.update();
            })
            .catch(erro => {
                console.error('❌ Erro ao registrar o Service Worker:', erro);
            });
    });
}


// =============================================================
// 🔄 RECARGA AUTOMÁTICA AO ATUALIZAR
// Quando um novo Service Worker assume o controle (via claim),
// a página é recarregada para garantir que o usuário está
// sempre usando a versão mais recente do app.
//
// A flag 'refreshing' evita recargas em loop caso o evento
// 'controllerchange' seja disparado mais de uma vez.
// =============================================================
let refreshing = false;

navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
        refreshing = true;
        window.location.reload();
    }
});