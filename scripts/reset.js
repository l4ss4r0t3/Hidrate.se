// =============================================================
// 🌙 DAILY-RESET.JS - RESET DIÁRIO AUTOMÁTICO
// =============================================================
// - Meia-noite: salva histórico do dia e zera consumo
// - Fallback: ao abrir o app, verifica se mudou o dia
// =============================================================

// =============================================================
// 💾 SALVAR DIA NO HISTÓRICO
// Chamado antes de zerar — persiste o consumo do dia anterior
// =============================================================
async function salvarDiaNoHistorico() {
    const hoje = new Date().toLocaleDateString('pt-BR'); // ex: "03/04/2026"
    const registro = {
        data: hoje,
        totalBebido: window.totalBebido,
        metaDiaria: window.metaDiaria,
        timestamp: new Date().toISOString()
    };

    // 💾 Salva no localStorage sempre
    try {
        const historico = JSON.parse(localStorage.getItem('hidratese_historico')) || [];
        historico.push(registro);
        localStorage.setItem('hidratese_historico', JSON.stringify(historico));
        console.log('📚 Dia salvo no histórico (localStorage):', registro);
    } catch (e) {
        console.error('❌ Erro ao salvar histórico no localStorage:', e);
    }

    // ☁️ Salva no Firebase se estiver logado e online
    const user = window.auth?.currentUser;
    if (user && navigator.onLine) {
        try {
            const historicoRef = window.doc(
                window.db, 
                "usuarios", user.uid, 
                "historico", hoje  // documento com a data como ID
            );
            await window.setDoc(historicoRef, registro);
            console.log('☁️ Dia salvo no histórico (Firebase):', registro);
        } catch (e) {
            console.error('❌ Erro ao salvar histórico no Firebase:', e);
        }
    }
}

// =============================================================
// 🔄 EXECUTAR O RESET
// Salva histórico e zera o consumo (localStorage + Firebase)
// =============================================================
async function executarReset() {
    console.log('🌙 Executando reset diário...');

    await salvarDiaNoHistorico();

    // Zera o estado global
    window.totalBebido = 0;

    // Atualiza a data do último reset
    const hoje = new Date().toLocaleDateString('pt-BR');
    localStorage.setItem('hidratese_ultimo_reset', hoje);

    // 💾 Persiste no localStorage
    if (typeof window.salvarNoLocalStorage === 'function') {
        window.salvarNoLocalStorage();
    }

    // ☁️ Persiste no Firebase se disponível
    const user = window.auth?.currentUser;
    if (user && navigator.onLine) {
        try {
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { totalBebido: 0 });
            console.log('☁️ Reset sincronizado com Firebase');
        } catch (e) {
            console.warn('⚠️ Erro ao sincronizar reset com Firebase:', e);
        }
    }

    // Atualiza a tela
    if (typeof window.atualizarVisual === 'function') {
        window.atualizarVisual();
    }

    console.log('✅ Reset diário concluído');
}

// =============================================================
// 🕛 AGENDAR RESET À MEIA-NOITE
// Calcula quantos ms faltam para meia-noite e agenda o reset
// =============================================================
function agendarResetMeiaNoite() {
    const agora = new Date();
    const meiaNoite = new Date();
    meiaNoite.setHours(24, 0, 0, 0); // próxima meia-noite

    const msAteMeiaNoite = meiaNoite - agora;
    console.log(`⏰ Reset agendado em ${Math.round(msAteMeiaNoite / 60000)} minutos`);

    setTimeout(async () => {
        await executarReset();
        agendarResetMeiaNoite(); // reagenda para a próxima meia-noite
    }, msAteMeiaNoite);
}

// =============================================================
// 📅 FALLBACK: VERIFICAR AO ABRIR O APP
// Se o app ficou fechado durante a meia-noite, reseta ao abrir
// =============================================================
async function verificarResetPendente() {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const ultimoReset = localStorage.getItem('hidratese_ultimo_reset');

    if (ultimoReset && ultimoReset !== hoje) {
        console.log(`📅 Dia mudou (último reset: ${ultimoReset}), executando fallback...`);
        await executarReset();
    } else if (!ultimoReset) {
        // Primeira vez usando o app — só registra a data
        localStorage.setItem('hidratese_ultimo_reset', hoje);
        console.log('📅 Primeira execução, data registrada:', hoje);
    }
}

// =============================================================
// 🚀 INICIALIZAÇÃO
// =============================================================
(async () => {
    await verificarResetPendente(); // fallback primeiro
    agendarResetMeiaNoite();        // depois agenda meia-noite
})();

// =============================================================
// 🌍 EXPORTAÇÃO GLOBAL
// =============================================================
window.salvarDiaNoHistorico = salvarDiaNoHistorico;
window.executarReset = executarReset;