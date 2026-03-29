// =============================================================
// 🎨 THEMES.JS - GERENCIAMENTO DE TEMAS E PERSONALIZAÇÃO
// =============================================================
// Este arquivo controla:
// - Carregamento do tema salvo (claro/escuro)
// - Aplicação de imagem de fundo personalizada
// - Persistência das preferências visuais no localStorage
// =============================================================

// =============================================================
// 🚀 CARREGAMENTO DA IMAGEM DE FUNDO SALVA
// Restaura a imagem de fundo ao abrir a página
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem('temaEscuro') === 'true') {
    document.body.classList.add('alt-theme');
  }

  const urlSalva = localStorage.getItem("bg-url");

  if (urlSalva) {
    document.body.style.backgroundImage = `url("${urlSalva}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  }
});

// =============================================================
// 💡 NOTA SOBRE O BOTÃO "INVERTER CORES"
// O botão de tema é gerenciado pelo buttons.js, não aqui.
// Este arquivo apenas restaura a preferência salva.
// =============================================================