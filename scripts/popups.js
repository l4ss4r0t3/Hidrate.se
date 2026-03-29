function abrirPopup(id) {
  const menu = document.querySelector('.dropdown-content');

  if (menu) {
    menu.style.display = 'none';
  }

  const popup = document.getElementById(id);
  if (popup) {
    popup.classList.add("show");
  }
}

function fecharPopup(id) {
  const popup = document.getElementById(id);
  if (popup) {
    popup.classList.remove("show");
  }
}

function configurarPopup(id, conteudoClasse) {
  const popup = document.getElementById(id);
  if (!popup) return;

  const conteudo = popup.querySelector(conteudoClasse);
  if (!conteudo) return;

  conteudo.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  popup.addEventListener("click", () => {
    fecharPopup(id);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarPopup("meu-popup", ".conteudo");
  configurarPopup("meu-popup2", ".conteudo2");

  const popup = document.getElementById("meu-popup");
  const jaViu = localStorage.getItem("intro-vista");

  if (!jaViu && popup) {
    abrirPopup("meu-popup");
    localStorage.setItem("intro-vista", "true");
  }
});

const calcularBtn = document.getElementById("calcular-btn");
const resultadoCalculo = document.getElementById("resultado-calculo");

calcularBtn.addEventListener("click", () => {
  const pesoInput = document.getElementById("peso-input");
  const peso = parseFloat(pesoInput.value);

  if (isNaN(peso)) {
    resultadoCalculo.textContent = "Por favor, insira um peso válido.";
    return;
  }

  const metaDiaria = peso * 35; // 35ml por kg
  resultadoCalculo.textContent = `Sua meta diária de hidratação (teórica) é de: ${metaDiaria.toFixed(0)} ml.`;
});