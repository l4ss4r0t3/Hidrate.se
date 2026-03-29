// =============================================================
// 🎨 THEMES.JS - GERENCIAMENTO DE TEMAS E PERSONALIZAÇÃO
// =============================================================
// Este arquivo controla:
// - Carregamento do tema salvo (claro/escuro)
// - Aplicação de imagem de fundo personalizada
// - Persistência das preferências visuais no localStorage
// =============================================================

// =============================================================
// 🌓 RESTAURAÇÃO DO TEMA AO CARREGAR A PÁGINA
// Aplica o tema escuro se o usuário havia selecionado anteriormente
// =============================================================
/**
 * Verifica se o tema escuro estava ativo e o restaura
 * Executado ao carregar a página
 */
window.addEventListener('load', () => {
    if (localStorage.getItem('temaEscuro') === 'true') {
        document.body.classList.add('alt-theme');
    }
});

// =============================================================
// 🖼️ APLICAÇÃO DE IMAGEM DE FUNDO PERSONALIZADA
// Permite ao usuário definir uma imagem de fundo via URL
// =============================================================
/**
 * Aplica uma imagem de fundo a partir da URL fornecida
 * Valida se a imagem carrega antes de aplicar
 * 
 * NOTA: Esta função existe mas não é usada atualmente.
 * O input de background agora atualiza em tempo real (ver listener abaixo)
 */
function aplicarBackground() {
  const url = document.getElementById("bg-input").value.trim();

  // Cria um objeto Image para validar a URL
  const img = new Image();
  img.src = url;

  // Se a imagem carregar com sucesso, aplica como fundo
  img.onload = () => {
    document.body.style.backgroundImage = `url("${url}")`;
    localStorage.setItem("bg-url", url);
  };

  // Se a imagem falhar ao carregar, mostra alerta
  img.onerror = () => {
    alert("Imagem inválida 😢");
  };
}

// =============================================================
// 🚀 CARREGAMENTO DA IMAGEM DE FUNDO SALVA
// Restaura a imagem de fundo ao abrir a página
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  const urlSalva = localStorage.getItem("bg-url");

  if (urlSalva) {
    // Aplica a imagem salva com configurações de exibição
    document.body.style.backgroundImage = `url("${urlSalva}")`;
    document.body.style.backgroundSize = "cover";      // Cobre toda a área
    document.body.style.backgroundPosition = "center"; // Centraliza a imagem
  }
});

// =============================================================
// ⚡ ATUALIZAÇÃO EM TEMPO REAL DA IMAGEM DE FUNDO
// Aplica a imagem automaticamente conforme o usuário digita
// =============================================================
const input = document.getElementById("bg-input");

/**
 * Monitora mudanças no input de URL da imagem
 * Aplica e salva automaticamente a cada alteração
 */
input.addEventListener("input", (e) => {
  const url = e.target.value;

  // Aplica a imagem imediatamente (mesmo que seja inválida)
  document.body.style.backgroundImage = `url("${url}")`;
  
  // Salva no localStorage para persistir entre sessões
  localStorage.setItem("bg-url", url);
});

// =============================================================
// 💡 NOTA SOBRE O BOTÃO "INVERTER CORES"
// O botão de tema é gerenciado pelo buttons.js, não aqui.
// Este arquivo apenas restaura a preferência salva.
// =============================================================