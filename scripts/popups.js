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
  configurarPopup("perfil", ".conteudo-perfil");

  const popup = document.getElementById("meu-popup");
  const jaViu = localStorage.getItem("intro-vista");

  if (!jaViu && popup) {
    abrirPopup("meu-popup");
    localStorage.setItem("intro-vista", "true");
  }
});

// =============================================================
// 🧮 CALCULADORA → APLICAR META
// Integra com window.metaDiaria (Firebase + localStorage)
// =============================================================

const calcularBtn = document.getElementById("calcular-btn");
const aplicarBtn = document.getElementById("aplicar-meta-btn");
const resultadoCalculo = document.getElementById("resultado-calculo");

let metaCalculada = null;

// =============================
// CALCULAR
// =============================
if (calcularBtn) {
    calcularBtn.addEventListener("click", () => {
        const pesoInput = document.getElementById("peso-input");
        const peso = parseFloat(pesoInput.value);

        if (isNaN(peso)) {
            resultadoCalculo.textContent = "Por favor, insira um peso válido.";
            metaCalculada = null;
            return;
        }

        metaCalculada = Math.round(peso * 35);

        resultadoCalculo.innerHTML =
            `Meta sugerida: <strong>${metaCalculada} ml</strong>`;
    });
}

// =============================
// APLICAR META
// =============================
if (aplicarBtn) {
    aplicarBtn.addEventListener("click", async () => {

        if (!metaCalculada) {
            resultadoCalculo.textContent = "Calcule primeiro!";
            return;
        }

        const user = window.auth?.currentUser;

        if (user) {
            // ✅ ONLINE (Firebase)
            const userRef = window.doc(window.db, "usuarios", user.uid);
            await window.updateDoc(userRef, {
                metaDiaria: metaCalculada
            });
        } else {
            // 💾 OFFLINE (localStorage)
            window.metaDiaria = metaCalculada;
            salvarNoLocalStorage();
            window.atualizarVisual();
        }

        // Feedback
        resultadoCalculo.innerHTML =
            `✅ Meta aplicada: <strong>${metaCalculada} ml</strong>`;
    });
}