// Lógica del catálogo + WhatsApp per-producto
(function(){
  const cfg = window.RF_CONFIG || { phone: '54911XXXXXXX', businessName: 'RF Repuestos' };
  const WA_BASE = 'https://wa.me/';
  const brandLabels = { RENAULT:'Renault', FIAT:'Fiat', CITROEN:'Citroën', PEUGEOT:'Peugeot' };
  const currency = new Intl.NumberFormat('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:0 });

  // Elementos (solo si existen en la página)
  const grid = document.querySelector('#products-grid');
  const featuredGrid = document.querySelector('#featured-grid');
  const countEl = document.querySelector('#results-count');
  const searchInput = document.querySelector('#q');
  const sortSel = document.querySelector('#sort');
  const brandChecks = Array.from(document.querySelectorAll('input[name="brand"]'));

  let ALL = [];
  let VIEW = [];

  async function loadProducts(){
    try{
      const res = await fetch('assets/data/products.json', { cache: 'no-store' });
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }catch(err){
      console.warn('No se pudo leer products.json, usando datos de ejemplo.', err);
      return fallbackProducts();
    }
  }

  function fallbackProducts(){
    return [
      { id:'TEST-001', sku:'TEST-001', name:'Producto de prueba', brand:'RENAULT', model:'Genérico', years:'2010–2025', price:12345, image:'', stock:true, createdAt:'2025-08-30' }
    ];
  }

  function matchesQuery(p, q){
    if (!q) return true;
    const txt = `${p.name} ${p.brand} ${p.model} ${p.sku}`.toLowerCase();
    return txt.includes(q.toLowerCase());
  }

  function formatPrice(n){ return currency.format(n); }

  function sortItems(arr, mode){
    const byDate = (a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0);
    const byName = (a,b) => a.name.localeCompare(b.name, 'es');
    const byPriceAsc = (a,b) => a.price - b.price;
    const byPriceDesc = (a,b) => b.price - a.price;
    const copy = [...arr];
    switch(mode){
      case 'price-asc': return copy.sort(byPriceAsc);
      case 'price-desc': return copy.sort(byPriceDesc);
      case 'name-asc': return copy.sort(byName);
      case 'name-desc': return copy.sort((a,b)=>byName(b,a));
      case 'newest':
      default: return copy.sort(byDate);
    }
  }

  function waLink(p){
  const phone = cfg.phone || '54911XXXXXXX';
  const business = cfg.businessName || 'RF Repuestos';
  const brandText = brandLabels[p.brand] || p.brand;
  const text = encodeURIComponent(
    `Hola ${business}, quiero comprar:\n`+
    `• ${p.name} (${p.sku})\n`+
    `• Marca/Modelo: ${brandText} – ${p.model} (${p.years})\n`+
    `¿Me pasás precio y disponibilidad?`
  );
  return `https://wa.me/${phone}?text=${text}`;
}
  function productCard(p){
    const brandText = brandLabels[p.brand] || p.brand;
    const hasImg = p.image && p.image.trim().length > 0;
    return `
      <article class="card" data-id="${p.id}">
        <div class="card-media">
          ${hasImg ? `<img src="${p.image}" alt="${p.name}">` : `<span class="muted">Sin imagen</span>`}
        </div>
        <div class="card-body">
          <span class="badge">${brandText}</span>
          <h3 class="card-title">${p.name}</h3>
          <p class="card-sub">${p.model} · ${p.years}</p>
            <!-- (precio eliminado) -->
          <div class="card-actions">
            <a class="btn btn-primary" target="_blank" rel="noopener" href="${waLink(p)}">Consultar por WhatsApp</a>
            <a class="btn btn-outline" href="#" data-copy>Copiar datos</a>
          </div>
        </div>
      </article>`;
  }

  function render(list, mountSel){
    const mount = document.querySelector(mountSel || '#products-grid');
    if (!mount) return;
    mount.innerHTML = list.map(productCard).join('');
    mount.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = e.currentTarget.closest('.card');
        const id = card?.getAttribute('data-id');
        const p = list.find(x => x.id === id);
        if (p){
          const text = `${p.name} (${p.sku}) - ${(brandLabels[p.brand]||p.brand)} ${p.model} ${p.years}`;
          navigator.clipboard.writeText(text).then(()=>{
            e.currentTarget.textContent = '¡Copiado!';
            setTimeout(()=> e.currentTarget.textContent = 'Copiar datos', 1200);
          });
        }
      });
    });
  }

  function applyFilters(){
    const q = (searchInput?.value || '').trim();
    const activeBrands = brandChecks.length ? brandChecks.filter(c => c.checked).map(c=>c.value) : ['RENAULT','FIAT','CITROEN','PEUGEOT'];
    const filtered = ALL.filter(p => activeBrands.includes(p.brand)).filter(p => matchesQuery(p, q));
    const sorted = sortItems(filtered, sortSel?.value || 'newest');
    VIEW = sorted;
    if (grid){
      render(sorted, '#products-grid');
      if (countEl) countEl.textContent = `Mostrando ${sorted.length} producto${sorted.length!==1?'s':''}`;
    }
  }

  async function init(){
    ALL = await loadProducts();
    // Home: destacados
    if (featuredGrid && ALL.length){
      const top = sortItems(ALL, 'newest').slice(0, 6);
      featuredGrid.innerHTML = top.map(productCard).join('');
    }
    // Catálogo: listeners
    if (grid){
      [searchInput, sortSel, ...brandChecks].forEach(el => {
        if (!el) return;
        el.addEventListener('input', applyFilters);
        el.addEventListener('change', applyFilters);
      });
      applyFilters();
    }
    // Flotante WA
    const float = document.getElementById('wa-float');
    if (float){
      const url = `${WA_BASE}${(cfg.phone||'54911XXXXXXX')}?text=${encodeURIComponent('Hola '+(cfg.businessName||'RF Repuestos'))}`;
      float.href = url;
    }
  }

  // API mínima para index
  window.renderFeatured = function(mountSel, n=6){
    const target = document.querySelector(mountSel);
    if (!target) return;
    (async ()=>{
      const data = ALL.length ? ALL : await loadProducts();
      const list = sortItems(data, 'newest').slice(0, n);
      target.innerHTML = list.map(productCard).join('');
    })();
  };

  window.addEventListener('DOMContentLoaded', init);
})();



