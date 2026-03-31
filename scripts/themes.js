document.addEventListener("DOMContentLoaded", () => {

  // =============================
  // 🌙 TEMA
  // =============================
  const btnTema = document.getElementById("btn-tema");

  if (btnTema) {
    btnTema.addEventListener("click", () => {
      const ativo = document.body.classList.toggle("alt-theme");
      localStorage.setItem("temaEscuro", ativo);
    });
  }

  if (localStorage.getItem("temaEscuro") === "true") {
    document.body.classList.add("alt-theme");
  }

  // =============================
  // 🖼️ FUNDO (ARQUIVO)
  // =============================
  const btnBg = document.getElementById("btn-bg");
  const fileInput = document.getElementById("bg-file");

  function aplicarFundo(src) {
    document.body.style.backgroundImage = `url("${src}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  }

  const bgSalvo = localStorage.getItem("bg-image");

  if (bgSalvo) {
    aplicarFundo(bgSalvo);
    if (btnBg) btnBg.textContent = "Remover Fundo";
  }

  if (btnBg && fileInput) {
    btnBg.addEventListener("click", () => {

      const bgAtual = getComputedStyle(document.body).backgroundImage;
      const temImagem = bgAtual !== "none";
      const file = fileInput.files[0];

      // ✅ APLICA
      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          aplicarFundo(e.target.result);
          localStorage.setItem("bg-image", e.target.result);
          btnBg.textContent = "Remover Fundo";
        };

        reader.readAsDataURL(file);
        return;
      }

      // ❌ REMOVE
      if (temImagem) {
        document.body.style.backgroundImage = "none";
        localStorage.removeItem("bg-image");
        btnBg.textContent = "Aplicar Fundo";
      }
    });

    // auto aplicar
    fileInput.addEventListener("change", () => {
      btnBg.click();
    });
  }

  // =============================
  // 🧴 SVG GARRAFA
  // =============================
  const obj = document.getElementById("svg-garrafa");
  const btnBtl = document.getElementById("btn-btl");

  if (obj && btnBtl) {
    let svgAtual = localStorage.getItem("svg-garrafa") || "one";

    function atualizarSVG() {
      const mapa = {
        one:   "./images/svgs/bottles/one.svg",
        two:   "./images/svgs/bottles/two.svg",
        three: "./images/svgs/bottles/three.svg",
      };
      obj.setAttribute("data", mapa[svgAtual]);
    }

    atualizarSVG();

    btnBtl.addEventListener("click", () => {
      if (svgAtual === "one")       svgAtual = "two";
      else if (svgAtual === "two")  svgAtual = "three";
      else                          svgAtual = "one";

      atualizarSVG();
      localStorage.setItem("svg-garrafa", svgAtual);
    });
  }

});