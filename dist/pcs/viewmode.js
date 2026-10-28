// Sceglie tra vista classica (desktop) e vista mobile dei talenti e della pagina principale.
// - Senza preferenza, tablet e smartphone usano la vista mobile e il resto la vista classica.
// - Il pulsante di cambio vista (presente su ogni pagina) salva la preferenza nel localStorage:
//   da quel momento vale su tutte le pagine e su questo dispositivo.
// - ?view=classic|mobile nell'indirizzo ha la precedenza e diventa la nuova preferenza.
(function () {
  const KEY = 'atlas_view';
  const CHARACTERS = ['erevan', 'fedra', 'hesperia', 'narkran', 'raziel', 'yvette'];
  const params = new URLSearchParams(location.search);
  const page = location.pathname.split('/').pop().replace(/\.html$/, '');
  const isMobilePage = page === 'mobile';
  const isIndex = !isMobilePage && !CHARACTERS.includes(page);
  const character = isMobilePage ? params.get('c') : (isIndex ? null : page);

  function isTouchDevice() {
    if (window.matchMedia('(pointer: coarse) and (hover: none)').matches) return true;
    // iPadOS si presenta come Mac
    return navigator.maxTouchPoints > 1 && /Android|iPhone|iPad|Mobile|MacIntel/i.test(navigator.userAgent + navigator.platform);
  }

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function remember(view) {
    try { localStorage.setItem(KEY, view); } catch (e) { /* storage non disponibile */ }
  }

  // ?view=... nell'indirizzo ha la precedenza e diventa la nuova preferenza
  const forced = params.get('view');
  if (forced === 'classic' || forced === 'mobile') remember(forced);

  const narrowScreen = window.matchMedia('(max-width: 900px), (orientation: portrait)');

  // La pagina principale era gia' adattabile con la larghezza dello schermo: resta il comportamento predefinito
  function currentView() {
    const saved = stored() || forced;
    if (saved === 'classic' || saved === 'mobile') return saved;
    if (isIndex) return isTouchDevice() || narrowScreen.matches ? 'mobile' : 'classic';
    return isTouchDevice() ? 'mobile' : 'classic';
  }

  const classicUrl = `./${character}.html?view=classic`;
  const mobileUrl = `./mobile.html?c=${character}&view=mobile`;

  window.ViewMode = {
    isTouchDevice,
    character,
    switchTo(view) {
      remember(view);
      location.href = view === 'mobile' ? mobileUrl : classicUrl;
    }
  };

  if (character) {
    if (isMobilePage && currentView() === 'classic') location.replace(classicUrl);
    else if (!isMobilePage && currentView() === 'mobile') location.replace(mobileUrl);
  }

  // ---- pulsante di cambio vista, nello stile del sito

  const ICON = {
    mobile: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
    classic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>'
  };
  const LABEL = { mobile: 'Vista mobile', classic: 'Vista classica' };

  function addToggleStyle() {
    const style = document.createElement('style');
    style.textContent = `
      #view-toggle {
        position: fixed; top: 10px; right: 14px; z-index: 200;
        display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; padding: 0;
        background: rgba(19, 23, 27, 0.88); color: #fff;
        border: 1px solid rgba(206, 176, 91, 0.55); border-radius: 999px;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
        cursor: inherit; transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      #view-toggle:hover { border-color: rgba(255, 252, 60, 0.85); box-shadow: 0 0 14px rgba(255, 252, 60, 0.35); }
      #view-toggle svg { width: 22px; height: 22px; filter: drop-shadow(1px 1px 2px #000); fill: none; stroke: currentColor; stroke-width: 1.6;
        stroke-linecap: round; stroke-linejoin: round; }
    `;
    document.head.appendChild(style);
  }

  // Il pulsante mostra la vista verso cui si passa; restituisce la funzione per aggiornarlo
  function addToggle(target, onClick) {
    const btn = document.createElement('button');
    btn.id = 'view-toggle';
    document.body.appendChild(btn);
    const show = (view) => {
      btn.innerHTML = ICON[view];
      btn.title = 'Passa a: ' + LABEL[view].toLowerCase();
      btn.setAttribute('aria-label', btn.title);
      btn.onclick = () => onClick(view);
    };
    show(target);
    return show;
  }

  if (isIndex) {
    // Sulla pagina principale la vista e' una classe su <html> (vedi ccstyle.css): il cambio e' immediato
    const root = document.documentElement;
    const apply = () => root.classList.toggle('view-mobile', currentView() === 'mobile');
    apply(); // subito, per evitare il lampo del layout sbagliato
    narrowScreen.addEventListener('change', apply);
    document.addEventListener('DOMContentLoaded', () => {
      addToggleStyle();
      const other = (view) => (view === 'mobile' ? 'classic' : 'mobile');
      const show = addToggle(other(currentView()), (view) => {
        remember(view);
        apply();
        show(other(view));
      });
    });
  } else if (!isMobilePage) {
    document.addEventListener('DOMContentLoaded', () => {
      addToggleStyle();
      addToggle('mobile', (view) => window.ViewMode.switchTo(view));
    });
  }
})();
