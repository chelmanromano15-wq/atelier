// app.js — afișare produse în pagina Stoc
const grid = document.getElementById("grid");

// încarcă lista de produse din backend
async function load() {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (!data.length) {
      grid.innerHTML = "<p style='text-align:center;color:#aaa'>Nu există produse momentan.</p>";
      return;
    }

    grid.innerHTML = data
      .map(
        (p) => `
        <article class="card">
          <div class="img-wrap">
            <img src="${p.images[0] || '/assets/placeholder.jpg'}" alt="${p.name}">
          </div>
          <div class="pad">
            <h3>${p.name}</h3>
            <p style="color:#888;font-size:0.9rem;margin:4px 0 10px 0">
              Cod articol: ${p.articleNumber || "-"}
            </p>
            <div class="price">${p.price.toLocaleString("ro-RO")} lei</div>
            <p style="color:#aaa;margin-top:8px;font-size:0.9rem">
              ${p.shortDesc || ""}
            </p>
          </div>
        </article>
      `
      )
      .join("");
  } catch (err) {
    console.error("Eroare la încărcarea produselor:", err);
    grid.innerHTML = "<p style='text-align:center;color:red'>Eroare la conectarea cu serverul.</p>";
  }
}

// adaugă efecte de hover la imagini
document.addEventListener("DOMContentLoaded", () => {
  load();

  const style = document.createElement("style");
  style.innerHTML = `
    .img-wrap {
      overflow:hidden;
      height:320px;
    }
    .img-wrap img {
      width:100%;
      height:100%;
      object-fit:cover;
      transition: transform 0.4s ease;
    }
    .img-wrap:hover img {
      transform: scale(1.06);
    }
  `;
  document.head.appendChild(style);
});
