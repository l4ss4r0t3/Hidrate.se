// =============================================================
// ⚙️ SW_CONFIG.JS - CONFIGURAÇÃO DO SERVICE WORKER (PWA)
// =============================================================
// Este arquivo controla:
// - Registro do Service Worker (sw.js)
// - Verificação de atualizações a cada abertura do app
// - Recarga automática quando uma nova versão assume o controle,
//   mas só se o usuário estiver inativo há mais de 30 segundos
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
// Quando um novo Service Worker assume o controle, recarrega
// a página automaticamente — mas só se o usuário estiver
// inativo há mais de 30 segundos, para não interromper
// um registro de consumo em andamento.
// =============================================================
let refreshing = false;
let ultimaAcao = Date.now();

// Atualiza o timestamp a cada interação do usuário
['click', 'touchstart', 'keydown', 'scroll'].forEach(evento => {
    document.addEventListener(evento, () => {
        ultimaAcao = Date.now();
    });
});

navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;

    const inativoPor    = Date.now() - ultimaAcao;
    const limiteInativo = 30 * 1000; // 30 segundos

    if (inativoPor >= limiteInativo) {
        // ✅ Usuário inativo: recarrega silenciosamente
        refreshing = true;
        console.log('🔄 Atualização aplicada (usuário inativo)');
        window.location.reload();

    } else {
        // ⏳ Usuário ativo: aguarda inatividade antes de recarregar
        console.log('⏳ Atualização pendente, aguardando inatividade...');

        const intervalo = setInterval(() => {
            const inativoAgora = Date.now() - ultimaAcao;

            if (inativoAgora >= limiteInativo) {
                clearInterval(intervalo);
                refreshing = true;
                console.log('🔄 Atualização aplicada (usuário ficou inativo)');
                window.location.reload();
            }
        }, 5000); // Verifica a cada 5 segundos
    }
});