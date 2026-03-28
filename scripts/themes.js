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