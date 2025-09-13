// wa-init.js
// Inyecta el link de WhatsApp en tus botones usando window.RF_CONFIG

(function () {
  function initWA() {
    const cfg = window.RF_CONFIG || {};
    const raw = String(cfg.phone || '').replace(/\D/g, ''); // sólo dígitos
    const valid = /^\d{11,15}$/.test(raw); // ej AR: 5491165028573 (13 dígitos)

    if (!valid) {
      console.error(
        '[RF] RF_CONFIG.phone inválido. Usá formato internacional sin "+", espacios ni guiones. Ej: 5491165028573'
      );
      return;
    }

    const business = cfg.businessName || 'RF Repuestos';
    const defaultMsg =
      `Hola ${business}, vengo de la web y quiero consultar por un repuesto!`;

    // Targets: cualquier <a> con data-wa + IDs específicos
    const nodeSet = new Set([
      ...document.querySelectorAll('[data-wa]'),
      document.getElementById('cta-whatsapp-hero'),
    ].filter(Boolean));

    nodeSet.forEach((a) => {
      // Permití mensaje por botón con data-wa-msg
      const msg = a.getAttribute('data-wa-msg') || defaultMsg;
      const href = `https://wa.me/${raw}?text=${encodeURIComponent(msg)}`;

      a.setAttribute('href', href);
      if (!a.hasAttribute('target')) a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });

    // (Opcional) Mostrar el número formateado en elementos con [data-wa-number]
    document.querySelectorAll('[data-wa-number]').forEach(el => {
      // Formateo simple AR: +54 9 11 6502-8573
      const pretty = raw.replace(/^(\d{2})(\d)(\d{2})(\d{4})(\d{4})$/, '+$1 $2 $3 $4-$5');
      el.textContent = pretty || raw;
    });
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWA, { once: true });
  } else {
    initWA();
  }
})();
