// app.js — afișare produse și buton "Adaugă în coș"
const grid = document.getElementById("grid");

// încarcă produsele din baza de date
async function load() {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (!data.length) {
      grid.innerHTML =
        "<p style='text-align:center;color:#5e4040'>Nu există produse momentan.</p>";
      return;
    }

    grid.innerHTML = data
      .map(
        (p) => `
        <article class="card">
          <img src="${p.images[0] || '/assets/placeholder.jpg'}" alt="${p.name}">
          <div class="pad">
            <h3>${p.name}</h3>
            <p style="color:#5e4040;font-size:0.9rem;margin:4px 0 10px 0">
              Cod articol: ${p.articleNumber || "-"}
            </p>
            <div class="price">${p.price.toLocaleString("ro-RO")} lei</div>
            <button class="btn-add" data-id="${p._id}">Adaugă în coș</button>
          </div>
        </article>
      `
      )
      .join("");

    attachCartButtons();
  } catch (err) {
    console.error("Eroare la încărcarea produselor:", err);
    grid.innerHTML =
      "<p style='text-align:center;color:red'>Eroare la conectarea cu serverul.</p>";
  }
}

// funcție pentru adăugare în coș (localStorage)
function attachCartButtons() {
  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem("cart", JSON.stringify(cart));
        btn.textContent = "Adăugat ✓";
        btn.disabled = true;
        btn.style.background = "#8a6c2a";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", load);
