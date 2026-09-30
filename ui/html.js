// View helpers. React and htm are UMD globals loaded by index.html.
export const html = window.htm.bind(window.React.createElement);
export const { useState, useEffect, useRef } = window.React;

/**
 * Paint the page background behind the app (overscroll, iOS bounce) with the app's colour,
 * and keep it in step with the light/dark scheme.
 * @param {{ current: HTMLElement | null }} ref
 */
export function useShellBackground(ref) {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.background;
    const apply = () => {
      if (ref.current) root.style.background = getComputedStyle(ref.current).backgroundColor;
    };
    apply();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    const mo = new MutationObserver(apply);
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mq.removeEventListener('change', apply);
      mo.disconnect();
      root.style.background = prev;
    };
  }, [ref]);
}

/** A real checkbox, styled as a ring by ring.css. @param {{label: string, checked: boolean, onChange: () => void, text: string}} p */
export function Tick({ label, checked, onChange, text }) {
  return html`<label class="tick">
    <input type="checkbox" checked=${checked} onChange=${onChange} aria-label=${label} />
    <span aria-hidden="true">${text}</span>
  </label>`;
}
