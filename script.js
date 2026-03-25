// =============================================================
// ESTADO GLOBAL (Sincronizado com Firebase)
// =============================================================
window.totalBebido = 0;
window.metaDiaria = 2000;

// =============================================================
// REFERÊNCIAS AOS ELEMENTOS
// =============================================================
const inputMl = document.getElementById('ml-input');
const inputMeta = document.getElementById('meta-input');
const btnBeber = document.getElementById('btn-beber');
const btnZerar = document.getElementById('btn-zerar');
const elementoAgua = document.getElementById('agua-nivel');

const ALTURA_MAX_SVG = 24;
const POSICAO_BASE_Y = 31;

// =============================================================
// FUNÇÃO: ATUALIZAR VISUAL (Acessível globalmente)
// =============================================================
window.atualizarVisual = function() {
    const restante = Math.max(window.metaDiaria - window.totalBebido, 0);
    const porcentagem = Math.min(Math.max(restante / window.metaDiaria, 0), 1);

    const novaAltura = porcentagem * ALTURA_MAX_SVG;
    const novoY = POSICAO_BASE_Y - novaAltura;

    if (elementoAgua) {
        elementoAgua.setAttribute('height', novaAltura);
        elementoAgua.setAttribute('y', novoY);
    }

    const txtIngerido = document.getElementById('texto-ingerido');
    const txtMeta = document.getElementById('texto-meta');
    const linhaFracao = document.getElementById('linha-fracao');

    if (txtIngerido && txtMeta) {
        if (porcentagem <= 0) {
            txtIngerido.textContent = 'Meta';
            txtMeta.textContent = 'Batida! 🎉';
            if (linhaFracao) linhaFracao.style.display = 'none';
        } else {
            txtIngerido.textContent = `${restante}ml`;
            txtMeta.textContent = `${window.metaDiaria}ml`;
            if (linhaFracao) linhaFracao.style.display = 'block';
        }
    }
};

// =============================================================
// EVENTOS (Firebase Integration)
// =============================================================

// Beber Água
btnBeber.addEventListener('click', async () => {
    const valor = parseFloat(inputMl.value) || 0;
    const user = window.auth?.currentUser;

    if (valor > 0) {
        if (user) {
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { totalBebido: window.increment(valor) });
        } else {
            window.totalBebido += valor;
            window.atualizarVisual();
        }
        inputMl.value = '';
        fecharMenuCelular();
    }
});

// Atualizar Meta
if (inputMeta) {
    inputMeta.addEventListener('change', async () => {
        const novaMeta = parseFloat(inputMeta.value) || 2000;
        const user = window.auth?.currentUser;

        if (user && novaMeta > 0) {
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { metaDiaria: novaMeta });
        } else {
            window.metaDiaria = novaMeta;
            window.atualizarVisual();
        }
    });
}

// Zerar / Encher
btnZerar.addEventListener('click', async () => {
    const user = window.auth?.currentUser;
    if (confirm('Deseja encher a garrafa novamente?')) {
        if (user) {
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { totalBebido: 0 });
        } else {
            window.totalBebido = 0;
            window.atualizarVisual();
        }
        fecharMenuCelular();
    }
});

// Restante das funções (Menu, Tecla Enter, Tema) permanecem iguais...

// =============================================================
// CONTROLE DO MENU DROPDOWN (100% via JavaScript)
// O CSS não controla abertura/fechamento — tudo passa por aqui.
// Isso evita conflitos com :focus-within e :hover no mobile.
// =============================================================
const dropbtn = document.querySelector('.dropbtn');
const menu = document.querySelector('.dropdown-content');

// Abre ou fecha o menu ao clicar no botão hambúrguer.
// e.stopPropagation() impede que o clique propague para o document
// e acione o listener de fechamento logo em seguida — bug crítico no mobile.
dropbtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const estaAberto = menu.style.display === 'block';
    menu.style.display = estaAberto ? 'none' : 'block';
});

// Fecha o menu ao clicar em qualquer área fora dele
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        menu.style.display = 'none';
    }
});

// =============================================================
// FUNÇÃO: FECHAR MENU NO CELULAR
// Fecha o menu, remove o foco (fecha o teclado virtual)
// e rola a tela de volta ao topo suavemente.
// =============================================================
function fecharMenuCelular() {
    menu.style.display = 'none';
    if (document.activeElement) document.activeElement.blur(); // Fecha o teclado mobile
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // Volta ao topo da tela
}

// =============================================================
// EVENTO: BOTÃO INVERTER CORES
// Alterna entre o tema claro e escuro (via classe CSS no body)
// e salva a preferência no localStorage.
// =============================================================
const btnTema = document.getElementById('btn-tema');
if (btnTema) {
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('alt-theme');
        // Salva true/false dependendo se o tema escuro está ativo
        localStorage.setItem('temaEscuro', document.body.classList.contains('alt-theme'));
    });
}

// =============================================================
// EVENTO: CARREGAMENTO DA PÁGINA
// Restaura o tema salvo ao abrir o site.
// =============================================================
window.addEventListener('load', () => {
    if (localStorage.getItem('temaEscuro') === 'true') {
        document.body.classList.add('alt-theme');
    }
});