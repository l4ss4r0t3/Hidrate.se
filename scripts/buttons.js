// =============================================================
// 🎛️ BUTTONS.JS - CONTROLE DO MENU E INTERAÇÕES
// =============================================================
// Este arquivo gerencia:
// - Abertura/fechamento do menu dropdown principal
// - Submenus expansíveis (Temas, Políticas)
// - Persistência do campo "Água a Beber"
// - Fechamento automático do menu ao clicar fora
// =============================================================

// =============================================================
// 📋 REFERÊNCIAS AOS ELEMENTOS DO MENU
// =============================================================
const dropbtn = document.querySelector('.dropbtn');          // Botão hambúrguer
const menu    = document.querySelector('.dropdown-content'); // Conteúdo do menu

// =============================================================
// 🔘 CONTROLE DE ABERTURA/FECHAMENTO DO MENU
// 100% controlado via JavaScript (não usa :hover do CSS)
// Isso evita conflitos no mobile com :focus-within
// =============================================================

/**
 * Alterna visibilidade do menu ao clicar no botão hambúrguer
 * e.stopPropagation() impede que o clique propague para o document
 * (caso contrário, o menu fecharia imediatamente - bug crítico!)
 */
dropbtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const estaAberto = menu.style.display === 'block';
    menu.style.display = estaAberto ? 'none' : 'block';
});

/**
 * Fecha o menu ao clicar fora dele
 * Também fecha todos os submenus abertos
 */
document.addEventListener("click", (e) => {
    if (!e.target.closest('.dropdown')) {
        menu.style.display = 'none';

        // Fecha todos os submenus também
        document.querySelectorAll(".submenu-content").forEach(sm => {
            sm.classList.remove("show");
        });
    }
});

// =============================================================
// 📱 FUNÇÃO: FECHAR MENU NO CELULAR
// Utilizada após ações importantes (Beber, Encher)
// =============================================================
/**
 * Fecha o menu dropdown, remove o foco do elemento ativo
 * (fecha o teclado virtual em dispositivos móveis) e
 * rola a tela de volta ao topo suavemente
 */
function fecharMenuCelular() {
    menu.style.display = 'none';
    
    // Fecha o teclado mobile removendo o foco
    if (document.activeElement) {
        document.activeElement.blur();
    }
    
    // Volta ao topo da tela com animação suave
    window.scrollTo({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
    });
}

// =============================================================
// 💧 PERSISTÊNCIA DO CAMPO "ÁGUA A BEBER"
// Salva o valor digitado no localStorage para não perder ao recarregar
// =============================================================

/**
 * Configura o input de quantidade de água para persistir o valor
 * Carrega valor salvo ao iniciar e salva automaticamente ao digitar
 */
function setupMlInput() {
    const input = document.getElementById("ml-input");

    // Evita configurar múltiplas vezes
    if (!input) return;
    if (input.dataset.loaded) return;

    input.dataset.loaded = "true";

    // Carrega valor salvo anteriormente
    const valorSalvo = localStorage.getItem("ml-input");
    if (valorSalvo) {
        input.value = valorSalvo;
    }

    // Salva automaticamente sempre que o usuário digitar
    input.addEventListener("input", (e) => {
        localStorage.setItem("ml-input", e.target.value);
    });
}

// Executa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", setupMlInput);

// =============================================================
// 👁️ OBSERVADOR DE MUTAÇÕES NO DOM
// Garante que o input funcione mesmo se for adicionado dinamicamente
// =============================================================
const observer = new MutationObserver(() => {
    if (document.getElementById("ml-input")) {
        setupMlInput();
    }
});

observer.observe(document.body, {
    childList: true,  // Observa adição/remoção de elementos
    subtree: true     // Observa toda a árvore de elementos
});

// =============================================================
// 📂 CONTROLE DOS SUBMENUS EXPANSÍVEIS
// Gerencia os menus "Temas" e "Políticas" que se expandem lateralmente
// =============================================================

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".submenu-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Impede que clique feche o menu principal

            const submenuAtual = btn.nextElementSibling;

            // Fecha outros submenus antes de abrir o atual
            document.querySelectorAll(".submenu-content").forEach((submenu) => {
                if (submenu !== submenuAtual) {
                    submenu.classList.remove("show");
                }
            });

            // Alterna visibilidade do submenu atual
            submenuAtual.classList.toggle("show");

            // =============================================================
            // 📐 CÁLCULO DINÂMICO DE POSIÇÃO DO SUBMENU
            // Decide se o submenu deve abrir para cima ou para baixo
            // dependendo do espaço disponível na tela
            // =============================================================
            requestAnimationFrame(() => {
                const rect = submenuAtual.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.top;  // Espaço abaixo
                const spaceAbove = rect.top;                       // Espaço acima

                // Limpa posições antigas
                submenuAtual.style.top = "";
                submenuAtual.style.bottom = "";

                // Decide direção com base no espaço disponível
                if (spaceBelow < rect.height && spaceAbove > rect.height) {
                    // Abre para cima se não houver espaço embaixo
                    submenuAtual.style.top = "auto";
                    submenuAtual.style.bottom = "0";
                } else {
                    // Abre para baixo (padrão)
                    submenuAtual.style.top = "0";
                    submenuAtual.style.bottom = "auto";
                }
            });
        });
    });
});