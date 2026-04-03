// =============================================================
// 📚 HISTORY.JS - HISTÓRICO DE CONSUMO
// =============================================================
// Este arquivo controla:
// - Carregamento dos últimos 7 dias (Firebase ou localStorage)
// - Renderização dos cards de cada dia no popup
// - Abertura e fechamento do popup de histórico
// =============================================================


// =============================================================
// 🗓️ UTILITÁRIO — GERAR LISTA DOS ÚLTIMOS N DIAS
// Retorna um array de strings de data no formato pt-BR
// Ex: ['03/04/2026', '02/04/2026', ...]
// =============================================================
function obterUltimosDias(quantidade = 7) {
    const hoje = new Date();
    const dias = [];

    for (let i = 0; i < quantidade; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() - i);
        dias.push(data.toLocaleDateString('pt-BR'));
    }

    return dias;
}


// =============================================================
// 📥 CARREGAR HISTÓRICO
// Decide a fonte dos dados: Firebase (online) ou localStorage
// =============================================================
async function carregarHistorico() {
    const user = window.auth?.currentUser;

    if (user && navigator.onLine) {
        return await carregarDoFirebase(user);
    } else {
        return carregarDoLocalStorage();
    }
}


// =============================================================
// ☁️ CARREGAR DO FIREBASE
// Para cada dia, busca o resumo do dia e os registros individuais
// Subcoleção: usuarios/{uid}/historico/{data}/registros
// =============================================================
async function carregarDoFirebase(user) {
    const dias = [];

    for (const dataStr of obterUltimosDias()) {
        try {
            // Resumo do dia (totalBebido, metaDiaria)
            const diaRef  = window.doc(window.db, 'usuarios', user.uid, 'historico', dataStr);
            const diaSnap = await window.getDoc(diaRef);
            const diaData = diaSnap.exists() ? diaSnap.data() : {};

            // Registros individuais do dia (cada gole registrado)
            const registrosRef  = window.collection(window.db, 'usuarios', user.uid, 'historico', dataStr, 'registros');
            const registrosSnap = await window.getDocs(registrosRef);

            // Ordena os registros cronologicamente pelo timestamp
            const registros = registrosSnap.docs
                .map(d => d.data())
                .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

            // Só inclui o dia se houver algum dado
            if (diaSnap.exists() || registros.length > 0) {
                dias.push({
                    data:        dataStr,
                    totalBebido: diaData.totalBebido || 0,
                    metaDiaria:  diaData.metaDiaria  || window.metaDiaria,
                    registros
                });
            }

        } catch (e) {
            console.error(`❌ Erro ao carregar dia ${dataStr} do Firebase:`, e);
        }
    }

    return dias;
}


// =============================================================
// 💾 CARREGAR DO LOCALSTORAGE
// Fallback offline — lê o resumo do array hidratese_historico
// e os registros individuais de hidratese_registros_{data}
// =============================================================
function carregarDoLocalStorage() {
    const dias = [];

    // Resumo geral de todos os dias salvos localmente
    const historico = JSON.parse(localStorage.getItem('hidratese_historico')) || [];

    for (const dataStr of obterUltimosDias()) {
        const resumoDia = historico.find(d => d.data === dataStr);
        const registros = JSON.parse(localStorage.getItem(`hidratese_registros_${dataStr}`)) || [];

        // Só inclui o dia se houver algum dado
        if (resumoDia || registros.length > 0) {
            dias.push({
                data:        dataStr,
                totalBebido: resumoDia?.totalBebido || 0,
                metaDiaria:  resumoDia?.metaDiaria  || window.metaDiaria,
                registros
            });
        }
    }

    return dias;
}


// =============================================================
// 🎨 RENDERIZAR HISTÓRICO NO POPUP
// Gera os cards de cada dia com resumo e registros individuais
// =============================================================
function renderizarHistorico(dias) {
    const container = document.getElementById('historico-lista');
    container.innerHTML = '';

    if (dias.length === 0) {
        container.innerHTML = '<p class="historico-vazio">Nenhum registro encontrado.</p>';
        return;
    }

    dias.forEach(dia => {
        const porcentagem = Math.min((dia.totalBebido / dia.metaDiaria) * 100, 100).toFixed(0);
        const atingiu     = dia.totalBebido >= dia.metaDiaria;

        const diaEl = document.createElement('div');
        diaEl.classList.add('historico-dia');

        diaEl.innerHTML = `
            <div class="historico-dia-header">
                <span class="historico-data">${dia.data}</span>
                <span class="historico-total ${atingiu ? 'meta-atingida' : ''}">
                    ${dia.totalBebido}ml / ${dia.metaDiaria}ml (${porcentagem}%)
                    ${atingiu ? '🎉' : ''}
                </span>
            </div>
            <div class="historico-registros">
                ${dia.registros.length > 0
                    ? dia.registros.map(r => `
                        <div class="historico-registro-individual">
                            <span class="registro-hora">${r.hora}</span>
                            <span class="registro-quantidade">+${r.quantidade}ml</span>
                        </div>
                    `).join('')
                    : '<p class="historico-vazio">Sem registros individuais.</p>'
                }
            </div>
        `;

        container.appendChild(diaEl);
    });
}


// =============================================================
// 🪟 ABRIR POPUP DE HISTÓRICO
// Exibe o popup, mostra loading e carrega os dados
// =============================================================
async function abrirHistorico() {
    const popup     = document.getElementById('historico-popup');
    const container = document.getElementById('historico-lista');

    // Exibe o popup e estado de carregamento
    popup.classList.add('show');
    container.innerHTML = '<p class="historico-carregando">Carregando...</p>';

    // Carrega e renderiza os dados
    const dias = await carregarHistorico();
    renderizarHistorico(dias);
}


// =============================================================
// 🚪 FECHAR POPUP DE HISTÓRICO
// =============================================================
function fecharHistorico() {
    const popup = document.getElementById('historico-popup');
    popup.classList.remove('show');
}

// Fecha ao clicar no overlay (fora do modal)
document.getElementById('historico-popup').addEventListener('click', (e) => {
    if (e.target.id === 'historico-popup') fecharHistorico();
});


// =============================================================
// 🌍 EXPORTAÇÃO GLOBAL
// =============================================================
window.abrirHistorico  = abrirHistorico;
window.fecharHistorico = fecharHistorico;