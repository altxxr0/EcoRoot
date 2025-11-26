// Footer interactions: add minimal functions so every footer link does something useful
(function(){
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  function smoothScrollTo(selector){
    const el = qs(selector);
    if(!el){ return false; }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  function openPlaceholderModal(title, body){
    let modal = qs('#footerModal');
    if(!modal){
      modal = document.createElement('div');
      modal.id = 'footerModal';
      modal.style.position = 'fixed';
      modal.style.inset = '0';
      modal.style.background = 'rgba(0,0,0,0.5)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '9999';
      const card = document.createElement('div');
      card.style.background = '#fff';
      card.style.borderRadius = '12px';
      card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
      card.style.maxWidth = '520px';
      card.style.width = '90%';
      card.style.padding = '20px';
      const h = document.createElement('h3');
      h.id = 'footerModalTitle';
      const p = document.createElement('p');
      p.id = 'footerModalBody';
      const close = document.createElement('button');
      close.textContent = 'Close';
      close.style.marginTop = '12px';
      close.onclick = () => modal.remove();
      card.appendChild(h);
      card.appendChild(p);
      card.appendChild(close);
      modal.appendChild(card);
      document.body.appendChild(modal);
    }
    qs('#footerModalTitle').textContent = title;
    qs('#footerModalBody').textContent = body;
  }

  // Map footer links to actions
  const actions = {
    'Research Papers': () => openPlaceholderModal('Research Papers', 'Curated studies and reports—coming soon.'),
    'Educational Resources': () => smoothScrollTo('#causes') || openPlaceholderModal('Educational Resources', 'Explore causes and effects on this page.'),
    'FAQ': () => openPlaceholderModal('FAQ', 'Frequently asked questions—content coming soon.'),

    'Volunteer': () => openPlaceholderModal('Volunteer', 'Join local cleanup and restoration efforts.'),
    'Donate': () => openPlaceholderModal('Donate', 'Support trusted soil restoration programs.'),
    'Partner With Us': () => openPlaceholderModal('Partner With Us', 'Organizations and schools—reach out to collaborate.'),

    'Newsletter': () => openPlaceholderModal('Newsletter', 'Get monthly updates. Subscription form coming soon.'),
    'Social Media': () => openPlaceholderModal('Social Media', 'Follow EcoRoot across platforms. Links coming soon.'),
    'Contact': () => openPlaceholderModal('Contact', 'Email us at contact@ecoroot.example')
  };

  qsa('.site-footer .footer-links a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const label = a.textContent.trim();
      const act = actions[label];
      if(act){ act(); }
    });
  });

  // Footer banner image click: scroll to top
  const banner = qs('#siteFooterImage');
  if(banner){
    banner.style.cursor = 'pointer';
    banner.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();
