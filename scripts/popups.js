// =============================================================
// 💬 POPUPS.JS - GERENCIAMENTO DO POPUP DE INTRODUÇÃO
// =============================================================
// Este arquivo controla:
// - Abertura e fechamento do popup de boas-vindas
// - Exibição automática na primeira visita
// - Persistência da visualização no localStorage
// =============================================================

// =============================================================
// 🔓 FUNÇÃO: ABRIR POPUP
// Exibe o modal de introdução e fecha o menu principal
// =============================================================
/**
 * Abre o popup de introdução
 * Também fecha o menu dropdown se estiver aberto
 */
function abrir() {
  const menu = document.querySelector('.dropdown-content');
  
  // Fecha o menu principal antes de abrir o popup
  if (menu) {
    menu.style.display = 'none';
  }

  // Adiciona classe 'show' que torna o popup visível
  document.getElementById("meu-popup").classList.add("show");
}

// =============================================================
// 🔒 FUNÇÃO: FECHAR POPUP
// Remove o popup da tela
// =============================================================
/**
 * Fecha o popup de introdução
 * Remove a classe 'show' que controla a visibilidade
 */
function fechar() {
  document.getElementById("meu-popup").classList.remove("show");
}

// =============================================================
// 🎯 PREVENIR FECHAMENTO AO CLICAR DENTRO DO CONTEÚDO
// Garante que apenas cliques no fundo escuro fechem o popup
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("meu-popup");
  const conteudo = popup.querySelector(".conteudo");

  // Impede que cliques dentro do conteúdo fechem o popup
  conteudo.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Qualquer clique no fundo escuro fecha o popup
  popup.addEventListener("click", () => {
    fechar();
  });
});

// =============================================================
// 🚀 EXIBIÇÃO AUTOMÁTICA NA PRIMEIRA VISITA
// Mostra o popup apenas uma vez usando localStorage
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("meu-popup");
  const jaViu = localStorage.getItem("intro-vista");

  // Se o usuário nunca viu a introdução, mostra automaticamente
  if (!jaViu && popup) {
    abrir();
    
    // Marca como "já visto" para não exibir novamente
    localStorage.setItem("intro-vista", "true");
  }
});