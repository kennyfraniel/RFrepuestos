
document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.RF_CONFIG || {};
  const phone = cfg.phone || "5491165028573";
  const business = cfg.businessName || "RF Repuestos";

  const destacados = [
    { name: "Bomba de agua Dolz S320", image: "assets/img/products/bombadeaguafiat.jpg" },
    { name: "Bomba de agua Dolz C120", image: "assets/img/products/bombadeaguadolz.jpg" },
    { name: "Kit de faros auxiliares",  image: "assets/img/products/kitdefaros.jpg" }
  ];

  const grid = document.getElementById("featured-grid");
  if (!grid) return;

  destacados.forEach(prod => {
    const url = `https://wa.me/${phone}?text=${
      encodeURIComponent(`Hola ${business}, quiero comprar: ${prod.name}. ¿Precio y disponibilidad?`)
    }`;

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="media">
        <img src="${prod.image}" alt="${prod.name}" loading="lazy" decoding="async">
      </div>
      <div class="body">
        <h3>${prod.name}</h3>
        <a class="btn btn-primary" href="${url}" target="_blank" rel="noopener">Comprar por WhatsApp</a>
      </div>
    `;
    grid.appendChild(card);
  });
});
