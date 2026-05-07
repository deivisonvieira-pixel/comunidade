/* Engage tweaks panel — paleta, tipografia, densidade, variações */

const { useState, useEffect } = React;

const DEFAULTS = window.__ENGAGE_TWEAKS;

// Initial visibility of variant slides
function applyVariants(t) {
  // Cover variants
  document.querySelectorAll('section[data-variant^="cover-"]').forEach(s => {
    const v = s.getAttribute('data-variant').split('-')[1];
    const active = (v === t.coverVariant);
    s.style.display = active ? '' : 'none';
    if (active) s.removeAttribute('data-deck-skip');
    else s.setAttribute('data-deck-skip', '');
  });
  // Cases variants
  document.querySelectorAll('section[data-variant^="cases-"]').forEach(s => {
    const v = s.getAttribute('data-variant').split('-')[1];
    const active = (v === t.casesVariant);
    s.style.display = active ? '' : 'none';
    if (active) s.removeAttribute('data-deck-skip');
    else s.setAttribute('data-deck-skip', '');
  });
  // Invest variants
  document.querySelectorAll('section[data-variant^="invest-"]').forEach(s => {
    const v = s.getAttribute('data-variant').split('-')[1];
    const active = (v === t.investVariant);
    s.style.display = active ? '' : 'none';
    if (active) s.removeAttribute('data-deck-skip');
    else s.setAttribute('data-deck-skip', '');
  });
  // Notify deck-stage
  const stage = document.querySelector('deck-stage');
  if (stage && typeof stage._renderRail === 'function') {
    try { stage._renderRail(); } catch(e) {}
  }
  window.dispatchEvent(new Event('resize'));
}

function applyColors(t) {
  const r = document.documentElement;
  r.style.setProperty('--primary', t.primary);
  r.style.setProperty('--accent', t.accent);
  r.style.setProperty('--primary-bright', t.primaryBright);
}

function applyFont(t) {
  document.documentElement.style.setProperty('--font-sans',
    `"${t.fontHeading}", "Inter", system-ui, sans-serif`);
  // ensure font is loaded
  if (!document.querySelector(`link[data-font="${t.fontHeading}"]`)) {
    const map = {
      'Inter': 'Inter:wght@300;400;500;600;700',
      'Geist': 'Geist:wght@300;400;500;600;700',
      'Manrope': 'Manrope:wght@300;400;500;600;700',
      'Space Grotesk': 'Space+Grotesk:wght@300;400;500;600;700',
      'IBM Plex Sans': 'IBM+Plex+Sans:wght@300;400;500;600;700'
    };
    if (map[t.fontHeading]) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = `https://fonts.googleapis.com/css2?family=${map[t.fontHeading]}&display=swap`;
      l.setAttribute('data-font', t.fontHeading);
      document.head.appendChild(l);
    }
  }
}

function applyDensity(t) {
  document.body.setAttribute('data-density', t.density);
}

function applyChrome(t) {
  document.querySelectorAll('.slide-chrome').forEach(el => {
    el.style.display = t.showChrome ? '' : 'none';
  });
}

function applyAll(t) {
  applyColors(t);
  applyFont(t);
  applyDensity(t);
  applyChrome(t);
  applyVariants(t);
}

function EngagePanel() {
  const [t, setTweak] = useTweaks(DEFAULTS);

  useEffect(() => {
    applyAll(t);
  }, [t]);

  const palettes = [
    ['#7B2FBE', '#E040A0', '#A06AFF'],
    ['#5B21B6', '#EC4899', '#8B5CF6'],
    ['#9333EA', '#F472B6', '#C084FC'],
    ['#4C1D95', '#DB2777', '#7E22CE']
  ];

  return (
    <TweaksPanel title="Tweaks · Engage">
      <TweakSection label="Paleta">
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          {palettes.map((p, i) => {
            const active = p[0] === t.primary;
            return (
              <button
                key={i}
                onClick={() => setTweak({primary: p[0], accent: p[1], primaryBright: p[2]})}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 8,
                  border: active ? '1px solid #fff' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 6,
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#fff',
                  fontFamily: 'inherit'
                }}>
                <span style={{width: 28, height: 28, background: p[0], borderRadius: 4}}></span>
                <span style={{width: 28, height: 28, background: p[1], borderRadius: 4}}></span>
                <span style={{width: 28, height: 28, background: p[2], borderRadius: 4}}></span>
                <span style={{marginLeft: 'auto', fontSize: 11, opacity: 0.6, fontFamily: 'monospace'}}>
                  {active ? 'ATIVA' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </TweakSection>

      <TweakSection label="Tipografia">
        <TweakSelect
          label="Fonte de títulos"
          value={t.fontHeading}
          onChange={v => setTweak('fontHeading', v)}
          options={['Inter', 'Manrope', 'Space Grotesk', 'IBM Plex Sans']}
        />
      </TweakSection>

      <TweakSection label="Densidade">
        <TweakRadio
          label="Espaçamento"
          value={t.density}
          onChange={v => setTweak('density', v)}
          options={['compact', 'default', 'airy']}
        />
      </TweakSection>

      <TweakSection label="Variações de slide">
        <TweakSelect
          label="Capa (slide 1)"
          value={t.coverVariant}
          onChange={v => setTweak('coverVariant', v)}
          options={[
            { value: 'A', label: 'A · Glow + frase' },
            { value: 'B', label: 'B · Editorial 7×' },
            { value: 'C', label: 'C · Tipo gigante' }
          ]}
        />
        <TweakSelect
          label="Cases (slide 10)"
          value={t.casesVariant}
          onChange={v => setTweak('casesVariant', v)}
          options={[
            { value: 'A', label: 'A · Três cards' },
            { value: 'B', label: 'B · Lista horizontal' }
          ]}
        />
        <TweakSelect
          label="Investimento (slide 12)"
          value={t.investVariant}
          onChange={v => setTweak('investVariant', v)}
          options={[
            { value: 'A', label: 'A · Tabela' },
            { value: 'B', label: 'B · Três cards' }
          ]}
        />
      </TweakSection>

      <TweakSection label="Chrome">
        <TweakToggle
          label="Mostrar marca + paginação"
          value={t.showChrome}
          onChange={v => setTweak('showChrome', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// Apply defaults immediately, before mounting panel
applyAll(DEFAULTS);

// Mount panel into shadow-less host div
const panelHost = document.createElement('div');
panelHost.id = 'engage-tweaks-host';
document.body.appendChild(panelHost);
ReactDOM.createRoot(panelHost).render(<EngagePanel />);
