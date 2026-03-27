// =============================================================
// ESTADO GLOBAL
// =============================================================
window.totalBebido = 0;
window.metaDiaria = 2000;

// =============================================================
// DOM
// =============================================================
const inputMl   = document.getElementById('ml-input');
const inputMeta = document.getElementById('meta-input');
const btnBeber  = document.getElementById('btn-beber');
const btnZerar  = document.getElementById('btn-zerar');
const elementoAgua = document.getElementById('agua-nivel');

// =============================================================
const ALTURA_MAX_SVG = 24;
const POSICAO_BASE_Y = 31;

// =============================================================
// ATUALIZAR VISUAL (CORRIGIDO)
// =============================================================
window.atualizarVisual = function() {

    const meta = Math.max(window.metaDiaria, 1); // 🔥 evita divisão por zero

    const restante = Math.max(meta - window.totalBebido, 0);
    const porcentagem = Math.min(Math.max(restante / meta, 0), 1);

    const novaAltura = porcentagem * ALTURA_MAX_SVG;
    const novoY = POSICAO_BASE_Y - novaAltura;

    if (elementoAgua) {
        elementoAgua.setAttribute('height', novaAltura);
        elementoAgua.setAttribute('y', novoY);
    }

    const txtIngerido  = document.getElementById('texto-ingerido');
    const txtMeta      = document.getElementById('texto-meta');
    const linhaFracao  = document.getElementById('linha-fracao');

    if (txtIngerido && txtMeta) {

        if (porcentagem <= 0) {
            txtIngerido.textContent = '✔';
            txtMeta.textContent = 'Meta Batida!';
            if (linhaFracao) linhaFracao.style.display = 'none';

        } else {
            txtIngerido.textContent = `${restante}ml`;
            txtMeta.textContent = `${meta}ml`;
            if (linhaFracao) linhaFracao.style.display = 'block';
        }
    }
};

// =============================================================
// BEBER ÁGUA (COM UX + VALIDAÇÃO)
// =============================================================
btnBeber.addEventListener('click', async () => {

    const valor = Math.max(parseFloat(inputMl.value) || 0, 0);
    if (valor <= 0) return;

    const user = window.auth?.currentUser;

    btnBeber.disabled = true;
    btnBeber.textContent = 'Registrando...';

    try {
        if (user) {
            const userRef = window.doc(window.db, "usuarios", user.uid);

            await window.updateDoc(userRef, {
                totalBebido: window.increment(valor)
            });

        } else {
            window.totalBebido += valor;
            window.atualizarVisual();
        }

        inputMl.value = '';
        fecharMenuCelular();

    } catch (e) {
        console.error("Erro ao salvar:", e);
        alert("Erro ao salvar. Tente novamente.");
    } finally {
        btnBeber.disabled = false;
        btnBeber.textContent = 'Beber Água';
    }
});

// =============================================================
// ALTERAR META (CORRIGIDO)
// =============================================================
if (inputMeta) {
    inputMeta.addEventListener('change', async () => {

        const novaMeta = Math.max(parseFloat(inputMeta.value) || 2000, 1);
        const user = window.auth?.currentUser;

        if (user) {
            try {
                const userRef = window.doc(window.db, "usuarios", user.uid);

                await window.updateDoc(userRef, {
                    metaDiaria: novaMeta
                });

            } catch (e) {
                console.error("Erro ao salvar meta:", e);
            }

        } else {
            window.metaDiaria = novaMeta;
            window.atualizarVisual();
        }
    });
}

// =============================================================
// ZERAR
// =============================================================
btnZerar.addEventListener('click', async () => {

    const user = window.auth?.currentUser;

    if (confirm('Deseja encher a garrafa novamente?')) {

        if (user) {
            try {
                const userRef = window.doc(window.db, "usuarios", user.uid);

                await window.updateDoc(userRef, {
                    totalBebido: 0
                });

            } catch (e) {
                console.error("Erro ao zerar:", e);
            }

        } else {
            window.totalBebido = 0;
            window.atualizarVisual();
        }

        fecharMenuCelular();
    }
});

// =============================================================
// MENU (PROTEGIDO)
// =============================================================
const dropbtn = document.querySelector('.dropbtn');
const menu    = document.querySelector('.dropdown-content');

if (dropbtn && menu) {

    dropbtn.addEventListener('click', (e) => {
        e.stopPropagation();

        const estaAberto = menu.style.display === 'block';
        menu.style.display = estaAberto ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            menu.style.display = 'none';
        }
    });
}

// =============================================================
function fecharMenuCelular() {
    if (!menu) return;

    menu.style.display = 'none';

    if (document.activeElement) {
        document.activeElement.blur();
    }

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

// =============================================================
// TEMA
// =============================================================
const btnTema = document.getElementById('btn-tema');

if (btnTema) {
    btnTema.addEventListener('click', () => {

        document.body.classList.toggle('alt-theme');

        localStorage.setItem(
            'temaEscuro',
            document.body.classList.contains('alt-theme')
        );
    });
}

// =============================================================
// LOAD
// =============================================================
window.addEventListener('load', () => {

    if (localStorage.getItem('temaEscuro') === 'true') {
        document.body.classList.add('alt-theme');
    }
});