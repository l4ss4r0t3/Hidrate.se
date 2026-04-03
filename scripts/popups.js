// =============================================================
// 💬 POPUPS.JS - CONTROLE DE TODOS OS POPUPS DA APLICAÇÃO
// =============================================================
// Este arquivo controla:
// - Abertura e fechamento genérico de popups por ID
// - Configuração de clique fora do modal para fechar
// - Exibição automática da introdução na primeira visita
// - Calculadora de meta diária com base no peso corporal
// =============================================================


// =============================================================
// 🔓 ABRIR POPUP
// Fecha o menu dropdown (se aberto) e exibe o popup pelo ID
// =============================================================
function abrirPopup(id) {
    // Fecha o menu dropdown antes de abrir o popup
    const menu = document.querySelector('.dropdown-content');
    if (menu) menu.style.display = 'none';

    const popup = document.getElementById(id);
    if (popup) popup.classList.add('show');
}


// =============================================================
// 🔒 FECHAR POPUP
// Remove a classe 'show' do popup pelo ID
// =============================================================
function fecharPopup(id) {
    const popup = document.getElementById(id);
    if (popup) popup.classList.remove('show');
}


// =============================================================
// ⚙️ CONFIGURAR POPUP
// Impede que cliques dentro do modal fechem o popup,
// mas fecha ao clicar no overlay externo (fundo escuro)
// =============================================================
function configurarPopup(id, conteudoClasse) {
    const popup = document.getElementById(id);
    if (!popup) return;

    const conteudo = popup.querySelector(conteudoClasse);
    if (!conteudo) return;

    // Clique dentro do modal não propaga para o overlay
    conteudo.addEventListener('click', (e) => e.stopPropagation());

    // Clique no overlay fecha o popup
    popup.addEventListener('click', () => fecharPopup(id));
}


// =============================================================
// 🚀 INICIALIZAÇÃO — AO CARREGAR O DOM
// Configura todos os popups e exibe a introdução se necessário
// =============================================================
document.addEventListener('DOMContentLoaded', () => {

    // Registra o comportamento de fechar ao clicar fora
    // O segundo argumento é a classe do modal interno de cada popup
    configurarPopup('meu-popup',  '.popup-modal');
    configurarPopup('meu-popup2', '.popup-modal');
    configurarPopup('perfil',     '.popup-modal');
    configurarPopup('historico-popup', '.historico-modal');

    // Exibe o popup de introdução apenas na primeira visita
    const jaViu = localStorage.getItem('intro-vista');
    if (!jaViu) {
        abrirPopup('meu-popup');
        localStorage.setItem('intro-vista', 'true');
    }
});


// =============================================================
// 🧮 CALCULADORA DE META DIÁRIA
// Estima a meta com base no peso corporal (35ml por kg)
// e aplica no Firebase (online) ou localStorage (offline)
// =============================================================

const calcularBtn      = document.getElementById('calcular-btn');
const aplicarBtn       = document.getElementById('aplicar-meta-btn');
const resultadoCalculo = document.getElementById('resultado-calculo');

let metaCalculada = null; // Armazena o resultado entre os dois cliques


// =============================================================
// 🔢 CALCULAR META
// Lê o peso, valida e exibe a meta sugerida em ml
// =============================================================
if (calcularBtn) {
    calcularBtn.addEventListener('click', () => {
        const pesoInput = document.getElementById('peso-input');
        const peso      = parseFloat(pesoInput.value);

        if (isNaN(peso) || peso <= 0) {
            resultadoCalculo.textContent = 'Por favor, insira um peso válido.';
            metaCalculada = null;
            return;
        }

        metaCalculada = Math.round(peso * 35);
        resultadoCalculo.innerHTML = `Meta sugerida: <strong>${metaCalculada} ml</strong>`;
    });
}


// =============================================================
// ✅ APLICAR META
// Persiste a meta calculada no Firebase (online) ou localStorage
// =============================================================
if (aplicarBtn) {
    aplicarBtn.addEventListener('click', async () => {

        if (!metaCalculada) {
            resultadoCalculo.textContent = 'Calcule primeiro!';
            return;
        }

        const user = window.auth?.currentUser;

        if (user && navigator.onLine) {
            // ☁️ ONLINE: salva a meta no Firestore
            try {
                const userRef = window.doc(window.db, 'usuarios', user.uid);
                await window.updateDoc(userRef, { metaDiaria: metaCalculada });
                console.log('☁️ Meta aplicada no Firebase:', metaCalculada);
            } catch (e) {
                console.error('❌ Erro ao aplicar meta no Firebase:', e);
            }
        } else {
            // 💾 OFFLINE: salva a meta no localStorage
            window.metaDiaria = metaCalculada;
            if (typeof window.salvarNoLocalStorage === 'function') {
                window.salvarNoLocalStorage();
            }
            if (typeof window.atualizarVisual === 'function') {
                window.atualizarVisual();
            }
            console.log('💾 Meta aplicada no localStorage:', metaCalculada);
        }

        resultadoCalculo.innerHTML = `✅ Meta aplicada: <strong>${metaCalculada} ml</strong>`;
    });
}


// =============================================================
// 🌍 EXPORTAÇÃO GLOBAL
// =============================================================
window.abrirPopup  = abrirPopup;
window.fecharPopup = fecharPopup;