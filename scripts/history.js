// =============================================================
// 📚 HISTORY.JS - HISTÓRICO DE CONSUMO
// =============================================================

// =============================================================
// 📥 CARREGAR HISTÓRICO DOS ÚLTIMOS 7 DIAS
// Tenta Firebase primeiro, fallback para localStorage
// =============================================================
async function carregarHistorico() {
    const user = window.auth?.currentUser;

    if (user && navigator.onLine) {
        return await carregarDoFirebase(user);
    } else {
        return carregarDoLocalStorage();
    }
}

async function carregarDoFirebase(user) {
    const dias = [];
    const hoje = new Date();

    for (let i = 0; i < 7; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() - i);
        const dataStr = data.toLocaleDateString('pt-BR');

        try {
            // Carrega o resumo do dia
            const diaRef = window.doc(window.db, "usuarios", user.uid, "historico", dataStr);
            const diaSnap = await window.getDoc(diaRef);

            if (diaSnap.exists()) {
                const diaData = diaSnap.data();

                // Carrega os registros individuais do dia
                const registrosRef = window.collection(
                    window.db, "usuarios", user.uid, "historico", dataStr, "registros"
                );
                const registrosSnap = await window.getDocs(registrosRef);
                const registros = registrosSnap.docs.map(d => d.data());
                registros.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

                dias.push({ ...diaData, registros });
            }
        } catch (e) {
            console.error(`❌ Erro ao carregar dia ${dataStr}:`, e);
        }
    }

    return dias;
}

function carregarDoLocalStorage() {
    const dias = [];
    const hoje = new Date();

    for (let i = 0; i < 7; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() - i);
        const dataStr = data.toLocaleDateString('pt-BR');

        const chaveResumo = 'hidratese_historico';
        const historico = JSON.parse(localStorage.getItem(chaveResumo)) || [];
        const resumoDia = historico.find(d => d.data === dataStr);

        const chaveRegistros = `hidratese_registros_${dataStr}`;
        const registros = JSON.parse(localStorage.getItem(chaveRegistros)) || [];

        if (resumoDia || registros.length > 0) {
            dias.push({
                data: dataStr,
                totalBebido: resumoDia?.totalBebido || 0,
                metaDiaria: resumoDia?.metaDiaria || window.metaDiaria,
                registros
            });
        }
    }

    return dias;
}

// =============================================================
// 🎨 RENDERIZAR O POPUP
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
        const atingiu = dia.totalBebido >= dia.metaDiaria;

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
                ${dia.registros.map(r => `
                    <div class="historico-registro-individual">
                        <span class="registro-hora">${r.hora}</span>
                        <span class="registro-quantidade">+${r.quantidade}ml</span>
                    </div>
                `).join('')}
            </div>
        `;

        container.appendChild(diaEl);
    });
}

// =============================================================
// 🪟 ABRIR / FECHAR POPUP
// =============================================================
async function abrirHistorico() {
    const popup = document.getElementById('historico-popup');
    popup.style.display = 'flex';

    const container = document.getElementById('historico-lista');
    container.innerHTML = '<p class="historico-carregando">Carregando...</p>';

    const dias = await carregarHistorico();
    renderizarHistorico(dias);
}

function fecharHistorico() {
    const popup = document.getElementById('historico-popup');
    popup.style.display = 'none';
}

// Fecha ao clicar fora do popup
document.getElementById('historico-popup').addEventListener('click', (e) => {
    if (e.target.id === 'historico-popup') fecharHistorico();
});

// =============================================================
// 🌍 EXPORTAÇÃO GLOBAL
// =============================================================
window.abrirHistorico = abrirHistorico;
window.fecharHistorico = fecharHistorico;