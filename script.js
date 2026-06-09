const raridadeClasses = {
  Comum: { faixa: "faixa-comum", texto: "r-comum" },
  Incomum: { faixa: "faixa-incomum", texto: "r-incomum" },
  Raro: { faixa: "faixa-raro", texto: "r-raro" },
  "Ultra Raro": { faixa: "faixa-ultrararo", texto: "r-ultrararo" },
  "Edicao Especial": { faixa: "faixa-edicao", texto: "r-edicao" },
};

function adicionarLivro() {
  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const imagem = document.getElementById("imagem").value.trim();
  const genero = document.getElementById("genero").value;
  const raridade = document.getElementById("raridade").value;
  const repetido = document.getElementById("repetido").value;

  if (!titulo) {
    alert("Coloca o titulo do livro!");
    return;
  }

  const colecao = document.getElementById("colecao");
  const vazio = colecao.querySelector(".vazio");
  if (vazio) vazio.remove();

  const card = document.createElement("div");
  card.className = "card";
  card.dataset.busca = (titulo + " " + autor).toLowerCase();
  card.dataset.repetido = repetido;

  // faixa de raridade
  const faixa = document.createElement("div");
  faixa.className =
    "faixa-raridade " + (raridadeClasses[raridade]?.faixa || "faixa-comum");
  card.appendChild(faixa);

  // botao deletar
  const btnDel = document.createElement("button");
  btnDel.className = "btn-del";
  btnDel.textContent = "X";
  btnDel.title = "Remover";
  btnDel.onclick = () => {
    card.remove();
    if (document.getElementById("colecao").children.length === 0) {
      document.getElementById("colecao").innerHTML =
        '<p class="vazio">Sua biblioteca esta vazia. Adicione um livro acima!</p>';
    }
    atualizarPlacar();
  };
  card.appendChild(btnDel);

  // capa
  const img = document.createElement("img");
  img.className = "card-capa";
  img.src = imagem || "https://via.placeholder.com/160x150?text=sem+capa";
  img.alt = titulo;
  img.onerror = () =>
    (img.src = "https://via.placeholder.com/160x150?text=sem+capa");
  card.appendChild(img);

  // corpo
  const corpo = document.createElement("div");
  corpo.className = "card-corpo";

  const tituloEl = document.createElement("p");
  tituloEl.className = "titulo";
  tituloEl.textContent = titulo;
  corpo.appendChild(tituloEl);

  if (autor) {
    const autorEl = document.createElement("p");
    autorEl.className = "autor";
    autorEl.textContent = autor;
    corpo.appendChild(autorEl);
  }

  if (genero) {
    const generoEl = document.createElement("p");
    generoEl.className = "genero";
    generoEl.textContent = genero;
    corpo.appendChild(generoEl);
  }

  // raridade
  const raridadeEl = document.createElement("span");
  raridadeEl.className =
    "raridade-texto " + (raridadeClasses[raridade]?.texto || "r-comum");
  raridadeEl.textContent = raridade;
  corpo.appendChild(raridadeEl);

  // badge repetido
  if (repetido === "sim") {
    const badge = document.createElement("div");
    badge.className = "badge-repetido";
    badge.textContent = "Repetido";
    corpo.appendChild(badge);
  }

  // botoes
  const btns = document.createElement("div");
  btns.className = "card-btns";

  const btnFav = document.createElement("button");
  btnFav.className = "btn-fav";
  btnFav.textContent = "Favorito";
  btnFav.onclick = () => {
    card.classList.toggle("favorito");
    btnFav.textContent = card.classList.contains("favorito")
      ? "Favoritado"
      : "Favorito";
    atualizarPlacar();
  };

  const btnTroca = document.createElement("button");
  btnTroca.className = "btn-troca";
  btnTroca.textContent = "Para Troca";
  btnTroca.onclick = () => {
    card.classList.toggle("troca");
    btnTroca.textContent = card.classList.contains("troca")
      ? "Para Troca!"
      : "Para Troca";
  };

  btns.appendChild(btnFav);
  btns.appendChild(btnTroca);
  corpo.appendChild(btns);
  card.appendChild(corpo);
  colecao.appendChild(card);

  // limpa form
  document.getElementById("titulo").value = "";
  document.getElementById("autor").value = "";
  document.getElementById("imagem").value = "";
  document.getElementById("genero").value = "";
  document.getElementById("raridade").value = "Comum";
  document.getElementById("repetido").value = "nao";

  atualizarPlacar();
}

function atualizarPlacar() {
  const cards = document.querySelectorAll(".card");
  const total = cards.length;
  const repetidos = [...cards].filter(
    (c) => c.dataset.repetido === "sim",
  ).length;
  const unicos = total - repetidos;
  const favs = [...cards].filter((c) =>
    c.classList.contains("favorito"),
  ).length;

  document.getElementById("total").textContent = total;
  document.getElementById("repetidos").textContent = repetidos;
  document.getElementById("unicos").textContent = unicos;
  document.getElementById("favoritos").textContent = favs;
}

function filtrar() {
  const busca = document.getElementById("busca").value.toLowerCase();
  document.querySelectorAll(".card").forEach((card) => {
    card.style.display = card.dataset.busca.includes(busca) ? "" : "none";
  });
}
