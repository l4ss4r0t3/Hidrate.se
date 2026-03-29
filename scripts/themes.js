const btnTema = document.getElementById("btn-tema");

if (btnTema) {
    btnTema.addEventListener("click", () => {
        const estaAtivo = document.body.classList.toggle("alt-theme");

        localStorage.setItem("temaEscuro", estaAtivo);
    });
}

const btnBg = document.getElementById("btn-bg");
const inputBg = document.getElementById("bg-input");

if (btnBg) {
    btnBg.addEventListener("click", () => {
        const url = inputBg ? inputBg.value : "";

        const temImagem = document.body.style.backgroundImage && document.body.style.backgroundImage !== "none";

        if (temImagem) {
            // REMOVE o fundo
            document.body.style.backgroundImage = "none";
            localStorage.removeItem("bg-url");
            btnBg.textContent = "Aplicar Fundo";
        } else if (url) {
            // APLICA o fundo
            document.body.style.backgroundImage = `url("${url}")`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";

            localStorage.setItem("bg-url", url);
            btnBg.textContent = "Remover Fundo";
        }
    });
}

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

document.addEventListener("DOMContentLoaded", () => {
    const obj = document.getElementById("svg-garrafa");
    const btn = document.getElementById("btn-btl");

    if (!obj || !btn) return;

    // 🔥 Recupera SVG salvo
    let usandoSVG2 = localStorage.getItem("svg-garrafa") === "two";

    // Aplica o SVG salvo ao carregar
    obj.setAttribute(
        "data",
        usandoSVG2
            ? "./images/svgs/bottles/two.svg"
            : "./images/svgs/bottles/one.svg"
    );

    btn.addEventListener("click", () => {
        usandoSVG2 = !usandoSVG2;

        const novoSvg = usandoSVG2
            ? "./images/svgs/bottles/two.svg"
            : "./images/svgs/bottles/one.svg";

        // 🔥 troca direta (sem apagar antes)
        obj.setAttribute("data", novoSvg);

        // 💾 salva no localStorage
        localStorage.setItem("svg-garrafa", usandoSVG2 ? "two" : "one");
    });

    obj.addEventListener("load", () => {
        console.log("SVG carregado!");
    });
});