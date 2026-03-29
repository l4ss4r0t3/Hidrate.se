function abrir() {
  const menu = document.querySelector('.dropdown-content');
  if (menu) menu.style.display = 'none';

  document.getElementById("meu-popup").classList.add("show");
}

function fechar() {
  document.getElementById("meu-popup").classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("meu-popup");
  const conteudo = popup.querySelector(".conteudo");

  // impede clique dentro de fechar
  conteudo.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // qualquer clique no fundo fecha
  popup.addEventListener("click", () => {
    fechar();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("meu-popup");
  const jaViu = localStorage.getItem("intro-vista");

  if (!jaViu && popup) {
    abrir();
    localStorage.setItem("intro-vista", "true");
  }
});