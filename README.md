# 💧 Hidrate.se

> **Sua garrafa de água digital para controle de hidratação.**

[![Acesse o Projeto](https://img.shields.io/badge/Acessar_Projeto-Live_Demo-blue?style=for-the-badge&logo=google-chrome&logoColor=white)](https://hcontrol.rf.gd/)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

O **Hidrate.se** é um web app minimalista e intuitivo projetado para auxiliar no monitoramento do consumo diário de água. Através de uma interface interativa com uma garrafa digital em SVG, o usuário visualiza seu progresso em tempo real e recebe feedback dinâmico sobre sua meta.

---

## ✨ Diferenciais Técnicos

* **Persistência de Dados:** Integração com `Window.localStorage` para manter o progresso e as configurações do usuário mesmo após o fechamento do navegador.
* **Design Responsivo & Adaptativo:** Layout otimizado para Desktop e Mobile, incluindo suporte específico para o modo **Landscape** (paisagem) com rotação inteligente de elementos e textos.
* **Acessibilidade (A11y):** Uso de tags semânticas HTML5, `aria-labels` e classes `sr-only` para garantir que leitores de tela interpretem corretamente a interface.
* **UX Refinada:** Atalhos de teclado (tecla Enter), tratamento de foco para fechamento automático de teclado mobile e transições suaves de tema via filtros CSS.

---

## 🚀 Funcionalidades

- [x] **Meta Personalizada:** Defina sua meta diária em ml e o sistema ajustará a escala visual da garrafa.
- [x] **Garrafa Interativa:** Visualização dinâmica do nível da água processada via manipulação de atributos SVG (`height` e `y`).
- [x] **Cálculo Automático:** Monitoramento do volume restante com alertas visuais de "Meta Batida".
- [x] **Troca de Tema:** Sistema de "Dark Mode" inteligente que preserva a legibilidade e as cores do menu.
- [x] **Reset de Progresso:** Função para esvaziar a garrafa com caixa de diálogo para confirmação de segurança.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica e Metatags para SEO e Social Preview.
* **CSS3:** Flexbox, Media Queries (Orientation) e Filtros Dinâmicos.
* **JavaScript (ES6+):** Manipulação de DOM, Event Listeners e LocalStorage API.
* **SVG:** Gráficos vetoriais integrados para representação da garrafa digital.

---

## 💻 Como Usar

1.  **Configuração:** Clique no ícone de menu (superior direito) e defina sua **Meta Diária** (ex: 2000ml).
2.  **Registro:** Digite a quantidade consumida no campo **Água Ingerida**.
3.  **Ação:** Clique em **BEBER** ou pressione **Enter** para atualizar a garrafa.
4.  **Manutenção:** Use o botão **ESVAZIAR** para resetar o contador e iniciar um novo ciclo.
5.  **Personalização:** Alterne o tema clicando em **Mudar Tema** conforme sua preferência visual.

---

## 📄 Licença

Este projeto está sob a licença MIT. 

---
Desenvolvido com 💙 por [l4ss4r0t3](https://github.com/l4ss4r0t3)