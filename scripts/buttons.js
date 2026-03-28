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