import { createContext, useContext, useEffect, useLayoutEffect } from 'react';

/* useLayoutEffect on the client so the header inverts before first paint (no
   dark-on-dark flash on hard load); falls back to useEffect where there is no
   DOM (SSR/prerender) to avoid the React warning. */
const useIsoLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect;

/* =============================================================================
   Dark-hero signalling. A page whose first screen is a full-bleed obsidian hero
   (sitting under the transparent header) calls `useDarkHero()`; the SiteHeader
   reads the context and inverts to white-on-transparent until the user scrolls.
   Content-driven on purpose — new dark pages never need a header edit, and the
   flag resets itself on unmount so light pages stay light.
   ============================================================================= */

type DarkHeroCtx = {
  darkHero: boolean;
  setDarkHero: (v: boolean) => void;
};

export const DarkHeroContext = createContext<DarkHeroCtx>({
  darkHero: false,
  setDarkHero: () => {},
});

/** Declare that this page leads with a full-bleed dark hero. */
export function useDarkHero() {
  const { setDarkHero } = useContext(DarkHeroContext);
  useIsoLayoutEffect(() => {
    setDarkHero(true);
    return () => setDarkHero(false);
  }, [setDarkHero]);
}
