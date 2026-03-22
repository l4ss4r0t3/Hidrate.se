// =============================================================
// CONSTANTES DO SVG
// Define os limites da garrafa desenhada no SVG.
// =============================================================
const ALTURA_MAX_SVG = 24; // interior: y=7 até y=31
const POSICAO_BASE_Y = 31; // base interna da garrafa

// =============================================================
// REFERÊNCIAS AOS ELEMENTOS DO HTML
// Captura os elementos da página para manipulá-los via JS.
// =============================================================
const inputMl = document.getElementById('ml-input');        // Campo de quantidade ingerida
const inputMeta = document.getElementById('meta-input');    // Campo da meta diária
const btnBeber = document.getElementById('btn-beber');      // Botão "Beber"
const btnZerar = document.getElementById('btn-zerar');      // Botão "Esvaziar"
const elementoAgua = document.getElementById('agua-nivel'); // Retângulo SVG que representa a água

// =============================================================
// CARREGAMENTO DO ESTADO SALVO
// Recupera os dados do localStorage ao abrir a página.
// Se não houver dados salvos, usa valores padrão.
// =============================================================
let totalIngerido = parseFloat(localStorage.getItem('aguaConsumida')) || 0;
let metaDiaria = parseFloat(localStorage.getItem('metaSalva')) || 2000; // Padrão 2000ml evita divisão por zero

// Preenche o campo de meta com o valor salvo (ou padrão)
if (inputMeta) inputMeta.value = metaDiaria;

// Atualiza a garrafa com os dados carregados
atualizarVisual();

// =============================================================
// EVENTO: CAMPO DE META DIÁRIA
// Atualiza a meta e redesenha a garrafa sempre que o usuário
// digitar um novo valor no campo de meta.
// =============================================================
if (inputMeta) {
    inputMeta.addEventListener('input', () => {
        // Se o campo estiver vazio, usa 2000 como fallback temporário
        const novaMeta = parseFloat(inputMeta.value) || 2000;
        if (novaMeta > 0) {
            metaDiaria = novaMeta;
            localStorage.setItem('metaSalva', metaDiaria); // Persiste a meta no navegador
            atualizarVisual();
        }
    });
}

// =============================================================
// EVENTO: BOTÃO BEBER
// Soma a quantidade digitada ao total consumido,
// salva no localStorage e atualiza a garrafa.
// =============================================================
btnBeber.addEventListener('click', () => {
    const valor = parseFloat(inputMl.value) || 0;
    if (valor > 0) {
        totalIngerido += valor;
        localStorage.setItem('aguaConsumida', totalIngerido); // Persiste o progresso
        inputMl.value = '';   // Limpa o campo após registrar
        atualizarVisual();
        fecharMenuCelular();  // Fecha o menu e o teclado no mobile
    }
});

// =============================================================
// EVENTO: TECLA ENTER NO CAMPO DE ML
// Permite registrar a água pressionando Enter,
// sem precisar clicar no botão.
// =============================================================
inputMl.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita recarregar a página
        btnBeber.click();       // Reutiliza a lógica do botão Beber
    }
});

// =============================================================
// EVENTO: BOTÃO ESVAZIAR
// Pede confirmação antes de zerar o progresso do dia.
// =============================================================
btnZerar.addEventListener('click', () => {
    if (confirm('Deseja mesmo esvaziar sua garrafa?')) {
        totalIngerido = 0;
        localStorage.setItem('aguaConsumida', 0); // Zera o valor salvo
        atualizarVisual();
        fecharMenuCelular();
    }
});

// =============================================================
// FUNÇÃO: ATUALIZAR VISUAL DA GARRAFA
// Recalcula o nível da água e atualiza os elementos SVG:
// - altura e posição Y do retângulo de água
// - rótulo no formato de fração dentro do rótulo branco da garrafa:
//     texto-ingerido → numerador (ex: 1500ml)
//     linha-fracao   → linha separadora (elemento <line> no SVG)
//     texto-meta     → denominador (ex: 2000ml)
// - quando a meta é batida, exibe "Meta" / "Batida! 🎉" e esconde a linha
// =============================================================
function atualizarVisual() {
    const porcentagem = Math.min(Math.max(totalIngerido / metaDiaria, 0), 1); // Entre 0 e 1

    // Calcula a nova altura e posição Y do retângulo SVG da água
    const novaAltura = porcentagem * ALTURA_MAX_SVG;
    const novoY = POSICAO_BASE_Y - novaAltura; // A água sobe de baixo para cima

    elementoAgua.setAttribute('height', novaAltura);
    elementoAgua.setAttribute('y', novoY);

    // Atualiza o rótulo em formato de fração no interior da garrafa
    const txtIngerido = document.getElementById('texto-ingerido'); // Numerador
    const txtMeta = document.getElementById('texto-meta');         // Denominador
    const linhaFracao = document.getElementById('linha-fracao');   // Linha separadora

    if (txtIngerido && txtMeta) {
        if (porcentagem >= 1) {
            // Meta atingida: exibe mensagem e esconde a linha
            txtIngerido.textContent = 'Meta';
            txtMeta.textContent = 'Batida! 🎉';
            if (linhaFracao) linhaFracao.style.display = 'none';
        } else {
            // Exibe fração: total ingerido sobre a meta diária
            txtIngerido.textContent = `${totalIngerido}ml`;
            txtMeta.textContent = `${metaDiaria}ml`;
            if (linhaFracao) linhaFracao.style.display = 'block';
        }
    }
}

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
// EVENTO: BOTÃO DE TEMA
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
