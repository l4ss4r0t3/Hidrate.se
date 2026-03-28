# 💧 Hidrate.se — Sua Garrafa de Água Digital

> Controle sua hidratação de forma simples, visual e inteligente — direto no navegador.

🔗 **Acesse:** https://hidrate.se

---

## 🚀 Sobre o Projeto

O **Hidrate.se** é uma aplicação web que transforma o acompanhamento de água em uma experiência visual interativa.

Em vez de números frios, você vê uma **garrafa digital que esvazia conforme você bebe água** — simples, intuitivo e motivador.

---

## ✨ Funcionalidades

* 🍼 **Garrafa interativa (SVG)**
  Representação visual em tempo real do consumo

* 🎯 **Meta diária personalizável**
  Defina quantos ml deseja beber por dia

* 🔐 **Login com Google (Firebase)**
  Sincronização em tempo real dos dados

* 🌐 **Modo offline**
  Funciona sem login usando `localStorage`

* 🔄 **Sincronização inteligente**
  Migração automática entre offline ↔ online

* 🎨 **Tema claro/escuro**
  Alternância com persistência local

* 📱 **Responsivo**
  Compatível com mobile e desktop

---

## 🧠 Como Funciona

A lógica principal da hidratação:

```js
porcentagem = (metaDiaria - totalBebido) / metaDiaria
```

* Garrafa cheia → você ainda precisa beber água
* Garrafa vazia → 🎉 **Meta batida!**

Atualização do SVG:

```js
elementoAgua.setAttribute('height', novaAltura);
elementoAgua.setAttribute('y', novoY);
```

---

## 🔥 Tecnologias

* HTML5
* CSS3
* JavaScript (Vanilla)
* Firebase Authentication
* Firestore

---

## 📂 Estrutura do Projeto

```
hidrate.se/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── images/
│   ├── pngs/
│   │   ├── covers/
│   │   │   └── cover_1024_500.png
│   │   ├── favicons/
│   │   │   ├── favicon_32.png
│   │   │   ├── favicon_64.png
│   │   │   ├── favicon_180.png
│   │   │   └── favicon_192.png
│   │   ├── icons/
│   │   │   └── icon_512.png
│   │   └── ogs/
│   │       └── og_1200_630.png
│   └── svgs/
│       ├── bottles/
│       │   ├── one.svg
│       │   └── two.svg
│       └── buttons/
│           └── burguer.svg
├── policies/
│   ├── deletion.html
│   ├── privacy.html
│   └── service.html
├── scripts/
│   ├── bottles.js
│   ├── buttons.js
│   ├── config.js
│   └── themes.js
├── styles/
│   ├── body.css
│   ├── bottles.css
│   ├── fonts.css
│   └── menus.css
├── index.html
├── LICENSE.txt
└── README.md
```

---

## 📱 Diferenciais

* Manipulação direta de SVG
* Arquitetura offline-first
* Sincronização em tempo real
* Integração com Android (WebView + Bridge)
* Código altamente documentado

---

## 🤝 Contribuição

Pull requests são bem-vindos!
Abra uma issue ou envie melhorias.

---

## 📄 Licença

MIT

---

## 👨‍💻 Autor

**Caio Silva (l4ss4r0t3)**