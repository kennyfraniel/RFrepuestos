document.addEventListener("DOMContentLoaded", () => {
  const destacados = [
    {
      name: "Bomba de agua Dolz S320",
      price: 85990,
      image: "assets/img/products/bombadeaguafiat.jpg"
    },
    {
      name: "Bomba de agua Dolz C120",
      price: 9990,
      image: "assets/img/products/bombadeaguadolz.jpg"
    },
    {
      name: "Kit de faros auxiliares",
      price: 21990,
      image: "assets/img/products/kitdefaros.jpg"
    }
  ];

  const grid = document.getElementById("featured-grid");
  destacados.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}">
      <h3>${prod.name}</h3>
      <p class="price">$${prod.price.toLocaleString("es-AR")}</p>
      <a class="btn btn-primary" 
         href="https://wa.me/5491165028573?text=Hola%20quiero%20comprar:%20${encodeURIComponent(prod.name)}"
         target="_blank" rel="noopener">
         Comprar por WhatsApp
      </a>
    `;
    grid.appendChild(card);
  });
});
