const GENERO_EMOJI = {
  fantasia: "",
  romance: "",
  ficcao: "",
  terror: "",
  aventura: "",
  historia: "",
  autoajuda: "",
  poesia: "",
};
const GENERO_NOME = {
  fantasia: "fantasia",
  romance: "romance",
  ficcao: "ficção científica",
  terror: "terror",
  aventura: "aventura",
  historia: "história",
  autoajuda: "autoajuda",
  poesia: "poesia",
};
const LS_KEY = "bookshelf_v2";

// toast
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

// REQUISITO 5: atualizar contadores com textContent
function atualizar() {
  const cards = document.querySelectorAll(".book-card");
  const total = cards.length;
  const rep = document.querySelectorAll('.book-card[data-rep="true"]').length;
  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-rep").textContent = rep;
  document.getElementById("stat-unicos").textContent = total - rep;
  document.getElementById("stat-troca").textContent = document.querySelectorAll(
    ".book-card.is-troca",
  ).length;
  document.getElementById("stat-favs").textContent =
    document.querySelectorAll(".book-card.is-fav").length;
  document.getElementById("empty").style.display =
    total === 0 ? "block" : "none";
  document.getElementById("grid").style.display = total === 0 ? "none" : "grid";
}

// salvar no localStorage
function salvar() {
  const lista = [];
  document.querySelectorAll(".book-card").forEach((c) => {
    lista.push({
      titulo: c.dataset.titulo,
      autor: c.dataset.autor,
      genero: c.dataset.genero,
      raridade: c.dataset.raridade,
      capa: c.dataset.capa,
      rep: c.dataset.rep === "true",
      isFav: c.classList.contains("is-fav"),
      isTroca: c.classList.contains("is-troca"),
    });
  });
  localStorage.setItem(LS_KEY, JSON.stringify(lista));
}

function adicionarBadge(badges, cls, txt) {
  if (!badges.querySelector("." + cls)) {
    const b = document.createElement("span");
    b.className = "mini-badge " + cls;
    b.textContent = txt;
    badges.appendChild(b);
  }
}

// REQUISITO 2: criar card com document.createElement e appendChild
function criarCard(d) {
  const card = document.createElement("div");
  card.className = "book-card";
  card.dataset.titulo = d.titulo;
  card.dataset.autor = d.autor || "";
  card.dataset.genero = d.genero;
  card.dataset.raridade = d.raridade;
  card.dataset.capa = d.capa || "";
  card.dataset.rep = d.rep;

  // capa
  const cover = document.createElement("div");
  cover.className = "cover";
  if (d.capa) {
    const img = document.createElement("img");
    img.src = d.capa;
    img.alt = d.titulo;
    img.onerror = () => {
      img.remove();
      cover.appendChild(gt);
    };
    cover.appendChild(img);
  } else {
  }
  const gt = document.createElement("span");
  gt.className = "genre-tag";
  gt.textContent = GENERO_NOME[d.genero] || d.genero;
  cover.appendChild(gt);
  card.appendChild(cover);

  // corpo
  const body = document.createElement("div");
  body.className = "card-body";

  const tit = document.createElement("div");
  tit.className = "card-title";
  tit.textContent = d.titulo;
  body.appendChild(tit);

  const aut = document.createElement("div");
  aut.className = "card-autor";
  aut.textContent = d.autor || "autor desconhecido";
  body.appendChild(aut);

  const stars = document.createElement("div");
  stars.className = "stars";
  for (let i = 1; i <= 5; i++) {
    const s = document.createElement("span");
    s.textContent = "★";
    if (i <= Number(d.raridade)) s.className = "on";
    stars.appendChild(s);
  }
  body.appendChild(stars);

  const badges = document.createElement("div");
  badges.className = "mini-badges";
  if (d.rep) adicionarBadge(badges, "mb-rep", "repetido");
  if (d.isFav) adicionarBadge(badges, "mb-fav", "fav");
  if (d.isTroca) adicionarBadge(badges, "mb-troca", "troca");
  body.appendChild(badges);
  card.appendChild(body);

  // REQUISITO 4: botões com toggle de classe CSS
  const btns = document.createElement("div");
  btns.className = "card-btns";

  const bFav = document.createElement("button");
  bFav.className = "btn-fav";
  bFav.title = "favoritar";
  bFav.textContent = d.isFav ? "♥" : "♡";
  if (d.isFav) {
    card.classList.add("is-fav");
    bFav.classList.add("ativo");
  }
  bFav.addEventListener("click", () => {
    card.classList.toggle("is-fav");
    bFav.classList.toggle("ativo");
    const bx = badges.querySelector(".mb-fav");
    if (card.classList.contains("is-fav")) {
      bFav.textContent = "♥";
      adicionarBadge(badges, "mb-fav", "fav");
      toast("favoritado!");
    } else {
      bFav.textContent = "♡";
      if (bx) bx.remove();
      toast("removido dos favs");
    }
    salvar();
    atualizar();
  });

  const bTroca = document.createElement("button");
  bTroca.className = "btn-troca";
  bTroca.title = "para troca";
  bTroca.textContent = "⇄";
  if (d.isTroca) {
    card.classList.add("is-troca");
    bTroca.classList.add("ativo");
  }
  bTroca.addEventListener("click", () => {
    card.classList.toggle("is-troca");
    bTroca.classList.toggle("ativo");
    const bx = badges.querySelector(".mb-troca");
    if (card.classList.contains("is-troca")) {
      adicionarBadge(badges, "mb-troca", "troca");
      toast("marcado pra troca!");
    } else {
      if (bx) bx.remove();
      toast("removido da troca");
    }
    salvar();
    atualizar();
  });

  // REQUISITO 3: deletar com .remove()
  const bDel = document.createElement("button");
  bDel.title = "excluir";
  bDel.textContent = "x";
  bDel.addEventListener("click", () => {
    card.remove();
    salvar();
    atualizar();
    toast("livro removido!");
  });

  btns.appendChild(bFav);
  btns.appendChild(bTroca);
  btns.appendChild(bDel);
  card.appendChild(btns);

  return card;
}

// REQUISITO 1: ler dados do DOM ao clicar
document.getElementById("btn-add").addEventListener("click", () => {
  const titulo = document.getElementById("inp-titulo").value.trim();
  const autor = document.getElementById("inp-autor").value.trim();
  const genero = document.getElementById("inp-genero").value;
  const raridade = document.getElementById("inp-raridade").value;
  const capa = document.getElementById("inp-capa").value.trim();
  const rep = document.getElementById("inp-rep").checked;

  if (!titulo) {
    toast(" coloca o título do livro!");
    return;
  }

  // REQUISITO 2: appendChild para jogar na tela
  const card = criarCard({ titulo, autor, genero, raridade, capa, rep });
  document.getElementById("grid").appendChild(card);

  salvar();
  atualizar();
  toast('"' + titulo + '" adicionado!');

  document.getElementById("inp-titulo").value = "";
  document.getElementById("inp-autor").value = "";
  document.getElementById("inp-capa").value = "";
  document.getElementById("inp-rep").checked = false;
  document.getElementById("inp-raridade").value = "1";
});

// REQUISITO 6: busca ninja em tempo real com display:none
document.getElementById("busca").addEventListener("input", function () {
  const t = this.value.toLowerCase();
  document.querySelectorAll(".book-card").forEach((c) => {
    c.style.display = c.dataset.titulo.toLowerCase().includes(t) ? "" : "none";
  });
});

// carregar do localStorage ao abrir a página
function carregar() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return;
  try {
    JSON.parse(raw).forEach((d) => {
      document.getElementById("grid").appendChild(criarCard(d));
    });
  } catch (e) {}
  atualizar();
}

atualizar();
carregar();
