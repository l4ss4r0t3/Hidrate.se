// =============================================================
// ESTADO GLOBAL (Sincronizado com Firebase quando logado)
// Esses valores são sobrescritos pelo onSnapshot do Firebase
// sempre que o usuário estiver autenticado.
// =============================================================
window.totalBebido = 0;
window.metaDiaria = 2000;

// =============================================================
// REFERÊNCIAS AOS ELEMENTOS DO DOM
// Capturadas uma vez no carregamento para evitar consultas
// repetidas ao DOM durante os eventos.
// =============================================================
const inputMl   = document.getElementById('ml-input');
const inputMeta = document.getElementById('meta-input');
const btnBeber  = document.getElementById('btn-beber');
const btnZerar  = document.getElementById('btn-zerar');
const elementoAgua = document.getElementById('agua-nivel');

// =============================================================
// CONSTANTES DO SVG
// Correspondem às dimensões definidas no SVG do index.html:
// - ALTURA_MAX_SVG: espaço interno da garrafa em unidades SVG (y=7 até y=31)
// - POSICAO_BASE_Y: coordenada Y da base interna da garrafa
// =============================================================
const ALTURA_MAX_SVG = 24;
const POSICAO_BASE_Y = 31;

// =============================================================
// FUNÇÃO: ATUALIZAR VISUAL
// Recalcula o nível da água e atualiza o SVG e o rótulo.
// Exposta globalmente para ser chamada pelo Firebase (index.html)
// após cada sincronização com o Firestore.
// =============================================================
window.atualizarVisual = function() {
    // Calcula quantos ml ainda faltam para bater a meta (mínimo 0)
    const restante = Math.max(window.metaDiaria - window.totalBebido, 0);

    // Porcentagem de água restante (entre 0.0 e 1.0)
    const porcentagem = Math.min(Math.max(restante / window.metaDiaria, 0), 1);

    // Altura e posição Y do retângulo de água no SVG
    const novaAltura = porcentagem * ALTURA_MAX_SVG;
    const novoY = POSICAO_BASE_Y - novaAltura;

    // Atualiza os atributos do retângulo SVG que representa a água
    if (elementoAgua) {
        elementoAgua.setAttribute('height', novaAltura);
        elementoAgua.setAttribute('y', novoY);
    }

    // Referências aos elementos de texto do rótulo interno da garrafa
    const txtIngerido  = document.getElementById('texto-ingerido');
    const txtMeta      = document.getElementById('texto-meta');
    const linhaFracao  = document.getElementById('linha-fracao');

    if (txtIngerido && txtMeta) {
        if (porcentagem <= 0) {
            // Meta batida: exibe mensagem de celebração e oculta a fração
            txtIngerido.textContent = 'Meta';
            txtMeta.textContent = 'Batida! 🎉';
            if (linhaFracao) linhaFracao.style.display = 'none';
        } else {
            // Meta em andamento: exibe "restante / meta" como fração
            txtIngerido.textContent = `${restante}ml`;
            txtMeta.textContent = `${window.metaDiaria}ml`;
            if (linhaFracao) linhaFracao.style.display = 'block';
        }
    }
};

// =============================================================
// EVENTO: BEBER ÁGUA
// Registra a quantidade informada no input.
// Se logado, incrementa o valor diretamente no Firestore via
// window.increment (operação atômica, evita conflitos).
// Se não logado, atualiza apenas o estado local.
// =============================================================
btnBeber.addEventListener('click', async () => {
    const valor = parseFloat(inputMl.value) || 0;
    const user = window.auth?.currentUser;

    if (valor > 0) {
        if (user) {
            // Modo online: incremento atômico no Firestore
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { totalBebido: window.increment(valor) });
        } else {
            // Modo offline: atualiza apenas a variável local
            window.totalBebido += valor;
            window.atualizarVisual();
        }
        inputMl.value = ''; // Limpa o campo após registrar
        fecharMenuCelular();
    }
});

// =============================================================
// EVENTO: ALTERAR META DIÁRIA
// Disparado quando o usuário muda o valor do campo de meta.
// Salva no Firestore se logado, ou apenas na variável local.
// =============================================================
if (inputMeta) {
    inputMeta.addEventListener('change', async () => {
        const novaMeta = parseFloat(inputMeta.value) || 2000;
        const user = window.auth?.currentUser;

        if (user && novaMeta > 0) {
            // Modo online: persiste a nova meta no Firestore
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { metaDiaria: novaMeta });
        } else {
            // Modo offline: aplica a meta apenas localmente
            window.metaDiaria = novaMeta;
            window.atualizarVisual();
        }
    });
}

// =============================================================
// EVENTO: ENCHER GARRAFA (ZERAR CONSUMO)
// Reseta o total bebido para 0, recomeçando o dia.
// Solicita confirmação antes de executar para evitar resets
// acidentais.
// =============================================================
btnZerar.addEventListener('click', async () => {
    const user = window.auth?.currentUser;

    if (confirm('Deseja encher a garrafa novamente?')) {
        if (user) {
            // Modo online: zera o campo totalBebido no Firestore
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, { totalBebido: 0 });
        } else {
            // Modo offline: zera apenas o estado local
            window.totalBebido = 0;
            window.atualizarVisual();
        }
        fecharMenuCelular();
    }
});

// =============================================================
// CONTROLE DO MENU DROPDOWN (100% via JavaScript)
// O CSS não controla abertura/fechamento — tudo passa por aqui.
// Isso evita conflitos com :focus-within e :hover no mobile.
// =============================================================
const dropbtn = document.querySelector('.dropbtn');
const menu    = document.querySelector('.dropdown-content');

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
// Fecha o menu, remove o foco do elemento ativo (fecha o teclado
// virtual em dispositivos móveis) e rola a tela de volta ao topo.
// =============================================================
function fecharMenuCelular() {
    menu.style.display = 'none';
    if (document.activeElement) document.activeElement.blur(); // Fecha o teclado mobile
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // Volta ao topo da tela
}

// =============================================================
// EVENTO: BOTÃO INVERTER CORES
// Alterna entre o tema claro e escuro adicionando/removendo a
// classe .alt-theme no body (CSS aplica filter: invert).
// A preferência é salva no localStorage e restaurada na próxima
// visita.
// =============================================================
const btnTema = document.getElementById('btn-tema');
if (btnTema) {
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('alt-theme');
        // Salva true se o tema escuro ficou ativo, false se voltou ao claro
        localStorage.setItem('temaEscuro', document.body.classList.contains('alt-theme'));
    });
}

// =============================================================
// EVENTO: CARREGAMENTO DA PÁGINA
// Restaura o tema salvo no localStorage ao abrir o site,
// garantindo que a preferência do usuário persista entre sessões.
// =============================================================
window.addEventListener('load', () => {
    if (localStorage.getItem('temaEscuro') === 'true') {
        document.body.classList.add('alt-theme');
    }
});